---
name: pixelcraft-dataviz
description: Designs and verifies truthful, legible, accessible data visualization across any stack. Use for charts, plots, dashboards, analytics, scientific visualization, tables as visualization, streaming data, node graphs, maps/geospatial UI, rendering scale, and chart accessibility across D3, Observable Plot, Vega/Vega-Lite, ECharts, Chart.js, Highcharts, Recharts, Nivo, Tremor, visx, uPlot, Lightweight Charts, AntV, Plotly, MapLibre, Mapbox, Leaflet, deck.gl, Cesium, PMTiles, Turf, Cytoscape, Sigma.js, Cosmograph, Bokeh, Seaborn, matplotlib, Altair, Datashader, Perspective, Mosaic, ggplot2, Makie, Swift Charts, or Vico.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft dataviz

Data visualization is evidence communication, not dashboard decoration. Start with the analytical question and the decision it informs; choose the simplest encoding that preserves magnitude, uncertainty, freshness, and missingness. A technically impressive chart that misreads the data is a failed chart.

## Surface craft

Start with the judgment the reader must make and expose its comparison baseline, units, uncertainty, and missing values. Use annotations and ordered or small-multiple views when they remove comparison work. Verify the meaning survives monochrome, resizing, and keyboard access; provide a data or text alternative for canvas or hover-only details.

## References

- Read [references/chart-choice.md](references/chart-choice.md) when choosing among comparison, distribution, composition, relationship, time, flow, hierarchy, and geographic representations.
- Read [references/encoding-tables-dashboards.md](references/encoding-tables-dashboards.md) when designing encoding hierarchy, axes, units, direct labeling, annotations, tables as visualization, and analytical dashboard layout/density.
- Read [references/color-accessibility.md](references/color-accessibility.md) when selecting colorblind-safe palettes, redundant encodings, contrast, text alternatives, keyboard navigation, sonification boundaries, and reduced motion.
- Read [references/realtime-graphs-maps-scale.md](references/realtime-graphs-maps-scale.md) when implementing streaming updates, node graphs (`@xyflow/react`, Cytoscape, Sigma.js, Cosmograph, AntV G6), and SVG/Canvas/WebGL/WASM scale tiers (Perspective, Mosaic/DuckDB-Wasm, Datashader).
- Read [references/maps-geospatial.md](references/maps-geospatial.md) when selecting or implementing mapping and geospatial engines (MapLibre GL JS, Mapbox GL JS, Leaflet, OpenLayers, CesiumJS, deck.gl, kepler.gl), Protomaps/PMTiles, Turf.js spatial ops, choropleth pitfalls, or accessible map alternatives.
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
| truthfulness & downsampling | Never fabricate data, truncate magnitude bars, or downsample `10k–1M+` time-series with naive `every-Nth` slicing that erases incident spikes—use **`LTTB` (Largest-Triangle-Three-Buckets)** or **`Min-Max` pixel envelopes**, re-querying raw detail on zoom. |
| latency & query resilience | Render the **primary chart shell in `< 1–2 s`**, keep **filter, hover, cross-filter, and brush responses within `100–200 ms`**, and handle **concurrent multi-user load + explicit query timeouts/cancellation** cleanly without frozen spinners. |
| numeric semantics & `0` vs `null` | Enforce `font-variant-numeric: tabular-nums`, **True Minus `U+2212` (`−`)** on negative values, right-aligned numeric columns, explicit unit headers (`$ USD`, `ms`, `%`), and **strict visual separation between measured `0` and missing `null / — / N/A`** (break lines or render muted `—`; never coerce `null` to `0`). |
| provenance, definitions & SLA freshness | Display **visible data source attribution**, **metric definitions** (formula, scope, exclusions), explicit timezone (`UTC` vs local IANA zone), and a **Data Freshness / SLA Staleness badge** (`Updated 12s ago` escalating to warning/stale state when ingestion lags SLA). |
| baseline & monochrome | Bar/area magnitude charts include zero unless an explicit indexed/delta baseline is labeled; color never carries meaning alone—pair Okabe–Ito / Viridis palettes with direct labels, dash style, shape, or pattern so charts survive grayscale/CVD. |
| PII redaction & export safety | Hover/tooltips are progressive enhancement. **Mask/redact PII on chart tooltips, QA screenshots, and downloadable CSV/XLSX exports**, and neutralize **OWASP CSV/XLSX formula injection** (`=`, `+`, `-`, `@`, `\t`, `\r` prefixes). |
| accessibility | Every chart ships a **screen-reader accessible data-table / text summary fallback** plus **composite keyboard data-point navigation** (`<= 1` `Tab` stop + arrow keys across series/points). |

## Anti-slop warnings

Avoid the default analytics collage: four KPI cards with invented deltas, unattributed metrics without definitions or source provenance, a gradient area chart, a donut with unreadable slices, a purple-blue palette, unexplained "live" badges without SLA timestamps, naive `every-Nth` downsampled lines hiding outages, `null` plotted as `0`, and legends forcing constant eye travel. Distinctiveness belongs in editorial judgment, annotation quality, composition, and domain-specific emphasis—not in distorting evidence.

## Pre-submit checklist

- [ ] analytical question, unit (`$ USD`, `ms`, `%`), **visible data source attribution**, **metric definitions**, explicit timezone (`UTC` vs local), and **Data Freshness / SLA Staleness badge** are visible;
- [ ] **primary chart shell `< 1–2 s`**, **filter/hover/brush response `100–200 ms`**, **concurrent multi-user load + query timeout recovery**, and **`LTTB` / `Min-Max`** dense downsampling verified;
- [ ] numeric columns/labels enforce `tabular-nums`, right alignment, **True Minus `U+2212` (`−`)**, and strict **`0` vs `null / — / N/A`** distinction;
- [ ] direct labels or annotations carry the primary reading path; palette is CVD/grayscale-safe with redundant non-color encoding;
- [ ] **PII masking/redaction** enforced on screenshots and exports, and CSV/XLSX exports escape leading `=`, `+`, `-`, `@`, `\t`, `\r` against formula injection;
- [ ] **screen-reader accessible data-table / text summary fallback + keyboard data-point navigation** verified;
- [ ] **Checklist-Until-Passing Stop-Gate (`<HARD-GATE>`):** walk every checklist item above + run `slop-scan.mjs --fail-on p2`, `check-contrast.mjs`, and `check-acceptance.mjs .pixelcraft/acceptance.json` (`pixelcraft-review`) in a `Fix → Re-verify` loop until passing (`0` `fail`/`pending` rows, `rendered` evidence at real cardinality per `Rule #0.3`).
