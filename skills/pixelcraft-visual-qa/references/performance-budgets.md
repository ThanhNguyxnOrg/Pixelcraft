# Performance budgets

Budgets are user-experience constraints, not score chasing. Set them during planning and measure in the real runtime whenever possible.

## Core Web Vitals & 3-run median Lighthouse

| Metric | Good threshold | What it represents |
|---|---:|---|
| LCP | ≤ 2.5 s at p75 | largest contentful paint / perceived loading |
| INP | ≤ 200 ms at p75 | interaction responsiveness |
| CLS | ≤ 0.1 at p75 | visual stability |
| **Lighthouse (3-run median)** | **Perf ≥ 90, A11y ≥ 95, BP ≥ 95, SEO ≥ 95** | **3-run median under 4G throttling on both mobile and desktop for every primary template** (with real tags active) |

Use field data when available. Lighthouse/WebPageTest/local tracing are lab `rendered` evidence (never `static`—**Rule #0.3**). Always capture a **Network waterfall on the heaviest page** alongside the 3-run Lighthouse medians and cross-browser/device verification (`Chrome`, `Firefox`, `Edge`, `Safari macOS`, real `Safari iOS`, `Chrome Android`).

## Interaction and frame budgets

| Surface | Budget |
|---|---|
| pointer/keyboard acknowledgment | visible feedback within `<= 100 ms`; `> 1 s` progress indicator; `> 10 s` cancellable action |
| ordinary 60 Hz frame | 16.7 ms total frame budget; leave main-thread headroom |
| high-refresh/game frame | 11.1 ms at 90 Hz, 8.3 ms at 120 Hz; engine/platform dependent |
| scrolling/dragging (`LoAF` + flash safety) | zero blocking **Long Animation Frames (`LoAF`)** on scroll/drag; virtualization for large lists; `<= 3 Hz` luminance flash cap (`WCAG 2.3.1`) |
| startup | meaningful skeleton/first useful surface before decorative assets |

## Initial web asset budgets by surface class

Adjust by surface class and lock the target in `.pixelcraft/plan.md` + `.pixelcraft/acceptance.json`:

| Surface class | Initial compressed JS+CSS | Notes |
|---|---:|---|
| Content / editorial | ≤ 150–250 KB | prioritize fonts/images and stable measure |
| Dashboard / app | ≤ 250–450 KB | route-level splitting; avoid chart/map cost on unrelated routes |
| Promotional / rich experience | ≤ 350–700 KB | media-heavy work needs explicit loading/adaptive quality |
| Embedded widget | ≤ 100–200 KB | host page pays additional cost |

Fonts: subset and limit families/weights; use `font-display` appropriate to content. Images: responsive sizes, modern formats when supported, explicit dimensions to prevent CLS. Video/3D: adaptive quality, poster/loading state, reduced-motion/data path.

## Measurement commands and signals

- Browser: Performance panel, **3-run median Lighthouse** (4G throttled mobile + desktop per primary template), **Network waterfall capture on the heaviest page**, `performance.measure`, **INP** 3-phase breakdown (input delay + processing + presentation delay), **Long Animation Frames (`long-animation-frame` / LoAF)** on scroll/drag for script-level jank attribution, coverage, and bundle analyzer.
- Responsiveness engineering: break up long main-thread work with `scheduler.yield()` (fallback `setTimeout(..., 0)`) so user input paints within `≤ 200 ms`; on multi-page sites, evaluate the **Speculation Rules API** (`prefetch`/`prerender` with `eagerness: "moderate"`) for near-instant navigation while respecting data-saver and auth/logout exclusions.

```js
// Yield to the main thread during heavy client work so INP stays <= 200ms
async function yieldToMain() {
  if ('scheduler' in globalThis && typeof scheduler.yield === 'function') {
    await scheduler.yield();
  } else {
    await new Promise((r) => setTimeout(r, 0));
  }
}
```
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
