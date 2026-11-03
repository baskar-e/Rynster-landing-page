"use client";

import { useEffect, useState } from "react";
import { Check, ThumbsUp } from "lucide-react";
import { AI_AGENT_OPTIONS } from "@/lib/agent-options";
import type { AIAgentOption } from "@/lib/agent-options";

type VoteRecord = { count: number; voted: boolean };

export default function HomeAgentVoting() {
  const [votes, setVotes] = useState<Record<string, VoteRecord>>(() => {
    const initial: Record<string, VoteRecord> = {};
    for (const agent of AI_AGENT_OPTIONS) {
      initial[agent.id] = { count: agent.baseVotes, voted: false };
    }
    return initial;
  });
  const [activeMutatingId, setActiveMutatingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/votes", { cache: "no-store", credentials: "same-origin", signal: controller.signal })
      .then(async res => {
        if (!res.ok) throw new Error("Could not load votes.");
        return res.json();
      })
      .then(data => {
        if (data.success && data.votes) {
          setVotes(data.votes);
        }
      })
      .catch(() => {
        // Keep initial fallback states
      });
    return () => controller.abort();
  }, []);

  async function handleVote(agentId: string) {
    if (activeMutatingId) return;
    setStatusMessage("");
    setActiveMutatingId(agentId);

    const prev = votes[agentId] || { count: 0, voted: false };
    const willVote = !prev.voted;
    const optimisticCount = willVote ? prev.count + 1 : Math.max(0, prev.count - 1);

    // Optimistic UI update
    setVotes(curr => ({
      ...curr,
      [agentId]: { count: optimisticCount, voted: willVote },
    }));

    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ agentId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update vote.");
      }
      setVotes(curr => ({
        ...curr,
        [agentId]: { count: data.count, voted: data.voted },
      }));
    } catch (err) {
      // Revert on failure
      setVotes(curr => ({
        ...curr,
        [agentId]: prev,
      }));
      setStatusMessage(err instanceof Error ? err.message : "Vote could not be recorded. Please try again.");
    } finally {
      setActiveMutatingId(null);
    }
  }

  const maxVotes = Math.max(...Object.values(votes).map(v => v.count), 1);
  const totalVotes = Object.values(votes).reduce((sum, v) => sum + v.count, 0);

  return (
    <section className="agent-voting-section section" id="vote-agents" aria-labelledby="agent-voting-title">
      <div className="mx-auto w-[calc(100%-48px)] max-w-[1120px] max-[600px]:w-[calc(100%-36px)]">
        <div className="section-head">
          <div>
            <div className="section-kicker">Bring your own AI client</div>
            <h2 id="agent-voting-title">Which AI agent do you<br />want to connect next?</h2>
          </div>
          <div className="agent-voting-head-meta">
            <p className="section-intro">
              Rynster connects local codebases to compatible AI assistants via MCP. Cast your vote for the models,
              runtimes, and agents you want us to prioritize next.
            </p>
            <div className="agent-voting-live-stat">
              <span className="agent-stat-dot" aria-hidden="true" />
              <span><strong>{totalVotes.toLocaleString()}</strong> votes cast across <strong>{AI_AGENT_OPTIONS.length}</strong> agents</span>
            </div>
          </div>
        </div>

        {statusMessage && (
          <p className="agent-vote-status-error" role="alert">
            {statusMessage}
          </p>
        )}

        <div className="agent-voting-grid">
          {AI_AGENT_OPTIONS.map((agent: AIAgentOption) => {
            const current = votes[agent.id] ?? { count: agent.baseVotes, voted: false };
            const isVoted = current.voted;
            const isMutating = activeMutatingId === agent.id;
            const percentage = Math.round((current.count / maxVotes) * 100);

            return (
              <article className={`agent-card ${isVoted ? "agent-card-voted" : ""}`} key={agent.id}>
                <div className="agent-card-main">
                  <h3>{agent.name}</h3>
                  <p>{agent.description}</p>
                </div>

                <div className="agent-card-meter" aria-hidden="true">
                  <div className="agent-card-meter-fill" style={{ width: `${percentage}%` }} />
                </div>

                <div className="agent-card-bottom">
                  <div className="agent-count-wrap">
                    <span className="agent-count-number">{current.count}</span>
                    <span className="agent-count-label">{current.count === 1 ? "vote" : "votes"}</span>
                  </div>

                  <button
                    type="button"
                    className={`agent-vote-btn ${isVoted ? "agent-vote-btn-active" : ""}`}
                    onClick={() => handleVote(agent.id)}
                    disabled={isMutating}
                    aria-pressed={isVoted}
                    aria-label={`${isVoted ? "Retract vote for" : "Vote for"} ${agent.name}`}
                  >
                    {isVoted ? (
                      <>
                        <Check size={14} strokeWidth={2.4} aria-hidden="true" />
                        <span>Voted</span>
                      </>
                    ) : (
                      <>
                        <ThumbsUp size={13} strokeWidth={2} aria-hidden="true" />
                        <span>Vote</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
