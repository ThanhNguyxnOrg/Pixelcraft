import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
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
  const [activeId, setActiveId] = useState<string>("D");
  const reducedMotion = useReducedMotion();
  const active =
    THIS_PAGE_DIRECTIONS.find((d) => d.id === activeId) ??
    THIS_PAGE_DIRECTIONS[3];

  return (
    <section
      id="receipt"
      aria-labelledby="receipt-title"
      className="relative overflow-x-clip"
    >
      <div className="mx-auto max-w-[88rem] px-4 py-16 sm:px-8 sm:py-24 lg:py-32">
        <SectionHead
          id="receipt-title"
          kicker="pixelcraft-direction · applied here"
          title="This page diverged before it was built."
        >
          <p>
            Four directions were sampled, each with the probability a typical
            model would choose it. Select any candidate to compare its default
            prior against its 7-axis score.
          </p>
        </SectionHead>

        <ol className="mt-12 grid min-w-0 gap-4 sm:mt-14 md:grid-cols-2 xl:grid-cols-4">
          {THIS_PAGE_DIRECTIONS.map((d, i) => {
            const focused = d.id === active.id;
            return (
              <li key={d.id} className="relative min-w-0">
                {focused ? (
                  <motion.div
                    layoutId={reducedMotion ? undefined : "receipt-glow"}
                    aria-hidden="true"
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 360, damping: 32 }
                    }
                    className="pointer-events-none absolute -inset-4 -z-10 opacity-55 blur-2xl"
                    style={{
                      background:
                        "radial-gradient(closest-side, color-mix(in oklab, var(--color-glow-cyan) 42%, transparent), transparent)",
                    }}
                  />
                ) : null}
                <Reveal delay={i * 0.06} className="h-full">
                  <button
                    type="button"
                    aria-pressed={focused}
                    onClick={() => setActiveId(d.id)}
                    className="block h-full w-full cursor-pointer text-start"
                  >
                    <PixelFrame
                      lit={focused}
                      className="h-full"
                      innerClassName={`flex flex-col p-5 sm:p-6 transition-colors motion-reduce:transition-none ${focused ? "bg-raised" : "hover:bg-white/[0.03]"}`}
                    >
                      <p className="flex items-center justify-between font-pixel text-[0.75rem] uppercase">
                        <span
                          className={
                            d.won || focused ? "text-action" : "text-ink-faint"
                          }
                        >
                          Direction {d.id}
                        </span>
                        <span
                          className={d.won ? "text-action" : "text-ink-faint"}
                        >
                          {d.won ? "Selected" : "Rejected"}
                        </span>
                      </p>
                      <h3 className="mt-5 display-wide text-[1.5rem] leading-[1.04]">
                        {d.name}
                      </h3>
                      <dl className="mt-7 grid gap-4">
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
                              tone={d.won || focused ? "action" : "muted"}
                            />
                          </dd>
                        </div>
                      </dl>
                      <p className="mt-7 border-t border-line pt-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                        {d.verdict}
                      </p>
                    </PixelFrame>
                  </button>
                </Reveal>
              </li>
            );
          })}
        </ol>

        <div className="surface mt-6 flex flex-wrap items-center justify-between gap-4 rounded-tile px-5 py-4 font-mono text-[0.8125rem]">
          <span className="text-ink">
            <span className="text-action">Direction {active.id}</span> ·{" "}
            {active.name}
          </span>
          <span className="text-ink-muted tabular">
            Model prior {(active.p * 100).toFixed(0)}% · Evidence score{" "}
            {active.score}/{MAX_SCORE} ·{" "}
            <strong className={active.won ? "text-action" : "text-p0"}>
              {active.won ? "SHIPPED" : "DISCARDED"}
            </strong>
          </span>
        </div>

        <dl className="mt-14 grid gap-x-10 gap-y-8 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              "Signature",
              "The real mark assembles from muted pixels and morphs across four resolution steps.",
            ],
            [
              "Type",
              "Archivo at 125% width for display, 100% for reading. Silkscreen only for pixel labels.",
            ],
            [
              "Light",
              "Petrol ink, pale mint, a touch of orchid. The gallery gets its own quiet light table.",
            ],
            [
              "Motion",
              "Assembly, spring tab indicators, magnetic targets, and pauseable loops. No scroll hijacking.",
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
