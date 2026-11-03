import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  AI_AGENT_OPTIONS,
  enforceRateLimit,
  getAgentVotes,
  hashReactionId,
  isSameOriginRequest,
  toggleAgentVote,
} from "@/lib/public-engagement";

export const runtime = "nodejs";

const COOKIE_NAME = "rynster_vote_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function getOrCreateVoteId(request: NextRequest) {
  const current = request.cookies.get(COOKIE_NAME)?.value;
  if (current && /^[A-Za-z0-9_-]{40,50}$/.test(current)) return { id: current, isNew: false };
  return { id: randomBytes(32).toString("base64url"), isNew: true };
}

function responseWithCookie(body: object, id: string, isNew: boolean, status = 200) {
  const response = NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
  if (isNew) {
    response.cookies.set(COOKIE_NAME, id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
  }
  return response;
}

export async function GET(request: NextRequest) {
  const { id, isNew } = getOrCreateVoteId(request);
  try {
    const voterHash = hashReactionId(id);
    const votes = await getAgentVotes(voterHash);
    return responseWithCookie({ success: true, options: AI_AGENT_OPTIONS, votes }, id, isNew);
  } catch {
    return responseWithCookie({ success: false, message: "Votes are temporarily unavailable." }, id, isNew, 503);
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ success: false, message: "Invalid request origin." }, { status: 403 });
  }

  const { id, isNew } = getOrCreateVoteId(request);
  const voterHash = hashReactionId(id);

  try {
    if (!await enforceRateLimit(request, "rynster:agent-vote-rate", 30, 60 * 60)) {
      return responseWithCookie({ success: false, message: "Please wait before voting again." }, id, isNew, 429);
    }

    const body = await request.json().catch(() => ({}));
    const agentId = typeof body.agentId === "string" ? body.agentId : "";
    if (!agentId || !AI_AGENT_OPTIONS.some(a => a.id === agentId)) {
      return responseWithCookie({ success: false, message: "Invalid agent selection." }, id, isNew, 400);
    }

    const result = await toggleAgentVote(voterHash, agentId);
    return responseWithCookie({ success: true, agentId, ...result }, id, isNew);
  } catch {
    return responseWithCookie({ success: false, message: "Failed to record vote. Please try again." }, id, isNew, 500);
  }
}
