# Choosing a chart by analytical question

Choose the question before the geometry. Several correct charts can answer one question; choose the one with the least decoding work for the intended audience and data shape.

## Core choice table

| Analytical question | First candidates | Use when | Avoid / correct common misuse |
|---|---|---|---|
| Compare categories | horizontal/vertical bar, dot plot, lollipop, grouped bar | discrete categories or ranked values; horizontal bars for long labels | Don't use a line for unordered categories; don't sort alphabetically when magnitude/rank matters. |
| Change over time | line, slope, step line, column, small-multiple lines | continuous time or ordered periods; line for trend, columns for discrete period totals | Don't connect missing observations across gaps silently; don't use dual y-axes merely to fit two scales. |
| Distribution | histogram, density strip, box plot, violin, empirical cumulative distribution | spread, skew, outliers, quantiles matter | Don't average away distribution; don't use bins that hide multimodality—test several bin widths. |
| Composition of a total | stacked bar, 100% stacked bar, treemap, pie only for 2–5 familiar parts | part-to-whole at one or a few times | Don't use many-slice pies/donuts; angles/areas are weak for comparison. Use ranked bars for exact comparison. |
| Relationship/correlation | scatterplot, bubble only for a third quantitative variable, hexbin/2D density for overplotting | two numeric variables per observation | Don't imply causation; don't use bubbles when area differences are not meaningful. |
| Flow between stages/entities | funnel for ordered conversion stages; Sankey for conserved flow; waterfall for additive change | quantities move through stages or split/recombine | Don't force cyclic/non-conserved networks into funnels; label leakage/dropoff honestly. |
| Geographic pattern | point/symbol map, choropleth for normalized regional rates, cartogram, hex/tile grid map | location itself is the comparison key | Don't choropleth raw counts where population drives values; don't use color-filled regions for sparse point events. |
| Hierarchy/partition | tree, icicle, sunburst, treemap | structure and containment matter more than exact comparison | Don't use deep circular layouts when labels cannot fit; provide breadcrumb/table fallback. |
| Rank/order | ordered bar, dot plot, slope chart | position/rank or change in rank matters | Don't hide ties or unstable confidence intervals. |
| Uncertainty/estimate | point + interval, fan chart, error bars, quantile bands | confidence/credible/prediction interval matters | Never present forecast/estimate as observed fact; label interval definition. |

## Match geometry to data type

- **Nominal categories:** position on a shared baseline is strongest. Sort intentionally: magnitude, semantic order, or alphabetically only for lookup.
- **Ordinal categories:** preserve intrinsic order before magnitude sorting.
- **Time:** check missing intervals, irregular sampling, timezone boundaries, daylight-saving transitions, fiscal versus calendar periods, and whether trailing periods are complete.
- **Quantitative values:** distinguish absolute values, rates, ratios, percentages, cumulative quantities, indexes, and uncertainty. Their axis labels must not be interchangeable.
- **Multiple series:** more than roughly 4–6 visually overlapping lines usually needs small multiples, filtering, aggregation, direct highlighting, or an interactive focus+context design. Measure actual legibility rather than obeying the number blindly.
- **High cardinality:** rank/aggregate the tail only when the remaining group is honestly labeled (“other”, “47 remaining suppliers”), and preserve expansion/drill-down.

## Composition traps

- Pie/donut charts are acceptable only when the number of parts is small, the whole is meaningful, and exact comparison is not required. Direct-label values and percentages; never rely on a detached legend.
- Stacked bars compare the first segment and total well, but middle segments poorly. Use small multiples or grouped bars when every segment matters.
- Treemap area is weak for precise comparison; use it for overview + drill-down, not exact ranking.
- Waterfall charts require unambiguous positive/negative color semantics and connector labels; do not use red/green as the only sign encoding.

## Time and comparison traps

- Dual-axis plots often manufacture correlation. Prefer indexed values, panels, ratio/difference plots, or a clear annotation of why shared scale is impossible.
- Smoothed lines must identify the smoothing window/method. Keep raw observations available when noise is meaningful.
- Slope charts work for two time points/conditions and few entities. They are not a substitute for a full time series.
- Area charts emphasize magnitude and accumulation; overlapping translucent areas become unreadable quickly. Stack only when the sum itself means something.

## Small multiples and tables

Use small multiples when group comparison matters more than cross-group overlay. Keep shared scales when magnitude comparison matters; use independent scales only for shape comparison and label that choice prominently.

Use a table when the user needs exact lookup, sorting, copying, row-level action, or comparison of a handful of values. “Chart or table?” is not a taste decision; it follows the task.

## Anti-slop checks

- A dashboard demo dataset (`sales`, `users`, `revenue`) is not evidence that the chart fits the user's domain.
- Gradients, glow, rounded bars, and dark-mode neon do not compensate for missing labels or meaningless metrics.
- Do not include a donut merely because the layout has an empty corner.
- Do not animate every number counting up unless the count-up explains temporal accumulation.
- Do not normalize away absolute magnitude without saying so.
