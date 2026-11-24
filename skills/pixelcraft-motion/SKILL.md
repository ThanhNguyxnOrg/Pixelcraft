---
name: pixelcraft-motion
description: Engineers purposeful web and product motion with GSAP, ScrollTrigger, Motion for React, Lenis, springs, Rive, and Lottie. Use for cinematic loaders, scroll-linked scenes, kinetic typography, SVG drawing, magnetic controls, FLIP transitions, marquees, gestures, transitions, lifecycle, and reduced-motion work.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft motion

Treat motion as a designed behavior system, not a decoration layer. Choose the smallest runtime that expresses the approved direction, keep content usable without animation, and verify lifecycle, input, performance, and reduced-motion behavior.

## References

- Read [references/gsap.md](references/gsap.md) for GSAP timelines, ScrollTrigger, plugins, React lifecycle, and cleanup.
- Read [references/motion-react.md](references/motion-react.md) for component, layout, gesture, and spring animation in React.
- Read [references/smooth-scroll.md](references/smooth-scroll.md) before adding Lenis or coordinating smooth scrolling with GSAP/native scroll.
- Read [references/motion-recipes.md](references/motion-recipes.md) for loaders, kinetic type, SVG drawing, magnetic controls, FLIP, marquees, overlays, and transitions.
- Read [references/rive-lottie.md](references/rive-lottie.md) when choosing stateful interactive animation versus timeline/vector playback.

## Runtime selection

| Need | Prefer | Avoid |
|---|---|---|
| Simple state transition, hover, disclosure, or reveal | CSS/native transitions or View Transitions | Adding a runtime for one opacity/transform |
| React component state, gestures, layout/shared layout | Motion for React | Duplicating component animation with GSAP without a reason |
| Art-directed sequence, scroll choreography, SVG drawing | GSAP + required plugins only | One-off timers or unrelated effects |
| Interactive vector state machine | Rive | Ad hoc DOM state logic |
| Decorative vector playback | Lottie/dotLottie | Putting semantic control state only inside animation |
| Scroll easing as a product requirement | Optional Lenis with native fallback | Replacing browser scroll by default |

Do not combine Motion and GSAP on the same elements. Assign ownership by component or interaction boundary. Do not add Lenis merely because a reference site uses it.

## Workflow

1. Inspect project conventions and approved direction. Preserve the installed animation runtime unless change is in scope.
2. Name the motion purpose: input acknowledgment, state explanation, spatial continuity, narrative progression, or a signature expression.
3. Define semantic duration, delay, easing, stagger, and spring tokens; design no-motion, keyboard, touch, hover/focus, interruption, loading, and navigation paths.
4. Use one owner per animated property. Scope timelines to component/route and clean up on unmount, route change, resize, and media-query changes.
5. Verify fast/reverse scroll, scrollbar drag, resize, touch, focus, offscreen pause, and reduced motion in a real browser.

## Guardrails

- Never hide essential copy, navigation, pricing, warnings, or task controls behind animation.
- Never hijack wheel/touch input, suppress the scrollbar, trap keyboard scrolling, or require pixel-perfect scroll positions.
- Respect reduced motion; use an immediate state, static poster, or simple fade where movement is nonessential.
- Hover needs keyboard and touch equivalents. Magnetic effects must not move the hit target away from the pointer or create jitter.
- Split text visually without destroying reading order, selection, copy/paste, translation, or screen-reader semantics.
- Avoid infinite loops in operational interfaces. Pause ambient media offscreen and honor pause/mute.
- Measure layout, paint, compositing, and GPU costs; do not assume will-change or force3D solves performance.
- Confirm exact installed versions and plugin/license access before using separately distributed GSAP features.
- Do not upgrade a brownfield animation stack without an explicit compatibility plan.

## Completion contract

Report runtime choice, motion purpose, cleanup, reduced-motion/input fallbacks, target devices/viewports, and evidence labels. A static screenshot cannot prove a timeline or scroll interaction works.
