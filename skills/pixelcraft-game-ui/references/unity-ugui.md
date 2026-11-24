# Unity uGUI (`Canvas`, `CanvasScaler`, `RectTransform`, `TextMeshPro`)

Use this reference for Unity's GameObject-based **uGUI** runtime (`UnityEngine.UI` + `TMPro`), especially for world-space/diegetic canvases, shader/particle-integrated HUDs, or projects already standardized on uGUI. For UXML/USS retained UI, read `references/unity-ui-toolkit.md`.

## Canvas dirty-rebuild splitting and batching

Modifying *any* `Graphic` (color, text, alpha) or `RectTransform` marks its parent `Canvas` dirty and forces a full geometry and layout rebuild (`Canvas.BuildBatch`, `Canvas.SendWillRenderCanvases`) across every sibling on that `Canvas`:

- **Split static vs dynamic Canvases**: isolate static backgrounds, frames, and rarely changing labels on one `Canvas`, and place high-frequency HUD widgets (health bars, cooldown timers, damage numbers, minimap markers) on separate nested sub-`Canvas` components (sub-Canvases break dirty propagation upward while inheriting scaling from the root `CanvasScaler`).
- **Disable `Raycast Target`** on all non-interactive `Image`, `RawImage`, and `TMP_Text` components to trim `GraphicRaycaster` cost and prevent invisible decorative overlays from eating clicks.
- **Avoid per-frame LayoutGroup churn**: disable `ContentSizeFitter` / `LayoutGroup` after one-time population when dynamic lists don't resize every frame, and use object pooling instead of `Instantiate`/`Destroy` for combat floaters or inventory slots.
- **Pack sprites into Sprite Atlases** and minimize `Mask` (stencil) vs `RectMask2D` (cheaper 2D clipping without extra stencil draw calls).

## `CanvasScaler`, `RectTransform`, and `Screen.safeArea`

- Set `CanvasScaler` to **`Scale With Screen Size`** with an explicit Reference Resolution (e.g., `1920×1080`) and deliberate `Screen Match Mode`:
  - `Match Width Or Height` (typically `0.5` for balanced aspect scaling, or dynamic switching by aspect ratio);
  - `Expand` when no edge clipping is allowed across ultrawide (21:9/32:9) and narrow (4:3/portrait) screens.
- Apply `Screen.safeArea` to a root child `RectTransform` at startup and on orientation/resolution changes so notches, Dynamic Island, and TV overscan never clip HUD anchors.

```csharp
using UnityEngine;
using UnityEngine.EventSystems;

public sealed class SafeAreaPanel : MonoBehaviour
{
    private RectTransform _rect;
    private Rect _lastSafeArea;

    private void Awake() => _rect = (RectTransform)transform;

    private void LateUpdate()
    {
        if (Screen.safeArea == _lastSafeArea) return;
        _lastSafeArea = Screen.safeArea;
        var min = _lastSafeArea.position;
        var max = min + _lastSafeArea.size;
        min.x /= Screen.width;  min.y /= Screen.height;
        max.x /= Screen.width;  max.y /= Screen.height;
        _rect.anchorMin = min;
        _rect.anchorMax = max;
    }
}
```

## `TextMeshPro` (`TMP_Text`) typography and localization

- Always use **`TextMeshPro` (`TMP_Text` / `TextMeshProUGUI`)**—never legacy `UnityEngine.UI.Text`.
- **SDF Atlases & Fallback Chains**: use static SDF atlases for fixed Latin HUD fonts and configure **Dynamic SDF + Multi-Atlas** fallback fonts in `TMP_Settings` (or per `TMP_FontAsset.fallbackFontAssetTable`) covering **CJK, Arabic/Hebrew (with RTL shaping plugin where needed), Cyrillic, Thai, and user-generated names** so missing glyphs never render as empty squares.
- **Zero-GC updates**: use `tmpText.SetText("HP: {0} / {1}", hp, maxHp)` instead of string interpolation (`$"HP: {hp}"`) inside `Update()`.
- Keep `Auto Size` constrained with a readable minimum font size rather than letting long German/Finnish strings shrink to illegible 8px text.

## `EventSystem`, `InputSystemUIInputModule`, and explicit `Selectable` navigation

- Pair `EventSystem` with Unity's **`InputSystemUIInputModule`** (replacing legacy `StandaloneInputModule`), mapping `Navigate`, `Submit`, `Cancel`, and `Point` cleanly to Input Actions.
- Set **`Deselect On Background Click` = false** (or keep a focus guard) in controller-capable menus so an accidental mouse click on empty space never orphans gamepad focus.
- **Explicit `Selectable` Navigation**: Unity's `Navigation.Mode.Automatic` casts spatial rays that break on scroll views, non-uniform grids, and tabbed dialogs. Set `Navigation.Mode.Explicit` (`selectOnUp`, `selectOnDown`, `selectOnLeft`, `selectOnRight`) on grids/menus and restore `EventSystem.current.SetSelectedGameObject(previous)` when closing any modal:

```csharp
public sealed class ModalFocusGuard : MonoBehaviour
{
    [SerializeField] private GameObject initialSelection;
    private GameObject _previousSelection;

    private void OnEnable()
    {
        _previousSelection = EventSystem.current?.currentSelectedGameObject;
        if (initialSelection != null)
            EventSystem.current?.SetSelectedGameObject(initialSelection);
    }

    private void OnDisable()
    {
        if (_previousSelection != null && _previousSelection.activeInHierarchy)
            EventSystem.current?.SetSelectedGameObject(_previousSelection);
    }
}
```

## World-space and diegetic Canvases

- Always assign the **`Event Camera`** on every `Render Mode: World Space` Canvas—leaving it null triggers expensive `Camera.main` lookups on raycasts.
- Scale world-space canvases in physical meters (e.g., `0.002`–`0.005`), disable raycasting on display-only nameplates, and route world-space UI to a separate camera/layer if bloom, motion blur, or depth-of-field degrades text contrast.
- Pair diegetic/world-space counters with a non-diegetic or accessibility HUD option for low-vision players.

## Do/don't pairs

| Do | Don't |
|---|---|
| Split static frames and per-frame animated HUD elements onto separate sub-Canvases | Put an entire HUD + animated damage numbers under one root `Canvas`, triggering full-tree dirty rebuilds every frame |
| Configure `CanvasScaler` (`Scale With Screen Size`) + `Screen.safeArea` root container | Design in `Constant Pixel Size` or assume fixed 16:9 1080p edges |
| Use `TextMeshPro` SDF + Dynamic fallback chains for CJK/Arabic and `SetText(...)` for zero-GC updates | Ship legacy `UI.Text`, Latin-only static atlases, or per-frame string allocations |
| Use `InputSystemUIInputModule`, `Navigation.Mode.Explicit`, and modal focus restoration | Rely on `Automatic` navigation across scroll views or drop gamepad focus on background clicks |
| Disable `Raycast Target` on decorative `Image`/`TMP_Text` and assign `Event Camera` on World Space Canvases | Leave `Raycast Target` enabled on every icon and background panel |

## Known traps

Full-Canvas dirty rebuild spikes from a single animated alpha/text element, `GraphicRaycaster` blocked by transparent decorative images, `TMP` missing CJK/RTL fallback glyphs, `Deselect On Background Click` breaking controller navigation, `ScrollRect` not auto-scrolling to keep keyboard/gamepad selected items in view, and post-processing bloom washing out World Space Canvas text.

## Verification commands

Run Unity EditMode and PlayMode tests without suppressing failures:

```sh
Unity -batchmode -projectPath . -runTests -testPlatform EditMode && \
Unity -batchmode -projectPath . -runTests -testPlatform PlayMode
```

Profile `Canvas.BuildBatch` and `Canvas.SendWillRenderCanvases` in Unity Profiler + Frame Debugger (`rendered`), walk every menu with controller-only input (`rendered`), and verify aspect-ratio (16:9, 21:9, 32:9, handheld, notched mobile) and pseudo-localized CJK/Arabic builds (`rendered`).
