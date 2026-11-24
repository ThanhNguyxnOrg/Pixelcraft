import { useEffect, useState, type RefObject } from "react";

/** Autoplay is decorative: only visible, active-tab media may run. */
export function useMediaPlayback(
  ref: RefObject<HTMLVideoElement | null>,
  paused: boolean,
) {
  const [visible, setVisible] = useState(false);
  const [staticView, setStaticView] = useState(
    () =>
      window.matchMedia(
        "(prefers-reduced-motion: reduce), (forced-colors: active)",
      ).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(
      "(prefers-reduced-motion: reduce), (forced-colors: active)",
    );
    const sync = () => setStaticView(mq.matches);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setVisible(e.intersectionRatio >= 0.15),
      {
        threshold: 0.15,
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el || paused || staticView) return;
    // Buffer shortly before entry, without loading every decorative video on arrival.
    // Do not call load(): that would reset a film already in progress.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.preload = "auto";
        io.disconnect();
      },
      { rootMargin: "500px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, paused, staticView]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.setAttribute("muted", "");
    const sync = () => {
      if (paused || staticView || !visible || document.hidden) el.pause();
      else el.play().catch(() => {}); // Autoplay rejection leaves the poster and text equivalent.
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      el.pause();
    };
  }, [paused, staticView, visible, ref]);
}
