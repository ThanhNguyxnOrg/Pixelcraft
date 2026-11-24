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

- Read [references/typography.md](references/typography.md) when selecting type, building scales, pairing voices, handling scripts/fallbacks, or setting measure.
- Read [references/color.md](references/color.md) when creating palettes, OKLCH ramps, semantic roles, dark mode, data color, or checking contrast.
- Read [references/layout.md](references/layout.md) when designing grids, composition, spacing, rhythm, density, responsiveness, or hierarchy.
- Read [references/layout-quality.md](references/layout-quality.md) before accepting a layout or judging rendered spacing/complexity.
- Read [references/motion.md](references/motion.md) when defining animation, transitions, easing, duration, feedback, or reduced-motion behavior.
- Read [references/imagery-icons.md](references/imagery-icons.md) when using photography, illustration, generated media, diagrams, or icon systems.

## Operating rules

1. Translate the direction card into a small set of repeatable decisions. If every component is special, nothing is.
2. Use semantic roles rather than raw values: surface/ink/accent/state/data; display/body/ui/caption/data type; spacing rhythm; motion intent.
3. Preserve existing project tokens and component conventions unless explicitly asked to redesign them.
4. Test choices against real content: long and short strings, empty/error/loading states, dark/light themes, text scaling, RTL/script coverage, and the actual input modality.
5. Let mode control intensity. Operate prioritizes scanability and consistency; Persuade/Experience can carry stronger composition and imagery; Communicate must survive constrained renderers.
6. Do not use decoration to hide missing hierarchy. Establish position, scale, weight, spacing, and grouping first.
7. Keep platform translation idiomatic: CSS pixels are not pt/dp/sp/native units; desktop windows are not mobile screens; terminal cells and email clients are not browsers.
8. Measure a craft choice in its own units: text scaling or terminal cells for hierarchy, actual output/client crop for geometry and color, and input-to-feedback or frame stability for motion. A web corpus range is not a quota for native or exported surfaces.

## Anti-slop craft guard

- **No untouched library defaults:** never ship stock framework themes (untouched shadcn zinc, uncalibrated Material purple, default Bootstrap/Tkinter chrome, Inter/Geist everywhere without reason) unless the existing project explicitly locks that system.
- **No decorative clutter:** ban tinted `40×40` rounded-square icon badges on feature cards, universal `rounded-2xl` + heavy drop shadows, card-inside-card nesting, ambient purple-pink mesh gradients, glowing border beams, pulsing `animate-ping` hero pills, and decorative entrance animations on every scroll block.
- Hierarchy comes from scale, weight, measure, contrast, whitespace, and alignment—never extra chrome.

## Pre-submit checklist

- [ ] First fixation point and scan path are established by scale, position, spacing, and contrast (not extra borders or shadows).
- [ ] Exactly one subject-derived signature element carries expression; surrounding chrome stays quiet for the mode.
- [ ] All color, type, spacing, elevation, and motion decisions map to semantic roles/tokens—zero untouched starter defaults or arbitrary raw-value sprawl.
- [ ] Composition, type measure, and density adapt cleanly across narrow, wide, text-scaled (`200%`), RTL, dark/light, and dense/empty states.
- [ ] Motion communicates spatial causality or immediate feedback (`≤ 100ms` ack), avoids `transition: all`, and provides a complete `prefers-reduced-motion` equivalent.
- [ ] Imagery and icons share one coherent system with verified provenance (real, licensed, generated, or visibly marked user-requested placeholder).
- [ ] Every visual-craft claim is labeled with its actual evidence (`rendered`, `static`, `model-judgment`, or `not-checked`).
