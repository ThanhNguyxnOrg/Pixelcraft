import { useEffect } from "react";
import { Footer, Header } from "./components/Chrome";
import { Faq } from "./components/Faq";
import { Gallery } from "./components/Gallery";
import { Hero } from "./components/Hero";
import { Install } from "./components/Install";
import { Process } from "./components/Process";
import { SkillIndex } from "./components/SkillIndex";
import { Tools } from "./components/Tools";

export default function App() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
  }, []);

  return (
    <div id="top" className="min-h-screen bg-void text-ink">
      <Header />
      <main id="main">
        <Hero />
        <Gallery />
        <Process />
        <SkillIndex />
        <Tools />
        <Install />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
