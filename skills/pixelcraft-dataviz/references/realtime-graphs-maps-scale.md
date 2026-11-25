# Real-time data, node graphs, and rendering scale

## Real-time and streaming data

Define the temporal semantics before implementation:

| Question | Required design |
|---|---|
| What is "now"? | Show event time versus ingestion/clock time; state timezone and latency. |
| Is data append-only or revised? | Make corrections/backfills visible rather than silently rewriting history. |
| What cadence matters? | Update at decision cadence, not raw socket cadence. |
| What happens on burst/backlog? | Aggregate, sample honestly, drop nonessential frames, or pause; never freeze silently. |
| What happens disconnected? | Mark last-known data stale with timestamp; preserve user context; reconnect/resume deliberately. |
| Can users inspect history? | Provide pause, time window, scrub/playback, or snapshot semantics. |

Implementation rules:

- Batch expensive rendering with `requestAnimationFrame` (or platform equivalent); never re-render the full chart on every WebSocket message.
- Bound memory with explicit ring buffers/sliding windows and document the retention policy.
- Throttle consumers and pause nonessential rendering when tabs/windows are hidden.
- Reserve stable numeric widths with `tabular-nums` so streaming counters never jitter layout.
- Do not flood screen-reader live regions on every tick; summarize consequential state changes at controlled intervals and provide a pause control.
- Keep badges truthful: "live", "paused", "stale", and "reconnecting" are separate visible states. Avoid pulsing green demo dots and random-walk fake telemetry.

## Node graphs and network diagrams

First clarify the **cross-skill boundary**: analytical topology, dependency, and network visualization (read/explore/cluster/trace) belongs in `pixelcraft-dataviz`. Interactive workflow/node-graph **editors** (automation builders, visual pipelines, canvas undo/redo, node inspector forms) coordinate with `pixelcraft-web` (interaction mechanics) and `pixelcraft-patterns` (creative tools, history/undo).

A force-directed hairball is rarely the right default—match the graph engine to node count and task:

| Graph engine | Rendering | Sweet spot | Best fit | Practical trade-off |
|---|---|---|---|---|
| **`@xyflow/react` v12 / `@xyflow/svelte`** | DOM/HTML nodes + SVG edges | < 1,500 visible nodes | Workflow/pipeline editors, custom rich node UIs, architecture diagrams | Rich DOM nodes slow down past ~1–2k simultaneous elements; pair with ELK/dagre layout |
| **Cytoscape.js** | Canvas 2D | 500–10k elements | Analytical network exploration, bioinformatics, compound graphs (`cose`, `breadthfirst`, `elk`) | Canvas is opaque to screen readers; requires external list/neighborhood text view |
| **AntV G6 (v5)** | Canvas 2D / WebGL / SVG | 1k–100k elements | Enterprise lineage, combo/nested graphs, radial/dagre/force layouts | Larger API surface; verify bundle splitting and accessibility wrappers |
| **Sigma.js (v3 + Graphology)** | WebGL | 10k–100k+ nodes/edges | Large interactive network exploration, citation/knowledge graphs | Custom WebGL shaders needed for non-standard node shapes; external search/table required |
| **Cosmograph** | WebGL / GPU force simulation | 100k–1M+ nodes/edges | Massive graph exploration and GPU-accelerated force layout | High GPU demand; always provide filtered subgraphs and non-visual summaries |

### `@xyflow/react` v12 & `@xyflow/svelte` rules

- Migrate legacy `reactflow` imports to `@xyflow/react` v12 (supports `colorMode="system" | "dark" | "light"`, SSR hydration with explicit node dimensions, and computed layout hooks) or `@xyflow/svelte` for Svelte 5 apps.
- Model controlled state (`nodes`, `edges`, `onNodesChange`, `onEdgesChange`) when selection, persistence, or undo matters.
- Compute deterministic initial layouts with **ELKjs** or **dagre** before mounting; call `fitView` once on initial load, not on every data mutation.
- Set `nodesFocusable` and `edgesFocusable`, configure permission-gated editing (`nodesDraggable`, `nodesConnectable`), and verify visible keyboard focus rings inside custom node DOM.

### Universal graph UX rules

- Label edge direction and meaning; never add decorative arrows.
- Cluster or collapse dense neighborhoods with visible member counts and expand/collapse controls.
- Preserve zoom/pan and user-adjusted node positions across data refreshes.
- Always supply search/jump-to-node, shortest-path or neighbor highlighting, and explicit empty, disconnected, cyclic, and permission-redacted states.

## Maps and geospatial UI

Use a map only when geography itself is the analytical key (otherwise prefer ranked bars, tables, or tile-grid cartograms). For full geospatial engine selection (MapLibre GL JS, Mapbox, Leaflet, OpenLayers, deck.gl WebGL2 interleaving, CesiumJS), self-hosted Protomaps/PMTiles, Turf.js client spatial ops, and choropleth pitfalls (normalization, breaks, missing-data fills, boundaries), read [maps-geospatial.md](maps-geospatial.md).

## Rendering and data-scale tiers

There is no single cutoff—measure on target hardware—but use this architectural ladder:

1. **SVG / DOM** (dozens to ~2,000 marks): Default when crisp typography, CSS theming, print export, and native accessibility matter most.
2. **Canvas 2D** (~2k to ~100k marks, or high-frequency time series): Use `uPlot`, `ECharts`, `Chart.js`, or `TradingView Lightweight Charts` with an external semantic summary/table.
3. **WebGL / GPU** (100k–10M+ points or dense graphs): Use `deck.gl`, `Sigma.js`, `Cosmograph`, `Plotly scattergl`, or `GLMakie` with binary typed arrays (`Float32Array`) and context cleanup on unmount.
4. **WASM & SQL pre-aggregation** (multi-million-row interactive filtering & streaming pivots):
   - **UW IDL Mosaic + DuckDB-Wasm**: Materializes pre-aggregated data cubes so brushing/cross-filtering millions of rows stays sub-16ms in the browser.
   - **FINOS Perspective**: C++/Rust WASM streaming engine for high-frequency financial blotters, virtualized pivots, and live views.
   - **Datashader (Python)**: Server/GPU rasterization for billion-point distributions without browser overplotting.
5. **3D only when depth carries information** (terrain, molecular structures, physical digital twins, orbital trajectories)—never to embellish a 2D chart.

Canvas, WebGL, and WASM layers never waive accessibility: retain an offscreen/external semantic data summary, keyboard controls, and CSV/table access.

## Perceptual time-series downsampling (`LTTB` & `Min-Max` envelopes)

Never downsample dense time-series (`10k–1M+` points) onto an `800–1600px` chart using naive `every-Nth` stride slicing (`rows[::step]` or `points.filter((_, i) => i % step === 0)`): stride slicing drops `99%` of samples blind to amplitude, **erasing single-tick P99 latency spikes, voltage transients, and flash crashes**.

| Method | Target budget | Guarantee & best fit |
|---|---|---|
| **`LTTB` (Largest-Triangle-Three-Buckets)** | `2×`–`4×` chart CSS pixel width (e.g. `1,500–3,000` points for a `1000px` plot) | Selects the actual observed point in each bucket maximizing triangular area with neighbors—preserving local extrema, slopes, and exact hoverable `(t, y)` coordinates without inventing synthetic averages |
| **Per-pixel `Min-Max` (M4) envelope** | `1` bucket per horizontal pixel (`[first, min, max, last]` or `[min, max]` band) | **Mathematically lossless visual hull**: every spike and drop across millions of rows renders inside the pixel column's vertical stroke; ideal for observability, oscilloscope, and financial tick series |
| **Zoom-triggered re-query** | Re-run `LTTB` / `Min-Max` on `[t_start, t_end]` in SQL/DuckDB/Polars |Brushing into a 5-minute incident window switches seamlessly from downsampled overview to raw unaggregated events, displaying a badge (`Downsampled · LTTB 2,000 pts` vs `Raw · 840 pts`) |

## Performance verification

Measure with realistic cardinality (`10k–1M+` points) and device constraints:

- initial parse, `LTTB` / `Min-Max` reduction, WASM/tile fetch, layout, and first-paint time;
- frame time during pan, zoom re-query, brush, hover, and filter changes;
- spike-preservation check: inject a single-sample `10×` outlier into a `100k`-point series and verify it remains visible at overview zoom (`rendered`);
- memory and WebGL context cleanup across route changes and reconnects;
- bundle, worker, and tile payload size plus mobile thermal/battery behavior.

Label measurements honestly as `rendered` or `not-checked`—a 20-row mock dataset proving 60 fps is not scale evidence.
