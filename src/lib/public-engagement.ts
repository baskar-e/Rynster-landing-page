import { createHash, createHmac } from "node:crypto";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

export { AI_AGENT_OPTIONS } from "./agent-options";
export type { AIAgentOption } from "./agent-options";
import { AI_AGENT_OPTIONS } from "./agent-options";

const REACTION_COUNT_KEY = "rynster:home:reactions:count";
const REACTION_VOTERS_KEY = "rynster:home:reactions:voters";
const reactionVoters = new Set<string>();
const localLimits = new Map<string, { count: number; expiresAt: number }>();
const localAgentVotes = new Map<string, { count: number; voters: Set<string> }>();
let localReactionCount = 0;
let redisClient: Redis | null = null;

const addReactionScript = `
  local added = redis.call("SADD", KEYS[1], ARGV[1])
  if added == 1 then
    return redis.call("INCR", KEYS[2])
  end
  return tonumber(redis.call("GET", KEYS[2]) or "0")
`;

const toggleVoteScript = `
  local is_member = redis.call("SISMEMBER", KEYS[1], ARGV[1])
  if is_member == 1 then
    redis.call("SREM", KEYS[1], ARGV[1])
    local count = redis.call("DECR", KEYS[2])
    return { tonumber(count), 0 }
  else
    redis.call("SADD", KEYS[1], ARGV[1])
    local count = redis.call("INCR", KEYS[2])
    return { tonumber(count), 1 }
  end
`;

const fixedWindowScript = `
  local count = redis.call("INCR", KEYS[1])
  if count == 1 then redis.call("EXPIRE", KEYS[1], ARGV[1]) end
  return count
`;

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    if (process.env.NODE_ENV === "production") throw new Error("Upstash Redis is not configured.");
    return null;
  }
  return (redisClient ??= Redis.fromEnv());
}

export function hashReactionId(id: string) {
  return createHash("sha256").update(id).digest("hex");
}

export function isSameOriginRequest(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function getReactionState(voterHash: string) {
  const redis = getRedis();
  if (!redis) return { count: localReactionCount, reacted: reactionVoters.has(voterHash) };
  const [count, reacted] = await Promise.all([
    redis.get<number>(REACTION_COUNT_KEY),
    redis.sismember(REACTION_VOTERS_KEY, voterHash),
  ]);
  return { count: Number(count ?? 0), reacted: reacted === 1 };
}

export async function addReaction(voterHash: string) {
  const redis = getRedis();
  if (!redis) {
    if (!reactionVoters.has(voterHash)) {
      reactionVoters.add(voterHash);
      localReactionCount += 1;
    }
    return { count: localReactionCount, reacted: true };
  }
  const count = await redis.eval(addReactionScript, [REACTION_VOTERS_KEY, REACTION_COUNT_KEY], [voterHash]);
  return { count: Number(count), reacted: true };
}

function getLocalAgentState(agentId: string, baseVotes: number) {
  let state = localAgentVotes.get(agentId);
  if (!state) {
    state = { count: baseVotes, voters: new Set<string>() };
    localAgentVotes.set(agentId, state);
  }
  return state;
}

export async function getAgentVotes(voterHash: string) {
  const redis = getRedis();
  const results: Record<string, { count: number; voted: boolean }> = {};

  if (!redis) {
    for (const agent of AI_AGENT_OPTIONS) {
      const state = getLocalAgentState(agent.id, agent.baseVotes);
      results[agent.id] = {
        count: state.count,
        voted: state.voters.has(voterHash),
      };
    }
    return results;
  }

  const pipeline = redis.pipeline();
  for (const agent of AI_AGENT_OPTIONS) {
    pipeline.get<number>(`rynster:votes:agent:${agent.id}:count`);
    pipeline.sismember(`rynster:votes:agent:${agent.id}:voters`, voterHash);
  }
  const responses = (await pipeline.exec()) as (number | null)[];

  for (let i = 0; i < AI_AGENT_OPTIONS.length; i++) {
    const agent = AI_AGENT_OPTIONS[i];
    const rawCount = responses[i * 2];
    const rawVoted = responses[i * 2 + 1];
    const count = rawCount === null || rawCount === undefined ? agent.baseVotes : Number(rawCount);
    results[agent.id] = {
      count,
      voted: rawVoted === 1,
    };
  }
  return results;
}

export async function toggleAgentVote(voterHash: string, agentId: string) {
  const agent = AI_AGENT_OPTIONS.find(a => a.id === agentId);
  if (!agent) throw new Error("Invalid agent ID.");

  const redis = getRedis();
  if (!redis) {
    const state = getLocalAgentState(agent.id, agent.baseVotes);
    let voted: boolean;
    if (state.voters.has(voterHash)) {
      state.voters.delete(voterHash);
      state.count = Math.max(0, state.count - 1);
      voted = false;
    } else {
      state.voters.add(voterHash);
      state.count += 1;
      voted = true;
    }
    return { count: state.count, voted };
  }

  const votersKey = `rynster:votes:agent:${agent.id}:voters`;
  const countKey = `rynster:votes:agent:${agent.id}:count`;

  const exists = await redis.exists(countKey);
  if (!exists) {
    await redis.set(countKey, agent.baseVotes);
  }

  const result = (await redis.eval(
    toggleVoteScript,
    [votersKey, countKey],
    [voterHash]
  )) as [number, number];

  return { count: Number(result[0]), voted: result[1] === 1 };
}

export async function enforceRateLimit(request: NextRequest, scope: string, max: number, windowSeconds: number) {
  const rawIp = request.headers.get("x-real-ip")
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
  const salt = process.env.UPSTASH_REDIS_REST_TOKEN || "rynster-local-development";
  const ipHash = createHmac("sha256", salt).update(rawIp).digest("hex");
  const now = Date.now();
  const bucket = Math.floor(now / (windowSeconds * 1000));
  const key = `${scope}:${bucket}:${ipHash}`;
  const redis = getRedis();

  if (!redis) {
    const current = localLimits.get(key);
    if (localLimits.size > 1000) {
      for (const [storedKey, value] of localLimits) if (value.expiresAt <= now) localLimits.delete(storedKey);
    }
    const next = { count: (current?.count ?? 0) + 1, expiresAt: (bucket + 1) * windowSeconds * 1000 };
    localLimits.set(key, next);
    return next.count <= max;
  }

  const count = await redis.eval(fixedWindowScript, [key], [windowSeconds]);
  return Number(count) <= max;
}
