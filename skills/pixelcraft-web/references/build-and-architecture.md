# Frontend build tools, application architecture, and browser runtime

Select the bundler, rendering architecture, microfrontend boundary, and browser runtime primitives to match the product's delivery constraints—not default templates. For PWA manifest/installability UX, read `references/pwa.md`; for Lit Shadow DOM accessibility/form internals, read `references/lit-web-components.md`.

## Build and bundling decision matrix

| Tool | Underlying engine | Best fit | Version & migration rules |
|---|---|---|---|
| **Vite 8+** | **Rolldown** (Rust bundler) + **Oxc** (JS/TS transform & minifier) | Modern React, Vue, Svelte, Solid, Astro, Qwik apps and libraries | Do not write legacy `esbuild` / `optimizeDeps.esbuildOptions` config on Vite 8+: migrate to `oxc`, `optimizeDeps.rolldownOptions`, and `build.rolldownOptions`. Vite 8 no longer ships `esbuild` by default. |
| **Vite 6–7** | Rollup (build) + esbuild (dev/dep pre-bundling) | Existing Vite 6–7 repos not yet upgraded to v8 | Verify installed major in `package.json` before choosing `rollupOptions` vs `rolldownOptions`. |
| **Rspack / Rsbuild** | Rust Webpack-compatible bundler | Webpack migrations, enterprise monorepos, Module Federation 2.0 | Use Rsbuild (`@rsbuild/core`) for ergonomic defaults (`performance.chunkSplit`, built-in `moduleFederation.options`); drop down to raw Rspack only for custom Webpack plugin pipelines. |
| **Turbopack** | Incremental Rust bundler (Next.js) | Next.js dev/production builds | Align loaders and resolve aliases with Next.js `turbopack` config; avoid Webpack-only plugins that block Turbopack adoption. |
| **Webpack 5** | JS bundler | Legacy enterprise apps with custom Webpack loaders/plugins | Maintain existing setups; prefer Rsbuild/Rspack or Vite 8 for greenfield apps. |
| **Parcel** | Zero-config multi-asset bundler | Small multi-entry static sites, Chrome extensions, quick prototypes | Keep config minimal; switch to Vite or Rsbuild once custom chunking or SSR pipelines are needed. |
| **esbuild** | Go bundler/transpiler | CLI scripts, library builds, fast single-pass bundling | Not a full SPA dev/HMR framework; pair with Vite/tsup/unbuild when type generation or CSS extraction is required. |

### Vite 8 (Rolldown + Oxc) config idiom

- **Chunk splitting breaking change**: Vite 8 / Rolldown removes object-form `manualChunks` and deprecates function-form `manualChunks`. Use `build.rolldownOptions.output.codeSplitting.groups` (`name`, `test`, `priority`), and enable `strictExecutionOrder` only if aggressive chunk splitting causes module-initialization order errors. In SSR meta-frameworks using Vite Environment API, scope client chunking under `environments.client.build`.

```ts
// vite.config.ts (Vite 8+)
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
  build: {
    rolldownOptions: {
      output: {
        // replaces Rollup manualChunks (object form removed in Vite 8)
        codeSplitting: {
          groups: [
            { name: 'react-vendor', test: /node_modules[\\/](?:react|react-dom|scheduler)[\\/]/, priority: 30 },
            { name: 'vendor', test: /node_modules[\\/]/, priority: 10 },
          ],
        },
        // replaces esbuild.drop / minify options
        minify: {
          compress: { dropConsole: true },
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
| **Islands / Partial Hydration** | Build or SSR | Only interactive islands (`client:visible`, `client:idle`) | Content-heavy sites with isolated widgets (Astro, Fresh) | Accidental top-level wrapper hydrating the entire page |
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

- **Lit**: lightweight standards-based custom elements (`references/lit-web-components.md`).
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

## Do/don't pairs

| Do | Don't |
|---|---|
| Use `oxc` and `build.rolldownOptions` on Vite 8+ | Copy legacy `esbuild` / `optimizeDeps.esbuildOptions` snippets into Vite 8 configs |
| Mark `react` / `react-dom` as `singleton: true` in Module Federation | Load duplicate React runtimes across host and remote containers |
| Offload heavy parsing and `OffscreenCanvas` rendering to Web Workers | Block the main thread with synchronous multi-megabyte parsing or rendering |
| Persist offline state in IndexedDB/Cache API and use Serwist/Workbox | Store state in Service Worker module globals that vanish when the worker sleeps |
| Match rendering strategy (SSG/ISR/Islands/SSR/SPA) to route interactivity | Ship a full SPA bundle for a static marketing/docs site |

## Verification commands

```sh
npm run build
```

Inspect generated bundle chunks and source-map visualizer output (`static`) and verify hydration timing, INP, Service Worker lifecycle, and offline fallback in a real browser (`rendered`).
