# Scroll and progression choreography

This reference defines the **surface-independent UX contract** for scroll-coupled and stepped narrative progression. For browser-specific implementation APIs (CSS Scroll-Driven Animations, `IntersectionObserver`, `position: sticky`, or GSAP ScrollTrigger), coordinate with `pixelcraft-web`; for native scroll-offset choreography, coordinate with `pixelcraft-mobile` or `pixelcraft-desktop`.

## Synchronization model matrix

Choose the simplest coupling that communicates the story without fighting user control:

| Coupling model | User-experience role | When to choose | When to avoid |
|---|---|---|---|
| **Normal flow (unpinned)** | Standard continuous reading with inline visuals | Default for articles, docs, and narrow mobile viewports | Only when side-by-side persistent artifact comparison materially aids comprehension |
| **Threshold-activated stages** | Discrete chapter transitions when each section enters reading focus | Step-by-step diagrams, chart filter changes, highlighted callouts | Smooth scrub physics that require frame-by-frame interpolation |
| **Sticky artifact + flowing prose** | One persistent visual stays anchored while explanatory steps scroll alongside | Artifact + annotations, data narratives, product anatomy | Short viewport heights where the pinned visual crowds out readable text |
| **Continuous progress scrub** | Visual transformation tracks user scroll offset proportionally inside a bounded stage | Controlled before/after reveals, bounded timeline/camera progression | Multi-screen forced scrub walls where users lose scroll speed intuition |
| **Explicit stepped controls** | Previous / Next / Chapter selector controls change stage without scroll hijacking | Accessibility fallback, touch carousels, keyboard-first inspection, embedded frames | Never omit as an escape hatch on complex interactive stages |

## Behavioral contract

- **Scroll is read-only input**: Never hijack wheel inertia, touch momentum, scrollbar dragging, PageUp/PageDown, or Back/Forward history.
- **Bounded pinning**: Every pinned visual stage has an unmistakable entry, a bounded duration, and a clean release back into normal flow. Never nest pinned stages inside each other.
- **Anchor-driven state**: Derive chapter state from semantic chapter identifiers/anchors, not brittle raw pixel offsets that break on font load, text zoom, localization expansion, or viewport resize.
- **Bidirectional fidelity**: Scrolling backward, jumping via table-of-contents links, or resizing mid-chapter must settle immediately into the accurate visual state for the visible chapter.
- **Viewport-height budgeting**: Short landscape viewports (e.g., 1280×600 laptops, split-screen tablets) fail pinned layouts faster than narrow widths—test height constraints explicitly and release pinning when the visual plus caption cannot fit comfortably.

## Narrow-viewport and compact fallback

- Prefer linear chapters with inline static or compact interactive visuals on phones and narrow split panes.
- If offering a horizontal step sequence, expose explicit Previous/Next buttons, visible step indicators (`2 of 6`), keyboard arrow controls, and direct chapter links—never scale down a wide desktop pinned canvas into an illegible thumbnail.

## Do/don't pairs

| Do | Don't |
|---|---|
| Keep native scroll physics intact and observe position passively | Intercept wheel/touch events to enforce fake momentum or scroll locks |
| Derive visual state from semantic chapter IDs and deep links | Hardcode magic pixel offsets (`y > 2400`) that drift on text resize |
| Fall back to stacked inline visuals on narrow or short viewports | Pin a 500 px diagram inside a 560 px tall laptop window |
| Provide chapter jumps and a skip-section link | Force readers to scrub through 8 screens to reach the summary |
