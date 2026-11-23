# Pixel-art logo craft

Use this reference when the identity intentionally uses pixel art, bitmap type, sprite logic, game/retro-computing material, or agent imagery built from visible pixels. Evidence base: small-grid practice, pixel-logo workflow/dithering guidance, palette-craft resources, and platform icon constraints.

## Grid discipline

- Choose the art grid before drawing: commonly 16×16/24×24 for icons, 32×32 for compact characters, 48×48 or larger only when detail is semantically necessary.
- Every visible color cell must align to the same integer grid. No accidental half-pixels, blurred edges, rotated rectangles, fractional strokes, or raster-filter residue.
- Build the vector output as aligned rectangles or merged grid-aligned paths. `shape-rendering="crispEdges"` may help but is not a substitute for integer geometry.
- Keep one logical pixel size across the composition. Deliberate hierarchical scaling (for example, wordmark pixels twice icon pixels) must be documented, not accidental.
- Scale raster previews only by integer nearest-neighbor factors. Never bicubic-resize pixel art as a production asset.
- Do not fake pixel art with smooth Béziers plus a pixelation filter; reconstruction must be authored or deliberately thresholded onto the grid.

## Silhouette before detail

1. Block the silhouette in one dark color.
2. Test it filled solid at actual target sizes.
3. Add only the minimum identifying features: visor, eye, antenna, gear tooth, prop, limb, asymmetry, or signature pixel scatter.
4. Clean at 1:1 zoom; remove any cell that does not improve readability or meaning.
5. Keep negative space readable. A one-cell gap can be the difference between a visor and a blob.

If the silhouette fails, change the silhouette—not the shading.

## Palette discipline

- Use a small curated palette: outline/ink, main color family, secondary family, highlight, background/transparent negative space. Tiny-grid work often needs only 2–3 colors; mascot/logo systems may use more only when each color family has a stable semantic role.
- Treat gradients as stepped ramps, not smooth AI noise. Assign each ramp step intentionally (shadow/base/light/spark).
- Do not antialias edges into hundreds of accidental colors. Pixel-art smoothness comes from stair-step placement, selective edge pixels, or deliberate dither—not blur.
- Keep outline hue consistent. Dark navy/plum/brown outlines usually integrate better than pure black; document whether outline is external, internal, or selective.
- Preserve enough contrast for both light/dark contexts or provide explicit variants. Do not rely on a white matte hidden in the artwork.
- If using a licensed or community palette, respect its license and adapt it to the brand rather than treating a trend palette as identity.

## Dithering and texture

Use dither only when it performs a job:

- checkerboard/ordered dither to soften a steep stepped ramp;
- sparse pixel scatter to show transformation, data loss, construction, or dematerialization;
- clustered shading to suggest volume while retaining crisp cells.

Never add random noise. Scatter pixels need composition logic: direction, density falloff, maximum distance, size hierarchy, and relationship to the silhouette. Dithered areas must not touch critical recognition features (eyes, visor symbols, mouth, gear center) at small sizes.

## Pixel-art mascot construction

- Establish a character grid with consistent head/body proportions and outline weight.
- Keep facial/visor geometry simple: a visor can carry symbols such as `</>` only if those symbols are pixel-letterforms designed into the grid.
- Gear teeth must follow radial repetition or a deliberate stepped approximation; no arbitrary tooth spacing.
- Appendages/legs should support silhouette and personality, but can disappear in icon-only reductions.
- Decide whether pixels are literal material (the character is made of pixels), environmental effect (pixels scatter around it), or both. Mixed meanings must still read as one system.
- Expression comes from posture, visor/eye geometry, silhouette asymmetry, and color behavior—not facial detail overload.

## Pixel wordmarks

- Prefer custom rect-built lettering for pixel identities. System or smooth fonts conflict unless deliberately contrasted as a secondary voice.
- Define cap height, x-height analogue, stem width, counter width, spacing units, and pixel size before drawing letters.
- Keep counters open at small sizes; simplify diagonal letters (`A`, `K`, `N`, `V`, `W`, `X`) into consistent stair steps.
- Do not use faux pixel fonts that rely on antialiasing at production sizes. Convert lettering to vector rects/paths and test spacing as real output.
- The tagline may use smaller pixel type or a clean secondary face converted to paths, but it must not become unreadable texture. Omit it in icon/avatar variants.

## Required rendered tests

Produce actual renders at 16, 32, and 64 px using nearest-neighbor scaling. Inspect against light and dark backgrounds:

| Size | Pass condition |
|---|---|
| 16 px | silhouette + main color split recognizable; no attempt to preserve tiny symbols/text |
| 32 px | focal metaphor reads (robot/visor/gear or equivalent); outline does not fill in |
| 64 px | secondary details begin resolving; no stair-step mistakes or stray cells |
| favicon/avatar context | recognizable beside ordinary browser/app icons |
| monochrome | silhouette still identifies when hue is removed |

Create sanctioned small-size variants rather than expecting the master artwork to survive unchanged. Document exactly which details are removed at each size.

## Production export checklist

- SVG has integer-aligned geometry, no embedded raster, no hidden white matte unless intentional, no filters/blurs, no unused layers.
- PNG export uses nearest-neighbor integer scaling and transparent background where required.
- `viewBox` preserved; dimensions are exact; strokes are either absent or fully grid-aligned.
- Palette count reported; accidental near-duplicate colors merged.
- Artwork inspected at 100%/200% and at 16/32/64 px rendered size.
- Light/dark/reverse/mono variants documented.
- App/favicon versions follow platform guidance: simple central concept, no nonessential text, no decorative clutter.
