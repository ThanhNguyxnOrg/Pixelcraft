# State management and frontend data architecture

Do not put every piece of application state into one global store. Classify state by **ownership, lifetime, shareability, and failure mode**, then choose the smallest tool that fits each layer.

## Five-layer state classification

| Layer | Examples | Primary tools | Anti-pattern to avoid |
|---|---|---|---|
| **Local UI state** | Open popover, hover index, accordion, ephemeral draft | Framework state (`useState`, signals, runes) | Lifting transient widget state into a global store |
| **URL / navigation state** | Active filters, sort, pagination, selected tab/item, modal deep-link | `nuqs` (v2), TanStack Router search params, native `URLSearchParams` | Storing shareable filter/tab state only in memory so reload resets it |
| **Server / async cache state** | REST/RPC/GraphQL entities, pagination, background refetch, mutations | TanStack Query (v5), **TanStack DB**, SWR, RTK Query; typed RPC: **tRPC v11**, **oRPC**, **Hono RPC (`hc`)**; GraphQL: Apollo Client, Relay, urql | Copying fetched API payloads into Redux/Zustand/Pinia and manually managing loading/stale flags |
| **Cross-tree client & workflow state** | Active tool, workspace panels, multi-step checkout, upload/retry machines | React: Zustand v5, Jotai, Redux Toolkit, Legend-State, TanStack Store; Vue: **Pinia**; Angular: **NgRx SignalStore**; workflows: **XState v5**, RxJS | Tangled boolean flags (`isLoading && !isError && isRetrying`) allowing impossible states |
| **Local persistent / offline state** | Drafts, offline queues, large client datasets, user prefs | Dexie.js (`IndexedDB`), **`idb` / `idb-keyval`** (tiny Promise wrappers over IndexedDB), OPFS (blobs), `localStorage` (small prefs) | Storing megabytes or structured queryable records in synchronous `localStorage` or unmaintained `localForage` |

## Server-state, typed RPC, and GraphQL clients

- **React 19 native action hooks (`useActionState`, `useOptimistic`)**: use for component-scoped mutation lifecycles and transient optimistic UI overrides during form/action submission. They have **no global cache, deduplication, or background refetching**—they complement rather than replace TanStack Query (server cache) or Zustand (cross-tree client UI store).
- **REST & typed RPC**: use **TanStack Query v5** (React/Vue/Solid/Svelte/Angular) for structured caching, stale-while-revalidate, dependent queries, and optimistic mutations; pair with **tRPC v11** (native `queryOptions` / `mutationOptions` integration with TanStack Query), **oRPC** (OpenAPI-first Standard Schema typed RPC), or **Hono RPC (`hc<AppType>`)** for end-to-end TypeScript safety without codegen. Use **TanStack DB** when you need reactive client-side normalized collections, live cross-collection joins, and instant optimistic mutations backed by TanStack Query or sync engines (`local-first-sync.md`).
- **GraphQL**: use **Apollo Client** for normalized cache + local reactive variables; **Relay** when strict fragment colocation and compiler-enforced data masking justify the build step; **urql** for lightweight extensible document/graph caching.
- **Optimistic mutation contract**: always `cancelQueries` before mutating cache so in-flight refetches cannot overwrite optimistic data, snapshot previous data for `onError` rollback, and `invalidateQueries` in `onSettled`:

```ts
// TanStack Query v5 optimistic update with rollback
const mutation = useMutation({
  mutationFn: updateItem,
  onMutate: async (nextItem) => {
    await queryClient.cancelQueries({ queryKey: ['items'] });
    const previous = queryClient.getQueryData<Item[]>(['items']);
    queryClient.setQueryData<Item[]>(['items'], (old = []) => [...old, nextItem]);
    return { previous };
  },
  onError: (_err, _vars, ctx) => {
    queryClient.setQueryData(['items'], ctx?.previous);
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
});
```

## Client UI state and SSR isolation

- **React**: **Zustand v5** (select narrow slices with `useShallow` or primitive selectors), **Jotai** (atomic bottom-up derived graphs), **Redux Toolkit** (strict action logs/middleware), **Legend-State** (fine-grained signal-like observable state with optional sync persistence), **TanStack Store** (framework-agnostic minimal reactive store), or MobX/Valtio.
- **Vue / Nuxt**: **Pinia** (`defineStore('filters', () => { ... })` setup stores) registered per SSR app instance; pair with Nuxt `useState()` for simple request-scoped primitives (`vue-nuxt.md`).
- **Angular**: **NgRx SignalStore (`@ngrx/signals`)** (`signalStore(withState, withComputed, withMethods)`) for modular signal-first feature state (`angular.md`).
- **Svelte 5**: rune classes in `.svelte.ts` instantiated in root layout and shared via `setContext`/`getContext` (`svelte.md`).
- **SSR / Next.js critical rule**: never share a module-level singleton store across concurrent server requests, and never read/write client stores from React Server Components. Instantiate stores per-request via a client Context provider (`createStore` from `zustand/vanilla` initialized inside `useState(() => createAppStore())`).

## Complex workflows (XState v5) and RxJS

- Use **XState v5** when a flow has explicit finite states, guards, cancellation, retries, or parallel regions. Use `setup({ types, actors: { ...: fromPromise(...) } }).createMachine(...)` (not v4's two-argument `createMachine`) and read snapshots in React with `useSelector(actorRef, selector)` + `actorRef.send(event)`.
- Use **RxJS** only when composing complex asynchronous event streams (cancellation via `switchMap`, backpressure, WebSocket multiplexing) where simple promises/effects become race-prone.

## URL-as-State (`nuqs` v2 / typed router params) & network race cancellation

- **URL-as-State completeness**: serialize search queries (`?q=`), active filters, sort column/direction (`?sort=created_at:desc`), pagination/cursor, active tab, and shareable inspector/drawer IDs (`?invoice=inv_1042`) into URL query/path so page reload, browser Back/Forward, and shared links reproduce the exact view without trapped memory state.
- Wrap App Router / SPA roots in the matching `<NuqsAdapter>` and choose `history: 'replace'` (throttled) for high-frequency typing/sliders vs `history: 'push'` for discrete facet, tab, pagination, or drawer navigation steps.
- **Query cancellation (`AbortController`)**: forward TanStack Query's `signal` (`queryFn: ({ signal }) => fetch(url, { signal })`) or an explicit `AbortController` on rapid search/filter/tenant transitions so a slow 800 ms response for an earlier filter never overwrites a fast 90 ms response for the latest filter.

```tsx
const [view, setView] = useQueryStates(
  {
    q: parseAsString.withDefault(''),
    sort: parseAsStringLiteral(['newest', 'amount'] as const).withDefault('newest'),
    page: parseAsInteger.withDefault(1),
    drawerId: parseAsString,
  },
  { history: 'replace' }
);
```

## Multi-tab auth & tenant synchronization (`BroadcastChannel` + `storage`)

Users routinely keep 5–10 SaaS tabs open. If Tab B signs out, refreshes tokens, or switches active workspace/organization (`org_acme` → `org_globex`), background Tab A must react immediately—otherwise Tab A will display stale UI or fire mutations into the wrong tenant:

- Scope every server-cache key by tenant (`['org', activeOrgId, 'projects', filters]`) rather than global `['projects']`.
- Broadcast `SIGN_OUT`, `SESSION_REFRESHED`, and `ORG_CHANGED` over `BroadcastChannel` (with `window.addEventListener('storage', ...)` fallback where needed) so sibling tabs clear/re-scope caches immediately or prompt before overwriting unsaved drafts:

```ts
type AuthSyncMessage =
  | { type: 'SIGN_OUT' }
  | { type: 'ORG_CHANGED'; orgId: string };

export function connectMultiTabSync(onEvent: (msg: AuthSyncMessage) => void) {
  if (typeof BroadcastChannel === 'undefined') return () => {};
  const channel = new BroadcastChannel('app:auth-tenant-sync');
  channel.onmessage = (e: MessageEvent<AuthSyncMessage>) => onEvent(e.data);
  return {
    post: (msg: AuthSyncMessage) => channel.postMessage(msg),
    close: () => channel.close(),
  };
}
```

## Local persistence (Dexie / `idb` / `idb-keyval`)

- Use **IndexedDB** via **Dexie.js** (`useLiveQuery` in React) for structured queryable offline datasets and multi-megabyte caches, or **`idb` / `idb-keyval`** for lightweight typed Promise key-value storage (avoid unmaintained `localForage`). Reserve `localStorage` for tiny non-sensitive preferences (`< 50 KB`) and never store auth secrets there.
- In Dexie `.stores()`, declare **only indexed columns** (non-indexed fields are still stored automatically). **Never modify a shipped `db.version(N)` block that has an `.upgrade(tx => ...)` callback**—always append `db.version(N + 1)` for schema migrations.

## Do/don't pairs

| Do | Don't |
|---|---|
| Keep API entities in TanStack Query / tRPC v11 / oRPC / Apollo (keyed by `orgId` + `signal`) and UI toggles in Zustand / Pinia / SignalStore | Mirror fetched server data into a global store or omit `AbortSignal` on rapid filter fetches |
| Instantiate Zustand / Svelte rune / Pinia stores per request in SSR frameworks | Export a global singleton store mutated during SSR requests |
| Propagate sign-out and workspace/tenant switches across tabs via `BroadcastChannel` | Let background tabs stay logged in after sign-out or write mutations to a stale tenant |
| Use XState v5 `setup().createMachine()` + `useSelector` for multi-step retry/cancel flows | Stack 6 booleans (`loading`, `retrying`, `failed`, `cancelled`) that allow invalid states |
| Serialize search, filters, sort, pagination, tabs, and shareable drawer IDs in the URL (`useQueryStates`) | Store filter/drawer state only in memory or serialize sensitive tokens into `window.location.search` |
| Use Dexie (append `db.version(N + 1)` for migrations) or `idb`/`idb-keyval` for offline storage | Add unmaintained `localForage`, edit shipped Dexie `.version(N)` upgrades, or stuff MBs into `localStorage` |
