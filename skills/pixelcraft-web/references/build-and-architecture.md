# Frontend build tools, application architecture, and browser runtime

Select the bundler, rendering architecture, microfrontend boundary, and browser runtime primitives to match the product's delivery constraints—not default templates. For PWA manifest/installability UX, read [pwa.md](pwa.md); for Lit Shadow DOM accessibility/form internals, read [lit-web-components.md](lit-web-components.md).

## Build, linting, and bundling decision matrix

| Tool | Underlying engine | Best fit | Version & migration rules |
|---|---|---|---|
| **Vite 8+** | **Rolldown** (Rust bundler) + **Oxc** (JS/TS transform & minifier) | Modern React, Vue, Svelte, Solid, Astro, Qwik apps and libraries | Do not write legacy `esbuild` / `optimizeDeps.esbuildOptions` config on Vite 8+: migrate to `oxc`, `optimizeDeps.rolldownOptions`, and `build.rolldownOptions`. Vite 8 no longer ships `esbuild` by default. |
| **Vite 6–7** | Rollup (build) + esbuild (dev/dep pre-bundling) | Existing Vite 6–7 repos not yet upgraded to v8 | Verify installed major in `package.json` before choosing `rollupOptions` vs `rolldownOptions`. |
| **Rspack / Rsbuild** | Rust Webpack-compatible bundler | Webpack migrations, enterprise monorepos, Module Federation 2.0 | Use Rsbuild (`@rsbuild/core`) for ergonomic defaults (`performance.chunkSplit`, built-in `moduleFederation.options`); drop down to raw Rspack only for custom Webpack plugin pipelines. |
| **Turbopack** | Incremental Rust bundler (Next.js) | Next.js dev/production builds | Align loaders and resolve aliases with Next.js `turbopack` config; avoid Webpack-only plugins that block Turbopack adoption. |
| **`tsdown`** | Rolldown + Oxc (superseding `tsup`) | TypeScript/JS npm packages and workspace UI libraries | Prefer `tsdown` (`dts: true`, isolated declarations fast `.d.ts` emit) over legacy `tsup` for new library builds. |
| **Bun bundler (`bun build`)** | Zig native bundler + runtime | Bun-first full-stack apps, scripts, single-file executables | Verify Node/browser compatibility for plugins and SSR adapters when targeting non-Bun hosts. |
| **Webpack 5 / Parcel / esbuild** | JS / Rust / Go | Legacy enterprise Webpack pipelines; zero-config static bundles (Parcel); fast single-pass CLI transforms (esbuild) | Maintain existing setups; prefer Vite 8, Rsbuild, or `tsdown` for greenfield builds. |

### Linting, formatting, and compiler plugins

- **Biome**: single Rust binary for formatting + linting (`biome check --write`) across JS/TS/JSX/CSS/JSON/HTML with zero Prettier/ESLint plugin sprawl; pair with framework-specific linters only where needed (e.g., complex Vue/Svelte template rules).
- **Oxlint & Oxfmt** (Oxc toolchain): ultra-fast Rust linter (`oxlint`) and formatter (`oxfmt`) that run orders of magnitude faster than ESLint in CI—either standalone or ahead of narrow type-aware/framework ESLint rules.
- **React Compiler build plugin**: enable `reactCompiler: true` in Next.js 15/16 or wire `babel-plugin-react-compiler` in Vite/Rsbuild (paired with `eslint-plugin-react-hooks` compiler rules) so pure React components auto-memoize without hand-written `useMemo`/`useCallback`.

### Vite 8 (Rolldown + Oxc) and Vite Environment API idiom

- **Chunk splitting breaking change**: Vite 8 / Rolldown removes object-form `manualChunks` and deprecates function-form `manualChunks`. Use `build.rolldownOptions.output.codeSplitting.groups` (`name`, `test`, `priority`), and enable `strictExecutionOrder` only if aggressive chunk splitting causes module-initialization order errors.
- **Vite Environment API**: modern meta-frameworks (React Router v7, TanStack Start, Cloudflare Vite plugin, Nuxt, SvelteKit) separate client, SSR, and edge worker runtimes under `environments: { client: ..., ssr: ... }`—scope browser-only chunk rules under `environments.client.build` rather than mutating global build options blindly.

```ts
// vite.config.ts (Vite 8+ with Environment API & Rolldown)
import { defineConfig } from 'vite';

export default defineConfig({
  oxc: {
    jsx: { runtime: 'automatic' },
  },
  optimizeDeps: {
    rolldownOptions: {
      // replaces deprecated optimizeDeps.esbuildOptions
    },
  },
  environments: {
    client: {
      build: {
        rolldownOptions: {
          output: {
            codeSplitting: {
              groups: [
                { name: 'framework-vendor', test: /node_modules[\\/](?:react|react-dom|scheduler)[\\/]/, priority: 30 },
                { name: 'vendor', test: /node_modules[\\/]/, priority: 10 },
              ],
            },
            minify: { compress: { dropConsole: true } },
          },
        },
      },
    },
  },
});
```

## Rendering architecture decision matrix

Choose the lightest rendering strategy that satisfies interactivity, freshness, and SEO:

| Strategy | HTML generated | JS shipped to client | Best fit | Primary trap |
|---|---|---|---|---|
| **SSG** | Build time | Optional / minimal | Docs, marketing, blogs, catalogs with infrequent updates | Full rebuilds scaling poorly on 10k+ pages |
| **ISR / On-demand revalidation** | Build + cached server refresh | Page/route bundle | E-commerce, news, high-traffic CMS pages | Stale-while-revalidate surprises on auth-scoped content |
| **SSR (streaming)** | Per request | Full or selective hydration | Personalized pages, auth-gated dashboards, live SEO pages | Hydration mismatch & slow TTFB blocking first paint |
| **Islands / Partial Hydration** | Build or SSR | Only interactive islands (`client:visible`, `client:idle`) | Content-heavy sites with isolated widgets (Astro, Fresh, Leptos) | Accidental top-level wrapper hydrating the entire page |
| **Resumability** | SSR with serialized listeners | Lazy-loaded on interaction (Qwik) | Mobile-first, interaction-sensitive apps with tight INP budgets | Breaking serialization boundaries with non-serializable closures |
| **SPA (CSR)** | Empty shell + client render | Full app bundle | Authenticated tools, offline-first editors, canvas workspaces | Blank first paint, poor SEO, waterfall data fetching |

## Microfrontends

Use microfrontends only when **independent team deployment** outweighs shared-state and bundle-duplication costs. Prefer a monorepo with package boundaries first.

| Approach | Mechanism | Best fit | Key rule |
|---|---|---|---|
| **Module Federation 2.0** (`@module-federation/core`, Rsbuild, `@module-federation/vite`) | Runtime remote container loading + `mf-manifest.json` + typed DTS | Multi-team React/Vue/Angular apps sharing runtime singletons | Always pin framework singletons (`singleton: true`, `requiredVersion`) and isolate CSS so remotes cannot collide. |
| **single-spa** | Lifecycle router (`bootstrap`, `mount`, `unmount`) across frameworks | Incremental migration between different frameworks (e.g. Angular → React) | Enforce strict unmount cleanup (listeners, timers, portals) to prevent memory leaks across route switches. |
| **Piral** | Shell + pilets plugin architecture | Extensible enterprise portals with third-party UI plugins | Version the pilet API contract strictly; never expose internal shell state directly. |

```ts
// rsbuild.config.ts (Module Federation 2.0 remote)
import { defineConfig } from '@rsbuild/core';

export default defineConfig({
  moduleFederation: {
    options: {
      name: 'billing_remote',
      filename: 'remoteEntry.js',
      exposes: { './InvoicePanel': './src/InvoicePanel' },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
      },
    },
  },
});
```

## Web Components ecosystem

When building framework-agnostic leaf components or cross-framework design systems:

- **Lit**: lightweight standards-based custom elements ([lit-web-components.md](lit-web-components.md)).
- **Stencil**: compiler generating standard Web Components plus framework wrapper packages (React/Vue/Angular) for enterprise design systems.
- **FAST**: Microsoft's Web Components foundation with design tokens and adaptive color recipes.
- **Shoelace / Web Awesome**: ready-to-use accessible Web Components (`sl-*` / `wa-*`) with CSS custom properties, `::part()` hooks, and React wrappers.

## Browser runtime offloading

Keep the main thread free for input and 60fps rendering (INP < 200ms):

- **Web Workers**: move heavy JSON/CSV parsing, search indexing, syntax highlighting, diffing, and crypto off the main thread. Transfer `ArrayBuffer`s (zero-copy) instead of structured-cloning large payloads.
- **OffscreenCanvas**: transfer a canvas with `canvas.transferControlToOffscreen()` into a Worker for heavy 2D/WebGL rendering (charts, waveforms, image filters) so animations never stall UI input.
- **WebAssembly (WASM)**: reserve for compute-dense workloads (image/video codecs, CAD/layout engines, SQLite/DuckDB in-browser, audio DSP). Always load `.wasm` via `WebAssembly.instantiateStreaming` and run heavy compute inside a Worker.
- **Service Workers**: intercept network requests for caching and offline resilience; never store mutable app state in Service Worker memory (workers terminate when idle—use Cache API or IndexedDB).

## Offline & Service Worker tooling (Serwist / Workbox)

Prefer **Serwist** (the actively maintained Workbox fork for Vite, Next.js, Nuxt, SvelteKit) or **Workbox** over hand-rolling raw `fetch` event listeners:

- **Precaching**: inject build-hashed assets into `self.__SW_MANIFEST` with `cleanupOutdatedCaches: true`.
- **Runtime caching**: match by `request.destination` (`StaleWhileRevalidate` for images, `CacheFirst` for hashed scripts/styles, `NetworkFirst` for HTML/API).
- **Background Sync**: use `BackgroundSyncPlugin` on mutating `POST`/`PATCH` routes—note that `fetchDidFail` triggers only on network exceptions, not HTTP `4xx`/`5xx` responses.

```ts
// sw.ts (Serwist)
import { BackgroundSyncPlugin, CacheFirst, NetworkOnly, Serwist, StaleWhileRevalidate } from 'serwist';

const bgSync = new BackgroundSyncPlugin('offline-mutations', {
  maxRetentionTime: 24 * 60, // minutes
});

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: { cleanupOutdatedCaches: true },
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: [
    { matcher: ({ request }) => request.destination === 'image', handler: new StaleWhileRevalidate({ cacheName: 'images' }) },
    { matcher: ({ request }) => request.destination === 'script', handler: new CacheFirst({ cacheName: 'scripts' }) },
    { matcher: ({ url }) => url.pathname.startsWith('/api/sync'), handler: new NetworkOnly({ plugins: [bgSync] }), method: 'POST' },
  ],
});

serwist.addEventListeners();
```

## Post-tag performance budgets & third-party script isolation

Measure production performance **after** analytics, GTM, ad pixels, A/B testing, and chat widgets are active—never solely on a clean dev build.

### Mandatory production budgets (3-run median under 4G + 4× CPU throttle)

| Metric / Audit | Studio-grade floor | Measurement rule |
|---|---|---|
| **Lighthouse (Mobile + Desktop)** | **Perf ≥ 90**, **A11y ≥ 95**, **Best Practices ≥ 95**, **SEO ≥ 95** | **3-run median** on **every primary template** against production build with real tags/consent state active |
| **Initial compressed JS+CSS payload** | Content/editorial **`<= 150–250 KB`** · Dashboard/app **`<= 250–450 KB`** · Promotional/rich experience **`<= 350–700 KB`** · Embedded widget **`<= 100–200 KB`** | Initial pre-`load` compressed transfer (`~3.1 MB / 103 req` showcase median is a cost calibration benchmark, **never** an acceptable target budget) + **Network waterfall capture on heaviest page** |
| **Largest Contentful Paint (LCP)** | **< 2.5 s** (p75 field & lab) | Never lazy-load LCP hero media; set `fetchpriority="high"` + responsive `srcset` |
| **Interaction to Next Paint (INP) & `LoAF`** | **< 200 ms** (p75 field & lab); clean **Long Animation Frames (`LoAF`)** on scroll/drag | Yield long tasks (`scheduler.yield()`), isolate 3rd-party scripts off main thread, cap luminance flashes **`<= 3 Hz`** (`WCAG 2.3.1`) |
| **Cumulative Layout Shift (CLS)** | **< 0.10** (target `0.00` above fold) | Explicit media dimensions, metric-matched font fallbacks, zero-shift consent UI |

### Third-party tag, pixel, and chat widget isolation

- **Edge / Worker offloading**: route analytics and ad pixels through server-side/edge gateways (**Cloudflare Zaraz**, server-side GTM) or isolate main-thread scripts in a Web Worker via **Partytown** (`@builder.io/partytown`) where compatible.
- **Interaction facades**: never boot heavy third-party embeds (YouTube/Vimeo iframes, Intercom/Crisp/Zendesk live chat, Calendly, heavy maps) on initial page load. Render a lightweight static button/thumbnail facade (`lite-youtube-embed` or a semantic `"Chat with support"` button) and dynamically import the vendor SDK on `pointerenter`, `focus`, or `click`.
- **Consent Mode v2 without CLS**: initialize default consent state synchronously in `<head>` (`ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage` set to `'denied'` before any tag script executes) and upgrade via `gtag('consent', 'update', ...)` after explicit user choice. Render cookie/consent UI as a fixed bottom sheet/banner (`position: fixed`) with keyboard non-trapping focus—never inject a flow banner at the top of `<body>` that pushes page content down after hydration.

## CDN cache control, HTTP security headers & deployment safety

| Resource class | Recommended `Cache-Control` header | Rationale |
|---|---|---|
| Content-hashed build assets (`/_next/static/*`, `/assets/*.[hash].*`, subset `.woff2`) | `public, max-age=31536000, immutable` | Safe 1-year browser + CDN edge caching; filename changes on rebuild |
| Public SSG/ISR HTML & public JSON feeds | `public, max-age=0, s-maxage=60, stale-while-revalidate=86400` | Instant CDN edge response with background revalidation |
| Authenticated, user-specific, checkout, or tenant-scoped HTML/API | `private, no-store` (+ `Vary: Cookie, Authorization` if shared proxy exists) | Prevents catastrophic cross-tenant/session cache poisoning at CDN edge |

Ship these baseline HTTP security headers on every HTML response (via edge middleware, CDN rules, or reverse proxy) alongside **isolated PR preview deployments** and a tested **instant rollback plan** (previous immutable artifact alias or CDN/edge deployment promotion):

- **`Content-Security-Policy`**: strict allowlist or per-request nonce (`script-src 'self' 'nonce-...' 'strict-dynamic'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'`).
- **`Strict-Transport-Security`**: `max-age=63072000; includeSubDomains; preload`.
- **`X-Content-Type-Options`**: `nosniff`.
- **`Referrer-Policy`**: `strict-origin-when-cross-origin`.
- **`Permissions-Policy`**: `camera=(), microphone=(), geolocation=(), payment=(self)` (enable capabilities only on routes that use them).

## Technical SEO, redesign migration & AI/social unfurl readiness

- **Per-route metadata & structured data**: emit a unique `<title>`, `<meta name="description">`, self-referencing `<link rel="canonical" href="https://...">`, `robots.txt`, generated `sitemap.xml`, `hreflang` + `x-default` alternates ([i18n-engineering.md](i18n-engineering.md)), and schema-valid JSON-LD (`Organization`, `Product`, `Article`, `FAQPage`, `BreadcrumbList`) matching visible page facts.
- **Redesign `301` redirect map & zero broken/orphan links**: when replacing an existing site, crawl and inventory every legacy URL before launch, enforce single-hop `301` (or method-preserving `308`) redirects for every changed slug, and run an automated link checker in CI to verify `0` internal `404`s, `0` redirect loops, and `0` orphaned public pages.
- **SSR/SSG semantic HTML & `/llms.txt` for AI search**: ensure primary headings, pricing, docs, and article copy render in initial SSR/SSG semantic HTML (`<main>`, `<article>`, `<table>`) without requiring client JS execution; publish a concise `/llms.txt` markdown index at the domain root linking canonical product, documentation, and policy URLs for AI crawlers and answer engines.
- **Zalo, Slack, iMessage, Facebook & LinkedIn Open Graph cards**: always serve `og:image` and `twitter:image` (`twitter:card="summary_large_image"`) as **`1200×630` absolute `https://` URLs** in **JPEG or PNG** (`< 600 KB`) with explicit `og:image:width="1200"` and `og:image:height="630"`. Never use relative `/og.png` paths, and never serve SVG or WebP-only `og:image` URLs—Zalo, enterprise Slack/Teams unfurlers, and legacy chat crawlers silently drop WebP/SVG previews.

## Do/don't pairs

| Do | Don't |
|---|---|
| Use `oxc` and `build.rolldownOptions` on Vite 8+ | Copy legacy `esbuild` / `optimizeDeps.esbuildOptions` snippets into Vite 8 configs |
| Mark `react` / `react-dom` as `singleton: true` in Module Federation | Load duplicate React runtimes across host and remote containers |
| Gate 3rd-party pixels/chat behind Zaraz/Partytown, click-to-load facades, and fixed Consent Mode v2 UI | Load GTM, Intercom, and YouTube iframes synchronously on `<head>` or push layout down with a late cookie bar |
| Serve `immutable` cache headers on hashed assets, `private, no-store` on auth routes, CSP/HSTS/`nosniff`, PR previews, and a rollback plan | Cache personalized responses at the CDN edge or ship production changes without preview isolation and rollback |
| Ship a tested legacy `301` redirect map, `/llms.txt`, and `1200×630` HTTPS PNG/JPEG `og:image` tags | Drop old indexed URLs to `404` on redesign or use relative/WebP/SVG `og:image` URLs that break in Zalo/Slack |
| Persist offline state in IndexedDB/Cache API and use Serwist/Workbox | Store state in Service Worker module globals that vanish when the worker sleeps |
| Match rendering strategy (SSG/ISR/Islands/SSR/SPA) and initial JS+CSS budget (`<= 150–700 KB` by class) to route interactivity | Ship a `3.1 MB` showcase-bloated SPA bundle for a content/marketing site |

## Verification commands

```sh
npm run build
npx lighthouse http://localhost:4173 --preset=perf --form-factor=mobile
npx lighthouse http://localhost:4173 --preset=desktop
```

Inspect generated bundle chunks against surface-class JS+CSS budgets, HTTP response/security/cache headers, `sitemap.xml`/`robots.txt`/`llms.txt`, PR preview/rollback config, and `301` redirect rules (`static`), and verify **3-run median** post-tag Lighthouse scores (`Perf >= 90`, `A11y/BP/SEO >= 95` on mobile + desktop per primary template), CWV (`LCP < 2.5s`, `INP < 200ms`, `CLS < 0.1`), `LoAF` scroll/drag traces, heaviest-page Network waterfall, and deliverable captures across **`Chrome`, `Firefox`, `Edge`, `Safari macOS`, real `Safari iOS`, and `Chrome Android`** (`rendered`).
