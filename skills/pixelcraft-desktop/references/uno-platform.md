# Uno Platform

## Token mapping

Use XAML resource dictionaries/theme resources keyed semantically; export DTCG values into application resources rather than duplicating literals. Account for WinUI-style light/dark/high-contrast resource resolution across Uno targets.

## Layout and responsive idioms

Use XAML panels/adaptive layouts/visual states/navigation shell idioms. Test every target actually supported: Windows, WASM, mobile, macOS/Linux as applicable. Shared UI does not erase platform navigation, safe-area, windowing, input, and density differences.

## Typography/custom fonts

Declare fonts/assets per target and verify glyph fallback, scaling/DPI, localization. Font behavior can differ between native and Skia rendering.

## Motion/reduced motion

Use XAML/WinUI animation deliberately and respect platform reduced-motion/settings where exposed. Keep animation completion out of correctness-critical state and provide reduced alternatives.

## Accessibility specifics

Uno documentation states that it implements the WinUI UI Automation model across targets using `AutomationProperties`/peers, with varying maturity by renderer/platform. Set `AutomationProperties.Name`, headings, and semantic properties; prefer built-in controls because peers already exist. Verify exact target/rendering mode instead of assuming uniform support.

## States idiom

Use MVVM/application state for loading/error/empty/offline/permission/optimistic/concurrency. Handle suspension/resume, deep links, window close/minimize, multi-window where supported, session expiry, and navigation restoration.

## Forms idiom

Use real XAML input controls, labels/header metadata, validation timing, keyboard/focus order, paste/IME/input scope behavior, preserve input across navigation/errors, and expose errors accessibly.

## Do/don't pairs

| Do | Don't |
|---|---|
| `AutomationProperties.Name="Save invoice"` | image/canvas-only clickable surface |
| semantic resource dictionaries | repeated inline hex in XAML |
| explicit target matrix testing | assuming WASM/mobile/Desktop behave identically |
| platform-appropriate navigation/back | forcing one mobile pattern onto desktop windows |

## Known traps

Renderer parity gaps, conditional platform APIs, resource lookup differences, focus/navigation restoration, font/glyph differences, packaging/signing/store constraints, overestimating accessibility maturity on unfinished targets.

## Verification commands

```sh
dotnet test
dotnet build
dotnet run --framework <target>
```

Inspect each shipped target/rendering mode, keyboard/focus/screen reader, high contrast/dark mode, resize/DPI/safe area, offline/suspend/resume/deep links, packaging validation.
