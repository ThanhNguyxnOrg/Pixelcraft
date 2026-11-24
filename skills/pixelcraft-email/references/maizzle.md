# Maizzle (Tailwind CSS email build pipeline)

Use **Maizzle** when authoring HTML emails with Tailwind CSS utility workflows while still shipping table-safe, inlined, purged production HTML. Pair with `references/client-quirks.md` for Outlook, Gmail clipping, dark mode, and plaintext parity.

## Production build configuration

- Always enable CSS inlining (`css.inline: true`), unused CSS purging (`css.purge: true`), safe class names (`css.safe: true`), and six-digit hex normalization (`css.sixHex: true`) in `maizzle.config.ts`—Outlook and older webmail clients break on 3-digit hex, `rgb()`/`oklch()`, and un-inlined utility classes.
- Keep table-based outer layout containers (`role="presentation"`) for Outlook Word-engine parity; do not rely on Tailwind `grid` or `flex` for multi-column email layouts.

```ts
// maizzle.config.ts
import { defineConfig } from '@maizzle/framework';

export default defineConfig({
  css: {
    inline: true,
    purge: true,
    safe: true,
    shorthand: true,
    sixHex: true,
    preferUnitless: true,
  },
});
```

## Email-specific Maizzle rules

- **Outlook VML**: wrap Outlook-only background images or rounded-button fallbacks in `<!--[if mso]>...<![endif]-->` conditional comments; test that `css.purge` does not strip classes referenced only in media queries.
- **Gmail 102 KB clipping**: keep compiled HTML well under 102 KB (`css.purge: true` + concise inline SVG/table markup) so Gmail does not clip legal footers and unsubscribe links.
- **Plaintext parity**: generate and inspect a companion plaintext version alongside the compiled HTML rather than sending HTML-only emails.

## Do/don't pairs

| Do | Don't |
|---|---|
| Enable `css.inline`, `css.purge`, `css.safe`, and `css.sixHex` in production builds | Ship raw un-inlined Tailwind classes or `oklch()` / 3-digit hex to Outlook |
| Use `role="presentation"` tables for multi-column layouts inside Maizzle templates | Use CSS Grid or Flexbox for multi-column email structure |
| Check compiled HTML byte size against Gmail's 102 KB clipping threshold | Ignore bloated inline styles that clip the unsubscribe footer |
| Test built output in real email clients (dark mode + images off) | Treat `maizzle serve` browser preview as proof of Outlook/Gmail rendering |

## Verification commands

```sh
npx maizzle build production
```

Inspect compiled HTML byte size and inlined CSS (`static`), and test the sent email across real clients with dark mode and images disabled (`rendered`).
