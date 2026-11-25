import { MotionConfig } from "motion/react";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Footer, Header } from "./components/Chrome";
import { Authority } from "./components/Authority";
import { Faq } from "./components/Faq";
import { Floor } from "./components/Floor";
import { Masthead } from "./components/Hero";
import { Install } from "./components/Install";
import { Loop } from "./components/Loop";
import { MotionPause } from "./components/pixel";
import { Receipt } from "./components/Receipt";
import { SkillIndex } from "./components/SkillIndex";
import { Tools } from "./components/Tools";
import { MotionDemos } from "./components/MotionDemos";
import { useGlobalMotion } from "./lib/useGlobalMotion";

const loadGallery = () =>
  import("./components/Gallery").then((m) => ({ default: m.Gallery }));
const Gallery = lazy(loadGallery);

export default function App() {
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useGlobalMotion(root, paused);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void loadGallery();
    }, 120);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <MotionPause.Provider value={{ paused, setPaused }}>
      <MotionConfig reducedMotion={paused ? "always" : "user"}>
        <div
          ref={root}
          id="top"
          data-motion={paused ? "paused" : "running"}
          className="min-h-screen bg-void text-ink"
        >
          <Header />
          <main id="main">
            <Masthead />
            <MotionDemos />
            <Suspense
              fallback={
                <section
                  id="gallery"
                  aria-label="Gallery loading"
                  className="mx-2 min-h-[48rem] rounded-sheet bg-paper text-paper-ink sm:mx-4"
                />
              }
            >
              <Gallery />
            </Suspense>
            <Loop />
            <Authority />
            <Receipt />
            <Tools />
            <SkillIndex />
            <Floor />
            <Faq />
            <Install />
          </main>
          <Footer />
        </div>
      </MotionConfig>
    </MotionPause.Provider>
  );
}
