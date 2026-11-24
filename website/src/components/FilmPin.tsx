import { useEffect, useRef, useState } from "react";
import { gsap, MOTION_OK, useGSAP } from "../lib/gsap";
import { useMediaPlayback } from "../lib/useMediaPlayback";
import { PixelIcon, PixelLabel, useMotionPause } from "./pixel";

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
  const [playing, setPlaying] = useState(false);
  const [intent, setIntent] = useState<"auto" | "play" | "pause">("auto");
  // A new page-wide pause stops even explicitly started media. A later film
  // gesture may play just the film without resuming decorative page motion.
  useEffect(() => {
    if (paused) setIntent((value) => (value === "pause" ? value : "auto"));
  }, [paused]);
  useMediaPlayback(video, paused || intent === "pause", intent === "play");

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
            preload="metadata"
            aria-label="Pixelcraft demo, 16 seconds, no audio. A text transcript follows."
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            <source src="/media/pixelcraft-film.webm" type="video/webm" />
            <source src="/media/pixelcraft-film.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="mt-6 flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setIntent(playing ? "pause" : "play")}
              className="surface inline-flex min-h-11 items-center gap-2.5 rounded-full px-5 font-mono text-[0.8125rem] text-ink transition-colors hover:bg-white/10 motion-reduce:transition-none"
            >
              <PixelIcon name={playing ? "pause" : "play"} size={12} />
              {playing ? "Pause film" : "Play film"}
            </button>
            <a
              href="/media/pixelcraft-film.mp4"
              download="pixelcraft-film.mp4"
              className="inline-flex min-h-11 items-center gap-2 font-mono text-[0.8125rem] text-ink-muted underline underline-offset-4 hover:text-ink"
            >
              Download film <PixelIcon name="external" size={10} />
            </a>
          </div>
          <details className="max-w-[44rem] text-[0.875rem] text-ink-muted">
            <summary className="inline-flex min-h-11 cursor-pointer items-center gap-2 font-mono text-[0.8125rem] text-ink underline decoration-line-strong underline-offset-4 hover:decoration-action">
              Read the film as text
            </summary>
            <ol className="mt-3 grid gap-2.5">
              {TRANSCRIPT.map(([t, line]) => (
                <li
                  key={t}
                  className="grid grid-cols-[3rem_1fr] gap-3 leading-snug"
                >
                  <span className="font-mono text-[0.75rem] text-ink-faint tabular">
                    {t}
                  </span>
                  {line}
                </li>
              ))}
            </ol>
          </details>
        </div>
      </div>
    </section>
  );
}
