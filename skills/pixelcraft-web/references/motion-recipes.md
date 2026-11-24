# Motion recipe library

These recipes describe reusable behavior, not a visual template. Choose only what supports the product/story.

| Recipe | Sequence | Required fallback/test |
|---|---|---|
| Loader | Small brand mark/indicator reveals, then exits promptly after critical content is ready | Never block navigation; timeout/failure path; skip on reduced motion |
| Kinetic headline | Split short headline by line/word, masked reveal, then settle | Semantic unsplit text, selectable content, instant reduced-motion path |
| SVG stroke reveal | Draw a meaningful path as progress or narrative is explained | Static completed path and readable labels |
| Magnetic CTA | Pointer-relative translation capped to a small travel distance, with inner parallax | Ordinary button position on touch/keyboard; hit area remains aligned |
| Pointer parallax | Small transform response to pointer position | No layout shift; stop on touch, keyboard, and reduced motion |
| FLIP card/modal | Capture origin geometry, move one semantic object to destination, then restore focus on close | Focus trap/restore, Escape, scroll lock only while dialog is open |
| Navigation overlay | Open/close panel with clear focus transfer and staggered items | Keyboard, touch, Escape, no hover dependence |
| Pinned chapter | Persistent media/artifact changes as linear chapters enter | Linear reading path, direct links, short-height and reverse-scroll tests |
| Horizontal narrative | Track advances through a deliberate sequence while vertical page access remains obvious | Native sequential list/swipe alternative; keyboard controls if custom |
| Velocity marquee | Continuous track changes speed/direction with scroll velocity | Pause control, reduced-motion static strip, duplicated decorative text hidden from AT |
| Image reveal | Clip/mask or crossfade as image becomes relevant | Stable dimensions, low-motion fade/static image |
| Route transition | Brief continuity transition around route change | History/back, focus announcement, no blocked navigation |
| Elastic footer | One bounded footer mark responds to entering/leaving viewport | No constant loop; avoid bounce on operational pages |
| Progress indicator | Chapter or task progress tracks real completed/current state | Text or numeric equivalent; no false precision |
| Stateful icon | Small icon/shape communicates a real state transition | Semantic label/state remains outside the animation |

## Choreography rules

- One primary signature movement plus at most two supporting movements at the same moment unless the story requires more.
- Put essential content and controls in the DOM and visible before nonessential choreography.
- Use stagger only where order carries meaning; arbitrary delays make interfaces feel slow.
- Do not randomize a motion on every render. Seed or stabilize randomized values for deterministic QA.
- Clamp pointer displacement and velocity; cancel stale tweens on repeated input.
- Use animation for cause/effect and state, not to conceal loading or fake activity.

## Native CSS motion before JS runtimes

Prefer native browser primitives when the effect does not need JS physics or timeline callbacks:

- **CSS Scroll-Driven Animations** (`animation-timeline: view()` / `scroll()`): gate with `@supports (animation-timeline: view())` and `@media (prefers-reduced-motion: no-preference)`.
- **View Transitions API** (`@view-transition { navigation: auto; }` for MPA or `document.startViewTransition()` for SPA): check feature support and fall back to instant DOM update when unsupported or reduced-motion is set.

```css
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .reveal-plate {
      animation: plate-rise linear both;
      animation-timeline: view();
      animation-range: entry 10% cover 35%;
    }
  }
}

@keyframes plate-rise {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
```
