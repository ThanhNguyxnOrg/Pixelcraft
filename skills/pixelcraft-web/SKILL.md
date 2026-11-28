---
name: pixelcraft-web
description: Translates Pixelcraft direction, tokens, UX, and floor requirements into idiomatic web UI across HTML/CSS, React, Next.js, Vue, Nuxt, SvelteKit, SolidStart, Angular, Astro, Qwik, Preact, Fresh, Hono, htmx, Alpine, Lit, Rails/Hotwire, Laravel/Livewire/Filament/Inertia, Symfony UX, WordPress, Django/FastAPI/FastHTML, Phoenix LiveView, Blazor, Go templ/Gomponents, Rust Leptos/Dioxus, Kotlin, Java, Dart Jaspr, Elm, ClojureScript, F#, and Scala. Use for browser UI, Tailwind v4, headless/styled kits, cmdk/vaul/sonner/Embla, search/icons/fonts/images, forms/tables/editors, sync/auth/i18n/PWA, GSAP/Motion/Lenis/Rive, Three.js/R3F/Babylon/Spline/Theatre.js, WebGPU/shaders, or audio/video players.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft web

Use this skill when the rendering surface is HTML/CSS/DOM, including server-rendered pages, hybrid islands, browser 3D/WebGL/WebGPU scenes, and interactive media. Do not assume React or Tailwind; detect the actual stack nearest the changed files.

## Surface craft

Use one memorable device when the brief warrants it: a real product as the spatial anchor, editorial rows around comparable facts, or expressive type constrained by an underlying grid. Keep navigation and primary controls ordinary. Inspect normal scroll, mobile reflow, first-load payload, and the reduced-motion path; never trade orientation for scroll hijacking, a custom cursor, or delayed essential content.

## Detection signals

Inspect `package.json`, `Cargo.toml`, `go.mod`, `Gemfile`, `composer.json`, `pyproject.toml`, `mix.exs`, `*.csproj`, `pubspec.yaml`, `build.gradle*`, `pom.xml`, `deps.edn`, `elm.json`, `block.json`, `theme.json`, framework configs, template extensions, routes/controllers, CSS entry files, and island/hydration markers. Multiple web stacks can coexist; scope each decision to the active route or component surface.

## Translate direction to web idioms

1. Convert semantic DTCG roles to CSS custom properties or the framework's theme object; keep primitives hidden behind semantic names.
2. Express composition with native CSS Grid, Flex, container queries, and logical properties before framework-specific utility soup.
3. Choose rendering strategy deliberately (static, server-rendered, streamed, islands, resumable, SPA, or enhanced partial). Never hydrate a full page for one small control.
4. Build interactions with real HTML semantics first (`a`, `button`, `form`, `label`, `dialog`, `[popover]`), then layer framework behavior.
5. Connect state matrix rows to route, cache, and network behavior: loading, empty, error, offline, stale, unauthorized, optimistic rollback, and deep-link restoration.
6. Honor `prefers-reduced-motion`, `prefers-color-scheme`, forced colors, text scaling, logical direction, keyboard/focus restoration, and browser capability differences.

## Platform-wide rules

- **Post-tag 3-run median budgets & initial payload caps**: verify **after** real analytics/GTM/pixels/chat scripts are active—**3-run median Lighthouse** under 4G throttling (**Perf ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95**) on **both mobile and desktop for every primary template**, Core Web Vitals **LCP < 2.5 s, INP < 200 ms, CLS < 0.10**, **Long Animation Frames (`LoAF`)** clean on scroll/drag, **`<= 3 Hz` flash cap** (`WCAG 2.3.1`), and **Network waterfall capture on the heaviest page**. Enforce initial compressed JS+CSS payload budgets by surface class (**Content/editorial `<= 150–250 KB`**; **Dashboard/app `<= 250–450 KB`**; **Promotional/rich experience `<= 350–700 KB`**; **Embedded widget `<= 100–200 KB`**—noting the `~3.1 MB / 103 req` showcase median is a cost calibration benchmark, NOT an acceptable budget). Isolate 3rd-party scripts off the main thread (Cloudflare Zaraz / Partytown) or behind interaction/Consent Mode v2 facades with zero banner CLS.
- **Typography, cascade & print/recovery**: self-host `<= 2–3` subsetted `.woff2` files with `@font-face` fallback metric overrides (`size-adjust`, `ascent-override`, `descent-override`, `line-gap-override`); structure CSS with `@layer` and logical properties (`margin-inline`, `inset-block`) without `!important` sprawl; render a first-focusable **Skip to main content** link; ship branded `404`/`500` recovery routes and a `@media print` stylesheet for articles, docs, receipts, and invoices.
- **Viewport, short-laptop fold & cross-browser matrix**: verify across `360 / 390 / 768 / 1024 / 1280 / 1440 / 1920+` (`svh`/`dvh`, `env(safe-area-inset-*)`, `clamp()`), scaled 13–14" Windows laptops (`1280×620` / `1366×650` at `125%–150%` OS scale) so the above-the-fold headline + primary CTA stay visible without clipping, and attach deliverable evidence across **`Chrome`, `Firefox`, `Edge`, `Safari macOS`, real `Safari iOS`, and `Chrome Android`**.
- **SEO, migration, CDN, security headers & deployment safety**: ship per-route `<title>`/description/canonical, `sitemap.xml`, `robots.txt`, JSON-LD, `hreflang` + `x-default`, legacy redesign `301` redirect maps (`0` broken/orphan links), SSR/SSG semantic HTML + `/llms.txt`, `1200×630` HTTPS JPEG/PNG `og:image` cards (Zalo/Slack/iMessage/FB safe—never SVG/WebP-only), `immutable` asset caching (`private, no-store` on auth routes), CSP/HSTS/`nosniff`/`Referrer-Policy`/`Permissions-Policy`/`frame-ancestors`, **PR preview deployments**, and a documented **production rollback plan**.
- **SaaS, checkout & CMS resilience**: keep search/filter/sort/page/tab/drawer IDs in the URL; sync sign-out and workspace/tenant switches across tabs (`BroadcastChannel`/`storage`); cancel stale fetches (`AbortController`); lock mutations synchronously with `Idempotency-Key`; preserve dirty drafts across `401` session expiry; guard single-key hotkeys inside inputs/contenteditable/IME and use Safe-Triangle submenu corridors; sanitize Word/Docs CMS paste and auto-transcode `10–15 MB` uploads with focal-point crops + Draft Live Preview.

## Anti-lazy / do-not-hand-roll guard

| Never do this | Use instead |
|---|---|
| Build a rich-text or code editor on raw `contenteditable` / `document.execCommand`, or bundle Monaco for static code snippets | ProseMirror, Tiptap, BlockNote, Lexical, CodeMirror 6 (editable), or **Shiki** (zero-JS read-only highlighting) |
| Render 5,000+ DOM table rows or write DIY scroll virtualization | TanStack Table + TanStack Virtual, AG Grid, MUI X Data Grid, or Glide Data Grid |
| Hand-roll modals, comboboxes, command palettes, touch drawers, toast stacks, carousels, date grids, split panes, or ad-hoc client search | Native `<dialog>` / `[popover]` / `<input type="date">` first; otherwise `@base-ui/react`, `radix-ui`, React Aria, Ariakit, Zag.js, Melt UI, `cmdk`/`kbar`, `vaul`, `sonner`, Embla/Splide, `react-day-picker`, `react-resizable-panels`, and Pagefind/Orama/Fuse.js/InstantSearch |
| Ship untouched `shadcn/ui` default zinc neutrals, `0.5rem` radius, and hairline card grids | Author project semantic tokens (`pixelcraft-tokens`) and direction (`pixelcraft-direction`) before building views |
| Hydrate a full SPA or spin up Three.js just for static content or a single GLB orbit preview | Static/SSR/islands rendering, `<model-viewer>` with `poster` and `alt`, and lazy-loaded heavy chunks |

## Common web-specific slop/UX failures

- centered hero + eyebrow + two CTAs + three cards regardless of content, or primary CTA pushed below a `1280×620` scaled-laptop fold;
- `div`/`span` buttons, missing **Skip to main content** link, or unguarded single-key hotkeys firing while typing in inputs/IME;
- hydration delay, main-thread 3rd-party pixels/chat widgets tanking INP/`LoAF`, or late cookie banners shifting CLS;
- infinite scroll without position recovery, trapped memory-only filters/drawers, or stale search responses overwriting newer queries;
- multi-tab tenant drift after workspace switch/sign-out, double-charge submits without `Idempotency-Key`, or `401` redirects wiping form drafts;
- modal/dropdown focus escaping, dark mode via CSS filter inversion, or untouched `shadcn/ui` defaults.

## Verification options

Be explicit with evidence labels (`rendered`, `static`, `model-judgment`, `not-checked`, `waived`) and enforce **Evidence Rule #0.3** (`static`/`model-judgment` never counts as `pass` for visual, performance, or interactive-a11y rows). Browser rendering, screenshots, DOM/accessibility trees, axe scans, Playwright/Vitest Browser Mode/Storybook tests, 3-run Lighthouse, `LoAF`/Network waterfall traces, responsive emulation, and real devices provide `rendered` evidence; builds, typechecks, and `jsdom` tests are `static` (or DOM-unit) evidence only.

## Pre-submit checklist

- [ ] zero `TODO`s, placeholder stubs, invented copy/metrics, or dead click/form handlers;
- [ ] **3-run median Lighthouse** under 4G throttling (`Perf ≥ 90`, `A11y/BP/SEO ≥ 95`) on mobile + desktop per primary template, CWV (`LCP < 2.5s`, `INP < 200ms`, `CLS < 0.1`), `LoAF` scroll/drag trace, Network waterfall on heaviest page, and initial compressed JS+CSS budget (`<= 150–250 KB` content, `<= 250–450 KB` app, `<= 350–700 KB` rich, `<= 100–200 KB` widget) met;
- [ ] all state-matrix rows wired (URL-synced filters/drawers, `AbortController` race cancellation, `BroadcastChannel` multi-tab auth/tenant sync, `Idempotency-Key` submit lock, `401` draft preservation);
- [ ] Skip-to-main link, native HTML semantics, keyboard/focus restoration, single-key hotkey input/IME guard, `<= 3 Hz` flash cap, logical properties, WCAG 2.2 AA contrast, branded `404`/`500`, and `@media print` verified;
- [ ] `prefers-reduced-motion`, `prefers-color-scheme`, `forced-colors`, `360–1920+` widths, `1280×620` / `1366×650` scaled-laptop fold, and cross-browser/device deliverables (`Chrome`, `Firefox`, `Edge`, `Safari macOS`, real `Safari iOS`, `Chrome Android`) verified or labeled `not-checked`;
- [ ] SEO/canonical/JSON-LD/`hreflang`+`x-default`/`/llms.txt`/`301` redirect map, `1200×630` HTTPS JPEG/PNG OG cards, CDN cache & security headers, PR preview deployment, and rollback plan verified;
- [ ] **Web runtime & browser craft hygiene**: `capo.js` 11-tier `<head>` priority order, `>= 16px` (`max(16px, 1em)`) mobile inputs (never `maximum-scale=1`), `@media (hover: hover) and (pointer: fine)` + `touch-action: manipulation`, explicit `<select>`/`<option>` dark-mode colors, `bfcache` eligibility (zero `unload` listeners, `pagehide`/`pageshow`, `no-store` only on sensitive routes), `0` DevTools Console warnings/errors, dead-code/unused-dep cleanup (`knip`/`depcheck`), tree-shakeable icon imports, and complete dark-mode SVG favicon suite;
- [ ] **macOS, iOS & clean-profiling resilience**: verified with **macOS `Show scroll bars: Always`** (no clipping/spurious overflow), **`iOS Low Power Mode`** (ambient `<video>` degrades cleanly to `poster` without broken overlays or uncaught `play()` errors), and **all browser extensions disabled** before Lighthouse/CWV profiling (or explicitly labeled `not-checked`);
- [ ] **Checklist-Until-Passing Stop-Gate (`<HARD-GATE>`):** walk every checklist item above + run `slop-scan.mjs --fail-on p2`, `check-contrast.mjs`, browser QA (`pixelcraft-visual-qa`), and `check-acceptance.mjs .pixelcraft/acceptance.json` (`pixelcraft-review`) in a `Fix → Re-verify` loop until passing (`0` `fail`/`pending` rows, `rendered` evidence on visual/perf/a11y per `Rule #0.3`).

## Framework and stack routing

- Read [references/html-css.md](references/html-css.md) when working directly in HTML/CSS, `capo.js` `<head>` ordering, Safari/touch/pointer hygiene, native `<dialog>`/`[popover]`/Anchor Positioning, Invoker Commands, customizable `<select>`, or browser-native primitives.
- Read [references/tailwind.md](references/tailwind.md) when Tailwind CSS v4 (`@theme inline`, `@custom-variant`, `@utility`, `@container`) is the styling layer.
- Read [references/react-next.md](references/react-next.md) when building with React 19, Next.js 15/16, React Router v7, or TanStack Start / TanStack Router.
- Read [references/vue-nuxt.md](references/vue-nuxt.md) when building with Vue 3.5/3.6 (Vapor Mode), Pinia, Nuxt 4, or Nuxt UI.
- Read [references/svelte.md](references/svelte.md) when building with Svelte 5 runes/attachments or SvelteKit 2 (`$app/state`, form actions).
- Read [references/solid.md](references/solid.md) when building with Solid or SolidStart 1.x (`query`, `createAsync`, `action`, `<Index>`/`<For>`).
- Read [references/angular.md](references/angular.md) when building with Angular 19–21 signals, zoneless mode, `httpResource`, incremental `@defer`, or NgRx SignalStore.
- Read [references/astro.md](references/astro.md) when building with Astro 5 Content Layer, Server Islands (`server:defer`), Actions, or `<ClientRouter />`.
- Read [references/qwik.md](references/qwik.md) when building resumable interfaces in Qwik 1.x/2.0 (`useTask$`, `useResource$`, `server$`).
- Read [references/preact-fresh-hono.md](references/preact-fresh-hono.md) when building with Preact (`@preact/signals`), Deno Fresh 2.0, Hono JSX/RPC (`hc`), RedwoodSDK, or Waku.
- Read [references/htmx-alpine.md](references/htmx-alpine.md) when building hypermedia interfaces with htmx 2.x, Alpine.js plugins, Datastar, or Unpoly.
- Read [references/lit-web-components.md](references/lit-web-components.md) when building Lit or standards-based Web Components with Shadow DOM and `ElementInternals`.
- Read [references/server-rendered.md](references/server-rendered.md) when building Rails 8/Hotwire (ViewComponent/Phlex), Laravel (Livewire/Filament/Flux/Inertia), Symfony UX, WordPress Gutenberg/Interactivity API, Django (Cotton/Ninja/Unfold/Wagtail), FastAPI+Jinja2, FastHTML, Phoenix LiveView, Blazor (FluentUI/MudBlazor/Radzen), Go `templ`/Gomponents, or Dart Jaspr.
- Read [references/leptos-yew.md](references/leptos-yew.md) when building Rust web apps in Leptos 0.7/0.8, Dioxus Web, Yew, or Axum + Askama/Maud + htmx.
- Read [references/kotlin-web.md](references/kotlin-web.md) when building Kotlin web apps in Compose Multiplatform Web (`wasmJs`/`js`) or Kobweb.
- Read [references/java-web.md](references/java-web.md) when building Java web UIs with Vaadin Flow, Vaadin Hilla, Spring + Thymeleaf + htmx, JTE, or Quarkus Qute.
- Read [references/elm.md](references/elm.md) when building Elm web applications.
- Read [references/clojurescript.md](references/clojurescript.md) when building ClojureScript UIs with UIx v2, Helix, or Reagent/re-frame.
- Read [references/fsharp-fable.md](references/fsharp-fable.md) when building F# Fable Feliz/Elmish apps with Vite.
- Read [references/scala-laminar.md](references/scala-laminar.md) when building Scala.js Laminar interfaces.

## Web engineering and UI architecture routing

- Read [references/adaptive-layout.md](references/adaptive-layout.md) when a web surface must adapt across phone, tablet, desktop, split window, shallow viewports, or mixed input modes.
- Read [references/styling-ecosystem.md](references/styling-ecosystem.md) when choosing CSS Modules, Lightning CSS, Sass, Panda CSS, vanilla-extract, Pigment CSS, StyleX, Tamagui Web, UnoCSS, Linaria, Open Props, CVA, or Tailwind Variants.
- Read [references/component-systems.md](references/component-systems.md) when selecting headless primitives (`@base-ui/react`, `radix-ui`, React Aria, Ark UI, Zag.js, Melt UI, Ariakit, Kobalte, Corvu, Reka UI, Bits UI), source-first kits (`shadcn/ui`, Park UI), enterprise suites, or Floating UI vs native popover.
- Read [references/interaction-and-search-primitives.md](references/interaction-and-search-primitives.md) when wiring command palettes (`cmdk`, `kbar`), drawers (`vaul`), toasts (`sonner`), carousels (Embla/Splide/Swiper), date pickers (`react-day-picker`), split panes (`react-resizable-panels`), search UIs (Pagefind, Orama, Fuse.js, InstantSearch, Meilisearch, Typesense), icons (Lucide, Phosphor, Tabler, Iconify), Fontsource fonts, or Unpic/ThumbHash images.
- Read [references/state-architecture.md](references/state-architecture.md) when designing URL state (`nuqs`), server caches (TanStack Query/DB, tRPC v11, oRPC, Apollo), client stores (Zustand, Pinia, NgRx SignalStore, Legend-State), XState v5, or IndexedDB (`Dexie`, `idb`).
- Read [references/forms-validation.md](references/forms-validation.md) when implementing TanStack Form, React Hook Form, Conform, SvelteKit Superforms, Modular Forms, VeeValidate, Zod v4/Valibot/ArkType validation, mobile input/dark-`<select>`/disabled-control hygiene, or `DOMPurify` XSS sanitization.
- Read [references/build-and-architecture.md](references/build-and-architecture.md) when configuring Vite 8/Rolldown/Environment API, Rsbuild/Rspack, Turbopack, `tsdown`, Bun, Biome/Oxlint, React Compiler, rendering modes, microfrontends, Web Workers, WASM, Serwist/Workbox, `bfcache`, or dead-code/bundle hygiene.
- Read [references/component-testing.md](references/component-testing.md) when setting up Storybook (`@storybook/addon-vitest`, `composeStories`), Vitest Browser Mode, MSW v2, Playwright (`page.clock`, ARIA/visual snapshots), or `axe-core` (`wcag22aa`).
- Read [references/pwa.md](references/pwa.md) when building installable, offline-capable, push-enabled, update-aware PWAs or testing iOS/iPadOS home-screen constraints.
- Read [references/enterprise-data-ui.md](references/enterprise-data-ui.md) when building headless tables (TanStack Table/Virtual), enterprise grids (AG Grid, MUI X Data Grid, Glide Data Grid), spreadsheets (Handsontable, Univer), or calendars/schedulers (FullCalendar, Schedule-X, Bryntum).
- Read [references/rich-text-and-code-editors.md](references/rich-text-and-code-editors.md) when building rich-text editors (ProseMirror, Tiptap, BlockNote, Lexical, Slate, Plate), read-only code highlighting (Shiki), code editors (CodeMirror 6, Monaco), playgrounds, or page builders (Puck).
- Read [references/canvas-and-node-editors.md](references/canvas-and-node-editors.md) when building whiteboards (tldraw, Excalidraw), 2D scene graphs (Konva, Fabric.js), node graphs (XYFlow/React Flow, Rete.js, Cytoscape), or drag-and-drop (dnd-kit, Pragmatic DnD).
- Read [references/local-first-sync.md](references/local-first-sync.md) when implementing offline-first or multiplayer sync (Yjs, Automerge, Zero, ElectricSQL, TanStack DB, PowerSync, Jazz, InstantDB, Convex, TinyBase, Liveblocks, RxDB, Durable Objects).
- Read [references/auth-and-checkout-ui.md](references/auth-and-checkout-ui.md) when building sign-in/auth UI (Better Auth, Clerk, Auth.js, Supabase), WebAuthn Level 3 Passkeys, OTP/MFA, or PCI-safe checkout (Stripe Embedded/Elements, Polar, Paddle, Lemon Squeezy).
- Read [references/file-upload-media-ui.md](references/file-upload-media-ui.md) when building S3/R2 presigned uploads, UploadThing, `tus-js-client`, Uppy, FilePond, clipboard paste, or Worker image compression.
- Read [references/i18n-engineering.md](references/i18n-engineering.md) when implementing `next-intl`, i18next, FormatJS, Lingui, Paraglide JS, Vue I18n, Angular localize, ICU plurals, `Intl.DurationFormat`, `Temporal`, RTL, or script/font fallbacks.

## Creative, motion, 3D, and media routing

- Read [references/creative-runtime.md](references/creative-runtime.md) when isolating motion, canvas, 3D, or media runtimes inside SSR/island web architectures.
- Read [references/gsap.md](references/gsap.md) when building GSAP 3.13+ timelines, ScrollTrigger, SplitText, Flip, Observer, `quickTo`, or `@gsap/react` lifecycles.
- Read [references/motion-react.md](references/motion-react.md) when implementing `motion/react`, `LazyMotion`, `AnimatePresence`, `LayoutGroup`, reduced-motion `MotionValue` gating, or vanilla `motion`.
- Read [references/smooth-scroll.md](references/smooth-scroll.md) before adding Lenis (`lenis/react`, `data-lenis-prevent`, `autoRaf: false`) or GSAP `ScrollSmoother`.
- Read [references/motion-recipes.md](references/motion-recipes.md) when implementing CSS scroll-driven animations, View Transition Types / `view-transition-class`, or interactive motion recipes.
- Read [references/rive-lottie.md](references/rive-lottie.md) when choosing or wiring Rive state machines/Data Binding or dotLottie (`.lottie`) vector animations.
- Read [references/scene-architecture.md](references/scene-architecture.md) when architecting Three.js scenes, `WebGPURenderer` (`three/webgpu`), TSL (`three/tsl`) node materials, Theatre.js choreography, Spline, or Unicorn Studio embeds.
- Read [references/r3f-integration.md](references/r3f-integration.md) when integrating React Three Fiber v9, `@react-three/postprocessing`, `@react-three/rapier`, and demand rendering (`invalidate`).
- Read [references/web-3d-engines.md](references/web-3d-engines.md) when choosing or implementing `<model-viewer>`, Babylon.js, PlayCanvas, Threlte v8, TresJS v5, luma.gl v9, or `regl`.
- Read [references/assets-pipeline.md](references/assets-pipeline.md) when configuring adaptive dark-mode SVG favicon suites, `preconnect`, muted `<video>` over GIFs, brand-logo context menus, or GLB/glTF pipelines (`gltf-transform`, Meshopt, Draco, KTX2/Basis, LODs).
- Read [references/rendering-performance.md](references/rendering-performance.md) when budgeting GPU frame times, DPR caps, offscreen pausing, and WebGL context loss/restoration.
- Read [references/rendering-choice.md](references/rendering-choice.md) when choosing DOM/SVG/Canvas 2D/PixiJS v8/WebGL/WebGPU and capability-detecting GPU backends.
- Read [references/shader-workflow.md](references/shader-workflow.md) when writing or debugging GLSL, WGSL, or TSL shaders with precision and reduced-motion uniforms.
- Read [references/creative-effects.md](references/creative-effects.md) when implementing deterministic seeded particle/noise/displacement effects and frozen-time QA hooks.
- Read [references/audio-reactive.md](references/audio-reactive.md) when wiring Web Audio `AnalyserNode`/`AudioWorklet` pipelines with StrictMode-safe `createMediaElementSource` guards.
- Read [references/video-media.md](references/video-media.md) when configuring AV1/HEVC/VP9/H.264 `<video>` delivery or `requestVideoFrameCallback` video textures.
- Read [references/media-players.md](references/media-players.md) when selecting or wiring Vidstack, Media Chrome, Mux Player, `hls.js` (`ManagedMediaSource`), Shaka, `dash.js`, Video.js, `wavesurfer.js`, `Howler.js`, or `Tone.js`.
- Read [references/accessibility-performance.md](references/accessibility-performance.md) when verifying `<track>` captions/descriptions, WCAG 2.2.2 pause controls, WCAG 2.3.1 flash limits, `iOS Low Power Mode` video fallbacks, macOS `Show scroll bars: Always`, and media performance budgets.
