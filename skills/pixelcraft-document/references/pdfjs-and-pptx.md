# Client-side PDF viewers (PDF.js) and programmatic PPTX decks (PptxGenJS)

For print CSS, Playwright/Gotenberg, WeasyPrint, React-PDF, Typst, LaTeX, Quarto, and web/Typst slide frameworks, read `references/pdf-tools.md` and `references/slides.md`. Use this reference when **rendering PDFs inside a web app (`pdfjs-dist`)** or **generating editable PowerPoint `.pptx` files (`pptxgenjs`)**.

## PDF.js (`pdfjs-dist` v4.2+ / v5) viewer idioms

- **Dedicated Web Worker**: configure `GlobalWorkerOptions.workerSrc` (or `GlobalWorkerOptions.workerPort`) pointing to a bundled/same-origin `pdf.worker.min.mjs` matching the exact `pdfjs-dist` version—never parse PDFs on the main thread.
- **HiDPI crispness (`devicePixelRatio` + `transform`)**: scale the `<canvas>` backing store (`canvas.width` / `canvas.height`) by `window.devicePixelRatio`, keep CSS width/height at logical viewport pixels, and pass `transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined` into `page.render(...)` so glyphs stay razor-sharp on Retina/4K screens.
- **Selectable & accessible `TextLayer` (v4.2+ / v5)**: instantiate `new TextLayer({ textContentSource, container, viewport }).render()` and set `--scale-factor` and `--total-scale-factor` CSS custom properties on the page/text-layer container (imported with `pdfjs-dist/web/pdf_viewer.css`) so selectable spans align accurately with the rendered canvas.
- **Cancellation & teardown**: cancel superseded `page.render(...)` and `TextLayer` tasks (`renderTask.cancel()`, `textLayer.cancel()`, ignoring `RenderingCancelledException`) on rapid zoom/page turns, and call `await loadingTask.destroy()` on unmount to abort pending range fetches and terminate the worker.

```ts
import { getDocument, GlobalWorkerOptions, TextLayer } from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const loadingTask = getDocument({ url: '/report.pdf' });
const pdf = await loadingTask.promise;
const page = await pdf.getPage(1);

const scale = 1.5;
const dpr = window.devicePixelRatio || 1;
const viewport = page.getViewport({ scale });

// 1. HiDPI canvas backing store + DPR transform
canvas.width = Math.floor(viewport.width * dpr);
canvas.height = Math.floor(viewport.height * dpr);
canvas.style.width = `${Math.floor(viewport.width)}px`;
canvas.style.height = `${Math.floor(viewport.height)}px`;

const renderTask = page.render({
  canvasContext: ctx,
  viewport,
  transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined,
});

// 2. Synchronized TextLayer (PDF.js v4.2+/v5 requires scale CSS vars)
pageContainer.style.setProperty('--scale-factor', String(viewport.scale));
pageContainer.style.setProperty('--total-scale-factor', String(viewport.scale));
textLayerDiv.replaceChildren();
const textLayer = new TextLayer({
  textContentSource: page.streamTextContent(),
  container: textLayerDiv,
  viewport,
});

try {
  await Promise.all([renderTask.promise, textLayer.render()]);
} catch (err) {
  if ((err as Error).name !== 'RenderingCancelledException') throw err;
}

// On zoom/page change: renderTask.cancel(); textLayer.cancel();
// On unmount: await loadingTask.destroy();
```

## PptxGenJS (v3/v4 programmatic `.pptx` generation)

- **Slide masters & physical inches**: set `pres.layout = 'LAYOUT_16x9'` (10" × 5.625") or `defineLayout(...)` in **inches**, and define reusable `defineSlideMaster({ title, background, objects, slideNumber })` templates so headers, footers, margins, and slide numbers stay consistent across every generated slide.
- **Native editable objects**: prefer `slide.addText(...)`, `slide.addTable(...)` (supports auto-paging across slides), and native `slide.addChart(...)` over rasterizing entire slides as PNG screenshots.
- **RTL localization**: set `pres.rtlMode = true` for Arabic/Hebrew/Persian decks and verify text alignment, chart axis direction, and slide-number anchor positions in PowerPoint/Impress.
- **Canonical Export API (v3/v4)**: use `await pres.writeFile({ fileName: 'deck.pptx' })` for direct file downloads/writes, or `await pres.write({ outputType: 'nodebuffer' })` in Node.js services (supported `outputType` values: `'nodebuffer' | 'stream' | 'blob' | 'base64' | 'arraybuffer' | 'uint8array'`). Do not pass deprecated string-only arguments to `writeFile` or call removed v2 streaming methods.
- **Font availability & scale floor**: PowerPoint substitutes missing fonts on recipients' machines—use cross-OS safe fonts (`Arial`, `Segoe UI`, `Calibri`, `Aptos`) or embed licensed subsetted fonts explicitly; enforce **`>= 24pt` body text for room projection** (`>= 18pt` only for dense read-alone leave-behind decks), pixel-snap `16:9` raster assets so the `.pptx` stays **`< 25–30 MB`** (email-safe), and verify **`PPTX <-> PDF` visual parity** at 100% scale.

```ts
import PptxGenJS from 'pptxgenjs';

const pres = new PptxGenJS();
pres.layout = 'LAYOUT_16x9';
pres.rtlMode = false; // Set true for RTL locales (ar, he, fa)

pres.defineSlideMaster({
  title: 'REPORT_MASTER',
  background: { color: 'FFFFFF' },
  slideNumber: { x: 9.2, y: 5.2, fontSize: 12, color: '555555' },
});

const slide = pres.addSlide({ masterName: 'REPORT_MASTER' });
slide.addText('Quarterly Operations Review', { x: 0.6, y: 0.4, w: 8.8, fontSize: 28, bold: true });
slide.addChart(
  pres.ChartType.bar,
  [{ name: 'Uptime %', labels: ['Q1', 'Q2', 'Q3', 'Q4'], values: [99.8, 99.9, 99.95, 99.98] }],
  { x: 0.6, y: 1.2, w: 8.8, h: 3.6, showValue: true, barDir: 'col' },
);

// Server-side Buffer (or 'stream' | 'blob' for streaming/browser)
const buffer = (await pres.write({ outputType: 'nodebuffer' })) as Buffer;
// Or direct save: await pres.writeFile({ fileName: 'q4-review.pptx' });
```

## Do/don't pairs

| Do | Don't |
|---|---|
| Set `GlobalWorkerOptions.workerSrc` and call `loadingTask.destroy()` in PDF.js | Parse multi-megabyte PDFs on the main thread or leak PDF workers on unmount |
| Scale backing canvas by `devicePixelRatio` with `transform: [dpr, 0, 0, dpr, 0, 0]` | Render 1× logical canvas pixels onto Retina screens, producing blurry text |
| Pair `new TextLayer({ textContentSource, container, viewport }).render()` with `--scale-factor` / `--total-scale-factor` | Ship an image-only PDF canvas or misaligned text overlay that breaks copy/search/a11y |
| Cancel in-flight `renderTask` and `textLayer` on zoom/page change and ignore `RenderingCancelledException` | Race concurrent `page.render()` calls onto the same `<canvas>` |
| Define `defineSlideMaster`, keep body `>= 24pt` (`>= 18pt` leave-behind), budget `.pptx` `< 25–30 MB`, and use native `addText`/`addTable`/`addChart` | Export flattened PNG-per-slide screenshots as `.pptx`, shrink text to `11pt`, or ship `90 MB` uncompressed hero bitmaps |

## Verification commands

```sh
npm run build
# Headless PPTX <-> PDF visual parity render (when LibreOffice + Poppler are installed)
soffice --headless --convert-to pdf q4-review.pptx
pdftoppm -png -r 150 q4-review.pdf slide-proof
```

Verify PDF.js worker bundling and `.pptx` byte size `< 25–30 MB` (`static`), test HiDPI canvas + `TextLayer` selection alignment + zoom cancellation in a real browser (`rendered`), and compare exported `.pptx` against its rendered `.pdf` slides in PowerPoint / Keynote / LibreOffice Impress to confirm `PPTX <-> PDF` parity, chart legibility, RTL layout (when enabled), and zero text clipping or font substitution (`rendered`).
