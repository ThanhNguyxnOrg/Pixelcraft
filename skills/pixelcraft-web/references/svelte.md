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

Svelte transitions (`transition:`, `in:`, `out:`, `animate:`) are concise but still need purpose. Read `prefersReducedMotion.current` from `svelte/motion` (SSR-safe reactive wrapper around `matchMedia('(prefers-reduced-motion: reduce)')`) to zero durations or swap spatial slides for subtle opacity fades; do not animate list reordering when it destroys orientation.

## Accessibility specifics

Use real elements. Svelte compiler a11y warnings help but do not guarantee usable UX. Use `$props.id()` (Svelte 5.20+) to generate SSR-safe unique IDs for `<label for>` and `aria-describedby` inside reusable components. Manage focus after navigation/dialog/state removal, label form controls, and preserve keyboard behavior. `{@html}` is dangerous for untrusted content and bypasses semantic/control guarantees.

## States idiom

SvelteKit `load` return shape, `error`, `status`, `$app/state` (`page`, `navigating`, `updated` — replacing legacy `$app/stores` in SvelteKit 2.12+), and form action results each represent distinct lifecycle states. Render loading/stale/empty/error explicitly. Progressive enhancement through `use:enhance` should preserve input, expose pending state, prevent duplicate submission, and handle rollback.

## Forms idiom

Svelte `bind:value` does not replace labels or validation timing. Native `+page.server.ts` form actions (`export const actions = { ... } satisfies Actions`) returning `fail(400, { values, errors })` plus `use:enhance` (or SvelteKit Superforms for typed multi-field forms; see `forms-validation.md`) provide a resilient baseline. Use correct `autocomplete`/`inputmode` attributes and preserve invalid input returned by server actions.

## Svelte 5 Runes, Attachments, and SvelteKit 2 idioms

- **Runes & Snippets**: use `$state`, `$derived` / `$derived.by`, `$effect`, `$props`, `$bindable`, and `{#snippet}` / `{@render children?.()}` instead of legacy `export let`, `$:`, and `<slot>`. Use standard DOM event attributes (`onclick={...}`, `onkeydown={...}`) rather than deprecated `on:click`.
- **Derived vs Effect**: compute derived values with `$derived(...)`—never `$effect(() => { derived = ... })`, which introduces extra render passes and feedback loops. Use `$effect` only for external DOM/observer/network synchronization with a cleanup return.
- **Performance & serialization**: use `$state.raw(...)` for large immutable arrays/objects (tables, GeoJSON, charts) that do not need deep proxy overhead, and `$state.snapshot(state)` before passing reactive state to `structuredClone`, Web Workers, `localStorage`, or third-party non-Svelte libraries.
- **Reactive collections & media**: use `svelte/reactivity` (`SvelteMap`, `SvelteSet`, `SvelteURLSearchParams`, `MediaQuery`) and `svelte/motion` (`prefersReducedMotion`) instead of manual store wrappers.
- **Attachments (`{@attach ...}`)**: in Svelte 5.29+, prefer `{@attach tooltip(opts)}` attachments over legacy `use:` actions—attachments run reactively inside an effect, return a cleanup function, and can be passed through component props via `createAttachmentKey()`.
- **SSR isolation for `.svelte.ts` modules**: create rune-backed state classes in `.svelte.ts`, instantiate them inside the root layout, and expose them via `setContext` / `getContext`—never export mutable module-level `$state` singletons in SvelteKit SSR, or user data will leak across concurrent requests.

```svelte
<script lang="ts">
  import { page } from '$app/state';
  import { prefersReducedMotion } from 'svelte/motion';
  import { MediaQuery } from 'svelte/reactivity';
  import type { Snippet } from 'svelte';
  import type { Attachment } from 'svelte/attachments';

  let { value = $bindable(''), children }: { value?: string; children?: Snippet } = $props();
  const fieldId = $props.id();
  const isCompact = new MediaQuery('(max-width: 40rem)');
  let trimmedLength = $derived(value.trim().length);

  const focusOnMount: Attachment<HTMLInputElement> = (node) => {
    if (!prefersReducedMotion.current) node.dataset.animated = 'true';
    return () => { delete node.dataset.animated; };
  };
</script>

<label for={fieldId}>Search ({page.url.pathname})</label>
<input id={fieldId} bind:value {@attach focusOnMount} data-compact={isCompact.current} />
{@render children?.()}
```

```ts
// src/routes/invoices/+page.server.ts
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
  create: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { message: 'Sign in required.' });
    const data = await request.formData();
    const batch = String(data.get('batch') ?? '').trim();
    if (!batch) return fail(400, { batch, error: 'Batch code is required.' });
    return { ok: true };
  }
} satisfies Actions;
```

## Do/don't pairs

| Do | Don't |
|---|---|
| `<a href="/invoice/42">View invoice</a>` | `<div onclick={() => goto('/invoice/42')}>View invoice</div>` (or deprecated `on:click`) |
| `export const actions = { create: async (...) => fail(400, { ... }) } satisfies Actions` | `export function actions(...)` (invalid SvelteKit export) or throwing raw 500s for validation |
| Instantiate `.svelte.ts` state per layout and share via `setContext`/`getContext` | Export mutable module-level `$state` in SvelteKit SSR (cross-request data leak) |
| Import `page`, `navigating`, `updated` from `$app/state` | Keep importing legacy `$app/stores` in new SvelteKit 2 code |
| `$props.id()` for `<label for>` + `aria-describedby` and `$state.snapshot()` for workers/APIs | Duplicate static IDs or passing raw `$state` proxies into `postMessage`/`structuredClone` |
| Stable keyed `{#each items as item (item.id)}` | Keyless list mutation causing focus/state reuse bugs |

## Known traps

Cross-request SSR leaks from module-level `$state` in `.svelte.ts`, writing `export function actions` instead of `export const actions = { ... }`, deep-proxying large datasets without `$state.raw`, passing `$state` proxies to `structuredClone` without `$state.snapshot`, mixing legacy `on:`/`$:`/`$app/stores` with Svelte 5 runes, keyed each-block focus reuse, treating compiler a11y warnings as full WCAG coverage.

## Verification commands

```sh
npm run check
npm run lint
npm run test -- --run
npm run build
npx playwright test
```

Use browser inspection for rendering/hydration evidence (`rendered`); `svelte-check` is `static` evidence only.
