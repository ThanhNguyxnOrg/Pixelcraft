# Uno Platform (5 / 6)

## Architecture: `Uno.Sdk` Single Project & Skia Desktop

Modern Uno Platform 5/6 consolidates desktop, mobile, and web targets inside a single **`Uno.Sdk`** project (`<Project Sdk="Uno.Sdk">`) with feature flags (`<UnoFeatures>`) and a unified **Skia Desktop** renderer (`net9.0-desktop` / `net10.0-desktop`) shipping consistent rendering across Windows, macOS, and Linux from one Skia host alongside native WinUI (`net9.0-windows*`), iOS, Android, and WebAssembly targets:

```xml
<Project Sdk="Uno.Sdk">
  <PropertyGroup>
    <TargetFrameworks>net9.0-desktop;net9.0-windows10.0.22621;net9.0-ios;net9.0-android;net9.0-browserwasm</TargetFrameworks>
    <UnoFeatures>Material;Toolkit;MVUX;SkiaRenderer</UnoFeatures>
  </PropertyGroup>
</Project>
```

Shared XAML and Skia rendering do **not** erase host platform conventions: desktop windows still require native menus/shortcuts, minimum resize bounds, and keyboard acceleration; mobile targets still require safe areas, touch targets, and predictive/swipe back (`pixelcraft-mobile`).

## Token mapping & Uno Toolkit

Map DTCG semantic tokens into WinUI-compatible `ResourceDictionary.ThemeDictionaries` (`Default`, `Light`, `HighContrast`) consumed via `{ThemeResource ...}` rather than inline hex literals.

Use **Uno Toolkit** (`Uno.Toolkit.UI`) layout and navigation primitives to avoid hand-rolling cross-target layout math:
- **`AutoLayout`** (Figma-aligned stack/spacing/alignment container with predictable padding/gap),
- **`SafeArea`** (`utu:SafeArea.Insets="VisibleBounds"` so mobile notches and desktop chrome stay clear),
- **`NavigationBar`** and **`DrawerControl`** adapting cleanly between narrow mobile panes and wider desktop layouts.

## State management: MVUX & MVVM

Alongside standard MVVM (`CommunityToolkit.Mvvm`), Uno provides **MVUX (Model-View-Update eXtended)**—immutable C# records + `IFeed<T>` / `IState<T>` + **`FeedView`** that automatically binds loading, data, empty, and error templates without boolean soup:

```csharp
public partial record InvoiceModel(IInvoiceService Service)
{
    public IFeed<IImmutableList<Invoice>> Invoices => Feed.Async(Service.GetAllAsync);
    public IState<string> Filter => State<string>.Value(this, () => string.Empty);
}
```

Pair `FeedView` with explicit `ProgressTemplate`, `NoneTemplate` (empty state), and `ErrorTemplate` (with retry command) so every async branch is intentionally designed.

## Typography, motion, accessibility, & Hot Design

Bundle font assets in shared resources and verify glyph coverage, DPI scaling, and text rasterization separately on native WinUI vs Skia Desktop vs WebAssembly. Keep WinUI/XAML transitions concise and honor host reduced-motion preferences where exposed (or provide an app-level toggle on targets without OS hook parity).

Uno implements the WinUI UI Automation model (`AutomationProperties.Name`, `LabeledBy`, `HeadingLevel`, `LiveSetting`) with renderer-dependent maturity across WinUI, Skia Desktop (Windows/macOS/Linux), mobile, and WASM. Prefer standard controls with built-in automation peers and verify actual Narrator/VoiceOver/Orca/TalkBack trees per shipped target rather than extrapolating from Windows alone.

**Hot Design** (runtime visual designer + XAML/C# Hot Reload) accelerates layout iteration on a live running app, but tweaking spacing inside Hot Design is **not** verification for keyboard traversal, High Contrast, DPI scaling, or OS accessibility.

## Do/don't pairs

| Do | Don't |
|---|---|
| Use `Uno.Sdk` Single Project + `<UnoFeatures>` + `ThemeDictionaries` | Duplicate per-platform head projects and inline hex brushes |
| Pair MVUX `IFeed<T>` with explicit `FeedView` error/empty/loading templates | Leave unhandled async exceptions or blank screens on empty feeds |
| Use Uno Toolkit `SafeArea` & adaptive desktop/mobile navigation | Ship a mobile bottom tab bar unchanged on 1440px Skia Desktop |
| Verify `AutomationProperties` and keyboard navigation on each target renderer | Assume WinUI accessibility automatically guarantees Skia Linux/WASM parity |

## Known traps

Renderer parity differences between native WinUI, Skia Desktop, and WASM, missing `HighContrast` theme dictionary keys, unverified Skia font fallbacks on Linux, cold-start WASM payload bloat without AOT/trimming profiling, treating Hot Design previews as cross-OS QA.

## Verification commands

```sh
dotnet build
dotnet test
# Run target framework explicitly (e.g., Skia Desktop or Windows):
dotnet run -f net9.0-desktop
```

`dotnet build` and `dotnet test` provide `static` evidence. Run each shipped target framework (Skia Desktop on macOS/Linux/Windows, native WinUI, mobile, or WASM) across keyboard navigation, screen readers, Dark/High Contrast modes, resize/DPI, and offline/resume states for `rendered` evidence; label untested targets `not-checked`.
