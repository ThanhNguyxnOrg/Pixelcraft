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

## Rapid critique checklist

Before implementation, answer in concrete terms:

- What is the first thing the user should notice, and what visual property makes that happen?
- Which single element carries the signature? What stays quiet around it?
- What are the exact semantic color/type/spacing roles? Which raw values are intentionally absent?
- How does composition change at narrow, wide, text-scaled, RTL, and dense states?
- What motion communicates causality or feedback? What is its reduced-motion equivalent?
- What imagery/icon provenance is real, licensed, generated, or missing?

If any answer is “the library default,” verify that default is a deliberate project/system choice rather than unexamined model collapse.
