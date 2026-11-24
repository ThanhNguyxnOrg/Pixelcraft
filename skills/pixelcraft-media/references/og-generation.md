# OG and programmatic image generation pipelines

Choose the generator for layout complexity, script shaping (Latin vs Arabic/Indic/CJK), output format (PNG/WebP/AVIF), latency budget, and runtime environment (Node.js, Rust, Edge, or headless browser).

## Pipeline boundaries

| Tool | Output / model | Best for | Critical boundaries |
|---|---|---|---|
| **Takumi** (`@takumi-rs/image-response` / Rust) | Rust high-speed JSX/Tailwind → PNG/WebP/AVIF | fast dynamic OG cards needing **CSS Grid**, Flexbox, WOFF2 fonts, and WebP/AVIF output | native Rust binding (Node.js/server runtime or WASM build); verify CSS support per pinned version |
| **Next.js `ImageResponse` (`next/og`)** | JSX/CSS → PNG via Satori + Resvg | Next.js App Router `opengraph-image.tsx` routes | Next.js 15/16 defaults to **Node.js runtime** (`runtime = 'nodejs'`), lifting the 500 KB Edge limit and enabling `fs.readFile`; Edge Runtime (`runtime = 'edge'`) keeps the 500 KB bundle cap; Flexbox-only + TTF/OTF/WOFF fonts |
| **`@vercel/og`** | JSX/CSS → PNG via Satori + Resvg | Vercel Edge / serverless functions | 500 KB Edge bundle cap including JSX/fonts/assets; Flexbox-only subset; TTF/OTF/WOFF only (no WOFF2) |
| **Satori + `@resvg/resvg-js`** | JSX → SVG string → PNG buffer | framework-agnostic Node/CI/Astro/Remix OG generation | explicit font buffers required; no system fallback; handle emoji/CJK via `loadAdditionalAsset` |
| **Sharp** (`sharp`) | libvips raster compositing, resize, WebP/AVIF/PNG | compositing SVG/PNG badges, multi-crop social variants, strict byte budgets (WhatsApp <300 KB, GitHub <1 MB) | not an HTML/CSS layout engine; pair with SVG/Satori/Takumi |
| **`@napi-rs/canvas` / `skia-canvas`** | Rust/Skia 2D Canvas API in Node.js | custom generative art, pixel-exact charts, dense data badges without HTML layout | manual text wrapping and coordinate layout |
| **Playwright HTML-to-screenshot** | full Chromium render → PNG/JPEG/WebP | complex **Arabic/Indic/CJK bidirectional shaping**, full CSS Grid/subgrid, SVG filters, rich web components | high memory/cold-start latency; pre-render at build time or cache aggressively behind CDN |

## Next.js 15/16 `ImageResponse` (Node.js runtime)

In Next.js 15/16, `opengraph-image.tsx` and Route Handlers default to the **Node.js runtime** (`export const runtime = 'nodejs'`), which lifts the legacy 500 KB Edge bundle cap and allows reading local font assets directly via `node:fs/promises`:

```tsx
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const runtime = 'nodejs'; // default in Next.js 15/16; lifts 500 KB Edge cap
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const interBold = await readFile(join(process.cwd(), 'assets/fonts/Inter-Bold.ttf'));

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#0f172a',
          color: '#f8fafc',
          fontFamily: 'Inter',
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>Pixelcraft</div>
        <div style={{ fontSize: 28, color: '#cbd5e1' }}>Portable UI craft across every surface</div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Inter', data: interBold, weight: 700, style: 'normal' }],
    },
  );
}
```

If you explicitly opt into `export const runtime = 'edge'`, enforce the 500 KB total bundle cap and load fonts via `fetch(new URL('./Inter-Bold.ttf', import.meta.url))`.

## Satori + `@resvg/resvg-js` (`loadAdditionalAsset` & `tw` caveats)

Use Satori directly with `@resvg/resvg-js` when you want deterministic Node/CI generation outside Vercel/Next:

```ts
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';

const interBold = await readFile('./assets/Inter-Bold.ttf');

const svg = await satori(element, {
  width: 1200,
  height: 630,
  fonts: [{ name: 'Inter', data: interBold, weight: 700, style: 'normal' }],
  // On-demand emoji (Twemoji SVG data URI) or CJK subset fonts without bloating the base bundle
  loadAdditionalAsset: async (code, segment) => {
    if (code === 'emoji') {
      return await loadLocalTwemojiDataUri(segment);
    }
    return '';
  },
});

// Satori already converts glyphs to vector paths; disable system font scanning for speed & determinism
const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { loadSystemFonts: false },
});
const pngBuffer = resvg.render().asPng();
```

Satori caveats:

- **`tw` prop**: Satori's built-in Tailwind `tw="..."` prop parses a constrained Tailwind v3-era subset (no CSS Grid, no Tailwind v4 `oklch()` / CSS variables, no responsive breakpoints or arbitrary pseudo-selectors). Prefer explicit `style` objects or inspect rendered PNG bytes whenever using `tw`.
- **`loadAdditionalAsset`**: use for Twemoji/OpenMoji SVG data URIs or on-demand CJK/Arabic subset fonts so missing glyphs never render as tofu boxes; pin local or allowlisted assets rather than making uncached per-request external fetches.
- **No implicit system fallback**: every weight (`400`, `700`) and style (`normal`, `italic`) used in JSX needs a matching buffer in `fonts`.

## Takumi (Rust JSX/Tailwind → PNG/WebP/AVIF)

Use **Takumi** (`@takumi-rs/image-response` or native Rust crate) when you need Satori-style JSX authoring with **CSS Grid**, **WOFF2** font support, native **WebP/AVIF** compression, and multi-millisecond Rust throughput:

```tsx
import { ImageResponse } from '@takumi-rs/image-response';

export async function renderCard(title: string) {
  return new ImageResponse(
    (
      <div className="grid grid-cols-12 h-full w-full bg-[#0f172a] text-white p-16 gap-8">
        <div className="col-span-8 flex flex-col justify-center">
          <h1 className="text-6xl font-bold leading-tight">{title}</h1>
        </div>
      </div>
    ),
    { width: 1200, height: 630, format: 'webp' },
  );
}
```

## Sharp composite and format-budget pipeline

Use **Sharp** to composite generated overlays onto product photography/screenshots, generate multi-aspect variants, and compress strictly under platform byte caps (e.g., WhatsApp <300 KB, GitHub <1 MB):

```ts
import sharp from 'sharp';

await sharp('base-1200x630.png')
  .composite([{ input: svgOverlayBuffer, top: 0, left: 0 }])
  .webp({ quality: 84 }) // or .png({ palette: true, compressionLevel: 9 }) for crisp UI graphics
  .toFile('og-card.webp');
```

## `@napi-rs/canvas` / `skia-canvas` and Playwright HTML-to-screenshot

- **`@napi-rs/canvas` / `skia-canvas`**: choose for procedural visualizations, sparklines, and canvas-native graphics where explicit `ctx.measureText` + Skia rendering outperform HTML boxes. Register fonts via `GlobalFonts.registerFromPath(...)` / `FontLibrary.use(...)`.
- **Playwright HTML-to-screenshot**: choose when cards require **complex Arabic/RTL, Devanagari/Indic, Thai, or mixed CJK bidirectional shaping**, full CSS Grid/subgrid, `backdrop-filter`, or real rendered UI components:

```ts
await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(safeHtml, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'og-ar.png', type: 'png' });
```

Never render untrusted user HTML directly in Playwright—escape text strictly, block internal network requests (SSRF protection), and cache by content hash.

## Security, caching, and verification

- Treat user-supplied titles/handles as untrusted text; bound character length and sanitize/escape before templating;
- constrain remote image domains and timeouts (or inline buffers) so slow external hosts never stall crawlers;
- cache generated OG images immutably by content/version hash (`Cache-Control: public, max-age=31536000, immutable`);
- inspect generated byte size, exact dimensions, `Content-Type`, thumbnail legibility at 25–33% scale, and target script shaping (`rendered`); record which renderer produced the image.
