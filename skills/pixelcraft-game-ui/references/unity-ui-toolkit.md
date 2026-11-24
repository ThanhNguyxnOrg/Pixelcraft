# Unity UI Toolkit

Use UI Toolkit (`UIDocument`, UXML, USS, `PanelSettings`) for CSS/Flexbox-inspired retained runtime menus, responsive HUDs, and shared editor/runtime UI in Unity 2022–Unity 6+. For GameObject-based `Canvas`/`TextMeshPro` UI, see `references/unity-ugui.md`.

## When to pick UI Toolkit vs uGUI

| Choose **UI Toolkit** (`unity-ui-toolkit.md`) | Choose **uGUI** (`unity-ugui.md`) |
|---|---|
| Responsive Flexbox menus, settings, inventories, HUD overlays, and shared Editor/Runtime tooling | Complex world-space / diegetic 3D curved/shader UI or UI-integrated particle effects |
| Unity 6 runtime `DataBinding` and `.tss` theme-sheet swapping (dark / high-contrast / colorblind) | Heavy dependence on existing `TextMeshPro` / uGUI third-party asset packages |
| Teams comfortable with CSS-like selectors and clean data/view separation | Fine-grained custom `CanvasRenderer` mesh/material hacks |

## Token mapping and `PanelSettings` themes

Define semantic custom properties in USS and switch palettes cleanly via `ThemeStyleSheet` (`.tss`) on `PanelSettings`:

```css
:root {
  --pc-color-action: rgb(0, 116, 202);
  --pc-color-surface: rgba(16, 20, 28, 0.92);
  --pc-text-primary: rgb(245, 247, 250);
}
.primary-action {
  background-color: var(--pc-color-action);
  color: var(--pc-text-primary);
}
```

Configure **`PanelSettings`** deliberately per overlay layer:

- set `Scale Mode` to `Scale With Screen Size` (with explicit Reference Resolution and Match ratio) or `Constant Physical Size` for touch targets;
- assign `Sort Order` across independent `UIDocument` panels (HUD < Menu < Modal < System Toast) rather than cramming unrelated trees into one document;
- attach a dedicated **`PanelTextSettings`** asset defining dynamic SDF font fallback chains;
- swap `PanelSettings.themeStyleSheet` (or root theme classes) for high-contrast, colorblind, or day/night modes.

## Unity 6 runtime Data Binding

In Unity 6+, replace manual per-frame `Update()` polling with declarative runtime **`DataBinding`** and **`[CreateProperty]`** (`Unity.Properties`):

```csharp
using Unity.Properties;
using UnityEngine;
using UnityEngine.UIElements;

public sealed class PlayerHudModel
{
    [CreateProperty] public string HealthLabel => $"HP {CurrentHp} / {MaxHp}";
    public int CurrentHp { get; set; } = 100;
    public int MaxHp { get; set; } = 100;
}

public sealed class HudBinder : MonoBehaviour
{
    [SerializeField] private UIDocument uiDocument;
    private readonly PlayerHudModel _model = new();

    private void OnEnable()
    {
        var label = uiDocument.rootVisualElement.Q<Label>("health-label");
        label.dataSource = _model;
        label.SetBinding("text", new DataBinding
        {
            dataSourcePath = new PropertyPath(nameof(PlayerHudModel.HealthLabel)),
            bindingMode = BindingMode.ToTarget,
        });
    }
}
```

Prefer `BindingMode.ToTarget` for read-only HUD telemetry and `TwoWay` only for interactive settings controls; avoid reflection-heavy ad-hoc polling loops.

## Layout, typography, and motion

- Use UXML Flexbox (`flex-direction`, `flex-grow`, percentage/`min-*`/`max-*` bounds) plus runtime `Screen.safeArea` padding on the root container; test ultrawide, portrait, and handheld resolutions.
- Configure TextCore font assets with **SDF/atlas** memory budgets and dynamic fallback chains covering CJK, Arabic/RTL, Cyrillic, and extended Latin; never lock labels to fixed widths that clip German/Finnish expansions.
- Use USS `transition-*` or experimental animations purposefully, exposing an in-game reduced-motion/flash-reduction setting (never block gameplay state transitions on animation completion).

## Unity 6 Runtime Accessibility and focus navigation

- **Unity 6 Runtime Accessibility (`UnityEngine.Accessibility`)**: register accessible trees via `AssistiveSupport`, `AccessibilityHierarchy`, and `AccessibilityNode` to expose screen-reader semantics on supported platforms (iOS VoiceOver, Android TalkBack, desktop where enabled); verify actual assistive-tech announcement on target hardware and label unverified platforms `not-checked`.
- **Controller/keyboard focus**: set `focusable = true` only on actionable elements, configure `tabIndex` and `NavigationMoveEvent` overrides when spatial grids/modals need deterministic D-pad traversal, style `:focus` visibly (never rely solely on `:hover`), and restore `element.Focus()` after closing popups.
- Model interruption states (pause, disconnect, loading, error, death/respawn, pending purchase) and virtual keyboard/paste support on `TextField` forms.

## Do/don't pairs

| Do | Don't |
|---|---|
| Use USS custom properties and `PanelSettings` `.tss` themes | Hard-code inline colors across UXML and C# callbacks |
| Use Unity 6 `DataBinding` + `[CreateProperty]` for reactive HUD/menu state | Poll every label and allocate formatted strings inside `Update()` |
| Configure `PanelTextSettings` dynamic SDF/atlas fallbacks and flexible container bounds | Ship fixed-width labels or Latin-only font atlases that clip or show tofu boxes |
| Restore `.Focus()` explicitly after modal close and style `:focus` clearly | Let controller focus vanish into a hidden/removed `VisualElement` |
| Expose `UnityEngine.Accessibility` nodes + colorblind/subtitle/scale toggles | Claim screen-reader support from visual labels alone without testing on device |

## Known traps

USS syntax gaps compared to browser CSS (no CSS Grid, subset of selectors/shadows), `pickingMode = PickingMode.Position` on full-screen overlay containers blocking clicks underneath (set `PickingMode.Ignore` on non-interactive HUD wrappers), atlas/glyph memory bloat, editor UI Builder preview diverging from runtime `PanelSettings` scaling, and scene-unload focus loss.

## Verification commands

Run the Unity CLI test runner configured for the repository without suppressing exit codes:

```sh
Unity -batchmode -projectPath . -runTests -testPlatform EditMode && \
Unity -batchmode -projectPath . -runTests -testPlatform PlayMode
```

Verify runtime PlayMode/device screenshots, controller-only traversal, resolution/aspect/safe-area matrix, pseudo-localized CJK/Arabic glyph coverage, accessibility module checks on device (`rendered`), and UI Toolkit Debugger layout inspection (`static`/`rendered`).
