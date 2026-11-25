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

## B4 — Dark-surface luminance elevation, specular edges & vibrancy

Never build dark mode by mechanically inverting light tokens or dropping `#000000` shadows onto dark cards (black drop shadows vanish on dark surfaces or muddy surrounding pixels):

| Rule | Concrete specification | Cross-platform idioms |
|---|---|---|
| **Luminance-stepped elevation (`+5% to +8%` OKLCH `L`)** | Elevate higher z-layers by stepping surface lightness upward in **`+0.05` to `+0.08` OKLCH `L` increments** (e.g., base canvas `L ≈ 0.14–0.17` → raised card/sidebar `L ≈ 0.20–0.23` → floating popover/dialog `L ≈ 0.26–0.31`). Reserve pure `#000000` (`L = 0`) for OLED wearable/battery-saver modes, high-contrast accessibility themes, or explicit brief direction. | CSS `oklch()` surface tokens (`surface-0`, `surface-1`, `surface-2`); SwiftUI elevated `Color` asset variants; Compose tonal/luminance surface ramp; Flutter `ColorScheme` surface containers |
| **`1px` subtle top/inner specular edge** | Separate stacked dark cards, modals, and command palettes with a **`1px` top or inner rim highlight** at **`rgba(255, 255, 255, 0.07–0.12)`** (`oklch(1 0 0 / 8%–12%)`) instead of heavy outer shadows. | **Web:** `box-shadow: inset 0 1px 0 oklch(1 0 0 / 10%)` + `1px solid oklch(1 0 0 / 8%)`<br>**SwiftUI:** `.overlay(RoundedRectangle(...).strokeBorder(LinearGradient(...)))`<br>**Compose / Flutter:** `Modifier.border(1.dp, Brush.verticalGradient(...))` |
| **Desaturated & lifted semantic accents** | Pull chroma down slightly and lift lightness on status/accent fills and foregrounds in dark mode so saturated reds, blues, and greens do not vibrate or halate against dark backgrounds. | Test focus, selection, caret, placeholder, disabled, pressed, visited, chart grid, and error text independently in both modes (`WCAG 2.2 AA` + `APCA |Lc|`) |
| **Vibrancy saturation boost + opaque fallback** | Plain Gaussian blur over dark/colorful content looks muddy gray; pair blur with **`160–180%` saturation boost** or native OS vibrancy, and switch to a **solid opaque raised surface** under Reduced Transparency. | **Web:** `backdrop-filter: blur(16px) saturate(170%)` + `@media (prefers-reduced-transparency: reduce)` solid fallback<br>**Apple / Windows / Android:** `NSVisualEffectView`, `.ultraThinMaterial` (`accessibilityReduceTransparency`), Windows `Mica`/`Acrylic`, Android `RenderEffect` |

Honor `prefers-contrast`, `forced-colors`, and platform high-contrast modes; never strip system-controlled boundaries.

### CSS Color 5, wide-gamut P3, and `forced-colors` idioms

On modern web surfaces, derive state colors and modes systematically while keeping sRGB and Windows High Contrast (`forced-colors`) intact:

```css
:root {
  color-scheme: light dark;
  --accent: oklch(0.56 0.16 245);
  /* Light/dark semantic pairing without duplicated media-query blocks */
  --surface: light-dark(oklch(0.98 0.008 90), oklch(0.19 0.015 250));
  --ink: light-dark(oklch(0.22 0.015 250), oklch(0.93 0.01 90));
  /* Perceptual hover/tint states via CSS Color 5 color-mix() and relative color syntax */
  --accent-hover: oklch(from var(--accent) calc(l - 0.07) c h);
  --accent-soft: color-mix(in oklch, var(--accent) 14%, var(--surface));
}

/* Progressive wide-gamut Display P3 chroma boost when hardware supports it */
@media (color-gamut: p3) {
  :root {
    --accent: oklch(0.58 0.22 245);
  }
}

/* Forced Colors / Windows High Contrast: preserve boundaries via transparent borders & system colors */
.button,
.panel {
  border: 1px solid transparent; /* invisible on normal displays; rendered in ButtonBorder under forced-colors */
}
@media (forced-colors: active) {
  .button:focus-visible {
    outline: 2px solid Highlight;
    outline-offset: 2px;
  }
  .status-dot {
    forced-color-adjust: none; /* opt out ONLY when a swatch carries semantic status paired with text */
    border: 1px solid CanvasText;
  }
}
```

### Perceptual contrast (APCA) and dark-mode halation

WCAG 2.2 luminance ratios (`4.5:1` / `3:1`) remain the mandatory legal/accessibility floor, but they ignore polarity and font weight—creating **dark-mode false passes** where gray text on dark surfaces passes `4.5:1` mathematically yet dissolves visually from halation. Pair WCAG 2.2 AA with **APCA Lightness Contrast (`|Lc|`)** checks tied to font size and weight:

| Role | Typical size & weight | Supplemental APCA target | Notes |
|---|---|---|---|
| Regular body copy | `16px`, weight `400` | `|Lc| ≥ 75` | Push dark-mode body tokens lighter than light-mode inversions |
| Bold body / lead | `16px`, weight `700` | `|Lc| ≥ 60` | Lower threshold only when weight/size increases together |
| Subheadings / UI labels | `18–24px`, weight `600–700` | `|Lc| ≥ 45` | Never drop muted labels below WCAG AA + readable `Lc` |
| Large display / non-text icons | `36px+` bold or icons/borders | `|Lc| ≥ 30`–`45` | Verify final composited pixels including ancestor opacity |

## Cultural and content checks

Color meanings are locale/domain dependent. Validate finance gain/loss, mourning/celebration, politics/religion, safety, and brand-category conventions for target markets. Never encode meaning by hue alone; pair color with icon/text/pattern/position. For data: categorical palettes need direct labels and limited categories, sequential scales need monotonic lightness, and diverging scales need a meaningful neutral midpoint.

## Palette rejection test

Reject the palette if removing the subject makes the same choices equally plausible for a bank, game, clinic, and AI chatbot. Also reject it if the only novelty is hue: composition, type, material, and motion must participate in the direction.

## Rendered palette inventory

After rendering, inventory quantized background and ink colors weighted by visible area. Separate intentional semantic colors from image pixels, antialiasing noise, shadows, charts, media, and third-party content. In the live corpus the median rendered inventory contained approximately **6–7 distinct quantized color groups**, with the upper quartile near **9**; light and dark surfaces were both common. Treat this only as calibration for how restrained strong work can remain despite rich media.

Record palette posture numerically in the direction card: base surface count, ink levels, semantic accent count, state/data colors, exceptions, and mode-specific substitutions. A typical restrained posture is one background family, one ink family, and one or two semantic accents—focused product and developer-tool surfaces often hold to **2–4 active color groups** in the initial viewport—though subject matter may justify more. Reject accent proliferation when each addition does not have a semantic role, state pair, contrast evidence, and token owner.

Audit muted and translucent inks explicitly: secondary labels, timestamps, placeholders, and reduced-opacity captions are the most common real-world contrast failures even on otherwise high-contrast pages. Always verify final composited contrast (including element and ancestor `opacity`) in both light and dark modes.
