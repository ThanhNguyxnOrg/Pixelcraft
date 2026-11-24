# PDF and document toolchains

Choose the toolchain for the source of truth, pagination fidelity, accessibility target (PDF/UA, PDF/A), and runtime constraints. Do not route every document through screenshots or browser print merely because HTML is familiar.

## Selection matrix

| Tool | Input / model | Best for | Critical constraints |
|---|---|---|---|
| Playwright / Puppeteer `page.pdf()` | headless Chromium HTML/CSS/JS → PDF | web dashboards, JS charts, modern Grid/Flexbox reports | heavy Chromium runtime; `headerTemplate`/`footerTemplate` run in an isolated DOM without page CSS/fonts |
| Gotenberg | Docker HTTP API (Chromium + LibreOffice + PDF engines) | containerized multi-format conversion (HTML/Markdown/Office → PDF/A & PDF/UA), PDF merging | network/SSRF allowlists required; tune concurrency and container memory |
| PrinceXML | commercial C++ CSS Paged Media engine → PDF | books, regulatory reports, prepress CMYK/PDF/X, footnotes, TOC leaders, PDF/UA-1 | commercial license; non-browser JS subset |
| Vivliostyle | open-source Chromium-based CSS Paged Media CLI/viewer | publications, CJK vertical writing (`vertical-rl`), EPUB/print parity, `string-set`/`target-counter()` | CLI/headless overhead; verify CSS Paged Media feature coverage per version |
| Paged.js | browser HTML/CSS paginated by JS | proofing/printing HTML publications with richer Paged Media behavior | client-side layout cost; post-chunking DOM differs from screen DOM |
| WeasyPrint | Python HTML/CSS → PDF | server-generated invoices/reports from HTML templates, PDF/A-3b & PDF/UA-1 | does not execute JavaScript; CSS subset differs from browsers; explicit `font_config` required |
| React-PDF (`@react-pdf/renderer`) | React component tree → PDF | app-generated controlled PDFs sharing JS/TS data models | not DOM/CSS print; flexbox-like primitive subset; explicit font registration |
| `pdf-lib` | JS/TS programmatic PDF API (Node/Deno/Edge/browser) | modifying existing PDFs, filling/flattening AcroForms, merging, stamping watermarks | no automatic text reflow or HTML/CSS layout; coordinate-driven |
| ReportLab / PDFKit | Python (`platypus`/canvas) or Node.js streaming PDF API | deterministic high-throughput server receipts, tickets, tabular reports without a browser | manual layout/pagination design; explicit TTF font loading for Unicode |
| Typst | programmable markup + typesetting engine | precise technical/business reports, invoices, slide decks, PDF/A & PDF/UA-1 | separate language; browser CSS does not transfer; font set in compile env is part of contract |
| LaTeX (`lualatex`/`xelatex`) | TeX source/macros/packages | scholarly publishing, complex math, bibliographies, legacy TeX pipelines | multi-pass aux builds; PDF/UA tagging requires dedicated packages (`tagpdf`) |
| Quarto | computational Markdown (`.qmd`) + Python/R/Julia/Observable | reproducible data reports, papers, and decks compiled to Typst, LaTeX, RevealJS, DOCX, PPTX | requires Quarto CLI + target renderer (Typst/TeX/Chromium) in CI |
| Office (`docx` / `python-docx`, ExcelJS / SheetJS) | native `.docx` / `.xlsx` OOXML generators | editable business deliverables, audit workbooks, formula-driven spreadsheets | recipients' installed fonts and Office/LibreOffice versions affect pagination |

## Playwright and Puppeteer `page.pdf()`

Use headless Chromium when the document already depends on modern CSS Grid/Flexbox, SVG/Canvas charts, or client-side rendering. Chromium generates tagged PDFs when enabled (`tagged: true` in Playwright / Puppeteer) and supports CSS `@page` margin boxes in Chromium 131+.

```ts
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://127.0.0.1:4173/report', { waitUntil: 'networkidle' });
await page.emulateMedia({ media: 'print' });
await page.evaluate(() => document.fonts.ready);

await page.pdf({
  path: 'report.pdf',
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true,
  displayHeaderFooter: true,
  // Isolated Chromium document: inline styles only, base64 images only, explicit font-size required
  headerTemplate: '<div style="font-size:8px;width:100%;padding:0 16mm;color:#444;">Quarterly Report</div>',
  footerTemplate:
    '<div style="font-size:8px;width:100%;padding:0 16mm;text-align:right;color:#444;">' +
    'Page <span class="pageNumber"></span> / <span class="totalPages"></span></div>',
});
await browser.close();
```

Rules:

- call `emulateMedia({ media: 'print' })` and `await page.evaluate(() => document.fonts.ready)` before printing so print styles and web fonts settle;
- `headerTemplate` and `footerTemplate` render inside an **isolated Chromium document**: external stylesheets, page `@font-face` rules, and remote image URLs do not load—inline CSS directly, set explicit `font-size`, embed logos as base64 data URIs, and allocate `@page` margins large enough so templates do not collide with body text;
- verify Chromium tagged PDF output when PDF/UA accessibility is required (`tagged: true` where supported by the pinned Playwright/Puppeteer version).

## Gotenberg

Gotenberg wraps headless Chromium, LibreOffice, and PDF engines behind a stateless Docker HTTP API for HTML, Markdown, Office (`.docx`/`.xlsx`/`.pptx`) conversion, merging, and archival compliance.

```sh
curl --fail-with-body --request POST http://gotenberg:3000/forms/chromium/convert/html \
  --form files=@index.html \
  --form printBackground=true \
  --form preferCssPageSize=true \
  --form pdfa=PDF/A-2b \
  --form pdfua=true \
  -o report.pdf
```

Rules:

- restrict outbound requests with `--chromium-allow-list` / `--chromium-deny-list` to prevent SSRF when rendering user-supplied HTML;
- use `/forms/libreoffice/convert` for Office-to-PDF conversion and mount identical font packs into the container so metrics do not drift from author machines;
- use `pdfa=PDF/A-3b` when embedding hybrid e-invoice XML attachments and `pdfua=true` for tagged accessibility.

## PrinceXML and Vivliostyle

Choose **PrinceXML** (commercial) or **Vivliostyle** (open-source) when full CSS Paged Media (`string-set`, `target-counter()`, `leader()`, `@footnote` / `float: footnote`, named pages, duplex `:left`/`:right`) is required.

```sh
# PrinceXML: PDF/UA-1 tagged output with CSS Paged Media
prince --pdf-profile="PDF/UA-1" --pdf-lang="en" report.html -o report.pdf

# Vivliostyle CLI: CSS Paged Media & CJK vertical-writing publication build
npx @vivliostyle/cli build report.html -o report.pdf
```

- PrinceXML also supports CMYK / spot colors, `bleed` + `marks: crop cross`, and PDF/X-4 for commercial print shops;
- Vivliostyle runs on Chromium with a CSS Paged Media engine and excels at long-form publications and CJK vertical layouts (`writing-mode: vertical-rl`).

## Paged.js

Paged.js paginates HTML in the browser and polyfills CSS Paged Media / Generated Content:

```js
import { Previewer } from 'pagedjs';

const flow = await new Previewer().preview(
  document.querySelector('#content'),
  ['/print.css'],
  document.querySelector('#preview'),
);
console.log(`Rendered ${flow.total} pages`);
```

Serve a pinned local copy of Paged.js rather than a mutable third-party CDN. Wait for fonts/images/data before previewing, account for chunking latency on long documents, and verify counters, named pages, margin boxes, and repeated table headers in the final PDF.

## WeasyPrint

WeasyPrint turns HTML/CSS into PDF in Python without a browser:

```python
from weasyprint import HTML

HTML('invoice.html', base_url='./static/').write_pdf(
    'invoice.pdf',
    pdf_variant='pdf/ua-1',  # or 'pdf/a-3b' for archival/hybrid e-invoices
)
```

Constraints:

- does not execute JavaScript; pre-render charts as inline SVG or high-DPI PNG;
- configure `FontConfiguration` and ship fonts in the container rather than relying on host OS fonts;
- pass `base_url` explicitly and sanitize untrusted HTML / block `url_fetcher` access to internal URLs.

## React-PDF (`@react-pdf/renderer`)

`@react-pdf/renderer` renders React primitives (`Document`, `Page`, `View`, `Text`, `Image`, `Link`, SVG primitives) into PDF rather than browser DOM:

```jsx
import { Document, Page, Text, View, Font } from '@react-pdf/renderer';

Font.register({ family: 'Inter', src: '/fonts/Inter-Regular.ttf' });

export const InvoiceDoc = () => (
  <Document title="Invoice 2026-041" author="Example Ltd." language="en">
    <Page size="A4" wrap style={{ padding: 40, fontFamily: 'Inter' }}>
      <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      <View>{/* flexbox-like content */}</View>
    </Page>
  </Document>
);
```

- Do not copy CSS Grid or full cascade assumptions; stick to React-PDF's documented style subset;
- register every font weight/style explicitly—built-in standard fonts lack non-Latin glyph coverage;
- test multi-page wrapping (`wrap`, `break`, `fixed`) with worst-case row counts.

## `pdf-lib` (programmatic mutation & AcroForms)

Use `pdf-lib` in JS/TS (Node, Deno, edge workers, browsers) to merge PDFs, stamp page numbers/watermarks, or fill/flatten AcroForm templates. Do not use it as a responsive reflow layout engine.

```ts
import { PDFDocument } from 'pdf-lib';

const pdfDoc = await PDFDocument.load(templateBytes);
const form = pdfDoc.getForm();
form.getTextField('invoice.number').setText('INV-2026-041');
form.flatten();
const outBytes = await pdfDoc.save();
```

Register `@pdf-lib/fontkit` and embed a TTF/OTF subset whenever filling fields with Unicode/CJK/diacritic characters; standard WinAnsi fonts throw on unsupported code points.

## ReportLab (Python) and PDFKit (Node.js)

Use **ReportLab** (`platypus`) in Python or **PDFKit** in Node.js for fast, deterministic, browser-free server PDFs:

```python
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet

pdfmetrics.registerFont(TTFont('Inter', 'fonts/Inter-Regular.ttf'))
doc = SimpleDocTemplate('statement.pdf', pagesize=A4, leftMargin=18*mm, rightMargin=18*mm)
styles = getSampleStyleSheet()
styles['Normal'].fontName = 'Inter'
doc.build([Paragraph('Account Statement', styles['Normal'])])
```

```ts
import PDFDocument from 'pdfkit';
import fs from 'node:fs';

const doc = new PDFDocument({ size: 'A4', margin: 50, tagged: true, lang: 'en-US' });
doc.pipe(fs.createWriteStream('receipt.pdf'));
doc.font('fonts/Inter-Regular.ttf').fontSize(11).text('Receipt #2026-041');
doc.end();
```

Both require explicit TTF/OTF registration for non-Latin text and deliberate pagination logic for multi-page tables.

## Typst

Typst (0.12–0.14+) is a fast programmable typesetting engine with explicit `context` introspection, archival/accessibility PDF standards, and `@preview` packages (**Touying** / **Polylux** for slides, **CeTZ** for vector diagrams):

```typst
#set document(title: "Quarterly Operations Report", author: "Example Ltd.")
#set page(
  paper: "a4",
  margin: (top: 18mm, right: 16mm, bottom: 20mm, left: 16mm),
  header: [Quarterly Operations Report],
  footer: context align(right)[#counter(page).display("1 / 1", both: true)],
)
#set text(font: "Source Serif 4", size: 10.5pt, lang: "en")
```

Rules and Typst 0.12–0.14+ capabilities:

- **`context` is mandatory** for inspecting dynamic state (`counter(page).display()`, `query(heading)`): calling `#counter(page).display()` outside a `context` block fails in Typst 0.11+; for simple page numbering without a custom footer, `#set page(numbering: "1")` is sufficient;
- **Bleed / TrimBox**: `#set page(...)` does not guarantee a universal `bleed` parameter across Typst versions—verify the pinned Typst release or prepress package before relying on native TrimBox/bleed flags, or expand page dimensions explicitly (`width: 210mm + 6mm, height: 297mm + 6mm`) with trim offsets and crop marks;
- **PDF/A & PDF/UA-1**: compile with `typst compile --pdf-standard a-2b` or `--pdf-standard a-3b` (hybrid e-invoices/attachments), and `--pdf-standard ua-1` (Typst 0.14+ tagged PDF/UA-1, pairing `#set document(title: ...)` with `image(..., alt: "...")` and semantic headings/tables);
- **HTML export**: Typst 0.13+ exposes experimental single-source HTML export (`typst compile --format html --features html`) for publishing web + print from one source—gate behind feature verification;
- pin `@preview/...` package versions and bundle fonts with `--font-path` in CI so builds remain reproducible.

## LaTeX

Use LaTeX when the document lives in an academic/TeX pipeline or needs TeX's math and bibliography tooling:

```tex
\usepackage[a4paper,margin=18mm]{geometry}
\usepackage{fancyhdr}
\pagestyle{fancy}
```

- Pick `lualatex` or `xelatex` for native OpenType/Unicode/CJK/RTL fonts instead of legacy `pdflatex`;
- run multi-pass builds (`latexmk -lualatex`) so TOC, references, and page counts converge;
- PDF/UA tagging in LaTeX is opt-in (use the LaTeX Tagging Project / `\DocumentMetadata{tagging=on, pdfstandard=ua-2}` with `lualatex` and validate the output).

## Quarto

Use Quarto (`.qmd`) when analytical prose, tables, and charts must compile reproducibly from Python, R, Julia, or Observable into Typst, LaTeX/PDF, RevealJS, HTML, DOCX, or PPTX:

```yaml
---
title: "Q4 Reliability Report"
format:
  typst:
    papersize: a4
    margin: { x: 18mm, y: 20mm }
  docx:
    reference-doc: templates/brand-reference.docx
execute:
  echo: false
---
```

Run `quarto render report.qmd --to typst` in CI with pinned runtime environments (`uv`/`renv`) and inspect each target format independently—one Markdown source does not auto-verify pagination across Typst, DOCX, and RevealJS.

## Office document generation (`docx`, `python-docx`, ExcelJS, SheetJS)

Generate native `.docx` or `.xlsx` files when stakeholders must edit text, track changes, or run live spreadsheet formulas.

```python
# python-docx: use semantic styles instead of inline run formatting everywhere
from docx import Document
from docx.shared import Mm

doc = Document()
section = doc.sections[0]
section.page_width, section.page_height = Mm(210), Mm(297)
doc.add_heading('Quarterly Review', level=1)
doc.add_paragraph('Verified actuals from Q4 ledger.')
doc.save('quarterly-review.docx')
```

```ts
// ExcelJS: styled, formula-driven workbook with frozen header & explicit currency format
import ExcelJS from 'exceljs';

const wb = new ExcelJS.Workbook();
const ws = wb.addWorksheet('Invoices', { views: [{ state: 'frozen', ySplit: 1 }] });
ws.columns = [
  { header: 'Invoice #', key: 'id', width: 16 },
  { header: 'Amount (EUR)', key: 'amount', width: 18, style: { numFmt: '€#,##0.00' } },
];
ws.addRow({ id: 'INV-2026-041', amount: 1420.5 });
await wb.xlsx.writeFile('invoices.xlsx');
```

- **Word (`docx` JS/TS, `python-docx`)**: attach a reference template or named styles, set explicit page sizes/headers/footers, and inspect in Word + LibreOffice Writer;
- **Spreadsheets (ExcelJS vs SheetJS)**: use **ExcelJS** (or Python `openpyxl` / `xlsxwriter`) when column widths, frozen headers, cell styles, data validation, or streaming `WorkbookWriter` matter; **SheetJS (`xlsx`)** Community Edition is fast for unstyled data import/export but omits cell styling. Never inject untrusted strings starting with `=`, `+`, `-`, or `@` unescaped into spreadsheet cells (CSV/formula injection).

## Toolchain verification matrix

| Check | Evidence required |
|---|---|
| pagination | inspect rendered PDF/DOCX/XLSX first, middle, and last pages (`rendered`) |
| fonts | verify embedded/subset fonts (`pdffonts`), glyph coverage, and license (`static`) |
| links / bookmarks | clickable destinations, outline tree, and metadata (`rendered`) |
| accessibility | PDF/UA tag tree, reading order, alt text, and `pdftotext` extraction (`static`/`rendered`, or `not-checked`) |
| reproducibility | pinned dependencies, container/CLI versions, and `--font-path` / local assets (`static`) |
| security | SSRF allowlists on Chromium/Gotenberg, sanitized HTML, formula-injection escaping in spreadsheets (`static`) |
