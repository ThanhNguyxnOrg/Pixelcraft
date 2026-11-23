# Kotlin web: Compose Multiplatform Web and Kobweb

## Token mapping

Kobweb uses Compose HTML/DOM concepts and Silk-style theme objects/CSS variables; map DTCG output into semantic theme singletons plus generated CSS. Compose Multiplatform Web may draw through its own rendering pipeline/canvas depending mode; decide whether DOM semantics or shared Compose rendering is intentional before styling.

## Layout and responsive idioms

Kobweb/Compose HTML: use real CSS grid/flex/media/container queries and semantic elements. Compose Web canvas: shared modifiers/layouts can reuse mobile knowledge but browser text selection, semantics, zoom, and deep links require explicit validation.

## Typography/custom fonts

Register webfont assets/stylesheet and map semantic type roles in Kotlin theme. Never assume mobile font assets behave identically in browser; verify fallback, FOUT/CLS, scaling, localization glyphs.

## Motion/reduced motion

Use CSS media queries in DOM mode. In Kotlin/browser interop read `window.matchMedia("(prefers-reduced-motion: reduce)")`; gate Compose animation specs/canvas effects accordingly. SSR or first paint must not depend on animation completion.

## Accessibility specifics

DOM-mode Kobweb can produce semantic HTML—use real tags/labels. Canvas-rendered Compose Web may expose weaker browser accessibility depending target/version; do not claim screen-reader parity without testing the actual rendering mode. Manage focus/routes and keyboard interaction.

## States idiom

Model routing, loading/error/empty/offline/permission states in Kotlin state holders. Keep URLs/deep links meaningful. Preserve input across navigation/server failure and avoid blank canvas while static content could render.

## Forms idiom

In DOM mode use `<form>`, labels, autocomplete/inputmode, constraint validation and server round-trip errors. In canvas/shared Compose mode verify paste, IME composition, keyboard type, focus traversal, browser autofill limitations, and validation timing honestly.

## Do/don't pairs

| Do | Don't |
|---|---|
| choose Kobweb DOM for semantic content/forms | choosing canvas Compose merely to reuse mobile code |
| `window.matchMedia("(prefers-reduced-motion: reduce)")` | assuming Compose honors web reduced motion automatically |
| semantic Kotlin theme object | scattered `Color(0xff…)` constants |
| real URL/form fallback | blank WASM canvas with no useful failure state |

## Known traps

Confusing Compose HTML with canvas Compose UI, bundle size/startup, browser semantics loss, SEO/deep-link gaps, duplicate routing ownership, font/glyph mismatch, thinking Kotlin type safety implies accessibility.

## Verification commands

```sh
./gradlew build
./gradlew jsBrowserTest
./gradlew jsBrowserDevelopmentRun
npx playwright test
```

Inspect initial HTML/DOM versus canvas pixels, keyboard/focus/accessibility tree, network failure, bundle size, browser zoom/text scaling, reduced motion, back/deep-link behavior.
