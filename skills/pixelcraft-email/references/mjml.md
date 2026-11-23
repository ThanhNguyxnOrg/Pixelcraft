# MJML

## Token mapping

Keep semantic constants in a build-time theme/config or shared MJML attributes/variables depending toolchain. MJML compiles email-specific HTML; do not assume arbitrary CSS variables survive clients. Use tokens to set repeated colors/fonts/padding in components rather than hand-editing generated HTML.

## Layout and responsive idioms

Use `mjml`, `mj-body`, `mj-section`, `mj-column`, and semantic components (`mj-text`, `mj-button`, `mj-image`, `mj-divider`) as intended. Single-column-first ordering remains essential. Do not fight the abstraction with deeply nested raw HTML unless a documented `mj-raw` escape is necessary—and isolate/comment why.

## Typography/custom fonts

Use robust fallback stacks. `mj-font` can register progressive-enhancement fonts but support is client-dependent. Real text/fallback metrics matter more than exact custom font rendering. Test expansion/RTL/plaintext behavior outside MJML assumptions.

## Motion/reduced motion

Do not depend on motion. MJML is for resilient static-ish email; interactive/carousel hacks have inconsistent support and accessibility risk.

## Accessibility specifics

MJML abstracts structure but does not guarantee meaningful email UX. Supply alt text, real text, semantic reading order, descriptive buttons/links, contrast-aware colors, plaintext counterpart, sensible preheader, and keyboard/touch target size on destination links/buttons where client capabilities permit.

## States idiom

Validate images off/blocked, dark mode, clipping, plaintext, forwarding, narrow viewport, high contrast, print, missing remote assets. Ensure CTA/meaning work if styling is degraded.

## Forms idiom

Do not depend on forms in email. Link to secure web flows with preauthenticated state where appropriate. Avoid asking users to reply with sensitive data.

## Do/don't pairs

| Do | Don't |
|---|---|
| build reusable mj-section/component patterns | hand-editing compiled HTML after every build |
| `mj-button` with real text/href/fallback color | image-only CTA |
| isolated justified `mj-raw` escape hatch | raw HTML everywhere defeating MJML's purpose |
| concise alt text such as `alt="Monthly usage chart"` | missing/useless alt like `alt="image"` |
| inspect generated output/source size | assuming MJML abstraction guarantees client compatibility |

## Known traps

Compiled output divergence from mental model, raw escape overuse, custom font assumptions, section/column nesting errors, dark-mode mutation, image blocking, Gmail clipping due size, Outlook-specific rendering surprises, plaintext not generated from same content model.

## Verification commands

```sh
npx mjml input.mjml -o output.html
npm run build 2>/dev/null || true
```

Inspect compiled source and actual client previews. Validate image-off, dark mode, mobile width, plaintext, clipping, forwarding, links/UTM correctness, and accessibility manually or through a preview service.
