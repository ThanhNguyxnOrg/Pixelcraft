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

## Design and motion

The supplied pixel identity, actual gallery specimens, installation builder, searchable skill index and silent film are retained. Deep ink, mint, soft violet and a light gallery table replace the more saturated navy/neon palette. The gallery's compact dossier keeps its process and scanner details in an optional disclosure instead of a long column. Queued examples never pretend to be completed work.

GSAP owns automatic/scroll choreography; Motion owns short state transitions. Native scrolling stays native: no smooth-scroll runtime, wheel interception, or long horizontal pinned sequence. The pixel mark is a bounded **2D Canvas**, not WebGL or 3D. Animation has visible-by-default HTML, a page-wide pause control, reduced-motion/forced-colors fallbacks, and offscreen/hidden lifecycle handling. Fonts ship locally through Fontsource.

The supplied 16-second silent demo and transcript are preserved; its two baked-in installer labels are corrected to the root package name. Regenerate from the supplied MP4 with `node website/scripts/normalize-film.mjs --help` (FFmpeg required). It is an authored demonstration, not a recording of a live AI run. Gallery fixtures are fictional. Scanner scores only report known fingerprints, not design quality. The supplied specimen fonts are also local. Generated gallery metadata accompanies the captures; recapture with `node website/scripts/capture-gallery.mjs --help` when fixture source changes.

The standalone website is excluded from the root package's explicit npm file allowlist. `src/data.ts` contains editorial skill summaries; tests verify skill identities and installer naming against the root repository. Source links remain upstream. No host-specific scaffold, deployment plugin or service dependency is retained.

## Assets and verification

Logo, gallery pairs and silent film come from the owner-supplied source. Archivo, IBM Plex Mono and Silkscreen are SIL Open Font License fonts supplied by Fontsource (notices in their packages). Build, type and source contracts are **static** evidence; browser checks are **rendered** only within the recorded scope. Physical devices, manual screen-reader use and field Core Web Vitals remain **not-checked** unless specifically measured.
