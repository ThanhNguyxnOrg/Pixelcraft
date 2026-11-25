import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { AUTHORITY } from "../data";
import { PixelIcon, PixelLabel, Reveal } from "./pixel";

const HUE = [
  "var(--color-glow-cyan)",
  "var(--color-glow-blue)",
  "var(--color-glow-orchid)",
  "var(--color-glow-magenta)",
  "var(--color-glow-orange)",
];

export function Authority() {
  const [selectedRank, setSelectedRank] = useState<number>(1);
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="authority"
      aria-labelledby="authority-title"
      className="relative"
    >
      <div className="mx-auto max-w-[88rem] px-4 py-16 sm:px-8 sm:py-24 lg:py-32">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <Reveal className="min-w-0 lg:col-span-5">
            <PixelLabel>Authority order</PixelLabel>
            <h2
              id="authority-title"
              data-split
              className="mt-5 max-w-[14ch] display-wide text-[clamp(2rem,5vw,4.25rem)] leading-[0.98]"
            >
              A guest in your project.
            </h2>
            <p className="mt-5 max-w-[44ch] text-[1rem] leading-relaxed text-ink-muted sm:text-[1.0625rem]">
              Pixelcraft applies five constraints in order and stops at the
              first conflict. Click any rank to inspect how precedence resolves
              when rules disagree.
            </p>
            <p className="surface mt-6 inline-flex max-w-[44ch] items-start gap-3 rounded-tile p-4 text-[0.9375rem] leading-relaxed text-ink-muted sm:p-5">
              <PixelIcon name="check" size={16} className="mt-1 text-action" />
              <span>
                <span className="text-ink">
                  Already have an approved design?
                </span>{" "}
                Then it does not diverge. The handoff skill keeps your layout,
                hierarchy, and tokens, and only fills what is undecided.
              </span>
            </p>
          </Reveal>

          <ol className="grid min-w-0 gap-3 lg:col-span-7">
            {AUTHORITY.map((a, i) => {
              const isSelected = a.rank === selectedRank;
              const overridesSelected = a.rank < selectedRank;
              const statusLabel = isSelected
                ? a.rank === 5
                  ? "Loses every conflict"
                  : `Overrides #${a.rank + 1}–#5`
                : overridesSelected
                  ? `Wins over #${selectedRank}`
                  : `Yields to #${selectedRank}`;

              return (
                <li
                  key={a.rank}
                  data-reveal
                  className="min-w-0 lg:ms-[var(--ms)]"
                  style={{ ["--ms" as string]: `${i * 2.25}%` }}
                >
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedRank(a.rank)}
                    className={`surface relative flex w-full min-w-0 cursor-pointer items-center gap-3.5 overflow-hidden rounded-card p-4 text-start transition-opacity duration-200 sm:gap-5 sm:p-6 motion-reduce:transition-none ${
                      !isSelected && !overridesSelected
                        ? "opacity-75 hover:opacity-100"
                        : ""
                    }`}
                  >
                    {isSelected ? (
                      <motion.span
                        layoutId={
                          reducedMotion ? undefined : "authority-focus-ring"
                        }
                        aria-hidden="true"
                        transition={
                          reducedMotion
                            ? { duration: 0 }
                            : {
                                type: "spring",
                                stiffness: 400,
                                damping: 34,
                              }
                        }
                        className="pointer-events-none absolute inset-0 rounded-card bg-action/[0.08] ring-1 ring-inset ring-action/45"
                      />
                    ) : null}
                    <span
                      className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full font-pixel text-[0.9375rem] text-void sm:size-12"
                      style={{ background: HUE[i], opacity: 1 - i * 0.1 }}
                    >
                      {a.rank}
                    </span>
                    <div className="relative z-10 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="display-wide text-[1.25rem] leading-tight sm:text-[1.375rem]">
                          {a.name}
                        </p>
                        <span
                          className={`rounded-full px-2.5 py-0.5 font-mono text-[0.6875rem] ${
                            isSelected
                              ? "bg-action text-on-action font-medium"
                              : overridesSelected
                                ? "bg-white/12 text-ink"
                                : "bg-white/6 text-ink-faint"
                          }`}
                        >
                          {statusLabel}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[0.9375rem] leading-snug text-ink-muted">
                        {a.detail}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
