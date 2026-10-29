import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
const recent = new Map<string, number[]>();
const MAX_BODY = 12_000;

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) return NextResponse.json({ message: "Expected a JSON request." }, { status: 415 });
  const length = Number(request.headers.get("content-length") || 0);
  if (length > MAX_BODY) return NextResponse.json({ message: "Message is too large." }, { status: 413 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const attempts = (recent.get(ip) || []).filter(time => now - time < 60 * 60 * 1000);
  if (attempts.length >= 5) return NextResponse.json({ message: "Please wait before sending another message." }, { status: 429 });
  if (recent.size > 1000) recent.clear();
  recent.set(ip, [...attempts, now]);
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
      if (total > MAX_BODY) { await reader.cancel(); return NextResponse.json({ message: "Message is too large." }, { status: 413 }); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    data = JSON.parse(new TextDecoder().decode(bytes));
    if (!data || Array.isArray(data) || typeof data !== "object") throw new Error("Expected object");
  } catch { return NextResponse.json({ message: "Invalid request." }, { status: 400 }); }
  if (typeof data.website === "string" && data.website.length > 0) return NextResponse.json({ ok: true, message: "Your message has been submitted." });
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const subject = typeof data.subject === "string" ? data.subject.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";
  if (name.length > 100 || email.length > 254 || subject.length > 120 || message.length < 10 || message.length > 5000 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: "Check the email address and message, then try again." }, { status: 400 });
  }
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  if (!to || !from || !apiKey) return NextResponse.json({ message: "Contact delivery is not configured yet. Please try again later." }, { status: 503 });
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject: `Rynster website: ${subject}`, text: `Name: ${name || "Not provided"}\nEmail: ${email}\nSubject: ${subject}\n\n${message}` }),
    });
    if (!response.ok) throw new Error("Email provider rejected request");
    return NextResponse.json({ ok: true, message: "Your message has been submitted." });
  } catch {
    return NextResponse.json({ message: "We could not send your message. Please try again later." }, { status: 502 });
  }
}
