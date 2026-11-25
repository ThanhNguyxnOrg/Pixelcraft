import { MotionConfig } from "motion/react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Footer, Header } from "./components/Chrome";
import { Authority } from "./components/Authority";
import { Blueprint } from "./components/Blueprint";
import { Faq } from "./components/Faq";
import { Floor } from "./components/Floor";
import { Masthead } from "./components/Hero";
import { Install } from "./components/Install";
import { Loop } from "./components/Loop";
import { MotionPause } from "./components/pixel";
import { Receipt } from "./components/Receipt";
import { SkillIndex } from "./components/SkillIndex";
import { MotionDemos } from "./components/MotionDemos";
import { LocaleProvider, useLocale } from "./lib/i18n";
import { onJump } from "./lib/urlState";
import { useGlobalMotion } from "./lib/useGlobalMotion";

const LazyGallery = lazy(() =>
  import("./components/Gallery").then((m) => ({ default: m.Gallery })),
);
const LazyTools = lazy(() =>
  import("./components/Tools").then((m) => ({ default: m.Tools })),
);
const LazyCommandPalette = lazy(() =>
  import("./components/CommandPalette").then((m) => ({
    default: m.CommandPalette,
  })),
);

function GalleryPlaceholder() {
  const { t } = useLocale();
  return (
    <section
      id="gallery"
      aria-label="Multi-stack proof gallery"
      className="mx-2 my-5 min-h-[42rem] rounded-sheet bg-paper px-6 py-16 text-paper-ink sm:mx-4 sm:my-6"
    >
      <p className="mx-auto max-w-[84rem] font-mono text-[0.875rem] text-paper-ink-2">
        {t.gallery.loading}
      </p>
    </section>
  );
}

function ToolsPlaceholder() {
  return (
    <section
      id="tools"
      aria-label="Verification scripts"
      className="min-h-[32rem] bg-void"
    />
  );
}

function Shell() {
  const [paused, setPaused] = useState(false);
  const [paletteMounted, setPaletteMounted] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useGlobalMotion(root, paused);

  useEffect(() => {
    const unsub = onJump((detail) => {
      if (detail.kind === "palette") setPaletteMounted(true);
    });
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteMounted(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      unsub();
      window.removeEventListener("keydown", onKey);
    };
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
          {paletteMounted ? (
            <Suspense fallback={null}>
              <LazyCommandPalette initialOpen />
            </Suspense>
          ) : null}
          <main id="main">
            <Masthead />
            <MotionDemos />
            <Suspense fallback={<GalleryPlaceholder />}>
              <LazyGallery />
            </Suspense>
            <Loop />
            <Blueprint />
            <Authority />
            <Receipt />
            <Suspense fallback={<ToolsPlaceholder />}>
              <LazyTools />
            </Suspense>
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

export default function App() {
  return (
    <LocaleProvider>
      <Shell />
    </LocaleProvider>
  );
}
