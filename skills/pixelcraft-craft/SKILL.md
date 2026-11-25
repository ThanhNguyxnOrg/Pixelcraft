---
name: pixelcraft-craft
description: Applies high-craft visual design decisions across platforms. Use when choosing typography, color systems, layout, composition, spacing, motion, imagery, icons, density, or visual hierarchy for any UI surface. Translates a committed direction into concrete typographic scales, OKLCH color roles, grid/rhythm, accessible motion, and imagery/icon rules without assuming a web framework.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft craft

Craft is controlled decision-making under constraints. Apply the committed direction card and existing project tokens first; do not restyle by default.

## References

- Read [references/typography.md](references/typography.md) when selecting type (`≤ 2` families + `1` mono), setting `45–75ch` prose measure, enforcing cross-platform tabular numerals (`B6`) and `U+2212` minus, or handling script fallbacks.
- Read [references/color.md](references/color.md) when building OKLCH ramps, semantic roles, dark-surface `+5–8%` lightness steps & `1px` specular edges (`B4`), vibrancy fallbacks, or checking WCAG + APCA contrast.
- Read [references/layout.md](references/layout.md) when designing grids, optical icon centroids & concentric corner radii (`B2`), invisible hit-slop, Safe Triangle submenus & slider pointer capture (`B5`), or responsive adaptation.
- Read [references/layout-quality.md](references/layout-quality.md) before accepting a layout or judging rendered spacing/complexity.
- Read [references/motion.md](references/motion.md) when calibrating motion by action frequency & warm tooltip chains (`B1`), origin-aware `0.95→1.0` scaling & faster exits (`B3`), damped springs, or reduced-motion paths.
- Read [references/imagery-icons.md](references/imagery-icons.md) when using photography, illustration, generated media, diagrams, or unified icon systems.

## Operating rules

1. Translate the direction card into a small set of repeatable decisions. If every component is special, nothing is.
2. Use semantic roles rather than raw values: surface/ink/accent/state/data; display/body/ui/caption/data type (`≤ 2` font families + `1` mono unless brief-justified; `45–75ch` reading measure); spacing rhythm; motion intent.
3. Preserve existing project tokens and component conventions unless explicitly asked to redesign them.
4. Test choices against real content: long and short strings, empty/error/loading states, dark/light themes, text scaling, RTL/script coverage, and the actual input modality.
5. Let mode control intensity. Operate prioritizes scanability and consistency; Persuade/Experience can carry stronger composition and imagery; Communicate must survive constrained renderers.
6. Do not use decoration to hide missing hierarchy. Establish position, scale, weight, spacing, and grouping first.
7. Keep platform translation idiomatic: CSS pixels are not pt/dp/sp/native units; desktop windows are not mobile screens; terminal cells and email clients are not browsers.
8. Measure a craft choice in its own units: text scaling or terminal cells for hierarchy, actual output/client crop for geometry and color, and input-to-feedback or frame stability for motion. A web corpus range is not a quota for native or exported surfaces.

## Studio Invisible Craft (`B1–B6`)

| Law | Mandatory micro-craft bar | Reference |
|---|---|---|
| **`B1` Frequency-calibrated motion** | `0–100ms` high-frequency actions (`0ms` key-repeat & warm tooltip chains), `150–220ms` drawers/modals, `300–500ms` non-blocking expressive moments | `references/motion.md` |
| **`B2` Optical alignment & concentric radii** | `+1–2` unit optical centroid offset on asymmetric glyphs (play, chevron, arrow), concentric radii (`R_outer = R_inner + padding`, clamped `≥ 0`), balanced vertical text padding | `references/layout.md` |
| **`B3` Origin-aware & asymmetric overlays** | Subtle `0.95 → 1.0` scale anchored to trigger origin (never `0 → 1` center balloon), faster exit (`100–130ms`) than enter (`160–200ms`), non-bouncy springs (`ζ ≥ 0.85`) | `references/motion.md` |
| **`B4` Dark-surface luminance & edges** | Elevate dark layers via `+5% to +8%` OKLCH `L` steps (never `#000000` drop shadows), `1px` top/inner specular edge (`7–12%` white), lifted/desaturated accents, vibrancy + opaque reduced-transparency fallback | `references/color.md` |
| **`B5` Forgiving pointer & touch mechanics** | `+6–10` unit invisible hit-slop around compact `24–28` unit icons, Safe Triangle diagonal submenu corridor (or `120–180ms` grace), pointer capture on sliders/splitters + `Shift`/arrow fine-step | `references/layout.md` |
| **`B6` Tabular numerals & true minus** | Cross-platform tabular figures (`tabular-nums` / `.monospacedDigit()` / `"tnum"` / `FontFeature.tabularFigures()`) on every counter/timer/price/table column + `U+2212` `−` | `references/typography.md` |

## Anti-slop craft guard

- **No untouched library defaults:** never ship stock framework themes (untouched starter zinc, uncalibrated default purple, stock desktop widget chrome, default sans everywhere without reason) unless the existing project explicitly locks that system.
- **No decorative clutter:** ban tinted `40×40` rounded-square icon badges on feature cards, universal `rounded-2xl` + heavy drop shadows, card-inside-card nesting, ambient purple-pink mesh gradients, glowing border beams, pulsing hero pills, and decorative entrance animations on every scroll block.
- Hierarchy comes from scale, weight, measure, contrast, whitespace, and alignment—never extra chrome.

## Pre-submit checklist

- [ ] First fixation point and 5-second scan path are established by scale, position, spacing, and contrast (`≤ 2` font families + `1` mono; `45–75ch` prose measure).
- [ ] Exactly one subject-derived signature element carries expression; surrounding chrome and unified icon stroke/corner language stay quiet for the mode.
- [ ] All color, type, spacing, elevation, and motion decisions map to semantic roles/tokens—zero untouched starter defaults or arbitrary raw-value sprawl.
- [ ] Invisible Craft `B1–B6` verified: frequency-calibrated timing & warm tooltips, optical icon centroids & concentric radii, trigger-anchored `0.95→1.0` overlays with faster exits, dark `+5–8%` lightness steps & `1px` specular edges, invisible hit-slop + Safe Triangle + pointer capture, and tabular numerals + `U+2212` minus.
- [ ] Composition, type measure, and density adapt cleanly across narrow, wide, text-scaled (`200%`), RTL, dark/light, reduced-motion, and reduced-transparency states.
- [ ] Imagery and icons share one coherent system with verified commercial provenance (real, licensed, generated, or visibly marked user-requested placeholder).
- [ ] Every visual-craft claim is labeled with its actual evidence (`rendered`, `static`, `model-judgment`, or `not-checked`).
