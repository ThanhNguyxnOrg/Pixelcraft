# Elm

## Token mapping

Use generated CSS variables and semantic HTML classes; Elm views should consume meaning (`ui-action-primary`) rather than hard-code colors. Shared constants can exist in Elm for dynamic behavior, but visual source of truth belongs in CSS/theme assets.

## Layout and responsive idioms

Elm architecture is Model–Update–View. Use `Browser.element/document/application` according to ownership; use real HTML and CSS responsive layout rather than measuring viewport in Elm unless interaction truly depends on it. Route state belongs in URL/model for application pages.

## Typography/custom fonts

Load fonts through static HTML/CSS with subsets/fallbacks. Keep text scaling and long localized strings fluid; compile-time type safety does not prevent clipping.

## Motion/reduced motion

Prefer CSS transitions/animations and `@media (prefers-reduced-motion: reduce)`. Use ports/subscription to media query only when motion behavior must affect Elm state. Keep animation completion out of correctness-critical state transitions.

## Accessibility specifics

Use `Html`, `Html.Attributes` and semantic elements; ARIA only where HTML cannot express meaning. Manage focus explicitly through `Browser.Dom.focus` tasks after route/dialog/list mutation. Elm's virtual DOM does not automatically produce names, roles, landmarks, or focus order.

## States idiom

Model impossible states precisely: remote data as `NotAsked/Loading/Success/Failure` or richer state. Cover empty, partial, offline, unauthorized, optimistic rollback, retry, deep-link restore, and stale data in the model rather than ad hoc booleans.

## Forms idiom

Use forms/labels/types/autocomplete/inputmode and preserve model input on failed validation/server submit. Validate at appropriate blur/submit boundaries; server errors map back to fields without clearing input. Use ports only when native browser behavior truly cannot do the job.

## Do/don't pairs

| Do | Don't |
|---|---|
| `Html.label [ for "email" ] [ text "Email" ]` | unlabeled placeholder-only input |
| explicit `RemoteData` branches | nested Bool/Maybe soup with impossible states |
| `Browser.Dom.focus` after dialog opens | leaving focus in deleted virtual DOM |
| CSS reduced-motion media query | timer-driven decorative motion by default |

## Known traps

Focus tasks requiring element IDs, ports bypassing Elm invariants, URL/model drift, inaccessible custom widgets, over-modeling visual state, runtime decoder failure causing blank/error screens, test-only happy paths.

## Verification commands

```sh
elm make src/Main.elm
elm-test
elm-review
npx playwright test
```

Inspect browser rendering, keyboard/focus flow, route/deep-link restore, offline/server failure, screen reader semantics, text scaling, and reduced-motion emulation.
