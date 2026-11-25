# Go GUI: Wails (v2 / v3), Fyne, and Gio

## Toolkit comparison & idioms

| Toolkit | Rendering model | Key 2025–2026 idioms | Best fit |
|---|---|---|---|
| **Wails v3** (and **v2**) | OS WebView + Go backend | **v3**: multi-window (`app.Window.NewWithOptions`), native application menus & system tray (`app.NewSystemTray`), `application.NewService(...)` generated TS bindings, `wails3` CLI. (**v2**: single-window `wails build` for existing repos.) | Web-UI desktop apps with a fast Go backend and small binaries |
| **Fyne (v2.5 / v2.6+)** | Native Go OpenGL/Canvas retained widgets | Custom `fyne.Theme`, reactive `fyne.io/fyne/v2/data/binding`, `app.Preferences()` persistence, `widget.NewList` virtualization | Pure-Go cross-platform desktop/mobile utilities without WebView |
| **Gio (`gioui.org`)** | Immediate-mode GPU (`layout.Context`, `material.Theme`) | Frame-local `layout.Flex` / `layout.Inset`, explicit `op.Ops`, high-FPS custom vector/tool rendering | Custom Go graphics/engineering tools where immediate-mode control dominates |

## Token mapping & idiomatic Go snippets

- **Wails v3**: map DTCG tokens into CSS custom properties inside the frontend while mirroring window background, native menus, and tray icon states in Go:

```go
// Wails v3 multi-window + service + system tray setup
app := application.New(application.Options{
    Name:     "InvoiceDesk",
    Services: []application.Service{application.NewService(&InvoiceService{})},
})
win := app.Window.NewWithOptions(application.WebviewWindowOptions{
    Title:     "Invoices",
    Width:     1120,
    Height:    760,
    MinWidth:  720,
    MinHeight: 500,
})
tray := app.SystemTray.New()
tray.AttachWindow(win).WindowOffset(5)
```

- **Fyne v2.5/v2.6+**: centralize tokens inside a custom `fyne.Theme` implementation (`Color(name, variant)`, `Size(name)`), bind UI controls reactively with `data/binding` (`binding.NewString()`, `binding.NewFloat()`), and persist user/window preferences via `app.Preferences()`:

```go
status := binding.NewString()
_ = status.Set("Ready")
label := widget.NewLabelWithData(status)
themePref := myApp.Preferences().StringWithFallback("theme", "system")
```

- **Gio**: centralize semantic `color.NRGBA` and spacing constants in a Go theme package consumed by `layout.Context` builders rather than scattering inline RGBA structs across frame functions.

## Layout, WebView giveaway killers (Wails), & reduced motion

- **Wails (all 8 WebView Giveaway Killers)**: configure `Hidden: true` + theme-matched `BackgroundColour` on `WebviewWindowOptions` (showing on ready to eliminate dark-mode white flash), enforce `cursor: default` and `user-select: none` on UI chrome, disable production browser `contextmenu` / `Cmd/Ctrl+R` reload / rubber-band overscroll, mark `40–52 px` headers with `--wails-draggable: drag` (`no-drag` on buttons, `72–80 px` macOS traffic-light inset collapsed on fullscreen), apply native macOS vibrancy / Windows `Mica` + unfocused window dimming, wire native file drop (`EnableFileDrop: true`) + native open/save dialogs, and register native `App/File/Edit/View/Window/Help` menus + single-instance deep-link activation ([tauri.md](tauri.md), [working-context.md](working-context.md)).
- **Fyne**: compose with `container.NewBorder`, `NewHSplit`, `NewGridWithColumns`, and virtualized `widget.NewList`/`NewTable`; never create thousands of `widget.Label` widgets eagerly inside a `VBox`.
- **Gio**: derive layout cleanly from `gtx.Constraints` every frame and respect `gtx.Metric` (`Dp`/`Sp`) for HiDPI and font scaling.
- Register bundled font assets explicitly and test CJK/RTL shaping and glyph fallback across OSes. Honor `prefers-reduced-motion` in Wails WebViews; in Fyne and Gio, expose an app-level reduced-motion preference when OS preference hooks are absent and tie any timer/animation goroutines to `context.Context` cancellation (`~0%` idle CPU when unfocused/minimized).

## Accessibility, atomic storage, & states

- **Wails**: accessibility relies on semantic HTML/ARIA inside the WebView plus native OS menu/shortcut/dialog verification (`VoiceOver`, `NVDA`/`Narrator`, `Orca`).
- **Fyne**: implement `fyne.Accessible` (`AccessibilityLabel`, `AccessibilityRole`) where supported, keep keyboard focus (`fyne.Focusable`) explicit, and verify actual VoiceOver/Narrator/Orca coverage honestly—do not assume parity with native OS toolkits.
- **Gio**: custom GPU rendering has limited built-in screen-reader support; do not select Gio for screen-reader-mandated productivity software without an explicit accessibility bridge, and mark untested assistive-tech support `not-checked`.
- **OS paths & atomic writes**: store config/data under `os.UserConfigDir()` / `os.UserCacheDir()` (never next to the binary), write files via temp file + `f.Sync()` + `os.Rename()`, and run SQLite in `WAL` mode ([working-context.md](working-context.md)). Cancel background goroutines via `context.Context`, guard dirty-document close events, and update Fyne/Gio UI safely on the toolkit's UI queue (`fyne.Do(...)` in Fyne v2.6+ / `window.Invalidate()` in Gio).

## Do/don't pairs

| Do | Don't |
|---|---|
| Use Wails v3 `application.NewService` + native menus + `Hidden: true` dark launch + all 8 WebView giveaway killers | Ship a single-window WebView SPA that flashes white, shows `cursor: pointer` on chrome, or reloads on `Ctrl+R` |
| Use Fyne `data/binding`, `app.Preferences()`, and `fyne.Do(...)` from goroutines | Mutate Fyne widgets directly from background goroutines without synchronization |
| Store config in `os.UserConfigDir()` with `temp → f.Sync() → os.Rename()` + SQLite `WAL` | Write state beside the executable or truncate user files in place |
| Use `widget.NewList` / `NewTable` in Fyne for large datasets | Append 2,000 rows directly into `container.NewVBox` |
| Pass `context.Context` into background work and cancel on close/navigation | Leak orphaned goroutines that burn idle CPU or mutate stale window state |
| Verify actual screen-reader support per toolkit honestly | Claim VoiceOver/Narrator compliance for Gio/Fyne purely because `go build` passed |

## Known traps

CGO cross-compilation friction in Fyne (OpenGL/OS bindings) vs pure-Go/WebView builds, mutating Fyne UI off the main thread (causing races before `fyne.Do`), Wails v2 vs v3 API confusion (`wails` vs `wails3` CLI), OS WebView differences in Wails (WKWebView vs WebView2 vs WebKitGTK), missing font fallbacks in Gio/Fyne, uncancelled goroutines on window close.

## Verification commands

```sh
go test ./...
go vet ./...
go run .
# Run the packaging command matching your toolkit when installed:
wails3 build     # Wails v3 projects (use `wails build` for Wails v2)
fyne package     # Fyne projects
```

`go test` and `go vet` provide `static` / logic evidence. Run packaged builds on target desktop OSes to verify window chrome, tray/menus, resize/HiDPI, keyboard navigation, screen readers (where supported), and dirty-close cancellation for `rendered` evidence; label untested OSes `not-checked`.
