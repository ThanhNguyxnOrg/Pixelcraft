# Godot 4 UI

## Token mapping and Theme architecture

Centralize semantic colors, fonts, font sizes, constants, and `StyleBox` assets in shared **`Theme`** resources (using `theme_type_variation` for semantic button/panel roles like `PrimaryButton` or `DangerBadge`), using scoped `add_theme_*_override` calls only for truly dynamic runtime state:

```gdscript
# Apply safe area, pause ownership, mouse pass-through, and Godot 4.5 AccessKit semantics
extends CanvasLayer

@onready var safe_margin: MarginContainer = $SafeMargin
@onready var pause_overlay: Control = $PauseOverlay
@onready var hud_banner: Label = $SafeMargin/HudBanner
@onready var resume_button: Button = $PauseOverlay/Panel/ResumeButton

func _ready() -> void:
	# Pause menu stays responsive while SceneTree is paused
	pause_overlay.process_mode = Node.PROCESS_MODE_WHEN_PAUSED
	# Decorative HUD text must never swallow clicks or hover beneath it
	hud_banner.mouse_filter = Control.MOUSE_FILTER_IGNORE
	# Godot 4.5+ AccessKit screen-reader semantics
	resume_button.accessibility_name = tr("UI_RESUME_GAME")
	resume_button.accessibility_description = tr("UI_RESUME_DESC")
	_apply_safe_area()
	get_viewport().size_changed.connect(_apply_safe_area)

func _apply_safe_area() -> void:
	var safe := DisplayServer.get_display_safe_area()
	var win_size := DisplayServer.window_get_size()
	if win_size.x <= 0 or win_size.y <= 0:
		return
	safe_margin.add_theme_constant_override("margin_left", safe.position.x)
	safe_margin.add_theme_constant_override("margin_top", safe.position.y)
	safe_margin.add_theme_constant_override("margin_right", win_size.x - safe.end.x)
	safe_margin.add_theme_constant_override("margin_bottom", win_size.y - safe.end.y)
```

## Layout, `DisplayServer.get_display_safe_area()`, and `mouse_filter`

- Build layouts with containers (`VBoxContainer`, `HBoxContainer`, `GridContainer`, `MarginContainer`, `AspectRatioContainer`) and explicit `size_flags` / anchors rather than absolute pixel positions; separate gameplay HUD `CanvasLayer` from modal/menu `CanvasLayer` ordering.
- Query **`DisplayServer.get_display_safe_area()`** (and reconnect on viewport resize/orientation changes) to pad root HUD margins away from mobile notches, camera cutouts, and TV overscan.
- Configure **`Control.mouse_filter`** deliberately on every Control:
  - `MOUSE_FILTER_STOP`: interactive buttons, modal backdrops, and clickable panels that intentionally consume pointer events;
  - `MOUSE_FILTER_PASS`: scrollable/container wrappers that observe events while letting unhandled clicks bubble to parents;
  - `MOUSE_FILTER_IGNORE`: decorative HUD labels, icons, vignettes, and non-interactive containers so they never block gameplay picking or clicks underneath.

## `CanvasItem.process_mode` and pause/state ownership

Set **`process_mode`** explicitly whenever pausing the `SceneTree` (`get_tree().paused = true`):

- `Node.PROCESS_MODE_PAUSABLE`: gameplay HUD tickers/animations that freeze while paused;
- `Node.PROCESS_MODE_WHEN_PAUSED`: pause menus and modal dialogs active only during pause;
- `Node.PROCESS_MODE_ALWAYS`: global audio/settings/system-notification layers and the pause-toggle controller itself.

Store the previously focused `Control` (`get_viewport().gui_get_focus_owner()`) before opening popups and call `grab_focus()` on close so controller focus is never orphaned.

## Typography and MSDF fonts

- Use dynamic `FontFile` (TTF/OTF/WOFF2) with explicit `fallbacks` arrays covering CJK, Arabic/RTL (Godot 4 includes HarfBuzz + ICU BiDi shaping), Cyrillic, and symbols; reserve bitmap fonts strictly for pixel-art games with verified locale coverage.
- **MSDF fonts**: enable `multichannel_signed_distance_field = true` on `FontFile` import settings for crisp UI scaling across 720p–4K and user HUD-scale sliders. Note that MSDF cannot represent overlapping variable-font contours or every complex script cleanly—verify CJK/Arabic/Indic rendering and keep raster dynamic fallback fonts where needed.

## Accessibility and Godot 4.5 AccessKit

- **Godot 4.5 native AccessKit**: Godot 4.5 integrates AccessKit for native screen-reader trees on supported desktop/mobile platforms. Set **`accessibility_name`**, **`accessibility_description`**, and semantic control types (`Button`, `CheckBox`, `HSlider`, `Label`) especially on icon-only buttons and custom-drawn `Control` nodes, and test on actual assistive technology (label untested platforms `not-checked`).
- Configure `focus_mode` (`FOCUS_ALL` for interactive controls, `FOCUS_NONE` for decorative nodes), explicit `focus_neighbor_*` overrides where spatial focus jumps erratically, visible `:focus` `StyleBox` states, `ui_accept`/`ui_cancel` InputMap parity, subtitles/scale/colorblind/reduced-motion settings, and conflict-aware remapping.

## Do/don't pairs

| Do | Don't |
|---|---|
| Shared `Theme` + `theme_type_variation` with scoped overrides | Duplicating `StyleBox` and font overrides across every `Control` |
| Set `mouse_filter = MOUSE_FILTER_IGNORE` on decorative HUD overlays and `process_mode = PROCESS_MODE_ALWAYS`/`WHEN_PAUSED` on pause UI | Leave default `MOUSE_FILTER_STOP` blocking clicks or freeze the pause menu when `get_tree().paused = true` |
| Apply `DisplayServer.get_display_safe_area()` and responsive containers | Hard-code 1920×1080 pixel coordinates that clip on notches or ultrawide screens |
| Set Godot 4.5 `accessibility_name`/`accessibility_description`, explicit `focus_neighbor_*`, and focus restoration | Ship icon-only controls with no accessible name or orphan focus on `queue_free()` |
| Enable MSDF selectively with dynamic fallback fonts tested on CJK/Arabic | Assume English editor glyphs cover localized player names or variable scales |

## Known traps

Default `MOUSE_FILTER_STOP` silently blocking clicks under full-rect containers, focus lost when freeing a focused node, `process_mode` freezing pause/unpause buttons, `Theme` item lookup confusion (theme values are not ordinary node properties), MSDF artifacts on complex overlapping glyphs, and controller/keyboard `ui_*` InputMap conflicts.

## Verification commands

Run the project's configured headless test runner (e.g., GUT or GdUnit4) preserving exit status and logs, then launch the affected scene in the target Godot runtime:

```sh
godot --headless --path . --quit-after 1
```

Inspect runtime screenshots, controller-only focus flows, `DisplayServer.get_display_safe_area()` / ultrawide / stretch-mode matrix, pseudo-localized CJK/Arabic fonts, Godot 4.5 AccessKit output on supported OS screen readers, and pause/interruption recovery (`rendered`).
