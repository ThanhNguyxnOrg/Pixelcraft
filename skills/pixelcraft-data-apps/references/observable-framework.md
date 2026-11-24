# Observable Framework

## Token mapping and config theming

Configure built-in light/dark paired themes and custom stylesheets in `observablehq.config.js` (or `.ts`), then map semantic tokens once into CSS custom properties and shared JS chart scales:

```js
// observablehq.config.js
export default {
  title: "Operations Telemetry",
  theme: ["air", "near-midnight"], // paired light/dark built-in themes
  style: "custom-tokens.css",
  pages: [
    { name: "Overview", path: "/overview" },
    { name: "Regional Breakdown", path: "/regions" },
  ],
};
```

```css
/* src/custom-tokens.css */
:root {
  --pc-action: oklch(55% 0.15 250);
  --pc-surface-raised: oklch(98% 0.01 250);
}
```

## Polyglot data loaders, DuckDB-Wasm, `view(Inputs.*)`, and `resize()`

Observable Framework executes **polyglot data loaders** at build/dev time (`src/data/orders.parquet.py`, `src/data/metrics.json.sh`, `src/data/forecast.csv.R`) and streams their stdout to static files. Warehouse credentials stay server/CI-side, never in the browser bundle.

In Markdown pages, pair **`FileAttachment(...)`** (always with a static string literal path) with **`DuckDBClient.of(...)`**, reactive **`view(Inputs.*)`**, and **`resize((width) => Plot.plot(...))`** so charts fit any container width without horizontal overflow:

````markdown
```js
const db = await DuckDBClient.of({
  orders: FileAttachment("data/orders.parquet"),
});
const region = view(Inputs.select(["ALL", "EMEA", "AMER", "APAC"], { label: "Region" }));
```

```js
const rows = await db.sql`
  SELECT order_date, SUM(revenue) AS revenue
  FROM orders
  WHERE ${region === "ALL" ? sql`TRUE` : sql`region = ${region}`}
  GROUP BY order_date
  ORDER BY order_date
`;
```

```js
display(
  rows.length === 0
    ? html`<p class="empty-state">No orders found for ${region}.</p>`
    : resize((width) =>
        Plot.plot({
          width,
          y: { grid: true, label: "Revenue (USD)" },
          marks: [Plot.lineY(rows, { x: "order_date", y: "revenue", tip: true })],
        })
      )
);
```
````

## Layout, typography, motion, and accessibility

Use Framework's built-in `.grid` / `.grid-cols-2` / `.card` utilities or normal document flow with CSS Grid; design panels around the analytical reading path rather than uniform card mosaics. Set `font-variant-numeric: tabular-nums` on KPIs and tables. Honor `prefers-reduced-motion` for custom transitions:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

Use semantic Markdown headings and `Inputs.table` / prose summaries alongside every SVG/Canvas plot so keyboard and screen-reader users are not locked out of critical numbers.

## States and forms idiom

Surface build-time snapshot timestamps visibly (emit a `generated_at` field from the loader). Distinguish build-time loader errors, empty filtered query results, and runtime `fetch`/WebSocket failures cleanly. Validate any client-side SQL parameters via parameterized `db.sql` templates—never string-concatenate untrusted input into SQL.

## Do/don't pairs

| Do | Don't |
|---|---|
| `FileAttachment("data/orders.parquet")` static literal path | Dynamically built `FileAttachment(path)` strings that break static bundling |
| `resize((width) => Plot.plot({ width, ... }))` | Fixed `width: 960` charts overflowing narrow viewports |
| Polyglot loaders (`.parquet.py`, `.json.sh`) keeping secrets in CI | Shipping warehouse API keys into client-side `fetch()` calls |
| `DuckDBClient.of(...)` with Parquet extracts for multi-MB tables | Shipping giant uncompressed JSON blobs into the browser |
| Paired `theme: ["air", "near-midnight"]` + semantic CSS vars | Hardcoding hex values inside every Markdown JS block |

## Known traps

Dynamic `FileAttachment` paths failing build resolution, stale static snapshots without freshness timestamps, large CSV/JSON payloads instead of Parquet, secrets accidentally committed in client modules, fixed-width plots clipping on mobile, and missing empty-result checks.

## Verification commands

```sh
ls observablehq.config.*
npm run build
npm run dev
```

`npm run build` executes data loaders and verifies static compilation (`static` evidence); inspect the served build across desktop/narrow widths, light/dark themes, and interactive `Inputs.*` filters in a real browser for `rendered` evidence.
