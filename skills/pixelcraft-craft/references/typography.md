# Typography, pairing, and expressive type

Evidence base: typographic craft traditions, platform font behavior, pairing practice, readability constraints, and localization requirements.

## Voice before font

Choose a typographic voice from the direction: editorial, instrumental, humanist, technical, archival, playful, ceremonial, native/platform. “Clean” is not a voice. Do not default to Inter/Geist-like neutrality unless density, platform fit, script coverage, or existing brand continuity justify it.

| Voice | Pairing behavior | Best fit |
|---|---|---|
| editorial | high-contrast or text serif display + quiet body face + small metadata sans | publishing, culture, luxury, analysis |
| instrumental | legible grotesque + tabular monospace/data numerals | operations, measurement, finance, monitoring |
| humanist | open-aperture sans/serif, moderate contrast | health, education, trust-heavy consumer |
| technical | engineered sans/mono, precise numerals, compact metadata | developer, scientific, industrial |
| archival | durable text serif + caption/indexing system | museums, documents, history |
| playful | expressive display constrained to headings + highly readable body | games, children, casual commerce |
| native | system typeface/scale | high-frequency platform-conforming apps |

## Pairing method

1. Choose the **anchor** first: usually the body/UI face because it carries most reading.
2. Add contrast only where it has a job: display voice, data voice, metadata voice, or code/log voice.
3. Balance contrast with compatibility: comparable x-height/proportions often sit together better; contrast should come from structure, not clashing details.
4. Assign explicit roles before naming fonts: display/title/heading/body/body-small/caption/control/data/code.
5. Prefer one family with optical sizes/width/weight axes when hierarchy is more important than personality; use superfamilies when serif/sans/mono coordination is built in.
6. Consult real specimens to understand scale/spacing/context, then design your own system; do not copy a pairing because it is fashionable.
7. Limit active families/weights for performance and coherence. Two well-deployed faces beat five shallow ones.

## Expressive techniques

| Technique | Use when | Rules | Caveat/slop risk |
|---|---|---|---|
| oversized display | short decisive copy can structure the page | set line breaks manually/responsively; reserve space; keep controls visibly subordinate | giant cropped word as generic award-site costume |
| width/weight contrast | same family needs strong hierarchy without extra fonts | compare condensed black display to regular-width text; test rendering across platforms | variable-font axis animation becomes the point rather than the message |
| serif display + sans interface | editorial authority plus operational clarity | display carries voice; UI controls stay boring/readable | cream/serif/orange neo-slop when detached from subject |
| mono data voice | measurement, provenance, logs, indexing | use mono for aligned numeric/categorical evidence, not as decoration | fake terminal aesthetic with no data |
| small-caps/metadata system | archival/editorial structure | use true small caps or carefully styled uppercase; consistent metadata grammar | meaningless uppercase eyebrow labels |
| kinetic/revealed type | short campaign statements | line/phrase-level reveal, once, selectable text | letter-by-letter animation that harms localization and reading |
| vertical/rotated type | culturally meaningful vertical writing or navigational furniture | vertical CJK requires real line-breaking/font review; Latin rotation only for labels/metadata | rotated text that becomes unreadable chrome |
| expressive numerals | scoreboards, indexes, finance, measurement | choose lining/tabular behavior intentionally; align decimal/degree/unit | oversized numerals implying fake metrics |

## Scale, measure, and detail

- Dense UI scale ratio roughly 1.125–1.2; editorial/persuasion roughly 1.25–1.4. Do not create twelve indistinguishable steps.
- Long-form Latin target around 65–75 characters per line; adjust rather than copying blindly for CJK/Arabic/Indic and dense UI.
- Latin body line-height roughly 1.45–1.65; tighten display while protecting ascenders/diacritics; dense UI may tighten only when scanlines remain clear.
- Use optical size when available: display optical sizes tighter/sharper, text optical sizes sturdier.
- Use tabular figures for changing/aligned data; proportional figures for prose unless alignment matters.
- Avoid tracked-out lowercase; uppercase/labels can receive modest tracking. Extreme negative tracking breaks script rendering.
- Preserve hanging punctuation, baseline rhythm, paragraph spacing, and orphan/widow behavior where platform allows.

### Modern web typographic controls

Apply modern CSS typographic primitives progressively without breaking non-Latin scripts or CLS budgets:

- **Line wrapping:** use `text-wrap: balance` on short headings/titles (≤ 4–6 lines) to eliminate awkward single-word last lines, and `text-wrap: pretty` on body prose paragraphs to reduce orphans.
- **Optical cap-height alignment:** use `text-box-trim: trim-both` with `text-box-edge: cap alphabetic` (progressively, checking browser support) on buttons, badges, and tight headings so icons and uppercase labels optically center without magic pixel padding offsets.
- **Dark-mode halation via variable `GRAD` axis:** when a variable typeface provides a `GRAD` (grade) axis, reduce grade slightly in dark mode (`font-variation-settings: "GRAD" -25`) to soften light-on-dark stroke bloom without changing glyph advance widths or causing layout shift.
- **Zero-CLS fallback metrics:** pair webfont `@font-face` declarations with metric-matched fallback faces using `size-adjust`, `ascent-override`, `descent-override`, and `line-gap-override` so font swap never shifts headings or paragraphs.
- **Typographic vertical rhythm units:** use `cap` (cap height) to align inline icons with capitals, and `lh` / `rlh` (line-height / root line-height) for paragraph margins, vertical gaps, and list indents that automatically scale with font size and leading.

```css
@font-face {
  font-family: "EditorialFallback";
  src: local("Georgia");
  size-adjust: 104%;
  ascent-override: 92%;
  descent-override: 24%;
}
h1, h2 { text-wrap: balance; text-box-trim: trim-both; text-box-edge: cap alphabetic; }
p { text-wrap: pretty; margin-block-end: 1rlh; }
.inline-icon { height: 1cap; width: auto; }
@media (prefers-color-scheme: dark) {
  body { font-variation-settings: "GRAD" -25; }
}
```

## International script floor

Declare fallback behavior per script, not just `sans-serif`: Latin extended/combining marks, Cyrillic, Greek, Arabic, Hebrew, Indic shaping, Thai/Lao/Khmer line breaking, CJK/Hangul, emoji/ZWJ, and numeric systems required by the audience. Do not fake bold/italic, do not put translated copy in Latin-only display fonts that silently fall back, and do not let expressive crop/tracking/masking damage shaping.

## Platform transfer

Web: preload only critical files, reserve metrics/space, use `font-display` intentionally. iOS/macOS: Dynamic Type-compatible scaling. Android: respect sp scaling/type roles. Flutter/RN/Compose/SwiftUI: map semantic roles once rather than copying CSS pixels. TUI: weight/color/underline/inverse only; no assumed ligatures. Email: robust fallback stacks; custom fonts cannot carry meaning. Game UI: validate SDF/bitmap atlases, memory, localization glyphs, and viewing distance.

## Rendered typography inventory

Measure what the browser actually rendered rather than counting only the authored scale. Record active families, weight/style faces, distinct rendered sizes, dominant line-heights, display letter-spacing, and maximum-to-minimum rendered size ratio. An earlier gallery corpus had medians of **2 active families**, **4 rendered sizes**, and a **4.6×** ratio. A later first-viewport sample with many canvas and media scenes had medians of **1 family** and **2 sizes** in the detectable DOM. Keep these cohorts separate: a first-screen DOM sample cannot count type painted into a graphic, and neither corpus sets a quota.

Audit rules:

- inventory every loaded/rendered family-weight-style face and delete faces without a hierarchy role;
- separate modular-step ratio from the observed display/body extreme ratio;
- remeasure the display and body roles at narrow and short heights; reduce display size or recompose when it consumes the task or produces poor wrapping, rather than chasing a fixed compression percentage. Test long localized copy and text zoom;
- verify display letter-spacing only at rendered sizes where it occurs; subtle negative tracking (`-0.02em` to `-0.04em`) belongs on large Latin display headlines, never on body copy or scripts with combining diacritics/shaping;
- preload at most 1–2 truly critical font files, choose `font-display` deliberately, subset required scripts, and never preload every weight or starve LCP media;
- canvas-rendered display type still needs semantic text and a fallback type specification.
