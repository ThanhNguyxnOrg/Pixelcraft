# Library and ecosystem notes

Library defaults are starting points, not design decisions. Verify current documentation for the exact version in the repository; APIs and accessibility support evolve.

| Library/ecosystem | Best use | Rendering/model | Practical notes |
|---|---|---|---|
| D3.js | custom, unconventional, tightly controlled browser visualization | modular functions/scales/shapes; usually SVG/Canvas/WebGL manually | Powerful but unopinionated. Own scales, axes, transitions, accessibility, and cleanup. Use semantic HTML around it; D3 does not make a chart accessible. |
| Observable Plot | concise exploratory/production statistical graphics | declarative marks over D3 scales, SVG | Use meaningful mark channels/facets. Plot supports `ariaLabel`/`ariaDescription` top-level/mark options and generates some mark labels; still provide summary/table and inspect output. |
| Vega-Lite | declarative, portable chart specifications | JSON grammar compiled to Vega; SVG/canvas | Good for reproducible specs/cross-language generation. Use explicit encodings, titles/descriptions, scale domains, and signals carefully. Validate generated spec and test keyboard/focus outside the canvas. |
| Apache ECharts | feature-complete interactive dashboards | mostly Canvas by default; SVG renderer available | Configure axes/series rather than accepting demo themes. `aria` support can generate descriptions/decals when enabled, but validate the actual output. Canvas interaction still needs external keyboard/text access. |
| Recharts | conventional React charts | React components rendering SVG | Composable and familiar, but labels/responsive behavior need care. `ResponsiveContainer` requires a sized parent. Accessibility/tooltip/keyboard behavior is largely your responsibility. |
| visx | custom React visualization primitives | low-level SVG primitives/scales/shapes | Not a batteries-included chart library. Best when D3-like control is wanted inside React. Own semantics, accessibility, transitions, and measurement. |
| Plotly.js | scientific/engineering charts, 3D, WebGL-heavy use | mixed renderers; `scattergl`/`heatmapgl` use WebGL | Powerful built-ins can become heavy. Check bundle cost, modebar accessibility, locale, export behavior, and WebGL fallback. Keyboard/screen-reader support is not a substitute for external data access. |
| matplotlib | publication/static scientific graphics in Python | raster/vector backends | Excellent print/export control. Use explicit figure size/DPI, constrained layout, units, and vector formats. Interactivity depends on embedding/backend; do not pretend a static PNG is accessible without alt text/data. |
| Altair | declarative Python statistical visualization | emits Vega-Lite JSON | Keep data size reasonable for inline specs or use explicit data transformers/URLs according to environment. Validate generated Vega-Lite and browser accessibility rather than assuming notebook rendering is enough. |
| ggplot2 (R) | layered grammar of graphics/statistical plots | static grid/vector graphics by default | Choose geoms/scales deliberately; use theme for typography. Labels/annotations often outperform legends. HTML widgets/plotly conversion needs separate interaction/accessibility verification. |
| Makie (Julia) | high-performance scientific visualization | backend-dependent: CairoMakie for vector/static, GLMakie for interactive GPU, others | Choose backend for output. CairoMakie is appropriate for publication/PDF/SVG-style export; GLMakie for interactive speed. Use explicit axis labels/colorbars/scale limits. |
| Swift Charts | declarative Apple-platform charts | SwiftUI views/marks | Swift Charts generates VoiceOver elements by default for common marks; customize with `.accessibilityLabel` and `.accessibilityValue` where needed. Test Dynamic Type, watch size classes, dark mode, and chart scrolling. |
| Vico (Compose) | Jetpack Compose cartesian charts | Compose-native chart components | Configure cartesian layer/model rather than relying on demo styling. Accessibility support has been limited/evolving—use `contentDescription`/Compose semantics and provide an external textual data representation; verify TalkBack. |

## Cross-ecosystem implementation rules

### Data contract

- Keep data transformation visible and testable: parsing, unit conversion, timezone normalization, null policy, aggregation, sampling, and rounding.
- Do not hide mutation inside chart components. Separate “data preparation”, “visual encoding”, and “interaction state”.
- Use typed schemas where the language supports them. A missing field must not silently become zero.
- Preserve raw precision internally; round only at presentation.

### Themes and tokens

Map semantic tokens explicitly: surface, text, muted grid, categorical series, positive/negative, warning, selection, focus, missing data. Do not hardcode demo blues/purples into every chart. Dark-mode charts need rebalanced luminance and grid contrast rather than simple inversion.

### Resize/reflow

Measure container size, text length, orientation, density, and input modality. Rotate/collapse labels only when readable; otherwise use horizontal bars, fewer ticks, wrapping, small multiples, or interactive detail. Never solve narrow screens by shrinking font below readability.

### Export/print/static fallback

Define PNG/SVG/PDF/CSV export expectations. Canvas/WebGL output can become blank when print/export serialization is ignored; test it. Static exports need title, axis, direct labels/legend, source/freshness, and colorblind-safe encoding because hover is unavailable.

### Notebook/data-app embedding

Notebook rendering is not product accessibility. Streamlit/Gradio/Dash/Panel/Jupyter surfaces may isolate or serialize chart objects differently; verify keyboard focus, theme propagation, cache/update behavior, and whether figure data is duplicated into the page payload.

### Native mobile embedding

Respect platform text scaling, dynamic type, hit targets, haptics/feedback rules, dark mode, localization, and reduced motion. Do not embed a web chart merely because it exists when native accessibility/performance matters; conversely, document the bridge/accessibility cost when a webview is intentional.

## Selection guidance

- Choose **D3/visx** for bespoke interactive visualization when the team can own complexity.
- Choose **Plot/Vega-Lite/Altair/ggplot2** for grammar-driven statistical clarity and reproducibility.
- Choose **ECharts/Recharts/Plotly** for product-facing standard charts where built-in interaction is worth the library cost.
- Choose **matplotlib/CairoMakie/vector output** for publication/static correctness.
- Choose **Swift Charts/Vico** when native platform behavior matters more than cross-platform sharing.
- Choose custom **canvas/WebGL** only after measurement demonstrates SVG/DOM cannot meet the interaction budget.
