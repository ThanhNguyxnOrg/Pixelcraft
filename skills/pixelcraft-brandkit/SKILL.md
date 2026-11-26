---
name: pixelcraft-brandkit
description: Creates art-directed brand-kit and identity-board image generation briefs for brand kits, logo systems, brand guidelines, moodboards, identity decks, visual-world presentations, launch identities, logo concepts, palette/type systems, and implementation-ready brand direction. Use when a user asks for a brand kit, identity board, moodboard, logo system, brand guidelines image, visual identity, rebrand, refresh, or brand mockup board.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft Brandkit

Construct coherent, art-directed brand-kit and identity-board image briefs grounded in brand strategy, symbolic reduction, disciplined grids, and production usability.

Do **not** generate generic logos, uncoordinated mockups, or cluttered AI moodboards. Build one repeatable identity system in a single structured board.

## Core principle

A brand kit is a structured visual argument for what the brand stands for, not surface decoration. Every board must answer concretely:

1. What does this brand represent?
2. What is the core metaphor?
3. How does the mark express that metaphor cleanly at small and large sizes?
4. How does the system hold together across UI, print, imagery, and detail?
5. What single deliberate rule makes the system ownable?

## Quality bar and reference DNA

Unless the brief specifies otherwise, enforce the layout discipline of production identity-guidelines boards:

- deliberate dark charcoal or calibrated light outer canvas;
- strict grid-based panels with consistent gutters and exact edge alignment;
- restrained density, sparse legible typography, and generous negative space;
- cohesive atmosphere and a single simple, memorable mark repeated consistently;
- realistic touchpoints (browser chrome, app header, terminal frame, physical label, or icon crop) rather than dense fake dashboards;
- image-led panels with purposeful surface treatments (halftone, paper grain, print registration, or photography) tied to the brand's material world;
- geometric construction diagrams, hairlines, alignment marks, and sparse index labels;
- one disciplined accent system repeated across panels without palette drift;
- one core identity idea per board using identical mark proportions across every panel.

References calibrate restraint, proportion, and presentation rhythm—never a fixed skin and never assets to copy.

## When to use

Use for new brand kits, identity boards, logo concept systems, brand guideline overview images, visual-world explorations, rebrands/refreshes, moodboards with systemic intent, and implementation-oriented brand direction. Do not use it for ordinary UI implementation; return to the `pixelcraft` orchestrator for that.

## Intake flow

Before image generation, determine whether the work is:

- **create from scratch** — full concept generation;
- **build on existing brand** — preserve supplied name/logo/colors/type/assets exactly;
- **refresh/rebrand** — change only the explicitly requested scope.

Use the request, earlier context, and supplied assets first. Do not ask again for information already provided. Inspiration or mood references alone do not establish an existing identity; treat them as constraints only when the user identifies them that way.

If essential information is missing, walk unresolved intake items **one focused question at a time** (never bundle 5 questions into a single wall)—covering only what is actually unknown in priority order: (1) create vs. extend vs. refresh scope, (2) existing logo/wordmark & assets to preserve, (3) palette & typography constraints, and (4) visual world & anti-goals. For each question, state why it matters in one sentence, offer 2–4 concrete options leading with **(Recommended)**, and allow free-form / "you decide" / "skip". If required existing assets are unavailable, request them and wait before generation. An explicit refresh/rebrand request takes priority. Existing identity constraints outrank style, palette, and new-logo defaults.

## Required workflow

### 1. Strategy first

Infer and write down the brand strategy before prompting: category, audience, product function, emotional promise, cultural position, trust level, visual world, symbolic metaphor, and what the brand must avoid. The visual system must be based on meaning. Never pick symbols randomly.

### 2. Diverge into 2–3 brand worlds

Consistent with the `pixelcraft-direction` skill, create 2–3 materially different brand-world concepts before generating. Each concept must differ in symbolic metaphor, visual mode, palette posture, image direction, and presentation mood—not merely hue. Score them briefly against strategy, audience, ownability, implementation fit, and anti-generic risk.

Select one and record why the others lost. If the user supplied a fixed existing identity, divergence happens within those constraints and must not reinterpret the logo or discard supplied assets.

### 3. Concept and logo system

If a new logo is needed or requested, choose one logo method, or combine at most two, using `references/logo-methods.md`. The result must be simple, memorable, symbolic, scalable, ownable, balanced, connected to strategy, and usable as icon, wordmark, badge, UI mark, and pattern. For an existing logo, reuse it consistently without redesign unless the user explicitly requested logo scope.

### 4. Layout and canvas adaptation

Default output is one brand-kit overview image in a `3 × 3` grid, with `4:3` or `16:10` aspect ratio. Honor requested width × height, aspect ratio, orientation, or layout over defaults. Canvas dimensions describe the whole output image, not panel count. If the generator cannot produce exact dimensions, use the closest supported ratio, explain the limitation, and report actual output size; ask only when cropping/resizing materially affects composition.

Use `references/layouts.md` for `3×3`, `2×3`, `2×2`, `1×3`, `4×2`, custom layouts, panel rhythm, canvas adaptation, text/tagline/image/mockup/color rules, and finishing detail rules.

### 5. Visual mode, Dual Screen <-> Print color master, and multi-target token export

Select the mode in `references/visual-modes.md` based on strategy rather than fashion. Keep one dominant palette: base color, primary accent, optional secondary accent, and neutrals. Accents repeat across panels; no random rainbow; no default purple-blue AI glow unless genuinely justified.

For production handoff:
- Define a **Dual Screen (`OKLCH` + `sRGB HEX` + `Display-P3`) <-> Print (`CMYK` + `Pantone`) color master table**—**never auto-convert vibrant RGB/P3 neons into muddy 4-plate CMYK** without hand-tuned ink formulas (`TAC <= 300%`, `C0 M0 Y0 K100` body black).
- Author **dedicated small-size optical reductions (`16 px`, `24 px`, `32 px` favicon & social avatar proofs)** with simplified stroke/counter geometry rather than mechanically shrinking a complex hero lockup, plus **real-world application mockups** spanning **business cards, letterhead, slide deck templates, social profiles/cards, and packaging or signage** relevant to the brand.
- Run a **preliminary trademark & visual-similarity screening** across category competitors and public registries—**explicitly stating in the handoff that preliminary screening is a design-risk check only and does NOT replace formal trademark counsel or legal clearance**.
- Use the `pixelcraft-tokens` skill to emit **multi-target DTCG `tokens.json` exports** (`CSS` / `Swift` / `Kotlin` / `Desktop`) and attach a **Commercial Font & Asset License Manifest** verifying Webfont pageviews, Mobile App embedding, Server PDF generation, and Desktop redistribution rights.

### 6. Prompt and generation

Build the internal generation prompt using `references/prompt-template.md`. Include identity mode, supplied assets to preserve, brand-world choice, canvas/size behavior, layout, panel inventory, visual mode, disciplined palette, text limits, logo treatment, and anti-copy instructions.

Use supplied references for rhythm, spacing, density, logo placement, image treatment, and quality. Do not copy exact logos, names, compositions, slogans, or unique assets.

### 7. QA before delivery

Before presenting the result, perform the self-critique in `references/qa-checklist.md`. Check logo consistency across panels, dedicated **`16–32 px` favicon/avatar proofs**, **real-world application mockups** (business cards, letterhead, slides, social, packaging/signage), Dual Screen <-> Print color specs, preliminary trademark-similarity screening note, sparse legible text, panel rhythm, correct use of supplied assets, and commercial license manifest completeness.

## Hard rules

- Never invent replacements for supplied logos, names, colors, typography, or assets.
- Never generate long paragraphs, lorem ipsum, dense explanations, unreadable labels, fake tiny UI, or generic corporate slogans.
- Never copy exact reference logos, names, compositions, slogans, or unique visual assets, and never imply legal trademark clearance (always pair preliminary similarity screening with an explicit formal-counsel disclaimer).
- Never auto-convert `sRGB`/`Display-P3` screen neons into muddy auto-profile `CMYK`, and never shrink a complex multi-line hero lockup directly into a `16–32 px` favicon/avatar without an optical reduction proof.
- Enforce measurable grid geometry, single-mark consistency, real-world application mockups, contrast-verified palettes, multi-target DTCG `tokens.json` export (`CSS`/Swift/Kotlin/Desktop), and a complete **Commercial Font & Asset License Manifest** (Webfont, Mobile App, Server PDF, Desktop redistribution).
- Report the actual output size/aspect ratio; never promise unsupported dimensions.

## Pre-submit checklist

- [ ] Missing intake items resolved one focused question at a time (with concrete options + recommendation); supplied brand assets preserved verbatim.
- [ ] 2–3 genuinely different brand worlds diverged and scored before generation; losing worlds documented.
- [ ] Identical mark proportions across panels + **dedicated `16–32 px` (`16 px` / `24 px` / `32 px`) favicon & avatar optical proof** + **real-world application mockups** (business cards, letterhead, slides, social, packaging/signage) verified or flagged `not-checked`.
- [ ] **Dual Screen (`OKLCH` + `sRGB HEX` + `Display-P3`) <-> Print (`CMYK` + `Pantone`) color master table** + **multi-target DTCG `tokens.json` export** (`CSS`/Swift/Kotlin/Desktop via `pixelcraft-tokens`) prepared.
- [ ] **Commercial Font & Asset License Manifest** (Webfont, Mobile App, Server PDF, Desktop redistribution + C2PA/AI provenance) and **preliminary trademark-similarity screening note** (explicitly noting it does not replace formal trademark counsel) included.
- [ ] **Checklist-Until-Passing Stop-Gate (`<HARD-GATE>`):** walk every checklist item above (`references/qa-checklist.md`) + run `slop-scan.mjs --fail-on p2`, `check-contrast.mjs`, `export-tokens.mjs`, rendered `16–32 px` & board inspection, and `check-acceptance.mjs .pixelcraft/acceptance.json` (`pixelcraft-review`) in a `Fix → Re-verify` loop until passing (`0` `fail`/`pending` rows, `rendered` evidence on visual/contrast/small-size legibility per `Rule #0.3`).

## Reference routing

- Read [references/logo-methods.md](references/logo-methods.md) when selecting the structural method for a new logo.
- Read [references/logo-concepting.md](references/logo-concepting.md) when running strategy-to-metaphor concepting, mascot/character design, reduction, or scalability critique.
- Read [references/pixel-art-logos.md](references/pixel-art-logos.md) when the identity uses pixel art, bitmap lettering, sprite/mascot geometry, stepped gradients, dithering, or tiny icon reduction.
- Read [references/layouts.md](references/layouts.md) when choosing panels, adapting to canvas size, writing text/taglines, directing imagery/mockups, or enforcing palette discipline.
- Read [references/visual-modes.md](references/visual-modes.md) when selecting the visual world.
- Read [references/prompt-template.md](references/prompt-template.md) before prompting any image model.
- Read [references/qa-checklist.md](references/qa-checklist.md) before delivering or selecting a generated result.
- Read [references/asset-pipeline.md](references/asset-pipeline.md) when turning the identity into optical `16/24/32 px` favicons, app icons, optimized SVG, multi-target DTCG tokens, or font subsets.
- Read [references/brand-governance.md](references/brand-governance.md) before finalizing Dual Screen/Print color masters, the Commercial Font & Asset License Manifest, clearspace, minimum sizes, or incorrect-use guidance.
