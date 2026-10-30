import { NextRequest, NextResponse } from "next/server";
import { enforceRateLimit, isSameOriginRequest } from "@/lib/public-engagement";

export const runtime = "nodejs";
const MAX_BODY = 4_000;

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return NextResponse.json({ message: "Expected a JSON request." }, { status: 415 });
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  }
  const length = Number(request.headers.get("content-length") || 0);
  if (length > MAX_BODY) return NextResponse.json({ message: "Message is too large." }, { status: 413 });

  let data: Record<string, unknown>;
  try {
    if (!request.body) return NextResponse.json({ message: "Invalid request." }, { status: 400 });
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BODY) {
        await reader.cancel();
        return NextResponse.json({ message: "Message is too large." }, { status: 413 });
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    data = JSON.parse(new TextDecoder().decode(bytes));
    if (!data || Array.isArray(data) || typeof data !== "object") throw new Error("Expected an object.");
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  try {
    if (!await enforceRateLimit(request, "rynster:feedback-rate", 5, 60 * 60)) {
      return NextResponse.json({ message: "Please wait before sending another message." }, { status: 429 });
    }
  } catch {
    return NextResponse.json({ message: "Feedback delivery is temporarily unavailable." }, { status: 503 });
  }

  if (typeof data.website === "string" && data.website.length > 0) {
    return NextResponse.json({ ok: true, message: "Thanks for sharing your thoughts." });
  }

  const message = typeof data.message === "string" ? data.message.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  if (message.length < 10 || message.length > 1500 || email.length > 254 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return NextResponse.json({ message: "Check the message and reply email, then try again." }, { status: 400 });
  }

  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  if (!to || !from || !apiKey) {
    return NextResponse.json({ message: "Feedback delivery is not configured yet. Please try again later." }, { status: 503 });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        ...(email ? { reply_to: email } : {}),
        subject: "Rynster website: Home page feedback",
        text: `${email ? `Reply email: ${email}\n\n` : ""}${message}`,
      }),
    });
    if (!response.ok) throw new Error("Email provider rejected feedback.");
    return NextResponse.json({ ok: true, message: "Thanks for sharing your thoughts." });
  } catch {
    return NextResponse.json({ message: "We could not send your message. Please try again later." }, { status: 502 });
  }
}
