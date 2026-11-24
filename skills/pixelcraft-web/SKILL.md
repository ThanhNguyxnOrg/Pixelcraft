---
name: pixelcraft-web
description: Translates Pixelcraft direction, tokens, UX, and floor requirements into idiomatic web UI across HTML/CSS, React/Next, Vue/Nuxt, Svelte, Solid, Angular, Astro, Qwik, htmx/Alpine, Lit, Tailwind, server-rendered stacks, Rust/Leptos/Yew, Kotlin web, Elm, ClojureScript, F#/Fable, Scala/Laminar, and Java web. Use when building or reviewing browser UI, routing/navigation, responsive layout, forms, states, motion, accessibility, rendering performance, hydration, or web component behavior.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft web

Use this skill when the rendering surface is HTML/CSS/DOM, including server-rendered pages and hybrid islands. Do not assume React or Tailwind; detect the actual framework nearest the changed files.

## Surface craft

Use one memorable device when the brief warrants it: a real product as the spatial anchor, editorial rows around comparable facts, or expressive type constrained by an underlying grid. Keep navigation and primary controls ordinary. Inspect normal scroll, mobile reflow, first-load payload and the reduced-motion path; never trade orientation for scroll hijacking, a custom cursor or delayed essential content.

## Detection signals

`package.json` dependencies, framework config files, template extensions, server routes/controllers, component imports, CSS/Tailwind entry files, hydration/islands markers, and server framework conventions. Multiple web stacks can coexist; scope each decision to the route/component surface.

## Translate direction to web idioms

1. Convert semantic DTCG roles to CSS custom properties or the framework's theme object; primitives remain hidden behind semantic names.
2. Express composition with layout primitives appropriate to the surface: CSS grid/flex/container queries/logical properties before framework-specific utility soup.
3. Choose rendering strategy deliberately: static, server-rendered, streamed, client hydration, island, SPA, or enhanced partial. Do not hydrate the whole page for one small control.
4. Implement interaction with real HTML semantics first (`a`, `button`, `form`, `label`, `dialog` where appropriate), then framework behavior.
5. Connect state matrix rows to route/cache/network behavior: loading, empty, error, offline, stale, unauthorized, optimistic rollback, and deep-link restoration.
6. Honor `prefers-reduced-motion`, `prefers-color-scheme`, forced colors, text scaling, logical direction, keyboard/focus behavior, and browser/platform differences.

## Platform-wide rules

- Use logical properties (`margin-inline`, `inset-block`) for direction-sensitive layout; physical left/right only when the meaning is physical.
- Preserve form input across failed validation and auth redirects; use correct `autocomplete`, `inputmode`, type, and paste behavior.
- Native browser navigation/history/scroll restoration is part of UX. Do not break it with hash misuse or trapped SPA state.
- Measure actual rendering: cumulative layout shift, input latency, hydration blocking, font loading, image priority, and route transitions—not only bundle size.
- Avoid global resets or token overrides that destroy inherited project/system behavior.

## Common web-specific slop/UX failures

- centered hero + eyebrow + two CTAs + three cards regardless of content;
- div/span buttons with no keyboard/focus semantics;
- hydration delay making visible controls dead;
- infinite scroll without position recovery or accessibility alternative;
- sticky/fixed chrome obscuring focus or small-viewport content;
- Tailwind utility repetition mistaken for a token system;
- modal/dropdown focus escaping or remaining in removed DOM;
- dark mode implemented by inversion rather than semantic tokens;
- responsive behavior that merely shrinks desktop instead of restructuring.

## Verification options

Be explicit: browser rendering and interaction can be inspected here when a browser/toolchain is available; screenshots, DOM/accessibility tree, axe scans, Playwright/Cypress/component tests, Lighthouse, responsive/device emulation, and network throttling are possible. Their absence is `not-checked`, not failure-proof. Static inspection cannot prove visual quality.

- Read [references/gsap.md](references/gsap.md) for GSAP timelines, ScrollTrigger, plugins, React lifecycle, and cleanup.
- Read [references/motion-react.md](references/motion-react.md) for component/layout/gesture animation with Motion for React.
- Read [references/smooth-scroll.md](references/smooth-scroll.md) before adding Lenis or coordinating scroll controllers.
- Read [references/motion-recipes.md](references/motion-recipes.md) for loader, kinetic type, SVG, magnetic, FLIP, marquee, and page-transition recipes.
- Read [references/rive-lottie.md](references/rive-lottie.md) when choosing interactive state machines or vector playback.
- Read [references/scene-architecture.md](references/scene-architecture.md) for Three.js/R3F/Spline renderer and scene selection.
- Read [references/r3f-integration.md](references/r3f-integration.md) for React/Next.js 3D boundaries and lifecycle.
- Read [references/assets-pipeline.md](references/assets-pipeline.md) for GLTF/GLB, Draco, Meshopt, KTX2, LOD, and asset loading.
- Read [references/rendering-performance.md](references/rendering-performance.md) for GPU/frame/memory budgets and device evidence.
- Read [references/rendering-choice.md](references/rendering-choice.md) for SVG/Canvas/PixiJS/WebGL/WebGPU selection.
- Read [references/shader-workflow.md](references/shader-workflow.md) for GLSL/WGSL implementation and debugging.
- Read [references/creative-effects.md](references/creative-effects.md) for particles, displacement, procedural graphics, and deterministic effects.
- Read [references/audio-reactive.md](references/audio-reactive.md), [references/video-media.md](references/video-media.md), and [references/accessibility-performance.md](references/accessibility-performance.md) for interactive media runtime, controls, captions, and media budgets.
## Framework routing

- Read [references/adaptive-layout.md](references/adaptive-layout.md) when a web surface must work across phone, tablet, desktop, split window or different input modes.
- Read [references/html-css.md](references/html-css.md) when working directly in HTML/CSS or framework-independent browser behavior.
- Read [references/react-next.md](references/react-next.md) for React, Next.js, Remix-like React routing/hydration concerns.
- Read [references/vue-nuxt.md](references/vue-nuxt.md) for Vue/Nuxt.
- Read [references/svelte.md](references/svelte.md) for Svelte/SvelteKit.
- Read [references/solid.md](references/solid.md) for Solid/SolidStart.
- Read [references/angular.md](references/angular.md) for Angular.
- Read [references/astro.md](references/astro.md) for Astro content/islands architecture.
- Read [references/qwik.md](references/qwik.md) for Qwik resumability.
- Read [references/htmx-alpine.md](references/htmx-alpine.md) for hypermedia-driven htmx/Alpine interfaces.
- Read [references/lit-web-components.md](references/lit-web-components.md) for Lit/standards-based web components.
- Read [references/tailwind.md](references/tailwind.md) whenever Tailwind is the styling layer, especially v4 CSS-first configuration.
- Read [references/server-rendered.md](references/server-rendered.md) for Rails/Hotwire, Laravel/Blade/Livewire, Django/Jinja, Phoenix/LiveView, Blazor, and Go templ surfaces.
- Read [references/leptos-yew.md](references/leptos-yew.md) for Rust browser/WASM UI in Leptos or Yew.
- Read [references/kotlin-web.md](references/kotlin-web.md) for Compose Multiplatform Web/Kobweb.
- Read [references/elm.md](references/elm.md) for Elm.
- Read [references/clojurescript.md](references/clojurescript.md) for Reagent/re-frame ClojureScript.
- Read [references/fsharp-fable.md](references/fsharp-fable.md) for F#/Fable Feliz/Elmish.
- Read [references/scala-laminar.md](references/scala-laminar.md) for Scala.js/Laminar.
- Read [references/java-web.md](references/java-web.md) for Vaadin and Thymeleaf.
- Read [references/pwa.md](references/pwa.md) whenever the browser app must be installable, offline-capable, push-enabled, cache-managed, update-aware, or evaluated on iOS/iPadOS home-screen behavior.
