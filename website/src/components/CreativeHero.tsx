"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

const worlds = [
  {
    id: "editorial",
    name: "Editorial",
    headline: (
      <>
        Find your
        <br />
        <em>elsewhere.</em>
      </>
    ),
    note: "SLOW DAYS. A DIFFERENT PACE.",
  },
  {
    id: "electric",
    name: "Electric",
    headline: (
      <>
        GO
        <br />
        FURTHER.
      </>
    ),
    note: "OUT OF OFFICE. INTO THE WORLD.",
  },
  {
    id: "sunlit",
    name: "Sunlit",
    headline: (
      <>
        A little
        <br />
        <em>less rush.</em>
      </>
    ),
    note: "TAKE THE SCENIC ROUTE.",
  },
];

export default function CreativeHero() {
  const [world, setWorld] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const visible = useInView(stage, { amount: 0.1 });
  const reduce = useReducedMotion();
  const reducedState = hydrated && reduce;
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(py, { stiffness: 120, damping: 24 });
  const rotateY = useSpring(px, { stiffness: 120, damping: 24 });
  const { scrollYProgress } = useScroll({
    target: stage,
    offset: ["start start", "end start"],
  });
  const drift = useTransform(scrollYProgress, [0, 1], [0, 65]);
  // The server cannot know matchMedia; keep the first client render identical.
  // CSS already suppresses motion before hydration for reduced-motion users.
  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    document.documentElement.dataset.ambient =
      paused || reduce ? "paused" : "playing";
    return () => {
      delete document.documentElement.dataset.ambient;
    };
  }, [paused, reduce]);
  const current = worlds[world];
  return (
    <section className="creative-hero shell" aria-labelledby="hero-heading">
      <div className="hero-eyebrow">
        <span className="status-dot" /> A LITTLE DESIGN INTELLIGENCE. A LOT MORE
        POSSIBILITY.
      </div>
      <div className="creative-hero-grid">
        <div className="creative-copy">
          <h1 id="hero-heading">
            <span>Your agent.</span>
            <span>With a point</span>
            <span>
              of <em>view.</em>
              <svg viewBox="0 0 90 90" aria-hidden="true">
                <path d="M13 76 75 14M15 14h60v60" />
              </svg>
            </span>
          </h1>
          <p>
            Good code is a start. Give your agent the skills to make something{" "}
            <strong>unmistakably yours.</strong>
          </p>
          <div className="creative-actions">
            <a href="#install" className="button button-primary">
              Get Pixelcraft <span aria-hidden="true">↗</span>
            </a>
            <a href="/film/" className="creative-play">
              <span aria-hidden="true">▶</span> Watch the film{" "}
              <small>00:40</small>
            </a>
          </div>
          <div className="hero-facts">
            <span>26 focused skills</span>
            <span>Any stack. Every surface.</span>
            <span>Open source.</span>
          </div>
        </div>
        <div
          className="creative-art"
          ref={stage}
          data-in-view={visible}
          onPointerMove={(event) => {
            if (reduce || paused || event.pointerType !== "mouse") return;
            const bounds = event.currentTarget.getBoundingClientRect();
            px.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 12);
            py.set(((event.clientY - bounds.top) / bounds.height - 0.5) * -10);
          }}
          onPointerLeave={() => {
            px.set(0);
            py.set(0);
          }}
        >
          <motion.div
            className="proof-assembly"
            style={{
              rotateX: reduce || paused ? 0 : rotateX,
              rotateY: reduce || paused ? 0 : rotateY,
              y: reduce || paused ? 0 : drift,
            }}
          >
            <div className="proof-backplate" aria-hidden="true">
              <span>
                DIFFERENT
                <br />
                BY DESIGN.
              </span>
              <span>PIXELCRAFT / NO FIXED AESTHETIC</span>
            </div>
            <motion.div
              className="proof-sheet"
              data-world={current.id}
              key={current.id}
              initial={reduce ? false : { rotate: -11, scale: 0.92, x: 24 }}
              animate={{ rotate: -4, scale: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 145, damping: 22 }}
            >
              <div className="proof-masthead">
                <span>elsewhere</span>
                <span>FIELD NOTES / 001</span>
              </div>
              <div className="proof-photo">
                <img
                  src="/images/alpine-lake.jpg"
                  width="1600"
                  height="1067"
                  alt=""
                  fetchPriority="high"
                />
              </div>
              <h2>{current.headline}</h2>
              <div className="proof-foot">
                <span>{current.note}</span>
                <span aria-hidden="true">↗</span>
              </div>
            </motion.div>
            <div className="proof-sticker" aria-hidden="true">
              <span>
                YOUR TASTE.
                <br />
                NOT A TEMPLATE.
              </span>
              <svg viewBox="0 0 60 60">
                <path d="M30 3v54M3 30h54M11 11l38 38M11 49l38-38" />
              </svg>
            </div>
          </motion.div>
          <div className="art-direction-controls">
            <span>ONE ILLUSTRATIVE BRIEF. THREE DIRECTIONS.</span>
            <div role="group" aria-label="Hero art direction">
              {worlds.map((item, index) => (
                <button
                  key={item.id}
                  aria-pressed={world === index}
                  onClick={() => setWorld(index)}
                >
                  <i data-swatch={item.id} />
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="hero-bottom">
        <a href="#playground">
          Don't just take our word for it.{" "}
          <span>Play with the difference ↓</span>
        </a>
        <button
          className="ambient-toggle"
          onClick={() => setPaused(!paused)}
          aria-pressed={paused}
          disabled={!!reducedState}
          aria-label={
            reducedState
              ? "Ambient motion disabled by system preference"
              : paused
                ? "Resume ambient motion"
                : "Pause ambient motion"
          }
        >
          <span aria-hidden="true">{paused || reducedState ? "▶" : "Ⅱ"}</span>
          {reducedState
            ? "Reduced motion"
            : paused
              ? "Motion paused"
              : "Pause motion"}
        </button>
      </div>
    </section>
  );
}
