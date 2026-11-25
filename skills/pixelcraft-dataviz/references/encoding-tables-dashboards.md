# Encoding, labeling, tables, and dashboards

## Encoding hierarchy

Approximate perceptual effectiveness for quantitative reading, strongest first:

1. position on a common scale;
2. position on aligned but noncommon scales;
3. length/height;
4. angle/slope;
5. area;
6. volume/3D depth;
7. color saturation/luminance;
8. hue alone.

Choose the strongest available channel for the most important variable. Do not encode the primary magnitude with hue while using x/y position for a less important dimension. Never use 3D perspective in ordinary statistical charts: depth distorts length and area.

Reserve channels deliberately:

| Channel | Good use | Misuse |
|---|---|---|
| x/y position | primary quantitative or ordered variable | jitter/random placement without explanation |
| length | magnitudes with shared baseline | truncated bars |
| hue | limited categories/series identity | continuous quantity or dozens of categories |
| luminance/saturation | ordered intensity/density | unrelated categories |
| shape/line style | redundant category encoding | decorative variety |
| size/area | true third quantitative variable | emphasis without scale legend |
| motion | object constancy during meaningful transitions | looping decoration |

## Axes, scales, and baselines

- Bar/column/area charts require a zero baseline because length/area encodes magnitude. If a nonzero baseline is semantically required, transform the value explicitly (for example “change since baseline”) and label it.
- Line charts need not start at zero when the question is local variation, but the axis range must not exaggerate noise. State units and relevant baseline/reference lines.
- Use logarithmic scales only when ratios/orders of magnitude are the question. Label the log scale and never silently mix log/linear panels.
- Use consistent scale domains in small multiples when comparing magnitude. Independent scales are for shape comparison only and must say so.
- Show uncertainty intervals with the same visual priority as estimates when decisions depend on them.
- Do not drop outliers silently. Clamp only with visible broken-axis/overflow notation or provide a scale toggle.

## Direct labels before legends

Prefer in order:

1. direct series/end-point labels;
2. labels in a consistent side rail aligned by position;
3. annotated representative values;
4. interactive tooltip as supplemental detail;
5. separate legend.

Legends force eye travel and color-memory lookup. When one is unavoidable, make it keyboard/touch operable, use the same ordering as visual end positions where practical, and pair color with line style/shape/text. Do not let legend toggling be the only way to understand series identity.

Annotation should answer “what should I notice?” Use sparse domain-specific callouts: threshold crossed, abnormal event, missing feed, target/benchmark, confidence boundary. Remove annotations that merely restate axis values.

When two percentage series answer related but different questions, repeat their denominators in local labels rather than writing only “share” or distinguishing them by hue. If a comparison becomes a stack on phones, keep the order, date range, denominator and common domain close to each value. Verify that a reader can explain which group each percentage describes without hover or looking back to the desktop legend.

## Honest numeric semantics, timezone, and SLA freshness

- **Explicit unit headers & axis labels**: put exact units and currency codes in column headers or axis titles (`Revenue ($ USD)`, `P99 Latency (ms)`, `Error Rate (%)`), never hidden exclusively inside hover tooltips.
- **`tabular-nums` + True Minus `U+2212` (`−`)**: apply `font-variant-numeric: tabular-nums lining-nums` on every numeric column, KPI, tick, and live counter, and render negative numbers with **True Minus `U+2212` (`−`)** rather than ASCII hyphen-minus `U+002D` (`-`) so `−` matches `+` glyph width and optical crossbar height:

```ts
export function formatMetric(value: number | null | undefined, unit = ''): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'; // never coerce null to 0
  const formatted = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(Math.abs(value));
  const sign = value < 0 ? '\u2212' : '';
  return `${sign}${formatted}${unit ? `\u00A0${unit}` : ''}`;
}
```

- **Strict separation between `0` (measured zero) and `null / — / N/A` (missing/uncollected)**:
  - **In tables/KPIs**: render measured zero as `0` / `0.00` in standard foreground ink; render missing/uncollected values as muted `—` or `N/A` (`aria-label="No data collected"`) with an explanatory tooltip (`Sensor offline 02:10–02:25 UTC`).
  - **In line/area charts**: break the path across `null` intervals (`defined(d => d.value !== null)` in D3/Plot, `connectNulls: false` in ECharts/Recharts) or bridge only with an explicit dashed "missing interval" style—never drop `null` to the `0` baseline!
- **Explicit display timezone (`UTC` vs local) & Data Freshness / SLA Staleness badge**:
  - Label the active timezone visibly (`2026-11-25 14:00 UTC` or `Local · America/New_York`) and provide a `UTC <-> Local` switch on operational incidents/logs.
  - Pair every live or warehouse-backed region with a **Data Freshness / SLA Staleness badge** (`Updated 12s ago · SLA 60s` -> transitions to high-contrast warning `Stale · 14m behind SLA` when `now - max(event_ts) > sla_ms`).

## Tables as visualization & safe exports

Tables are often the sharpest visual representation. Design them as high-precision scanning instruments:

| Rule | Application |
|---|---|
| alignment | right-align numeric/timestamp columns (`text-align: right; font-variant-numeric: tabular-nums`); left-align text/IDs |
| units | put shared units in column headers (`Latency (ms)`, `Cost ($ USD)`); repeat inline only when rows mix currencies/units |
| `0` vs `null` | `0.0` = observed zero; muted `—` / `N/A` = null/unreported (sort `null` consistently last regardless of `ASC`/`DESC`) |
| comparison | use inline bars/sparklines only when scale + zero/baseline are consistent and labeled across rows |
| state | pair text + icon/shape + color for status; never rely on red/green fill alone |
| overflow | never truncate the distinguishing suffix of IDs/hashes (`…9f4a` or middle-ellipsis + one-click copy) |
| CSV/XLSX export safety | neutralize **OWASP Formula Injection**: prefix string cells starting with `=`, `+`, `-`, `@`, `\t`, or `\r` with `'` before CSV/XLSX export (while exporting true numeric negatives as native numbers in XLSX) so opening exports in Excel/Sheets cannot trigger `DDE` or formula execution |

> **Cross-skill boundary:** `pixelcraft-dataviz` governs analytical tables, numeric alignment, visual encodings, inline sparklines, and dashboard information density. Operational table CRUD (row selection, bulk actions, inline editing, keyset pagination, saved URL filters) coordinates with `pixelcraft-data-apps` and `pixelcraft-patterns`.

## Dashboard layout and density

Start from decisions, not chart inventory.

1. Put system health/outliers/actions and **Data Freshness / SLA status** first; contextual trends second; exploratory detail later.
2. Group by operational object or decision, not by chart type.
3. State time range, explicit timezone (`UTC` vs local), freshness SLA, source scope, and URL-serialized filters once per coherent region.
4. Preserve drill-down context: selection, filter, sort, time range, timezone, scroll, and deep-link URL state.
5. Use unequal emphasis. Every metric in the same card size teaches users that nothing matters.
6. High-frequency operations favor dense `tabular-nums` tables and exception queues; infrequent executive overview favors fewer, larger comparisons.

Required dashboard states: no data yet, partial ingestion, **SLA stale/offline**, source error, permission-limited, empty after filter, extreme cardinality, long entity names, and degraded real-time connection. Never fabricate sparklines or placeholder deltas.

## Anti-slop dashboard pattern

Reject the generic grid of four KPI cards, purple gradient area chart, donut, leaderboard table, and “AI insights” box unless each element answers a real question. Replace decorative KPI deltas with explicit comparison periods, True Minus `−` formatting, and SLA freshness provenance.
