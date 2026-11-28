# Imagery and icons

## Imagery

- Inventory real assets first: product photography, screenshots, diagrams, user-supplied images, archival material, licensed stock, generated media, or none.
- Never fabricate logos, customer imagery, product capabilities, screenshots, testimonials, or documentary evidence.
- Choose crop/aspect ratio from meaning, not convenience. Preserve subject recognition at actual rendered sizes.
- Art-direct generated imagery: subject, lens/framing, light, material, palette constraints, negative space, aspect, text policy, exclusion list. Inspect output for artifacts and pseudo-text.
- Diagrams and data visuals must use real data/labels or visibly marked placeholders approved by the brief.
- Provide meaningful alternative text or mark imagery decorative according to platform practice.
- Optimize dimensions/format/loading priority; reserve space to prevent layout shift.
- Account for localization and cultural context: gestures, clothing, symbols, maps, flags, food, skin representation, religious material, and color meaning are not neutral.
- **Frame photos & avatars with a `1px` `10%` inset outline:** light-edged screenshots, white-background product photos, and dark-edged avatars bleed invisibly into matching surfaces without a hairline boundary. Apply a `1px` inset outline at `10%` contrast so edges stay crisp without shifting layout box dimensions:
  - **Web (light / dark):** `outline: 1px solid rgb(0 0 0 / 0.1); outline-offset: -1px;` on light surfaces and `outline: 1px solid rgb(255 255 255 / 0.1); outline-offset: -1px;` on dark surfaces (use a clipped inner ring overlay if rounded corners require pixel-tight radius matching).
  - **Native equivalents:** SwiftUI `.overlay(shape.strokeBorder(.primary.opacity(0.1), lineWidth: 1))`; Jetpack Compose `Modifier.clip(shape).border(1.dp, outlineColor.copy(alpha = 0.10f), shape)`; Flutter foreground `DecoratedBox` with `Border.all(color: outline.withOpacity(0.10), width: 1)`.
- **Purposeful brand-aligned graphics with zero decorative visual noise:** break long walls of text with graphics that genuinely orient, explain, or prove a claim (annotated product crops, workflow/architecture diagrams, real UI previews, specimen callouts, before/after evidence) rendered in the brand's visual language. Delete filler visuals—floating orbs, abstract blobs, generic stock illustrations beside every paragraph, or decorative gradient cards that add scroll height without communicating information.

## Iconography

Define one system before drawing or selecting icons:

| Decision | Rule |
|---|---|
| metaphor family | object/action metaphors users already know; avoid invented abstractions |
| geometry | stroke/fill, corner radius, grid, optical size, terminal weight |
| semantic inventory | one meaning per icon; one icon per meaning |
| sizing | align optical center and visual mass rather than bounding boxes only |
| state | default/active/selected/disabled/error behavior |
| accessibility | accessible name when interactive/informative; hidden only when truly decorative |

Rules:

- Do not use emoji as structural icons or sole critical meaning. Emoji rendering varies culturally and across platforms.
- Do not mix outline, filled, 3D, emoji, and illustration styles without a deliberate editorial reason.
- Never iconify every label because the layout feels empty. Text is often clearer.
- Use directionally neutral icons or mirror only semantically directional symbols in RTL.
- In terminal/email/game contexts verify raster/vector/color support and fallback glyphs.

## Signature imagery

A memorable visual should arise from subject material: cross-section of the product, archive artifacts, real workflow state, local visual vernacular, measurement texture, or data topology. Generic blobs, planets, gradients, wireframe globes, and smiling abstract people are not signatures.
