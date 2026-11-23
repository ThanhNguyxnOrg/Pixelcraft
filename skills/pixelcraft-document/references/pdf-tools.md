# PDF and document toolchains

Choose the toolchain for the source of truth and required control. Do not route every document through screenshots or browser print merely because HTML is familiar.

## Selection matrix

| Tool | Input/model | Best for | Critical constraints |
|---|---|---|---|
| Paged.js | browser HTML/CSS paginated by JS | proofing/printing HTML publications with richer Paged Media behavior | client-side layout cost; browser/runtime integration; verify generated output and hooks |
| WeasyPrint | Python HTML/CSS → PDF | server-generated invoices/reports from HTML templates | does not execute JavaScript; CSS support is broad but not browser-identical; font/layout behavior differs |
| React-PDF (`@react-pdf/renderer`) | React component tree → PDF | app-generated controlled PDFs sharing data/components in JS | not DOM/CSS print; custom primitive layout model with a subset of styles; explicit font registration |
| Typst | markup + programmable typesetting | precise reports, templates, scientific/business documents | separate language/model; learn layout/counter system; browser CSS does not transfer directly |
| LaTeX | TeX source/macros/packages | scholarly/technical typesetting, complex references/math | steep toolchain/package differences; debugging fragmentation requires TeX knowledge |

## Paged.js

Paged.js paginates HTML in the browser and polyfills parts of CSS Paged Media/Generated Content. Typical usage:

```js
import { Previewer } from 'pagedjs';

const flow = await new Previewer().preview(
  document.querySelector('#content'),
  ['/print.css'],
  document.querySelector('#preview'),
);
console.log(`Rendered ${flow.total} pages`);
```

The polyfill build can also run in the page:

```html
<script src="/vendor/paged.polyfill.js"></script>
```

Serve a pinned local/project-controlled copy rather than depending on a mutable third-party CDN in production or document-generation pipelines.

Rules:

- wait for fonts/images/data before previewing or use the documented async configuration/hooks;
- account for rendering time on long documents;
- do not assume the DOM after chunking behaves like ordinary screen layout;
- use hooks for running headers/footers or custom page behavior only after reading the handler lifecycle;
- validate page counters, named pages, blank pages, margin boxes, and repeated table headers in actual output.

## WeasyPrint

WeasyPrint turns HTML/CSS into PDF in Python:

```python
from weasyprint import HTML

HTML('invoice.html', base_url='./static/').write_pdf('invoice.pdf')
```

Important constraints:

- it does not execute JavaScript;
- screen/browser behavior is not identical—media queries, flex/grid support, fonts, bidirectional text, and advanced CSS need version-specific verification;
- `@font-face`/`font_config` matters; do not assume system fonts on deployment servers;
- use `base_url` deliberately for images/fonts/static assets rather than hidden filesystem assumptions;
- repeating table headers, margin boxes, counters, named pages, and footnotes can be powerful when supported by the pinned version—test against that version, not a generic feature list.

Generate deterministic fixtures and inspect text extraction/embedding. Do not shell out to a browser if server-generated output must be reproducible unless that cost/security model is explicit.

## React-PDF

`@react-pdf/renderer` is not a DOM renderer. It uses primitives such as `Document`, `Page`, `View`, `Text`, `Image`, `Link`, and SVG-related components with a controlled style subset.

```jsx
import { Document, Page, Text, View, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Inter',
  src: '/fonts/Inter-Regular.ttf',
});

const doc = (
  <Document title="Invoice" author="Example Ltd.">
    <Page size="A4" wrap style={{ padding: 40 }}>
      <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      <View>{/* content */}</View>
    </Page>
  </Document>
);
```

Exact behavioral notes:

- `<Document>` must be the root and its children are `<Page>` elements;
- `Page` defaults to A4/portrait in current v4 docs but accepts explicit size/orientation;
- `wrap` controls page wrapping;
- `fixed` repeats an element on each page;
- `render` on `Text`/`View` receives pagination context; `totalPages` is available for text and is resolved through a multi-pass render;
- styles use JavaScript objects and a constrained layout engine, not the full browser cascade;
- register fonts explicitly, especially for archival/conformance output; built-in standard fonts have limited glyph coverage.

Do not copy browser CSS/grid assumptions. Use simple flex-like layout, measure text expansion, and test long content because wrapping/pagination is library-specific.

## Typst

Typst is a programmable typesetting system with concise markup. Basic page setup:

```typst
#set page(
  width: 210mm,
  height: 297mm,
  margin: (top: 18mm, right: 16mm, bottom: 20mm, left: 16mm),
  bleed: 3mm,
  header: [Report],
  footer: align(right)[#counter(page).display()],
)
#set text(font: "Source Serif 4", size: 10.5pt)
```

Strengths and constraints:

- explicit page dimensions/margins/bleed/headers/footers;
- programmable counters, queries, templates, and layout reuse;
- strong math and bibliography ecosystem;
- not HTML/CSS—web components and browser assumptions do not transfer;
- font availability in the compile environment is part of the artifact contract;
- inspect generated PDF text extraction/bookmarks/links rather than assuming semantic correctness.

Use Typst when repeatability and typography matter more than reusing HTML.

## LaTeX

Use LaTeX when the document already lives in a TeX ecosystem or needs its math/bibliography/macro depth. Relevant primitives:

```tex
\usepackage[a4paper,margin=18mm]{geometry}
\usepackage{fancyhdr}
\pagestyle{fancy}
```

Rules:

- choose engine deliberately (`pdflatex`, `xelatex`, `lualatex`) because font/Unicode behavior differs;
- floating placement is probabilistic unless constrained; inspect actual pages rather than forcing every float;
- use appropriate packages for tables, headers/footers, hyperlinks, accessibility-aware metadata, color, and microtype;
- compile repeatedly and treat auxiliary files/caches as part of reproducibility;
- PDF accessibility/tagging is specialized work, not automatic merely because text is selectable.

## Toolchain verification matrix

| Check | Evidence required |
|---|---|
| pagination | inspect generated PDF/page images at first/middle/last pages |
| fonts | embedded/subset correctly; glyph coverage; license |
| links/bookmarks | clickable destinations and correct metadata where required |
| accessibility | reading order/tags/text extraction/alt text or explicit limitation |
| reproducibility | pinned dependencies/fonts/assets and deterministic build inputs |
| security | no untrusted remote assets/scripts in server rendering; sanitize HTML input |
