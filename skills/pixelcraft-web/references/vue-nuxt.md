# Vue / Nuxt

## Token mapping

Import generated CSS variables globally or expose them through a typed theme/composable:

```ts
import '~/assets/tokens.css';
export const semantic = { action: 'var(--semantic-color-action)' };
```

In Nuxt, register global CSS in `nuxt.config` rather than importing it repeatedly in components.

## Layout and responsive idioms

Use single-file components to scope behavior, not to replace CSS architecture. Layouts in `app/layouts/` (Nuxt 4) or `layouts/` (Nuxt 3) handle shell persistence; pages handle route content. Prefer CSS grid/flex/logical properties and composables only for genuinely reactive layout state. Avoid teleporting chrome without considering focus and server rendering.

## Typography/custom fonts

Use **`@nuxt/fonts`** (automatic font metric fallbacks, self-hosting, subsetting) and **`@nuxt/image`** (`<NuxtImg>` / `<NuxtPicture>` with explicit dimensions and `preload` for LCP hero media) in Nuxt apps. In standalone Vue, configure font loading in `index.html`/Vite with explicit fallback stacks. Reactive font classes are rarely necessary; semantic CSS roles are cheaper.

## Motion/reduced motion

Use Vue `<Transition>`/`<TransitionGroup>` for meaningful enter/leave state, with CSS classes honoring reduced motion. Query `useMediaQuery('(prefers-reduced-motion: reduce)')` (VueUse) or client-guarded `matchMedia` for JS animation. Do not animate every list mutation by default.

## Accessibility specifics

Use native HTML inside components. `v-model` does not label inputs; explicit `label for`/`id` (use `useId()` in Vue 3.5+ for SSR-safe unique IDs) or wrapped labeling remains required. Manage focus after route changes, modal close, dynamic error insertion, and component removal. `<NuxtLink>` preserves anchor semantics; do not replace navigation with bare click handlers.

## States idiom

Use `useAsyncData`/`useFetch` status/error/refresh deliberately: initial loading, refresh loading, stale data, empty result, server error, retry. Keep optimistic mutation rollback explicit. For SSR-safe shared state across components, always use **Nuxt `useState('key', () => ...)`** or **Pinia** (registered per SSR app instance)—never export mutable module-level `ref()` singletons that leak between concurrent server requests. Use **`callOnce()`** for one-time SSR-to-client initialization (such as bootstrapping Pinia store data without double-running on hydration).

## Forms idiom

Use correct input attributes in templates; Vue attribute casing/hyphenation preserves native semantics. Validation libraries (VeeValidate, FormKit, or Nuxt UI `<UForm>` with Standard Schema) are optional—state timing and recovery matter more than schema existence. Preserve user input across failed submission and auth redirect.

## Vue 3.5 / 3.6 and Nuxt 4 idioms

- **Vue 3.5+**: prefer `defineModel()` for two-way component bindings, `useTemplateRef('inputEl')` for typed DOM refs, **reactive props destructuring** (`const { count = 0 } = defineProps<{ count?: number }>()`—remains reactive without `toRefs`), and **`onWatcherCleanup()`** inside `watch`/`watchEffect` to abort stale `fetch` requests or clear timers cleanly.
- **Vue 3.6 Vapor Mode**: for high-frequency, low-overhead leaf components or large lists on Vue 3.6+, Vapor Mode compiles `<script setup vapor>` directly to fine-grained DOM operations without VDOM diffing—opt in selectively for measured hot paths while keeping standard SFCs where VDOM slots/libraries are required.
- **Pinia & Nuxt UI v3/v4**: use **Pinia** (`defineStore` setup syntax) for structured multi-route client state; when using **Nuxt UI v3/v4** (built on Reka UI + Tailwind Variants), map semantic design tokens through `app.config.ts` and `@theme inline` rather than overriding internal classes.
- **Nuxt 4 architecture**: application source lives under `app/` (`app/pages`, `app/layouts`, `app/components`, `app/composables`, `app/app.vue`), universal utilities under `shared/`, and Nitro endpoints under `server/`. `useAsyncData` / `useFetch` `data` is a **`shallowRef`** by default—replace the value immutably or opt into `{ deep: true }` explicitly. Use **`.server.vue`** components (Server Components / Nuxt Islands) to keep heavy static renderers (Markdown, syntax highlighters, charts) off the client bundle.

```vue
<script setup lang="ts">
const { invoiceId } = defineProps<{ invoiceId: string }>();
const id = useId();
const note = defineModel<string>('note', { default: '' });

watch(
  () => invoiceId,
  (nextId, _prev, onCleanup) => {
    const controller = new AbortController();
    onCleanup(() => controller.abort());
    void fetchAuditLog(nextId, controller.signal);
  }
);
</script>
```

## Do/don't pairs

| Do | Don't |
|---|---|
| `<NuxtLink :to="`/invoice/${id}`">View invoice</NuxtLink>` | `<span @click="navigateTo(`/invoice/${id}`)">View invoice</span>` |
| `useState('filters', () => ({ ... }))` or Pinia store per request | Exporting a module-level `export const filters = ref(...)` in Nuxt SSR (cross-request state leak) |
| `await callOnce(() => store.bootstrap())` for SSR + hydration init | Running store bootstrap in setup without guarding against double execution |
| `const { status, error, refresh } = await useFetch(...)` rendered distinctly | Treating every non-success state as one spinner or mutating `shallowRef` fields in place |
| `<label :for="id">Search</label><input :id="id" v-model="q">` using `useId()` | Hardcoded duplicate IDs or `<input placeholder="Search">` without a label |
| `.server.vue` components for heavy read-only renderers | Shipping Markdown/syntax-highlighting libraries to the browser for static sections |

## Known traps

Cross-request SSR state leaks from module-level `ref()`, mutating Nuxt 4 `shallowRef` `useAsyncData` results in place, mixing Nuxt 3 root `layouts/` with Nuxt 4 `app/layouts/`, SSR hydration mismatch from browser-only state, teleport focus traps, uncancelled watchers causing race conditions, auto-import magic hiding ownership.

## Verification commands

```sh
npm run lint
npm run test -- --run
npm run build
npx playwright test
```

Run `npx nuxi analyze` interactively when inspecting client/server chunk sizes (`static`). Browser rendering and keyboard/screen-reader inspection remain required for visual/a11y claims (`rendered`).
