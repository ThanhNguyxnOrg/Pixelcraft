import { gsap, MOTION_OK, ScrollTrigger, SplitText, useGSAP } from "./gsap";

/**
 * Page-wide, attribute-driven motion. Content is visible by default; from-states are applied only
 * inside MOTION_OK, so static-view visitors see the finished page without animation.
 *   data-split     heading lines rise out of a mask
 *   data-reveal    block fades up, batched with its neighbours
 *   data-scramble  pixel label decodes once
 *   data-count     integer counts up once
 */
export function useGlobalMotion(
  scope: React.RefObject<HTMLElement | null>,
  paused: boolean,
) {
  useGSAP(
    () => {
      if (paused) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, (context) => {
        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: 0.85,
                ease: "expo.out",
                stagger: 0.065,
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              }),
          });
        });

        const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
        ScrollTrigger.batch(reveals, {
          start: "top 94%",
          once: true,
          onEnter: (batch) => {
            // Own deferred reveals in this media context, not its useGSAP parent.
            // Re-entering the parent here makes a cyclic context tree during cleanup.
            context.add(() => {
              gsap.fromTo(
                batch,
                { y: 24, opacity: 0.2 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.8,
                  ease: "power3.out",
                  stagger: 0.055,
                  overwrite: true,
                },
              );
            });
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-scramble]").forEach((el) => {
          gsap.to(el, {
            duration: 0.65,
            scrambleText: {
              text: "{original}",
              chars: "▖▗▘▙▚▛▜▝▞▟",
              speed: 0.5,
            },
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const end = Number(el.dataset.count);
          const o = { v: 0 };
          gsap.to(o, {
            v: end,
            duration: 0.9,
            ease: "power3.out",
            onUpdate: () => {
              el.textContent = String(Math.round(o.v) || end);
            },
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });
      });

      // Disclosures, filters and font reflow change section positions without a viewport resize.
      let frame = 0;
      const ro = new ResizeObserver(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => ScrollTrigger.refresh());
      });
      if (scope.current) ro.observe(scope.current);
      return () => {
        ro.disconnect();
        cancelAnimationFrame(frame);
        mm.revert();
      };
    },
    { scope, dependencies: [paused], revertOnUpdate: true },
  );
}
