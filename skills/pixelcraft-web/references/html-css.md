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

For an editorial or commerce shell, separate the primary task or active state from the destination index. If inline navigation becomes a disclosure on touch, consider keeping booking, a cart count, or the current chapter exposed outside it. Keep the same destination and state across layouts. Test the closed and open menu at phone portrait and landscape: reach the primary action, dismiss the menu with the supported inputs, and confirm focus returns to its trigger. If the scene cannot fit in a shallow viewport, use a purposeful crop or a static composition instead of burying the action below empty scene space.

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

If a static poster replaces a decorative scene, make that decision before starting its JS, video, or GPU work when the task does not need it. Keep the poster and live semantic content independent of the scene bundle. A small or reduced-motion layout that looks static can still download and initialize the desktop effect.

## Modern browser-native craft idioms

Use progressive, zero-dependency CSS and HTML capabilities before importing JS animation or positioning libraries:

- **Top-layer overlays (`[popover]` + `<dialog>`) with CSS Anchor Positioning**: let the browser manage top-layer stacking, light-dismiss (`<dialog closedby="any">`), and flip fallbacks instead of manual `z-index` ladders or JS positioning engines. Always reset `margin: 0` on anchored popovers because the UA stylesheet defaults `[popover]` to `margin: auto`, which centers it in the viewport and overrides anchor placement.
- **Invoker Commands (`commandfor` / `command`)**: open/close dialogs (`command="show-modal"`, `command="close"`) and toggle popovers declaratively from `<button commandfor="filters-dialog" command="show-modal">` without glue JS (fall back to `popovertarget` or a small click listener where older browsers are in scope).
- **Customizable `<select>`**: opt into `appearance: base-select` on `select` and `::picker(select)` when styled dropdowns need native keyboard navigation, form participation, and top-layer placement without building a custom ARIA listbox from scratch.
- **Exclusive accordions**: group native `<details name="faq-group">` elements so opening one closes siblings with zero JavaScript.
- **Discrete & intrinsic-size transitions**: combine `@starting-style` and `transition-behavior: allow-discrete` for `<dialog>`/`[popover]`, and use `interpolate-size: allow-keywords` or `calc-size(auto, size)` for smooth `height: 0` → `auto` disclosure reveals (gated behind reduced-motion checks).
- **Scroll-driven progress**: gate `animation-timeline: view()` / `scroll()` behind both `@supports (animation-timeline: view())` and `@media (prefers-reduced-motion: no-preference)`; keep the final layout readable without animation.
- **Scoped cascade & self-adapting slots**: organize resets/tokens/components/utilities with `@layer`, isolate subtree styling with `@scope (.card) to (.card-slot)`, use `container-type: inline-size` with `@container` queries, `:has()` for parent state styling, and `field-sizing: content` for auto-growing inputs/textareas.
- **Perceptual color & theme derivation**: use `light-dark(var(--light), var(--dark))` with `color-scheme: light dark`, `color-mix(in oklch, ...)` for state mixes, and relative color syntax (`oklch(from var(--semantic-color-action) calc(l - 0.08) c h)`) for predictable hover/active ramps.
- **Typographic rag & viewport stability**: apply `text-wrap: balance` on short headings, `text-wrap: pretty` on body copy, `svh`/`dvh` instead of `100vh` on mobile, and `scrollbar-gutter: stable` on scrolling regions.
- **Native navigation & prefetching**: prefer the **Navigation API** (`window.navigation`) over fragile `history.pushState`/`popstate` wrappers in modern SPA routers, and use `<script type="speculationrules">` (`prefetch`/`prerender` with `eagerness: "moderate"`) for near-instant MPA navigations instead of speculative JS fetches.

```css
/* Cascade layering and semantic light/dark derivation */
@layer reset, tokens, base, components, utilities;

@layer tokens {
  :root {
    color-scheme: light dark;
    --surface-raised: light-dark(oklch(99% 0.005 260), oklch(22% 0.01 260));
    --action-hover: oklch(from var(--semantic-color-action) calc(l - 0.07) c h);
  }
}

/* Native anchored popover with margin: 0 reset and discrete entry/exit transition */
.menu-trigger { anchor-name: --menu-btn; }

.menu-panel[popover] {
  margin: 0;
  position-anchor: --menu-btn;
  position-area: block-end span-inline-end;
  position-try-fallbacks: flip-block, flip-inline;
  opacity: 0;
  translate: 0 -4px;
  scale: 0.98;
}

@media (prefers-reduced-motion: no-preference) {
  .menu-panel[popover] {
    transition:
      opacity 150ms ease-out,
      translate 150ms ease-out,
      scale 150ms ease-out,
      display 150ms ease-out allow-discrete,
      overlay 150ms ease-out allow-discrete;
  }
}

.menu-panel[popover]:popover-open {
  opacity: 1;
  translate: 0 0;
  scale: 1;
}

@starting-style {
  .menu-panel[popover]:popover-open {
    opacity: 0;
    translate: 0 -4px;
    scale: 0.98;
  }
}

/* Customizable native <select> (progressive enhancement) */
@supports (appearance: base-select) {
  select.styled-select,
  select.styled-select::picker(select) {
    appearance: base-select;
  }
}

/* Container-driven card adaptation and @scope isolation */
.card-slot { container-type: inline-size; }
@scope (.card) to (.card-slot) {
  @container (inline-size >= 28rem) {
    :scope { display: grid; grid-template-columns: 10rem minmax(0, 1fr); gap: 1rem; }
  }
}
```

## Accessibility specifics

Native elements carry most semantics: `button`, `a`, `form`, `label`, `input`, `select`, `table`, headings, landmarks. Do not use positive `tabindex`; use DOM order. Use `<dialog>`/`[popover]`/`inert` patterns carefully and restore focus. Validate names/roles/status behavior in the accessibility tree.

## States idiom

Use real elements/classes and server/client state consistently: `hidden`, `disabled`, `aria-disabled` only when focus must remain, `role="status"` for nonintrusive async completion, skeleton containers with stable dimensions, and explicit empty/error markup rather than blank containers.

## Forms idiom

Use one persistent `label`, correct `type`, `inputmode`, `autocomplete`, spellcheck/autocapitalize settings, constraint validation only where appropriate, and server error association through text near the field plus summary for complex forms. Never block paste.

## Do/don't pairs

| Do | Don't |
|---|---|
| `<button type="button">Save draft</button>` | `<div onclick="save()">Save draft</div>` |
| `margin-inline-start: var(--space-4);` | `margin-left: var(--space-4);` for direction-neutral layout |
| Gate decorative/parallax motion inside `@media (prefers-reduced-motion: no-preference)` while keeping subtle functional opacity/progress feedback | Global `* { animation: none !important; transition: none !important; }` that kills progress spinners, focus feedback, and state transitions |
| Reset `margin: 0` on anchored `[popover]` panels using `position-anchor` | Omit `margin: 0` and let UA `margin: auto` recenter the popover off its anchor |
| `<label for="email">Email</label><input id="email" autocomplete="email">` | `<input placeholder="Email">` as the only label |
| `grid-template-columns: minmax(0, 1fr) minmax(16rem, 24rem);` | fixed pixel columns that overflow/clip localized content |

## Known traps

`100vh` on mobile browsers, missing `margin: 0` on anchored `[popover]`, sticky/fixed chrome obscuring focus, unguarded `appearance: base-select` without checking older browser fallback, specificity wars solved better by `@layer`, autofocus as a substitute for flow design, duplicated IDs from reused fragments, logical/physical mismatch in charts and media controls.

## Verification commands

Use the project's actual toolchain; typical commands:

```sh
npx playwright test
npx axe <url-or-file>
npx lighthouse <url> --only-categories=accessibility,performance
npm run test -- --run
```

Rendered evidence requires a real browser/device or trace/screenshot inspection, not merely a successful build.
