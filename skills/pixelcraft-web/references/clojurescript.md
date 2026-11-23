# ClojureScript: Reagent and re-frame

## Token mapping

Emit CSS variables/semantic classes and consume them in hiccup/Reagent components. Keep visual constants in CSS/theme assets; do not scatter hex/style maps through every view. Ratoms/re-frame subscriptions may control theme class selection at the root.

## Layout and responsive idioms

Reagent produces React-powered DOM. Use ordinary semantic HTML/CSS layout; Reagent components should expose composition without hiding markup semantics. re-frame owns event/subscription flow, not visual layout truth.

## Typography/custom fonts

Configure fonts in static CSS/HTML and map semantic type classes. Verify keyword/class naming, fallback, scaling, localization expansion, and hydration/initial render behavior.

## Motion/reduced motion

Use CSS or deliberate React-compatible animation libraries only when needed. Read `prefers-reduced-motion` through CSS or browser interop/subscription; do not trigger animation purely because a ratom changed.

## Accessibility specifics

Hiccup keywords can generate semantic elements and ARIA attributes, but nothing enforces them. Use labels/roles/names, visible focus, keyboard events, focus restoration after mutation/dialog close, and browser validation semantics. Avoid div-click handlers.

## States idiom

re-frame app-db should model async state explicitly rather than isolated booleans: idle/loading/success-empty/success-partial/error/offline/permission/stale/optimistic. Subscriptions must expose enough state for empty/error/recovery UX without leaking secrets.

## Forms idiom

Use real forms/labels/input types/autocomplete/inputmode. Controlled inputs need careful cursor/IME behavior; preserve values after failed submit and map server validation back to fields. Do not block paste or turn every keystroke into destructive validation.

## Do/don't pairs

| Do | Don't |
|---|---|
| `[:label {:for "email"} "Email"]` | placeholder-only input |
| `[:button {:type "submit"} "Save invoice"]` | `[:div {:on-click …}]` as a button |
| explicit async state in app-db | unrelated booleans hiding empty/error/loading conflict |
| focus restoration event | focus lost when reagent rerenders |

## Known traps

Stale subscriptions, enormous untyped app-db shape, keyword typos invisible to compile, rerender focus/caret loss, copy-paste React assumptions without understanding re-frame ownership, inaccessible component libraries.

## Verification commands

```sh
clojure -M:test
npx shadow-cljs compile app
npx shadow-cljs watch app
npx playwright test
```

Inspect DOM/accessibility tree, keyboard/focus behavior, hot-reload versus production output, offline/server errors, reduced motion, localization/text scaling.
