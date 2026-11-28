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

## Typography, self-hosted WOFF2 & fallback metric matching

Self-host subsetted variable or static `.woff2` files (`<= 2–3` font files total on the critical path; preload only primary above-the-fold faces with `<link rel="preload" as="font" type="font/woff2" crossorigin>`). Pair `font-display: swap` (or `optional` on fast repeat-visit apps) with explicit `@font-face` metric overrides on a local system fallback so glyph swap causes **zero CLS**:

```css
@font-face {
  font-family: "Brand Sans";
  src: url("/fonts/brand-sans-latin.woff2") format("woff2");
  font-weight: 300 700;
  font-display: swap;
}

@font-face {
  font-family: "Brand Sans Fallback";
  src: local("Inter"), local("Segoe UI"), local("Arial");
  size-adjust: 101.4%;
  ascent-override: 96%;
  descent-override: 24%;
  line-gap-override: 0%;
}

:root {
  --font-sans: "Brand Sans", "Brand Sans Fallback", system-ui, sans-serif;
}
```

Control reading measure with `max-inline-size: 65ch`–`75ch` rather than arbitrary wide containers.

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

## Accessibility, skip links & cascade discipline

Native elements carry most semantics: `button`, `a`, `form`, `label`, `input`, `select`, `table`, headings, landmarks. Do not use positive `tabindex`; use DOM order. Use `<dialog>`/`[popover]`/`inert` patterns carefully and restore focus. Validate names/roles/status behavior in the accessibility tree.

- **Mandatory `Skip to main content` link**: render `<a class="skip-link" href="#main-content">Skip to main content</a>` as the very first focusable element inside `<body>`, visually clipped off-screen until `:focus-visible`, jumping directly to `<main id="main-content" tabindex="-1">` so keyboard and switch users bypass repetitive headers (WCAG 2.4.1).
- **Zero `!important` cascade sprawl**: govern specificity with an explicit `@layer reset, tokens, base, components, utilities;` declaration order and semantic tokens—never patch component rules with ad-hoc `!important` overrides.

```css
.skip-link {
  position: fixed;
  inset-block-start: 0.75rem;
  inset-inline-start: 0.75rem;
  z-index: 9999;
  padding: 0.625rem 1rem;
  background: var(--semantic-color-background);
  color: var(--semantic-color-foreground);
  border: 2px solid var(--semantic-color-action);
  translate: 0 -200%;
}
.skip-link:focus-visible { translate: 0 0; }
```

## States, custom `404` / `500` recovery routes & `@media print`

Use real elements/classes and server/client state consistently: `hidden`, `disabled`, `aria-disabled` only when focus must remain, `role="status"` for nonintrusive async completion, skeleton containers with stable dimensions, and explicit empty/error markup rather than blank containers.

- **Custom branded `404` & `500` recovery surfaces**: never leave default framework/CDN error screens in production. Ship a branded `404` route (states what is missing, preserves site search / top category links, and offers a clear primary return CTA with HTTP `404` status) and a zero-dependency static-safe `500` route / root error boundary (shows human recovery copy, retry button, support contact, and copyable request/correlation ID without relying on the broken API).
- **Print stylesheet (`@media print`)**: provide clean print styling for articles, documentation, invoices, order receipts, and booking confirmations—hide navbars, footers, sticky toolbars, cookie banners, and chat launchers; force high-contrast black ink on white paper even if the user is in dark mode; expand scroll containers; and prevent page-break slicing across tables, receipts, and code blocks:

```css
@media print {
  @page { margin: 15mm; }
  :root, body { background: #fff; color: #000; color-scheme: light; }
  header, nav, footer, aside, .skip-link, [data-print-hidden], dialog, [popover] { display: none; }
  main { max-inline-size: none; padding: 0; overflow: visible; }
  table, figure, pre, blockquote, .invoice-summary { break-inside: avoid; }
  h1, h2, h3 { break-after: avoid; }
}
```

## Forms idiom

Use one persistent `label`, correct `type`, `inputmode`, `autocomplete`, spellcheck/autocapitalize settings, constraint validation only where appropriate, and server error association through text near the field plus summary for complex forms. Never block paste.

## Document `<head>` priority order (`capo.js` 11-tier rules)

Order `<head>` elements by browser preload-scanner priority so critical metadata, connections, CSS, and LCP assets never queue behind metadata bloat:

| Tier | Element class | Rule |
|---:|---|---|
| 1 | Pragma & core meta | `<meta charset="utf-8">` within the **first 1024 bytes**, followed immediately by `<meta name="viewport">`, `<base>`, and CSP `<meta http-equiv>` |
| 2 | Document title | `<title>` |
| 3 | Critical origins & LCP preload | `<link rel="preconnect" crossorigin>` for critical origins and `<link rel="preload" fetchpriority="high">` for hero LCP image/font |
| 4 | Async scripts | `<script async>` (only when genuinely independent of DOM/CSS) |
| 5 | `@import` styles | Avoid CSS `@import` chains in production; bundle or use `<link rel="stylesheet">` |
| 6 | Synchronous scripts | Avoid blocking `<script>` except tiny inline theme/consent-default scripts that prevent flash/CLS |
| 7 | Synchronous CSS | `<link rel="stylesheet">` and critical inline `<style>` |
| 8 | Standard preload | `<link rel="preload">` and `<link rel="modulepreload">` |
| 9 | Deferred & module scripts | `<script defer>` and `<script type="module">` |
| 10 | Speculative navigation | `<link rel="prefetch">`, `<link rel="dns-prefetch">`, and `<script type="speculationrules">` |
| 11 | Metadata & icons (last) | `<meta name="description">`, Open Graph / Twitter tags, JSON-LD, `<link rel="canonical">`, `theme-color`, favicons, and `manifest.webmanifest` |

## Cross-browser CSS, touch, Safari & pointer hygiene

- **iOS Safari input auto-zoom prevention**: keep `<input>`, `<select>`, and `<textarea>` at **`font-size: max(16px, 1em)`** (`>= 16px` computed on mobile viewports) so tapping a field never triggers Safari viewport zoom. **Never** suppress zoom with `maximum-scale=1` or `user-scalable=no` in `<meta name="viewport">` (WCAG 1.4.4 violation).
- **Touch & hover discipline**: wrap hover-only visual effects in **`@media (hover: hover) and (pointer: fine)`** so touch taps do not leave stuck hover highlights, and set **`touch-action: manipulation`** on interactive controls (`a`, `button`, `summary`, `[role="button"]`) to remove double-tap zoom delay while preserving pinch-zoom.
- **Safari overscroll & dark-mode parity**: set the page canvas `background-color` on **`html`** (not only `body`) so Safari rubber-band overscroll never flashes white; declare `color-scheme: light dark` alongside `<meta name="theme-color" media="(prefers-color-scheme: light)" ...>` and `(prefers-color-scheme: dark)` for Safari/mobile chrome parity; and set explicit **`background-color` and `color`** on native `<select>` and `<option>` elements so Windows Dark Mode never renders unreadable white-on-white option menus.
- **Safari SVG transform fix**: Safari mishandles `transform-origin` on directly transformed inner SVG primitives (`<path>`, `<circle>`, `<rect>`). Wrap animated or transformed SVG shapes in a **`<g>`** group with `transform-box: fill-box; transform-origin: center;`.
- **Typography, selection & focus-ring hygiene**: style **`::selection`** with accessible contrast and reset **`-webkit-text-fill-color: currentColor`** inside `::selection` so gradient `background-clip: text` headings stay legible when selected; apply **`-webkit-text-size-adjust: 100%`** on `html` to prevent iOS landscape font inflation; set **`-webkit-font-smoothing: antialiased`** on the root layout container (not ad-hoc on fragments) so macOS portals, dialogs, and tooltips match page glyph weight; and ensure `:focus-visible` rings match container `border-radius` (`outline` follows `border-radius` in modern browsers; keep `outline-offset` consistent).
- **Pointer, menu & drag hygiene**: open dropdown and context menus on **`pointerdown`/`mousedown`** for crisp response (keeping keyboard `Enter`/`Space`/`ArrowDown` parity); eliminate pointer **dead zones** between a trigger and its menu/hit area (bridge gaps with transparent padding or Safe-Triangle corridors); put **`pointer-events: none`** on decorative glow, noise, and gradient overlay layers so they never intercept clicks; and during active drag interactions apply **`user-select: none`** on the drag container plus **`inert`** on background/non-drop regions so accidental text selection or background focus cannot occur.

```css
html {
  color-scheme: light dark;
  background-color: var(--semantic-color-background);
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
}

input, select, textarea { font-size: max(16px, 1em); }
select, select option { background-color: var(--semantic-color-surface); color: var(--semantic-color-foreground); }
a, button, summary, [role="button"] { touch-action: manipulation; }

@media (hover: hover) and (pointer: fine) {
  .card-action:hover { background-color: var(--semantic-color-surface-hover); }
}

.icon-svg g.spin-target { transform-box: fill-box; transform-origin: center; }
::selection { background: var(--semantic-color-selection-bg); color: var(--semantic-color-selection-fg); -webkit-text-fill-color: currentColor; }
.decorative-glow { pointer-events: none; }
```

## Do/don't pairs

| Do | Don't |
|---|---|
| `<button type="button">Save draft</button>` | `<div onclick="save()">Save draft</div>` |
| Order `<head>` by the 11-tier `capo.js` priority (`charset` < 1024 B → `title` → `preconnect`/LCP preload → CSS → `defer`/`module` → OG/favicons last) | Place Open Graph tags, JSON-LD, and favicons above critical CSS or `preconnect` links |
| Set `font-size: max(16px, 1em)` on inputs and wrap hover styles in `@media (hover: hover) and (pointer: fine)` | Add `maximum-scale=1` to stop iOS zoom or leave sticky hover styles firing on touch taps |
| Set `html` background, light/dark `theme-color`, and explicit `select`/`option` colors; wrap transformed SVG shapes in `<g>` with `transform-box: fill-box` | Style only `body` background (white Safari overscroll), leave Windows dark `<select>` unstyled, or transform raw SVG `<path>` elements |
| Reset `-webkit-text-fill-color` inside `::selection`, put `pointer-events: none` on decorative overlays, and use `user-select: none` + `inert` during drag | Leave gradient text invisible when selected, let glow overlays swallow clicks, or highlight background text mid-drag |
| Render `<a class="skip-link" href="#main-content">` first in `<body>` and order CSS via `@layer` | Force keyboard users through 25 nav links or fight specificity with `!important` |
| Self-host `<= 2–3` subsetted `.woff2` files with `@font-face` `size-adjust` / `ascent-override` | Load 6 unsubsetted Google Font weights that shift layout on swap |
| Ship branded `404`/`500` recovery routes and `@media print` rules for receipts/articles/docs | Leave raw stack traces/framework `404`s or print dark-mode navbars over invoices |
| `margin-inline-start: var(--space-4);` | `margin-left: var(--space-4);` for direction-neutral layout |
| Gate decorative/parallax motion inside `@media (prefers-reduced-motion: no-preference)` while keeping subtle functional opacity/progress feedback | Global `* { animation: none !important; transition: none !important; }` that kills progress spinners, focus feedback, and state transitions |
| Reset `margin: 0` on anchored `[popover]` panels using `position-anchor` | Omit `margin: 0` and let UA `margin: auto` recenter the popover off its anchor |
| `<label for="email">Email</label><input id="email" autocomplete="email">` | `<input placeholder="Email">` as the only label |
| `grid-template-columns: minmax(0, 1fr) minmax(16rem, 24rem);` | fixed pixel columns that overflow/clip localized content |

## Known traps

`100vh` on mobile browsers, `< 16px` mobile inputs triggering iOS Safari zoom (or `maximum-scale=1` breaking WCAG 1.4.4), unguarded `:hover` sticking on touchscreens, missing `html` background / `theme-color` causing Safari rubber-band flash, unstyled `<select>`/`<option>` turning unreadable in Windows Dark Mode, Safari SVG transform drift without `<g>` + `transform-box: fill-box`, invisible selected gradient text missing `-webkit-text-fill-color` reset, decorative overlays blocking clicks without `pointer-events: none`, missing `margin: 0` on anchored `[popover]`, sticky/fixed chrome obscuring focus, unguarded `appearance: base-select` without checking older browser fallback, specificity wars solved better by `@layer`, missing `Skip to main content` link, broken dark-mode printouts, autofocus as a substitute for flow design, duplicated IDs from reused fragments, logical/physical mismatch in charts and media controls.

## Verification commands

Use the project's actual toolchain; typical commands:

```sh
npx playwright test
npx axe <url-or-file>
npx lighthouse <url> --only-categories=accessibility,performance
npm run test -- --run
```

Rendered evidence requires a real browser/device or trace/screenshot inspection, not merely a successful build.
