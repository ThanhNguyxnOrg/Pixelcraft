import { THIS_PAGE_DIRECTIONS } from "../data";
import { EvidenceStamp, PixelFrame, Reveal, SectionHead } from "./pixel";

const MAX_SCORE = 28; // 7 criteria × 4 points

function Meter({
  value,
  max,
  tone,
}: {
  value: number;
  max: number;
  tone: "action" | "muted" | "faint";
}) {
  const cells = 14;
  const lit = Math.round((value / max) * cells);
  const color =
    tone === "action"
      ? "bg-action"
      : tone === "muted"
        ? "bg-ink-muted"
        : "bg-ink-faint";
  return (
    <span className="flex gap-[3px]" aria-hidden="true">
      {Array.from({ length: cells }, (_, i) => (
        <span
          key={i}
          className={`h-3 flex-1 rounded-full ${i < lit ? color : "bg-white/10"}`}
        />
      ))}
    </span>
  );
}

export function Receipt() {
  return (
    <section
      id="receipt"
      aria-labelledby="receipt-title"
      className="relative overflow-x-clip"
    >
      <div className="mx-auto max-w-[88rem] px-5 py-24 sm:px-8 lg:py-36">
        <SectionHead
          id="receipt-title"
          kicker="pixelcraft-direction · applied here"
          title="This page diverged before it was built."
        >
          <p>
            Four directions were sampled, each with the probability a typical
            model would choose it. The likeliest lost first. The winner had the
            lowest prior and the highest evidence-weighted score.
          </p>
        </SectionHead>

        <ol className="mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {THIS_PAGE_DIRECTIONS.map((d, i) => (
            <li key={d.id} className="relative">
              {d.won ? (
                <div
                  aria-hidden="true"
                  className="absolute -inset-6 -z-10 opacity-50 blur-2xl"
                  style={{
                    background:
                      "radial-gradient(closest-side, color-mix(in oklab, var(--color-glow-cyan) 40%, transparent), transparent)",
                  }}
                />
              ) : null}
              <Reveal delay={i * 0.06} className="h-full">
                <PixelFrame
                  lit={d.won}
                  className="h-full"
                  innerClassName={`flex flex-col p-6 ${d.won ? "bg-raised" : ""}`}
                >
                  <p className="flex items-center justify-between font-pixel text-[0.75rem] uppercase">
                    <span className={d.won ? "text-action" : "text-ink-faint"}>
                      Direction {d.id}
                    </span>
                    <span className={d.won ? "text-action" : "text-ink-faint"}>
                      {d.won ? "Selected" : "Rejected"}
                    </span>
                  </p>
                  <h3 className="mt-6 display-wide text-[1.625rem] leading-[1.02]">
                    {d.name}
                  </h3>
                  <dl className="mt-8 grid gap-5">
                    <div>
                      <dt className="flex justify-between font-mono text-[0.75rem] text-ink-faint">
                        <span>p(conventional)</span>
                        <span className="text-ink tabular">
                          {d.p.toFixed(2)}
                        </span>
                      </dt>
                      <dd className="mt-2">
                        <Meter value={d.p} max={1} tone="faint" />
                      </dd>
                    </div>
                    <div>
                      <dt className="flex justify-between font-mono text-[0.75rem] text-ink-faint">
                        <span>score</span>
                        <span className="text-ink tabular">
                          <span data-count={d.score}>{d.score}</span> /{" "}
                          {MAX_SCORE}
                        </span>
                      </dt>
                      <dd className="mt-2">
                        <Meter
                          value={d.score}
                          max={MAX_SCORE}
                          tone={d.won ? "action" : "muted"}
                        />
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-8 border-t border-line pt-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                    {d.verdict}
                  </p>
                </PixelFrame>
              </Reveal>
            </li>
          ))}
        </ol>

        <dl className="mt-16 grid gap-x-10 gap-y-8 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              "Signature",
              "The real mark assembles from muted pixels. A slow light sweep keeps the identity alive.",
            ],
            [
              "Type",
              "Archivo at 125% width for display, 100% for reading. Silkscreen only for pixel labels.",
            ],
            [
              "Light",
              "Petrol ink, pale mint, a touch of iris. The gallery gets its own quiet light table.",
            ],
            [
              "Motion",
              "Assembly, comparison, then a deliberate sequence. No 3D, click-to-reveal content, or scroll hijacking.",
            ],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="font-pixel text-[0.75rem] text-action uppercase">
                {k}
              </dt>
              <dd className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                {v}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-10 flex flex-wrap items-center gap-3 text-[0.875rem] text-ink-faint">
          <EvidenceStamp label="waived" />
          <span>
            The supplied pixel identity stays. The quieter palette is a
            deliberate refinement, not a new template.
          </span>
        </p>
      </div>
    </section>
  );
}
