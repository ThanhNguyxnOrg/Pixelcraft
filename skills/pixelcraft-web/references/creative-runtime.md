# Creative runtime integration for web

Use this when a web project combines DOM UI with animation, canvas, 3D, graphics, or media. Preserve the existing stack and make the creative runtime an isolated enhancement.

## SSR & island boundary (React, Vue/Nuxt, SvelteKit, Astro, SolidStart)

- Keep SEO, copy, forms, and stateful product UI server-rendered when possible.
- Isolate Motion, GSAP, Three.js/R3F/Threlte/TresJS, PixiJS, and Web Audio inside narrow client boundaries (`'use client'` + dynamic import in Next.js, `.client.vue` / `<ClientOnly>` in Nuxt, `onMount` in SvelteKit, `client:visible` in Astro, `clientOnly()` in SolidStart).
- Dynamically import heavyweight renderers and large scenes; render a sized poster/DOM fallback first so CLS stays near zero.
- Never convert an entire route into a client-only bundle for one interactive canvas or animated CTA.
- Ensure SSR output never depends on `window`, `Math.random()`, `Date.now()`, or GPU probing; initialize nondeterministic effects after mount or use a fixed seed (`creative-effects.md`).

## Ownership matrix

| Surface | Primary owner | Keep in DOM |
|---|---|---|
| UI state, layout/gesture | CSS or Motion (`motion/react` / vanilla `motion`) | All controls, focus order, and state labels |
| Choreographed timeline | GSAP (`gsap.md`) | Headings, navigation, form controls |
| 3D scene | Three.js / R3F / Babylon / Threlte / TresJS / `<model-viewer>` | Product data, options, purchase/navigation |
| 2D GPU scene | PixiJS v8 / Canvas 2D / WebGL / WebGPU | Headings, CTAs, instructions, accessible summaries |
| Audio / video | HTML media / Web Audio / Vidstack / Media Chrome / Tone.js | Play/mute/pause, captions, transcript |

Avoid duplicate animation ownership on the same properties. Coordinate scroll engines with the single controller selected in the plan.

## Loading and failure states

- Load scene code/assets on demand and avoid blocking first content.
- Show a poster/placeholder with stable dimensions.
- Handle unsupported APIs, missing assets, network failure, WebGL/WebGPU context loss, and media playback rejection.
- Keep ordinary navigation and content functional if the creative runtime fails.

## Cross-skill handoff

Pair browser runtime implementation here with `pixelcraft-craft` (motion/color/typography budgets), `pixelcraft-patterns` (narrative/scrollytelling structure), `pixelcraft-accessibility` (reduced-motion and non-visual parity), and `pixelcraft-visual-qa` (timeline capture and device performance budgets). For embodied XR/VR/AR headset UX, route to `pixelcraft-spatial`.
