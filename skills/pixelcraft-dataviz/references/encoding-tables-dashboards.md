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

## Formatting and units

- Put the unit in the axis title or first tick label (`ms`, `%`, `€`, `requests/s`), not only in a hidden tooltip.
- Use locale-aware decimal/grouping/currency/date formatting in user-facing UI; preserve machine precision only when users need it.
- Round for decision-making resolution, not cosmetic symmetry. Keep enough precision to distinguish consequential differences.
- Use consistent time zone/calendar labeling; mark incomplete trailing periods.
- Explain nulls/gaps. Zero is not missing.
- Use tabular numerals for changing or column-aligned numeric values.

## Tables as visualization

Tables are often the correct visual representation. Design them as scanning instruments:

| Rule | Application |
|---|---|
| alignment | right-align numeric columns; left-align names; align decimal precision or use tabular numerals |
| units | put shared units in headers (`Latency (ms)`); repeat only when mixed |
| hierarchy | primary identifier first; hide low-frequency metadata behind details/overflow |
| comparison | use inline bars/sparklines only when scale is labeled and consistent across rows |
| state | use text plus icon/color for status; never color alone |
| sorting | expose active sort direction/column; preserve stable ordering |
| density | choose row density by frequency/expertise; preserve touch target minimums on interactive rows |
| overflow | truncation needs expansion/copy path; never truncate the only distinguishing part of IDs |

Sparklines show shape, not exact magnitude. Pair them with current/range values and state whether axes are shared across rows.

## Dashboard layout and density

Start from decisions, not chart inventory.

1. Put system health/outliers/actions first; contextual trends second; exploratory detail later.
2. Group by operational object or decision, not by chart type.
3. State time range, freshness, source scope, filters, permissions, and update mode once per coherent region.
4. Preserve drill-down context: selection, filter, sort, time range, scroll, and back/refresh/deep-link state.
5. Use unequal emphasis. Every metric in the same card size teaches users that nothing matters.
6. High-frequency operations favor dense tables and exception queues; infrequent executive overview favors fewer, larger comparisons.
7. Leave enough whitespace to separate regions. Density means information priority, not cramped padding.

Required dashboard states: no data yet, partial ingestion, stale/offline, source error, permission-limited, empty after filter, extreme cardinality, long entity names, and degraded real-time connection. Never fabricate sparklines or placeholder deltas.

## Anti-slop dashboard pattern

Reject the generic grid of four KPI cards, purple gradient area chart, donut, leaderboard table, and “AI insights” box unless each element answers a real question. Replace decorative KPI deltas with explicit comparison periods and confidence/freshness. A dashboard can be visually distinctive through editorial hierarchy, domain-specific visual language, calibrated typography, and precise annotation while remaining operationally boring in interaction.
