import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { addReaction, enforceRateLimit, getReactionState, hashReactionId, isSameOriginRequest } from "@/lib/public-engagement";

export const runtime = "nodejs";

const COOKIE_NAME = "rynster_reaction_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function getOrCreateReactionId(request: NextRequest) {
  const current = request.cookies.get(COOKIE_NAME)?.value;
  if (current && /^[A-Za-z0-9_-]{40,50}$/.test(current)) return { id: current, isNew: false };
  return { id: randomBytes(32).toString("base64url"), isNew: true };
}

function responseWithCookie(body: object, id: string, isNew: boolean, status = 200) {
  const response = NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
  if (isNew) response.cookies.set(COOKIE_NAME, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return response;
}

export async function GET(request: NextRequest) {
  const { id, isNew } = getOrCreateReactionId(request);
  try {
    const state = await getReactionState(hashReactionId(id));
    return responseWithCookie(state, id, isNew);
  } catch {
    return responseWithCookie({ message: "Reactions are temporarily unavailable." }, id, isNew, 503);
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  const { id, isNew } = getOrCreateReactionId(request);
  try {
    if (!await enforceRateLimit(request, "rynster:reaction-rate", 30, 60 * 60)) {
      return responseWithCookie({ message: "Please wait before reacting again." }, id, isNew, 429);
    }
    const state = await addReaction(hashReactionId(id));
    return responseWithCookie(state, id, isNew);
  } catch {
    return responseWithCookie({ message: "Reactions are temporarily unavailable." }, id, isNew, 503);
  }
}
