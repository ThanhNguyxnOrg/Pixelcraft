import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  AGENT_TARGET_COUNT,
  NPM_PKG,
  REPO_URL,
  SKILLS,
  STACKS,
  THESIS,
  TOTAL_GALLERY_EXHIBITS,
  TOTAL_REFERENCES,
  TOTAL_SCRIPTS,
  VERSION,
} from "../data";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "../lib/gsap";
import { useLocale } from "../lib/i18n";
import { PixelLogo } from "./PixelLogo";
import { CopyCommand, PixelIcon, useMotionPause } from "./pixel";

const RES_LABELS: Record<number, string> = {
  1: "1× Avg",
  4: "4× Plan",
  16: "16× Diverge",
  512: "512 Craft",
};

function StackTicker() {
  const track = useRef<HTMLUListElement>(null);
  const { paused } = useMotionPause();
  const tween = useRef<gsap.core.Tween | null>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const syncRef = useRef<(() => void) | null>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      tween.current = gsap.to(track.current, {
        xPercent: -50,
        duration: Math.max(64, Math.round(STACKS.length * 1.4)),
        ease: "none",
        repeat: -1,
        paused: true,
      });
      const st = ScrollTrigger.create({
        trigger: track.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: () => syncRef.current?.(),
      });
      const sync = () => {
        const stop = pausedRef.current || !st.isActive || document.hidden;
        tween.current?.paused(stop);
      };
      syncRef.current = sync;
      document.addEventListener("visibilitychange", sync);
      sync();
      return () => {
        syncRef.current = null;
        document.removeEventListener("visibilitychange", sync);
      };
    });
    return () => mm.revert();
  });

  useEffect(() => {
    syncRef.current?.();
  }, [paused]);

  const items = [...STACKS, ...STACKS];
  return (
    <div className="relative overflow-hidden py-5 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <p className="sr-only">
        Framework coverage includes: {STACKS.join(", ")}.
      </p>
      <ul
        ref={track}
        aria-hidden="true"
        className="flex w-max gap-3 will-change-transform"
      >
        {items.map((s, i) => (
          <li
            key={`${s}-${i}`}
            className="surface rounded-full px-5 py-2.5 font-mono text-[0.875rem] whitespace-nowrap text-ink-muted"
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Masthead() {
  const root = useRef<HTMLElement>(null);
  const { paused } = useMotionPause();
  const { t } = useLocale();
  const reducedMotion = useReducedMotion();
  const [res, setRes] = useState<number>(512);
  const activeChapter = THESIS.find((c) => c.res === res) ?? THESIS[3];

  useGSAP(
    () => {
      if (paused) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Keep H1 visible at frame 0 (opacity: 1) so Core Web Vitals LCP fires immediately while preserving smooth motion.
        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
        });
        tl.from('[data-stage="badge"]', { y: 8, duration: 0.42 });
        tl.from('[data-stage="avg"]', { y: 10, duration: 0.45 }, 0.02);
        tl.from(
          '[data-stage="claim"]',
          { y: 14, duration: 0.52, clearProps: "transform" },
          0.04,
        );
        tl.from(
          '[data-stage="rest"] > *',
          {
            y: 12,
            duration: 0.48,
            stagger: 0.04,
            clearProps: "transform",
          },
          0.12,
        );
        tl.from(
          '[data-stage="stat"]',
          {
            y: 14,
            duration: 0.48,
            stagger: 0.04,
            clearProps: "transform",
          },
          0.18,
        );
        gsap.utils.toArray<HTMLElement>('[data-stage="num"]').forEach((el) => {
          const end = Number(el.dataset.value);
          const o = { v: 0 };
          tl.to(
            o,
            {
              v: end,
              duration: 0.65,
              ease: "power3.out",
              onUpdate: () => {
                el.textContent = String(Math.round(o.v) || end);
              },
            },
            0.18,
          );
        });
        gsap.to('[data-stage="copy"]', {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
        gsap.fromTo(
          '[data-stage="trace"]',
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.4,
            stagger: 0.12,
            ease: "power2.inOut",
            delay: 0.2,
          },
        );
        gsap.from('[data-stage="coordinates"]', {
          opacity: 0,
          y: 8,
          duration: 0.6,
          delay: 0.65,
        });
        gsap.set('[data-stage="signal"]', { opacity: 0.75 });
        const signals = gsap.to('[data-stage="signal"]', {
          strokeDashoffset: -2,
          duration: 10,
          ease: "none",
          stagger: 0.8,
          repeat: -1,
          paused: true,
        });
        const light = gsap.to('[data-stage="light"]', {
          xPercent: 12,
          yPercent: -6,
          scale: 1.08,
          duration: 8,
          stagger: 1.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          paused: true,
        });
        let onscreen = false;
        const sync = () => {
          const stop = !onscreen || document.hidden;
          signals.paused(stop);
          light.paused(stop);
        };
        const visibility = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            onscreen = self.isActive;
            sync();
          },
        });
        onscreen = visibility.isActive;
        document.addEventListener("visibilitychange", sync);
        sync();
        return () => document.removeEventListener("visibilitychange", sync);
      });
      return () => {
        mm.revert();
        root.current
          ?.querySelectorAll<HTMLElement>('[data-stage="num"]')
          .forEach((el) => {
            el.textContent = el.dataset.value ?? "";
          });
      };
    },
    { scope: root, dependencies: [paused], revertOnUpdate: true },
  );

  return (
    <section
      id="masthead"
      ref={root}
      aria-labelledby="masthead-title"
      className="relative isolate overflow-hidden overflow-x-clip"
    >
      {/* Brand light: diagonal streaks + live interactive sampled PixelLogo mark on the right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          data-stage="light"
          className="absolute -start-[30%] -top-[25%] h-[140%] w-[85%] opacity-35 [background:radial-gradient(ellipse_at_center,var(--color-glow-cyan),transparent_64%)]"
        />
        <div
          data-stage="light"
          className="absolute -end-[18%] top-[8%] h-[110%] w-[82%] opacity-40 [background:radial-gradient(ellipse_at_center,var(--color-glow-orchid),transparent_65%)]"
        />
        <div className="absolute inset-0 opacity-35 pixel-field [mask-image:radial-gradient(ellipse_at_70%_45%,black,transparent_70%)]" />
      </div>
      <PixelLogo resolution={res} className="absolute inset-0 -z-10" />
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 -z-10 hidden h-full w-full text-action/15 lg:block"
      >
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <path
            data-stage="trace"
            pathLength="1"
            strokeDasharray="1"
            d="M800 160H1180V240H1270"
          />
          <path
            data-stage="trace"
            pathLength="1"
            strokeDasharray="1"
            d="M830 640H1000V720H1270"
          />
          <path
            data-stage="trace"
            pathLength="1"
            strokeDasharray="1"
            d="M1290 270V560H1200"
          />
        </g>
        <g fill="none" stroke="var(--color-action)" strokeWidth="2">
          {[
            "M800 160H1180V240H1270",
            "M830 640H1000V720H1270",
            "M1290 270V560H1200",
          ].map((d) => (
            <path
              key={d}
              data-stage="signal"
              pathLength="1"
              strokeDasharray="0.08 0.92"
              strokeDashoffset="1"
              opacity="0"
              d={d}
            />
          ))}
        </g>
        <g data-stage="coordinates" fill="currentColor">
          <rect x="795" y="155" width="9" height="9" />
          <rect x="1266" y="715" width="9" height="9" />
        </g>
      </svg>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,var(--color-void)_0%,color-mix(in_oklab,var(--color-void)_70%,transparent)_38%,transparent_60%)] max-lg:bg-[linear-gradient(180deg,transparent_0%,color-mix(in_oklab,var(--color-void)_70%,transparent)_36%,var(--color-void)_60%)]"
      />

      <div className="mx-auto flex min-h-[max(100svh,46rem)] max-w-[88rem] flex-col px-4 pt-[38svh] pb-10 sm:px-8 sm:pt-[42svh] lg:pt-36">
        <div data-stage="copy" className="min-w-0 max-w-[46rem]">
          <p
            data-stage="badge"
            className="surface inline-flex min-h-9 max-w-full items-center gap-2.5 rounded-full py-1.5 ps-3 pe-4 font-mono text-[0.75rem] whitespace-nowrap text-ink-muted backdrop-blur-md sm:text-[0.8125rem]"
          >
            <span
              className="size-2 shrink-0 rounded-full bg-action shadow-[0_0_12px_var(--color-action)]"
              aria-hidden="true"
            />
            <span className="truncate">
              Open source · MIT{" "}
              <span className="max-sm:hidden">· {t.masthead.badgeTail} </span>·
              v{VERSION}
            </span>
          </p>

          <h1
            id="masthead-title"
            className="mt-6 text-[clamp(2.1rem,4.7vw,4.6rem)] leading-[0.98] sm:mt-8"
          >
            <span
              data-stage="avg"
              className="display-light block text-ink-muted"
            >
              {t.masthead.avg}
            </span>
            <span
              data-stage="claim"
              className="display-wide mt-2 block text-ink"
            >
              {t.masthead.claimPrefix}
              <span className="text-action">{t.masthead.claimAccent}</span>
            </span>
          </h1>

          <div data-stage="rest" className="min-w-0">
            <p className="mt-6 max-w-[46ch] text-[1.0625rem] leading-relaxed text-ink-muted sm:mt-7 sm:text-[1.1875rem]">
              {t.masthead.lede}
            </p>
            <div className="mt-7 max-w-[36rem] sm:mt-8">
              <CopyCommand
                variant="featured"
                lines={[`npm i -g ${NPM_PKG}`, "pixelcraft"]}
              />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                data-magnetic
                href={REPO_URL}
                className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-ink px-5 font-mono text-[0.8125rem] font-semibold text-void transition-colors duration-150 hover:bg-action sm:px-6 motion-reduce:transition-none"
              >
                <PixelIcon name="star" size={13} />
                {t.masthead.ctaGithub}
              </a>
              <a
                data-magnetic
                href="#gallery"
                className="surface inline-flex min-h-12 items-center gap-2.5 rounded-full px-5 font-mono text-[0.8125rem] text-ink backdrop-blur-md transition-colors hover:bg-white/10 sm:px-6 motion-reduce:transition-none"
              >
                <PixelIcon name="scan" size={12} />
                {t.masthead.ctaGallery(TOTAL_GALLERY_EXHIBITS)}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-auto grid min-w-0 gap-4 pt-10 sm:pt-12 lg:grid-cols-12 lg:items-end">
          <dl className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-7">
            {(
              [
                [SKILLS.length, t.masthead.stats[0]],
                [TOTAL_REFERENCES, t.masthead.stats[1]],
                [TOTAL_SCRIPTS, t.masthead.stats[2]],
                [AGENT_TARGET_COUNT, t.masthead.stats[3]],
              ] as const
            ).map(([n, l]) => (
              <div
                key={l}
                data-stage="stat"
                className="surface flex min-w-0 flex-col-reverse rounded-tile p-4 backdrop-blur-md sm:p-5"
              >
                <dt className="mt-1.5 font-mono text-[0.75rem] text-ink-faint">
                  {l}
                </dt>
                <dd
                  data-stage="num"
                  data-value={n}
                  className="display-wide text-[clamp(1.75rem,2.6vw,2.5rem)] leading-none tabular"
                >
                  {n}
                </dd>
              </div>
            ))}
          </dl>

          {/* Interactive Resolution Lens: morphs the live PixelLogo canvas across THESIS chapters */}
          <div
            data-stage="stat"
            className="surface min-w-0 rounded-tile p-3.5 backdrop-blur-md lg:col-span-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5">
              <span className="font-pixel text-[0.625rem] tracking-[0.06em] text-action uppercase">
                {t.masthead.resLabel}
              </span>
              <span className="font-mono text-[0.6875rem] text-ink-faint">
                {activeChapter.title}
              </span>
            </div>
            <div
              role="group"
              aria-label="Inspect mark resolution"
              className="grid grid-cols-2 gap-1 rounded-tile bg-void/60 p-1 sm:grid-cols-4 sm:rounded-full"
            >
              {THESIS.map((c) => {
                const selected = c.res === res;
                return (
                  <button
                    key={c.res}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setRes(c.res)}
                    className={`relative min-h-9 rounded-ctl px-2 font-mono text-[0.6875rem] whitespace-nowrap transition-colors sm:rounded-full motion-reduce:transition-none ${
                      selected
                        ? "font-semibold text-on-action"
                        : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    {selected ? (
                      <motion.span
                        layoutId={reducedMotion ? undefined : "stage-res-pill"}
                        aria-hidden="true"
                        transition={
                          reducedMotion
                            ? { duration: 0 }
                            : {
                                type: "spring",
                                stiffness: 440,
                                damping: 32,
                              }
                        }
                        className="pointer-events-none absolute inset-0 rounded-ctl bg-action sm:rounded-full"
                      />
                    ) : null}
                    <span className="relative z-10">
                      {RES_LABELS[c.res] ?? `${c.res}px`}
                    </span>
                  </button>
                );
              })}
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={activeChapter.res}
                initial={reducedMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: reducedMotion ? 0 : 0.16 }}
                className="mt-2.5 text-[0.75rem] leading-snug text-ink-muted"
              >
                {activeChapter.body}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <StackTicker />
    </section>
  );
}
