# Avalonia

## Token mapping

Use resource dictionaries/styles/theme variants:

```xml
<SolidColorBrush x:Key="SemanticActionBrush" Color="#FF0074CA" />
```

Map generated values once into semantic resources and use `DynamicResource` where theme switching matters. Do not scatter raw color/dimension constants in views/viewmodels.

## Layout and responsive idioms

Use panels/grid/dock/layout-aware controls, minimum window dimensions, resizing, DPI scaling, platform window chrome choices, keyboard focus manager behavior, and cross-platform OS differences deliberately. Desktop, mobile-like, and embedded targets should not share one rigid layout.

## Typography/custom fonts

Register font assets/families correctly and use semantic text styles. Validate fallback/glyph coverage, scaling/DPI behavior, localization expansion, and truncation/rendering differences across platforms.

## Motion/reduced motion

Use transitions/animations purposefully and expose reduced-motion behavior based on platform capability or explicit app setting. Keep animation interruptible and never block input or obscure state transitions.

## Accessibility specifics

Use automation properties/accessibility metadata, focus/keyboard navigation, visible focus, real controls, high-contrast/system theme awareness, and platform screen-reader verification. Cross-platform rendering does not guarantee equal accessibility tree quality across Windows/macOS/Linux.

## States idiom

Use MVVM async state explicitly: loading/error/empty/offline/permission/dirty/concurrency. Handle window lifecycle/close, crash/update/restart, file lock/permission, multi-window state, cancellation/progress, and input preservation. Avoid async void hidden failure.

## Forms idiom

Use labeled inputs, validation/error presentation, focus order, paste/IME behavior, keyboard shortcuts/access keys where platform-appropriate, validation timing, and preservation after failed submit. Do not signal errors only through red borders.

## Do/don't pairs

| Do | Don't |
|---|---|
| semantic resources + `DynamicResource` for themed values | inline repeated colors/brushes across views |
| explicit async command state/cancellation | fire-and-forget async void operations |
| platform/runtime keyboard and focus verification | assuming cross-platform rendering means identical interaction |
| real controls/automation metadata | custom-drawn fake controls without accessibility exposure |
| resize/high-DPI/multiplatform testing | validating only on developer OS/monitor |

## Known traps

Binding errors hidden in logs, style selector cascade surprises, platform rendering/accessibility differences, async lifecycle leaks, window chrome inconsistency, DPI/font fallback variation, resource lookup failure, focus management after dialogs/popups.

## Verification commands

```sh
dotnet build
dotnet test
dotnet run --project <AppProject> 2>/dev/null || true
```

Use actual Windows/macOS/Linux runs where claimed, screen reader/keyboard tests, resize/DPI/window-state matrices, high contrast/dark mode, and close/crash/update flows as evidence.
