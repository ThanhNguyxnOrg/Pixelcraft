import { useEffect, useRef, useState } from "react";
import logoUrl from "../assets/pixelcraft-logo-256.png";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { GALLERY, NPM_PKG, REPO_URL, VERSION } from "../data";
import {
  CopyCommand,
  EvidenceStamp,
  PixelIcon,
  PixelLabel,
  useMotionPause,
  type IconName,
} from "./pixel";
import { publicUrl } from "../lib/publicUrl";
import { useMediaPlayback } from "../lib/useMediaPlayback";

const NAV: [string, string][] = [
  ["#film", "Demos"],
  ["#gallery", "Gallery"],
  ["#loop", "Loop"],
  ["#tools", "Tools"],
  ["#skills", "Skills"],
  ["#floor", "Floor"],
  ["#install", "Install"],
];

const MOBILE_DOCK: { href: string; short: string; icon: IconName }[] = [
  { href: "#film", short: "Demos", icon: "play" },
  { href: "#gallery", short: "Proofs", icon: "grid" },
  { href: "#loop", short: "Loop", icon: "loop" },
  { href: "#skills", short: "Skills", icon: "search" },
  { href: "#install", short: "Install", icon: "arrow" },
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
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const reducedMotion = useReducedMotion();
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const on = () => {
      setScrolled(window.scrollY > 24);
      if (window.scrollY < 260) setActive("");
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const ids = NAV.map(([href]) => href.slice(1));
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (window.scrollY < 260) return;
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(`#${hit.target.id}`);
      },
      { rootMargin: "-22% 0px -55% 0px", threshold: [0, 0.15, 0.4] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

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
    <>
      <header className="fixed inset-x-0 top-3 z-40 px-3 sm:top-4 sm:px-6">
        <Progress />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-action focus:px-4 focus:py-2 focus:text-on-action"
        >
          Skip to content
        </a>
        <div
          className={`gborder mx-auto flex h-14 max-w-[74rem] items-center gap-2.5 rounded-full px-2.5 backdrop-blur-xl transition-colors duration-200 sm:gap-3 motion-reduce:transition-none ${scrolled ? "bg-void/90 shadow-lift" : "bg-void/65"}`}
        >
          <a
            href="#top"
            onClick={() => setActive("")}
            className="flex min-h-10 items-center gap-2.5 ps-2"
            aria-label="Pixelcraft, back to top"
          >
            <img
              src={logoUrl}
              alt=""
              width={30}
              height={30}
              className="size-[28px] shrink-0 sm:size-[30px]"
            />
            <span className="font-pixel text-[0.875rem] font-bold tracking-[0.04em] max-[359px]:sr-only sm:text-[1rem]">
              PIXELCRAFT
            </span>
          </a>
          <nav aria-label="Sections" className="ms-auto hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {NAV.map(([href, label]) => {
                const current = active === href;
                return (
                  <li key={href}>
                    <a
                      href={href}
                      aria-current={current ? "location" : undefined}
                      onClick={() => setActive(href)}
                      className={`relative inline-flex min-h-10 items-center rounded-full px-3.5 text-[0.9375rem] transition-colors motion-reduce:transition-none ${
                        current
                          ? "text-ink"
                          : "text-ink-muted hover:bg-white/6 hover:text-ink"
                      }`}
                    >
                      {current ? (
                        <motion.span
                          layoutId={
                            reducedMotion ? undefined : "header-nav-pill"
                          }
                          aria-hidden="true"
                          transition={
                            reducedMotion
                              ? { duration: 0 }
                              : {
                                  type: "spring",
                                  stiffness: 420,
                                  damping: 34,
                                  mass: 0.7,
                                }
                          }
                          className="pointer-events-none absolute inset-0 rounded-full bg-white/10 ring-1 ring-action/35"
                        />
                      ) : null}
                      <span className="relative z-10">{label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          <a
            data-magnetic
            href={REPO_URL}
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-action px-3.5 font-mono text-[0.8125rem] font-semibold text-on-action shadow-glow-action transition-[background-color,transform] duration-150 hover:bg-ink active:scale-[0.97] max-xl:ms-auto sm:px-5 motion-reduce:transition-none"
          >
            <PixelIcon name="star" size={12} />
            <span>GitHub</span>
          </a>
          <button
            ref={btnRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-white/8 px-3 font-mono text-[0.75rem] text-ink hover:bg-white/14 xl:hidden"
          >
            <PixelIcon name={open ? "close" : "menu"} size={13} />
            <span className="max-[359px]:sr-only">
              {open ? "Close" : "Menu"}
            </span>
            <span className="min-[360px]:sr-only">
              {open ? "Close menu" : "Open menu"}
            </span>
          </button>
        </div>
        {open ? (
          <>
            <div
              aria-hidden="true"
              onClick={() => setOpen(false)}
              className="fixed inset-0 -z-10 bg-void/75 xl:hidden"
            />
            <nav
              id="mobile-nav"
              aria-label="Sections"
              className="gborder mx-auto mt-2 max-h-[calc(100dvh-9.5rem)] max-w-[74rem] overflow-x-hidden overflow-y-auto overscroll-contain rounded-card bg-void text-ink shadow-lift xl:hidden"
            >
              <ul className="grid gap-1 p-2 sm:grid-cols-2">
                {NAV.map(([href, label]) => (
                  <li key={href}>
                    <a
                      href={href}
                      onClick={() => {
                        setActive(href);
                        setOpen(false);
                      }}
                      className={`flex min-h-12 items-center justify-between rounded-tile px-4 text-[1.02rem] hover:bg-white/8 ${
                        active === href ? "bg-white/8 text-action" : "text-ink"
                      }`}
                    >
                      <span>{label}</span>
                      {active === href ? (
                        <span className="size-2 rounded-full bg-action" />
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </>
        ) : null}
      </header>

      {/* Mobile & tablet thumb-zone bottom navigation dock */}
      <nav
        aria-label="Quick mobile navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line-strong bg-void/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-xl xl:hidden"
      >
        <ul className="mx-auto grid max-w-[36rem] grid-cols-5 px-1">
          {MOBILE_DOCK.map((item) => {
            const current = active === item.href;
            return (
              <li key={item.href} className="min-w-0">
                <a
                  href={item.href}
                  onClick={() => setActive(item.href)}
                  aria-current={current ? "location" : undefined}
                  className={`relative flex min-h-[3.5rem] flex-col items-center justify-center gap-1 px-1 py-1.5 font-mono text-[0.6875rem] font-medium transition-colors motion-reduce:transition-none ${
                    current ? "text-action" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {current ? (
                    <motion.span
                      layoutId={reducedMotion ? undefined : "mobile-dock-bar"}
                      aria-hidden="true"
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 420, damping: 34 }
                      }
                      className="absolute inset-x-3 top-0 h-[2px] rounded-full bg-action"
                    />
                  ) : null}
                  <PixelIcon name={item.icon} size={14} />
                  <span className="leading-none">{item.short}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
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
      poster={publicUrl("media/pixelcraft-loop.jpg")}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={publicUrl("media/pixelcraft-loop.mp4")} type="video/mp4" />
      <source src={publicUrl("media/pixelcraft-loop.webm")} type="video/webm" />
    </video>
  );
}

export function Footer() {
  const { paused, setPaused } = useMotionPause();
  return (
    <footer className="relative isolate overflow-hidden bg-void">
      <LoopBackdrop />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 [background:linear-gradient(180deg,var(--color-void),color-mix(in_oklab,var(--color-void)_55%,transparent)_40%,var(--color-void)_100%)]"
      />
      <div className="mx-auto max-w-[88rem] px-4 pt-24 sm:px-8 sm:pt-32 lg:pt-44">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="min-w-0 lg:col-span-7">
            <PixelLabel>Next step</PixelLabel>
            <h2
              data-split
              className="mt-5 max-w-[14ch] display-wide text-[clamp(2.2rem,6.4vw,5.75rem)] leading-[0.94]"
            >
              Install it. Then make your agent show its work.
            </h2>
          </div>
          <div className="min-w-0 lg:col-span-5">
            <CopyCommand
              variant="featured"
              lines={[`npm i -g ${NPM_PKG}`, "pixelcraft"]}
            />
          </div>
        </div>

        <div className="mt-20 grid min-w-0 gap-12 border-t border-line pt-12 sm:mt-28 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-4">
            <p className="max-w-[36ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              Portable Agent Skills for distinctive, evidence-verified UI and
              rigorous UX across frontend stacks.
            </p>
            <p className="mt-5 font-mono text-[0.8125rem] text-ink-faint">
              v{VERSION} · MIT License · © 2026 Pixelcraft contributors
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-[0.9375rem]">
              <a
                href={REPO_URL}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-panel px-4 font-mono text-[0.8125rem] text-ink transition-colors hover:border-action hover:text-action motion-reduce:transition-none"
              >
                GitHub <PixelIcon name="external" size={10} />
              </a>
              <button
                type="button"
                aria-pressed={paused}
                onClick={() => setPaused(!paused)}
                className="surface inline-flex min-h-10 items-center gap-2 rounded-full px-4 font-mono text-[0.75rem] text-ink-muted transition-colors hover:bg-white/10 hover:text-ink motion-reduce:hidden"
              >
                <PixelIcon name={paused ? "play" : "pause"} size={11} />
                {paused ? "Resume page motion" : "Pause page motion"}
              </button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7 lg:col-start-6">
            <h2 className="font-pixel text-[0.75rem] text-ink-faint uppercase">
              Report for this page
            </h2>
            <ul className="mt-5 grid gap-3.5 text-[0.9375rem] text-ink-muted">
              <li className="flex flex-wrap items-baseline gap-3">
                <EvidenceStamp label="rendered" />
                <span>
                  All {GALLERY.length} gallery pages captured in Chromium at
                  1440 × 900 and audited across 320px–1440px responsive
                  viewports. Promo studies are authored illustrations, not live
                  AI runs.
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
        className="mt-20 flex justify-center overflow-hidden pb-[1.5vw] display-wide text-[clamp(3rem,12.2vw,14rem)] leading-[0.82] whitespace-nowrap text-raised/80 select-none sm:mt-24"
      >
        PIXELCRAFT
      </p>
    </footer>
  );
}
