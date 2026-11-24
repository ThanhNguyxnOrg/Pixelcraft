import { useEffect, useRef, useState } from "react";
import logoUrl from "../assets/pixelcraft-logo-256.png";
import { REPO_URL, VERSION } from "../data";
import { EvidenceStamp, PixelIcon } from "./pixel";

const NAV = [
  ["#gallery", "Gallery"],
  ["#process", "Loop & Floor"],
  ["#skills", "Skills"],
  ["#tools", "Tools"],
  ["#install", "Install"],
  ["#faq", "FAQ"],
];

/** Scroll-linked reading progress bar. Tracks user scroll directly with zero autonomous motion. */
function Progress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const span = Math.max(1, doc.scrollHeight - window.innerHeight);
      const ratio = Math.min(1, Math.max(0, window.scrollY / span));
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${ratio})`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      style={{ transform: "scaleX(0)" }}
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-[inline-start] bg-action"
    />
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
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
    <header className="fixed inset-x-0 top-3 z-40 px-3 sm:top-4 sm:px-6">
      <Progress />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-action focus:px-4 focus:py-2 focus:text-on-action"
      >
        Skip to content
      </a>
      <div
        className={`mx-auto flex h-14 max-w-[74rem] items-center gap-3 rounded-full border border-line px-2.5 backdrop-blur-md transition-colors duration-200 motion-reduce:transition-none ${
          scrolled ? "bg-void/92 shadow-lift" : "bg-void/78"
        }`}
      >
        <a
          href="#top"
          className="flex items-center gap-2.5 ps-2"
          aria-label="Pixelcraft, back to top"
        >
          <img
            src={logoUrl}
            alt=""
            width={28}
            height={28}
            className="size-[28px]"
          />
          <span className="font-pixel text-[0.9375rem] font-bold tracking-[0.04em] max-[359px]:hidden">
            PIXELCRAFT
          </span>
        </a>
        <nav aria-label="Sections" className="ms-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  className="inline-flex min-h-10 items-center rounded-full px-3.5 text-[0.9375rem] text-ink-muted transition-colors hover:bg-raised hover:text-ink motion-reduce:transition-none"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={REPO_URL}
          className="inline-flex min-h-10 items-center gap-2 rounded-full bg-action px-4 font-mono text-[0.8125rem] font-medium text-on-action transition-colors duration-150 hover:bg-ink max-lg:ms-auto motion-reduce:transition-none"
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
          className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-panel hover:border-action lg:hidden"
        >
          <PixelIcon name={open ? "close" : "plus"} size={14} />
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>
      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile sections"
          className="mx-auto mt-2 max-h-[calc(100dvh-5.5rem)] max-w-[74rem] overflow-y-auto rounded-card border border-line bg-void text-ink shadow-lift lg:hidden"
        >
          <ul className="grid p-2">
            {NAV.map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center rounded-tile px-4 text-[1rem] text-ink hover:bg-panel"
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

export function Footer() {
  return (
    <footer className="border-t border-line bg-deep">
      <div className="mx-auto max-w-[84rem] px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-pixel text-[0.875rem] tracking-[0.04em] text-ink">
              PIXELCRAFT
            </p>
            <p className="mt-3 max-w-[36ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              Portable Agent Skills for distinctive, evidence-verified UI and
              rigorous UX across web, mobile, desktop, terminal, document,
              email, data, spatial, and game stacks.
            </p>
            <p className="mt-4 font-mono text-[0.8125rem] text-ink-faint">
              v{VERSION} · MIT License · Zero-dependency CLI &amp; scripts
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.8125rem]">
              <a
                href={REPO_URL}
                className="inline-flex items-center gap-1.5 text-ink underline decoration-line-strong underline-offset-4 hover:decoration-action"
              >
                GitHub <PixelIcon name="external" size={10} />
              </a>
              <a
                href={`${REPO_URL}/blob/main/docs/ARCHITECTURE.md`}
                className="inline-flex items-center gap-1.5 text-ink-muted underline decoration-line underline-offset-4 hover:text-ink hover:decoration-action"
              >
                Architecture <PixelIcon name="external" size={10} />
              </a>
              <a
                href={`${REPO_URL}/blob/main/docs/DESIGN-RATIONALE.md`}
                className="inline-flex items-center gap-1.5 text-ink-muted underline decoration-line underline-offset-4 hover:text-ink hover:decoration-action"
              >
                Rationale <PixelIcon name="external" size={10} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <h2 className="font-mono text-[0.8125rem] font-medium text-ink">
              Verification report for this page
            </h2>
            <ul className="mt-4 grid gap-3 text-[0.875rem] text-ink-muted">
              <li className="flex flex-wrap items-baseline gap-2.5">
                <EvidenceStamp label="rendered" />
                <span>
                  All 6 multi-stack gallery exhibits were captured in Chromium
                  at 1440 × 900. Fixtures are fictional reference specimens, not
                  live production client screenshots.
                </span>
              </li>
              <li className="flex flex-wrap items-baseline gap-2.5">
                <EvidenceStamp label="static" />
                <span>
                  Every gallery score and pin is emitted by slop-scan.mjs; skill
                  counts, references, scripts, and CLI flags are synced from the
                  repository.
                </span>
              </li>
              <li className="flex flex-wrap items-baseline gap-2.5">
                <EvidenceStamp label="model-judgment" />
                <span>
                  Direction scores and qualitative critique notes are editorial
                  judgment, not mechanical measurements.
                </span>
              </li>
              <li className="flex flex-wrap items-baseline gap-2.5">
                <EvidenceStamp label="waived" />
                <span>
                  The project’s owned petrol-and-mint pixel palette is preserved
                  by explicit brand authority.
                </span>
              </li>
              <li className="flex flex-wrap items-baseline gap-2.5">
                <EvidenceStamp label="not-checked" />
                <span>
                  Physical hardware devices, manual screen-reader sessions, and
                  field Core Web Vitals.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
