# Brand asset pipeline

A logo concept is not production identity until it survives favicons, adaptive masks, app stores, font licensing, raster compression, and build automation. Generate assets from source vectors; never upscale screenshots.

## Web favicon and manifest set

Minimum practical set:

| Asset | Requirement |
|---|---|
| `favicon.svg` | vector source with `viewBox`; include a scoped `@media (prefers-color-scheme: dark)` rule only when the mark remains recognizable without inversion artifacts |
| `favicon.ico` | include a real 32×32 entry; multi-resolution ICO commonly also carries 16×16/48×48 depending legacy support |
| `apple-touch-icon.png` | 180×180, opaque background appropriate to the mark; Apple expects no transparency-dependent composition |
| manifest icon | 192×192 PNG for baseline PWA/install use |
| manifest icon | 512×512 PNG for install/splash use |
| maskable icon | 512×512 PNG with `purpose: "maskable"` and critical artwork inside the platform safe zone |

Validate the SVG separately from raster exports. A dark-mode media query inside SVG only affects contexts that execute SVG styling; raster conversions and some icon consumers ignore it. Export explicit light/dark raster variants where needed rather than assuming live SVG behavior.

Maskable icons need generous quiet space because Android masks crop corners/circles/squircles differently. Test actual mask shapes; do not merely center the normal logo.

## Native app icons

Use platform-native source generation rather than manually resizing arbitrarily.

### iOS / iPadOS / macOS (iOS 18+ Dark/Tinted & Apple 26 Icon Composer `.icon`)

Modern Apple platforms require layered appearance-aware icons rather than a single flat light-mode square:

- **iOS 18+ App Icons (Asset Catalog):** supply three distinct **1024×1024** variants when targeting iOS 18+: **Any Appearance (Light)** (opaque background, no manual rounded corners), **Dark** (transparent foreground artwork over dark system backdrop or custom dark ground), and **Tinted** (grayscale/monochrome foreground alpha mask so iOS tinting stays crisp without muddy contrast).
- **iOS 26 / macOS 26 Liquid Glass Icon Composer (`.icon` bundles):** author multi-layer `.icon` bundles via Apple **Icon Composer** (layered SVG/PNG foreground, specular glass material parameters, background fill) so the OS renders dynamic specular highlights, depth parallax, clear/tinted modes, and Reduce Transparency fallbacks automatically across iOS, iPadOS, macOS, and watchOS.
- Keep critical artwork away from outer edges because platform masks and optical specular rims crop/refract near boundaries; verify Spotlight, Settings, Dock magnification, and small-size legibility.

### Android adaptive icons

Android adaptive icons use foreground/background layers and runtime masks. The canonical design canvas is **108×108dp**, with the inner **72×72dp** treated as the visible safe zone; outer regions can be cropped by masks. Current Android also supports monochrome themed icons. Test foreground/background separation, monochrome recognizability, round/squircle masks, scaling, and themed contrast. Verify current platform guidance before release because mask and themed-icon behavior evolves.

### Windows and Linux desktop

- Windows: produce ICO/MSIX/Store assets according to target packaging. ICO commonly includes 16/24/32/48/256 px entries, but packaging requirements depend on installer/store target—verify current documentation instead of treating that list as law.
- Linux/desktop: provide scalable SVG plus PNG sizes required by the shell/theme target.

## SVG optimization and raster-to-vector tracing caveats

Use **SVGO (v3/v4)** extending `preset-default` rather than overriding the entire plugin array (`removeViewBox` is deprecated/disabled by default in modern SVGO—do not pass removed plugin keys):

```js
// svgo.config.mjs
export default {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: {
            preserve: ['brand-logo-title', 'brand-logo-desc'],
          },
        },
      },
    },
  ],
};
```

Rules:

- always preserve `viewBox` (modern SVGO keeps `viewBox` by default inside `preset-default`);
- keep `<title>`/`<desc>` and accessible IDs when inline SVG must expose meaning;
- do not collapse/merge paths when that destroys mask/animation/semantic structure;
- convert text to paths for portable logo artwork or embed a properly licensed font; do both consciously;
- inspect optimizer diff visually—small numeric rounding can deform pixel-aligned marks;
- sanitize untrusted SVG before serving it;
- retain unminified source in version control or a design artifact store.

### Raster-to-vector tracing caveats (Recraft SVG / VTracer)

Image generators and auto-tracers (**Recraft SVG** native vector output, **VTracer** color raster tracing) are starting points, not finished master logos:

- Inspect node counts, redundant overlapping fills, unclosed paths, tiny stray speckles, and uneven Bézier handles in a real vector editor (Figma, Illustrator, Inkscape) before shipping.
- Rebuild geometric marks cleanly from true primitives/grid geometry rather than shipping auto-traced splines with wobbling curves.
- Verify crisp rendering at `16×16` and `32×32 px` before exporting favicons or app icons.

## Font subsetting

Subsetting is a licensing, script, shaping, and runtime decision—not merely byte reduction.

Tools:

```sh
pyftsubset Input.ttf \
  --output-file=brand-subset.woff2 \
  --flavor=woff2 \
  --unicodes="U+0000-00FF,U+0100-017F,U+1EA0-1EFF" \
  --layout-features='kern,liga,ccmp,mark,mkmk' \
  --name-IDs='*'
```

`glyphhanger` can measure actual Unicode coverage in rendered content and drive subset input. Rules:

- preserve all scripts the product truly uses; Latin-only subsets fail names/locations/brand text;
- keep combining marks and positioning features for Vietnamese/stacked diacritics;
- keep shaping/positioning features for Arabic/Indic scripts; naive Unicode-range subsetting can break contextual forms;
- emit `unicode-range` so browsers download only matching subsets;
- WOFF2 is the normal web delivery format; keep WOFF/TTF/OTF only where a renderer/platform requires them;
- verify license permission for embedding/subsetting/conversion.

## Raster image format choice and `<picture>` fallback

| Format | Use | Avoid |
|---|---|---|
| SVG | logos/icons/simple vector art | complex photographic texture or untrusted active content |
| AVIF | high compression photos/gradients paired with WebP/JPEG fallback | bare `<img src="*.avif">` without fallback for older viewers/mail clients |
| WebP | broad modern photographic/alpha compression baseline | assuming it is always smaller/better than AVIF/JPEG |
| PNG | lossless UI, transparency, pixel-aligned artwork, compatibility | large photos where lossy compression is appropriate |
| JPEG | universal photographic compatibility without alpha | text/line art/transparency/repeated editing |

Use `<picture>` with ordered `<source>` candidates and a universally decodable fallback `<img>`:

```html
<picture>
  <source
    type="image/avif"
    srcset="hero-640.avif 640w, hero-1024.avif 1024w, hero-1920.avif 1920w"
    sizes="(max-width: 720px) 100vw, 60vw" />
  <source
    type="image/webp"
    srcset="hero-640.webp 640w, hero-1024.webp 1024w, hero-1920.webp 1920w"
    sizes="(max-width: 720px) 100vw, 60vw" />
  <img
    src="hero-1024.jpg"
    srcset="hero-640.jpg 640w, hero-1024.jpg 1024w, hero-1920.jpg 1920w"
    sizes="(max-width: 720px) 100vw, 60vw"
    width="1024" height="640" alt="Descriptive alt text" />
</picture>
```

`srcset` width descriptors describe image resource width; `sizes` tells the browser the rendered layout width. Density descriptors (`1x/2x/3x`) fit fixed-size icons/thumbnails, while width descriptors fit fluid layout. Do not ship retina multiplication when the source lacks detail or text becomes illegible.

## Provenance and C2PA Content Credentials

Preserve or attach **C2PA Content Credentials** (`c2patool` / generator-signed manifests) on AI-generated or AI-edited brand imagery whenever publishing externally or handing off to legal/brand teams:

- Do not strip existing C2PA provenance manifests blindly during raster recompression without policy approval; configure export pipelines to preserve or re-sign assertions.
- Record clearly in brand governance which assets are human-authored vectors, licensed photography, or AI-generated concept imagery (copyrightability and trademark clearance depend on honest provenance).

## Pipeline checklist

- [ ] master vector has clean geometry (not unedited auto-trace), `viewBox`, metadata, and license attribution;
- [ ] text is converted to paths or the font license permits embedding;
- [ ] light/dark/tinted/mono variants are deliberate, not automatic inversion;
- [ ] SVGO v3/v4 (`preset-default`) output preserves `viewBox`/a11y/geometry and is visually diffed;
- [ ] favicon ICO/SVG/apple-touch/manifest/maskable files match documented dimensions;
- [ ] native adaptive/iOS 18+ Dark/Tinted and Apple 26 `.icon` assets tested in real masks/scales;
- [ ] font subsets include required scripts/features and license/name metadata;
- [ ] raster images use `<picture>` AVIF/WebP/JPEG fallback, explicit `width`/`height`, and verified color profiles;
- [ ] C2PA Content Credentials / provenance status recorded for generated assets;
- [ ] generated outputs are reproducible from source and never hand-edited;
- [ ] tiny-size legibility (`16–32 px`), contrast, transparency, dark background, and compression are inspected.
