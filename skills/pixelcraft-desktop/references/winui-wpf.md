# WinUI / WPF

## Token mapping

Use XAML resource dictionaries/theme resources:

```xml
<SolidColorBrush x:Key="SemanticActionBrush" Color="#FF0074CA" />
```

Map generated color/dimension values once into resources, styles, control templates, and theme dictionaries. Respect system light/dark/high-contrast resources instead of hard-coding visual constants.

## Layout and responsive idioms

Use panels/grid/layout rounding/adaptive layout, visual states, window resize/minimum dimensions, DPI scaling, snapping/multimonitor behavior, navigation shell appropriate to Windows. Do not fixed-position dense enterprise UI for one monitor/DPI combination.

## Typography/custom fonts

Use FontFamily resources and Windows text scaling/DPI behavior. Verify ClearType/rendering, glyph coverage, line height, truncation/ellipsis, and localization expansion. Avoid hard-coded pixel-perfect text boxes for essential copy.

## Motion/reduced motion

Use WinUI/WPF animation/transition APIs purposefully. Respect system animation/accessibility settings where exposed and provide reduced behavior. Avoid animation that delays critical task feedback or cannot be interrupted.

## Accessibility specifics

Use UI Automation properties/patterns correctly: AutomationProperties.Name/HelpText/LabeledBy, control patterns, keyboard navigation/focus, accelerator/access keys, narrator verification, high contrast themes. Custom controls/templates must preserve UIA semantics rather than only looking correct.

## States idiom

Use MVVM async state explicitly: loading/error/empty/offline/permission/dirty/concurrency. Long operations need cancellation/progress and correct dispatcher threading. Handle window close/deactivation/session lock/resume, file locking, installer/update state, and input preservation.

## Forms idiom

Use labeled controls, validation/error templates/text, focus order/access keys, input scopes where appropriate, paste/autofill/IME behavior, and preserve invalid input. Error copy must explain recovery, not just red borders.

## Do/don't pairs

| Do | Don't |
|---|---|
| resource dictionary semantic brushes/styles | hard-coded colors scattered in XAML |
| UIA names/labeled-by relationships | custom template that removes accessible semantics |
| async command with cancellation/progress | blocking UI thread or fire-and-forget silent failure |
| validate close/dirty state explicitly | losing document work on window close |
| test high contrast/Narrator/keyboard | mouse-only visual QA on developer machine |

## Known traps

Binding failures hidden in output logs, dispatcher/thread mistakes, XAML style cascade/template breaking semantics, DPI scaling/layout rounding, high-contrast overrides, focus scope/accelerator conflicts, async lifecycle leaks, fixed layouts clipping localized text.

## Verification commands

```sh
dotnet build
dotnet test
```

Use Windows runtime inspection, Narrator/UI Automation tooling, high contrast, DPI scaling, resize/multi-monitor behavior, keyboard-only completion, packaged/unpackaged smoke tests, and localization expansion screenshots as evidence.
