# React Email

## Token mapping

Use typed semantic constants in shared modules and pass them into components/styles. React Email compiles JSX to email-oriented HTML, but client CSS support remains fragmented; do not assume CSS variables/modern selectors survive. Shared constants preserve semantic token intent while final output inlines literal values.

## Layout and responsive idioms

Use React Email components (`Html`, `Body`, `Container`, `Section`, `Row`, `Column`, `Text`, `Button`, `Img`, `Preview`) or project equivalents deliberately. Single-column-first ordering and resilient inline styles remain mandatory. Component abstraction does not make email a normal React web app.

## Typography/custom fonts

Use fallback font stacks and real text. Custom fonts are progressive enhancement only. Avoid layout that depends on exact metrics. Include plaintext generation using the same structured content where possible rather than hand-diverging copy.

## Motion/reduced motion

Assume animation/interactivity is unsupported. Email meaning and CTA must work statically.

## Accessibility specifics

Real text, meaningful alt text, logical reading order, descriptive link/button copy, contrast-aware styling, plaintext parity, preheader text, no image-only essential content. Inspect rendered HTML because component names do not guarantee client semantics.

## States idiom

Test images blocked/off, dark mode inversion/mutation, Gmail clipping, plaintext-only, forwarding/quoting, narrow mobile view, print/high contrast, missing assets. Transactional email also needs expired-link/already-used/unauthorized destination states on the destination page, though the email itself cannot solve them.

## Forms idiom

Do not depend on embedded forms. Link to secure destination flows. Use correct preheader/copy so users understand consequence before clicking.

## Do/don't pairs

| Do | Don't |
|---|---|
| shared typed content model feeding HTML + plaintext | manually maintaining divergent plaintext copy |
| real `Button`/link text with consequence verb | image-only or “Click here” CTA |
| semantic constants passed to inline styles | assuming CSS variables/classes work everywhere |
| preview/preheader written deliberately | first legal/footer text accidentally becoming preview |
| inspect compiled HTML/client rendering | trusting React component rendering in isolation |

## Known traps

Treating output like normal web React, inconsistent plaintext, missing alt/preheader, style prop assumptions, client-specific mutation, clipping due output weight, dark-mode logo disappearance, generated HTML bloat, local preview looking better than real clients.

## Verification commands

```sh
npm run lint
npm run build
npx email dev 2>/dev/null || true
```

Use local preview only as initial evidence. Validate compiled HTML/plaintext, image-off/dark/mobile/high-contrast rendering, actual client previews/test service, link destinations/expiry behavior, and clipping/source size.
