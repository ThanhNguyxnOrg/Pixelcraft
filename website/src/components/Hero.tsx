import { useEffect, useRef } from "react";
import {
  NPM_PKG,
  REPO_URL,
  SKILLS,
  STACKS,
  TOTAL_REFERENCES,
  TOTAL_SCRIPTS,
  VERSION,
} from "../data";
import {
  gsap,
  MOTION_OK,
  ScrollTrigger,
  SplitText,
  useGSAP,
} from "../lib/gsap";
import { PixelLogo } from "./PixelLogo";
import { CopyCommand, PixelIcon, useMotionPause } from "./pixel";

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
        duration: 64,
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
        tween.current?.paused(
          !st.isActive || document.hidden || pausedRef.current,
        );
      };
      syncRef.current = sync;
      document.addEventListener("visibilitychange", sync);
      sync();
      return () => {
        st.kill();
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

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { paused } = useMotionPause();

  useGSAP(
    () => {
      if (paused) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          delay: 0.15,
        });
        tl.from('[data-hero="badge"]', { y: 16, opacity: 0, duration: 0.8 });
        tl.from('[data-hero="avg"]', { opacity: 0, y: 12, duration: 0.7 }, 0.1);
        SplitText.create('[data-hero="claim"]', {
          type: "lines,words",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.words, {
              yPercent: 110,
              rotate: 2,
              duration: 1,
              stagger: 0.055,
              delay: 0.25,
              ease: "expo.out",
            }),
        });
        tl.from(
          '[data-hero="rest"] > *',
          { y: 28, opacity: 0, duration: 1, stagger: 0.08 },
          0.75,
        );
        tl.from(
          '[data-hero="stat"]',
          { y: 30, opacity: 0, duration: 1, stagger: 0.07 },
          0.95,
        );
        // Counters run once with the entrance.
        gsap.utils.toArray<HTMLElement>('[data-hero="num"]').forEach((el) => {
          const end = Number(el.dataset.value);
          const o = { v: 0 };
          tl.to(
            o,
            {
              v: end,
              duration: 0.9,
              ease: "power3.out",
              onUpdate: () => {
                el.textContent = String(Math.round(o.v) || end);
              },
            },
            0.9,
          );
        });
        // The copy block lifts slightly slower than the page, so the hero has depth.
        gsap.to('[data-hero="copy"]', {
          y: -44,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
        gsap.fromTo(
          '[data-hero="trace"]',
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.8,
            stagger: 0.14,
            ease: "power2.inOut",
            delay: 0.4,
          },
        );
        gsap.from('[data-hero="coordinates"]', {
          opacity: 0,
          y: 8,
          duration: 0.8,
          delay: 1.2,
        });
      });
      return () => {
        mm.revert();
        root.current
          ?.querySelectorAll<HTMLElement>('[data-hero="num"]')
          .forEach((el) => {
            el.textContent = el.dataset.value ?? "";
          });
      };
    },
    { scope: root, dependencies: [paused], revertOnUpdate: true },
  );

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden"
    >
      {/* Brand light: diagonal streaks from assets/originals/pixelcraft-theme.png, plus the live mark. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute -start-[24%] -top-[34%] h-[170%] w-[34%] -skew-x-[24deg] opacity-25 blur-[90px] [background:linear-gradient(180deg,var(--color-glow-cyan),var(--color-glow-blue)_45%,transparent)]" />
        <div className="absolute -end-[16%] top-[10%] h-[150%] w-[44%] -skew-x-[24deg] opacity-30 blur-[100px] [background:linear-gradient(0deg,var(--color-glow-magenta),var(--color-glow-violet)_55%,transparent)]" />
        <div className="absolute inset-0 opacity-35 pixel-field [mask-image:radial-gradient(ellipse_at_70%_45%,black,transparent_70%)]" />
      </div>
      <PixelLogo className="absolute inset-0 -z-10" />
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 -z-10 hidden h-full w-full text-action/15 lg:block"
      >
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <path
            data-hero="trace"
            pathLength="1"
            strokeDasharray="1"
            d="M800 160H1180V240H1270"
          />
          <path
            data-hero="trace"
            pathLength="1"
            strokeDasharray="1"
            d="M830 640H1000V720H1270"
          />
          <path
            data-hero="trace"
            pathLength="1"
            strokeDasharray="1"
            d="M1290 270V560H1200"
          />
        </g>
        <g data-hero="coordinates" fill="currentColor">
          <rect x="795" y="155" width="9" height="9" />
          <rect x="1266" y="715" width="9" height="9" />
        </g>
      </svg>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,var(--color-void)_0%,color-mix(in_oklab,var(--color-void)_70%,transparent)_38%,transparent_60%)] max-lg:bg-[linear-gradient(180deg,transparent_0%,color-mix(in_oklab,var(--color-void)_70%,transparent)_36%,var(--color-void)_60%)]"
      />

      <div className="mx-auto flex min-h-[max(100svh,48rem)] max-w-[88rem] flex-col px-5 pt-[44svh] pb-10 sm:px-8 lg:pt-40">
        <div data-hero="copy" className="max-w-[46rem]">
          <p
            data-hero="badge"
            className="surface inline-flex min-h-9 items-center gap-3 rounded-full py-1.5 ps-3 pe-4 font-mono text-[0.8125rem] text-ink-muted backdrop-blur-md"
          >
            <span
              className="size-2 rounded-full bg-action shadow-[0_0_12px_var(--color-action)]"
              aria-hidden="true"
            />
            Open source · MIT · Agent Skills · v{VERSION}
          </p>

          <h1
            id="hero-title"
            className="mt-9 text-[clamp(2.4rem,4.7vw,4.6rem)] leading-[0.98]"
          >
            <span
              data-hero="avg"
              className="display-light block text-ink-muted"
            >
              Agents design the average.
            </span>
            <span
              data-hero="claim"
              className="display-wide mt-2 block text-ink"
            >
              Pixelcraft makes them diverge.
            </span>
          </h1>

          <div data-hero="rest">
            <p className="mt-8 max-w-[44ch] text-[1.1875rem] leading-relaxed text-ink-muted">
              An open-source skill pack for coding agents. It forces divergent
              directions before code, applies an accessibility and UX floor by
              default, and reports only what was actually verified.
            </p>
            <div className="mt-9 max-w-[36rem]">
              <CopyCommand variant="hero" lines={[`npx ${NPM_PKG}`]} />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                data-magnetic
                href={REPO_URL}
                className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-ink px-6 font-mono text-[0.8125rem] font-medium text-void transition-colors duration-150 hover:bg-action motion-reduce:transition-none"
              >
                <PixelIcon name="star" size={13} />
                View on GitHub
              </a>
              <a
                data-magnetic
                href="#film"
                className="surface inline-flex min-h-12 items-center gap-2.5 rounded-full px-6 font-mono text-[0.8125rem] text-ink backdrop-blur-md transition-colors hover:bg-white/10 motion-reduce:transition-none"
              >
                <PixelIcon name="play" size={12} />
                Watch it work
              </a>
            </div>
          </div>
        </div>

        <dl className="mt-auto grid grid-cols-2 gap-3 pt-16 sm:grid-cols-4 lg:max-w-[44rem]">
          {[
            [SKILLS.length, "skills"],
            [TOTAL_REFERENCES, "reference files"],
            [TOTAL_SCRIPTS, "scripts that run"],
            [14, "agent targets"],
          ].map(([n, l]) => (
            <div
              key={l}
              data-hero="stat"
              className="surface flex flex-col-reverse rounded-tile p-5 backdrop-blur-md"
            >
              <dt className="mt-1.5 font-mono text-[0.75rem] text-ink-faint">
                {l}
              </dt>
              <dd
                data-hero="num"
                data-value={n}
                className="display-wide text-[clamp(1.75rem,2.6vw,2.5rem)] leading-none tabular"
              >
                {n}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <StackTicker />
    </section>
  );
}
