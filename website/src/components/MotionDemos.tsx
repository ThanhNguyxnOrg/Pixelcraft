import { useRef } from "react";
import { GALLERY, NPM_PKG, SKILLS } from "../data";
import { usePromoMotion } from "../lib/usePromoMotion";
import { PixelLabel } from "./pixel";

const frame =
  "gborder relative isolate overflow-hidden rounded-card border border-line bg-deep";

function PackPromo() {
  const root = useRef<HTMLDivElement>(null);
  usePromoMotion(root, (tl) => {
    tl.fromTo(
      "[data-pack-scene]",
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
      0,
    )
      .fromTo(
        "[data-pack-command]",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.55 },
        0.2,
      )
      .fromTo(
        "[data-pack-dot]",
        { opacity: 0.12, scale: 0.4 },
        {
          opacity: 1,
          scale: 1,
          stagger: 0.035,
          duration: 0.45,
          ease: "back.out(1.5)",
        },
        1,
      )
      .fromTo(
        "[data-pack-rule]",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "power2.inOut" },
        1.3,
      )
      .fromTo(
        "[data-pack-ready]",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.45 },
        2.3,
      )
      .to("[data-pack-scene]", { opacity: 0, duration: 0.35 }, 5.4);
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
          <span className="text-action">$</span> npx {NPM_PKG}
          <br />
          <span className="ps-4 text-ink-muted">add all --agent claude</span>
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
        <div data-pack-rule className="h-px origin-left bg-action/30" />
        <div
          data-pack-ready
          className="mt-4 flex flex-wrap items-center justify-between gap-2 font-mono text-[0.6875rem] text-ink-muted"
        >
          <span className="text-action">
            {SKILLS.length} skills. One toolkit.
          </span>
          <span>YOUR AGENT, UPGRADED</span>
        </div>
      </div>
    </div>
  );
}

function DirectionPromo() {
  const root = useRef<HTMLDivElement>(null);
  usePromoMotion(root, (tl) => {
    tl.fromTo(
      "[data-direction-scene]",
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
      0,
    )
      .fromTo(
        "[data-direction-card]",
        { y: 56, opacity: 0, scale: 0.87 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.85,
          stagger: 0.13,
          ease: "expo.out",
        },
        0.2,
      )
      .fromTo(
        "[data-roast-curve]",
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" },
        1.1,
      )
      .to(
        "[data-direction-other]",
        { opacity: 0.32, y: 9, scale: 0.95, duration: 0.65 },
        2.8,
      )
      .to(
        "[data-direction-pick]",
        {
          y: -10,
          rotation: 0,
          scale: 1.04,
          duration: 0.75,
          ease: "power3.inOut",
        },
        2.8,
      )
      .fromTo(
        "[data-direction-note]",
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        3.2,
      )
      .to(
        "[data-direction-scene], [data-direction-note]",
        { opacity: 0, duration: 0.4 },
        5.8,
      );
  });
  return (
    <div
      ref={root}
      data-promo="direction"
      aria-hidden="true"
      className={`${frame} aspect-[1.5] min-h-72`}
    >
      <div className="absolute inset-x-5 top-4 flex justify-between font-mono text-[0.625rem] tracking-wider text-ink-faint">
        <span>ONE COFFEE BRIEF</span>
        <span>THREE STUDIES</span>
      </div>
      <div data-direction-scene className="absolute inset-0">
        <div
          data-direction-card
          data-direction-other
          className="absolute start-[6%] top-[25%] h-[57%] w-[42%] -rotate-9 rounded-tile bg-paper p-[5%] text-paper-ink shadow-lift"
        >
          <p className="font-mono text-[0.6rem] uppercase">Data-led</p>
          <p className="mt-3 font-mono text-[clamp(1.3rem,3vw,2.5rem)] leading-none">
            ROAST
            <br />
            042.
          </p>
          <svg viewBox="0 0 180 65" className="mt-5 w-full" fill="none">
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
        </div>
        <div
          data-direction-card
          data-direction-other
          className="absolute start-[30%] top-[18%] h-[57%] w-[42%] rotate-2 rounded-tile border border-line-strong bg-panel p-[5%] text-glow-orange shadow-lift"
        >
          <p className="font-mono text-[0.6rem] uppercase">Editorial</p>
          <p className="mt-4 display-condensed text-[clamp(2rem,5vw,4.5rem)] leading-[.8]">
            FIELD
            <br />
            NOTES.
          </p>
          <span className="mt-5 block h-px w-3/4 bg-current" />
          <span className="mt-2 block h-px w-1/2 bg-current opacity-40" />
        </div>
        <div
          data-direction-card
          data-direction-pick
          className="absolute start-[51%] top-[29%] z-10 h-[57%] w-[42%] rotate-9 rounded-tile bg-action p-[5%] text-on-action shadow-lift"
        >
          <p className="font-mono text-[0.6rem] uppercase">Bold & direct</p>
          <p className="mt-4 display-wide text-[clamp(1.3rem,3.2vw,2.75rem)] leading-[.88]">
            GOOD
            <br />
            MORN-
            <br />
            INGS.
          </p>
          <span className="absolute bottom-[9%] start-[12%] size-3 rounded-full border-2 border-current" />
        </div>
      </div>
      <div
        data-direction-note
        className="absolute inset-x-0 bottom-3 text-center font-mono text-[0.625rem] tracking-wider text-action"
      >
        A CHOICE. NOT AN AVERAGE.
      </div>
    </div>
  );
}

function RefinePromo() {
  const root = useRef<HTMLDivElement>(null);
  const specimen = GALLERY[0];
  usePromoMotion(root, (tl) => {
    tl.fromTo(
      "[data-refine-after]",
      { clipPath: "inset(0 0 0 100%)" },
      { clipPath: "inset(0 0 0 0%)", duration: 2.4, ease: "power2.inOut" },
      0.8,
    )
      .fromTo(
        "[data-refine-divider]",
        { left: "100%" },
        { left: "0%", duration: 2.4, ease: "power2.inOut" },
        0.8,
      )
      .to(
        "[data-refine-after]",
        { clipPath: "inset(0 0 0 100%)", duration: 1.5, ease: "power2.inOut" },
        5,
      )
      .to(
        "[data-refine-divider]",
        { left: "100%", duration: 1.5, ease: "power2.inOut" },
        5,
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
        loading="lazy"
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
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
      <span
        data-promo-label
        className="absolute start-3 top-3 rounded-full bg-void px-3 py-1.5 font-mono text-[0.625rem] text-ink"
      >
        DEFAULT
      </span>
      <span
        data-promo-label
        className="absolute end-3 top-3 rounded-full bg-action px-3 py-1.5 font-mono text-[0.625rem] text-on-action"
      >
        WITH PIXELCRAFT
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
              className="mt-5 max-w-[17ch] display-wide text-[clamp(2rem,4.4vw,4rem)] leading-[.98]"
            >
              Less default.
              <br />
              <span className="text-action">More deliberate.</span>
            </h2>
          </div>
          <p className="max-w-[34ch] text-[0.9375rem] leading-relaxed text-ink-muted">
            Three small studies. One design loop. Authored illustrations, not
            live AI runs.
          </p>
        </div>
        <div className="grid gap-x-7 gap-y-14 lg:grid-cols-2">
          <article className="min-w-0">
            <PackPromo />
            <div className="mt-5 flex gap-4">
              <span className="pt-1 font-mono text-xs text-action">01 /</span>
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
              <span className="pt-1 font-mono text-xs text-action">02 /</span>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">
                  Explore before you commit.
                </h3>
                <p className="mt-2 max-w-[43ch] text-sm leading-relaxed text-ink-muted">
                  Different type, rhythm and composition. Three fictional coffee
                  sketches, not three recolors.
                </p>
              </div>
            </div>
          </article>
          <article className="grid min-w-0 items-center gap-7 border-t border-line pt-10 lg:col-span-2 lg:grid-cols-[.7fr_1.3fr] lg:gap-14">
            <div className="flex gap-4">
              <span className="pt-1 font-mono text-xs text-action">03 /</span>
              <div>
                <h3 className="max-w-[15ch] display-wide text-[clamp(1.75rem,3vw,2.75rem)] leading-none">
                  Same brief.
                  <br />A different standard.
                </h3>
                <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-ink-muted">
                  The actual before-and-after roaster specimen. Inspect the full
                  comparison and its evidence below.
                </p>
                <a
                  href="#gallery"
                  className="mt-5 inline-flex min-h-11 items-center gap-3 font-mono text-xs text-action underline underline-offset-4"
                >
                  Explore the gallery <span aria-hidden="true">↘</span>
                </a>
              </div>
            </div>
            <RefinePromo />
          </article>
        </div>
      </div>
    </section>
  );
}
