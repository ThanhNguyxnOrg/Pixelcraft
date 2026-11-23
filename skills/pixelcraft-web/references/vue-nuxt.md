# Vue / Nuxt

## Token mapping

Import generated CSS variables globally or expose them through a typed theme/composable:

```ts
import '~/assets/tokens.css';
export const semantic = { action: 'var(--semantic-color-action)' };
```

In Nuxt, register global CSS in `nuxt.config` rather than importing it repeatedly in components.

## Layout and responsive idioms

Use single-file components to scope behavior, not to replace CSS architecture. Layouts in `layouts/` handle shell persistence; pages handle route content. Prefer CSS grid/flex/logical properties and composables only for genuinely reactive layout state. Avoid teleporting chrome without considering focus and server rendering.

## Typography/custom fonts

Put font loading in app/head configuration or module-supported font tooling. Use fallback stacks/subsets and verify SSR/client consistency. Reactive font classes are rarely necessary; semantic CSS roles are cheaper.

## Motion/reduced motion

Use Vue `<Transition>`/`<TransitionGroup>` for meaningful enter/leave state, with CSS classes honoring reduced motion. Query `useMediaQuery('(prefers-reduced-motion: reduce)')` or raw `matchMedia` for JS animation. Do not animate every list mutation by default.

## Accessibility specifics

Use native HTML inside components. `v-model` does not label inputs; explicit `label for`/`id` or wrapped labeling remains required. Manage focus after route changes, modal close, dynamic error insertion, and component removal. Nuxt Link preserves anchor semantics; do not replace navigation with bare click handlers.

## States idiom

Use `useAsyncData`/`useFetch` status/error/refresh deliberately: initial loading, refresh loading, stale data, empty result, server error, retry. Keep optimistic mutation rollback explicit. Suspense/island boundaries must preserve layout dimensions and screen-reader status behavior.

## Forms idiom

Use correct input attributes in templates; Vue attribute casing/hyphenation preserves native semantics. Validation libraries are optional—state timing and recovery matter more than schema existence. Preserve user input across failed submission and auth redirect.

## Do/don't pairs

| Do | Don't |
|---|---|
| `<NuxtLink :to="`/invoice/${id}`">View invoice</NuxtLink>` | `<span @click="navigateTo(`/invoice/${id}`)">View invoice</span>` |
| `const { status, error, refresh } = await useFetch(...)` rendered distinctly | treating every non-success state as one spinner |
| `<label for="q">Search inventory</label><input id="q" v-model="q">` | `<input v-model="q" placeholder="Search inventory">` without label |
| `defineEmits`/`v-model` with explicit state ownership | hidden two-way mutation through deeply nested props |
| scoped component CSS plus global semantic tokens | global `*` resets or deep selectors that break child component internals |

## Known traps

SSR hydration mismatch from browser-only state, double-fetching client/server, teleport focus traps, transition layout shift, stale composable singleton state across requests, accidental shared state on server, shallow route param watching, auto-import magic hiding ownership.

## Verification commands

```sh
npm run lint
npm run test -- --run
npm run build
npx playwright test
npx nuxi analyze 2>/dev/null || true
```

Browser rendering and keyboard/screen-reader inspection remain required for visual/a11y claims.
