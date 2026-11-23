# Evidence

## Token mapping

Evidence projects keep project settings in `evidence.config.yaml` and theme configuration in `theme.yaml` at the project root. Use the theme system for colors, palettes, and scales before local overrides; keep light/dark palettes paired and semantic rather than recoloring individual charts:

```yaml
theme:
  colors:
    primary:
      light: "#2563eb"
      dark: "#3b82f6"
```

Verify exact theme keys against the installed Evidence version because the project has evolved across releases.

## Layout and responsive idioms

Pages are Markdown files, normally under the configured `pages` directory. `evidence.config.yaml` can set defaults such as page width, cards, table of contents, and auto-refresh. Compose operational dashboards around reading order and decision density rather than filling width with equal cards. Test narrow screens, print/export/share links, long dimension names, and navigation depth.

## Typography/custom fonts

Use project theme/layout settings for typography where supported. Keep numeric alignment, units, date granularity, and label truncation deliberate. Markdown prose is part of the product: explain what the query means, freshness, caveats, and action expected.

## Motion/reduced motion

Evidence renders browser UI. Any custom motion must respect `prefers-reduced-motion`; do not use animated chart transitions as the only signal that data refreshed. Auto-refresh needs visible freshness/state feedback.

## Accessibility specifics

Use semantic Markdown headings and text alternatives for charts/tables. Validate keyboard reach and visible focus for filters/buttons, non-color encoding in charts, contrast of both light/dark theme palettes, and table summaries for screen-reader users. Component accessibility varies by version; inspect the rendered page rather than assuming BI components are accessible by default.

## States idiom

SQL fenced blocks define named queries; components consume them through `data` attributes. Handle empty results, warehouse/connectivity failure, invalid credentials, stale snapshots, partial query failure, auto-refresh pending/error, and no-permission states honestly:

````markdown
```sql daily_orders
select * from demo.daily_orders limit 10
```

{% table data="daily_orders" /%}
````

Syntax/version details change; verify against the project template before editing broadly.

## Forms idiom

Use labeled filters/input components supported by the installed version. Show active filters in text, preserve useful filter state across navigation/share links where supported, validate date/numeric ranges, and never expose raw SQL injection paths through interpolated user input.

## Do/don't pairs

| Do | Don't |
|---|---|
| version-controlled `evidence.config.yaml`/`theme.yaml` | undocumented local-only theme or page settings |
| named SQL blocks consumed by components | duplicated ad hoc SQL with inconsistent filters |
| empty/error copy near the affected component | a blank chart region with no explanation |
| light/dark palette contrast checks | one palette copied into both modes |
| visible last-refreshed/source context | implying warehouse freshness without evidence |

## Known traps

Warehouse credential leakage, expensive unbounded queries, implicit timezone/date-grain mistakes, SQL dialect differences by connector, static deployment freshness, theme key/version drift, filter state confusion, component accessibility gaps, Markdown prose diverging from actual query logic.

## Verification commands

```sh
cat evidence.config.yaml
cat theme.yaml
cat package.json
npm run build
npm run dev
```

Exact scripts depend on the generated project. Browser inspection of the rendered report is rendered evidence; successful SQL/build output is static/data evidence only.
