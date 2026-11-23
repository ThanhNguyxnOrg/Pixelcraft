---
name: pixelcraft-dataviz
description: Designs and verifies truthful, legible, accessible data visualization across any frontend stack. Use for charts, plots, dashboards, metrics, analytics, scientific visualization, tables as visualization, real-time/streaming data, node/link diagrams, maps/geospatial UI, SVG/canvas/WebGL/3D rendering choices, chart accessibility, and library-specific implementation in D3, Observable Plot, Vega-Lite, ECharts, Recharts/visx, Plotly, matplotlib/Altair, ggplot2, Makie, Swift Charts, or Compose/Vico.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft dataviz

Data visualization is evidence communication, not dashboard decoration. Start with the analytical question and the decision it informs; choose the simplest encoding that preserves magnitude, uncertainty, freshness, and missingness. A technically impressive chart that misreads the data is a failed chart.

## References

- Read [references/chart-choice.md](references/chart-choice.md) when choosing among comparison, distribution, composition, relationship, time, flow, hierarchy, and geographic representations.
- Read [references/encoding-tables-dashboards.md](references/encoding-tables-dashboards.md) for encoding hierarchy, axes, units, direct labeling, annotations, tables as visualization, and dashboard layout/density.
- Read [references/color-accessibility.md](references/color-accessibility.md) for colorblind-safe palettes, redundant encodings, contrast, text alternatives, keyboard interaction, sonification boundaries, and reduced motion.
- Read [references/realtime-graphs-maps-scale.md](references/realtime-graphs-maps-scale.md) for streaming updates, node graphs, maps, SVG/canvas/WebGL/3D scale decisions, and performance verification.
- Read [references/libraries.md](references/libraries.md) when implementing in a specific charting library or language ecosystem.

## Required workflow

1. **Question first.** Write the exact question in words: compare what, over what period, filtered how, measured in which unit, and what decision follows. Reject chart requests that have no readable question.
2. **Audit the data.** Inspect cardinality, type, units, timezone/calendar, nulls, zeros versus missing values, outliers, sampling rate, update latency, duplicate keys, precision, and whether values are counts/rates/estimates/cumulative totals.
3. **Choose the representation.** Use the chart-choice table; prefer small multiples or tables over overplotted multi-series charts. Do not let library defaults choose the chart.
4. **Encode explicitly.** Map columns to position/length/color/shape/facet intentionally. State what is quantitative, categorical, temporal, spatial, uncertainty, and metadata.
5. **Label for reading.** Prefer direct labels and concise annotations; show units, source scope, freshness, and baseline. Legends are fallback navigation, not the primary reading path.
6. **Implement idiomatically.** Use the platform/library reference without forcing browser assumptions into native, document, terminal, or notebook surfaces.
7. **Verify with real cardinality.** Test empty/one/few/many series, extreme values, long labels, null gaps, negative values, locale formatting, dark/high-contrast themes, keyboard/screen-reader path, resize/reflow, and update bursts.

## Non-negotiable rules

| Concern | Rule |
|---|---|
| truthfulness | Never fabricate data, smooth away meaningful variation, truncate axes to exaggerate, or hide missing/uncertain values. |
| baseline | Bar/area magnitude charts include zero unless there is an explicit indexed/change baseline; line charts may use nonzero scales only when labeled. |
| color | Color never carries meaning alone; use direct labels, shape, line style, pattern, position, or text as a redundant channel. |
| interaction | Hover/tooltips are enhancement. Keyboard, touch, screen-reader, and print/static export must retain the substance. |
| density | Match density to decision frequency. Do not turn every metric into an equal card or every dataset into a chart. |
| motion | Animated transitions must explain object constancy or state change; provide reduced-motion/static behavior. |
| performance | Choose rendering technology after measuring element count, update rate, and interaction—not because WebGL sounds advanced. |
| accessibility | Every chart has a text equivalent: summary plus underlying data table/list or structured access appropriate to its complexity. |

## Anti-slop warnings

Avoid the default analytics collage: four KPI cards with invented deltas, a gradient area chart, a donut with unreadable slices, a purple-blue palette, unexplained “live” badges, generic axis ticks, and a legend that forces constant eye travel. Avoid chartjunk copied from demos: heavy gridlines, shadows, glassmorphism, 3D perspective, meaningless animated counters, and decorative map pin clouds. Distinctiveness belongs in editorial judgment, annotation quality, composition, and domain-specific emphasis—not in distorting evidence.

## Pre-submit checklist

- [ ] analytical question, unit, population, filter, timezone, freshness, and decision are explicit;
- [ ] chart type matches the question rather than library convenience;
- [ ] axis baseline/scale/transformation and missing-data treatment are defensible;
- [ ] direct labels or annotation carry the primary reading path;
- [ ] palette is colorblind-safe and meaning is redundantly encoded;
- [ ] empty/one/many/extreme/null/long-label/locale states are designed;
- [ ] text alternative and keyboard/screen-reader path exist;
- [ ] update/rendering performance was measured or explicitly labeled `not-checked`;
- [ ] static export/print/responsive behavior preserves legibility;
- [ ] final claims separate rendered evidence from static inspection/model judgment.
