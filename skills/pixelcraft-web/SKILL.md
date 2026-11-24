---
name: pixelcraft-web
description: Translates Pixelcraft direction, tokens, UX, and floor requirements into idiomatic web UI across HTML/CSS, React, Next.js, React Router, TanStack Start, Vue, Nuxt, SvelteKit, SolidStart, Angular, Astro, Qwik, Preact, Fresh, Hono, htmx, Alpine, Datastar, Lit, Rails/Hotwire, Laravel/Livewire/Inertia, Django/FastHTML, Phoenix LiveView, Blazor, Go templ, Rust Leptos/Dioxus/Yew, Kotlin, Java Vaadin/Hilla, Elm, ClojureScript, F# Fable, and Scala Laminar. Use when building or reviewing browser UI, Tailwind v4, Panda/StyleX/Lightning CSS, Base UI/Radix/shadcn/ui, state/sync engines (TanStack Query/DB, Zero, Electric, Yjs), forms/Zod, AG Grid/tables, Tiptap/CodeMirror/Monaco, XYFlow/tldraw/dnd-kit, Passkeys/auth/checkout, uploads, i18n, PWA, Vite/Vitest/Playwright/Storybook, GSAP, Motion, Lenis, Rive/dotLottie, Three.js, R3F, Babylon, Threlte/TresJS, PixiJS, WebGPU/GLSL/WGSL shaders, or Vidstack/hls.js/Tone.js media.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft web

Use this skill when the rendering surface is HTML/CSS/DOM, including server-rendered pages, hybrid islands, browser 3D/WebGL/WebGPU scenes, and interactive media. Do not assume React or Tailwind; detect the actual stack nearest the changed files.

## Surface craft

Use one memorable device when the brief warrants it: a real product as the spatial anchor, editorial rows around comparable facts, or expressive type constrained by an underlying grid. Keep navigation and primary controls ordinary. Inspect normal scroll, mobile reflow, first-load payload, and the reduced-motion path; never trade orientation for scroll hijacking, a custom cursor, or delayed essential content.

## Detection signals

Inspect `package.json`, `Cargo.toml`, `go.mod`, `Gemfile`, `composer.json`, `pyproject.toml`, `mix.exs`, `*.csproj`, `build.gradle*`, `pom.xml`, `deps.edn`, `elm.json`, framework configs, template extensions, routes/controllers, CSS entry files, and island/hydration markers. Multiple web stacks can coexist; scope each decision to the active route or component surface.

## Translate direction to web idioms

1. Convert semantic DTCG roles to CSS custom properties or the framework's theme object; keep primitives hidden behind semantic names.
2. Express composition with native CSS Grid, Flex, container queries, and logical properties before framework-specific utility soup.
3. Choose rendering strategy deliberately (static, server-rendered, streamed, islands, resumable, SPA, or enhanced partial). Never hydrate a full page for one small control.
4. Build interactions with real HTML semantics first (`a`, `button`, `form`, `label`, `dialog`, `[popover]`), then layer framework behavior.
5. Connect state matrix rows to route, cache, and network behavior: loading, empty, error, offline, stale, unauthorized, optimistic rollback, and deep-link restoration.
6. Honor `prefers-reduced-motion`, `prefers-color-scheme`, forced colors, text scaling, logical direction, keyboard/focus restoration, and browser capability differences.

## Platform-wide rules

- Use logical properties (`margin-inline`, `inset-block`) for direction-sensitive layout; physical left/right only when the meaning is physical.
- Preserve form input across failed validation and auth redirects; use accurate `autocomplete`, `inputmode`, `type`, and unobstructed paste behavior.
- Native browser navigation, history, and scroll restoration are part of UX—do not break them with hash misuse or trapped client state.
- Measure actual rendering (CLS, INP, hydration blocking, font loading, image priority, route transitions), not only bundle size.
- Avoid global resets or token overrides that destroy inherited project or design-system behavior.

## Common web-specific slop/UX failures

- centered hero + eyebrow + two CTAs + three cards regardless of content;
- `div`/`span` buttons with no keyboard/focus semantics;
- hydration delay making visible controls dead or scroll hijacking blocking orientation;
- infinite scroll without position recovery or keyboard/a11y alternative;
- sticky/fixed chrome obscuring focus or shallow-viewport content;
- Tailwind utility repetition mistaken for a semantic token system;
- modal/dropdown focus escaping or remaining in removed DOM;
- dark mode implemented by inversion rather than semantic tokens;
- responsive behavior that merely shrinks desktop instead of restructuring.

## Verification options

Be explicit with evidence labels (`rendered`, `static`, `model-judgment`, `not-checked`, `waived`). Browser rendering, screenshots, DOM/accessibility trees, axe scans, Playwright/Vitest Browser Mode/Storybook tests, Lighthouse, responsive emulation, and network throttling provide `rendered` evidence; builds, typechecks, and `jsdom` tests are `static` (or DOM-unit) evidence only and cannot prove visual quality.

## Framework and stack routing

- Read [references/html-css.md](references/html-css.md) when working directly in HTML/CSS, native `<dialog>`/`[popover]`/Anchor Positioning, Invoker Commands, customizable `<select>`, or browser-native primitives.
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
- Read [references/server-rendered.md](references/server-rendered.md) when building Rails 8/Hotwire, Laravel Livewire, Inertia.js v2, Django/`django-htmx`/Cotton, FastHTML, Phoenix LiveView, Blazor, or Go `templ` surfaces.
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
- Read [references/component-systems.md](references/component-systems.md) when selecting headless primitives (`@base-ui/react`, `radix-ui`, React Aria, Ark UI, Kobalte, Corvu, Reka UI, Bits UI), source-first kits (`shadcn/ui`, Park UI), enterprise suites, or Floating UI vs native popover.
- Read [references/state-architecture.md](references/state-architecture.md) when designing URL state (`nuqs`), server caches (TanStack Query/DB, tRPC v11, oRPC, Apollo), client stores (Zustand, Pinia, NgRx SignalStore, Legend-State), XState v5, or IndexedDB (`Dexie`, `idb`).
- Read [references/forms-validation.md](references/forms-validation.md) when implementing TanStack Form, React Hook Form, Conform, SvelteKit Superforms, Modular Forms, VeeValidate, or Zod v4/Valibot/ArkType Standard Schema validation.
- Read [references/build-and-architecture.md](references/build-and-architecture.md) when configuring Vite 8/Rolldown/Environment API, Rsbuild/Rspack, Turbopack, `tsdown`, Bun, Biome/Oxlint, React Compiler, rendering modes, microfrontends, Web Workers, WASM, or Serwist/Workbox.
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
- Read [references/scene-architecture.md](references/scene-architecture.md) when architecting Three.js scenes, `WebGPURenderer` (`three/webgpu`), or TSL (`three/tsl`) node materials.
- Read [references/r3f-integration.md](references/r3f-integration.md) when integrating React Three Fiber v9, `@react-three/postprocessing`, `@react-three/rapier`, and demand rendering (`invalidate`).
- Read [references/web-3d-engines.md](references/web-3d-engines.md) when choosing or implementing `<model-viewer>`, Babylon.js, PlayCanvas, Threlte v8, TresJS v5, luma.gl v9, or `regl`.
- Read [references/assets-pipeline.md](references/assets-pipeline.md) when optimizing GLB/glTF pipelines with `gltf-transform`, Meshopt, Draco, KTX2/Basis textures, and LODs.
- Read [references/rendering-performance.md](references/rendering-performance.md) when budgeting GPU frame times, DPR caps, offscreen pausing, and WebGL context loss/restoration.
- Read [references/rendering-choice.md](references/rendering-choice.md) when choosing DOM/SVG/Canvas 2D/PixiJS v8/WebGL/WebGPU and capability-detecting GPU backends.
- Read [references/shader-workflow.md](references/shader-workflow.md) when writing or debugging GLSL, WGSL, or TSL shaders with precision and reduced-motion uniforms.
- Read [references/creative-effects.md](references/creative-effects.md) when implementing deterministic seeded particle/noise/displacement effects and frozen-time QA hooks.
- Read [references/audio-reactive.md](references/audio-reactive.md) when wiring Web Audio `AnalyserNode`/`AudioWorklet` pipelines with StrictMode-safe `createMediaElementSource` guards.
- Read [references/video-media.md](references/video-media.md) when configuring AV1/HEVC/VP9/H.264 `<video>` delivery or `requestVideoFrameCallback` video textures.
- Read [references/media-players.md](references/media-players.md) when selecting or wiring Vidstack, Media Chrome, Mux Player, `hls.js` (`ManagedMediaSource`), Shaka, `dash.js`, Video.js, `wavesurfer.js`, `Howler.js`, or `Tone.js`.
- Read [references/accessibility-performance.md](references/accessibility-performance.md) when verifying `<track>` captions/descriptions, WCAG 2.2.2 pause controls, WCAG 2.3.1 flash limits, and media performance budgets.
