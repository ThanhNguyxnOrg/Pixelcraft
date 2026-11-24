# Avalonia (11+)

## Token mapping: `ThemeVariant` & `ControlTheme`

Map DTCG semantic tokens into `ResourceDictionary.ThemeDictionaries` keyed by **`ThemeVariant`** (`Default`, `Light`, `Dark`, and custom high-contrast variants) and reference them via `{DynamicResource ...}` so live theme switching updates without restarting windows.

In Avalonia 11+, style templated controls with **`ControlTheme`** (explicitly scoped, predictable overrides) rather than cascading global `<Style Selector="...">` hacks, and enforce **`x:CompileBindings="True"`** + `x:DataType` across views so binding typos fail at compile time:

```xml
<ResourceDictionary xmlns="https://github.com/avaloniaui"
                    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">
  <ResourceDictionary.ThemeDictionaries>
    <ResourceDictionary x:Key="Light">
      <SolidColorBrush x:Key="PcActionBrush" Color="#0074CA" />
    </ResourceDictionary>
    <ResourceDictionary x:Key="Dark">
      <SolidColorBrush x:Key="PcActionBrush" Color="#5BB2FF" />
    </ResourceDictionary>
  </ResourceDictionary.ThemeDictionaries>

  <ControlTheme x:Key="PrimaryButtonTheme" TargetType="Button" BasedOn="{StaticResource {x:Type Button}}">
    <Setter Property="Background" Value="{DynamicResource PcActionBrush}" />
    <Setter Property="MinHeight" Value="36" />
  </ControlTheme>
</ResourceDictionary>
```

## Layout, `TopLevel` services, & custom window chrome

- Use `Grid`, `DockPanel`, `StackPanel`, `SplitView`, `ItemsRepeater` / `ListBox` virtualization, minimum window dimensions (`MinWidth`, `MinHeight`), and cross-platform DPI awareness.
- **Platform services via `TopLevel`**: never instantiate deprecated `OpenFileDialog` / `SaveFileDialog`. Resolve **`TopLevel.GetTopLevel(this)`** to access **`StorageProvider`** (native file/folder pickers + bookmarks), **`Clipboard`**, **`Launcher`**, and **`InsetsManager`**:

```csharp
var topLevel = TopLevel.GetTopLevel(this);
if (topLevel?.StorageProvider is { CanOpen: true } storage)
{
    var files = await storage.OpenFilePickerAsync(new FilePickerOpenOptions
    {
        Title = "Import invoices",
        AllowMultiple = false,
    });
}
```

- **Custom titlebars**: when extending content into chrome with **`ExtendClientAreaToDecorationsHint="True"`**, configure `ExtendClientAreaChromeHints` intentionally and bind header padding to **`WindowDecorationMargin`** / `OffScreenMargin` so macOS traffic lights and Windows caption buttons never overlap interactive controls, and preserve drag + double-click maximize behavior.

## Typography, motion, accessibility, states, & forms

Register bundled fonts via `FontManagerOptions` / `avares://` font URIs with explicit fallbacks and verify glyph coverage and DPI rasterization on Windows, macOS, and Linux separately.

Keep Avalonia `Transitions` and keyframe animations concise and interruptible; expose an explicit reduced-motion setting where host OS preference propagation is uncertain.

Set `AutomationProperties.Name`, `AutomationProperties.LabeledBy`, `AutomationProperties.HelpText`, keyboard `HotKey` / `KeyBindings`, and visible `:focus-visible` styles on real interactive controls. Verify Windows UIA (Narrator), macOS VoiceOver, and Linux AT-SPI separately—shared Skia rendering does not guarantee identical screen-reader behavior across OSes.

Drive state via `CommunityToolkit.Mvvm` or `ReactiveUI` with explicit async cancellation and dirty-close interception (`Window.Closing`). In forms, use `DataValidationErrors` + inline recovery text, preserve input across validation errors, and test IME/paste on all target OSes.

## Headless UI verification (`Avalonia.Headless`)

Use **`Avalonia.Headless`** (`Avalonia.Headless.XUnit` or `Avalonia.Headless.NUnit`) to run fast deterministic UI tests driving real layout passes, `KeyPressQwerty`, `MouseDown`, focus traversal, and `CaptureRenderedFrame()` without needing an OS display server:

```csharp
[AvaloniaFact]
public void Escape_Returns_Focus_From_Inspector()
{
    var window = new MainWindow { DataContext = new MainViewModel() };
    window.Show();
    window.KeyPressQwerty(PhysicalKey.F6, RawInputModifiers.None);
    window.KeyPressQwerty(PhysicalKey.Escape, RawInputModifiers.None);
    Assert.True(window.CanvasControl.IsFocused);
}
```

## Do/don't pairs

| Do | Don't |
|---|---|
| Enable `x:CompileBindings="True"` + `x:DataType` and `ControlTheme` + `ThemeVariant` | Rely on untyped runtime bindings and fragile global style selectors |
| Use `TopLevel.GetTopLevel(this)?.StorageProvider` & `Clipboard` | Call deprecated `OpenFileDialog` or OS-specific Win32/NSOpenPanel hacks |
| Bind `ExtendClientAreaToDecorationsHint` chrome to `WindowDecorationMargin` | Overlap macOS traffic lights or break Windows maximize/drag regions |
| Write `Avalonia.Headless` keyboard/focus/layout tests alongside OS runs | Rely solely on `dotnet build` or visual glances on one OS |
| Guard `Window.Closing` for unsaved documents and cancel async commands | Use `async void` handlers or discard edits silently on close |

## Known traps

Silent runtime binding failures when `x:CompileBindings` is omitted, `{StaticResource}` failing to update when `RequestedThemeVariant` switches at runtime, `TopLevel.GetTopLevel(this)` returning `null` before `OnAttachedToVisualTree`, broken window drag/caption buttons under `ExtendClientAreaToDecorationsHint`, OS-divergent screen-reader maturity across Windows/macOS/Linux, missing font fallbacks on minimal Linux distros.

## Verification commands

```sh
dotnet build
dotnet test   # includes Avalonia.Headless UI tests when configured
dotnet run --project <AppProject>
```

`dotnet build` is `static` evidence; `Avalonia.Headless` tests verify layout/focus/input deterministically (`static`/headless). Run native desktop binaries on each shipped OS (Windows/macOS/Linux) for screen-reader, HiDPI, dark/high-contrast, custom-chrome, and multi-monitor restore checks (`rendered`; label untested OSes `not-checked`).
