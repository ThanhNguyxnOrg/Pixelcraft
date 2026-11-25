import { MotionConfig } from "motion/react";
import { useRef, useState } from "react";
import { Footer, Header } from "./components/Chrome";
import { Authority } from "./components/Authority";
import { Blueprint } from "./components/Blueprint";
import { CommandPalette } from "./components/CommandPalette";
import { Faq } from "./components/Faq";
import { Floor } from "./components/Floor";
import { Masthead } from "./components/Hero";
import { Install } from "./components/Install";
import { Loop } from "./components/Loop";
import { MotionPause } from "./components/pixel";
import { Receipt } from "./components/Receipt";
import { SkillIndex } from "./components/SkillIndex";
import { Tools } from "./components/Tools";
import { Gallery } from "./components/Gallery";
import { MotionDemos } from "./components/MotionDemos";
import { useGlobalMotion } from "./lib/useGlobalMotion";

export default function App() {
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useGlobalMotion(root, paused);

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
          <CommandPalette />
          <main id="main">
            <Masthead />
            <MotionDemos />
            <Gallery />
            <Loop />
            <Blueprint />
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
