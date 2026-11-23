# Scala.js Laminar

## Token mapping

Use generated CSS variables/semantic classes in Laminar/Scala DOM Types. Reactive theme state can be a `Var`/signal controlling a root class, but visual constants belong in CSS/design-token assets rather than repeated inline styles.

## Layout and responsive idioms

Laminar has no virtual DOM; elements are real DOM with fine-grained Airstream updates. Use semantic HTML/CSS responsive layout and explicit ownership of dynamic nodes. Router state/deep links belong in URL-aware application state.

## Typography/custom fonts

Configure fonts in static HTML/CSS; verify fallback/subsets/scaling/localization. Use semantic type classes rather than inline font sizes in every element.

## Motion/reduced motion

Use CSS transitions/keyframes and `@media (prefers-reduced-motion: reduce)` first. Browser media query state can be read through scala-js-dom when reactive behavior depends on it. Do not use stream timing as decoration that masks state errors.

## Accessibility specifics

Scala DOM Types exposes HTML attributes/props/ARIA-like browser behavior, but type safety does not enforce semantics. Use labels, real buttons/links/forms, focus restoration after dynamic insertion/removal, keyboard paths, and visible focus. Validate the actual DOM/accessibility tree.

## States idiom

Airstream signals/events should model loading/empty/error/offline/stale/permission/optimistic states explicitly. Avoid sample/combine patterns that drop errors or leave stale data indistinguishable from current data. Preserve input across validation/server failure.

## Forms idiom

Use native forms/labels/types/autocomplete/inputmode. Controlled inputs need careful cursor/focus behavior because fine-grained updates may replace nodes. Validate at blur/submit and map server errors without clearing values.

## Do/don't pairs

| Do | Don't |
|---|---|
| `label(forId := "email", "Email")` | placeholder-only input |
| real `button`/`form` elements | clickable divs driven by event streams |
| explicit async state ADT | unlabeled stale data after failed refresh |
| semantic class tokens | repeated inline color/style literals |

## Known traps

Unexpected element replacement causing focus loss, stream lifecycle leaks, missing keys in dynamic lists, Scala.js bundle size/compile-time hiding UX failure, exception paths that never surface in UI, imperative DOM interop divergence.

## Verification commands

```sh
sbt test
sbt fastLinkJS
sbt fullLinkJS
npx playwright test
```

Inspect production/fast output differences, DOM/focus/accessibility behavior, offline/server failure, reduced motion, browser zoom/text scaling, localization expansion.
