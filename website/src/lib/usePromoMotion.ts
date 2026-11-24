import type { RefObject } from "react";
import { gsap, MOTION_OK, useGSAP } from "./gsap";
import { useMotionPause } from "../components/pixel";

/** One local clock per specimen. No decoding, React frame updates or scroll scrubbing. */
export function usePromoMotion(
  root: RefObject<HTMLDivElement | null>,
  build: (timeline: gsap.core.Timeline) => void,
) {
  const { paused } = useMotionPause();
  useGSAP(
    () => {
      if (paused || !root.current) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = root.current!;
        const clock = gsap.timeline({
          paused: true,
          repeat: -1,
          repeatDelay: 0.3,
        });
        build(clock);
        let visible = false;
        const images = Array.from(el.querySelectorAll("img"));
        const sync = () => {
          if (
            visible &&
            !document.hidden &&
            images.every((img) => img.complete)
          )
            clock.resume();
          else clock.pause();
        };
        const observer = new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
            sync();
          },
          { threshold: [0, 0.25] },
        );
        observer.observe(el);
        images.forEach((img) => {
          img.addEventListener("load", sync);
          img.addEventListener("error", sync);
        });
        document.addEventListener("visibilitychange", sync);
        return () => {
          observer.disconnect();
          images.forEach((img) => {
            img.removeEventListener("load", sync);
            img.removeEventListener("error", sync);
          });
          document.removeEventListener("visibilitychange", sync);
          clock.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [paused], revertOnUpdate: true },
  );
}
