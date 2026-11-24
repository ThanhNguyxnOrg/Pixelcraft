# Client-side PDF viewers (PDF.js) and programmatic PPTX decks (PptxGenJS)

For print CSS, WeasyPrint, React-PDF, Typst, LaTeX, and web slide frameworks (Slidev/reveal.js/Marp), read `references/pdf-tools.md` and `references/slides.md`. Use this reference when **rendering PDFs inside a web app (`pdfjs-dist`)** or **generating editable PowerPoint `.pptx` files (`pptxgenjs`)**.

## PDF.js (`pdfjs-dist`) viewer idioms

- **Dedicated Web Worker**: always configure `GlobalWorkerOptions.workerSrc` (or `GlobalWorkerOptions.workerPort`) pointing to a bundled/same-origin `pdf.worker.mjs` matching the exact `pdfjs-dist` version—never run PDF parsing on the main thread.
- **Cancellation & teardown**: cancel superseded `page.render(...)` tasks (`renderTask.cancel()`, catching `RenderingCancelledException`) on rapid zoom/page turns, and call `await loadingTask.destroy()` on unmount to abort pending range fetches and terminate the worker.
- **Selectable & accessible text**: pair the `<canvas>` render with PDF.js's `TextLayer` (`TextLayerRenderTask`) so users can select/copy text, search (`Ctrl+F`), and read content with assistive technologies.
- **HiDPI crispness**: scale the canvas backing store by `window.devicePixelRatio` while keeping CSS width/height at logical viewport pixels so text is sharp on Retina displays.

```ts
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const loadingTask = getDocument({ url: '/report.pdf' });
const pdf = await loadingTask.promise;
const page = await pdf.getPage(1);
const viewport = page.getViewport({ scale: 1.5 });
const renderTask = page.render({ canvasContext: ctx, viewport });
await renderTask.promise;

// On unmount:
await loadingTask.destroy();
```

## PptxGenJS (programmatic `.pptx` generation)

- **Slide masters & physical inches**: set `pres.layout = 'LAYOUT_16x9'` (10" × 5.625") or `defineLayout(...)` in **inches**, and define reusable `defineSlideMaster({ title, background, objects, slideNumber })` templates so headers, footers, margins, and slide numbers stay consistent across every generated slide.
- **Native editable objects**: prefer `slide.addText(...)`, `slide.addTable(...)` (supports auto-paging across slides), and native charts over rasterizing entire slides as PNG screenshots.
- **Export API**: pass an options object `await pres.writeFile({ fileName: 'deck.pptx' })` (string argument is deprecated), or `await pres.stream()` for Node buffer streaming.
- **Font availability**: PowerPoint substitutes missing fonts on recipients' machines—stick to system-safe fonts or embed fonts explicitly when brand typography is mandatory, and inspect the exported `.pptx` in PowerPoint / Keynote / LibreOffice Impress at 100% scale.

```ts
import PptxGenJS from 'pptxgenjs';

const pres = new PptxGenJS();
pres.layout = 'LAYOUT_16x9';
pres.defineSlideMaster({
  title: 'REPORT_MASTER',
  background: { color: 'FFFFFF' },
  slideNumber: { x: 9.2, y: 5.2, fontSize: 10, color: '666666' },
});

const slide = pres.addSlide({ masterName: 'REPORT_MASTER' });
slide.addText('Quarterly Operations Review', { x: 0.6, y: 0.5, w: 8.8, fontSize: 24, bold: true });
await pres.writeFile({ fileName: 'q4-review.pptx' });
```

## Do/don't pairs

| Do | Don't |
|---|---|
| Set `GlobalWorkerOptions.workerSrc` and call `loadingTask.destroy()` in PDF.js | Parse multi-megabyte PDFs on the main thread or leak PDF workers on unmount |
| Render a synchronized `TextLayer` over the PDF.js canvas | Ship an image-only PDF canvas where text cannot be selected, searched, or read |
| Cancel in-flight `renderTask` on zoom/page change and handle `RenderingCancelledException` | Race two concurrent `page.render()` calls onto the same `<canvas>` |
| Define `LAYOUT_16x9` + `defineSlideMaster` and use native `addText`/`addTable` in PptxGenJS | Paste full-slide PNG screenshots into `.pptx` files or hardcode duplicate footers on every slide |

## Verification commands

```sh
npm run build
```

Verify PDF.js worker bundling (`static`), test HiDPI canvas + text-layer selection + zoom cancellation in a real browser (`rendered`), and open exported `.pptx` files in PowerPoint/Impress to confirm no text clipping or font substitution (`rendered`).
