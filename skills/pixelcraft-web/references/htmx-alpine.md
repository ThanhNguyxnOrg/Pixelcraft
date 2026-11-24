# Hypermedia & lightweight enhancement: htmx 2, Alpine.js, Datastar, Unpoly

## Choosing the hypermedia layer

| Tool | Primary model | Strengths | Watch-outs |
|---|---|---|---|
| **htmx 2.x** | HTML attributes driving HTTP partial swaps (`hx-get`/`hx-post`/`hx-swap`) | Tiny footprint, works with any server stack, progressive enhancement via `hx-boost` | Requires explicit focus/ID hygiene and extension packages for SSE/WS/morphing |
| **Alpine.js** | Declarative local client state (`x-data`, `x-show`, `x-transition`) | Ideal companion for menus, disclosures, tabs, and optimistic local UI | Default build uses `Function()` (needs `@alpinejs/csp` under strict CSP) |
| **Datastar** | SSE-driven hypermedia + fine-grained reactive client signals (`data-signals`, `data-on-click`) | Unified server-pushed DOM morphing (SSE `datastar-patch-elements`) + reactive signals (~15 KB) with no second client library | Requires SSE-capable server handlers and clear separation of server-authoritative vs client signals |
| **Unpoly** | Progressive multi-layer HTML navigation (modals/drawers/popups, preloading, compilers) | Built-in history, focus, layer stacks, and form validation conventions out of the box | Opinionated conventions (`up-target`, `up-layer`); heavier than bare htmx |

## Token mapping

Import generated CSS variables in the base template. Because hypermedia tools swap server-generated fragments, semantic CSS must apply consistently to both full pages and partial responses. Client state (`x-data` / `data-signals`) should toggle semantic classes or `data-*` attributes rather than embedding ad hoc hex/style values.

## Layout and responsive idioms

Server-driven hypermedia is a feature: design coherent full pages first, then partial enhancement. Use CSS for layout. Targets and swaps must preserve shell structure, scroll behavior, focus, headings, and meaningful URLs (`hx-push-url="true"` / Unpoly history) where appropriate. Alpine belongs to local interaction state, not accidental SPA architecture.

## Typography/custom fonts

Load fonts once in the base template. Partial responses inherit them; do not inject duplicate font/link tags through fragments. Maintain reading measure in server templates regardless of enhancement.

## Motion/reduced motion

Use CSS transitions/classes for swap/settle states. In **htmx 2**, `hx-swap="innerHTML transition:true"` opts into the View Transitions API—gate view-transition animations behind `@media (prefers-reduced-motion: no-preference)`. Alpine `x-transition` must also respect reduced motion. Avoid animating replacement in a way that hides content reordering or focus jumps.

## Accessibility specifics

Fragments must contain valid, complete semantics in context: labels, headings, buttons/links, and live regions where needed. Manage focus after `hx-swap`, especially when replacing the triggering element. Use **Idiomorph** (`hx-ext="morph" hx-swap="morph:outerHTML"`) or **`@alpinejs/morph`** when updating active regions so text-input focus, scroll position, and `<video>` playback survive server updates. Alpine `x-cloak` avoids flash-of-uninitialized behavior but must not hide essential content if JS fails.

## htmx 2.x, Alpine plugins, Datastar, and Unpoly idioms

- **htmx 2.x specifics**:
  - Use **`hx-on:*`** (e.g., `hx-on::after-request="if(event.detail.successful) this.reset()"`) instead of legacy v1 `hx-on` syntax.
  - Install standalone extension packages (**`htmx-ext-sse`**, **`htmx-ext-ws`**, **`idiomorph`**) rather than assuming v1 built-in extensions.
  - Prevent duplicate form/button mutations with **`hx-disabled-elt="this"`** (or `hx-disabled-elt="find button[type='submit']"`) alongside a visible `htmx-indicator`.
  - Use **`hx-swap="morph"`** (via Idiomorph) when re-rendering forms/lists where preserving DOM identity and focus matters.
- **Alpine.js official plugins**:
  - **`@alpinejs/csp`**: required when your Content-Security-Policy forbids `'unsafe-eval'`; register component methods via `Alpine.data(...)` instead of inline JS expressions.
  - **`@alpinejs/focus`**: apply `x-trap.inert.noscroll="open"` on modal dialogs to trap focus and mark background siblings `inert`.
  - **`@alpinejs/anchor`**: anchor popovers/dropdowns to triggers when CSS Anchor Positioning browser coverage is insufficient.
  - **`@alpinejs/morph`**: morph server HTML into Alpine trees without resetting child `x-data` state.
- **Datastar**: bind reactive UI state with `data-signals` and stream DOM patches over SSE (`@get('/events')`) so server-driven updates morph cleanly into place while keeping client-only micro-interactions (toggles, computed previews) instant.
- **Unpoly**: lean on `up-layer="new modal"` / `up-dismissable` for accessible server-rendered dialogs and `up-preload` for fast MPA links, keeping fallback routes valid as standalone pages.

```html
<!-- htmx 2: duplicate-submit lock, Idiomorph focus-safe swap, hx-on:* cleanup -->
<form
  action="/invoices"
  method="post"
  hx-post="/invoices"
  hx-target="#invoice-section"
  hx-swap="morph:outerHTML transition:true"
  hx-disabled-elt="find button[type='submit']"
  hx-on::after-request="if(event.detail.successful) this.reset()"
>
  <label for="inv-title">Title</label>
  <input id="inv-title" name="title" required autocomplete="off">
  <button type="submit">
    Save invoice
    <span class="htmx-indicator" aria-hidden="true">…</span>
  </button>
</form>

<!-- Alpine + @alpinejs/focus modal dialog -->
<div x-data="{ open: false }" @keydown.escape.window="open = false">
  <button type="button" @click="open = true">Filter</button>
  <div x-show="open" x-trap.inert.noscroll="open" role="dialog" aria-modal="true" aria-labelledby="filter-heading">
    <h2 id="filter-heading">Filter invoices</h2>
    <button type="button" @click="open = false">Close</button>
  </div>
</div>
```

## States & Forms idiom

Return real HTML error/empty/partial fragments from the server—not bare 422 JSON with a generic toast. Configure htmx `responseHandling` (v2) or return swap-enabled 422 error fragments so validation errors render adjacent to inputs while preserving submitted values. Out-of-band swaps (`hx-swap-oob`) need clear ID ownership and zero duplicated IDs.

## Do/don't pairs

| Do | Don't |
|---|---|
| `<a href="/invoices" hx-boost="true">Invoices</a>` | `<span hx-get="/invoices">Invoices</span>` pretending to be navigation |
| `hx-disabled-elt="this"` + visible `htmx-indicator` | Silent background mutation allowing rapid duplicate POSTs |
| `hx-swap="morph"` (Idiomorph) when preserving focus/form inputs | Blind `outerHTML` swap over an active input that drops keyboard focus |
| `@alpinejs/csp` + `Alpine.data(...)` under strict CSP headers | Relaxing CSP with `'unsafe-eval'` just to keep inline Alpine expressions |
| `@alpinejs/focus` `x-trap.inert.noscroll` or native `<dialog>` | Unmanaged `x-show` modal that lets Tab escape into the page behind it |
| Render validation fragment with preserved values and adjacent errors | Returning only `422` with a disappearing toast or clearing the form |

## Known traps

Forgetting that htmx 2 ignores 4xx/5xx swaps unless configured (`responseHandling` / 422 swap rule), missing separate `htmx-ext-sse`/`htmx-ext-ws`/`idiomorph` packages in htmx 2, invalid nested HTML after swaps, focus disappearing with replaced triggers, duplicated IDs across OOB swaps, Alpine CSP errors without `@alpinejs/csp`, breaking the no-JS baseline.

## Verification commands

Run the owning server framework's test suite and browser E2E suite without suppressing failures:

```sh
npm test && npx playwright test
```

Test both no-JS/full-page behavior and enhanced fragment/SSE behavior in a real browser (`rendered`); both are separate evidence.
