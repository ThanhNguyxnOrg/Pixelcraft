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
// main.ts
const win = new BrowserWindow({
  width: 1200,
  height: 800,
  minWidth: 720,
  minHeight: 500,
  backgroundMaterial: process.platform === 'win32' ? 'mica' : undefined,
  titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
  titleBarOverlay: process.platform !== 'darwin' ? { height: 36, symbolColor: '#e5e7eb' } : undefined,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true,
    sandbox: true,
    nodeIntegration: false,
  },
});

ipcMain.handle('doc:save', async (_evt, payload: SaveRequest) => saveDocument(payload));
```

## Window chrome, Windows Mica, & WebGPU

- Use **`titleBarOverlay`** on Windows/Linux (keeping native minimize/maximize/close hover states and Windows Snap Layouts intact) and `titleBarStyle: 'hiddenInset'` on macOS (reserving safe left traffic-light clearance). Mark drag bands with `-webkit-app-region: drag` and every interactive child inside them with `-webkit-app-region: no-drag`.
- On Windows 11, **`backgroundMaterial: 'mica'`** (`'acrylic'`, `'tabbed'`) provides native translucent backdrop integration; fall back cleanly to an opaque semantic surface on Windows 10 or when high contrast / reduced transparency is active.
- **WebGPU**: Electron ships modern Chromium with WebGPU support for GPU-accelerated canvases/AI inference, but verify GPU process crash recovery (`render-process-gone` / `child-process-gone`) and software fallbacks on older GPUs.

## Electron vs Tauri vs Electrobun decision matrix

**Electrobun** pairs **Bun** (fast JS/TS runtime) + **Zig** native bindings + the **system WebView** (WKWebView / WebView2 / WebKitGTK) as a lightweight TypeScript-first desktop alternative when Electron's Chromium bundle size (~100 MB+) is unacceptable and you prefer TS/Zig over Rust (Tauri):

| Runtime | Footprint | Renderer consistency | Native backend | Best fit |
|---|---|---|---|---|
| **Electron** | ~100–150 MB (bundled Chromium + Node) | Identical Chromium/WebGPU across Windows, macOS, Linux | Node.js + `utilityProcess` + native addons | Complex editors/IDEs needing guaranteed Chromium parity, `WebContentsView`, and mature ecosystem |
| **Tauri v2** | ~3–10 MB (OS WebView) | Varies by OS WebView (WKWebView / WebView2 / WebKitGTK) | Rust (`#[tauri::command]`, `Channel`) | Lightweight security-first desktop + mobile apps with Rust backend |
| **Electrobun** | ~12–20 MB (Bun + OS WebView) | Varies by OS WebView | Bun TS + Zig FFI | Teams wanting ultra-fast Bun TS tooling, tiny binaries, and fast differential updates without writing Rust |

## Accessibility, typography, motion, states, & forms idioms

Bundle fonts locally for offline fidelity and test ClearType / macOS CoreText / Linux FreeType rendering separately. Honor `prefers-reduced-motion` and verify Chromium propagates the host OS setting.

Renderer ARIA is only half the job: verify OS menus, keyboard accelerators, dock/taskbar badges, tray menus, native `dialog.showOpenDialog`, `titleBarOverlay` controls, and screen readers (VoiceOver, Narrator, Orca) across window boundaries. Handle `app.requestSingleInstanceLock()`, cold-start deep links (`open-url` / `second-instance`), `powerMonitor` suspend/resume, auto-updater restart prompts, and `close` interception for dirty documents.

## Do/don't pairs

| Do | Don't |
|---|---|
| `contextIsolation: true`, `sandbox: true`, narrow `contextBridge` API | Enable `nodeIntegration: true` or expose raw `ipcRenderer.send` to renderer |
| Use `WebContentsView`, `protocol.handle`, and `utilityProcess.fork` | Use deprecated `BrowserView`, `registerFileProtocol`, or block main thread |
| Encrypt tokens with `safeStorage` and lock releases with `@electron/fuses` | Store plaintext OAuth tokens in `localStorage` or leave `RunAsNode` enabled |
| Use `titleBarOverlay` (Windows) and `-webkit-app-region: no-drag` on buttons | Build frameless windows missing Snap Layouts, drag bands, or close buttons |
| Clamp restored window bounds against `screen.getAllDisplays()` work areas | Restore windows off-screen after an external monitor is disconnected |

## Known traps

Disabling `sandbox`/`contextIsolation` to rush a prototype, blocking the main process with synchronous `fs` or SQLite queries instead of `utilityProcess`, stale `BrowserView` usage, forgetting `-webkit-app-region: no-drag` on header buttons, restoring invalid multi-monitor window coordinates, `safeStorage` unavailable on headless Linux without a keyring daemon, un-tested Windows high-contrast contrast over Mica backdrops.

## Verification commands

```sh
npm run lint
npm run test -- --run
npm run build
npm start
```

Lint, unit tests, and bundle builds are `static` evidence. Run packaged builds (with `@electron/fuses` applied) on real macOS, Windows, and Linux hosts to verify menus, `titleBarOverlay`/Mica, screen readers, multi-monitor DPI/restore, single-instance/deep-link startup, and dirty-close recovery for `rendered` evidence; label untested OSes `not-checked`.
