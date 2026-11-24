# Scroll implementation

## Synchronization choices

- CSS Scroll-Driven Animations / ScrollTimeline: simple progress interpolation where support and fallback are verified.
- IntersectionObserver: threshold-based entry/state activation, not pixel-precise scrub.
- Sticky positioning: a stable artifact with normal document text around it.
- GSAP ScrollTrigger: coordinated timelines, scrub, and bounded pinning when complexity justifies JavaScript.
- Native scroll: default for ordinary reading and navigation.

## Implementation contract

- Use the browser's scroll position as input; do not replace wheel/touch.
- Pin within a bounded section and restore normal flow at a clear end.
- Use stable chapter IDs and anchors; don't derive the only state from scroll pixel offsets.
- Handle resize, font load, image dimensions, dynamic content, browser history, and reverse scrolling.
- Avoid multiple nested pinned scenes and multiple scroll libraries.
- Keep a progress indicator truthful and keyboard-accessible.
- Test at short viewport heights and landscape; viewport height is often the limiting dimension.

## Mobile alternative

Prefer linear chapters with static/small inline media. If using a horizontal sequence, provide visible controls, keyboard support, and direct links. Do not force a wide pinned experience into a small viewport by scaling it down.
