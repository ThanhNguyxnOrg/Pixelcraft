# Library and ecosystem notes

Library defaults are starting points, not design decisions. Verify current documentation for the exact version in the repository; APIs and accessibility support evolve.

## Web and cross-platform charting libraries

| Library / ecosystem | Best use | Rendering / model | Practical notes |
|---|---|---|---|
| **D3.js (v7+)** | Custom, unconventional, tightly controlled browser visualization | ESM-only modular packages (`d3-scale`, `d3-shape`, `d3-array`) | Prefer **"D3 for math, framework for DOM"** in React/Svelte/Vue/Solid instead of mixing `d3.select()` DOM mutations with framework reconciliation. Own axes, transitions, keyboard focus, and text alternatives. |
| **Observable Plot** | Concise exploratory and production statistical graphics | Declarative marks over D3 scales (SVG) | Supports `ariaLabel`/`ariaDescription` and facets. Pair with `resize()` or ResizeObserver plus an explicit summary/table. |
| **Vega (standalone)** | Custom interactive visualization grammars beyond Vega-Lite | Full JSON dataflow grammar (SVG / Canvas) | Supports force, Voronoi, tree, and streaming signals/transforms that Vega-Lite omits. Keep dataflow specs validated and provide external keyboard/table access. |
| **Vega-Lite** | Portable declarative statistical chart specs | JSON grammar compiled to Vega (SVG / Canvas) | Excellent for cross-language reproducibility. Set explicit domains, titles, descriptions, and external focus/table equivalents. |
| **Apache ECharts** | Feature-complete product dashboards and large series | Canvas default; SVG renderer available | Enable `aria: { enabled: true, decal: { show: true } }` for descriptions and colorblind-safe patterns, then inspect actual DOM/Canvas output and external keyboard access. |
| **Chart.js** | Lightweight standard web charts (bar, line, radar, scatter) | Canvas 2D with tree-shakeable controllers/scales | Fast and small bundle, but Canvas content is opaque to screen readers—add explicit summary/table fallbacks and configure `responsive: true` inside a sized wrapper. |
| **Highcharts** | Enterprise/editorial charts requiring strong built-in accessibility | SVG + WebGL `boost` module | Commercial license for for-profit use. Its **`accessibility`** module (roving keyboard focus, screen-reader series descriptions, auto data tables, pattern fills) and **`sonification`** module are industry benchmarks. |
| **Recharts** | Conventional React charts | Declarative React SVG components | `ResponsiveContainer` requires an explicit parent height/width. Label collisions, tooltips, and keyboard accessibility require explicit implementation. |
| **Nivo** | Rich themed React charts (heatmaps, Sankey, Bump, Calendar) | React SVG / Canvas / HTML over D3 | Great aesthetic variety out of the box, but watch bundle size, responsive margin clipping, and missing keyboard navigation on Canvas variants. |
| **Tremor** | Rapid Tailwind/React operational KPIs and SaaS charts | React primitives over Recharts / Radix | Speeds up standard product analytics, but override default card/palette templates so dashboards do not collapse into generic SaaS slop. |
| **visx** | Custom React visualization primitives | Low-level SVG primitives, scales, shapes | D3-level control in idiomatic React without DOM conflicts. You own labels, responsive measurement, transitions, and ARIA semantics. |
| **uPlot** | High-frequency observability, metrics, and telemetry time series | Ultra-fast Canvas 2D (~50 KB) | Renders 100k+ points at 60 fps with minimal memory. Requires explicit container resize wiring, legend formatting, and external text/table access. |
| **TradingView Lightweight Charts** | Financial OHLC/candlestick, volume, and live price streams | Canvas 2D (Apache-2.0 with attribution) | Built for crosshair sync, time-scale zoom, and streaming ticks. Not for general categorical charts; pair with accessible price summary readouts. |
| **AntV (`G2 v5`, `G6 v5`, `X6`, `L7`)** | Unified grammar-of-graphics (`G2`), graphs (`G6`), editors (`X6`), geo (`L7`) | Canvas / SVG / WebGL | Strong enterprise coverage across charts, networks, and maps. Verify English/localized docs, bundle splitting, and accessibility wrappers. |
| **Plotly.js** | Scientific/engineering charts, 3D, WebGL scatter/heatmaps | Mixed SVG + WebGL (`scattergl`, `heatmapgl`) | Heavy full bundle—use partial bundles (`plotly.js-basic-dist-min`) when possible. Modebar and WebGL canvases require external keyboard and tabular access. |

## Python, R, Julia, native, and WASM-scale ecosystems

| Library / ecosystem | Best use | Rendering / model | Practical notes |
|---|---|---|---|
| **matplotlib** | Publication and static scientific graphics in Python | Raster / vector (`SVG`, `PDF`, `PNG`) | Set explicit `figsize`, DPI, `layout="constrained"`, units, and colorblind-safe colormaps. Static images always need alt text and underlying data access. |
| **Seaborn (`seaborn.objects`)** | Declarative statistical graphics in Python | Layered grammar (`so.Plot`) or statistical wrappers over matplotlib | Prefer `seaborn.objects` for composable multi-layer plots with explicit scales and themes instead of ad hoc axes mutation. |
| **Altair** | Declarative Python statistical visualization | Emits Vega-Lite JSON | Use vegafusion or URL/Parquet data transformers for large datasets instead of embedding 50 MB JSON inline in HTML/notebooks. |
| **Bokeh** | Interactive Python browser plots with linked brushing | Canvas / WebGL via `ColumnDataSource` + `CustomJS` | Powers Panel and standalone HTML exports; pair with external data summaries and keep light/dark themes synced with host pages. |
| **HoloViews / hvPlot / Datashader** | Declarative Python plots + million-to-billion-point rasterization | Multi-backend (Bokeh, Matplotlib, Plotly) + CPU/GPU Datashader rasterizer | Use **Datashader** (`rasterize=True` / `datashade=True`) whenever scatter or trajectory density causes overplotting or browser crashes; publish aggregation method and colorbar units. |
| **ggplot2 (R)** | Layered grammar of graphics and statistical figures | Static vector/grid graphics (`thematic` for Shiny) | Direct annotations and facets outperform detached legends. Interactive `girafe`/`plotly` conversions require separate focus and keyboard verification. |
| **Makie (Julia)** | High-performance scientific and publication visualization | `CairoMakie` (vector/static), `GLMakie` (GPU), `WGLMakie` (WebGL) | Pick backend by output: `CairoMakie` for PDF/SVG papers, `GLMakie`/`WGLMakie` for interactive exploration. Set explicit limits and colorbars. |
| **Swift Charts** | Native Apple-platform charts (iOS, macOS, watchOS, visionOS) | Declarative SwiftUI marks | Generates VoiceOver elements automatically; refine with `.accessibilityLabel` / `.accessibilityValue`, Dynamic Type, and chart scrolling. |
| **Vico (Compose)** | Jetpack Compose Android/KMP cartesian charts | Compose-native canvas/model | Add explicit `contentDescription` / semantics and an adjacent tabular readout; verify with TalkBack. |
| **FINOS Perspective** | Real-time streaming pivot tables and analytical charts | C++/Rust WebAssembly engine + virtualized grid & D3FC/canvas | Handles high-frequency streaming updates (financial blotters, logs) directly in browser workers; pair with keyboard-accessible view presets and CSV export. |
| **UW IDL Mosaic / DuckDB-Wasm** | Multi-million-row interactive cross-filtering in the browser or server | `vgplot` / `MosaicClient` SQL coordinator + materialized pre-aggregates | Eliminates browser lag on millions of rows by pushing brush/filter selections into DuckDB pre-aggregated data cubes. Verify Parquet/WASM load progress and empty-brush states. |

## D3 v7 modular idiom ("D3 for math, framework for DOM")

Import only the ESM submodules needed (`d3-scale`, `d3-array`, `d3-shape`) and let the host UI framework (React, Svelte, Vue, Solid, Lit) own DOM reconciliation, reactive updates, and ARIA attributes:

```ts
import { scaleLinear, scaleBand } from 'd3-scale';
import { max } from 'd3-array';

// Pure layout computation reusable in React, Svelte, Vue, or server SVG rendering:
export function computeBarLayout(
  data: { label: string; value: number }[],
  width: number,
  height: number,
) {
  const x = scaleBand(data.map((d) => d.label), [48, width - 16]).padding(0.2);
  const y = scaleLinear([0, max(data, (d) => d.value) ?? 0], [height - 28, 16]).nice();
  return data.map((d) => ({
    ...d,
    x: x(d.label) ?? 0,
    y: y(d.value),
    w: x.bandwidth(),
    h: y(0) - y(d.value),
  }));
}
```

## Cross-ecosystem implementation rules

- **Data contract**: Keep parsing, unit conversion, timezone normalization, null policy, and aggregation outside chart render components. Never let missing fields silently coerce to zero.
- **Themes and tokens**: Map semantic tokens explicitly (`surface`, `text`, `grid`, `categorical`, `positive/negative`, `missing`). Dark mode requires luminance rebalancing, not blind inversion.
- **Resize and reflow**: Measure containers with `ResizeObserver` (or native layout bounds). On narrow screens, switch to horizontal bars, fewer ticks, or small multiples rather than shrinking labels below readability.
- **Export and print**: Test PNG/SVG/PDF/CSV export—WebGL canvases can serialize blank unless `preserveDrawingBuffer` or vector export is handled. Static exports require titles, units, direct labels, and freshness timestamps.
- **Notebook and native embedding**: Notebook rendering is not product accessibility. Native apps should prefer Swift Charts/Vico over WebViews unless cross-platform sharing justifies the bridge and accessibility cost.

## Selection guidance

- Choose **D3 v7 (modular) / visx / standalone Vega** for bespoke interactive encodings when the team can own accessibility and layout.
- Choose **Observable Plot / Vega-Lite / Altair / Seaborn (`seaborn.objects`) / ggplot2** for reproducible statistical grammar.
- Choose **Highcharts / ECharts / Chart.js / Recharts / Nivo / Tremor** for standard product dashboards (prefer Highcharts when turnkey chart accessibility and sonification are priorities and licensing fits).
- Choose **uPlot / TradingView Lightweight Charts** for high-frequency telemetry or financial time series.
- Choose **Datashader / FINOS Perspective / UW IDL Mosaic (DuckDB-Wasm)** when raw point counts or streaming rates exceed ordinary DOM/Canvas limits.
- Choose **matplotlib / CairoMakie** for print/publication vector precision, and **Swift Charts / Vico** for native mobile craft.
