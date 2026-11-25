# Pixelcraft showcase

Static showcase site for the Pixelcraft Agent Skills pack, built with React 19, Vite 7, and Tailwind CSS 4. Product version stays synced with the root [`package.json`](../package.json). The root skill pack and its zero-dependency installer remain completely independent of this workspace.

## Run

Requires Node.js 22.12+ (Node 24 LTS recommended):

```sh
npm ci --prefix website
npm run sync --prefix website
npm run dev --prefix website
npm run check --prefix website
npm run format:check --prefix website
npm run build --prefix website
npm test --prefix website
PORT=4321 npm start --prefix website
```

Publish `website/dist/` on any static host. The zero-dependency preview server (`scripts/serve.mjs`) supports `HEAD` and gzip responses. For immutable releases, copy `dist/` to a release directory and start with `SITE_ROOT=/absolute/path/to/release`. No API, database, analytics, remote fonts, or runtime model call is required.

The live site is deployed at https://thanhnguyxnorg.github.io/Pixelcraft/. [`.github/workflows/website.yml`](../.github/workflows/website.yml) rebuilds and deploys it to GitHub Pages on every push to `main` touching `website/`, `skills/`, `evals/`, `package.json`, or `bin/pixelcraft.mjs`, after all checks pass. GitHub Pages serves the site under `/Pixelcraft/`, so CI builds with `SITE_BASE=/Pixelcraft/` (Vite's `base`; default `/`). Reference files in `public/` exclusively via `publicUrl()` from `src/lib/publicUrl.ts`, never root-relative `/…` paths (`npm test` enforces this).

## Architecture and craft choices

The showcase is structured as **7 focused, instant-render sections**—Hero, Multi-Stack Proof Gallery, Process & Authority Order, Searchable Skill Index, Tooling & QA CLIs, Interactive Installer Builder, and FAQ—without external animation runtimes (`motion` / `gsap`), autonomous background loops, or video payloads:

- **Visible at frame 0:** Every section renders immediately in HTML/CSS with zero opacity-0 scroll-reveal traps and native browser scrolling.
- **22 multi-stack proof exhibits:** Paired before/after HTML fixtures under `public/gallery/` span five ecosystems with direct `Open demo ↗` standalone views and inspectable Prompt & Code tabs:
  - **Mobile (`4`):** `swiftui` (SwiftUI Liquid Glass), `compose` (Jetpack Compose M3E + Wear OS), `flutter` (Flutter Impeller), `mobile` (SwiftUI Dynamic Type `AX3`)
  - **TUI & Desktop (`3`):** `kubetrace` (Rust Ratatui span waterfall), `tui` (Rust Ratatui `80×24 NO_COLOR=1`), `desktop` (Tauri v2 + Rust encrypted workspace)
  - **Data & Server (`4`):** `python` (Python 3.12 / marimo RAG bench), `dashboard` (SolidJS avionics board), `grid` (linear SVG power telemetry), `liveview` (Elixir Phoenix LiveView floor plan)
  - **Web Apps (`7`):** `saas` (Next.js 15), `store` (Nuxt 4), `booking` (SvelteKit 2), `learning` (Angular Signals), `magazine` (Lit Web Components), `coffee` (HTML/CSS Baseline 2026), `clinic` (accessible WCAG healthcare form)
  - **Channels & Game (`4`):** `email` (MJML dark-mode + plaintext slip), `proposal` (Typst 0.13 + `@page` dossier), `document` (Typst + MJML statement), `gamehud` (Godot 4.5 Control hangar HUD)
- **Interactive issue pins & honest metrics:** Every exhibit pairs real `slop-scan.mjs --json` scores (`website/src/generated/gallery.json`) with inspectable before/after annotations. Gallery fixtures are authored demonstrations; no live AI inference is implied, and scanner scores measure known fingerprints rather than total design quality.
- **Dogfooded quality gates:** `npm test --prefix website` runs `slop-scan.mjs` against both every gallery fixture and `website/src/` itself, verifies `repo-meta.json` matches the canonical root `skills/` and `bin/pixelcraft.mjs`, and checks asset paths and bundle integrity.
- **Local typography & accessible tokens:** Archivo, IBM Plex Mono (Latin), and Silkscreen (Latin) ship locally via Fontsource (SIL Open Font License). Interactive borders meet WCAG 2.2 AA 3:1 non-text contrast (`>= 3:1`), and focus outlines remain intact for keyboard navigation.

## Regenerating gallery captures

When editing any exhibit under `public/gallery/<id>/{before,after}.html`, recapture all 44 WebP assets and regenerate `src/generated/gallery.json`:

```sh
node website/scripts/capture-gallery.mjs
```

The capture script uses headless Chrome/Chromium and encodes WebP via `ffmpeg` when installed or Python 3 Pillow (`PIL`) as a fallback. Pass `--help` for flags.

## Packaging & verification scope

This standalone `website/` workspace is excluded from the root npm package's explicit `files` allowlist. Build, typecheck, formatting, `slop-scan`, and repository-sync assertions provide **static** evidence; headless Chrome desktop/mobile captures provide **rendered** evidence for the checked viewports. Physical devices, live assistive technology testing, and field Core Web Vitals remain **not-checked** unless explicitly measured.
