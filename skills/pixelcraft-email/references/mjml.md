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

MJML abstracts table markup (`role="presentation"` is emitted automatically on layout tables), but authors still own semantics: set `lang` and `dir` on `<mjml lang="en" dir="ltr">`, add `<mj-title>` and `<mj-preview>`, supply meaningful `alt` text (or `alt=""` for decorative images), use real `<h1>`–`<h3>` inside `<mj-text>`, maintain contrast under dark-mode inversion, and pair with a `text/plain` version.

## States idiom

Validate images off/blocked, dark mode, Gmail 102 KB clipping, plaintext, forwarding, narrow viewport, high contrast, print, and missing remote assets. Ensure CTA and core message survive if styling degrades.

## Forms idiom

Do not depend on forms in email. Link to secure web flows with preauthenticated state where appropriate. Avoid asking users to reply with sensitive data.

## Do/don't pairs

| Do | Don't |
|---|---|
| build reusable `mj-section`/`mj-attributes` patterns with `<mjml lang="..." dir="...">` | hand-editing compiled HTML after every build |
| `mj-button` with real text, `href`, and solid fallback background color | image-only CTA |
| isolated, justified `mj-raw` escape hatch (keeping New Outlook & Classic Outlook working) | raw HTML everywhere defeating MJML's purpose |
| concise alt text such as `alt="Monthly usage chart"` | missing or useless alt like `alt="image"` |
| check compiled HTML byte size against Gmail's 102 KB clipping cap | assuming MJML output stays compact automatically |

## Known traps

Compiled output weight triggering Gmail 102 KB clipping, raw escape overuse breaking New Outlook vs Classic Outlook parity, custom font assumptions, section/column nesting errors, dark-mode mutation, image blocking, and plaintext not generated from the same content model.

## Verification commands

Compile with strict validation and run the repo build without suppressing failures:

```sh
npx mjml input.mjml -o output.html --config.validationLevel strict
npm run build
```

Inspect compiled HTML byte size (`static`) and actual client previews across New Outlook, Classic Outlook, Gmail, and Apple Mail with image-off, dark mode, mobile width, plaintext, forwarding, and accessibility checks (`rendered`).
