# Go GUI: Fyne, Wails, Gio

## Token mapping

Fyne: map semantic values into a custom `fyne.Theme` and use theme lookup rather than literals. Wails: use generated CSS variables inside the webview plus native shell integration. Gio: centralize semantic color/type constants in Go and apply through layout/widget styling.

## Layout and responsive idioms

Fyne uses containers/layouts and canvas scaling. Wails is a desktop webview shell—web layout plus menus/windowing/file-system integration. Gio is immediate-mode-ish layout with explicit constraints. Handle resize, minimum window size, high-DPI, multi-window, platform chrome, persistence.

## Typography/custom fonts

Register font collections/assets deliberately; verify glyph fallback, scaling, localization/IME. Webview fonts follow web rules. Gio/Fyne custom rendering needs explicit text-shaping validation.

## Motion/reduced motion

Use framework animation/timers sparingly and expose app-level reduced-motion where OS integration is uncertain. Avoid goroutine/frame-loop animation that ignores lifecycle, cancellation, and power.

## Accessibility specifics

Current Fyne API exposes an `Accessible` interface (`AccessibilityLabel`, `AccessibilityRole`) in recent versions, but support maturity/version coverage must be verified. Wails accessibility depends on emitted DOM plus webview/platform behavior. Gio/custom rendering requires explicit semantics and may not provide screen-reader support sufficient for productivity software. Never infer support from compilation.

## States idiom

Use explicit Go state ownership/channels/context cancellation for loading/error/offline/permission/concurrent work. Keep file/dirty/window-close/update state durable. Goroutine completion is not a UX state unless surfaced.

## Forms idiom

Use real framework controls where possible; validate labels/focus order/paste/IME/input preservation/error recovery. Wails can use native HTML forms inside webview. Custom canvas input is costly to make correct.

## Do/don't pairs

| Do | Don't |
|---|---|
| implement Fyne `AccessibilityLabel()` where supported | claiming screen-reader support because app launches |
| Wails semantic HTML form | custom div-only UI inside webview |
| context cancellation/progress state | orphaned goroutine mutating UI state |
| central Fyne/Gio theme constants | repeated literal colors at widget sites |

## Known traps

CGO/platform packaging, webview runtime differences, accessibility immaturity, goroutine race/lifetime bugs, high-DPI/font rasterization, custom chrome behavior, file permission/update flows, blurry assumptions from web screenshots.

## Verification commands

```sh
go test ./...
go vet ./...
fyne package 2>/dev/null || true
wails build 2>/dev/null || true
go run .
```

Run actual desktop OS builds; inspect resize/DPI/window/menu integration, keyboard/focus/screen reader where applicable, crash/dirty close, offline/background cancellation, packaging/signing.
