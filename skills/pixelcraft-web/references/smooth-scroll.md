# Smooth scrolling: Lenis and GSAP ScrollSmoother

Smooth scrolling is optional. It alters input feel and browser behavior, so add it only when the brief explicitly calls for inertial scroll choreography and normal native scroll remains intact. Never force smooth-scroll hijacking on operational dashboards, tables, or forms.

## Selection checks

- Confirm there is no existing smooth-scroll library or custom scroll container.
- Check keyboard (`Space`/`PageDown`/arrows), wheel, touch momentum, scrollbar dragging, `#anchor` jumps, history restoration, focus-into-view, nested scroll regions, and `prefers-reduced-motion`.
- Never combine Lenis with GSAP `ScrollSmoother`, Locomotive, or another scroll controller.
- Disable smooth scroll on `prefers-reduced-motion: reduce`, low-power/constrained surfaces, and preserve native touch inertia on mobile.

## Lenis (`lenis`, `lenis/react`) + GSAP ScrollTrigger

- **Package rename**: use **`lenis`** (not legacy `@studio-freight/lenis`), import its required stylesheet **`import 'lenis/dist/lenis.css'`**, and in React use **`lenis/react`** (`<ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>` / `useLenis`).
- **Single-clock rule (`autoRaf: false`)**: when driving Lenis from `gsap.ticker`, explicitly pass **`autoRaf: false`** so Lenis v1.1+ does not run a competing internal `requestAnimationFrame` loop.
- **Nested scrollable panels**: mark scrollable modals, drawers, code blocks, and select menus with **`data-lenis-prevent`** (or `data-lenis-prevent-wheel` / `data-lenis-prevent-touch`) so wheel/touch scrolling inside overlays is not hijacked by the page scroller.
- **CSS hygiene**: remove `html { scroll-behavior: smooth; }` when Lenis is active so native smooth scroll does not fight Lenis interpolation; use `overflow-x: clip` (never `overflow-x: hidden`) on `body` so `position: sticky` keeps working.

```ts
// Single-clock Lenis + ScrollTrigger sync (skip when reduced motion is preferred)
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let cleanup = () => {};
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lenis = new Lenis({ autoRaf: false, duration: 1.05, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  cleanup = () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
}
```

## GSAP `ScrollSmoother` (free in GSAP 3.13+)

If the route is already heavily GSAP/ScrollTrigger-driven and needs built-in `data-speed` / `data-lag` parallax without a second vendor, **`ScrollSmoother`** (free in GSAP 3.13+) is a direct alternative to Lenis:

- Wrap scrollable content in `#smooth-wrapper > #smooth-content` while keeping `position: fixed` headers, modals, and drawers **outside** `#smooth-content` (transforms on `#smooth-content` trap fixed descendants).
- Keep `smoothTouch: 0` (or `false`) so mobile touch scrolling stays native, skip creation under `(prefers-reduced-motion: reduce)`, and call `smoother.kill()` on teardown.

## Progressive fallback

The page must remain scrollable when JavaScript, Lenis, or ScrollSmoother fails. Never hide the browser scrollbar or suppress wheel/touch input, and test `<a href="#section">` anchors, `Tab` focus into offscreen controls, and nested `data-lenis-prevent` containers in a real browser (`rendered`).

## Official references

- Lenis documentation: https://lenis.darkroom.engineering/
- Lenis repository: https://github.com/darkroomengineering/lenis
- GSAP ScrollSmoother: https://gsap.com/docs/v3/Plugins/ScrollSmoother/
- GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
