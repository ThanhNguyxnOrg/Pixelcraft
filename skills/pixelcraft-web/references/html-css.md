# HTML + CSS

Evidence: WCAG 2.2, logical properties.

## Token mapping

Use generated CSS variables verbatim in a semantic layer:

```css
@import "./tokens.css";
:root { color-scheme: light dark; }
body { background: var(--semantic-color-background); color: var(--semantic-color-foreground); }
```

Do not bypass semantic roles with primitive color variables in component rules. Keep primitive scales available for charts/illustration only.

## Layout and responsive idioms

Use semantic HTML structure first, then CSS Grid for two-dimensional composition, flexbox for one-dimensional groups, container queries for component adaptation, and logical properties for direction-sensitive spacing. Prefer `clamp()` and intrinsic sizing over hard breakpoints alone. Restructure at narrow widths rather than scaling a desktop mockup.

## Typography/custom fonts

Use `font-face` with `font-display: swap` or `optional` deliberately, preload only critical fonts, set metric overrides/fallbacks where needed, and use system fonts when platform fit/performance matters. Control measure with `max-inline-size: 65ch`–`75ch` rather than arbitrary containers.

## Motion/reduced motion

Use CSS transitions/animations only for purposeful transform/opacity/state change. Gate motion:

```css
@media (prefers-reduced-motion: no-preference) {
  .panel { transition: opacity 160ms ease-out, translate 160ms ease-out; }
}
```

JavaScript should query `matchMedia('(prefers-reduced-motion: reduce)')` when motion is imperative.

## Modern browser-native craft idioms

Use progressive, zero-dependency CSS capabilities before importing JS animation or layout libraries:

- **Discrete entry/exit transitions**: combine `@starting-style` and `transition-behavior: allow-discrete` for native `<dialog>`, `[popover]`, and disclosure reveals so overlays animate smoothly without JS choreography and degrade cleanly when unsupported.
- **Scroll-driven progress**: gate `animation-timeline: view()` / `scroll()` behind both `@supports (animation-timeline: view())` and `@media (prefers-reduced-motion: no-preference)`; keep the final layout readable without animation.
- **Typographic rag polish**: apply `text-wrap: balance` on short headings/callouts and `text-wrap: pretty` on body paragraphs to prevent awkward single-word orphans.
- **Viewport & scrollbar stability**: prefer `svh`/`dvh` over `100vh` on mobile and `scrollbar-gutter: stable` on scrolling regions to prevent horizontal jump when content toggles overflow.
- **Self-adapting components**: use `container-type: inline-size` with `@container` queries for cards, sidebars, and dense toolbars so components respond to their actual slot width rather than assuming global viewport breakpoints.

## Accessibility specifics

Native elements carry most semantics: `button`, `a`, `form`, `label`, `input`, `select`, `table`, headings, landmarks. Do not use positive `tabindex`; use DOM order. Use `dialog`/popover/inert patterns carefully and restore focus. Validate names/roles/status behavior in the accessibility tree.

## States idiom

Use real elements/classes and server/client state consistently: `hidden`, `disabled`, `aria-disabled` only when focus must remain, `role="status"` for nonintrusive async completion, skeleton containers with stable dimensions, and explicit empty/error markup rather than blank containers.

## Forms idiom

Use one persistent `label`, correct `type`, `inputmode`, `autocomplete`, spellcheck/autocapitalize settings, constraint validation only where appropriate, and server error association through text near the field plus summary for complex forms. Never block paste.

## Do/don't pairs

| Do | Don't |
|---|---|
| `<button type="button">Save draft</button>` | `<div onclick="save()">Save draft</div>` |
| `margin-inline-start: var(--space-4);` | `margin-left: var(--space-4);` for direction-neutral layout |
| `@media (prefers-reduced-motion: reduce) { * { animation: none } }` plus intentional state equivalents | deleting focus/state feedback entirely in reduced mode |
| `<label for="email">Email</label><input id="email" autocomplete="email">` | `<input placeholder="Email">` as the only label |
| `grid-template-columns: minmax(0, 1fr) minmax(16rem, 24rem);` | fixed pixel columns that overflow/clip localized content |

## Known traps

`100vh` on mobile browsers, sticky/fixed chrome obscuring focus, container query support assumptions, specificity wars caused by utility layering, autofocus as a substitute for flow design, duplicated IDs from reused fragments, CSS nesting support differences, logical/physical mismatch in charts and media controls.

## Verification commands

Use the project's actual toolchain; typical commands:

```sh
npx playwright test
npx axe <url-or-file>
npx lighthouse <url> --only-categories=accessibility,performance
npm run test -- --run
```

Rendered evidence requires a real browser/device or trace/screenshot inspection, not merely a successful build.
