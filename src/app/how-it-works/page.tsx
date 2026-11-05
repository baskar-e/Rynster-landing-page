import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GuideSteps } from "@/components/guide-steps";

export const metadata = {
  title: "How Rynster works: step-by-step setup",
  description:
    "Connect Claude to your local project with Rynster in 13 steps: register, tunnel, connect, approve.",
};

function Diagram({ type }: { type: "flow" | "review" | "local" }) {
  if (type === "flow") {
    return (
      <svg viewBox="0 0 560 180" role="img" aria-label="Workflow from a developer to an AI client through Rynster">
        <rect x="16" y="54" width="135" height="72" rx="7" fill="#fff" stroke="#d6dfd1" />
        <rect x="212" y="54" width="135" height="72" rx="7" fill="#1b3329" />
        <rect x="408" y="54" width="135" height="72" rx="7" fill="#fff" stroke="#d6dfd1" />
        <text x="83" y="86" textAnchor="middle" fontSize="12" fill="#283b30">YOUR PROJECT</text>
        <text x="83" y="107" textAnchor="middle" fontSize="10" fill="#718075">local files</text>
        <text x="279" y="86" textAnchor="middle" fontSize="12" fill="#fff">RYNSTER</text>
        <text x="279" y="107" textAnchor="middle" fontSize="10" fill="#b5f36d">local MCP</text>
        <text x="475" y="86" textAnchor="middle" fontSize="12" fill="#283b30">AI CLIENT</text>
        <text x="475" y="107" textAnchor="middle" fontSize="10" fill="#718075">your choice</text>
        <path d="M154 90h48m-7-6 7 6-7 6M350 90h48m-7-6 7 6-7 6" fill="none" stroke="#8aad78" strokeWidth="2" />
        <text x="180" y="45" textAnchor="middle" fontSize="9" fill="#728078">PROJECT ACCESS</text>
        <text x="375" y="45" textAnchor="middle" fontSize="9" fill="#728078">MCP</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 560 180" role="img" aria-label={type === "review" ? "Review a proposed change before it is written" : "Local project boundary illustration"}>
      <rect x="72" y="25" width="416" height="130" rx="8" fill={type === "review" ? "#172720" : "#e1ebdc"} />
      {type === "review" ? (
        <>
          <text x="98" y="55" fontFamily="monospace" fontSize="10" fill="#96a69b">proposed change · src/app.ts</text>
          <text x="98" y="83" fontFamily="monospace" fontSize="12" fill="#b5f36d">+ validateRequest(input)</text>
          <text x="98" y="108" fontFamily="monospace" fontSize="12" fill="#edab9d">- handleRequest(input)</text>
          <rect x="98" y="122" width="76" height="20" rx="3" fill="#b5f36d" />
          <text x="136" y="136" textAnchor="middle" fontSize="9" fill="#172720">REVIEW</text>
        </>
      ) : (
        <>
          <circle cx="280" cy="90" r="48" fill="#fff" stroke="#c5d6bc" />
          <circle cx="280" cy="90" r="29" fill="#1b3329" />
          <text x="280" y="96" textAnchor="middle" fontSize="17" fontWeight="700" fill="#b5f36d">r.</text>
          <text x="155" y="95" textAnchor="middle" fontSize="10" fill="#445e49">LOCAL PROJECT</text>
          <text x="405" y="95" textAnchor="middle" fontSize="10" fill="#445e49">YOUR CLIENT</text>
          <path d="M194 90h36m100 0h36" stroke="#8aad78" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}

const cards: Array<[string, string, "flow" | "review" | "local"]> = [
  ["Local MCP architecture", "A simplified view of how your project, Rynster, and a compatible AI client relate.", "flow"]
];

export default function HowItWorks() {
  return (
    <>
      <div className="page-hero">
        <div className="mx-auto w-[calc(100%-48px)] max-w-[1120px] max-[600px]:w-[calc(100%-36px)]">
          <div className="eyebrow">Rynster / How It Works</div>
          <h1>See the shape<br />of the workflow.</h1>
          <p>
            Visual guides, video walkthrough, and step-by-step instructions showing how your local project,
            Rynster, and your AI client work together seamlessly and safely.
          </p>
        </div>
      </div>

      <div className="mx-auto w-[calc(100%-48px)] max-w-[1120px] max-[600px]:w-[calc(100%-36px)] page-section space-y-16">
        {/* Local Architecture Overview */}
        <section aria-labelledby="architecture-heading">
          <div className="section-kicker">Architecture</div>
          <h2 id="architecture-heading">Local MCP Architecture</h2>
          <div className="media-grid mt-6">
            {cards.map(([title, description, type]) => (
              <article className="media-card" key={title}>
                <div className={`media-art ${type === "review" ? "dark" : ""}`}>
                  <Diagram type={type} />
                </div>
                <div className="media-caption">
                  <b>{title}</b>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Video Walkthrough Section */}
        <section aria-labelledby="video-heading" className="pt-4">
          <div className="section-kicker">Video Walkthrough</div>
          <h2 id="video-heading">Watch the 3-minute walkthrough</h2>
          <p className="mt-2 text-[#66746c] text-[15px]">
            Watch how to register a project, start a secure tunnel, link Claude as a custom connector, and approve file edits.
          </p>
          <div className="mt-6 overflow-hidden rounded-xl border border-[var(--line,#dce4d9)] bg-[#14251f] shadow-lg max-w-[960px]">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/guide/poster.webp"
              className="aspect-video w-full"
            >
              <source src="/videos/rynster-setup-guide.mp4" type="video/mp4" />
              <source src="/guide/rynster-setup-guide.mp4" type="video/mp4" />
              Your browser does not support playing this video. The full steps with screenshots are documented below.
            </video>
          </div>
        </section>

        {/* Step-by-Step Screenshots Section */}
        <section aria-labelledby="steps-heading" className="pt-6">
          <div className="section-kicker">Step-by-Step Guide</div>
          <h2 id="steps-heading">Prefer to read? Follow the 13 steps</h2>
          <p className="mt-2 text-[#66746c] text-[15px] max-w-[680px]">
            Follow every step from initial registration and Cloudflare tunnel setup to authorizing Claude and approving code changes locally.
          </p>
          <div className="mt-8">
            <GuideSteps />
          </div>
        </section>

        {/* Safety Callout */}
        <div className="callout">
          Planning a public screenshot or video demo? Remove credentials, private project data, and unreleased details before publishing.
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-[var(--line,#dce4d9)]">
          <p className="text-sm text-[#66746c]">
            Stuck? Check our <Link href="/docs/troubleshooting" className="text-[#315535] underline font-medium">troubleshooting guide</Link> or <Link href="/docs/quickstart" className="text-[#315535] underline font-medium">quick start docs</Link>.
          </p>
          <p className="text-sm">
            Questions about this workflow?{" "}
            <Link href="/contact" className="inline-flex items-center gap-1 font-semibold text-[#18372b] hover:text-[#447b37]">
              Get in touch <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
