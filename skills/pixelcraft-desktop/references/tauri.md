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

## The 8 WebView Giveaway Killers & Tauri v2 shell craft

Every Tauri v2 desktop app must eliminate the 8 browser-in-a-box giveaways so the app feels indistinguishable from native OS software:

1. **Arrow cursor on UI chrome**: set `cursor: default` across buttons, tabs, sidebar rows, menus, and headers—reserve `cursor: pointer` strictly for external web hyperlinks (`a[href^="http"]`).
2. **Non-selectable chrome**: apply `user-select: none; -webkit-user-select: none;` to all toolbars, sidebars, tabs, menus, and buttons; opt into `user-select: text` only inside editors, tables, logs, and message bodies.
3. **Suppress browser giveaways in production**: disable default WebView `contextmenu` ("Inspect Element" / "Reload") outside debug builds (`#[cfg(not(debug_assertions))]`), block accidental `Cmd/Ctrl+R` page reloads and rubber-band pinch-zoom, and set `overscroll-behavior: none` on `html, body`.
4. **Zero white flash on dark cold start**: configure `"visible": false` and a dark/theme-matched `"backgroundColor"` in `tauri.conf.json`, then call `window.show()` from a frontend-ready command (or after first paint) so dark-mode launches never flash `#ffffff` (`< 300–500 ms` cold start).
5. **Custom titlebar geometry & fullscreen traffic lights**: use `"titleBarStyle": "Overlay"` + `"hiddenTitle": true` on macOS with a `40–52 px` header band marked **`data-tauri-drag-region`** (keeping interactive child `<button>`/`<input>` controls outside drag capture), double-click titlebar to zoom/maximize per OS setting, and reserve **`72–80 px` left inset** for macOS traffic lights—collapsing that left inset when the window enters macOS fullscreen!
6. **Native OS materials + inactive-window dimming**: pair `window-vibrancy` (`NSVisualEffectView` / `Mica` / `Acrylic`) with a `tauri://focus` / `tauri://blur` (`data-window-focused="false"`) style that softens sidebar/titlebar contrast when unfocused so multi-window focus is unmistakable.
7. **Two-way native file drag-and-drop & dialogs**: listen to native `DragDropEvent` (`onDragDropEvent` with physical file paths + drop-target highlight—never relying solely on sandboxed HTML5 `File` blobs) and `tauri-plugin-drag` for dragging files out to Finder/Explorer, plus `tauri-plugin-dialog` for native open/save sheets.
8. **Native OS menu bar, platform modifiers & single-instance deep links**: register `tauri::menu::Menu` (`File/Edit/View/Window/Help`) with `CmdOrCtrl+...` accelerators, plus `tauri-plugin-single-instance` + `tauri-plugin-deep-link`.

```css
/* Desktop WebView shell baseline */
html, body {
  overscroll-behavior: none;
  user-select: none;
  -webkit-user-select: none;
  cursor: default;
}
.selectable-pane, input, textarea, [contenteditable="true"] {
  user-select: text;
  -webkit-user-select: text;
  cursor: auto;
}
a[href^="http"] { cursor: pointer; }
.titlebar {
  block-size: 44px;
  padding-inline-start: var(--macos-traffic-inset, 78px); /* set to 12px when fullscreen or non-macOS */
}
[data-window-focused="false"] .sidebar,
[data-window-focused="false"] .titlebar {
  opacity: 0.78;
}
```

## Storage, signing, & accessibility idioms

- **OS-standard paths & atomic writes**: resolve paths via `app.path().app_config_dir()` / `app_data_dir()` / `app_cache_dir()` (XDG / `~/Library/Application Support` / `%APPDATA%`); persist JSON/project files via `temp file → File::sync_all() → fs::rename` and run local SQLite in `WAL` mode ([working-context.md](working-context.md)).
- **2026 signing & `Ed25519` delta updates**: sign macOS Universal builds with Developer ID + Hardened Runtime + `notarytool` + `stapler`; sign Windows `.msi`/NSIS installers with Azure Artifact Signing / HSM Authenticode (building SmartScreen reputation consistently in CI); and sign `tauri-plugin-updater` artifacts with `minisign`/`Ed25519` keys.
- **Accessibility & idle CPU**: bundle local `.woff2` fonts, honor `prefers-reduced-motion`, pause background timers/animations when minimized (`~0%` idle CPU), guard unsaved work via `on_window_event(WindowEvent::CloseRequested)`, and verify native menus, dialogs, and WebView content with `VoiceOver`, `NVDA`/`Narrator`, and `Orca`.

## Tauri v2 mobile targets

When sharing a Tauri v2 codebase across desktop and iOS/Android, isolate mobile plugins (biometrics, NFC, haptics) in platform-scoped capability files and pair mobile WebView ergonomics with `pixelcraft-mobile` safe-area and touch-target rules.

## Do/don't pairs

| Do | Don't |
|---|---|
| Stream progress/logs via `tauri::ipc::Channel<T>` and binary data via `ipc::Response` | Serialize megabyte buffers as JSON arrays or spam global window events |
| Start window `"visible": false` with dark `backgroundColor`, `cursor: default`, `user-select: none`, and `overscroll-behavior: none` | Flash white on dark launch, show `cursor: pointer` on every button, or leave browser "Inspect Element" context menus in prod |
| Reserve `72–80 px` macOS traffic-light inset (resetting on fullscreen) + inactive-window dimming | Cover macOS traffic lights, swallow header clicks inside drag regions, or keep unfocused windows at full active contrast |
| Write config/DB to `app_config_dir()` / `app_data_dir()` atomically (`sync_all` + `rename`) + SQLite `WAL` | Write files next to the binary or overwrite user documents in place without `fsync` |
| Scope `src-tauri/capabilities/*.json`, intercept `CloseRequested`, and sign updates with `Ed25519` | Grant wildcard permissions, drop unsaved edits on close, or ship unsigned updaters |

## Known traps

WebView engine differences (WKWebView vs WebView2 vs WebKitGTK CSS/backdrop/font quirks), white launch flash when `visible: false` + `backgroundColor` is omitted, forgetting to collapse the `72–80 px` traffic-light padding in macOS fullscreen, `Cmd/Ctrl+R` reloading the SPA in production, synchronous `#[tauri::command]` blocking the main thread, cold-start deep links firing before frontend listeners mount.

## Verification commands

```sh
cargo tauri info
npm run build
cargo test --manifest-path src-tauri/Cargo.toml
cargo tauri build
```

`cargo tauri info`, `npm run build`, and `cargo test` provide environment and `static` evidence. Run packaged builds on each target OS (macOS/Windows/Linux) to verify `< 500 ms` cold start, `~0%` idle CPU, all 8 WebView giveaway killers, native menus, mixed-DPI bounds clamping, screen readers (`VoiceOver`/`NVDA`/`Narrator`/`Orca`), and dirty-close behavior for `rendered` evidence; browser-only dev preview is inner-DOM evidence only—label untested OSes `not-checked`.
