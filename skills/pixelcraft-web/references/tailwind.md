# Tailwind as styling layer (v4)

Tailwind is an implementation layer, not the design direction. Treat utility classes as compiled expressions of semantic decisions—not a replacement for tokens, hierarchy, or component intent.

## Token mapping

Tailwind v4 is CSS-first. Import generated variables and bridge them into `@theme` only where utilities are needed:

```css
@import "tailwindcss";
@import "./tokens.css";

@theme {
  --color-action: var(--semantic-color-action);
  --color-surface: var(--semantic-color-background);
}
```

Do not redefine a parallel raw palette in `@theme` when semantic variables already exist. Use custom variants/utilities sparingly through documented v4 CSS APIs.

## Layout and responsive idioms

Use grid/flex utilities to express actual composition. Responsive prefixes (`sm:`, `md:`…) should implement restructuring decisions, not hide the absence of one. Prefer logical utilities (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) when available. Extract repeated semantic patterns only when reuse is real; premature component abstraction can be worse than legible utilities.

## Typography/custom fonts

Define font families/size/line-height roles in `@theme` or CSS. Avoid arbitrary values for every text size. Use measure utilities/custom CSS (`max-w-prose` where appropriate) deliberately and preserve fallback/subset behavior.

## Motion/reduced motion

Use Tailwind motion utilities only for purposeful properties; never `transition-all`. Tailwind provides motion-safe/motion-reduce variants—use them to supply meaningful alternatives:

```html
<div class="transition-opacity motion-reduce:transition-none">
```

## Accessibility specifics

Tailwind does not create semantics. Use real HTML controls, visible `focus-visible` styles, screen-reader utility only for content that truly should be visually hidden, and adequate contrast. Do not use `sr-only` to hide labels that sighted users also need.

## States idiom

Use state variants intentionally: `hover:`, `focus-visible:`, `active:`, `disabled:`, `aria-*`, `data-*`, dark mode, forced-colors where configured. Every interactive element still needs loading/error/empty/disabled semantics beyond styling.

## Forms idiom

Utilities can accelerate layout but must not replace labels/input attributes. Preserve input sizing expansion, correct autocomplete/inputmode, error association, target size, and focus visibility. Ring utilities are a mechanism, not automatically an accessible focus design.

## Do/don't pairs

| Do | Don't |
|---|---|
| `class="focus-visible:outline-2 focus-visible:outline-offset-2"` with visible semantic color | `class="outline-none"` with no replacement |
| `class="transition-opacity motion-reduce:transition-none"` | `class="transition-all duration-500"` on everything |
| semantic `@theme` bridge to tokens | copying raw brand hex into every utility class |
| `ms-4`/`pe-2` for direction-sensitive spacing | physical `ml-4`/`pr-2` by reflex in RTL-capable UI |
| intentional responsive restructuring `grid md:grid-cols-[2fr_1fr]` | stacking centered cards because mobile was never designed |

## Known traps

Utility verbosity hiding architecture, arbitrary-value sprawl, purple/blue gradient defaults, uniform `rounded-2xl shadow-xl`, duplicated class strings diverging, missing content scanning configuration, dark-mode inversion, tailwind config/CSS migration mismatch, visual sameness mistaken for system consistency.

## Verification commands

```sh
npm run lint
npm run build
node node_modules/pixelcraft/skills/pixelcraft-review/scripts/slop-scan.mjs . 2>/dev/null || true
npx playwright test
```

Inspect computed CSS/rendering because utility presence alone does not prove the intended visual result.
