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

CSS handles simple transitions. For JS animation libraries, initialize only in client components and honor:

```ts
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

Cleanup listeners/animation frames in effects.

## Accessibility specifics

React does not create semantics for you. Use real controls, label association with `htmlFor`/`id`, and manage focus after route transitions, dialog close, deletion, and error summary display. Next Link remains an anchor; do not use click handlers for navigation without href semantics. Hydration must not leave visible controls inert.

## States idiom

Use route-level `loading`/`error`/`not-found` plus component-level state deliberately; they are not substitutes for empty/partial/offline/optimistic states. Server Actions need pending indication, duplicate-submit protection, validation error return shape, input preservation, and rollback semantics. Cache freshness/revalidation must be visible when user decisions depend on stale data.

## Forms idiom

Use `<form action>` progressive enhancement where feasible. Correct `autocomplete`/`inputMode` are preserved in JSX capitalization (`autoComplete`, `inputMode`). Return field errors as data and associate them accessibly; do not rely on browser alert/toast alone. Preserve input on failed server validation.

## Do/don't pairs

| Do | Don't |
|---|---|
| `<Link href="/invoices/42">View invoice</Link>` | `<div onClick={() => router.push('/invoices/42')}>View invoice</div>` |
| `useFormStatus().pending` to disable repeated submit and expose pending state | pretending submission is instant or allowing duplicate mutations |
| narrow client component `<QtyStepper sku={sku} />` inside server page | converting the whole route to `'use client'` for one control |
| `router.back()`/history-aware close semantics where appropriate | always routing users home after modal/drawer close |
| preserve search params for filter/page/share state | storing shareable view state only in ephemeral component memory |

## Known traps

Server/client serialization boundaries, stale closure state, effect-driven data fetching waterfalls, hydration mismatch from locale/date/random values, focus loss after route change, cache surprises, suspense fallback layout shift, controlled input cursor loss, accidental client-only accessibility gaps.

## Verification commands

```sh
npm run lint
npm run test -- --run
npm run build
npx playwright test
npx next build --debug 2>/dev/null || true
```

Use the actual package manager/scripts. Inspect browser rendering and hydration timing when interaction quality matters.
