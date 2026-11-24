# GSAP implementation guide

Use GSAP when a timeline, coordinated sequence, SVG/plugin capability, or scroll choreography materially improves the interaction. It is not the default for every hover or state change.

## Ownership and setup

- Register only the plugins used by the affected route/component (`gsap.registerPlugin(...)`).
- **GSAP 3.13+ licensing**: starting with GSAP 3.13 (via Webflow), all formerly paid Club GSAP plugins (**SplitText, DrawSVGPlugin, MorphSVGPlugin, ScrollSmoother, Flip, Observer, InertiaPlugin, ScrambleTextPlugin, Physics2DPlugin**) are **100% free** for personal and commercial projects (subject to Webflow's standard no-competing-visual-builder clause). Still check `package.json` on older GSAP ≤ 3.12 codebases before assuming plugin availability.
- Keep one animation system as the owner of a given element/property. Avoid GSAP and Motion both writing `transform` on the same node.
- Scope selectors and timelines to the component root and revert all tweens, timelines, ScrollTriggers, and `matchMedia` listeners on teardown.

## Timeline and plugin matrix

Use labels for semantic beats such as `intro`, `reveal`, `detail`, `exit`. Keep timelines section-scoped rather than building one giant master timeline for an entire application.

| Tool | Use | Key idiom |
|---|---|---|
| `gsap.timeline` | Ordered or overlapping sequence with labels and explicit ownership | Attach to a scoped `useGSAP` / `gsap.context` / `gsap.matchMedia` |
| `ScrollTrigger` | Progress-linked scenes, pinning, scrub, snap, enter/leave callbacks | Define `start`/`end` in content terms; call `ScrollTrigger.refresh()` only after layout-affecting media/fonts settle |
| `SplitText` (3.13+) | Short headline/editorial text reveals with semantic preservation | Use `SplitText.create(el, { type: 'lines,words', mask: 'lines', autoSplit: true, aria: 'auto', onSplit(self) { ... } })` so screen readers read intact text and resize/font-load re-splits automatically |
| `Flip` | Smooth layout transitions across DOM/grid/flex changes | `const state = Flip.getState(targets); mutateDOM(); Flip.from(state, { duration: 0.45, ease: 'power2.out', absolute: true });` |
| `Observer` | Unified wheel/touch/pointer intent gestures | Normalize swipe/drag steps without breaking native page scroll unless explicitly scoped |
| `gsap.quickTo` | High-frequency pointer/cursor/magnetic tracking | Pre-allocate `const xTo = gsap.quickTo(el, 'x', { duration: 0.25, ease: 'power3' })` once instead of spawning tweens on every `pointermove` |
| `DrawSVGPlugin` / `MorphSVGPlugin` / `MotionPathPlugin` | SVG stroke progress, shape morphs, and path-aligned motion | Always preserve a legible static SVG fallback and accessible `<title>`/`aria-label` |
| `gsap.matchMedia` | Responsive and `prefers-reduced-motion` animation variants | Pass `scope` (`gsap.matchMedia(rootRef)` or inside `useGSAP(..., { scope: rootRef })`) so selectors stay component-scoped |

## ScrollTrigger rules

- Use normal document flow and native scroll. Pin only when a persistent artifact needs chapter context.
- Test fast/reverse scroll, scrollbar drag, resize, short viewport height, and late-loading images/fonts.
- Avoid pinned nested scrollers and competing smooth-scroll engines (see [smooth-scroll.md](smooth-scroll.md) for Lenis / `ScrollSmoother` coordination).
- Do not make core content unreachable if ScrollTrigger fails or `prefers-reduced-motion: reduce` is enabled.

## Scoped lifecycle & React (`@gsap/react`)

**Scoping trap**: calling `const mm = gsap.matchMedia()` *outside* `gsap.context(..., rootRef)` creates an unscoped `matchMedia` context—selector strings like `'.chapter-item'` inside `mm.add(...)` will query the entire `document` and animate other component instances! Pass `rootRef` directly to `gsap.matchMedia(rootRef)` (vanilla/Vue/Svelte/Solid) or use **`useGSAP`** from `@gsap/react` (which scopes both `gsap` and `gsap.matchMedia()` automatically and reverts cleanly under React Strict Mode):

```tsx
// React: @gsap/react useGSAP (auto-scoped + Strict Mode safe cleanup)
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function EditorialChapter() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        SplitText.create('.chapter-heading', {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          aria: 'auto',
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 100,
              stagger: 0.08,
              duration: 0.55,
              ease: 'power3.out',
              scrollTrigger: { trigger: rootRef.current, start: 'top 80%', once: true },
            });
          },
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef}>
      <h2 className="chapter-heading">Quarterly release notes</h2>
    </section>
  );
}
```

```ts
// Framework-agnostic (Vue / Svelte / Solid / Astro / Vanilla): pass scope to matchMedia(rootEl)
const mm = gsap.matchMedia(rootEl);
mm.add('(prefers-reduced-motion: no-preference)', () => {
  const xTo = gsap.quickTo('.magnet-target', 'x', { duration: 0.25, ease: 'power3.out' });
  const onMove = (e: PointerEvent) => xTo(gsap.utils.clamp(-12, 12, e.movementX));
  rootEl.addEventListener('pointermove', onMove);
  return () => rootEl.removeEventListener('pointermove', onMove);
});
// Teardown: mm.revert();
```

## Official references

- GSAP docs: https://gsap.com/docs/v3/
- ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- SplitText: https://gsap.com/docs/v3/Plugins/SplitText/
- Flip: https://gsap.com/docs/v3/Plugins/Flip/
- Observer: https://gsap.com/docs/v3/Plugins/Observer/
- React guidance (`@gsap/react`): https://gsap.com/resources/React/
