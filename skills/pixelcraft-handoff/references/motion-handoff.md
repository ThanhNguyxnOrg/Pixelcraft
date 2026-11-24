# Motion handoff specification

When a Figma prototype, Rive state machine, Lottie file, or video reference includes motion, record the interaction contract separately from static appearance before implementing.

## Required fields

| Field | Meaning |
|---|---|
| trigger | user action, scroll threshold, route change, media event, or automatic event |
| initial/final state | semantic state and animated properties (`transform`, `opacity`, clip/top-layer) before/after |
| timing / physics | duration + curve, or spring parameters (`stiffness`/`damping`/`mass` or `duration`/`bounce`), delay, stagger, interruption |
| ownership | component/route and runtime that owns the animation |
| input | pointer, keyboard, touch, controller, or automatic |
| lifecycle | mount, unmount, resize, route transition, background/visibility |
| reduced motion | immediate/static/opacity-crossfade alternative |
| focus/semantics | focus placement, `inert` background handling, reading order, live announcement |
| evidence | prototype link/recording, rendered video/trace, or static inference |

## Concrete motion spec example

```yaml
interaction: InspectorDrawer.openClose
trigger: Click/Enter on "Inspect record" button or Esc/backdrop click to dismiss
states:
  closed: { opacity: 0, transform: "translateX(24px)", visibility: hidden }
  open:   { opacity: 1, transform: "translateX(0)", visibility: visible }
physics:
  spatial: { token: motion.spring.snappy, stiffness: 420, damping: 32, mass: 1 }
  effects: { token: motion.duration.fast, duration: 150ms, easing: ease-out }
interruption: Retarget immediately mid-flight from current velocity/position; never queue
input_parity: Pointer click, keyboard Enter/Space to open, Esc to dismiss, swipe-right on touch
focus_semantics: Focus moves to drawer heading on open; background marked inert; focus returns to trigger on close
reduced_motion: Opacity-only crossfade (100ms, zero translation); same focus contract
evidence: Figma prototype node 42:188 (artifact-observed); target verification via Playwright video + reduced-motion trace
```

## Source-to-runtime translation map

Translate design-tool primitives into idiomatic target runtimes rather than exporting bloated keyframe dumps:

| Design source | CSS (`linear()` / View Transitions) | Motion (React) / GSAP | SwiftUI | Jetpack Compose |
|---|---|---|---|---|
| **Figma Smart Animate** (shared layer across frames) | `@view-transition` / `document.startViewTransition()` + `view-transition-name` | Motion `layoutId` shared layout / GSAP `Flip.from()` | `.matchedGeometryEffect(id:in:)` | `SharedTransitionLayout` + `sharedElement()` |
| **Figma Spring** (`stiffness`, `damping`, `mass`) | Pre-sampled CSS `linear(...)` easing token + compositor-only `transform` | Motion `{ type: "spring", stiffness, damping, mass }` / GSAP custom ease | `.spring(duration:bounce:)` or `Spring(mass:stiffness:damping:)` | `spring(stiffness = ..., dampingRatio = ...)` |
| **Figma Smart Animate** (overlay enter/exit) | `<dialog>`/`[popover]` + `@starting-style` + `transition-behavior: allow-discrete` | Motion `<AnimatePresence>` / GSAP timeline with `clearProps` | `.transition(.opacity.combined(with: .move(...)))` | `AnimatedVisibility(enter = ..., exit = ...)` |
| **Rive state machine** (interactive vector inputs) | `@rive-app/canvas` / `@rive-app/webgl2` bound to semantic UI state + static SVG fallback | Control Rive state inputs (`SMIInput`) from app state; pause offscreen | `RiveViewModel` bound to `@State` + Reduce Motion freeze | `RiveAnimationView` bound to Compose state + static fallback |
| **Lottie** (authored vector playback) | Prefer CSS/SVG for simple icons; use `lottie-web` light/dotLottie only for rich authored spots with static final frame under reduced motion | Play/seek segments by state; never auto-loop > 5s without pause control | `LottieView` (`dotLottie`) respecting `accessibilityReduceMotion` | `LottieAnimation` (`lottie-compose`) honoring `ANIMATOR_DURATION_SCALE` |

## Translation rules

- Reuse the project's animation runtime and motion tokens (`pixelcraft-tokens`) rather than adding a second animation library for one screen.
- Do not copy a prototype's exact millisecond durations blindly—test with real content lengths, mid-tier hardware, and fast repeat clicks.
- Resolve missing keyboard, touch, interruption, and reduced-motion states explicitly; mark assumptions if the prototype omitted them.
- Verify the implemented transition with `pixelcraft-visual-qa` (`motion-capture.md`) alongside static visual fidelity.
