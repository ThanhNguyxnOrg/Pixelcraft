# Unreal UMG, CommonUI, MVVM, and Slate

## Production architecture: CommonUI + UMG ViewModel (MVVM)

For any shipping PC/console/cross-platform Unreal game, pair **UMG** with the official **CommonUI** and **UMG ViewModel (`MVVM`)** plugins rather than raw `AddToViewport()` and per-frame Blueprint property bindings:

### CommonUI idioms

- **`UCommonActivatableWidget`**: base class for every screen, HUD overlay, and modal dialog. Manages explicit `NativeOnActivated()` / `NativeOnDeactivated()` lifecycle, input config (`GetDesiredInputConfig()`), and back-action handling.
- **`UCommonActivatableWidgetStack`**: manages layered UI stacks (HUD layer, Menu layer, Modal layer, System Prompt layer) with automatic focus handoff and back-button popping—never scatter `AddToViewport(ZOrder)` calls across Blueprints.
- **`NativeGetDesiredFocusTarget()`**: override on every `UCommonActivatableWidget` so opening or returning to a screen places controller/keyboard focus on a guaranteed valid widget instead of dropping focus to the viewport.
- **`UCommonInputSubsystem` & `UCommonActionWidget`**: automatically detects input method switches (`ECommonInputType::Gamepad`, `MouseAndKeyboard`, `Touch`) and swaps button prompt glyphs dynamically from `UCommonInputBaseControllerData` data tables (Xbox, PlayStation, Switch, Steam Deck, KBM) without hard-coded icon branches.

```cpp
// Header / implementation excerpt for a CommonUI menu screen
UWidget* USettingsScreen::NativeGetDesiredFocusTarget() const
{
    if (PrimaryAudioSlider && PrimaryAudioSlider->IsVisible())
    {
        return PrimaryAudioSlider;
    }
    return Super::NativeGetDesiredFocusTarget();
}

TOptional<FUIInputConfig> USettingsScreen::GetDesiredInputConfig() const
{
    return FUIInputConfig(ECommonInputMode::Menu, EMouseCaptureMode::NoCapture);
}
```

### UMG ViewModel (`MVVM`) plugin

- Replace Blueprint **tick-bound property functions** (which execute every Slate frame regardless of whether data changed!) with push-based **`UMVVMViewModelBase`** subclasses using `UPROPERTY(FieldNotify)` and `UE_MVVM_SET_PROPERTY_VALUE(Health, NewHealth)`.
- Keep gameplay actors decoupled from widgets: widgets subscribe to ViewModel field notifications, preventing circular hard references and per-frame UI CPU spikes.

### Enhanced Input UI routing

- Pair **Enhanced Input** (`UInputMappingContext` priority stacking) with CommonUI's `FUIInputConfig` (`ECommonInputMode::Game`, `Menu`, `All`) so opening a pause menu or radial wheel never leaks weapon firing/movement into gameplay or traps `Cancel`/`Back`.

## Slate (`SCompoundWidget` / `FSlateStyleSet`) vs UMG boundary

| Use **UMG + CommonUI + MVVM** | Drop to **C++ Slate (`SCompoundWidget`, `FSlateStyleSet`)** |
|---|---|
| Runtime game HUDs, menus, inventories, and artist-authored animations/layouts | Unreal Editor tools, custom debug inspectors, and viewport overlays |
| CommonUI style assets (`UCommonTextStyle`, `UCommonButtonStyle`, `UCommonBorderStyle`) | Pre-world loading screens (`IGameMoviePlayer`), ultra-hot custom `OnPaint` batching, or custom widgets wrapped by a `UWidget` host |

## Batching and performance (`InvalidationBox`, `RetainerBox`)

- **`UInvalidationBox`** (or project-wide Global Invalidation): caches Slate layout/geometry for static or rarely mutated subtrees so unchanging HUD frames skip per-frame pre-pass and paint.
- **`URetainerBox`**: renders a widget subtree into an offscreen render target for custom UI post-process materials (chromatic aberration, curved visor) or throttled refresh cadence (`Phase` / `PhaseCount`, e.g., updating a minimap every 2–4 frames). Profile VRAM and draw-call overhead—never wrap every panel in a `RetainerBox`.

## Layout, typography, accessibility, and states

- Use `SafeZone`, `Overlay`, `VerticalBox`, `HorizontalBox`, `GridPanel`, `SizeBox`, and `ScaleBox` deliberately; never anchor entire HUDs strictly inside `CanvasPanel` with fixed pixel offsets that break on 21:9/32:9 or handheld screens.
- Configure Composite Font assets with explicit script sub-fonts for CJK, Arabic, Thai, and Cyrillic; test DPI curve scaling, subtitle size/backdrop options, colorblind shaders/palettes, reduced-motion/flash settings, and virtual keyboard / platform auth flows.
- Model input-mode and interruption transitions (loading, disconnect, controller disconnect, death/respawn, cutscene, pending purchase) as explicit UI states.

## Do/don't pairs

| Do | Don't |
|---|---|
| Push screens onto `UCommonActivatableWidgetStack` and override `NativeGetDesiredFocusTarget()` | Scatter `AddToViewport()` calls and lose controller focus when closing modals |
| Use `UMVVMViewModelBase` (`FieldNotify`) push bindings | Bind Blueprint functions directly to widget text/progress properties evaluated every tick |
| Use `UCommonActionWidget` + `UCommonInputSubsystem` for live device glyph swapping | Hard-code `"Press [E]"` or Xbox-only textures across PC/PlayStation/Switch builds |
| Centralize tokens in `UCommonTextStyle` / `UCommonButtonStyle` / `FSlateStyleSet` | Copy raw colors and font settings across every individual Widget Blueprint |
| Wrap static subtrees in `InvalidationBox` and reserve `RetainerBox` for measured shader/throttle needs | Put every HUD widget inside a `RetainerBox`, blowing mobile/console VRAM |

## Known traps

Tick-bound Blueprint property bindings burning frame budget, `AddToViewport` Z-order/focus leaks without CommonUI stacks, input-mode mismatches trapping controller input or leaking gameplay actions, hard asset references loaded synchronously by HUD widgets, missing localized Composite Font sub-fonts, and PIE 16:9 testing hiding SafeZone/ultrawide clipping.

## Verification commands

Run the project's Unreal Automation / UAT build command against the repo `.uproject` without suppressing failures:

```sh
RunUAT BuildCookRun -project="<PathToProject>.uproject" -build -unattended
```

Profile Slate/UMG with `stat Slate`, Widget Reflector, and Unreal Insights (`rendered`); test controller-only focus flows, device hot-swap glyphs, resolution/aspect/SafeZone matrix, pseudo-localized fonts, and interruption states on target platforms (`rendered`, labeling untested certification items `not-checked`).
