# React / Next.js

## Token mapping

Import generated CSS variables at the app/root layout layer or map them into a typed theme object consumed by components:

```ts
import './tokens.css';
const theme = { action: 'var(--semantic-color-action)' };
```

Do not duplicate hex values in component props when CSS variables already represent the semantic role. Server/client component boundaries must not turn token constants into unnecessary client bundles.

## Layout and responsive idioms

Use semantic HTML/CSS layout before component abstractions. In Next.js, keep static/content-heavy sections server-rendered and isolate client interactivity. Use route segments/layouts for shared structure; do not recreate shell chrome per page. Streaming/suspense boundaries should preserve stable layout rather than replacing the entire viewport with spinners.

## Typography/custom fonts

Use `next/font` where applicable, configure subsets/fallbacks/display behavior deliberately, and cover required scripts. React Native-style fixed pixel assumptions do not belong here; text must zoom/reflow in the browser.

## Motion/reduced motion

CSS handles simple transitions. Never read `window.matchMedia` synchronously at module scope or render time in SSR/RSC apps—subscribe inside `useSyncExternalStore` (with a safe server snapshot) or `useEffect` in a `'use client'` component:

```ts
'use client';
import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(QUERY);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(QUERY).matches,
    () => false // SSR snapshot
  );
}
```

Clean up listeners, observers, and animation frames in effects or ref cleanup callbacks.

## Accessibility specifics

React does not create semantics for you. Use real controls, label association with `htmlFor`/`id` (use `useId()` for reusable components so SSR and client IDs match), and manage focus after route transitions, dialog close, deletion, and error summary display. Framework `<Link>` renders an anchor; do not use click handlers for navigation without `href` semantics. Hydration must not leave visible controls inert.

## States idiom

Check the installed React/Next.js versions and router before using these examples. Server Actions and route-segment conventions here assume a compatible App Router; preserve existing Pages Router or client mutation patterns when a migration is out of scope.

Use route-level `loading`/`error`/`not-found` plus component-level state deliberately; they are not substitutes for empty/partial/offline/optimistic states. Server Actions need pending indication, duplicate-submit protection, validation error return shape, input preservation, rollback semantics, and **explicit server-side authentication + authorization checks inside every action** (Server Actions are public HTTP endpoints—never assume UI gating or route middleware alone protects them).

## Forms idiom

Use `<form action>` progressive enhancement where feasible. Correct `autocomplete`/`inputMode` are preserved in JSX capitalization (`autoComplete`, `inputMode`). `useFormStatus` is imported from `'react-dom'` and **must be called in a child component rendered inside `<form>`** (calling it in the same component that renders `<form>` always returns `pending: false`). Return field errors as data and associate them accessibly; preserve input on failed server validation.

## Modern React 19 / 19.2 idioms

- **Refs & cleanup**: pass `ref` directly as a regular prop (no `forwardRef` boilerplate) and return a cleanup function from callback refs (`ref={(node) => { ...; return () => cleanup(); }}`).
- **Async & mutations**: read promises/context conditionally with `use()`, pair `<form action>` with `useActionState` and `useOptimistic` (`state-architecture.md`), and keep render functions pure so **React Compiler** auto-memoizes safely without manual `useMemo`/`useCallback` clutter.
- **React 19.2 primitives**: use `<Activity mode={open ? 'visible' : 'hidden'}>` to preserve UI/form state in hidden tabs/panels without paying full active render cost, `useEffectEvent` to read latest props/callbacks inside `useEffect` without restarting subscriptions, and `<ViewTransition>` (where supported by the React release channel) for semantic state/route transitions gated by reduced-motion preferences.

## Next.js 15 / 16 idioms

- **Async request APIs**: `params`, `searchParams`, `cookies()`, and `headers()` are asynchronous (`const { id } = await params`).
- **Explicit caching (`'use cache'`)**: do not assume implicit `fetch` caching. Opt into Cache Components / `'use cache'` with `cacheLife('hours')` and `cacheTag('invoices')`, and invalidate cleanly with `updateTag(...)` (immediate read-your-own-writes in Server Actions) or `revalidateTag(...)`.
- **Built-in flows & error boundaries**: use `next/form` (`<Form action="/search">`) for progressively enhanced GET navigation forms, `after(() => ...)` for non-blocking post-response logging/analytics, and `unauthorized()` / `forbidden()` paired with `unauthorized.tsx` / `forbidden.tsx` where enabled.
- **Request boundary**: in Next.js 16+, prefer `proxy.ts` (replacing `middleware.ts` naming) for lightweight request routing/header rewrites—and still verify auth/permissions inside Server Components, Route Handlers, and Server Actions.

## React Router v7 (framework mode)

For Vite-native full-stack React with web-standard `Request`/`Response` semantics, configure explicit routes in `app/routes.ts` and import generated `./+types/<route>` (`Route.LoaderArgs`, `Route.ActionArgs`, `Route.ComponentProps`):

```tsx
// app/routes/invoice.tsx
import type { Route } from './+types/invoice';
import { Form, useNavigation } from 'react-router';

export async function loader({ params, request }: Route.LoaderArgs) {
  return loadInvoice(params.id, request);
}

// Optional client-side cache/offline layer; pair with HydrateFallback for SPA/client loads
export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  return serverLoader();
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  return updateInvoice(params.id, formData);
}

export function HydrateFallback() {
  return <div role="status" aria-busy="true">Loading invoice…</div>;
}

export default function InvoiceRoute({ loaderData, actionData }: Route.ComponentProps) {
  const busy = useNavigation().state === 'submitting';
  return (
    <Form method="post">
      <button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
      {actionData?.error && <p role="alert">{actionData.error}</p>}
    </Form>
  );
}
```

Use `clientAction` when optimistic client caches must update before or alongside server mutations.

## TanStack Router & TanStack Start

For end-to-end type-safe search params, nested loaders, and full-stack RPC server functions on Vite, validate URL state with `validateSearch`, guard auth/preload data in `beforeLoad`, and enforce validation + auth middleware on `createServerFn`:

```tsx
import { createFileRoute, redirect } from '@tanstack/react-router';
import { createMiddleware, createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const authMiddleware = createMiddleware({ type: 'function' }).server(async ({ next }) => {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return next({ context: { userId: session.userId } });
});

const updateStatus = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(z.object({ id: z.string(), status: z.enum(['draft', 'sent']) }))
  .handler(async ({ data, context }) => saveInvoiceStatus(context.userId, data));

export const Route = createFileRoute('/invoices')({
  validateSearch: z.object({ page: z.number().int().min(1).catch(1), q: z.string().catch('') }),
  beforeLoad: ({ context }) => {
    if (!context.session) throw redirect({ to: '/login' });
  },
  loaderDeps: ({ search }) => ({ page: search.page, q: search.q }),
  loader: ({ deps }) => fetchInvoices(deps),
});
```

## Do/don't pairs

| Do | Don't |
|---|---|
| `<Link href="/invoices/42">View invoice</Link>` | `<div onClick={() => router.push('/invoices/42')}>View invoice</div>` |
| Call `useFormStatus()` from `'react-dom'` inside a `<SubmitButton />` child of `<form>` | Call `useFormStatus()` in the same component that renders `<form>` (stays `pending: false`) |
| Check session & resource ownership inside every Server Action / `createServerFn` | Rely on UI hiding or `middleware.ts`/`proxy.ts` alone to secure mutations |
| Guard `window.matchMedia` in `useSyncExternalStore` (with server snapshot) or `useEffect` | Call `window.matchMedia(...)` unconditionally during render (crashes SSR) |
| Narrow `'use client'` leaf (`<QtyStepper sku={sku} />`) inside a Server Component | Convert the whole route to `'use client'` for one interactive control |
| Validate URL search params (`validateSearch` / `searchParams`) for filter/page/share state | Store shareable view state only in ephemeral component memory |

## Known traps

Server/client serialization boundaries, unauthenticated Server Actions, calling `useFormStatus` outside a `<form>` child, unguarded `window` reads in SSR, stale closure state, effect-driven data fetching waterfalls, hydration mismatch from locale/date/random values, focus loss after route change, cache tag omission, suspense fallback layout shift.

## Verification commands

```sh
npm run lint
npm run test -- --run
npm run build
npx playwright test
```

Use the actual package manager/scripts. Inspect browser rendering and hydration timing in a real browser (`rendered`); typechecks and builds provide `static` evidence only.
