import { useEffect, useRef, useState } from "react";
import logoUrl from "../assets/pixelcraft-logo-256.png";
import { motion, useScroll, useSpring } from "motion/react";
import { NPM_PKG, REPO_URL, VERSION } from "../data";
import {
  CopyCommand,
  EvidenceStamp,
  PixelIcon,
  PixelLabel,
  useMotionPause,
} from "./pixel";
import { useMediaPlayback } from "../lib/useMediaPlayback";

const NAV = [
  ["#film", "Film"],
  ["#gallery", "Gallery"],
  ["#loop", "Loop"],
  ["#tools", "Tools"],
  ["#skills", "Skills"],
  ["#floor", "Floor"],
  ["#install", "Install"],
];

/** Thin reading-progress line. Scroll-linked, so it is the one place motion tracks the user directly. */
function Progress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.4,
  });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: x }}
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-[linear-gradient(90deg,var(--color-glow-cyan),var(--color-glow-magenta),var(--color-glow-orange))]"
    />
  );
}

export function Header() {
  const { paused, setPaused } = useMotionPause();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Escape closes the mobile menu and returns focus to its button.
  useEffect(() => {
    if (!open) return;
    const on = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-3 z-40 px-3 sm:top-4 sm:px-6">
      <Progress />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-action focus:px-4 focus:py-2 focus:text-on-action"
      >
        Skip to content
      </a>
      <div
        className={`gborder mx-auto flex h-14 max-w-[72rem] items-center gap-3 rounded-full px-2.5 backdrop-blur-xl transition-colors duration-200 motion-reduce:transition-none ${scrolled ? "bg-void/80 shadow-lift" : "bg-void/50"}`}
      >
        <a
          href="#top"
          className="flex items-center gap-3 ps-2"
          aria-label="Pixelcraft, back to top"
        >
          <img
            src={logoUrl}
            alt=""
            width={30}
            height={30}
            className="size-[30px]"
          />
          <span className="font-pixel text-[1rem] font-bold tracking-[0.04em] max-[359px]:hidden">
            PIXELCRAFT
          </span>
        </a>
        <nav aria-label="Sections" className="ms-auto hidden xl:block">
          <ul className="flex items-center">
            {NAV.map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  className="inline-flex min-h-10 items-center rounded-full px-3.5 text-[0.9375rem] text-ink-muted transition-colors hover:bg-white/8 hover:text-ink motion-reduce:transition-none"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          onClick={() => setPaused(!paused)}
          aria-pressed={paused}
          title={paused ? "Resume page motion" : "Pause page motion"}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white/8 text-ink-muted transition-colors hover:bg-white/14 hover:text-ink max-xl:ms-auto motion-reduce:transition-none"
        >
          <PixelIcon name={paused ? "play" : "pause"} size={12} />
          <span className="sr-only">
            {paused ? "Resume page motion" : "Pause page motion"}
          </span>
        </button>
        <a
          href={REPO_URL}
          className="inline-flex min-h-10 items-center gap-2 rounded-full bg-action px-5 font-mono text-[0.8125rem] font-medium text-on-action shadow-glow-action transition-[background-color,transform] duration-150 hover:bg-ink active:scale-[0.97] motion-reduce:transition-none"
        >
          <PixelIcon name="star" size={12} />
          <span className="max-sm:sr-only">GitHub</span>
        </a>
        <button
          ref={btnRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
          className="inline-flex size-10 items-center justify-center rounded-full bg-white/8 hover:bg-white/14 xl:hidden"
        >
          <PixelIcon name={open ? "close" : "plus"} size={14} />
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>
      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Sections"
          className="gborder surface mx-auto mt-2 max-h-[calc(100dvh-5.5rem)] max-w-[72rem] overflow-x-hidden overflow-y-auto overscroll-contain rounded-card bg-void/95 backdrop-blur-xl xl:hidden"
        >
          <ul className="grid p-2">
            {NAV.map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center rounded-tile px-4 text-[1.0625rem] text-ink hover:bg-white/8"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

function LoopBackdrop() {
  const ref = useRef<HTMLVideoElement>(null);
  const { paused } = useMotionPause();
  useMediaPlayback(ref, paused);

  return (
    <video
      ref={ref}
      className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35"
      poster="/media/pixelcraft-loop.jpg"
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src="/media/pixelcraft-loop.webm" type="video/webm" />
      <source src="/media/pixelcraft-loop.mp4" type="video/mp4" />
    </video>
  );
}

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-void">
      <LoopBackdrop />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 [background:linear-gradient(180deg,var(--color-void),color-mix(in_oklab,var(--color-void)_55%,transparent)_40%,var(--color-void)_100%)]"
      />
      <div className="mx-auto max-w-[88rem] px-5 pt-32 sm:px-8 lg:pt-44">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="min-w-0 lg:col-span-7">
            <PixelLabel>Next step</PixelLabel>
            <h2
              data-split
              className="mt-6 max-w-[14ch] display-wide text-[clamp(2.5rem,6.4vw,5.75rem)] leading-[0.92]"
            >
              Install it. Then make your agent show its work.
            </h2>
          </div>
          <div className="min-w-0 lg:col-span-5">
            <CopyCommand variant="hero" lines={[`npx ${NPM_PKG}`]} />
          </div>
        </div>

        <div className="mt-28 grid gap-12 border-t border-line pt-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="max-w-[36ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              Portable Agent Skills for distinctive, evidence-verified UI and
              rigorous UX across frontend stacks.
            </p>
            <p className="mt-5 font-mono text-[0.8125rem] text-ink-faint">
              v{VERSION} · MIT License · © 2026 Pixelcraft contributors
            </p>
            <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem]">
              <a
                href={REPO_URL}
                className="inline-flex items-center gap-2 text-ink underline decoration-line-strong underline-offset-4 hover:decoration-action"
              >
                GitHub <PixelIcon name="external" size={10} />
              </a>
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <h2 className="font-pixel text-[0.75rem] text-ink-faint uppercase">
              Report for this page
            </h2>
            <ul className="mt-5 grid gap-3.5 text-[0.9375rem] text-ink-muted">
              <li className="flex flex-wrap items-baseline gap-3">
                <EvidenceStamp label="rendered" />
                <span>
                  Gallery pages were captured in Chromium at 1440 × 900; film
                  stills were inspected before the full render.
                </span>
              </li>
              <li className="flex flex-wrap items-baseline gap-3">
                <EvidenceStamp label="static" />
                <span>
                  Every gallery score is slop-scan.mjs output
                  (scripts/capture-gallery.mjs). Counts and commands come from
                  the repo and the installer’s own --help.
                </span>
              </li>
              <li className="flex flex-wrap items-baseline gap-3">
                <EvidenceStamp label="model-judgment" />
                <span>
                  Direction scores and the notes on visual quality are editorial
                  judgment, not measurements.
                </span>
              </li>
              <li className="flex flex-wrap items-baseline gap-3">
                <EvidenceStamp label="waived" />
                <span>
                  The supplied pixel identity and directional light are
                  retained; the palette is a deliberate brand choice.
                </span>
              </li>
              <li className="flex flex-wrap items-baseline gap-3">
                <EvidenceStamp label="not-checked" />
                <span>
                  Physical devices, manual screen-reader use, and field Core Web
                  Vitals.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="mt-24 overflow-hidden pb-[1.5vw] text-center display-wide text-[clamp(3rem,12.2vw,14rem)] leading-[0.82] whitespace-nowrap text-raised/80 select-none"
      >
        PIXELCRAFT
      </p>
    </footer>
  );
}
