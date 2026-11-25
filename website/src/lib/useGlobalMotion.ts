import { gsap, MOTION_OK, ScrollTrigger, SplitText, useGSAP } from "./gsap";

/**
 * Page-wide, attribute-driven motion. Content is visible by default; from-states are applied only
 * inside MOTION_OK, so static-view visitors see the finished page without animation.
 *   data-split     heading lines rise out of a mask
 *   data-reveal    block rises crisply, batched with its neighbours
 *   data-scramble  pixel label decodes once
 *   data-count     integer counts up once
 *   data-magnetic  subtle bounded cursor pull on fine pointers
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
                yPercent: 105,
                duration: 0.72,
                ease: "expo.out",
                stagger: 0.055,
                scrollTrigger: { trigger: el, start: "top 90%", once: true },
              }),
          });
        });

        const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
        ScrollTrigger.batch(reveals, {
          start: "top 95%",
          once: true,
          onEnter: (batch) => {
            context.add(() => {
              gsap.fromTo(
                batch,
                { y: 18, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.52,
                  ease: "power3.out",
                  stagger: 0.04,
                  overwrite: "auto",
                  clearProps: "transform,opacity",
                },
              );
            });
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-scramble]").forEach((el) => {
          gsap.to(el, {
            duration: 0.55,
            scrambleText: {
              text: "{original}",
              chars: "▖▗▘▙▚▛▜▝▞▟",
              speed: 0.6,
            },
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const end = Number(el.dataset.count);
          const o = { v: 0 };
          gsap.to(o, {
            v: end,
            duration: 0.85,
            ease: "power3.out",
            onUpdate: () => {
              el.textContent = String(Math.round(o.v) || end);
            },
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          });
        });

        // Tactile magnetic pull on primary actions (fine pointers only, bounded to ±5px).
        const cleanups: (() => void)[] = [];
        if (window.matchMedia("(pointer: fine)").matches) {
          gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((el) => {
            const xTo = gsap.quickTo(el, "x", {
              duration: 0.35,
              ease: "power3.out",
            });
            const yTo = gsap.quickTo(el, "y", {
              duration: 0.35,
              ease: "power3.out",
            });
            const onMove = (e: PointerEvent) => {
              const r = el.getBoundingClientRect();
              const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
              const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
              xTo(gsap.utils.clamp(-1, 1, dx) * 5);
              yTo(gsap.utils.clamp(-1, 1, dy) * 3.5);
            };
            const onLeave = () => {
              gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.55,
                ease: "elastic.out(1, 0.5)",
                overwrite: "auto",
              });
            };
            el.addEventListener("pointermove", onMove, { passive: true });
            el.addEventListener("pointerleave", onLeave);
            cleanups.push(() => {
              el.removeEventListener("pointermove", onMove);
              el.removeEventListener("pointerleave", onLeave);
              gsap.set(el, { clearProps: "x,y" });
            });
          });
        }
        return () => cleanups.forEach((fn) => fn());
      });

      // Disclosures, filters and font reflow change section positions without a viewport resize.
      let refreshTimer = 0;
      const ro = new ResizeObserver(() => {
        window.clearTimeout(refreshTimer);
        refreshTimer = window.setTimeout(
          () => ScrollTrigger.refresh(true),
          160,
        );
      });
      if (scope.current) ro.observe(scope.current);
      return () => {
        ro.disconnect();
        window.clearTimeout(refreshTimer);
        mm.revert();
      };
    },
    { scope, dependencies: [paused], revertOnUpdate: true },
  );
}
