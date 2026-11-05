import Image from "next/image";
import { guideSteps } from "@/lib/guide-steps";
import { CopyButton } from "@/components/copy-button";

export function GuideSteps() {
  return (
    <div>
      <nav aria-label="Jump to a step" className="mb-6 flex flex-wrap gap-2">
        {guideSteps.map((step, i) => (
          <a
            key={step.id}
            href={`#${step.id}`}
            className="rounded-full border border-current/15 px-3 py-1 text-sm hover:bg-current/10"
          >
            {i + 1}. {step.title}
          </a>
        ))}
      </nav>

      <p className="mb-12 text-sm opacity-70">
        Replace anything in &lt;angle brackets&gt; with your own values.
      </p>

      <ol className="space-y-20">
        {guideSteps.map((step, i) => (
          <li key={step.id} id={step.id} className="scroll-mt-24">
            <p className="text-sm font-semibold uppercase tracking-wide opacity-60">
              Step {i + 1} of {guideSteps.length}
            </p>
            <h3 className="mt-1 text-2xl font-semibold">{step.title}</h3>
            <p className="mt-3 max-w-2xl opacity-80">{step.body}</p>

            {step.commands && (
              <div className="mt-4 flex max-w-2xl items-start gap-2">
                <pre className="min-w-0 flex-1 overflow-x-auto rounded-lg border border-current/15 bg-current/5 p-4 text-sm">
                  <code>{step.commands.join("\n")}</code>
                </pre>
                <CopyButton text={step.commands.join("\n")} />
              </div>
            )}

            {step.tip && (
              <p className="mt-4 max-w-2xl border-l-4 border-amber-400 pl-4 text-sm">
                {step.tip}
              </p>
            )}

            <Image
              src={step.image.src}
              alt={step.image.alt}
              width={step.image.width}
              height={step.image.height}
              sizes="(min-width: 1024px) 960px, 100vw"
              loading={i < 2 ? "eager" : "lazy"}
              className="mt-6 h-auto w-full rounded-xl border border-current/15"
              style={{ maxWidth: Math.min(step.image.width, 960) }}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
