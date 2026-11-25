# Electron & Electrobun

## Token mapping

Use generated DTCG CSS custom properties in renderer UI. Keep main-process native chrome (window `backgroundColor` to eliminate launch flash, `nativeTheme.themeSource`, tray icons, dialogs) synchronized via shared semantic constants without leaking secrets or filesystem logic into the renderer.

## Modern Electron security & architecture baseline

Never weaken Electron's process boundary for convenience. Enforce these defaults on every `BrowserWindow` and embedded `WebContentsView`:

- **Strict renderer isolation**: `contextIsolation: true`, `sandbox: true`, `nodeIntegration: false`, exposing only a minimal, typed preload surface via **`contextBridge.exposeInMainWorld`**.
- **Typed IPC & streaming**: use **`ipcMain.handle`** / **`ipcRenderer.invoke`** for request/response with structured error propagation, and **`MessagePortMain`** for high-throughput renderer↔worker streaming.
- **`WebContentsView`** (replaces deprecated `BrowserView`): embed split web surfaces or multi-tab views cleanly inside a `BaseWindow` / `BrowserWindow`.
- **`protocol.handle`**: serve local/custom-scheme assets via standard Fetch `Request`/`Response` handlers (replaces deprecated `registerFileProtocol`).
- **`utilityProcess.fork`**: offload heavy CPU work, SQLite/indexing, or native addons out of the main process so window dragging, menus, and IPC never stall.
- **Credentials & hardening**: encrypt local tokens/secrets with **`safeStorage`** (OS keychain/DPAPI/libsecret) and lock production binaries with **`@electron/fuses`** (disable `RunAsNode`, disable `EnableNodeOptionsEnvironmentVariable`, enable ASAR integrity verification).

```ts
// main.ts — zero white flash on dark cold start + strict sandbox + native backdrop
const win = new BrowserWindow({
  width: 1200,
  height: 800,
  minWidth: 720,
  minHeight: 500,
  show: false,
  backgroundColor: '#111318',
  vibrancy: process.platform === 'darwin' ? 'sidebar' : undefined,
  backgroundMaterial: process.platform === 'win32' ? 'mica' : undefined,
  titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
  titleBarOverlay: process.platform !== 'darwin' ? { height: 42, symbolColor: '#e5e7eb', color: '#00000000' } : undefined,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true,
    sandbox: true,
    nodeIntegration: false,
    spellcheck: true,
  },
});

win.once('ready-to-show', () => win.show());
ipcMain.handle('doc:save', async (_evt, payload: SaveRequest) => saveDocumentAtomically(payload));
```

## The 8 WebView Giveaway Killers, Mica/vibrancy & native DnD

Eliminate every browser tell on Electron & Electrobun windows (budgeting **`< 1.0–1.2 s` cold start**, **`~0%` idle CPU** when minimized/unfocused, and explicitly justifying Electron's memory footprint in the brief):

1. **`cursor: default`** on all buttons, tabs, sidebar items, and chrome (`cursor: pointer` only on external `https://` links).
2. **`user-select: none`** across toolbars, sidebars, tabs, menus, and buttons (selectable strictly inside editors, tables, and log panes).
3. **Block browser shortcuts & menus in production**: remove default `View → Reload / Toggle Developer Tools` accelerators in packaged builds (`!app.isPackaged`), call `webContents.setVisualZoomLevelLimits(1, 1)` to disable accidental pinch-zoom, set `overscroll-behavior: none`, and wire native `Menu.buildFromTemplate(...).popup()` on `context-menu` instead of raw Chromium inspect menus.
4. **Zero white flash (`show: false` + `backgroundColor`)**: initialize `BrowserWindow` hidden with the active theme's background color and reveal on `ready-to-show`.
5. **Custom `40–52 px` titlebar & fullscreen traffic-light inset**: pair `titleBarOverlay` (Windows/Linux Snap Layouts preserved) and `titleBarStyle: 'hiddenInset'` (macOS **`72–80 px` left inset**, collapsed to standard padding on `enter-full-screen` / `leave-full-screen`) with `-webkit-app-region: drag` on the bar and `-webkit-app-region: no-drag` on every interactive child.
6. **Native backdrops + inactive-window dimming**: pair `backgroundMaterial: 'mica'` / `vibrancy` (with opaque fallback for High Contrast / Reduce Transparency) with `focus`/`blur` window classes (`:window-inactive` / `[data-window-focused="false"]`) that soften sidebar/titlebar contrast on unfocused windows.
7. **Two-way native file drag-and-drop & dialogs**: accept inbound file drops via `webUtils.getPathForFile(file)` in preload with clear drop-zone states, support **outbound drag to Finder/Explorer** via `event.sender.startDrag({ file, icon })`, and use `dialog.showOpenDialog` / `showSaveDialog`.
8. **Native OS menu bar, `Cmd`/`Ctrl` modifiers & single-instance deep links**: set `Menu.setApplicationMenu(...)` (`App/File/Edit/View/Window/Help`), acquire `app.requestSingleInstanceLock()`, and route `second-instance` + `open-url` deep links cleanly.

## Electron vs Tauri vs Electrobun decision matrix

**Electrobun** pairs **Bun** (fast JS/TS runtime) + **Zig** native bindings + the **system WebView** (WKWebView / WebView2 / WebKitGTK) as a lightweight TypeScript-first desktop alternative when Electron's Chromium bundle size (~100 MB+) is unacceptable and you prefer TS/Zig over Rust (Tauri):

| Runtime | Footprint & cold start | Renderer consistency | Native backend | Best fit |
|---|---|---|---|---|
| **Electron** | ~100–150 MB (`< 1.0–1.2 s` cold start; justify RAM in brief) | Identical Chromium/WebGPU across Windows, macOS, Linux | Node.js + `utilityProcess` + native addons | Complex editors/IDEs needing guaranteed Chromium parity, `WebContentsView`, and mature ecosystem |
| **Tauri v2** | ~3–10 MB (`< 300–500 ms` cold start) | Varies by OS WebView (WKWebView / WebView2 / WebKitGTK) | Rust (`#[tauri::command]`, `Channel`) | Lightweight security-first desktop + mobile apps with Rust backend |
| **Electrobun** | ~12–20 MB (`< 300–500 ms` cold start) | Varies by OS WebView | Bun TS + Zig FFI | Teams wanting ultra-fast Bun TS tooling, tiny binaries, and fast differential updates without writing Rust |

## Storage, 2026 signing & accessibility idioms

- **OS paths & atomic writes**: store data strictly under `app.getPath('userData')` / `app.getPath('logs')` using atomic `temp → fsync → rename` writes and SQLite `WAL` mode inside a `utilityProcess` ([working-context.md](working-context.md)).
- **2026 signing & auto-update**: notarize macOS builds (`@electron/notarize` / `notarytool` + `stapler`); sign Windows releases via **Azure Artifact Signing** or HSM Authenticode (remembering EV certs no longer bypass SmartScreen instantly—maintain consistent CI publisher reputation); verify cryptographically signed delta updates in background and roll back on startup crash.
- **Accessibility**: bundle offline fonts, honor `prefers-reduced-motion`, clamp multi-monitor bounds across mixed-DPI (`100%` ↔ `200%`) `screen.getAllDisplays()` work areas, guard `close` on dirty documents, and verify `VoiceOver`, `NVDA`/`JAWS`/`Narrator`, and `Orca`.

## Do/don't pairs

| Do | Don't |
|---|---|
| `contextIsolation: true`, `sandbox: true`, narrow `contextBridge` API | Enable `nodeIntegration: true` or expose raw `ipcRenderer.send` to renderer |
| Launch `show: false` + dark `backgroundColor` + `cursor: default` + `user-select: none` + block prod `Cmd/Ctrl+R` | Flash white on dark start, show hand cursors on chrome, or leave `Ctrl+R`/Inspect Element active in production |
| Use `WebContentsView`, `protocol.handle`, `utilityProcess.fork`, `webUtils.getPathForFile`, and `startDrag` | Block main thread with sync `fs`/SQLite or ship one-way browser `<input type="file">` pickers |
| Encrypt tokens with `safeStorage`, lock `@electron/fuses`, and store files in `userData` atomically | Store plaintext OAuth tokens in `localStorage` or write non-atomic files beside the binary |
| Use `titleBarOverlay` (Windows) and `72–80 px` macOS inset (collapsing on fullscreen) + inactive dimming | Cover macOS traffic lights, swallow button clicks in `-webkit-app-region: drag`, or break Snap Layouts |
| Clamp restored window bounds against mixed-DPI `screen.getAllDisplays()` work areas | Restore windows off-screen after an external monitor is disconnected |

## Known traps

Disabling `sandbox`/`contextIsolation`, white flash from omitting `show: false` + `backgroundColor`, leaving `Cmd/Ctrl+R` reload enabled in packaged builds, forgetting to collapse macOS `72–80 px` traffic-light padding in fullscreen, blocking main process instead of `utilityProcess`, restoring invalid multi-monitor coordinates, assuming EV certificates bypass Windows SmartScreen immediately.

## Verification commands

```sh
npm run lint
npm run test -- --run
npm run build
```

Lint, unit tests, and bundle builds are `static` evidence. Run packaged, signed builds (with `@electron/fuses` applied) on real macOS, Windows, and Linux hosts to verify `< 1.2 s` cold start, `~0%` idle CPU, all 8 WebView giveaway killers, `titleBarOverlay`/Mica, screen readers (`VoiceOver`/`NVDA`/`Narrator`/`Orca`), mixed-DPI multi-monitor restore, and dirty-close recovery for `rendered` evidence; label untested OSes `not-checked`.
