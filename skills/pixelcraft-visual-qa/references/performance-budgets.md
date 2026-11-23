# Performance budgets

Budgets are user-experience constraints, not score chasing. Set them during planning and measure in the real runtime whenever possible.

## Core Web Vitals

| Metric | Good threshold | What it represents |
|---|---:|---|
| LCP | ≤ 2.5 s at p75 | largest contentful paint / perceived loading |
| INP | ≤ 200 ms at p75 | interaction responsiveness |
| CLS | ≤ 0.1 at p75 | visual stability |

Use field data when available. Lighthouse/WebPageTest/local tracing are lab evidence and must be labeled as such. Do not optimize hidden test widgets at the expense of the real page.

## Interaction and frame budgets

| Surface | Budget |
|---|---|
| pointer/keyboard acknowledgment | visible feedback within 100 ms; preferably immediate |
| ordinary 60 Hz frame | 16.7 ms total frame budget; leave main-thread headroom |
| high-refresh/game frame | 11.1 ms at 90 Hz, 8.3 ms at 120 Hz; engine/platform dependent |
| scrolling/dragging | no long task blocking input; virtualization for large lists |
| startup | meaningful skeleton/first useful surface before decorative assets |

## Indicative web asset budgets

Adjust by mode and document the choice.

| Mode | Initial compressed JS+CSS | Notes |
|---|---:|---|
| content/read | ≤ 150–250 KB | prioritize fonts/images and stable measure |
| operate/dashboard | ≤ 250–450 KB | route-level splitting; avoid chart/map cost on unrelated routes |
| persuade/experience | ≤ 350–700 KB | media-heavy work needs explicit loading/adaptive quality |
| embedded/widget | ≤ 100–200 KB | host page pays additional cost |

Fonts: subset and limit families/weights; use `font-display` appropriate to content. Images: responsive sizes, modern formats when supported, explicit dimensions to prevent CLS. Video/3D: adaptive quality, poster/loading state, reduced-motion/data path.

## Measurement commands and signals

- Browser: Performance panel, Lighthouse/WebPageTest, `performance.measure`, long-task/INP observers, coverage and bundle analyzer.
- Native/mobile: platform profiler, frame-time instrumentation, startup tracing, memory/energy impact.
- Game: engine profiler, CPU/GPU frame breakdown, texture/font atlas cost, worst-scene capture—not menu-only measurement.
- Terminal: startup latency, resize redraw cost, input echo latency; snapshot tests do not measure runtime performance.

## Budget failure response

1. identify the user-visible symptom and measurement context;
2. attribute cost before deleting features;
3. fix the largest causal cost (blocking work, payload, layout instability, memory pressure);
4. remeasure the same surface;
5. report before/after numbers or `not-checked` honestly.

## Rendered payload inventory

For web surfaces, record total compressed transfer, JavaScript transfer, CSS/media/font cost where available, request count, LCP, CLS, and whether the measurement was cold, warm, cached, throttled, or emulation. Separate requests/bytes initiated before document load from deferred or idle work so a heavy initial payload cannot hide inside a lazy-loading total. In the live corpus of high-end marketing, portfolio, product, editorial, and gallery pages, the desktop median was approximately **3.1 MB compressed transfer and 103 requests**; the upper quartile reached **6.1 MB and 137 requests**, and the worst decile approached **9.9 MB and 217 requests**. Treat those numbers as calibration for how costly polished work can become, not as acceptable budgets.

Keep the mode budgets above as defaults. If a Persuade/Experience direction requires more payload, record the user-facing reason, the expected network/device cost, what is deferred or adaptive, and the explicit waiver owner. Never use visual ambition itself as the waiver.

Watch for two recurring live-production regressions:
- **Zero-CLS, slow-LCP hydration trap**: product sites frequently achieve near-zero CLS (`≤ 0.002`) while still shipping 600 KB–1.5 MB of compressed JS that pushes LCP past 3–6 seconds. Keep critical hero text/media server-rendered and unblocked by client bundles or excessive font preloads.
- **Deferred third-party/media stalling `load`**: heavy video, WebGL scenes, or third-party scripts can hold the document `load` event open well past interactive readiness; isolate them below the fold, lazy-load after first paint, and verify both `DOMContentLoaded` and LCP.

## Style inventory evidence

Use `scripts/style-inventory.mjs` when a browser runtime is available. Its JSON output separates typography, palette, layout geometry, cursor/motion signals, initial/deferred payload and resource-type breakdowns, and basic semantic checks so critique starts from measurements rather than taste adjectives.
