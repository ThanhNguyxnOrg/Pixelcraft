# Brand governance after generation

Use this reference once a brand direction or logo system exists. Generation is only the beginning: the identity must survive implementation, licensing review, localization, small sizes, accessibility constraints, and future contributors.

## Asset inventory and naming

Maintain an inventory of approved assets:

| Asset | Required metadata |
|---|---|
| primary logo/lockup | vector source, color modes, clearspace rule, minimum size, approved backgrounds |
| icon/mark/app/favicon | square artwork, source grid/geometry, raster sizes, small-size behavior |
| wordmark | custom lettering/font distinction, spacing rules, trademark/legal name distinction |
| color/type tokens | semantic roles, contrast pairings, licensing/source, fallback stacks |
| imagery/mascot/illustration | provenance/license, character construction rules, prohibited alterations |
| motion/audio/3D/social variants | duration/easing/static fallback, safe-area/crop behavior |

Use stable names that encode role/version/size/color mode, not meaningless export names such as `final-final2.png`. Keep editable/master source separate from generated export artifacts.

## Clearspace and minimum size

Define clearspace from a measurable feature of the mark (for example x-height, pixel unit, cap height, or glyph stroke module), not a vague “leave space.” Record separate minimum sizes for:

- full lockup;
- icon/mark alone;
- favicon/app-icon use;
- print/embroidered/etched or low-resolution contexts where relevant;
- reversed/monochrome versions.

Below minimum size, use the simplified/icon-only approved asset rather than scaling the full lockup until text disappears. Verify actual rendered pixels at 16/32/64 px where digital icons are used.

## Correct and incorrect use

Document concise rules with examples where possible:

- do not redraw, retype, stretch, crop, rotate, outline, shadow, gradient-fill randomly, animate destructively, or rearrange lockup geometry;
- do not place on low-contrast/busy imagery without an approved containment/background variant;
- do not recolor using arbitrary brand-adjacent values outside approved modes;
- do not use the mascot/character with inconsistent anatomy, expression, scale, or pixel/grid treatment;
- do not use pixel-art assets with fractional scaling, misaligned pixels, automatic smoothing artifacts, or mixed pixel sizes unless intentionally specified;
- do not let generated mockups become canonical source files.

Also document what is allowed: approved monochrome/reverse modes, partner lockup clearspace, localized/tagline lockups, motion behavior, and adaptation ownership.

## Dual Screen (`OKLCH` / `sRGB` / `Display-P3`) <-> Print (`CMYK` / `Pantone`) color master

High-chroma screen primaries (`Display-P3` / `sRGB` electric blues, emerald greens, and violet neons) collapse into dull muddy slate when auto-converted to CMYK by a browser or PDF export! Every production brand kit must publish a **hand-calibrated Dual Screen <-> Print Color Master Table**:

| Semantic role | Perceptual `OKLCH` | `sRGB HEX` fallback | Wide-gamut `Display-P3` | Hand-tuned `CMYK` (`FOGRA39` / `GRACoL`, `TAC <= 300%`) | Spot `Pantone` (Coated / Uncoated) |
|---|---|---|---|---|---|
| `brand.primary` | `oklch(0.58 0.21 258)` | `#1D63ED` | `color(display-p3 0.16 0.39 0.94)` | `C88 M58 Y0 K0` *(hand-tuned clean cobalt; zero black mud)* | `PMS 2728 C` / `2728 U` |
| `ink.body` | `oklch(0.18 0.01 255)` | `#111827` | `color(display-p3 0.07 0.09 0.15)` | **`C0 M0 Y0 K100`** *(100% K overprint for `< 18pt` body text; `C60 M40 Y40 K100` rich black strictly for large solid fills)* | `PMS Black 6 C` |
| `surface.paper` | `oklch(0.985 0.004 95)` | `#FAF9F5` | `color(display-p3 0.98 0.98 0.96)` | `C0 M1 Y4 K0` *(or unprinted stock white)* | Paper stock |

Never ship auto-generated RGB-to-CMYK values on packaging, stationery, signage, or `PDF/X-4` collateral without soft-proofing under the target ICC profile (`FOGRA39` / `GRACoL 2013`).

## Commercial Font & Asset License Manifest + Preliminary Trademark Screening

Font EULAs restrict usage by **deployment surface**, not merely "commercial vs personal." A desktop `.otf` trial or basic webfont license frequently **forbids** bundling `.ttf` files inside an iOS/Android app binary, running headless server PDF invoices, or redistributing fonts in open-source repos! Ship an explicit **Commercial License Manifest** with every brand handoff:

| Asset / Typeface | Foundry / Source & License (`OFL-1.1` / Commercial EULA) | Webfont (`@font-face` monthly pageview cap) | Mobile App Embedding (`.ipa` / `.apk` binary) | Server / Cloud PDF & OG Generation (headless SaaS) | Desktop App / Repo Redistribution |
|---|---|---|---|---|---|
| Primary UI / Display Font | e.g. `Inter` (`SIL OFL 1.1`) or Commercial Foundry | Verified (`Unlimited` / Tier cap) | Verified (`App License` or `OFL`) | Verified (`Server/CPU License` or `OFL`) | Verified (`Permitted` vs `Prohibited` in public Git) |
| Brand Photography / 3D / Icons | Commissioned / Licensed Stock / Internal Vector | Verified | Verified | Verified (print run cap checked) | Verified (C2PA / AI provenance logged) |

**Preliminary trademark-similarity screening:** Run a preliminary visual and verbal similarity check against direct category competitors and public trademark databases (`USPTO`, `EUIPO`, `WIPO`, or local registry) to surface obvious collisions early—**explicitly documenting in the handoff that preliminary design screening does NOT replace formal trademark counsel or legal clearance**.

## Accessibility, `16–32 px` proofs & real-world application mockups

Before delivery:

- verify approved foreground/background pairs (`WCAG 2.2 AA` + `APCA Lc`) across both `sRGB` and `Display-P3` light/dark tokens (`pixelcraft-tokens`);
- inspect dedicated **`16–32 px` (`16 px`, `24 px`, `32 px`) favicon & social avatar optical proofs**, monochrome/reversed marks, and localized tagline expansion (`rendered`);
- validate system coherence across **real-world application mockups** (**business cards, letterhead, slide deck templates, social profiles/cards, and packaging or signage**);
- confirm standalone logo SVGs convert wordmark type to paths while UI/document pipelines ship only EULA-verified fonts.

## Governance workflow

1. Freeze the approved master vectors (hero lockup + **`16/24/32 px` favicon/avatar optical reductions**) and record owner/date/version.
2. Publish the **Dual Screen <-> Print Color Master**, real-world application mockups, and multi-target **DTCG `tokens.json`** (`CSS`/Swift/Kotlin/Desktop).
3. Complete the **Commercial Font & Asset License Manifest** and **preliminary trademark-similarity screening note** (with explicit formal-counsel disclaimer).
4. Validate contrast pairs, dark/light/monochrome modes, and prohibited-use rules before broad rollout.
