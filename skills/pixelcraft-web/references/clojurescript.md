# ClojureScript: UIx v2, Helix, and Reagent / re-frame

## Wrapper selection

| Library | React integration model | Best fit | Primary trade-off |
|---|---|---|---|
| **UIx v2 (`uix.core`)** | Zero-overhead React 18/19 wrapper (`defui`, `$`, `use-state`, `use-effect`, `use-ref`, Suspense, Error Boundaries) | New ClojureScript React 18/19 apps interoping cleanly with modern React hooks & headless UI libraries | Explicit React hook rules apply (use `uix.linter` / `clj-kondo` hooks) |
| **Helix (`helix.core`)** | Thin macro-based React hooks wrapper (`defnc`, `$`, `helix.hooks`) | Minimal React 18/19 interop with near-zero runtime abstraction | Smaller battery-included ecosystem than re-frame |
| **Reagent + re-frame** | Hiccup vectors + reactive atoms (`ratom`) + event/subscription graph | Existing Reagent/re-frame codebases and structured event-driven apps | Reagent wrapper indirection adds friction with React 18/19 concurrent hooks & modern JS libraries |

## Token mapping

Emit CSS variables/semantic classes and consume them in UIx/Helix `$` props (`:class`) or Reagent hiccup. Keep visual constants in CSS/theme assets; do not scatter hex/style maps through every view. Global state (context, atom, or re-frame subscription) may control the root theme attribute/class.

## Layout and responsive idioms

All three produce React-powered DOM. Use ordinary semantic HTML/CSS layout; ClojureScript components should expose composition without hiding markup semantics. re-frame owns event/subscription flow, not visual layout truth.

## Typography/custom fonts

Configure fonts in static CSS/HTML and map semantic type classes. Verify keyword/class naming, fallback, scaling, localization expansion, and hydration/initial render behavior.

## Motion/reduced motion

Use CSS or deliberate React-compatible animation libraries only when needed. Read `prefers-reduced-motion` through CSS or browser interop (`js/window.matchMedia` inside `use-effect` with cleanup); do not trigger animation purely because a ratom or state hook changed.

## Accessibility specifics

Neither `$` props nor Hiccup keywords enforce accessibility. Use real controls, labels (`:html-for` / `:for` matching the chosen wrapper), visible focus, keyboard events, focus restoration after mutation/dialog close, and browser validation semantics. Avoid div-click handlers.

## UIx v2 & Helix (React 18/19 hooks) idioms

In **UIx v2** (`defui` + `$`) and **Helix** (`defnc` + `$`), follow React 18/19 rules directly: use `use-id` for SSR-safe unique `<label>`/`aria-describedby` IDs, clean up observers/listeners in `use-effect` return functions (never return a non-function/nil carelessly—UIx enforces JS `undefined` vs cleanup fn), and interop with headless React primitives (`@base-ui/react`, `react-aria-components`, `radix-ui`) directly via `$`:

```clojure
;; UIx v2 idiom (React 18/19 hooks + semantic form controls)
(ns app.invoice-form
  (:require [uix.core :as uix :refer [defui $]]))

(defui invoice-form [{:keys [on-save pending? error]}]
  (let [input-id (uix/use-id)
        error-id (str input-id "-err")
        [email set-email] (uix/use-state "")]
    ($ :form {:on-submit (fn [e]
                           (.preventDefault e)
                           (on-save email))}
       ($ :label {:html-for input-id} "Billing email")
       ($ :input {:id input-id
                  :type "email"
                  :auto-complete "email"
                  :value email
                  :aria-invalid (boolean error)
                  :aria-describedby (when error error-id)
                  :on-change #(set-email (.. % -target -value))})
       (when error
         ($ :p {:id error-id :role "alert"} error))
       ($ :button {:type "submit" :disabled pending?}
          (if pending? "Saving…" "Save invoice")))))
```

## States & Forms idiom

Model async state explicitly (tagged maps or Malli/Spec schemas: `:idle`, `:loading`, `:empty`, `:partial`, `:error`, `:offline`, `:optimistic`) instead of unrelated booleans. Preserve values after failed submit and map server validation back to fields; do not block paste or validate destructively on every keystroke.

## Do/don't pairs

| Do | Don't |
|---|---|
| UIx v2 `($ :label {:html-for id} "Email")` / Reagent `[:label {:for id} "Email"]` | Placeholder-only input |
| `($ :button {:type "submit"} "Save")` / `[:button {:type "submit"} "Save"]` | Clickable `div` pretending to be a button |
| UIx v2 / Helix for new React 18/19 hook & third-party React library interop | Wrapping React 19 hook components inside Reagent class adaptors unnecessarily |
| Explicit async state maps/tags in state or re-frame `app-db` | Unrelated booleans hiding empty/error/loading conflicts |
| Cleanup function returned from `use-effect` and focus restoration on close | Leaking listeners or dropping focus on rerender/unmount |

## Known traps

Returning non-cleanup values from `use-effect` in React interop, stale subscriptions, untyped `app-db` drift, keyword typos invisible at compile time, Reagent `r/adapt-react-class` friction with React 19 hooks, rerender focus/caret loss, inaccessible wrapped React components.

## Verification commands

```sh
clojure -M:test
npx shadow-cljs compile app
npx shadow-cljs watch app
npx playwright test
```

Inspect DOM/accessibility tree, keyboard/focus behavior, production advanced-compiled output (`release`), offline/server errors, reduced motion, and localization/text scaling (`rendered`).
