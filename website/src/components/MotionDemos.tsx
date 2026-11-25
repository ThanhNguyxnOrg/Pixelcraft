import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { GALLERY, NPM_PKG, SKILLS } from "../data";
import { usePromoMotion } from "../lib/usePromoMotion";
import { PixelIcon, PixelLabel } from "./pixel";

const frame =
  "gborder relative isolate w-full min-w-0 overflow-hidden rounded-card border border-line bg-deep";

function PackPromo() {
  const root = useRef<HTMLDivElement>(null);
  usePromoMotion(root, (tl) => {
    tl.fromTo(
      "[data-pack-dot]",
      { opacity: 0.22, scale: 0.72 },
      {
        opacity: 1,
        scale: 1,
        stagger: { each: 0.028, from: "start" },
        duration: 0.4,
        ease: "back.out(1.6)",
      },
      0.15,
    )
      .fromTo(
        "[data-pack-rule]",
        { scaleX: 0.15, opacity: 0.35 },
        { scaleX: 1, opacity: 1, duration: 0.75, ease: "power2.inOut" },
        0.5,
      )
      .to(
        "[data-pack-badge]",
        {
          scale: 1.04,
          duration: 0.28,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        },
        1.35,
      )
      .to(
        "[data-pack-dot]",
        {
          opacity: 0.28,
          scale: 0.78,
          stagger: { each: 0.016, from: "end" },
          duration: 0.45,
          ease: "power2.inOut",
        },
        4.4,
      );
  });
  return (
    <div
      ref={root}
      data-promo="pack"
      aria-hidden="true"
      className={`${frame} flex aspect-[1.5] min-h-72 flex-col justify-center px-5 py-8 sm:px-9`}
    >
      <div className="absolute inset-x-0 top-0 flex h-10 items-center gap-1.5 border-b border-line px-5">
        <i className="size-1.5 rounded-full bg-ink-ghost" />
        <i className="size-1.5 rounded-full bg-ink-ghost" />
        <i className="size-1.5 rounded-full bg-action" />
        <span className="ms-auto font-mono text-[0.625rem] text-ink-faint">
          pixelcraft / skill pack
        </span>
      </div>
      <div data-pack-scene className="pt-5">
        <div
          data-pack-command
          className="font-mono text-[clamp(.75rem,1.3vw,1rem)] leading-7"
        >
          <span className="text-action">$</span> npm i -g {NPM_PKG}
          <br />
          <span className="text-action">$</span> pixelcraft add all --agent
          claude
        </div>
        <div className="my-7 grid grid-cols-13 gap-1.5 sm:gap-2">
          {SKILLS.map((skill) => (
            <span
              key={skill.name}
              data-pack-dot
              className="aspect-square rounded-[3px] bg-action"
            />
          ))}
        </div>
        <div data-pack-rule className="h-px origin-left bg-action/35" />
        <div
          data-pack-ready
          className="mt-4 flex flex-wrap items-center justify-between gap-2 font-mono text-[0.6875rem] text-ink-muted"
        >
          <span data-pack-badge className="inline-block text-action">
            {SKILLS.length} skills. One toolkit.
          </span>
          <span>YOUR AGENT, UPGRADED</span>
        </div>
      </div>
    </div>
  );
}

const STUDIES = [
  { id: "data", label: "A · Data-led", prior: "p = 0.22" },
  { id: "editorial", label: "B · Editorial", prior: "p = 0.18" },
  { id: "mint", label: "C · Bold mint", prior: "p = 0.09 · Picked" },
] as const;

function DirectionPromo() {
  const [picked, setPicked] = useState<(typeof STUDIES)[number]["id"]>("mint");
  const root = useRef<HTMLDivElement>(null);
  usePromoMotion(root, (tl) => {
    tl.fromTo(
      "[data-roast-curve]",
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" },
      0.2,
    ).to("[data-roast-curve]", { strokeDashoffset: 0, duration: 2.8 }, 1.5);
  });
  return (
    <div
      ref={root}
      data-promo="direction"
      className={`${frame} aspect-[1.5] min-h-72 select-none`}
    >
      <div className="absolute inset-x-4 top-3.5 z-20 flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[0.625rem] tracking-wider text-ink-faint">
          ONE BRIEF · CLICK TO INSPECT
        </span>
        <div
          role="group"
          aria-label="Inspect direction study"
          className="flex rounded-full bg-void/75 p-0.5 backdrop-blur-md"
        >
          {STUDIES.map((s) => {
            const on = picked === s.id;
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={on}
                onClick={() => setPicked(s.id)}
                className={`relative inline-flex min-h-8 items-center rounded-full px-3 py-1 font-mono text-[0.625rem] transition-colors ${
                  on
                    ? "text-on-action font-medium"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {on ? (
                  <motion.span
                    layoutId="study-pick-pill"
                    aria-hidden="true"
                    transition={{ type: "spring", stiffness: 430, damping: 32 }}
                    className="pointer-events-none absolute inset-0 rounded-full bg-action"
                  />
                ) : null}
                <span className="relative z-10">{s.id.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div data-direction-scene className="absolute inset-0">
        <motion.button
          type="button"
          onClick={() => setPicked("data")}
          aria-label="Inspect Data-led direction"
          animate={
            picked === "data"
              ? { y: -10, rotate: -3, scale: 1.05, opacity: 1, zIndex: 15 }
              : { y: 6, rotate: -8, scale: 0.94, opacity: 0.5, zIndex: 5 }
          }
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="absolute start-[6%] top-[25%] h-[56%] w-[42%] cursor-pointer rounded-tile bg-paper p-[5%] text-start text-paper-ink shadow-lift"
        >
          <p className="font-mono text-[0.6rem] uppercase">Data-led</p>
          <p className="mt-3 font-mono text-[clamp(1.3rem,3vw,2.4rem)] leading-none">
            ROAST
            <br />
            042.
          </p>
          <svg viewBox="0 0 180 65" className="mt-4 w-full" fill="none">
            <path
              d="M0 60H180M0 30H180M0 0H180"
              stroke="currentColor"
              opacity=".15"
            />
            <path
              data-roast-curve
              pathLength="1"
              strokeDasharray="1"
              d="M0 56C25 54 25 62 42 47S68 49 82 33S110 41 126 19S160 25 180 3"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
        </motion.button>

        <motion.button
          type="button"
          onClick={() => setPicked("editorial")}
          aria-label="Inspect Editorial direction"
          animate={
            picked === "editorial"
              ? { y: -8, rotate: 0, scale: 1.05, opacity: 1, zIndex: 15 }
              : { y: 4, rotate: 2, scale: 0.94, opacity: 0.5, zIndex: 6 }
          }
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="absolute start-[30%] top-[20%] h-[56%] w-[42%] cursor-pointer rounded-tile border border-line-strong bg-panel p-[5%] text-start text-glow-orange shadow-lift"
        >
          <p className="font-mono text-[0.6rem] uppercase">Editorial</p>
          <p className="mt-3 display-condensed text-[clamp(2rem,4.8vw,4.2rem)] leading-[.82]">
            FIELD
            <br />
            NOTES.
          </p>
          <span className="mt-4 block h-px w-3/4 bg-current" />
          <span className="mt-2 block h-px w-1/2 bg-current opacity-40" />
        </motion.button>

        <motion.button
          type="button"
          onClick={() => setPicked("mint")}
          aria-label="Inspect Bold mint direction"
          animate={
            picked === "mint"
              ? { y: -10, rotate: 3, scale: 1.05, opacity: 1, zIndex: 15 }
              : { y: 6, rotate: 8, scale: 0.94, opacity: 0.5, zIndex: 7 }
          }
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="absolute start-[51%] top-[27%] h-[56%] w-[42%] cursor-pointer rounded-tile bg-action p-[5%] text-start text-on-action shadow-lift"
        >
          <p className="font-mono text-[0.6rem] uppercase">Bold & direct</p>
          <p className="mt-3 display-wide text-[clamp(1.25rem,3vw,2.6rem)] leading-[.88]">
            GOOD
            <br />
            MORN-
            <br />
            INGS.
          </p>
          <span className="absolute bottom-[9%] start-[12%] size-3 rounded-full border-2 border-current" />
        </motion.button>
      </div>

      <div
        data-direction-note
        className="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-between px-5 font-mono text-[0.625rem] tracking-wider text-action"
      >
        <span>{STUDIES.find((s) => s.id === picked)?.label}</span>
        <span>{STUDIES.find((s) => s.id === picked)?.prior}</span>
      </div>
    </div>
  );
}

const REFINE_IDS = ["swiftui", "tui", "python", "store", "gamehud"] as const;

function RefinePromo({ specimenId }: { specimenId: string }) {
  const root = useRef<HTMLDivElement>(null);
  const specimen =
    GALLERY.find((g) => g.id === specimenId) ??
    GALLERY.find((g) => g.id === "coffee") ??
    GALLERY[0];
  usePromoMotion(root, (tl) => {
    tl.fromTo(
      "[data-refine-after]",
      { clipPath: "inset(0 0 0 88%)" },
      { clipPath: "inset(0 0 0 8%)", duration: 2.3, ease: "power2.inOut" },
      0.4,
    )
      .fromTo(
        "[data-refine-divider]",
        { left: "88%" },
        { left: "8%", duration: 2.3, ease: "power2.inOut" },
        0.4,
      )
      .to(
        "[data-refine-after]",
        { clipPath: "inset(0 0 0 88%)", duration: 1.8, ease: "power2.inOut" },
        4.1,
      )
      .to(
        "[data-refine-divider]",
        { left: "88%", duration: 1.8, ease: "power2.inOut" },
        4.1,
      );
  });
  return (
    <div
      ref={root}
      data-promo="refine"
      aria-hidden="true"
      className={`${frame} aspect-[1.6]`}
    >
      <img
        src={specimen.before}
        alt=""
        width={1440}
        height={900}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        data-refine-after
        style={{ clipPath: "inset(0 0 0 50%)" }}
        className="absolute inset-0"
      >
        <img
          src={specimen.after}
          alt=""
          width={1440}
          height={900}
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
      <span
        data-promo-label
        className="absolute start-3 top-3 rounded-full bg-void/90 px-3 py-1.5 font-mono text-[0.625rem] text-ink backdrop-blur-sm"
      >
        DEFAULT · {specimen.scanBefore.score}
      </span>
      <span
        data-promo-label
        className="absolute end-3 top-3 rounded-full bg-action px-3 py-1.5 font-mono text-[0.625rem] font-medium text-on-action"
      >
        PIXELCRAFT · {specimen.scanAfter.score}
      </span>
      <div
        data-refine-divider
        style={{ left: "50%" }}
        className="absolute inset-y-0 w-0.5 bg-action shadow-lift"
      />
    </div>
  );
}

export function MotionDemos() {
  const [specimenId, setSpecimenId] = useState<string>("swiftui");
  const specimenChoices = REFINE_IDS.map((id) =>
    GALLERY.find((g) => g.id === id),
  ).filter((g): g is NonNullable<typeof g> => Boolean(g));

  return (
    <section
      id="film"
      aria-labelledby="demos-title"
      className="relative py-16 sm:py-24"
    >
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <PixelLabel>Pixelcraft, in small moves</PixelLabel>
            <h2
              id="demos-title"
              data-split
              className="mt-5 max-w-[17ch] display-wide text-[clamp(2rem,4.4vw,4rem)] leading-[.98]"
            >
              Less default.
              <br />
              <span className="text-action">More deliberate.</span>
            </h2>
          </div>
          <p className="max-w-[36ch] text-[0.9375rem] leading-relaxed text-ink-muted">
            Three interactive studies. One design loop. Authored illustrations
            and real captures, not live AI runs.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-x-7 gap-y-14 lg:grid-cols-2">
          <article className="min-w-0">
            <PackPromo />
            <div className="mt-5 flex gap-4">
              <span className="shrink-0 pt-1 font-mono text-xs whitespace-nowrap text-action">
                01 /
              </span>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">
                  Give your agent a toolkit.
                </h3>
                <p className="mt-2 max-w-[43ch] text-sm leading-relaxed text-ink-muted">
                  One command brings {SKILLS.length} source-backed skills into
                  the agent you already use.
                </p>
              </div>
            </div>
          </article>
          <article className="min-w-0">
            <DirectionPromo />
            <div className="mt-5 flex gap-4">
              <span className="shrink-0 pt-1 font-mono text-xs whitespace-nowrap text-action">
                02 /
              </span>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">
                  Explore before you commit.
                </h3>
                <p className="mt-2 max-w-[43ch] text-sm leading-relaxed text-ink-muted">
                  Click any sketch above to pull it forward: data-led paper,
                  dark editorial, or bold mint.
                </p>
              </div>
            </div>
          </article>
          <article className="grid min-w-0 grid-cols-1 items-center gap-7 border-t border-line pt-10 lg:col-span-2 lg:grid-cols-[.72fr_1.28fr] lg:gap-14">
            <div className="flex gap-4">
              <span className="shrink-0 pt-1 font-mono text-xs whitespace-nowrap text-action">
                03 /
              </span>
              <div>
                <h3 className="max-w-[15ch] display-wide text-[clamp(1.75rem,3vw,2.75rem)] leading-none">
                  Same brief.
                  <br />A different standard.
                </h3>
                <p className="mt-4 max-w-[36ch] text-sm leading-relaxed text-ink-muted">
                  Switch specimens to watch the automatic sweep across real
                  captured pairs, or jump down to drag and inspect live source
                  pins.
                </p>
                <div
                  role="group"
                  aria-label="Preview gallery specimen"
                  className="mt-5 inline-flex flex-wrap gap-1 rounded-2xl bg-white/6 p-1"
                >
                  {specimenChoices.map((g) => {
                    const on = g.id === specimenId;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setSpecimenId(g.id)}
                        className={`relative rounded-xl px-3 py-1.5 font-mono text-[0.75rem] transition-colors ${
                          on
                            ? "text-on-action font-medium"
                            : "text-ink-muted hover:text-ink"
                        }`}
                      >
                        {on ? (
                          <motion.span
                            layoutId="refine-specimen-pill"
                            aria-hidden="true"
                            transition={{
                              type: "spring",
                              stiffness: 420,
                              damping: 32,
                            }}
                            className="pointer-events-none absolute inset-0 rounded-xl bg-action"
                          />
                        ) : null}
                        <span className="relative z-10">
                          {g.stack ?? g.title.split(" ")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4">
                  <a
                    href="#gallery"
                    className="inline-flex min-h-10 items-center gap-2.5 font-mono text-xs text-action underline underline-offset-4"
                  >
                    Open full interactive gallery{" "}
                    <PixelIcon name="arrow" size={10} />
                  </a>
                </div>
              </div>
            </div>
            <RefinePromo key={specimenId} specimenId={specimenId} />
          </article>
        </div>
      </div>
    </section>
  );
}
