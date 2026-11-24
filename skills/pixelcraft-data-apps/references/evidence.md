# Evidence

## Token mapping

Keep project settings in `evidence.config.yaml` and theme configuration in `theme.yaml` at the project root. Define paired light/dark palettes and color scales in `theme.yaml` before overriding individual components:

```yaml
theme:
  colors:
    primary:
      light: "#2563eb"
      dark: "#3b82f6"
  colorPalettes:
    default:
      light: ["#2563eb", "#0d9488", "#d97706", "#7c3aed"]
      dark: ["#60a5fa", "#2dd4bf", "#fbbf24", "#a78bfa"]
```

Verify exact theme keys against the installed `@evidence-dev/evidence` version because palette/theme schemas evolve across releases.

## Layout and responsive idioms

Pages are Markdown files under `pages/`. `evidence.config.yaml` sets defaults such as layout width, navigation, and appearance. Evidence compiles SQL extracts from `sources/` into local Parquet files queried in the browser via **Universal SQL (DuckDB-Wasm)**. Compose operational reports around reading order and decision density rather than equal-height KPI cards. Test narrow screens, print/export views, shared filter URLs, and long dimension names.

## Typography and numeric precision

Configure font families in `theme.yaml` where supported. Keep numeric format strings explicit (`fmt=usd0`, `fmt=pct1`, tabular alignment) and label time grain and timezone in headings or notes. Markdown prose is part of the product: document metric definitions, freshness timestamps, and caveats right beside the visuals.

## Motion and reduced motion

Evidence renders Svelte browser UI. Any custom transitions must respect `prefers-reduced-motion`, and never rely on chart animation as the sole signal that filters or data updated.

## Accessibility specifics

Use semantic Markdown heading levels (`h1` -> `h2` -> `h3`) and plain-language summaries around charts and tables. Validate keyboard reach and visible focus on inputs (`Dropdown`, `DateRange`, `ButtonGroup`), contrast in both light and dark modes, non-color chart encodings, and table column labels in the rendered DOM rather than assuming BI components are accessible by default.

## States and Universal SQL idiom

SQL fenced blocks define named client-side DuckDB-Wasm queries; Svelte components consume them through `{query_name}` props and reactive `${inputs.*}` bindings. Handle empty results, source-build failure, stale Parquet snapshots, and missing permissions explicitly:

````markdown
```sql daily_orders
select
  order_date,
  region,
  revenue_usd
from warehouse.daily_orders
where region like '${inputs.region.value}'
order by order_date desc
```

<Dropdown data={regions} name=region value=region title="Region">
  <DropdownOption value="%" valueLabel="All regions" />
</Dropdown>

{#if daily_orders.length === 0}
  No orders match the selected region. Widen the filter or check the latest source build.
{:else}
  <BarChart data={daily_orders} x=order_date y=revenue_usd yFmt=usd0 title="Daily revenue" />
  <DataTable data={daily_orders} search=true rows=15 />
{/if}
````

## Forms and filter idiom

Use labeled Evidence input components (`Dropdown`, `DateRange`, `TextInput`, `ButtonGroup`). Reflect active filters in prose or headings, validate date/numeric bounds, and avoid constructing unquoted raw SQL identifiers from user text even against local DuckDB-Wasm snapshots.

## Do/don't pairs

| Do | Don't |
|---|---|
| Svelte component syntax (`<DataTable data={daily_orders} />`) | Liquid/Markdoc syntax (`{% table data="daily_orders" /%}`) that fails to compile |
| Run `npm run sources` to refresh Parquet extracts before `npm run build` | Deploy stale `static/data` snapshots without checking source freshness |
| Version-controlled `evidence.config.yaml` and `theme.yaml` | Undocumented local-only theme or connector settings |
| `{#if query.length === 0}` empty states beside affected charts | Blank chart regions with no explanation |
| Visible last-built timestamp and source caveats | Implying live warehouse queries when serving static Universal SQL extracts |

## Known traps

Warehouse credentials committed to `sources/*/connection.yaml` (use env vars), unbounded source queries bloating browser Parquet downloads, implicit timezone/date-grain mismatches between warehouse SQL and DuckDB-Wasm, SQL dialect differences across connectors, stale static builds, filter state confusion on narrow viewports, and prose diverging from SQL logic.

## Verification commands

```sh
npm run sources
npm run build
npm run dev
```

`npm run sources` verifies connector extraction into Universal SQL / DuckDB-Wasm Parquet files (`static`/`data` evidence); `npm run build` validates Svelte/Markdown compilation (`static`); browser inspection across light/dark modes and narrow viewports is required for `rendered` evidence.
