# Leptos and Yew (Rust web)

## Token mapping

Compile once to WASM but style real DOM with CSS. Import generated CSS variables in root HTML/CSS; consume semantic classes/custom properties rather than generating inline hex from Rust. Leptos/Yew theme state should be a signal/property mapped to a root class or `data-theme`.

## Layout and responsive idioms

Use HTML/CSS layout, semantic landmarks, container/media queries, and SSR/hydration boundaries deliberately. Leptos favors fine-grained signals; Yew uses component/function state and callbacks. Do not copy a virtual-DOM SPA architecture into either.

## Typography/custom fonts

Declare font files in static assets/root HTML with subset and fallback policy. Respect browser text scaling; verify WASM bundle/loading does not block readable initial HTML where SSR exists.

## Motion/reduced motion

Prefer CSS transitions/keyframes with `@media (prefers-reduced-motion: reduce)`. For Rust-side state use `web_sys::window().match_media("(prefers-reduced-motion: reduce)")`; in Leptos, `leptos_use::use_prefers_reduced_motion()` is available when using that utility crate. SSR must not assume a window object.

## Accessibility specifics

Rust/WASM has no automatic accessibility advantage. Emit semantic HTML/ARIA attributes exactly as browser markup; manage focus after hydration/navigation; keep keyboard behavior and labels in generated DOM. Canvas/SVG widgets need explicit text alternatives/focus semantics.

## States idiom

Use resources/futures/signals or Yew state hooks for loading/error/empty/offline/permission states. Preserve input across failed actions and make retry/cancellation explicit. Treat hydration mismatch as UX failure.

## Forms idiom

Use actual `<form>`, `<label>`, `<input>`, validation attributes, autocomplete/inputmode, and progressive enhancement where SSR routes exist. Controlled inputs must preserve composition/paste and report recoverable errors.

## Do/don't pairs

| Do | Don't |
|---|---|
| `view! { <label for="email">"Email"</label><input id="email" type="email"> }` | clickable divs reconstructed in Rust |
| `match media` reduced-motion signal before custom motion | assuming WASM inherits OS behavior automatically |
| semantic CSS variables | hex literals embedded in every component |
| SSR resource error branch | spinner-only shell after hydration failure |

## Known traps

SSR/browser-only API mismatch, hydration mismatch, large WASM startup, focus loss across async replacement, weak font/ARIA inspection because Rust types compile, leaking browser globals into server rendering.

## Verification commands

```sh
cargo test
cargo clippy -- -D warnings
trunk serve          # Yew/static WASM where applicable
cargo leptos watch   # Leptos full-stack projects
npx playwright test  # browser behavior
```

Inspect pre-hydration HTML, post-hydration DOM/accessibility tree, network throttling/offline, keyboard-only flow, and reduced-motion emulation.
