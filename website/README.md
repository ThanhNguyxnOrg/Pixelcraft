# Pixelcraft showcase

The product website uses **Next.js 16, React 19, TypeScript, and Motion for React**, with Remotion for the promotional film. It lives independently from the zero-dependency skill pack. The pack and website remain **0.1.0**. Nothing in this directory is included in the root npm package's explicit file allowlist.

## Run

Use Node.js 22.12+ (Node 24 LTS recommended):

```sh
npm ci --prefix website
npm run dev --prefix website
```

Production / any static host:

```sh
npm run check --prefix website
npm run build --prefix website
npm test --prefix website
PORT=4321 npm start --prefix website
```

Publish `website/out/` to a static host. The included zero-dependency production server handles clean directory routes, 404s, HEAD, and video byte ranges. It is not a dev server. There is no database, API key, analytics, external runtime request, service worker, or hosted model call. Set `NEXT_PUBLIC_SITE_URL=https://your-domain.example` when building for a public domain to enable absolute Open Graph image URLs; no domain or localhost social URL is invented by default.

## Content and design

- All skill instruction pages are generated at build time from the actual `../skills/*/SKILL.md` files; `src/data/skills.ts` adds categories and short editorial summaries. New skills fail the build until categorized. Relative reference links point to their upstream source.
- `src/styles/global.css` supplies structural styles; `src/styles/studio.css` art-directs an ivory/ink/ultramarine creative studio with open editorial rows, generous curves, and a three-world proof sheet. Local Manrope, Instrument Serif, and IBM Plex Mono fonts are bundled with their OFL licenses and load with `swap`. Server Components generate static reading pages; bounded client components hydrate the hero, specimen, search, installation selector, copy feedback, and mobile navigation.
- Motion preserves object identity in the surface selector, choreographs specimen and art-direction changes, and animates library layout changes. The hero's slow ambient print rotation has a pause control, pauses offscreen, and is static for reduced motion. Reduced motion also removes pointer tilt, parallax, and spatial transitions; content is never gated behind a scroll reveal. There is no scroll hijacking or custom cursor.
- The Elsewhere examples are explicitly fictional, interactive HTML emulations. They are not customer work, real bookings, native mobile apps, or claimed results from a live AI session. Save buttons only change in-memory demo state.
- Search/category state is represented in URL query parameters. Installation commands are displayed/copied, never executed in the browser.
- English copy serves the international repository audience. Film captions are included in English and Vietnamese. Replying to the owner remains Vietnamese.

## Promotional film

The deterministic Remotion composition is in `video/`. Remotion and Playwright are development-only; the site uses the normal HTML video element, not a Remotion browser player. The published MP4, poster, and caption files are functional site media, not test artifacts.

```sh
# Build and serve the site before capturing its actual UI specimens.
npm run build --prefix website
PORT=4321 npm start --prefix website
# In another terminal:
node website/scripts/capture-film.mjs --url http://127.0.0.1:4321
npm run film:audio --prefix website
npm run film:render --prefix website
# Build again to include the exported film in out.
npm run build --prefix website
```

`capture-film.mjs` uses the pinned Playwright dependency and its installed Chromium (run `npx playwright install chromium` from `website/` if missing, or set `CHROME_PATH`). Remotion downloads a headless rendering browser on first render. Rendering/finalization and the original Node-generated soundtrack require FFmpeg on PATH. Output: 1920×1080, 30 fps, 40 seconds, limited-range H.264/yuv420p, AAC audio, fast-start MP4, and a JPEG poster. Kinetic type, motivated camera moves, overlapping scene wipes, and a deterministic 120 BPM electronic score carry the story. Timing derives only from frame numbers; the audio uses a fixed-seed synthesizer, not sampled music. No live network or model is involved. The brief/direction demonstration is visibly labeled illustrative. `public/video/assets` contains captures of this site's actual proof sheets and UI specimens. Remotion's own license terms apply to using its renderer.

## Asset provenance

- Pixelcraft logo/icon/social image: original assets already supplied in this repository. No replacement brand mark.
- Alpine image: downloaded from [Unsplash image CDN](https://images.unsplash.com/photo-1470770841072-f978cf4d019e) under the [Unsplash License](https://unsplash.com/license). It illustrates an alpine landscape, not an actual accommodation listing; no property, location, customer, or photographer attribution is invented.
- Interface fixtures and composition: authored for this showcase.
- Fonts: Manrope / Instrument Serif / IBM Plex Mono, SIL Open Font License via Fontsource; redistributed license notices are in `public/video/assets/*-OFL.txt`.

## Verification boundaries

Build/type/source/HTTP checks are `static`; browser interactions and screenshot inspection are `rendered` only for the executed scope. Native platforms, real agent-host discovery, real installation on the visitor's machine, field Core Web Vitals, and manual assistive-technology checks are not implied by the website or film.
