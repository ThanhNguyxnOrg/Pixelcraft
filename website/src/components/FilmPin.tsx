import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "../lib/gsap";
import { useMediaPlayback } from "../lib/useMediaPlayback";
import { PixelLabel, useMotionPause } from "./pixel";

const TRANSCRIPT: [string, string][] = [
  [
    "0:00",
    "A fictional coffee-roaster brief becomes a default agent page. Source-scanner findings appear; the score is 26.",
  ],
  ["0:04", "The install command introduces 26 skills."],
  [
    "0:06",
    "Four authored directions are compared, one is selected, and the seven-phase loop completes.",
  ],
  [
    "0:11",
    "The crafted page replaces the default; the source scan finds no known fingerprints. A booking form and a data board follow.",
  ],
  ["0:15", "The Pixelcraft lockup and installation command."],
];

export function FilmPin() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const { paused } = useMotionPause();
  useMediaPlayback(video, paused);

  useGSAP(
    () => {
      if (paused) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-film="card"]',
          { scale: 0.91, y: 32 },
          {
            scale: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top 88%",
              end: "center 60%",
              scrub: 0.6,
            },
          },
        );
        gsap.fromTo(
          '[data-film="light"]',
          { xPercent: -180, opacity: 1 },
          {
            xPercent: 280,
            duration: 1.8,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: root.current,
              start: "top 70%",
              once: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [paused], revertOnUpdate: true },
  );

  return (
    <section
      ref={root}
      id="film"
      aria-labelledby="film-title"
      className="relative py-16 sm:py-24"
    >
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <PixelLabel>The film · 16 s · silent</PixelLabel>
            <h2
              id="film-title"
              data-split
              className="mt-5 max-w-[22ch] display-wide text-[clamp(2rem,3.6vw,3.4rem)] leading-[1]"
            >
              One brief, start to finish.
            </h2>
          </div>
          <p className="max-w-[34ch] text-[0.9375rem] leading-relaxed text-ink-muted">
            An authored demo, not a live AI run. Same fictional brief, a more
            deliberate result.
          </p>
        </div>
        <div
          data-film="card"
          className="gborder relative mx-auto aspect-video w-full overflow-hidden rounded-card bg-void shadow-lift"
        >
          <video
            ref={video}
            className="block h-full w-full"
            poster="/media/pixelcraft-film.jpg"
            width={1920}
            height={1080}
            muted
            loop
            playsInline
            preload="none"
            aria-label="Pixelcraft demo, 16 seconds, no audio."
            aria-describedby="film-transcript"
          >
            <source
              src="/media/pixelcraft-film-720.mp4"
              media="(max-width: 800px)"
              type="video/mp4"
            />
            <source src="/media/pixelcraft-film.mp4" type="video/mp4" />
            <source src="/media/pixelcraft-film.webm" type="video/webm" />
          </video>
          <div
            aria-hidden="true"
            data-film="light"
            className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(185,239,210,0.1),transparent)] opacity-0 motion-reduce:hidden"
          />
        </div>
        <p id="film-transcript" className="sr-only">
          {TRANSCRIPT.map(([time, line]) => `${time}: ${line}`).join(" ")}
        </p>
      </div>
    </section>
  );
}
