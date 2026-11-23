# F# Fable: Feliz/Elmish

## Token mapping

Use generated CSS variables/semantic classes through Feliz props or imported stylesheets. Keep theme selection in typed domain state when behavior depends on it, but do not duplicate visual constants as untraceable inline F# style lists.

## Layout and responsive idioms

Feliz compiles F# to React/browser DOM. Use semantic HTML/CSS layout and explicit responsive behavior. Elmish Model–Update–Msg architecture owns application state; visual composition remains DOM truth.

## Typography/custom fonts

Declare webfonts/assets in host HTML/CSS and use semantic classes. Type-safe CSS helpers help correctness but do not choose a voice, fallback chain, scaling behavior, or localization coverage for you.

## Motion/reduced motion

Prefer CSS with `@media (prefers-reduced-motion: reduce)`. Use Fable browser interop (`Browser.Dom.window.matchMedia`) only when animation state must depend on the preference. Keep effectful subscriptions explicit in Elmish commands/subs.

## Accessibility specifics

Feliz emits React elements; use semantic tags, labels, keyboard handlers, focus management, ARIA only when needed, and visible focus. F# type safety does not verify names/roles or prevent focus loss. Validate generated DOM rather than inferring from types.

## States idiom

Elmish excels at explicit state machines. Model loading/empty/error/offline/permission/optimistic state in domain types and reject impossible combinations. Preserve input and validation context across failed commands/navigation.

## Forms idiom

Use real forms/labels/types/autocomplete/inputmode and controlled input patterns that preserve cursor/IME composition. Validate at blur/submit boundaries, map server errors to fields, and never discard model input because a command failed.

## Do/don't pairs

| Do | Don't |
|---|---|
| `Html.button [ prop.type' "submit"; prop.text "Save" ]` | clickable div with no keyboard semantics |
| explicit Elmish async union states | bool/Maybe combinations permitting impossible UI |
| `window.matchMedia` reduced-motion check | assuming React/Fable reads OS preference automatically |
| semantic CSS classes | long repeated inline style lists in every component |

## Known traps

Interop impedance mismatch, bundle splitting/startup, typed model divergence from actual server contract, hot reload hiding initialization bugs, focus/caret behavior in controlled inputs, inaccessible imported React components.

## Verification commands

```sh
dotnet test
dotnet fable watch src --run webpack
npm test
npx playwright test
```

Inspect generated DOM/accessibility tree, browser keyboard/focus behavior, offline/server failure, text scaling/localization, reduced-motion emulation, production bundle behavior.
