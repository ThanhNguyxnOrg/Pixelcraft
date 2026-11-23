# Observable Framework

## Token mapping

Keep generated DTCG values in version-controlled static assets/modules and map them once into CSS custom properties, shared JavaScript style objects, and chart scales. `observablehq.config.js`/`.ts` can define project-level structure such as `title` and `pages`; inspect the installed version before depending on newer theme/config keys. Prefer a project stylesheet and semantic custom properties over repeating hex values in Markdown/JS blocks:

```css
:root {
  --pc-action: oklch(55% 0.15 250);
  --pc-surface-raised: oklch(98% 0.01 250);
}
```

## Layout and responsive idioms

Framework pages are Markdown/HTML documents with executable JavaScript blocks. Use normal document flow first, then CSS grid/flex containers for dense dashboards. Design cards/panels from the data-reading task rather than copying a generic SaaS grid. Test narrow embeds, wide monitors, print/export where relevant, and sidebar/table-of-contents behavior configured for the project.

## Typography/custom fonts

Load fonts deliberately through static assets/stylesheet with fallback metrics and licensing checked. Data labels often need tabular numerals; long SQL/category labels need wrapping/truncation rules. Do not let chart type become the only readable text on the page.

## Motion/reduced motion

Observable Framework output is browser UI, so CSS/JS motion must honor `prefers-reduced-motion`. Keep transitions purposeful and do not animate every chart update:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

## Accessibility specifics

Use real headings, labels, buttons, links, tables, and form controls in Markdown/HTML. Treat canvas/SVG charts as inaccessible until given text summaries, table alternatives, keyboard/focus behavior where interactive, and non-color encoding. Verify Plot/custom SVG aria behavior rather than assuming it.

## States idiom

Data loaders create static snapshots at build time; surface freshness, build failure, empty result sets, runtime fetch failure, permissions, and stale-cache state explicitly. `FileAttachment("name.json")` must use a static literal path and is only a handle until `.json()`, `.csv()`, or another contents method is invoked. Runtime `fetch`/WebSocket behavior needs loading/offline/error states separate from build-time loader behavior.

## Forms idiom

Use labeled native inputs/selects and preserve user selections across navigation where expected. Validate numeric/date/query parameters before use, show active filters in text, and never let malformed input become unsafe SQL or a misleading chart.

## Do/don't pairs

| Do | Don't |
|---|---|
| `FileAttachment("quakes.json").json()` | dynamically constructing a `FileAttachment` path that static analysis cannot resolve |
| polyglot data loaders for reproducible snapshots | giving every browser direct warehouse credentials |
| visible data timestamp/build provenance | silently stale dashboard numbers |
| text summary plus accessible table | a color-only canvas chart as the sole evidence |
| semantic CSS custom properties | hex literals scattered through Markdown JS blocks |

## Known traps

Static snapshot freshness, accidentally exposing secrets to client code, unstable custom selectors, oversized serialized data, chart accessibility gaps, notebook-vs-app mental model confusion, runtime/build data divergence, Markdown pages that look correct while loader output is empty.

## Verification commands

```sh
cat observablehq.config.js 2>/dev/null || cat observablehq.config.ts
cat package.json
npm run build
npm run dev
```

Exact scripts vary by template; inspect `package.json`. Browser inspection of the built/preview page is rendered evidence; a successful build is only static evidence.
