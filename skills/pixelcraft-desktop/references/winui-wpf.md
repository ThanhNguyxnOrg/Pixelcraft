# WinUI 3 & WPF (Windows desktop)

WinUI 3 (Windows App SDK) and .NET 9/10 WPF share XAML lineage but differ significantly in theming, bindings, titlebars, and deployment—apply the idioms for the stack actually in use.

## Choosing & separating WinUI 3 vs .NET 9/10 WPF

| Dimension | WinUI 3 / Windows App SDK | .NET 9/10 WPF |
|---|---|---|
| **Theming & dark mode** | `ThemeResource` + `ResourceDictionary.ThemeDictionaries` (`Default`, `Light`, `HighContrast`) | Built-in **WPF Fluent Theme**: set `ThemeMode="System"` (`Light`/`Dark`/`None`) on `Application` or `Window` |
| **Data binding** | Prefer **`{x:Bind}`** (compile-time checked, faster, default `Mode=OneTime`—set `Mode=OneWay` for updates) | `{Binding}` with `INotifyPropertyChanged` / `CommunityToolkit.Mvvm` |
| **Backdrop & titlebar** | `MicaBackdrop` (`Base`/`BaseAlt`), `DesktopAcrylicBackdrop`, `AppWindowTitleBar` (`ExtendsContentIntoTitleBar`, `SetDragRectangles`) | Fluent window backdrop / `WindowChrome` (avoid legacy Aero/custom non-client hacks that break Snap Layouts) |
| **Reduced motion** | `new Windows.UI.ViewManagement.UISettings().AnimationsEnabled` | `SystemParameters.ClientAreaAnimation` + `SystemParameters.HighContrast` |
| **Packaging** | **MSIX packaged** (Windows identity, clean uninstall, Store/App Installer) vs **Unpackaged** (`WindowsPackageType=None`, self-contained WindowsAppSDK for enterprise/legacy installers) | Self-contained / single-file `.exe` / MSI / MSIX |

## Token mapping (WinUI 3 & WPF)

Map DTCG semantic tokens into `ThemeDictionaries` (WinUI 3) or merged Fluent resource dictionaries (WPF)—never scatter raw `#FF...` hex colors through pages:

```xml
<!-- WinUI 3: ThemeDictionaries supporting Dark (Default), Light, and HighContrast -->
<ResourceDictionary.ThemeDictionaries>
  <ResourceDictionary x:Key="Default">
    <SolidColorBrush x:Key="PcActionBrush" Color="#FF5BB2FF" />
  </ResourceDictionary>
  <ResourceDictionary x:Key="Light">
    <SolidColorBrush x:Key="PcActionBrush" Color="#FF0074CA" />
  </ResourceDictionary>
  <ResourceDictionary x:Key="HighContrast">
    <SolidColorBrush x:Key="PcActionBrush" Color="{ThemeResource SystemColorHighlightColor}" />
  </ResourceDictionary>
</ResourceDictionary.ThemeDictionaries>
```

```xml
<!-- .NET 9/10 WPF App.xaml: built-in Fluent Theme honoring Windows light/dark & accent -->
<Application x:Class="InvoiceApp.App"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             ThemeMode="System" />
```

## WinUI 3 backdrop, titlebar, & reduced-motion idioms

Configure `MicaBackdrop`, custom titlebar drag rectangles, and Windows reduced-motion awareness cleanly in C#:

```csharp
using Microsoft.UI.Composition.SystemBackdrops;
using Microsoft.UI.Xaml.Media;
using Windows.UI.ViewManagement;

SystemBackdrop = new MicaBackdrop { Kind = MicaKind.BaseAlt };
ExtendsContentIntoTitleBar = true;
SetTitleBar(AppTitleBar); // or AppWindow.TitleBar.SetDragRectangles(...) for precise regions

var uiSettings = new UISettings();
bool animationsEnabled = uiSettings.AnimationsEnabled; // disable custom transitions when false
```

Always keep `AppWindowTitleBar.PreferredHeightOption` tall enough for Windows 11 Snap Layouts hover triggers, and preserve caption button legibility across Light, Dark, and High Contrast modes.

## Layout, typography, accessibility, states, & forms

- Use `Grid`, `StackPanel`, `NavigationView` (WinUI 3), `VisualStateManager` adaptive triggers, `UseLayoutRounding="True"`, per-monitor DPI awareness (`PerMonitorV2` across `100%` ↔ `200%` monitors with off-screen bounds clamping on unplug), and minimum window dimensions. Dim titlebar/caption chrome when `WindowActivationState.Deactivated` fires.
- Respect Windows **Text Scaling** (`UISettings.TextScaleFactor` / `IsTextScaleFactorEnabled="True"` in WinUI 3) and verify ClearType/DirectWrite legibility and localization expansion.
- Set **`AutomationProperties.Name`**, `AutomationProperties.LabeledBy`, `AutomationProperties.HeadingLevel`, `AutomationProperties.LiveSetting`, keyboard accelerators (`KeyboardAccelerator`), and access keys (`AccessKey`). Verify with **Accessibility Insights for Windows** (UIA tree) plus **`NVDA`**, **`JAWS`**, and **`Narrator`**—custom `ControlTemplate` overrides frequently strip UIA control patterns if not verified.
- Model MVVM async state via `CommunityToolkit.Mvvm` (`[RelayCommand(IncludeCancelCommand = true)]`), marshal UI updates onto `DispatcherQueue` (WinUI 3) / `Dispatcher` (WPF), keep idle CPU at `~0%` (`< 400 ms` cold start), guard window `Closing` for unsaved documents, and show inline error text (not red borders alone) in forms.

## Atomic `%APPDATA%` storage, `WebView2` hygiene & 2026 Windows signing

- **OS-standard paths & atomic writes**: store roaming config under `Environment.SpecialFolder.ApplicationData` (`%APPDATA%\<App>`) and databases/caches/logs under `LocalApplicationData` (`%LOCALAPPDATA%\<App>`)—**never** beside `.exe` inside `Program Files`. Write files atomically (write `.tmp` → `FileStream.Flush(flushToDisk: true)` → `File.Move(..., overwrite: true)` / `File.Replace`) and configure SQLite in `WAL` mode.
- **Embedded `WebView2` giveaway killers**: whenever hosting `CoreWebView2` inside WinUI/WPF, set `DefaultBackgroundColor = Colors.Transparent` (eliminating dark-mode white flash), disable `AreDefaultContextMenusEnabled`, `AreBrowserAcceleratorKeysEnabled` (`Ctrl+R`/`F5`), `IsPinchZoomEnabled`, and `IsSwipeNavigationEnabled` in production, and enforce `cursor: default` + `user-select: none` on UI chrome ([tauri.md](tauri.md)).
- **2026 Authenticode & SmartScreen reality**: sign `.exe`/`.msi`/`.msix` via **Azure Artifact Signing (Trusted Signing)** or FIPS 140-2 Level 2+ HSM OV/EV keys (`signtool`). **Note that since 2024 Microsoft removed instant EV certificate SmartScreen bypass**—new EV certs still face SmartScreen until publisher reputation accrues across consistent, reproducible signed CI releases and WinGet/MSIX distribution. Ship cryptographically signed delta updates (**Velopack** or MSIX App Installer) with background staging and crash rollback.

## Do/don't pairs

| Do | Don't |
|---|---|
| Use `{x:Bind}` + `ThemeResource` + `ThemeDictionaries` (`HighContrast`) in WinUI 3 | Scatter `StaticResource` raw hex brushes that fail Windows High Contrast |
| Enable `ThemeMode="System"` in .NET 9/10 WPF for modern Fluent dark/light parity | Ship raw 2006 Aero gray styles or broken custom dark-mode hacks |
| Store config/DB in `%APPDATA%` / `%LOCALAPPDATA%` via `Flush(true)` + atomic `File.Move` + SQLite `WAL` | Write files next to `.exe` in `Program Files` or overwrite user projects non-atomically |
| Sign CI releases consistently with Azure Artifact Signing / HSM Authenticode + signed Velopack/MSIX updates | Assume buying an EV certificate instantly bypasses Windows SmartScreen in 2026 |
| Define clean `AppWindowTitleBar` / `SetDragRectangles` preserving Snap Layouts + mixed-DPI clamping | Strip titlebar chrome without drag regions or restore windows off-screen after monitor unplug |
| Verify UIA tree with Accessibility Insights, `NVDA`, `JAWS`, and `Narrator` | Assume custom XAML templates preserve keyboard focus and screen-reader roles |

## Known traps

Forgetting `{x:Bind}` defaults to `Mode=OneTime` (UI stops updating), missing `HighContrast` dictionary entries causing invisible borders/text, `WebView2` flashing white before `DefaultBackgroundColor` applies, unpackaged WinUI 3 missing Windows App Runtime bootstrap, `DispatcherQueue` cross-thread exceptions, fixed-width panels clipping `150%`/`200%` Windows Text Scaling.

## Verification commands

```sh
dotnet build
dotnet test
# Verify Authenticode signature on Windows release artifact:
signtool verify /pa /v bin/Release/net9.0-windows/win-x64/publish/App.exe
```

`dotnet build`, `dotnet test`, and `signtool verify` are `static` evidence. Run on real Windows 11 across **Accessibility Insights for Windows**, **`NVDA`**, **`JAWS`**, **`Narrator`**, Windows High Contrast themes, Dark/Light mode, `100%` ↔ `200%` mixed-DPI & Text Scaling, Snap Layouts, and dirty-close recovery for `rendered` evidence; label untested configurations `not-checked`.
