# Real-time data, node graphs, maps, and rendering scale

## Real-time and streaming data

Define the temporal semantics before implementation:

| Question | Required design |
|---|---|
| What is “now”? | show event time versus ingestion/clock time; state timezone and latency |
| Is data append-only or revised? | make corrections/backfills visible rather than silently rewriting history |
| What cadence matters? | update at decision cadence, not raw socket cadence |
| What happens on burst/backlog? | aggregate, sample honestly, drop nonessential frames, or pause; never freeze silently |
| What happens disconnected? | mark last-known data stale with timestamp; preserve user context; reconnect/resume deliberately |
| Can users inspect history? | provide pause, time window, scrub/playback, or snapshot semantics |

Implementation rules:

- Batch expensive rendering with `requestAnimationFrame` in browsers or the platform equivalent; do not re-render the whole chart for every event.
- Bound memory with explicit windows/ring buffers/aggregation and document the retention policy.
- Use backpressure or throttle WebSocket/SSE consumers. Pause nonessential rendering when the page/app is hidden, while continuing or pausing ingestion according to product semantics.
- Avoid layout shift when values update; reserve stable width using tabular numerals and measured placeholders.
- Do not announce every update to assistive technology; use user-controlled inspection and sparse summaries.
- Keep interactions truthful: a “live” badge means actively updating; paused/stale/reconnecting are separate visible states.

Anti-slop pattern: pulsing green “LIVE” dots, random walking demo data, counters that always increase, and sparklines generated only to fill empty space. These are fabricated evidence.

## Node graphs and network diagrams

First decide whether the user needs topology inspection, path tracing, editing, or monitoring. A force-directed hairball is rarely the right default.

### React Flow (xyflow)

React Flow is appropriate for interactive node-based editors and explorable workflows. Practical rules:

- Model controlled state explicitly (`nodes`, `edges`, change handlers) when selection/persistence/undo matters; uncontrolled convenience is for simple demos.
- Use `fitView` deliberately for initial framing; do not reset the viewport on every data update.
- React Flow does not automatically solve graph layout. Use dagre, ELK, or a domain-specific deterministic layout before placing nodes; preserve user-adjusted positions separately.
- Configure editing affordances (`nodesDraggable`, `nodesConnectable`, selection, deletion) according to permission/state rather than leaving demo defaults.
- Provide minimap/controls only when the graph size justifies them; they are not substitutes for orientation labels.
- Enable/maintain keyboard access (`nodesFocusable`, `edgesFocusable`, keyboard navigation support) and test focus visibility. Canvas-like custom node content still needs semantic labels/actions.
- Virtualize/limit rendering for very large graphs; use aggregation/clusters and server-side layout where necessary.

### Cytoscape.js

Cytoscape.js is appropriate for graph analysis and canvas-rendered network visualization. It provides graph primitives, layout algorithms such as grid/circle/breadthfirst/cose, and extension layouts for more advanced constraint solving. Because rendering is canvas-based, keyboard access and screen-reader access are not automatic: provide an external semantic graph/list, keyboard commands, focus/filter controls, and textual neighborhood summaries.

### Graph UX rules

- Label edge direction and meaning; do not use arrows decoratively.
- Use clustering/aggregation when density prevents reading; expose counts and expansion.
- Make selection state and neighborhood emphasis explicit.
- Preserve zoom/pan/layout positions across refresh.
- Supply search/filter and path tracing for large graphs.
- Design empty/disconnected/cyclic/self-loop/permission-hidden-node states.

## Maps and geospatial UI

Choose map technology only when spatial location is essential. Tables, ranked lists, or cartograms often communicate regional comparison better.

### MapLibre GL JS

MapLibre GL JS renders vector tiles using WebGL and style JSON. Verify tile/style/glyph/sprite URLs, attribution, licensing, offline behavior, and network failure. Vector text requires glyph resources; missing glyphs are a common cause of invisible labels. Treat the base map as data with a provider/license, not a decorative background.

### deck.gl

deck.gl provides GPU-accelerated layers (for example `GeoJsonLayer`, `ScatterplotLayer`, `HexagonLayer`, `ArcLayer`) and can sit above MapLibre/Mapbox-compatible base maps. Update layers by supplying appropriately versioned immutable data; measure GPU memory and attribute update cost. Do not use a WebGL map for a handful of static markers if ordinary DOM/SVG is easier to make accessible.

### Choropleth pitfalls

- Normalize counts by population/customer/area only when that denominator is meaningful; otherwise map counts intentionally and label them as counts.
- Classification choice changes the story: quantile, equal interval, natural breaks, manual thresholds. Publish the breaks and rationale.
- Large regions visually dominate small dense regions; consider cartograms/tile grids when area is misleading.
- Missing/no-data regions need a distinct neutral treatment, never zero color.
- Border/territory representation can be politically sensitive; choose boundary datasets consciously and follow user/legal context.
- Color alone cannot carry regional values; provide hover/focus/table ranking and direct labels for key regions.

## SVG versus canvas versus WebGL versus 3D

There is no universal element-count cutoff. Measure target hardware and interaction. Use this decision order:

1. **SVG/DOM first** for dozens to low thousands of elements when selection, accessibility, CSS, print, and text quality matter.
2. **Canvas 2D** when many repeating marks are redrawn as raster and semantic structure can live outside the canvas.
3. **WebGL/GPU** when sustained interactivity with tens/hundreds of thousands of points, images, particles, or GPU aggregation is required.
4. **3D only when spatial depth itself carries information** (molecular, terrain, volumetric, physical scene). Never use 3D merely to make a 2D chart look advanced.

When using canvas/WebGL, accessibility does not disappear: retain an offscreen/semantic data representation, keyboard interaction model, focus proxy where applicable, text summary, and data table/export.

## Performance verification

Measure with realistic cardinality and device/network constraints:

- initial parse/layout/render time;
- frame time during pan/zoom/hover/filter;
- update latency and dropped frames during streaming bursts;
- memory growth across refresh/reconnect;
- bundle/worker/wasm/tile payload;
- battery/thermal behavior on mobile where relevant.

Record whether evidence is `rendered` measurement or `not-checked`. Do not call a visualization “fast” because a tiny demo dataset rendered once.
