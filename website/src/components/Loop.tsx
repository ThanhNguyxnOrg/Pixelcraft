import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { PHASES, SKILLS, TOTAL_REFERENCES, TOTAL_SCRIPTS } from "../data";
import { gsap, MOTION_OK, useGSAP } from "../lib/gsap";
import { PixelLabel, useMotionPause } from "./pixel";

const ARTIFACT_PREVIEW: Record<string, { file: string; lines: string[] }> = {
  plan: {
    file: ".pixelcraft/plan.md",
    lines: [
      "## Surface & Stack",
      "mode: brownfield · stack: React 19 + Vite 7 + Tailwind 4",
      "tokens: src/index.css (@theme semantic roles observed)",
      "gate: stack & ownership recorded before visual direction",
    ],
  },
  frame: {
    file: "design-brief.md",
    lines: [
      "mode: Persuade + Read · primary input: pointer + keyboard",
      `[repo-observed] ${SKILLS.length} skills, ${TOTAL_REFERENCES} references, ${TOTAL_SCRIPTS} CLI scripts`,
      "[user-provided] keep petrol-ink pixel brand, zero fake proof",
      "[unknown] field Core Web Vitals -> mark not-checked",
    ],
  },
  diverge: {
    file: ".pixelcraft/history.json",
    lines: [
      '{ "A": { "name": "Neon launch", "p": 0.55, "score": 19, "status": "rejected" },',
      '  "B": { "name": "Swiss spec",  "p": 0.15, "score": 23, "status": "rejected" },',
      '  "C": { "name": "Terminal",    "p": 0.20, "score": 17, "status": "rejected" },',
      '  "D": { "name": "Evidence ledger", "p": 0.10, "score": 25, "won": true } }',
    ],
  },
  specify: {
    file: "tokens.json · state-matrix",
    lines: [
      '{ "color": { "action": { "$type": "color", "$value": "#b9efd2" } },',
      '  "signature": "44x44 sampled canvas mark + comparison stage",',
      '  "states": ["default", "hover", "focus-visible", "empty", "reduced-motion"] }',
    ],
  },
  build: {
    file: "platform-translation",
    lines: [
      "pixelcraft-web   -> semantic HTML, APG tabs, CSS @theme tokens",
      "pixelcraft-tui   -> Textual / Ratatui keyboard focus & cell grid",
      "pixelcraft-mobile -> SwiftUI / Compose Dynamic Type & safe areas",
    ],
  },
  verify: {
    file: "slop-scan.mjs · shoot.mjs · finish-gate.mjs",
    lines: [
      "$ node slop-scan.mjs public/gallery/saas/after.html -> score: 0",
      "$ node shoot.mjs http://localhost:4321 --out visual-qa (390, 768, 1440)",
      "$ node finish-gate.mjs evidence.json -> exit 0 (PASS)",
    ],
  },
  report: {
    file: "final-report.md",
    lines: [
      "[rendered] Chromium captures inspected at 1440x900 & 390x844",
      "[static]   tsc --noEmit, site.test.mjs (5/5), validate-skills (26)",
      "[not-checked] physical screen-reader session & field CWV",
    ],
  },
};

export function Loop() {
  const root = useRef<HTMLElement>(null);
  const { paused } = useMotionPause();
  const [selected, setSelected] = useState<string>(PHASES[0].id);
  const currentPhase = PHASES.find((p) => p.id === selected) ?? PHASES[0];
  const currentIndex = PHASES.findIndex((p) => p.id === currentPhase.id);
  const preview = ARTIFACT_PREVIEW[currentPhase.id] ?? ARTIFACT_PREVIEW.plan;

  useGSAP(
    () => {
      if (paused) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-loop="bar"]',
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top 60%",
              end: "bottom 55%",
              scrub: 0.5,
            },
          },
        );
        gsap.utils
          .toArray<HTMLElement>('[data-loop="card"]')
          .forEach((card, i) => {
            gsap.from(card, {
              y: 32,
              opacity: 0,
              duration: 0.7,
              delay: (i % 4) * 0.06,
              ease: "expo.out",
              clearProps: "transform,opacity",
              scrollTrigger: { trigger: card, start: "top 92%", once: true },
            });
            gsap.fromTo(
              card.querySelector('[data-loop="index"]'),
              { y: 14 },
              {
                y: -14,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.7,
                },
              },
            );
          });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [paused], revertOnUpdate: true },
  );

  return (
    <section
      ref={root}
      id="loop"
      aria-labelledby="loop-title"
      className="relative mx-2 overflow-hidden rounded-sheet bg-deep sm:mx-4"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30 pixel-field [mask-image:radial-gradient(ellipse_at_15%_30%,black,transparent_70%)]"
      />
      <div className="relative mx-auto max-w-[88rem] px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <PixelLabel>The Pixelcraft loop</PixelLabel>
            <h2
              id="loop-title"
              data-split
              className="mt-5 max-w-[16ch] display-wide text-[clamp(2.25rem,4.4vw,4rem)] leading-[0.98]"
            >
              A process, not a prompt slogan.
            </h2>
          </div>
          <p className="max-w-[42ch] text-[1rem] leading-relaxed text-ink-muted lg:col-span-5">
            Seven phases. An artifact and a gate at every step. Select any phase
            below to inspect the artifact it writes before handing off.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="mt-10 h-1 overflow-hidden rounded-full bg-white/8"
        >
          <div
            data-loop="bar"
            className="h-full origin-left rounded-full bg-action"
          />
        </div>

        {/* Interactive phase stepper + live artifact inspector */}
        <div className="mt-6 grid gap-4 rounded-card border border-line bg-void/65 p-4 sm:p-6 lg:grid-cols-12 lg:items-center">
          <div className="min-w-0 lg:col-span-6">
            <div
              role="group"
              aria-label="Inspect loop phase artifact"
              className="no-scrollbar flex gap-1.5 overflow-x-auto pb-2"
            >
              {PHASES.map((p, i) => {
                const on = p.id === currentPhase.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setSelected(p.id)}
                    className={`relative min-h-9 shrink-0 rounded-full px-3.5 font-mono text-[0.75rem] whitespace-nowrap transition-colors ${
                      on
                        ? "text-on-action font-medium"
                        : "text-ink-muted hover:bg-white/6 hover:text-ink"
                    }`}
                  >
                    {on ? (
                      <motion.span
                        layoutId="loop-step-pill"
                        aria-hidden="true"
                        transition={{
                          type: "spring",
                          stiffness: 430,
                          damping: 33,
                        }}
                        className="pointer-events-none absolute inset-0 rounded-full bg-action"
                      />
                    ) : null}
                    <span className="relative z-10">
                      {String(i).padStart(2, "0")} {p.name}
                    </span>
                  </button>
                );
              })}
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentPhase.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
                className="mt-3"
              >
                <p className="font-pixel text-[0.6875rem] text-action uppercase">
                  Phase {String(currentIndex).padStart(2, "0")} ·{" "}
                  {currentPhase.name}
                </p>
                <p className="mt-2 max-w-[50ch] text-[0.9375rem] leading-relaxed text-ink">
                  {currentPhase.does}
                </p>
                <p className="mt-2 text-[0.8125rem] text-ink-faint">
                  <span className="font-mono text-action">Gate:</span>{" "}
                  {currentPhase.gate}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="min-w-0 rounded-tile border border-white/10 bg-deep/90 p-4 lg:col-span-6">
            <div className="flex items-center justify-between gap-2 border-b border-line pb-2.5 font-mono text-[0.6875rem]">
              <span className="text-action">{preview.file}</span>
              <span className="text-ink-faint">artifact specimen</span>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.pre
                key={currentPhase.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.16 }}
                className="mt-3 overflow-x-auto font-mono text-[0.75rem] leading-6 text-ink-muted"
              >
                <code>{preview.lines.join("\n")}</code>
              </motion.pre>
            </AnimatePresence>
          </div>
        </div>

        <ol className="mt-6 grid gap-3.5 md:grid-cols-2 lg:grid-cols-4">
          {PHASES.map((p, i) => {
            const active = p.id === currentPhase.id;
            return (
              <li
                key={p.id}
                data-loop="card"
                onClick={() => setSelected(p.id)}
                className={`group relative flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-card p-5 transition-colors duration-200 ${
                  active ? "surface-lit" : "surface hover:bg-white/[0.06]"
                } ${i === 6 ? "lg:col-span-2" : ""}`}
              >
                <span
                  aria-hidden="true"
                  data-loop="index"
                  className={`pointer-events-none absolute -end-2 -top-3 font-pixel text-[5.5rem] leading-none transition-colors ${
                    active ? "text-action/[0.11]" : "text-white/[0.035]"
                  }`}
                >
                  {String(i).padStart(2, "0")}
                </span>
                <p className="font-pixel text-[0.6875rem] text-action tabular">
                  PHASE {String(i).padStart(2, "0")}
                </p>
                <h3 className="mt-2.5 display-wide text-[1.5rem] leading-none">
                  {p.name}
                </h3>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-muted">
                  {p.does}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.skills.map((s) => (
                    <code
                      key={s}
                      className="max-w-full rounded-full bg-white/8 px-2.5 py-1 text-[0.6875rem] break-words text-ink"
                    >
                      {s}
                    </code>
                  ))}
                </div>
                <div className="mt-auto pt-4">
                  <p className="border-t border-line pt-3 font-mono text-[0.75rem] text-action">
                    → {p.artifact}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
