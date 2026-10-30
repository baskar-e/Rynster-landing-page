import { createHash, createHmac } from "node:crypto";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

const REACTION_COUNT_KEY = "rynster:home:reactions:count";
const REACTION_VOTERS_KEY = "rynster:home:reactions:voters";
const reactionVoters = new Set<string>();
const localLimits = new Map<string, { count: number; expiresAt: number }>();
let localReactionCount = 0;
let redisClient: Redis | null = null;

const addReactionScript = `
  local added = redis.call("SADD", KEYS[1], ARGV[1])
  if added == 1 then
    return redis.call("INCR", KEYS[2])
  end
  return tonumber(redis.call("GET", KEYS[2]) or "0")
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
