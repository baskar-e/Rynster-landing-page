"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

type ReactionState = { count: number | null; reacted: boolean; ready: boolean };

export default function HomeReactions() {
  const [reaction, setReaction] = useState<ReactionState>({ count: null, reacted: false, ready: false });
  const [reacting, setReacting] = useState(false);
  const [reactionStatus, setReactionStatus] = useState("");

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

  return (
    <section className="reaction-section" aria-labelledby="reaction-title">
      <div className="mx-auto w-[calc(100%-48px)] max-w-[1120px] max-[600px]:w-[calc(100%-36px)]">
        <div className="reaction-banner">
          <div className="reaction-copy">
            <div className="section-kicker">A note to the maker</div>
            <h2 id="reaction-title">Like what you see?</h2>
            <p>Leave a heart if this project resonates with you. Every reaction helps shape what comes next.</p>
          </div>
          <div className="reaction-action-group">
            <button
              className="heart-button"
              type="button"
              onClick={react}
              disabled={!reaction.ready || reaction.reacted || reacting}
              aria-pressed={reaction.reacted}
            >
              <Heart size={19} strokeWidth={1.9} fill={reaction.reacted ? "currentColor" : "none"} aria-hidden="true" />
              <span>{reaction.reacted ? "Heart sent" : "Send a heart"}</span>
            </button>
            <div className="reaction-count" aria-live="polite">
              <strong>{reaction.count === null ? "—" : reaction.count.toLocaleString()}</strong>
              <span>{reaction.count === 1 ? "heart so far" : "hearts so far"}</span>
            </div>
            {reactionStatus && <p className="engagement-status" role="status" aria-live="polite">{reactionStatus}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
