# Tailwind as styling layer (v4)

Tailwind is an implementation layer, not the design direction. Treat utility classes as compiled expressions of semantic decisions—not a replacement for tokens, hierarchy, or component intent.

## Token mapping

These examples target v4. If the existing project uses v3, preserve its configuration and content discovery unless migration is in scope; verify the installed major before copying CSS directives.

Tailwind v4 is CSS-first. On Vite projects, use the native `@tailwindcss/vite` plugin instead of the PostCSS wrapper for faster builds. When mapping semantic CSS custom properties into Tailwind theme tokens, use **`@theme inline`**—not plain `@theme`—so utilities emit `var(--semantic-color-action)` directly at the element instead of binding an intermediate variable on `:root` that breaks scoped theme/mode overrides (such as `[data-theme="dark"]` or `.surface-inverted`):

```css
@import "tailwindcss";
@import "./tokens.css";
@import "tw-animate-css";

/* Scan external UI packages or monorepo paths outside auto-detected git-tracked sources */
@source "../packages/ui/src";

/* Class/attribute dark-mode selector when not using prefers-color-scheme only */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@theme inline {
  --color-action: var(--semantic-color-action);
  --color-surface: var(--semantic-color-background);
  --color-ink: var(--semantic-color-foreground);
  --font-sans: var(--semantic-font-body);
}

/* Reusable semantic utilities participate in variants (hover:, md:, dark:) */
@utility prose-measure {
  max-inline-size: 68ch;
  text-wrap: pretty;
}
```

Do not redefine a parallel raw palette in `@theme` when semantic variables already exist. Use `@theme` (without `inline`) only for static literal values you intend to resolve at `:root`.

## v4 breaking defaults & ecosystem compatibility

Check these v4 changes whenever porting patterns or mixing older snippets:

- **Default `border-color` is `currentColor`** (was `gray-200` in v3) — always specify an explicit semantic border color (`border-subtle` / `border-line`) on `border`.
- **Default `ring` width is `1px` and `currentColor`** (was `3px` blue in v3) — use `ring-2 ring-action` explicitly when a thicker focus ring is intended.
- **`outline-hidden` replaces v3 `outline-none`** — `outline-hidden` keeps a transparent outline visible in Windows Forced Colors Mode; `outline-none` now sets `outline-style: none` and hides focus in forced colors.
- **Built-in container queries**: `@container`, `@container/sidebar`, `@md:`, `@max-sm:` work natively in v4 without `@tailwindcss/container-queries`.
- **Companion packages**: upgrade to `tailwind-merge` v3+ for v4 class deduplication, and use `tw-animate-css` instead of the deprecated v3 `tailwindcss-animate` JS plugin.

## Layout and responsive idioms

Use grid/flex utilities and built-in `@container` queries (`@container` parent + `@md:grid-cols-[10rem_1fr]`) to express actual composition. Responsive prefixes (`sm:`, `md:`…) should implement restructuring decisions, not hide the absence of one. Prefer logical utilities (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) when available. Extract repeated semantic patterns only when reuse is real; premature component abstraction can be worse than legible utilities.

## Typography/custom fonts

Define font families/size/line-height roles in `@theme inline` or CSS. Avoid arbitrary values for every text size. Use measure utilities (`max-w-prose` or a custom `@utility`) deliberately and preserve fallback/subset behavior.

## Motion/reduced motion

Use Tailwind motion utilities only for purposeful properties; never `transition-all`. Tailwind provides `motion-safe:` and `motion-reduce:` variants—use them to supply meaningful alternatives:

```html
<div class="transition-opacity motion-reduce:transition-none">
```

## Accessibility specifics

Tailwind does not create semantics. Use real HTML controls, visible `focus-visible` styles, `outline-hidden` (never bare `outline-none` without a forced-colors-safe replacement), screen-reader utility only for content that truly should be visually hidden, and adequate contrast. Do not use `sr-only` to hide labels that sighted users also need.

## States idiom

Use state variants intentionally: `hover:`, `focus-visible:`, `active:`, `disabled:`, `aria-*`, `data-*`, `dark:`, `forced-colors:`. Every interactive element still needs loading/error/empty/disabled semantics beyond styling.

## Forms idiom

Utilities can accelerate layout but must not replace labels/input attributes. Preserve input sizing expansion, correct autocomplete/inputmode, error association, target size, and focus visibility. Ring utilities are a mechanism, not automatically an accessible focus design.

## Do/don't pairs

| Do | Don't |
|---|---|
| `@theme inline { --color-surface: var(--semantic-color-background); }` | Plain `@theme` referencing `var(--...)` that freezes theme resolution at `:root` |
| `class="focus-visible:outline-2 focus-visible:outline-offset-2"` or `outline-hidden focus-visible:ring-2` | `class="outline-none"` (breaks Windows Forced Colors visibility in v4) |
| `class="border border-line"` with explicit semantic border color | Bare `class="border"` assuming v3's `gray-200` default |
| `class="transition-opacity motion-reduce:transition-none"` | `class="transition-all duration-500"` on everything |
| `ms-4`/`pe-2` and built-in `@container` (`@md:flex-row`) | physical `ml-4`/`pr-2` by reflex or installing obsolete `@tailwindcss/container-queries` |
| `tailwind-merge` v3 + `tw-animate-css` + `@tailwindcss/vite` | Mixing `tailwind-merge` v2 or `tailwindcss-animate` into a v4 build |

## Known traps

Plain `@theme` freezing CSS variable aliases at `:root`, uncolored v4 `border` inheriting `currentColor`, `outline-none` erasing forced-colors focus indicators, missing `@source` for workspace UI packages, utility verbosity hiding architecture, arbitrary-value sprawl, dark-mode inversion, visual sameness mistaken for system consistency.

## Verification commands

```sh
npm run lint
npm run build
npx playwright test
```

Inspect computed CSS and dark/scoped theme switching in a real browser (`rendered`); utility presence alone is only `static` evidence.
