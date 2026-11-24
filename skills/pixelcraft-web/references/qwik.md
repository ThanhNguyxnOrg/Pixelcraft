# Qwik

## Token mapping

Import generated CSS variables in global/root styling and consume semantic variables in component CSS. Qwik's resumability favors small serialized state; keep token names static rather than generating dynamic unbounded style objects per interaction.

## Layout and responsive idioms

Use standard HTML/CSS first. Qwik components should remain small and lazily resumable; visual composition does not require hydration. Route layouts in Qwik City own persistent shell structure. Avoid putting large nonserializable objects into component state/props.

## Typography/custom fonts

Load fonts in document head/root layout with subset/fallback policy. Resumable HTML means typography can render before JS; preserve that advantage rather than delaying text behind client bootstrap.

## Motion/reduced motion

Use CSS where possible. Event handlers are lazy-loaded in Qwik, so motion tied to interaction can remain local through `$` handlers. Honor `prefers-reduced-motion`; reserve `useVisibleTask$` strictly for unavoidable browser-only DOM/observer setup (canvas, third-party widgets) because it eagerly loads JS when scrolled into view and undercuts resumability.

## Accessibility specifics

Resumability is not accessibility by itself. Initial HTML needs correct semantics, labels, landmarks, and focus order. Use `useId()` for SSR-safe `<label for>` and `aria-describedby` wiring. Manage focus after lazy interaction, route transition, deletion, and dialog close. Anchor/button distinction remains mandatory.

## States idiom

Use `routeLoader$`, `routeAction$`, `server$`, `useResource$` + `<Resource>`, and explicit pending/error/empty branches. Because Qwik serializes state into HTML, avoid secrets/nonserializable values (wrap unavoidable non-serializable handles with `noSerialize(...)`) and preserve input/error state across action failure.

## Qwik 1.x vs Qwik 2.0 and task/resource idioms

Check `package.json` for the installed major before writing imports: **Qwik 2.0** moves core packages to **`@qwik.dev/core`** and **`@qwik.dev/router`** (replacing `@builder.io/qwik` and `@builder.io/qwik-city`).

- **`useTask$` vs `useVisibleTask$`**: default to **`useTask$`** for reactive state derivation and async work (runs during SSR and resumes on the client only when tracked signals change). Use **`useVisibleTask$`** only as a browser-only escape hatch (e.g., attaching ResizeObserver/canvas/chart instances) and return a cleanup function via `cleanup(() => ...)`.
- **`useResource$` + `<Resource>`**: use for streamed/reactive async data with explicit `onPending`, `onRejected`, and `onResolved` states.
- **`server$`**: define typed server-only RPC functions callable from event handlers without exposing server secrets or database code to the browser bundle.

```tsx
import { component$, Resource, useResource$, useSignal, useTask$ } from '@qwik.dev/core';
import { server$ } from '@qwik.dev/router';

const searchInvoices = server$(async (query: string) => db.invoices.search(query));

export const InvoiceSearch = component$(() => {
  const query = useSignal('');
  const debounced = useSignal('');

  useTask$(({ track, cleanup }) => {
    const next = track(() => query.value);
    const id = setTimeout(() => { debounced.value = next; }, 200);
    cleanup(() => clearTimeout(id));
  });

  const results = useResource$<Invoice[]>(({ track }) => {
    const q = track(() => debounced.value);
    return searchInvoices(q);
  });

  return (
    <Resource
      value={results}
      onPending={() => <p role="status" aria-busy="true">Searching…</p>}
      onRejected={(err) => <p role="alert">Search failed: {err.message}</p>}
      onResolved={(items) => (items.length ? <ul>{items.map((i) => <li key={i.id}>{i.number}</li>)}</ul> : <p>No matches.</p>)}
    />
  );
});
```

## Forms idiom

Qwik Router `routeAction$` + `<Form>` (or Modular Forms `@modular-forms/qwik`; see `forms-validation.md`) progressively enhance forms. Use native labels/types/autocomplete/inputmode and return field errors without discarding values. Avoid converting every input into eager client-controlled state when native form semantics suffice.

## Do/don't pairs

| Do | Don't |
|---|---|
| `<Link href="/invoice/42">View invoice</Link>` | Click-only `<div>` calling navigation |
| `useTask$` for reactive state and `useResource$` + `<Resource>` for async UI states | Reaching for `useVisibleTask$` for data fetching (breaks resumability and delays SSR) |
| `server$` / `routeAction$` with serializable error shapes | Storing class instances, functions, or secrets directly in `useStore`/`useSignal` |
| Match imports to installed major (`@qwik.dev/core` + `@qwik.dev/router` in v2) | Mixing v1 `@builder.io/qwik-city` and v2 `@qwik.dev/router` imports |
| Stable static layout before interaction | Blank shell waiting for lazy behavior that content does not need |

## Known traps

Serialization boundary violations (missing `noSerialize` on DOM/library handles), overusing `useVisibleTask$` and throwing away resumability, leaking server-only code outside `server$`/`routeLoader$`, lazy focus management gaps, stale route data, CSS duplication across lazy chunks.

## Verification commands

```sh
npm run lint
npm run test -- --run
npm run build
npx playwright test
```

Inspect initial HTML before JS (`static` / no-JS `rendered`) as well as post-interaction browser state (`rendered`); both are distinct evidence.
