# Tauri (v2)

## Token mapping

Use generated DTCG CSS custom properties inside the WebView exactly as web UI, while mirroring semantic theme values for native shell surfaces (window background color on launch to prevent white flash in dark mode, native menus, tray icons, and dialogs) in Rust / `tauri.conf.json`.

## Tauri v2 IPC: commands, streaming `Channel`, & binary `Response`

Design backend communication around explicit typed contracts and non-blocking async Rust commands:

- **`#[tauri::command]`**: declare `async fn` returning `Result<T, E>` (serialized errors) for I/O or CPU work so the UI never freezes and the frontend receives structured error states.
- **`tauri::ipc::Channel<T>`**: use `Channel` for ordered, high-throughput streaming (build logs, AI token streams, download progress) instead of broadcasting global `app.emit(...)` events across every window.
- **`tauri::ipc::Response`**: return `tauri::ipc::Response::new(bytes)` for binary payloads (images, audio buffers, Arrow/Parquet chunks) to bypass JSON serialization overhead.

```rust
use tauri::ipc::{Channel, Response};

#[tauri::command]
async fn export_report(
    id: String,
    on_progress: Channel<u8>,
) -> Result<Response, String> {
    on_progress.send(25).map_err(|e| e.to_string())?;
    let pdf_bytes: Vec<u8> = generate_pdf(&id).await.map_err(|e| e.to_string())?;
    on_progress.send(100).map_err(|e| e.to_string())?;
    Ok(Response::new(pdf_bytes))
}
```

## Official v2 plugins & capability-based ACLs

- **Capabilities (`src-tauri/capabilities/*.json`)**: grant least-privilege permissions scoped explicitly by `windows` and `platforms` (`["linux", "macOS", "windows"]` vs `["iOS", "android"]`). Never open broad `remote.urls` wildcards unless audited.
- Prefer official Tauri v2 plugins for standard desktop behavior instead of hand-rolling fragile hacks:
  - **`tauri-plugin-window-state`**: persists and safely clamps window size/position/maximized state across launches.
  - **`tauri-plugin-store`**: lightweight persisted settings/preferences store.
  - **`tauri-plugin-updater`**: signed in-app updates with explicit restart/defer UX.
  - **`tauri-plugin-single-instance`**: focuses the existing window and forwards CLI/file-open args instead of spawning duplicate instances.
  - **`tauri-plugin-deep-link`**: handles custom URL schemes (`myapp://...`) cleanly on both cold start and warm launch.

## Window chrome, drag regions, & macOS Overlay titlebar

Decide between native titlebars and integrated chrome upfront:

- On macOS, set `"titleBarStyle": "Overlay"` (and `"hiddenTitle": true` when providing a custom header) in `tauri.conf.json`, reserving safe left-side clearance (~`72–80 px`) so traffic-light buttons never collide with sidebar toggles or tabs.
- Mark draggable chrome with **`data-tauri-drag-region`**, and ensure interactive controls inside headers (`<button>`, `<input>`, tabs) sit in non-drag child containers or do not inherit drag-swallowing pointer behavior so clicks and double-click maximize remain reliable.
- Support minimum window sizes (`minWidth`, `minHeight`), DPI changes across monitors, and native menus (`tauri::menu`) + keyboard accelerators so desktop shortcuts are discoverable in the OS menu bar.

## Typography, motion, accessibility, states, & forms idioms

Bundle custom web fonts locally so desktop apps work identically offline. Honor `@media (prefers-reduced-motion: reduce)` inside the WebView and verify actual propagation on WebView2 (Windows), WKWebView (macOS), and WebKitGTK (Linux).

Web accessibility inside the WebView is necessary but insufficient: verify native menus, global/window shortcuts, tray menus, file dialogs (`tauri-plugin-dialog`), custom titlebar buttons, and multi-window focus restoration per OS. Model desktop process states explicitly (Rust backend init errors, updater restart prompt, file permission denial, single-instance handoff, unsaved-document close intercept via `on_window_event(WindowEvent::CloseRequested)`).

## Tauri v2 mobile targets

When sharing a Tauri v2 codebase across desktop and iOS/Android, isolate mobile plugins (biometrics, NFC, haptics) in platform-scoped capability files and pair mobile WebView ergonomics with `pixelcraft-mobile` safe-area and touch-target rules.

## Do/don't pairs

| Do | Don't |
|---|---|
| Stream progress/logs via `tauri::ipc::Channel<T>` and binary data via `ipc::Response` | Serialize megabyte buffers as JSON arrays or spam global window events |
| Scope `src-tauri/capabilities/*.json` per window and platform | Grant wildcard permissions or untrusted `remote.urls` access |
| Use `tauri-plugin-window-state` + `tauri-plugin-single-instance` | Hand-roll un-clamped window restore or allow accidental duplicate instances |
| Reserve traffic-light inset with `titleBarStyle: "Overlay"` and clean `data-tauri-drag-region` | Cover macOS traffic lights or let drag regions intercept header button clicks |
| Intercept `WindowEvent::CloseRequested` to guard unsaved work | Let window close discard unsaved edits without warning |

## Known traps

WebView engine differences (WKWebView vs WebView2 vs WebKitGTK CSS/backdrop/font quirks), white launch flash when `backgroundColor` isn't set before WebView hydration, CSP blocking bundled assets or IPC, forgetting to register a plugin's capability permission in `capabilities/*.json`, synchronous `#[tauri::command]` blocking the main thread, cold-start deep links firing before frontend listeners mount.

## Verification commands

```sh
cargo tauri info
npm run build
cargo test --manifest-path src-tauri/Cargo.toml
cargo tauri dev
cargo tauri build
```

`cargo tauri info`, `npm run build`, and `cargo test` provide environment and `static` evidence. Run packaged or `cargo tauri dev` builds on each target OS (macOS/Windows/Linux) to verify native menus, custom titlebars, drag regions, DPI scaling, screen readers, and dirty-close behavior for `rendered` evidence; browser-only dev preview is inner-DOM evidence only—label untested OSes `not-checked`.
