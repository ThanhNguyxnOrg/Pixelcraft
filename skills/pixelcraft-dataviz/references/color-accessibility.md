# Color and accessibility for data visualization

## Palette selection

Color supports decoding; it cannot be the only channel. Choose categorical, sequential, or diverging behavior intentionally—do not interpolate a categorical palette merely because it looks attractive.

### Categorical palettes

Use a palette tested against common color-vision deficiency. Okabe–Ito is a strong default for up to eight categories:

| Name | Hex |
|---|---|
| black | `#000000` |
| orange | `#E69F00` |
| sky blue | `#56B4E9` |
| bluish green | `#009E73` |
| yellow | `#F0E442` |
| blue | `#0072B2` |
| vermillion | `#D55E00` |
| reddish purple | `#CC79A7` |

Tableau 10 is another common tested set: `#4E79A7`, `#F28E2B`, `#E15759`, `#76B7B2`, `#59A14F`, `#EDC948`, `#B07AA1`, `#FF9DA7`, `#9C755F`, `#BAB0AC`.

Do not solve more than ~8–10 categories by inventing more hues. Use grouping, small multiples, direct highlighting, shapes, labels, filtering, or aggregation. Avoid red/green-only semantics even in these palettes; pair with shape/text.

### Sequential palettes

Use monotonic luminance for ordered magnitude. Viridis-family palettes are widely tested and print reasonably; example anchor colors include `#440154`, `#3B528B`, `#21918C`, `#5EC962`, and `#FDE725`. For a single-hue operational dashboard, use a controlled light-to-dark scale rather than rainbow interpolation. Do not use rainbow/jet: uneven luminance creates artificial bands and is difficult for color-vision deficiency.

### Diverging palettes

Use only when there is a meaningful midpoint (zero, target, neutral, parity). Anchor examples:

- blue–orange/red: `#2166AC` → `#F7F7F7` → `#B2182B`;
- purple–green: `#762A83` → `#F7F7F7` → `#1B7837`.

Make the endpoint meaning explicit and keep the center neutral. Positive/negative meaning also needs sign, position, icon, or line direction.

## Contrast and theme

- WCAG non-text contrast requires at least 3:1 for meaningful graphical objects and focus indicators.
- Normal text requires at least 4.5:1; large text at least 3:1 under WCAG 2.2 AA.
- Gridlines should be subordinate but still visible; never sacrifice data/background separation for aesthetic faintness.
- Test light, dark, forced-colors/high-contrast, grayscale/print, and projector conditions. Dark mode is not inverted saturation; re-balance luminance.
- Use patterns/hatching in monochrome print or SVG export where supported.

## Redundant encoding

Every categorical color used for meaning needs a redundant channel where practical:

- direct text label;
- line dash/width;
- point shape;
- icon/marker;
- pattern/texture;
- position/facet;
- annotation.

Redundant encoding is not clutter when sparse and systematic. Do not use random shape variety; map shapes consistently across the product.

## Text alternatives

Every chart needs a textual route to the information. Choose depth based on complexity:

1. concise chart summary: question, main pattern, magnitude/rank, uncertainty/freshness;
2. accessible data table/list with the underlying rows or aggregated equivalent;
3. structured point/series navigation for interactive charts;
4. downloadable CSV/JSON where users need independent analysis.

A bare `role="img"` or `aria-label="chart"` is not access. Describe the message (“Revenue rose 18% after March, driven by…”) and provide the data. Do not expose thousands of rows directly to a screen reader without pagination/filtering/aggregation.

## Keyboard and focus interaction

Interactive visualization must define:

- entry into the chart region versus ordinary Tab flow;
- arrow-key movement across points/bars/cells where point navigation matters;
- Home/End/PageUp/PageDown semantics for large series;
- visible focus indicator and synchronized tooltip/crosshair;
- Escape behavior for popovers/modes;
- legend/filter/keyboard equivalent;
- focus restoration after zoom/filter/data refresh.

Do not construct hundreds of Tab stops. Prefer one composite widget with roving focus/internal arrow keys when point-by-point exploration is required.

## Screen readers and live data

- Do not announce every streaming tick. Summarize meaningful state changes at a controlled cadence and provide a pause control.
- Use polite live regions only for consequential alerts; assertive announcements are for urgent failures.
- Keep chart summaries synchronized with filtered/visible data.
- Ensure auto-generated SVG `<title>`/ARIA labels do not contradict custom descriptions.

## Sonification boundary

Sonification can help users perceive trend/rhythm/outliers, but support varies widely and it is not a WCAG substitute for textual/tabular access. If offered, make it opt-in, provide play/pause and speed control, document pitch/timing mapping, never autoplay sound, and keep visual/text equivalents primary.

## Motion and cognitive load

- Animate only meaningful object constancy, filtering, zoom context, or incoming data.
- Respect reduced-motion settings; replace interpolation with instant/static updates.
- Avoid looping pulses except for genuinely time-critical live state; provide pause/stop.
- Keep transition durations short enough not to block scanning; long animation is not a loading state replacement.

## Verification checklist

- [ ] palette tested with color-vision-deficiency simulation or a tested palette/redundant encoding;
- [ ] text/non-text contrast measured in the actual theme;
- [ ] chart summary and data table reflect current filters;
- [ ] keyboard-only user can reach equivalent insight;
- [ ] screen-reader output reviewed or explicitly labeled `not-checked`;
- [ ] forced-colors/print/grayscale behavior inspected;
- [ ] sonification, if present, is optional and never the only access path.
