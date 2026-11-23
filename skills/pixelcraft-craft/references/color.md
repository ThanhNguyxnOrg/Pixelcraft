# Color and palette building

Evidence base: perception research, color appearance models, contrast requirements, platform color systems, and mode testing.

## Evidence constraints

Users form aesthetic judgments extremely quickly, so the first visible field must be intentional before users read details. Colorfulness and perceived visual complexity affect appeal, but peak preferences vary by demographic and culture; there is no universal “premium palette”. Polished visuals can increase perceived usability, but they do not fix actual usability and must never be used as camouflage.

## Build process

1. Define semantic roles before picking colors: background/surface/raised/sunken/ink/muted/link/focus/accent/on-accent/border/scrim/selection/success/warning/danger/info/data.
2. Extract color evidence from real content/material: object pigment, light environment, substrate, domain signal, existing brand, cultural context. Do not invent meaning from a trend.
3. Choose palette posture: restrained, tonal, chromatic, dark atmospheric, print/spot-color, signal/instrument, or dynamic-from-content.
4. Build perceptual ramps in OKLCH/OKLab, then verify in the output gamut and actual product surfaces.
5. Validate every state pair and mode; actual contrast is a property of foreground+background+size+weight+state, not a swatch.

## Non-default accent strategies

| Strategy | Use when | Construction rules | Slop risk |
|---|---|---|---|
| restricted palette | strong editorial/systemic direction | one ink, one paper/surface family, one or two semantic accents; invest savings in type/space/material | beige+orange “AI craft” uniform |
| duotone/monochrome media | archival photography, editorial image systems, print-derived identity | map image shadows/highlights to palette values; preserve enough midtone detail and alt-independent meaning | duotone filter over unrelated stock photography |
| color-from-content | product/artwork/specimen has real color identity | extract hue families manually/algorithmically, curate rather than average; accent changes only within governed ranges | random image extraction producing inconsistent UI |
| complementary tension | need one decisive action/signal against a quiet field | use a small high-chroma complement for action; large areas remain low-chroma | equal-area complementary vibration |
| tonal family + interruption | sophisticated but not sterile | 5–8 steps in one hue family, interrupted by a deliberate material/signal color | corporate blue ramp with one purple gradient |
| dark atmospheric palette | media/spatial/cinematic surfaces where dark is semantically right | dark is recomputed: low-chroma surfaces, lighter/desaturated accents, layered elevation, controlled scrims; never invert light mode | near-black + neon purple AI default |
| signal/instrument palette | safety, monitoring, industrial, scientific domains | hue allocation follows domain standards and severity; saturation reserved for abnormal/critical states | decorative red/green status without labels |
| spot-color print logic | publishing/culture/identity-led work | treat accent like a print spot ink: limited count, consistent role, flat use, registration/texture optional | fake risograph noise over conventional SaaS layout |

## OKLCH ramp method

- Pick the hue(s) from evidence; do not spin the hue wheel randomly.
- Choose chroma where the hue is strongest, then lower chroma toward very light/dark endpoints to reduce gamut clipping and harshness.
- Keep semantic positions stable: `accent-500` means the same relative emphasis across themes even if values differ.
- Check actual sRGB/P3 output; out-of-gamut colors must be intentionally mapped/clamped.
- Use hue rotation across ramps only when it encodes material behavior (heat, depth, light); otherwise coherence matters more.
- Do not assume equal OKLCH lightness means equal contrast. Measure actual pairs; use APCA as supplemental perceptual guidance while conforming to WCAG 2.2 requirements.

Illustrative shape only—not a reusable palette:

```text
surface-0 L .98 C .01 / surface-1 L .94 C .02 / ink L .24 C .03
accent core L .58 C .16 / hover L .52 C .17 / soft-fill L .91 C .05
dark surface L .20 C .02 / dark raised L .26 C .025 / dark accent L .72 C .11
```

## Dark and high-contrast behavior

- Reassign semantic values rather than mathematically inverting.
- Reduce large-area saturation in dark mode; use lighter foreground accents.
- Use luminance layering/borders/scrims for elevation because shadows weaken on dark surfaces.
- Test focus, selection, caret, placeholder, disabled, pressed, visited, chart grid, and error text independently in each mode.
- Honor `prefers-contrast`, forced-colors, and platform high-contrast modes; do not remove system-controlled boundaries.

## Cultural and content checks

Color meanings are locale/domain dependent. Validate finance gain/loss, mourning/celebration, politics/religion, safety, and brand-category conventions for target markets. Never encode meaning by hue alone; pair color with icon/text/pattern/position. For data: categorical palettes need direct labels and limited categories, sequential scales need monotonic lightness, and diverging scales need a meaningful neutral midpoint.

## Palette rejection test

Reject the palette if removing the subject makes the same choices equally plausible for a bank, game, clinic, and AI chatbot. Also reject it if the only novelty is hue: composition, type, material, and motion must participate in the direction.

## Rendered palette inventory

After rendering, inventory quantized background and ink colors weighted by visible area. Separate intentional semantic colors from image pixels, antialiasing noise, shadows, charts, media, and third-party content. In the live corpus the median rendered inventory contained approximately **6–7 distinct quantized color groups**, with the upper quartile near **9**; light and dark surfaces were both common. Treat this only as calibration for how restrained strong work can remain despite rich media.

Record palette posture numerically in the direction card: base surface count, ink levels, semantic accent count, state/data colors, exceptions, and mode-specific substitutions. A typical restrained posture is one background family, one ink family, and one or two semantic accents—focused product and developer-tool surfaces often hold to **2–4 active color groups** in the initial viewport—though subject matter may justify more. Reject accent proliferation when each addition does not have a semantic role, state pair, contrast evidence, and token owner.

Audit muted and translucent inks explicitly: secondary labels, timestamps, placeholders, and reduced-opacity captions are the most common real-world contrast failures even on otherwise high-contrast pages. Always verify final composited contrast (including element and ancestor `opacity`) in both light and dark modes.
