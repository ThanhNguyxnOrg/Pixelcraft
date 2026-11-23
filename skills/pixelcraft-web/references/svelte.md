# Svelte / SvelteKit

## Token mapping

Import generated CSS variables in the root layout or global stylesheet:

```svelte
<script>import '../tokens.css';</script>
```

Use semantic variables inside component styles. Svelte scoped styles do not replace token architecture; use `:global()` only deliberately.

## Layout and responsive idioms

Use layouts for persistent shell/navigation and pages for route-specific content. CSS remains first-class: grid/flex/container queries/logical properties. Svelte stores should represent shared state, not layout constants. Component-level adaptation belongs close to the component through CSS/container queries where possible.

## Typography/custom fonts

Load fonts in `app.html`/root layout or font tooling with explicit fallbacks/subsets. Avoid hydrating text styling that causes font/layout jumps. Measure and hierarchy belong in CSS rather than ad hoc inline styles.

## Motion/reduced motion

Svelte transitions (`transition`, `in`, `out`, `animate`) are concise but still need purpose. Honor reduced motion by conditionally disabling or shortening transition parameters after checking `matchMedia`; do not animate list reordering when it destroys orientation.

## Accessibility specifics

Use real elements. Svelte warnings help but do not guarantee usable UX. Manage focus after navigation/dialog/state removal, label form controls, and preserve keyboard behavior. `{@html}` is dangerous for untrusted content and can bypass semantic/control expectations. Use `svelte:window` listeners with cleanup and SSR guards.

## States idiom

SvelteKit `load` return shape, `error`, `status`, stores, and form action results each represent different lifecycle state. Render loading/stale/empty/error explicitly. Progressive enhancement through `use:enhance` should preserve input, expose pending state, prevent duplicate submission, and handle rollback.

## Forms idiom

Svelte `bind:value` does not replace labels or validation timing. Native form actions plus `use:enhance` provide resilient baseline where suitable. Use correct `autocomplete`/`inputmode` attributes and preserve invalid input returned by server actions.

## Do/don't pairs

| Do | Don't |
|---|---|
| `<a href="/invoice/42">View invoice</a>` | `<div on:click={() => goto('/invoice/42')}>View invoice</div>` |
| `<label for="batch">Batch</label><input id="batch" bind:value={batch}>` | `<input bind:value={batch} placeholder="Batch">` as only label |
| explicit `export function actions` error return shape | throwing raw exceptions as the only validation UX |
| small scoped store with explicit ownership | mutable module-global store leaking across users/routes |
| stable keyed `{#each items as item (item.id)}` | keyless list mutation causing focus/state reuse bugs |

## Known traps

SSR/browser divergence, store leakage, transition/layout shift, stale form data after invalid submission, keyed each-block focus reuse, `$:` legacy reactivity confusion in mixed codebases, accidental use of browser APIs during SSR, accessibility warnings treated as complete validation.

## Verification commands

```sh
npm run check
npm run lint
npm run test -- --run
npm run build
npx playwright test
```

Use browser inspection for rendering/hydration evidence; `check` is static evidence only.
