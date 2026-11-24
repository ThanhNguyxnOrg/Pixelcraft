# Lightweight & edge-first stacks: Preact, Deno Fresh 2, Hono JSX/RPC, RedwoodSDK, Waku

Choose a lightweight or edge-first web stack when bundle weight, cold-start latency, or Web Standards (`Request`/`Response`) portability outweigh the full Next.js/Nuxt ecosystem.

## Stack decision matrix

| Stack | Runtime / Model | Client JS footprint | Best fit | Primary watch-out |
|---|---|---|---|---|
| **Preact + `@preact/signals`** | ~4 KB React-like VDOM + fine-grained signals | Tiny (~4–6 KB gzipped) | Embedded widgets, low-bandwidth SPAs, islands inside Astro/Fresh | Importing full React libraries via `preact/compat` can silently bloat bundles |
| **Deno Fresh 2.0** | Zero-JS-by-default SSR + selective Preact `islands/` on Deno/Vite | 0 KB on static/SSR pages; island-only JS | Edge-rendered Deno apps needing standard HTTP handlers + isolated interactive islands | Only JSON-serializable props cross into `islands/`; avoid hydrating whole layouts |
| **Hono JSX + Hono RPC (`hc`)** | Ultra-fast Web Standards router + server JSX + optional `hono/jsx/dom` client islands | 0 KB (server JSX) or tiny client island | Cloudflare Workers / Bun / Deno / Node full-stack apps wanting end-to-end typed RPC | `hono/jsx` is not React—do not copy React-specific hooks/libraries blindly |
| **RedwoodSDK** | Cloudflare Workers-native React Server Components + explicit routing + Server Functions | RSC payload + client leaves only | Edge-first React 19 apps tightly integrated with Workers/D1/Durable Objects | Explicit request/response & RSC boundary ownership; no magic file-router defaults |
| **Waku** | Minimal Vite-based React Server Components framework | RSC payload + client leaves only | Teams wanting React 19 RSC + Vite without Next.js framework coupling | Smaller plugin ecosystem than Next.js; verify deployment adapter early |

## Token mapping

Import generated CSS variables once in the root HTML shell (`<link rel="stylesheet" href="/tokens.css" />` or Vite CSS entry). Keep semantic variables in CSS rather than passing raw hex strings across island or RSC serialization boundaries.

## Preact + `@preact/signals` idioms

- Use **`@preact/signals`** (`signal`, `computed`, `effect`, `useSignal`, `useComputed`) for fine-grained updates: binding a signal directly into JSX text (`<span>{count}</span>`) updates the DOM text node without re-rendering the enclosing component.
- Prefer standard HTML attribute names (`class`, `for`) in native Preact; use `className`/`htmlFor` only when sharing source code with `preact/compat`.
- Clean up `effect()` subscriptions by returning a disposal callback, and avoid mutating signals during render.

```tsx
import { computed, useSignal } from '@preact/signals';

export function QuantityControl({ unitPrice }: { unitPrice: number }) {
  const qty = useSignal(1);
  const total = computed(() => qty.value * unitPrice);

  return (
    <div class="qty-row">
      <button type="button" onClick={() => { if (qty.value > 1) qty.value--; }} aria-label="Decrease quantity">−</button>
      <output aria-live="polite">{qty}</output>
      <button type="button" onClick={() => { qty.value++; }} aria-label="Increase quantity">+</button>
      <span>Total: {total}</span>
    </div>
  );
}
```

## Deno Fresh 2.0 idioms

- Fresh 2.0 uses a composable middleware/route `App` (`new App().use(...).fsRoutes()`) with Vite support and Preact islands under `islands/`.
- Keep page routes and forms server-rendered with standard `Request`/`Response` handlers (`GET`/`POST`) that preserve submitted values and return HTTP 422 HTML with adjacent field errors on validation failure.
- Isolate browser-only interactivity in small `islands/*.tsx` components; pass only serializable data props and keep island fallback markup identical to initial SSR output to avoid CLS.

## Hono JSX & Hono RPC (`hc`) idioms

- Render fast semantic HTML on the server using `hono/jsx` (`c.html(<Layout>...</Layout>)` or `renderToReadableStream` / `<Suspense>` streaming) and pair with htmx or tiny `hono/jsx/dom` client islands where interactivity is needed.
- Export the chained route type (`export type AppType = typeof routes`) and consume it on the client with **`hc<AppType>('/api')`** plus `@hono/zod-validator` (or Standard Schema validator) so API contracts stay end-to-end type-safe with zero codegen:

```ts
// server.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const routes = new Hono().post(
  '/api/invoices',
  zValidator('json', z.object({ number: z.string().min(1) })),
  (c) => c.json({ ok: true, number: c.req.valid('json').number }, 201)
);

export type AppType = typeof routes;

// client.ts
import { hc } from 'hono/client';
import type { AppType } from './server';

const client = hc<AppType>('/');
const res = await client.api.invoices.$post({ json: { number: 'INV-104' } });
```

## RedwoodSDK & Waku (minimal RSC) idioms

- Follow the React 19 RSC rules in `react-next.md`: keep data fetching and auth/authz checks in Server Components and Server Functions, mark only interactive leaves `'use client'`, and never read `window` during SSR.
- In **RedwoodSDK**, colocate request middleware (session/auth/CSRF) explicitly on route definitions (`defineApp([render(Document, [route('/invoices', [requireAuth, InvoicesPage])])])`).
- In **Waku**, specify static vs dynamic rendering explicitly (`getConfig = async () => ({ render: 'static' | 'dynamic' })`) so CDN-cacheable routes do not incur unnecessary per-request compute.

## Do/don't pairs

| Do | Don't |
|---|---|
| Bind `@preact/signals` directly in JSX for high-frequency updates | Pull heavy React state libraries into Preact via `preact/compat` by habit |
| Keep Fresh 2 routes server-rendered and hydrate tiny `islands/` | Put entire page layouts inside `islands/` (negates zero-JS SSR) |
| Chain Hono routes (`const routes = app.get(...).post(...)`) so `typeof routes` preserves `hc<AppType>` inference | Register routes in separate unchained statements (`app.get(...)`) that erase `AppType` inference |
| Enforce auth/authz inside every Server Function / POST handler | Trust client-side route guards or unvalidated JSON payloads |
| Use semantic `<form>`, `<label>`, and `prefers-reduced-motion` CSS across all stacks | Assume minimal runtimes exempt the UI from WCAG 2.2 or full state coverage |

## Known traps

Breaking `hc<AppType>` type inference by not chaining Hono routes, importing heavyweight React UI kits through `preact/compat` and losing the bundle win, passing non-serializable functions/classes into Fresh islands, unguarded `window`/`document` access in edge SSR runtimes (Cloudflare Workers / Deno Deploy), missing CSRF checks on form POST routes.

## Verification commands

Use the stack's actual runtime/test runner:

```sh
# Preact / Hono / Waku / RedwoodSDK (Node/Vite)
npm run typecheck && npm run test -- --run && npm run build

# Deno Fresh 2
deno check && deno test && deno task build

# Browser evidence (all stacks)
npx playwright test
```

Typechecks and server handler tests provide `static`/HTTP evidence; verify hydration, islands, focus, and network error states in a real browser (`rendered`).
