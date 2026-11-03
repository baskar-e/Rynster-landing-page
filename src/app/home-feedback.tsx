"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Send } from "lucide-react";

export default function HomeFeedback() {
  const [sending, setSending] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState("");

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

  return (
    <section className="feedback-section section" aria-labelledby="feedback-title">
      <div className="mx-auto w-[calc(100%-48px)] max-w-[1120px] max-[600px]:w-[calc(100%-36px)]">
        <div className="feedback-panel">
          <div className="feedback-copy">
            <div className="section-kicker">Got thoughts or feedback?</div>
            <h2 id="feedback-title">Share your thoughts.</h2>
            <p className="feedback-intro">
              A short note goes straight to my inbox. Whether it’s an idea for local-first AI, feedback on workflows, or a question, every note helps shape what comes next.
            </p>
            <div className="feedback-meta">
              <span>Read directly by the maker</span>
              <span className="dot" aria-hidden="true">·</span>
              <span>Direct reply if you include your email</span>
            </div>
          </div>

          <form className="engagement-form" onSubmit={sendFeedback}>
            <div className="field">
              <label htmlFor="home-feedback-message">Message</label>
              <textarea
                id="home-feedback-message"
                name="message"
                required
                minLength={10}
                maxLength={1500}
                rows={4}
                placeholder="What are your thoughts, ideas, or feedback?"
              />
            </div>
            <div className="field">
              <label htmlFor="home-feedback-email">
                Reply email <span className="form-note">(optional)</span>
              </label>
              <input
                id="home-feedback-email"
                name="email"
                type="email"
                maxLength={254}
                autoComplete="email"
                placeholder="you@domain.com"
              />
            </div>
            <div className="honeypot" aria-hidden="true">
              <label htmlFor="home-feedback-website">Leave this field empty</label>
              <input id="home-feedback-website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <button className="button button-dark" type="submit" disabled={sending}>
              <Send size={15} aria-hidden="true" /> {sending ? "Sending…" : "Send note"}
            </button>
            {feedbackStatus && (
              <p className="engagement-status" role="status" aria-live="polite">
                {feedbackStatus}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
