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

### iOS/iPadOS

Modern Xcode asset catalogs normally use a single **1024×1024** App Store/icon source from which required variants are produced. Rules:

- supply square artwork without transparency in the final icon;
- do not add rounded corners manually—the system applies the mask;
- keep critical detail away from edges because cropping/scaling is platform-controlled;
- verify small sizes, Spotlight/settings scale, dark/tinted icon variants where supported, and App Store rendering.

### Android adaptive icons

Android adaptive icons use foreground/background layers and runtime masks. The canonical design canvas is **108×108dp**, with the inner **72×72dp** treated as the visible safe zone; outer regions can be cropped by masks. Current Android also supports monochrome themed icons. Test foreground/background separation, monochrome recognizability, round/squircle masks, scaling, and themed contrast. Verify current platform guidance before release because mask and themed-icon behavior evolves.

### macOS and Windows

- macOS: preserve platform depth/shape conventions and test Dock magnification/dark context; use asset-catalog generation rather than embedding fake rounded-rectangle chrome inside every layer.
- Windows: produce ICO/MSIX/Store assets according to target packaging. ICO commonly includes 16/24/32/48/256 px entries, but packaging requirements depend on installer/store target—verify current documentation instead of treating that list as law.
- Linux/desktop: provide scalable SVG plus PNG sizes required by the shell/theme target.

## SVG optimization

Use SVGO or equivalent in the pipeline, but configure preservation deliberately:

```json
{
  "plugins": [
    { "name": "removeViewBox", "active": false },
    { "name": "cleanupIds", "params": { "preserve": ["pixelcraft-title", "pixelcraft-desc"] } }
  ]
}
```

Rules:

- never strip `viewBox`; width/height can still be controlled by consumers;
- keep `<title>`/`<desc>` and accessible IDs when inline SVG must expose meaning;
- do not collapse/merge paths when that destroys mask/animation/semantic structure;
- convert text to paths for portable logo artwork or embed a properly licensed font; do both consciously;
- inspect optimizer diff visually—small numeric rounding can deform pixel-aligned marks;
- sanitize untrusted SVG before serving it;
- retain unminified source in version control or a design artifact store.

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

## Raster image format choice

| Format | Use | Avoid |
|---|---|---|
| SVG | logos/icons/simple vector art | complex photographic texture or untrusted active content |
| AVIF | high compression photos/gradients where support/encode cost is acceptable | requiring universal legacy fallback without alternative |
| WebP | broad modern photographic/alpha compression baseline | assuming it is always smaller/better than AVIF/JPEG |
| PNG | lossless UI, transparency, pixel-aligned artwork, compatibility | large photos where lossy compression is appropriate |
| JPEG | legacy photographic compatibility without alpha | text/line art/transparency/repeated editing |

Use responsive markup deliberately:

```html
<img
  src="hero-1024.avif"
  srcset="hero-640.avif 640w, hero-1024.avif 1024w, hero-1920.avif 1920w"
  sizes="(max-width: 720px) 100vw, 60vw"
  width="1024" height="640" alt="..." />
```

`srcset` width descriptors describe image resource width; `sizes` tells the browser the rendered layout width. Density descriptors (`1x/2x/3x`) fit fixed-size icons/thumbnails, while width descriptors fit fluid layout. Do not ship retina multiplication when the source lacks detail or text becomes illegible.

## Pipeline checklist

- [ ] master vector has correct geometry/viewBox/metadata/license attribution;
- [ ] text is converted to paths or the font license permits embedding;
- [ ] light/dark/mono variants are deliberate, not automatic inversion;
- [ ] SVG optimization preserves viewBox/a11y/geometry and visual output is diffed;
- [ ] favicon ICO/SVG/apple touch/manifest/maskable files match documented dimensions;
- [ ] native adaptive/store assets tested in real masks/scales;
- [ ] font subsets include required scripts/features and license/name metadata;
- [ ] raster images use correct format/color profile/DPI-agnostic scaling/srcset;
- [ ] generated outputs are reproducible from source and never hand-edited;
- [ ] tiny-size legibility, contrast, transparency, dark background, and compression are inspected.
