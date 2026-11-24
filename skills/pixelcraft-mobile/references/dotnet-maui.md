# .NET MAUI

## Token mapping

Define semantic colors, spacing, and styles once in XAML `ResourceDictionary` files and pair them with **`{AppThemeBinding Light=..., Dark=...}`** (or dynamic theme dictionaries) so light, dark, and high-contrast themes resolve cleanly without inline hex literals:

```xml
<ResourceDictionary xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
                    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml">
  <Color x:Key="ActionLight">#0074CA</Color>
  <Color x:Key="ActionDark">#5BB2FF</Color>
  <Color x:Key="SurfaceLight">#FFFFFF</Color>
  <Color x:Key="SurfaceDark">#121417</Color>

  <Style TargetType="Button" x:Key="PrimaryActionButton">
    <Setter Property="BackgroundColor"
            Value="{AppThemeBinding Light={StaticResource ActionLight}, Dark={StaticResource ActionDark}}" />
    <Setter Property="MinimumHeightRequest" Value="48" />
  </Style>
</ResourceDictionary>
```

Enable compiled bindings (`x:DataType="vm:InvoiceViewModel"`) on every page and `DataTemplate` so binding typos fail at compile time rather than silently failing at runtime.

## Layout, handlers, hybrid surfaces, & desktop chrome

- Use `Grid`, `VerticalStackLayout`, `HorizontalStackLayout`, `FlexLayout`, and `Shell` intentionally; Shell's default flyout/tabs are not automatically the right IA for every app. Respect iOS safe areas (`ios:Page.UseSafeArea="True"`), Android edge-to-edge insets, and platform back behavior.
- **`CollectionViewHandler2`** (.NET 9/10 iOS & Mac Catalyst): use the modernized `UICollectionView`-backed handler (`ConfigureMauiHandlers` on .NET 9 or default on .NET 10) to avoid legacy scroll-sizing, header/footer, and cell-recycling glitches in `CollectionView`.
- **Desktop `TitleBar` (.NET 9+)**: on Windows and Mac Catalyst, use the native `Window.TitleBar` control (`TitleBar` with `LeadingContent`, `Content`, `TrailingContent`, and `PassthroughElements`) instead of hacking frameless windows or hiding system window buttons.
- **Hybrid web targets**:
  - Use **`BlazorWebView`** (Blazor Hybrid) to share Razor components across mobile, desktop, and web with native C# access.
  - Use **`HybridWebView`** (.NET 9+) to host existing JS/HTML/CSS SPAs (React/Vue/Svelte) inside MAUI with structured bidirectional JS↔C# `InvokeJavaScriptAsync` / `SendRawMessage` interop.

## State management (`CommunityToolkit.Mvvm` & `CommunityToolkit.Maui`)

Adopt **`CommunityToolkit.Mvvm`** (`[ObservableProperty]`, `[RelayCommand(IncludeCancelCommand = true)]`, `ObservableObject`) for zero-reflection source-generated MVVM with explicit cancellation, and **`CommunityToolkit.Maui`** for production behaviors, popups, status-bar styling, converters, and animations:

```csharp
public partial class InvoiceViewModel(IInvoiceService service) : ObservableObject
{
    [ObservableProperty] private bool isBusy;
    [ObservableProperty] private string? errorMessage;

    [RelayCommand(IncludeCancelCommand = true)]
    private async Task SaveAsync(CancellationToken ct)
    {
        ErrorMessage = null;
        IsBusy = true;
        try { await service.SaveAsync(ct); }
        catch (OperationCanceledException) { }
        catch (Exception ex) { ErrorMessage = ex.Message; }
        finally { IsBusy = false; }
    }
}
```

Never fire unawaited `async void` mutations from button clicks.

## Typography, motion, accessibility, & forms idioms

Register custom fonts via `ConfigureFonts(...)` in `MauiProgram.cs` and keep `FontAutoScalingEnabled="True"` on essential text; avoid fixed `HeightRequest` on labels that clip at `200%` font scale.

MAUI animations (`FadeTo`, `TranslateTo`) do not automatically query every OS reduced-motion flag—abstract reduced motion per platform (`UIAccessibility.IsReduceMotionEnabled` on iOS, `ANIMATOR_DURATION_SCALE` on Android, `UISettings.AnimationsEnabled` on Windows) and cancel in-flight animations on `OnDisappearing`.

Set `SemanticProperties.Description`, `SemanticProperties.Hint` (sparingly), and `SemanticProperties.HeadingLevel` on interactive and structural controls, and test TalkBack, VoiceOver, and Narrator separately—shared XAML does not guarantee equivalent native accessibility trees. In forms, configure `Keyboard`, `ReturnType`, focus order, validation after completion with text recovery copy (not red borders alone), and preserve input across navigation.

## Do/don't pairs

| Do | Don't |
|---|---|
| `{AppThemeBinding Light=..., Dark=...}` + `x:DataType` compiled bindings | Inline hex literals and untyped runtime-only bindings |
| `[RelayCommand(IncludeCancelCommand = true)]` via `CommunityToolkit.Mvvm` | Fire-and-forget `async void` event handlers with silent failures |
| `CollectionViewHandler2` on iOS/Mac Catalyst for complex lists | Ship legacy iOS `CollectionView` layout glitches without profiling |
| Native `Window.TitleBar` on Windows/Mac Catalyst (.NET 9+) | Custom borderless titlebar hacks missing drag or window buttons |
| `SemanticProperties.Description` & `HeadingLevel` verified per OS | Tap gesture recognizer on a `Label` masquerading as a button |

## Known traps

EOL target frameworks (`net8.0-*`—upgrade to `net9.0-*` or `net10.0-*`), silent XAML binding errors without `x:DataType`, `async void` crash/lifecycle leaks, legacy iOS `CollectionView` measurement glitches, fixed-height clipping under font scaling, platform-divergent safe-area insets on Android 15/16, unverified accessibility trees across iOS/Android/Windows.

## Verification commands

```sh
dotnet build
dotnet test
# Run target platform builds when matching workloads & simulators/emulators are installed:
dotnet build -t:Run -f net9.0-android   # or net10.0-android
dotnet build -t:Run -f net9.0-ios       # or net10.0-ios
```

`dotnet build` and `dotnet test` provide `static` evidence. Inspect real Android/iOS/Windows/Mac Catalyst runs with TalkBack/VoiceOver/Narrator, Dark Mode, High Contrast, font scaling, orientation/resize, and offline recovery for `rendered` evidence; label unavailable targets `not-checked`.
