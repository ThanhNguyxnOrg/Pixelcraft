import { useRef } from "react";
import { PHASES } from "../data";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "../lib/gsap";
import { PixelLabel, useMotionPause } from "./pixel";

export function Loop() {
  const root = useRef<HTMLElement>(null);
  const { paused } = useMotionPause();

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
              start: "top 55%",
              end: "bottom 55%",
              scrub: 0.5,
            },
          },
        );
        gsap.utils
          .toArray<HTMLElement>('[data-loop="card"]')
          .forEach((card, i) => {
            gsap.from(card, {
              y: 48,
              x: i % 2 ? 18 : -18,
              rotation: i % 2 ? 1.4 : -1.4,
              scale: 0.97,
              opacity: 0.25,
              duration: 1.1,
              delay: (i % 4) * 0.09,
              ease: "expo.out",
              clearProps: "transform",
              scrollTrigger: { trigger: card, start: "top 92%", once: true },
            });
            gsap.fromTo(
              card.querySelector('[data-loop="index"]'),
              { y: 18 },
              {
                y: -18,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.7,
                },
              },
            );
            ScrollTrigger.create({
              trigger: card,
              start: "top 72%",
              end: "bottom 30%",
              onToggle: (self) => {
                card.classList.toggle("is-active", self.isActive);
              },
            });
          });
      });
      return () => {
        mm.revert();
        root.current
          ?.querySelectorAll(".is-active")
          .forEach((el) => el.classList.remove("is-active"));
      };
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
          <p className="max-w-[40ch] text-[1rem] leading-relaxed text-ink-muted lg:col-span-5">
            Seven phases. An artifact and a gate at every step. Not just “make
            it beautiful.”
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
        <ol className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {PHASES.map((p, i) => (
            <li
              key={p.id}
              data-loop="card"
              className={`group surface relative flex min-w-0 flex-col overflow-hidden rounded-card p-6 transition-[box-shadow,background-color] duration-300 [&.is-active]:surface-lit motion-reduce:transition-none ${i === 0 ? "md:col-span-2" : ""}`}
            >
              <span
                aria-hidden="true"
                data-loop="index"
                className="pointer-events-none absolute -end-3 -top-4 font-pixel text-[7rem] leading-none text-white/[0.035] group-[.is-active]:text-action/[0.07]"
              >
                {String(i).padStart(2, "0")}
              </span>
              <p className="font-pixel text-[0.6875rem] text-action tabular">
                PHASE {String(i).padStart(2, "0")}
              </p>
              <h3 className="mt-3 display-wide text-[1.75rem] leading-none">
                {p.name}
              </h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                {p.does}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.skills.map((s) => (
                  <code
                    key={s}
                    className="max-w-full rounded-full bg-white/8 px-2.5 py-1.5 text-[0.6875rem] break-words text-ink"
                  >
                    {s}
                  </code>
                ))}
              </div>
              <div className="mt-auto pt-6">
                <p className="font-mono text-[0.625rem] text-ink-faint uppercase">
                  Artifact
                </p>
                <p className="mt-1 break-words font-mono text-[0.8125rem] text-action">
                  {p.artifact}
                </p>
                <p className="mt-4 border-t border-line pt-4 text-[0.8125rem] leading-relaxed text-ink-muted">
                  <span className="font-pixel text-[0.625rem] text-ink-faint uppercase">
                    Gate ·{" "}
                  </span>
                  {p.gate}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
