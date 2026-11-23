# .NET MAUI

## Token mapping

Map generated values into XAML resource dictionaries, semantic styles, and platform resources:

```xml
<Color x:Key="SemanticAction">#0074ca</Color>
<Style TargetType="Button" x:Key="PrimaryAction">
  <Setter Property="BackgroundColor" Value="{StaticResource SemanticAction}" />
</Style>
```

Use dynamic resources/theme dictionaries for dark/light/high-contrast behavior. Do not copy raw colors through pages.

## Layout and responsive idioms

Use MAUI layouts (`Grid`, `VerticalStackLayout`, `CollectionView`, shells/flyout/tab/navigation) with platform idioms. Shell navigation is not automatically correct information architecture. Respect safe areas, orientation, desktop/mobile multi-target differences, keyboard/system navigation, and platform back semantics.

## Typography/custom fonts

Register fonts during app startup/resource setup and map semantic font styles. Support platform font scaling where expected. Avoid fixed-height labels that clip localized/expanded text; measure actual device scaling.

## Motion/reduced motion

Use MAUI animation APIs intentionally. Platform reduced-motion settings require platform-specific verification/abstraction; do not assume one universal cross-platform hook. Keep animations cancellable and nonblocking.

## Accessibility specifics

Use SemanticProperties (`SemanticProperties.Description`, HeadingLevel where applicable), automation properties/platform accessibility metadata, focus/keyboard behavior, visible focus/target size. Test TalkBack/VoiceOver/Narrator depending target; shared XAML does not guarantee equivalent accessibility trees.

## States idiom

Use MVVM state explicitly rather than boolean soup: loading/refreshing/empty/error/offline/permission/optimistic. Handle lifecycle/resume/process recreation and navigation parameters. Collection virtualization/reuse can leak visual state if bindings/converters are wrong.

## Forms idiom

Use correct keyboard, entry/editor behaviors, return type, validation timing, input preservation, focus order, paste/autofill/platform capabilities, and clear error recovery. Do not implement validation only through red borders without text.

## Do/don't pairs

| Do | Don't |
|---|---|
| real `Button` with command/accessibility metadata | tap gesture on a label as primary control |
| resource dictionary semantic colors | inline hex duplicated across pages |
| explicit VM async state and cancellation | hidden fire-and-forget async void mutation |
| Shell/platform back behavior verification | modal/navigation stack hacks that trap users |
| platform-specific accessibility testing | assuming shared XAML semantics are enough |

## Known traps

Handler/platform differences, XAML binding errors visible only at runtime, async void lifecycle bugs, collection virtualization state leakage, navigation stack confusion, font scaling clipping, inconsistent safe-area behavior, accessibility metadata varying across targets.

## Verification commands

```sh
dotnet build
dotnet test
dotnet build -t:Run -f net8.0-android 2>/dev/null || true
dotnet build -t:Run -f net8.0-ios 2>/dev/null || true
```

Use device/emulator/simulator inspection, Narrator/TalkBack/VoiceOver, font scaling, dark/high contrast, orientation/resizing, offline state, and platform back/gesture testing as evidence.
