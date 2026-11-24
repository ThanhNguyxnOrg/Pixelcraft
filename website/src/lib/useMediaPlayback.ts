import { useEffect, useState, type RefObject } from "react";

/** Autoplay is decorative: only visible, active-tab media may run. */
export function useMediaPlayback(
  ref: RefObject<HTMLVideoElement | null>,
  paused: boolean,
  userPlay = false,
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
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.setAttribute("muted", "");
    const sync = () => {
      if (((paused || staticView) && !userPlay) || !visible || document.hidden)
        el.pause();
      else el.play().catch(() => {}); // Autoplay rejection leaves the poster and play control.
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      el.pause();
    };
  }, [paused, staticView, userPlay, visible, ref]);
}
