# Pixelcraft showcase

Thanh's supplied portfolio source, refined with React 19, Vite 7, Tailwind CSS 4, GSAP 3 / ScrollTrigger / SplitText, and Motion for state transitions. Product version stays **0.1.0**. The root skill pack and its zero-dependency installer are unchanged.

## Run

Use Node.js 22.12+ (Node 24 LTS recommended):

```sh
npm ci --prefix website
npm run dev --prefix website
npm run check --prefix website
npm run format:check --prefix website
npm run build --prefix website
npm test --prefix website
PORT=4321 npm start --prefix website
```

Publish `website/dist/` on any static host. The zero-dependency production server supports HEAD, gzip and seekable MP4/WebM media. For immutable releases, copy `dist/` to a release directory and start with `SITE_ROOT=/absolute/path/to/release`. No API, database, analytics, remote fonts, or runtime model call is needed.

The live site is https://thanhnguyxnorg.github.io/Pixelcraft/. `.github/workflows/website.yml` rebuilds and deploys it to GitHub Pages on every push to `main` that touches `website/` or `skills/`, after the checks pass. Pages serves the site under `/Pixelcraft/`, so that build sets `SITE_BASE=/Pixelcraft/` (Vite's `base`; default `/`). Reference anything in `public/` through `publicUrl()` from `src/lib/publicUrl.ts`, never as a root-relative `/…` path; `npm test` fails on one.

## Design and motion

The supplied pixel identity, actual gallery specimens, installation builder and searchable skill index are retained. Deep ink, mint, soft violet and a light gallery table replace the more saturated navy/neon palette. The gallery's compact dossier keeps its process and scanner details in an optional disclosure instead of a long column. Queued examples never pretend to be completed work.

GSAP owns automatic/scroll choreography; Motion owns short state transitions. Native scrolling stays native: no smooth-scroll runtime, wheel interception, or long horizontal pinned sequence. The pixel mark is a bounded **2D Canvas**, not WebGL or 3D. Animation has visible-by-default HTML, a page-wide pause control, reduced-motion/forced-colors fallbacks, and offscreen/hidden lifecycle handling. Fonts ship locally through Fontsource.

The primary 16-second film has been replaced at the owner's request by three short native GSAP promo studies: the real installation command and 26-skill pack, three authored coffee-direction sketches, and the actual roaster before/after images. Each frame owns one timeline for both lettering and graphics, starts only while visible and after its images are ready, and pauses offscreen/backgrounded. No video decoding, separately timed text overlay, per-frame React update, click-to-play or film actions remain in this section. Page pause, reduced motion and forced colors render static, captioned compositions. The original normalized MP4/WebM files remain as unused source assets, not page requests. Gallery fixtures and the new sketches are fictional; no live AI execution is implied. Scanner scores only report known fingerprints, not design quality. Generated gallery metadata accompanies the captures; recapture with `node website/scripts/capture-gallery.mjs --help` when fixture source changes.

The hero's light routes and gradient drift share the existing pixel identity. Continuous work stops offscreen and in hidden tabs. One bounded-resolution Canvas replaces the live blurred duplicate; the gallery's automatic divider paints a CSS variable instead of re-rendering its exhibit each frame. Resize-driven ScrollTrigger measurements are debounced. Process cards settle with a short, staggered 2D fan; native scroll remains unchanged. These are implementation choices, not claims of field performance.

The standalone website is excluded from the root package's explicit npm file allowlist. `src/data.ts` contains editorial skill summaries; tests verify skill identities and installer naming against the root repository. Installer examples and the pack promo use the root package's current `@thanhnguyxn/pixelcraft` name; the CLI executable remains `pixelcraft`. Source links remain upstream. No host-specific scaffold, deployment plugin or service dependency is retained.

## Assets and verification

Logo, gallery pairs and silent film come from the owner-supplied source. Archivo, IBM Plex Mono and Silkscreen are SIL Open Font License fonts supplied by Fontsource (notices in their packages). Build, type and source contracts are **static** evidence; browser checks are **rendered** only within the recorded scope. Physical devices, manual screen-reader use and field Core Web Vitals remain **not-checked** unless specifically measured.
