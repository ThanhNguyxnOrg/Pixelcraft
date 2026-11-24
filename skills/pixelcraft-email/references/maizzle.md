# Maizzle (Tailwind CSS email build pipeline)

Use **Maizzle** when authoring HTML emails with Tailwind CSS utility workflows while still shipping table-safe, inlined, purged production HTML. Pair with `references/client-quirks.md` for New Outlook vs Classic Outlook, Gmail 102 KB clipping, dark mode, and plaintext parity.

## Production build configuration

- Enable CSS inlining (`css.inline: true`), unused CSS purging (`css.purge: true`), safe class names (`css.safe: true`), six-digit hex normalization (`css.sixHex: true`), and companion plaintext generation (`plaintext: true`) in `maizzle.config.ts`.
- Keep table-based outer layout containers (`role="presentation"`) with explicit `lang` and `dir` for Outlook Word-engine parity; do not rely on Tailwind `grid` or `flex` for multi-column email layouts.

```ts
// maizzle.config.ts
import { defineConfig } from '@maizzle/framework';

export default defineConfig({
  plaintext: true, // emits companion .txt alongside compiled .html
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

## Tailwind v3 vs v4 inlining caveats

- **Tailwind v3** (standard Maizzle baseline): generates hex/RGB utilities and predictable class rules that Maizzle's PostCSS + Juice inliner resolves cleanly into inline `style` attributes.
- **Tailwind v4 hazards**: Tailwind v4 emits CSS custom properties (`var(--color-*)`), `oklch()` / `color-mix()` color functions, `rem` defaults, native CSS nesting, and `@layer` wrappers. Gmail discards the **entire** `<style>` block on `@layer` or syntax errors, and Classic Outlook ignores `var()`, `oklch()`, and `rem`.
- If upgrading a Maizzle pipeline toward Tailwind v4, verify in compiled `.html` output (`static`) that **all** CSS variables are resolved to static values, `oklch()` is converted to 6-digit hex (`sixHex: true`), spacing/type use `px`, and zero `@layer` blocks remain in `<style>`.

## Email-specific Maizzle rules

- **New Outlook vs Classic Outlook**: wrap Classic Outlook-only VML fallbacks strictly in `<!--[if mso]>...<![endif]-->` and keep a real styled HTML `<a>` CTA outside `<!--[if mso]>` so New Outlook (which ignores MSO comments and VML) still renders a working button. Check that `css.purge` preserves dark-mode (`@media (prefers-color-scheme: dark)` / `[data-ogsc]`) classes.
- **Gmail 102 KB clipping**: keep compiled HTML well under 102 KB (`css.purge: true` + concise table markup) so Gmail does not clip legal footers and unsubscribe links.
- **Plaintext parity**: enable `plaintext: true` (or configure `plaintext: { destination: { path: 'build_production/text' } }`) and inspect the generated `.txt` file for clean link preservation and reading order.

## Do/don't pairs

| Do | Don't |
|---|---|
| Enable `plaintext: true`, `css.inline`, `css.purge`, `css.safe`, and `css.sixHex` in production builds | Ship raw Tailwind classes, `var(--*)`, `oklch()`, `@layer`, or HTML-only emails without plaintext |
| Use `role="presentation"` tables with `lang`/`dir` for multi-column layouts inside Maizzle templates | Use CSS Grid or Flexbox for multi-column email structure |
| Check compiled HTML byte size against Gmail's 102 KB clipping threshold and verify zero `@layer` in `<style>` | Ignore bloated inline styles or Tailwind v4 syntax that causes Gmail to drop `<style>` |
| Test built output in real email clients (New Outlook, Classic Outlook, Gmail, Apple Mail; dark mode + images off) | Treat `maizzle serve` browser preview as proof of inbox rendering |

## Verification commands

```sh
npx maizzle build production
```

Inspect compiled HTML byte size, resolved inline hex/`px` values, absence of `@layer`/`oklch()`, and generated `.txt` plaintext parity (`static`), then test the sent email across real clients with dark mode and images disabled (`rendered`).
