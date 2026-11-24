# Rust web: Leptos, Dioxus Web, Yew, and Axum + Askama/Maud + htmx

## Stack selection

| Stack | Rendering model | Best fit | Primary trade-off |
|---|---|---|---|
| **Leptos (0.7 / 0.8)** | Fine-grained signals + SSR + `#[island]` selective hydration + `#[server]` RPC | Full-stack Rust apps needing reactive client UI with minimal WASM hydration | Requires disciplined SSR/hydrate feature gating (`#[cfg(feature = "ssr")]`) |
| **Dioxus Web (0.6 / 0.7)** | `rsx!` macros, `use_signal`/`use_resource`, Dioxus Fullstack `#[server]` | Teams sharing Rust UI across web, desktop, and mobile | Virtual-DOM diffing + larger initial WASM download if full-page hydrated |
| **Yew** | Component/hook VDOM compiled to WASM | Existing Yew SPAs and client-side WASM tools | Heavier VDOM/WASM footprint; smaller SSR/islands ecosystem than Leptos |
| **Axum + Askama / Maud + htmx** | Zero-WASM server-rendered HTML templates + htmx partial swaps | Content, admin, and form-heavy Rust web apps prioritizing instant first load | Rich offline/canvas interactions still require small targeted JS or WASM islands |

## Token mapping

Compile once to WASM (or render templates from Axum) and style real DOM with CSS. Import generated CSS variables in root HTML/CSS; consume semantic classes/custom properties rather than generating inline hex from Rust. Theme state should be a signal or cookie/header mapped to a root class or `data-theme`.

## Layout and responsive idioms

Use HTML/CSS layout, semantic landmarks, container/media queries, and SSR/hydration boundaries deliberately. In **Leptos 0.7/0.8**, annotate only interactive subtrees with `#[island]` when `islands` mode is enabled so static markup never ships WASM code. Do not copy a monolithic SPA bundle when islands or Axum + Askama/Maud + htmx suffice.

## Typography/custom fonts

Declare font files in static assets/root HTML with subset and fallback policy. Respect browser text scaling; verify WASM loading does not block readable initial HTML where SSR exists.

## Motion/reduced motion

Prefer CSS transitions/keyframes with `@media (prefers-reduced-motion: reduce)`. For Rust-side state use `web_sys::window().and_then(|w| w.match_media("(prefers-reduced-motion: reduce)").ok().flatten())`; in Leptos, `leptos_use::use_prefers_reduced_motion()` wraps this safely. Never assume `window()` exists during SSR.

## Accessibility specifics

Rust/WASM has no automatic accessibility advantage. Emit semantic HTML/ARIA attributes exactly as browser markup; manage focus after hydration/navigation; keep keyboard behavior and labels in generated DOM. Canvas/SVG widgets need explicit text alternatives/focus semantics.

## Modern Leptos 0.7/0.8, Dioxus Web, and Axum + Askama/Maud idioms

- **Leptos 0.7 / 0.8**: signals no longer take a `Scope` (`cx`) argument—use **`let (count, set_count) = signal(0);`** or **`let count = RwSignal::new(0);`** with `.get()`/`.set()`/`.update(...)`. Mark interactive islands with **`#[island]`**, define typed server RPCs with **`#[server]`** (`ServerFn`), and bind progressive HTML forms with **`<ActionForm action=save_action>`** so submissions work even before WASM loads.
- **Dioxus Web (0.6 / 0.7)**: use `rsx!`, `use_signal`, `use_memo`, and `use_resource` for async states (`None` loading, `Some(Err(...))` error, `Some(Ok(...))` data), plus `#[server]` functions in Dioxus Fullstack (`dx serve --platform web`).
- **Axum + Askama / Maud + htmx**: render compile-time checked HTML via Askama (`#[derive(Template)]`) or Maud (`html! { ... }`), return full pages on normal requests and fragments when the `HX-Request` header is present (with `Vary: HX-Request`), and follow `htmx-alpine.md` swap/focus hygiene.

```rust
// Leptos 0.7/0.8: #[server] + #[island] + <ActionForm> + RwSignal::new
use leptos::prelude::*;

#[server(SaveNote, "/api")]
pub async fn save_note(title: String) -> Result<String, ServerFnError> {
    if title.trim().is_empty() {
        return Err(ServerFnError::new("Title is required."));
    }
    Ok(title)
}

#[island]
pub fn NoteComposer() -> impl IntoView {
    let save = ServerAction::<SaveNote>::new();
    let title = RwSignal::new(String::new());
    let pending = save.pending();

    view! {
        <ActionForm action=save>
            <label for="note-title">"Title"</label>
            <input id="note-title" name="title" bind:value=title required />
            <button type="submit" disabled=move || pending.get()>
                {move || if pending.get() { "Saving…" } else { "Save note" }}
            </button>
        </ActionForm>
    }
}
```

## States & Forms idiom

Use resources/futures/signals (`Resource`, `use_resource`, `ActionForm`) or Axum HTTP 422 fragments for loading/error/empty/offline/permission states. Preserve input across failed actions and make retry/cancellation explicit. Treat hydration mismatch as UX failure.

## Do/don't pairs

| Do | Don't |
|---|---|
| `RwSignal::new(...)` / `signal(...)`, `#[island]`, and `<ActionForm>` in Leptos 0.7/0.8 | Copy obsolete Leptos 0.5 `create_signal(cx, ...)` code or hydrate entire static pages |
| Choose Axum + Askama/Maud + htmx when zero-WASM fast SSR fits the UI | Ship a multi-megabyte WASM bundle just to render CRUD forms |
| `view! { <label for="email">"Email"</label><input id="email" type="email" autocomplete="email" /> }` | Clickable `<div>`s reconstructed in Rust |
| Guard `web_sys::window()` behind client-only branches or `leptos_use` | Panic during SSR by unwrapping `window()` unconditionally |
| Semantic CSS variables imported at document root | Hex literals embedded inside Rust view macros |

## Known traps

SSR/browser-only API mismatch, legacy Leptos `cx` scope signatures copied from old tutorials, unoptimized debug WASM sizes, hydration mismatch, focus loss across async replacement, assuming Rust type safety verifies ARIA/labels/contrast, missing `Vary: HX-Request` on Axum + htmx endpoints.

## Verification commands

```sh
cargo test
cargo clippy -- -D warnings
cargo leptos watch     # Leptos full-stack projects
dx serve --platform web # Dioxus Web projects
trunk serve            # Yew / static WASM projects
npx playwright test    # browser behavior
```

Inspect pre-hydration HTML (`static`/no-JS `rendered`), post-hydration DOM/accessibility tree, WASM payload under network throttling, keyboard-only flow, and reduced-motion emulation (`rendered`).
