"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Heart, Send } from "lucide-react";

type ReactionState = { count: number | null; reacted: boolean; ready: boolean };

export default function HomeEngagement() {
  const [reaction, setReaction] = useState<ReactionState>({ count: null, reacted: false, ready: false });
  const [reacting, setReacting] = useState(false);
  const [reactionStatus, setReactionStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/reactions", { cache: "no-store", credentials: "same-origin", signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error("Reaction count unavailable.");
        return response.json();
      })
      .then(data => setReaction({ count: Number(data.count) || 0, reacted: Boolean(data.reacted), ready: true }))
      .catch(() => {
        if (!controller.signal.aborted) {
          setReaction({ count: null, reacted: false, ready: false });
          setReactionStatus("Reactions are temporarily unavailable.");
        }
      });
    return () => controller.abort();
  }, []);

  async function react() {
    setReacting(true);
    setReactionStatus("");
    try {
      const response = await fetch("/api/reactions", { method: "POST", credentials: "same-origin" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "We could not record your heart. Please try again.");
      setReaction({ count: Number(data.count) || 0, reacted: Boolean(data.reacted), ready: true });
      setReactionStatus("Thanks for the heart!");
    } catch (error) {
      setReactionStatus(error instanceof Error ? error.message : "We could not record your heart. Please try again.");
    } finally {
      setReacting(false);
    }
  }

  async function sendFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setFeedbackStatus("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      setFeedbackStatus(result.message || "We could not send your note. Please try again.");
      if (response.ok) form.reset();
    } catch {
      setFeedbackStatus("We could not send your note. Please try again later.");
    } finally {
      setSending(false);
    }
  }

  return <section className="engagement-section section" aria-labelledby="engagement-title">
    <div className="mx-auto w-[calc(100%-48px)] max-w-[1120px] max-[600px]:w-[calc(100%-36px)]">
      <div className="engagement-panel">
        <div className="engagement-invite">
          <div className="section-kicker">A note to the maker</div>
          <h2 id="engagement-title">Like what you see?</h2>
          <p>Leave a heart or send me a thought. Every note helps shape what comes next.</p>
          <button className="heart-button" type="button" onClick={react} disabled={!reaction.ready || reaction.reacted || reacting} aria-pressed={reaction.reacted}>
            <Heart size={19} strokeWidth={1.9} fill={reaction.reacted ? "currentColor" : "none"} aria-hidden="true" />
            <span>{reaction.reacted ? "Heart sent" : "Send a heart"}</span>
          </button>
          <div className="reaction-count" aria-live="polite">
            <strong>{reaction.count === null ? "—" : reaction.count.toLocaleString()}</strong>
            <span>{reaction.count === 1 ? "heart so far" : "hearts so far"}</span>
          </div>
          <p className="engagement-status" role="status" aria-live="polite">{reactionStatus}</p>
        </div>

        <form className="engagement-form" onSubmit={sendFeedback}>
          <h3>Share your thoughts</h3>
          <p className="engagement-form-intro">A short note goes straight to my inbox.</p>
          <div className="field">
            <label htmlFor="home-feedback-message">Message</label>
            <textarea id="home-feedback-message" name="message" required minLength={10} maxLength={1500} rows={3} />
          </div>
          <div className="field">
            <label htmlFor="home-feedback-email">Reply email <span className="form-note">(optional)</span></label>
            <input id="home-feedback-email" name="email" type="email" maxLength={254} autoComplete="email" />
          </div>
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="home-feedback-website">Leave this field empty</label>
            <input id="home-feedback-website" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <button className="button button-dark" type="submit" disabled={sending}>
            <Send size={15} aria-hidden="true" /> {sending ? "Sending…" : "Send note"}
          </button>
          <p className="engagement-status" role="status" aria-live="polite">{feedbackStatus}</p>
        </form>
      </div>
    </div>
  </section>;
}
