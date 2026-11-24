# Web game engines, AAA/native UI middleware, and indie engines

Use this reference when game UI runs in HTML5/web engines, cross-engine native UI middleware, or C/C++/Lua/TypeScript indie engines. Pair with `references/hud-principles.md` for HUD legibility, controller focus, safe areas, HDR/ultrawide clamps, and accessibility floors.

## 1. HTML5 and Web Game Engines

| Engine | Primary UI idiom | Critical rules & accessibility notes |
|---|---|---|
| **Phaser (3 / 4)** | Parallel `HUDScene` (`scene.launch('HUDScene')`), `DOMElement` (`this.add.dom(...)`), or **RexUI** (`rexUI.add.sizer`, scrollable panels, dialogs) | Enable `dom: { createContainer: true }` in `Phaser.Game` config for accessible HTML forms/menus synced to the game viewport; set `pointer-events: none` on the overlay container and `pointer-events: auto` on interactive controls so canvas input stays intact. Keep `HUDScene` fixed with `setScrollFactor(0)` and handle `scale.on('resize')`. |
| **PixiJS (v8 + `@pixi/ui`)** | `@pixi/ui` (`FancyButton`, `Slider`, `ScrollBox`, `Input`, `List`) + `@pixi/layout` (Yoga Flexbox) or semantic HTML HUD overlay | Canvas-drawn widgets lack screen-reader semantics unless wired via PixiJS's `accessibility` plugin (`accessible`, `accessibleTitle`, `accessibleType`) or paired with an HTML/ARIA HUD layer. Size canvas cleanly with `autoDensity: true, resolution: window.devicePixelRatio`. |
| **Excalibur** | Semantic HTML/CSS HUD overlay bound to engine events; `ScreenElement` for in-canvas markers | Excalibur's own docs favor real HTML/CSS overlays for menus, inventories, forms, and localization so keyboard focus, RTL, screen readers, and responsive text work natively instead of fighting `<canvas>`. |
| **Kaplay** (Kaboom.js successor) | Fixed screen-space objects (`fixed()`, `z(100)`, `anchor(...)`, `area()`) + explicit scenes (`go('pause')`) | Kaplay has no built-in focus manager—implement explicit keyboard/gamepad selection state (`onKeyPress`, `onGamepadButtonPress`) and recompute UI anchors on `onResize(...)`. |

```ts
// Phaser 3/4: parallel HUDScene + accessible DOM overlay pattern
export class HudScene extends Phaser.Scene {
  constructor() { super({ key: 'HudScene' }); }

  create() {
    const score = this.add.text(24, 20, 'SCORE 0', { fontFamily: 'Inter', fontSize: '24px', color: '#f8fafc' })
      .setScrollFactor(0)
      .setDepth(100);

    // Accessible HTML pause button/form over the WebGL canvas
    const pauseEl = this.add.dom(this.scale.width - 24, 24).createFromHTML(
      '<button type="button" aria-label="Pause game" style="padding:8px 14px;">Pause</button>',
    );
    pauseEl.setOrigin(1, 0);
    pauseEl.addListener('click').on('click', () => this.scene.launch('PauseScene'));

    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      pauseEl.setPosition(gameSize.width - 24, 24);
      score.setPosition(24, 20);
    });
  }
}
```

## 2. AAA and Native UI Middleware

| Middleware | Authoring model | Best for | Key constraints |
|---|---|---|---|
| **NoesisGUI** | Hardware-accelerated **XAML / MVVM** (C++ / C#; plugins for Unity, Unreal, custom engines) | AAA/AA cross-platform HUDs & menus with crisp GPU vector rendering, Blend designer workflow, resource dictionaries, and low memory | Keep ViewModels push-driven (`INotifyPropertyChanged`), load localized `ResourceDictionary` files per language, and profile vector tessellation on large animated paths |
| **RmlUi** | Open-source C++ **HTML/CSS (`RML`/`RCSS`)** with Flexbox & `DataModelConstructor` binding | Custom C++ engines (SDL, bgfx, Vulkan, DX12, OpenGL) wanting web-like layout without a browser process | RCSS is a curated CSS subset—do not assume arbitrary browser CSS; wire custom font-face loading (`Rml::LoadFontFace`) for CJK/Arabic and explicit gamepad focus navigation |
| **Coherent Gameface** | Commercial AAA **HTML5 / CSS / JS** game UI runtime (PC/console) | Studios building live-service HUDs/stores with web frontend teams at 60–120 fps | Supports a performance-hardened subset of CSS/DOM; avoid layout-thrashing DOM reads/writes per frame, pool lists to eliminate JS GC pauses, and split lightweight HUD views from heavy store/inventory views |
| **Dear ImGui** | Immediate-mode C++ UI (`ImGui::Begin`, docking, viewports) | In-game debug consoles, engine tools, and high-density simulation/strategy inspector HUDs | Enable `ImGuiConfigFlags_NavEnableKeyboard` + `ImGuiConfigFlags_NavEnableGamepad`, scale fonts and style (`ImGuiStyle::ScaleAllSizes`) for HiDPI/4K, and note lack of native OS screen-reader tree unless integrated with custom accessibility bridges |

```cpp
// RmlUi C++: bind reactive game state cleanly via DataModelConstructor (zero per-frame string DOM churn)
if (Rml::DataModelConstructor ctor = context->CreateDataModel("hud")) {
    ctor.Bind("health", &playerState.health);
    ctor.Bind("ammo", &playerState.ammo);
    ctor.BindEventCallback("on_resume", [&](Rml::DataModelHandle, Rml::Event&, const Rml::VariantList&) {
        game.Resume();
    });
    hudModelHandle = ctor.GetModelHandle();
}
// When health changes: hudModelHandle.DirtyVariable("health");
```

## 3. Native and Indie Engines

- **Raylib + `raygui`** (C/C++/multi-language):
  - Pass `FLAG_WINDOW_HIGHDPI | FLAG_WINDOW_RESIZABLE` before `InitWindow`, scale layouts from `GetScreenWidth()`/`GetScreenHeight()`, load theme styles with `GuiLoadStyle(...)`, and load non-ASCII localization codepoints explicitly via `LoadFontEx(path, size, codepoints, count)` (default Raylib fonts load ASCII only!). Wire manual keyboard/gamepad focus indices since `raygui` is pointer-first.
- **SDL3 + `SDL_ttf` v3** (C/C++):
  - Use `SDL_GetWindowDisplayScale(window)` and `SDL_GetDisplayUsableBounds(...)` for crisp HiDPI and safe-area sizing across macOS/Windows/Linux/mobile.
  - Use **`SDL_ttf` v3** (`TTF_CreateText`, `TTF_CreateRendererTextEngine` / `TTF_CreateGPUTextEngine`) with built-in HarfBuzz shaping for accurate **Arabic/RTL, Indic, and CJK** rendering and text wrapping.
  - Detect exact controller glyphs via **`SDL_GetGamepadType(gamepad)`** (`SDL_GAMEPAD_TYPE_PS5`, `XBOXONE`, `NINTENDO_SWITCH_PRO`, etc.) so button prompts match physical hardware automatically.
- **Defold** (Lua `.gui` / `.gui_script`):
  - Set each GUI node's **Adjust Mode** deliberately (`FIT` for HUD elements preserving aspect ratio, `ZOOM` for full-bleed backdrops, `STRETCH` rarely), author responsive **Layout Profiles** (Landscape / Portrait) in `.gui`, use slice-9 textures for scalable frames, watch dynamic font-atlas page limits for CJK, and manage `acquire_input_focus` / `release_input_focus` explicitly so modal popups consume input before gameplay scripts.
- **Cocos Creator** (TypeScript):
  - Anchor responsive HUD modules with **`Widget`** + **`Layout`** containers, attach **`SafeArea`** to the top-level HUD node for mobile/WeChat mini-game cutouts, tune `Label` **`CacheMode`** (`NONE` for rarely updated dynamic strings, `BITMAP` for static labels, `CHAR` for dense CJK text sharing a global glyph atlas to control VRAM), and verify `Button` focus/keyboard handling when targeting web or desktop.
- **Ebitengine** (Go 2D + **`ebitenui`**):
  - Build menus, HUD panels, and lists with **`ebitenui`** (`widget.Container`, `widget.RowLayout`/`GridLayout`, `widget.Button`, `widget.List`) rather than raw `ebitenutil.DebugPrint` or manual rectangle hit-testing.
  - Scale crisp HiDPI interfaces using `ebiten.Monitor().DeviceScaleFactor()` inside `LayoutF(outsideWidth, outsideHeight)`, render localized scripts with `text/v2` (`GoTextFaceSource` + fallback faces for CJK/RTL), and track keyboard/gamepad focus explicitly because `ebitenui` is pointer-first.
- **Macroquad** (Rust 2D lightweight UI):
  - Switch back to screen-space HUD coordinates with `set_default_camera()`, read `screen_width()`/`screen_height()` and `screen_dpi_scale()`, and build menus/inspectors with `macroquad::ui` (`root_ui()` skins) or `egui-macroquad` instead of hand-rolled `draw_rectangle`/`draw_text` layout math. Load explicit TTF fonts (`load_ttf_font`) and wire keyboard/gamepad selection indices cleanly.
- **Flame** (Flutter / Dart 2D overlays):
  - Keep menus, pause dialogs, inventories, HUD bars, and settings in **real Flutter widgets** mounted via **`GameWidget.overlayBuilderMap`** (`game.overlays.add('PauseMenu')` / `remove(...)`)—this gives TalkBack/VoiceOver semantics, Dynamic Type/`sp` scaling, RTL/localization, `SafeArea`, and keyboard/gamepad `FocusTraversalGroup` automatically. Reserve Flame canvas `PositionComponent`s strictly for diegetic world-space markers.
- **Pygame (`pygame-ce`) & Python Arcade**:
  - **Pygame**: avoid raw `pygame.draw.rect` + `font.render` layout loops for structured menus—use **`pygame_gui`** (`UIManager`, JSON theme tokens, relative `anchors`, `process_events`/`update`/`draw_ui`, `set_window_resolution` on `VIDEORESIZE`) or `pygame-menu`, compute safe-area margins against logical display size, and wire explicit `JOYHATMOTION`/`JOYBUTTONDOWN` focus navigation.
  - **Arcade**: use `arcade.gui.UIManager` with `UIAnchorLayout` / `UIBoxLayout` / `UIGridLayout` on a dedicated GUI `Camera2D` separate from the gameplay camera, and call `manager.enable()` / `manager.disable()` cleanly on `arcade.View` transitions so inactive menus never swallow gameplay input.

```c
// SDL3: scale HUD by HiDPI display factor and resolve physical gamepad glyph family
float scale = SDL_GetWindowDisplayScale(window);
SDL_GamepadType padType = SDL_GetGamepadType(gamepad);
const char *glyphSet =
    (padType == SDL_GAMEPAD_TYPE_PS5 || padType == SDL_GAMEPAD_TYPE_PS4) ? "playstation" :
    (padType == SDL_GAMEPAD_TYPE_NINTENDO_SWITCH_PRO) ? "nintendo" : "xbox";
```

```dart
// Flame (Flutter/Dart): bridge accessible native Flutter widgets over the game loop
GameWidget<MyGame>(
  game: game,
  overlayBuilderMap: {
    'PauseMenu': (context, game) => SafeArea(
      child: Center(
        child: FocusTraversalGroup(
          child: PauseMenuCard(onResume: () => game.overlays.remove('PauseMenu')),
        ),
      ),
    ),
  },
);
```

## Do/don't pairs

| Do | Don't |
|---|---|
| Pair HTML5 canvas engines (Phaser/PixiJS/Excalibur) with accessible HTML/DOM menus or explicit ARIA/accessibility bindings | Trap complex forms, settings, and screen-reader users inside an opaque `<canvas>` |
| Render Flame menus/HUDs as native Flutter widgets via `overlayBuilderMap` (`SafeArea` + semantics) | Hand-draw text menus onto Flame's canvas and lose VoiceOver/TalkBack, RTL, and text scaling |
| Use `ebitenui` (Go), `macroquad::ui`/`egui-macroquad` (Rust), and `pygame_gui`/`arcade.gui` (Python) | Hand-roll brittle `drawRect`/`fillText`/`pygame.draw.rect` layout and hit-test engines |
| Use data-bound MVVM/data-model updates in NoesisGUI, RmlUi, and Gameface | Rebuild entire XAML/RML/DOM subtrees or allocate JS objects every frame |
| Enable `NavEnableGamepad` + HiDPI `ScaleAllSizes` in Dear ImGui, and load non-ASCII codepoints in Raylib / HarfBuzz text engines in SDL3 `SDL_ttf` v3 | Assume ASCII-only bitmap fonts or 1× desktop mouse scaling work across locales and 4K/handhelds |
| Manage `Adjust Mode` + `acquire_input_focus` stacks in Defold and `SafeArea` + `Label` `CacheMode` in Cocos Creator | Let modal popups leak clicks to gameplay or blow mobile texture memory with uncached CJK labels |

## Verification commands

Run the project's native build/test command without suppressing errors (`npm run build` for Phaser/PixiJS/Excalibur/Kaplay/Cocos, `cmake --build build && ctest --test-dir build` for C++ RmlUi/SDL3/Raylib/ImGui, `go test ./...` for Ebitengine, `cargo test` for Macroquad, `flutter test` for Flame, `pytest` for Pygame/Arcade, or `bob` for Defold). Verify HiDPI scaling, ultrawide/mobile safe areas, controller-only menu navigation, device glyph detection, localized CJK/RTL glyph rendering, and frame-time impact during active play (`rendered`; label untested assistive-tech adapters `not-checked`).
