# Solid / SolidStart

## Token mapping

Import generated CSS variables once at entry/root and consume semantic roles in CSS or style props:

```ts
import './tokens.css';
```

Fine-grained reactivity does not require fine-grained token duplication. Use typed constants only for names/roles, not copied raw colors.

## Layout and responsive idioms

Use CSS-first layout. `<Show>`, `<For>`, `<Index>`, `<Switch>`/`<Match>`, `<ErrorBoundary>`, and `<Suspense>` control state rendering; they do not design layout. Solid's lack of VDOM means components run once and DOM bindings update at fine-grained signal level—never destructure `props` at the top of a component, or reactivity silently breaks. Use **`splitProps`** and **`mergeProps`** when forwarding or defaulting props.

## Typography/custom fonts

Load fonts in HTML entry/root route (`src/entry-server.tsx` in SolidStart) with explicit fallback behavior. Keep text as real DOM text; do not replace typography with canvas or SVG except for genuinely graphical content.

## Motion/reduced motion

Use CSS transitions/animations where possible. JS animation should be created inside lifecycle-aware code (`onMount`/`createEffect`) with cleanup in `onCleanup`, honoring `matchMedia('(prefers-reduced-motion: reduce)')`. Derive values with **`createMemo`** rather than mirroring signals via `createEffect`.

## Accessibility specifics

Use native elements or Solid-native headless primitives (**Kobalte**, **Corvu**, **Ark UI**; see `component-systems.md`). Use `createUniqueId()` for SSR-safe `<label for>` and `aria-describedby` IDs. Choose **`<For>`** for arrays of objects with stable reference identity (rows/cards that reorder) and **`<Index>`** for arrays of primitives or editable input values (keyed by index, passing an accessor `item()` so typing does not recreate the `<input>` and drop focus).

## States idiom & SolidStart 1.x

Use `<ErrorBoundary fallback={(err, reset) => ...}>` around `<Suspense>` so rejected async queries render recoverable errors instead of crashing the route. In **SolidStart 1.x** (`@solidjs/router` + Vinxi):

- Define cached read loaders with **`query(async (...) => { 'use server'; ... }, 'key')`** and consume them with **`createAsync(() => getInvoices())`** (preloaded via route `preload`).
- Define progressive mutations with **`action(async (formData: FormData) => { 'use server'; ... }, 'key')`**, attach directly to `<form action={saveInvoice} method="post">`, and inspect pending/error/optimistic state with **`useSubmission(saveInvoice)`** (or `useSubmissions` for concurrent item actions).
- Isolate browser-only widgets (WebGL canvases, rich editors) with **`clientOnly(() => import('./CanvasEditor'))`** from `@solidjs/start` so server rendering never imports browser globals.

```tsx
import { query, action, createAsync, useSubmission } from '@solidjs/router';
import { ErrorBoundary, For, Show, Suspense, createMemo, mergeProps, splitProps } from 'solid-js';

const getInvoices = query(async () => {
  'use server';
  return db.invoices.list();
}, 'invoices');

const archiveInvoice = action(async (formData: FormData) => {
  'use server';
  const id = String(formData.get('id') ?? '');
  if (!id) return { error: 'Missing invoice ID.' };
  await db.invoices.archive(id);
  return { ok: true };
}, 'archive-invoice');

export function InvoicePanel(rawProps: { filter?: string; class?: string }) {
  const merged = mergeProps({ filter: '' }, rawProps);
  const [local, rest] = splitProps(merged, ['filter']);
  const invoices = createAsync(() => getInvoices());
  const submission = useSubmission(archiveInvoice);
  const visible = createMemo(() =>
    (invoices() ?? []).filter((inv) => inv.code.includes(local.filter))
  );

  return (
    <section {...rest}>
      <ErrorBoundary fallback={(err, reset) => <button onClick={reset}>Retry: {err.message}</button>}>
        <Suspense fallback={<p role="status" aria-busy="true">Loading invoices…</p>}>
          <Show when={visible().length > 0} fallback={<p>No matching invoices.</p>}>
            <For each={visible()}>
              {(inv) => (
                <form action={archiveInvoice} method="post">
                  <input type="hidden" name="id" value={inv.id} />
                  <button type="submit" disabled={submission.pending}>Archive {inv.code}</button>
                </form>
              )}
            </For>
          </Show>
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
```

## Forms idiom

Use native `<form action={myAction} method="post">` in SolidStart or Modular Forms (`@modular-forms/solid`) for complex client/server validation (`forms-validation.md`). Solid accepts standard HTML `for` on `<label>` (producing real label association). Preserve user input on failed server validation and expose `submission.error` / returned validation data next to the control.

## Do/don't pairs

| Do | Don't |
|---|---|
| `<A href="/invoice/42">View invoice</A>` | Click-only `<div>` navigation |
| `splitProps`/`mergeProps` and `props.title` access inside JSX/memos | `function Card({ title })` destructuring that kills reactivity |
| `<For>` for object lists; `<Index>` for primitive/editable input lists | `<For>` over primitive strings inside `<input>` (recreates DOM and loses focus on every keystroke) |
| `createMemo` for derived values; `query`/`createAsync` + `action`/`useSubmission` in SolidStart | Mirroring derived state in `createEffect` or manual `onMount` fetch waterfalls |
| `clientOnly(() => import(...))` for browser-only modules and `onCleanup` for listeners | Importing `window`-dependent canvases directly in SSR routes or leaking listeners |

## Known traps

Destructuring `props` and silently losing reactivity, using `<For>` on primitive input arrays (dropping focus), missing `<ErrorBoundary>` around `<Suspense>`/`createAsync`, browser-only imports crashing SolidStart SSR without `clientOnly()`, overusing `createEffect` where `createMemo` belongs, forgetting `'use server'` inside `query`/`action` handlers.

## Verification commands

```sh
npm run lint
npm run test -- --run
npm run build
npx playwright test
```

Rendered browser inspection is required for hierarchy, focus, hydration, and motion evidence (`rendered`); builds and typechecks are `static`.
