# MonoGame (C#)

## UI libraries and typography stack

MonoGame ships a low-level 2D/3D loop (`SpriteBatch`) without a built-in retained UI layout engine. Do not hand-roll a brittle UI layout engine or rely exclusively on static compile-time `SpriteFont` bitmaps when shipping multi-resolution, localized games:

| Library | Best for | Key capabilities & constraints |
|---|---|---|
| **Gum UI** (`MonoGameGum`, featured by MonoGame) | visual layout + responsive Flexbox-like menus/HUDs | docking, stacking, nine-slice styling, visual Gum editor or code-first API, built-in gamepad focus/navigation support, localization hooks |
| **Myra** | retained C# / XAML-like desktop & game menus/dialogs | grids, scroll views, rich widgets, XML/MML markup, custom styles; wire explicit gamepad focus traversal for console/controller play |
| **FontStashSharp** | runtime dynamic TTF/OTF typography & global localization | rasterizes glyphs on demand from TTF/OTF with fallback font chains (**CJK, Arabic, Cyrillic, symbols, player names**), crisp arbitrary scaling, stroke/shadow effects—eliminates `SpriteFont` compile-time character-range limits |

```csharp
using FontStashSharp;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

// Semantic theme + FontStashSharp dynamic font system (supports runtime scaling & CJK/Unicode fallbacks)
public sealed class UiTheme
{
    public Color ActionBg { get; init; } = new(15, 81, 50);
    public Color TextPrimary { get; init; } = new(245, 247, 250);
    public FontSystem PrimaryFont { get; }

    public UiTheme(byte[] primaryTtf, byte[] cjkFallbackTtf)
    {
        PrimaryFont = new FontSystem();
        PrimaryFont.AddFont(primaryTtf);
        PrimaryFont.AddFont(cjkFallbackTtf);
    }

    public DynamicSpriteFont Body(float uiScale) => PrimaryFont.GetFont((int)(20 * uiScale));
}
```

## Token mapping, layout, and scaling

- Centralize semantic colors, font sizes, margins, and scale factors in a C# theme object or Gum style definitions—never scatter `Color.OrangeRed` literals across `Draw()`.
- Handle `Window.ClientSizeChanged`, virtual-resolution scaling vs crisp HiDPI native UI rendering, safe-area insets (`GraphicsDevice.Viewport.TitleSafeArea` on consoles/TVs plus ultrawide HUD clamping), and separate HUD, menu, modal, and debug layers.

## Input, accessibility, motion, and states

- MonoGame does not provide built-in OS UI automation/screen-reader trees—explicitly engineer keyboard/gamepad focus navigation, visible focus states, dynamic input-glyph swapping (`GamePad.GetCapabilities` / SDL controller type), conflict-aware remapping, subtitle scaling/backdrops, colorblind-safe icons/patterns, and reduced-motion/flash toggles.
- Use explicit state machines for loading, menu, pause, error, empty inventory, disconnect, death/respawn, and modal focus restoration; load assets asynchronously or progressively so frames do not freeze.
- Validate `Window.TextInput` IME/clipboard/virtual-keyboard limits before building complex text-entry forms.

## Do/don't pairs

| Do | Don't |
|---|---|
| Use **Gum UI** or **Myra** for non-trivial menus/HUDs and **FontStashSharp** for runtime TTF + CJK/Unicode fallback | Hand-roll complex nested layouts or ship static Latin-only `SpriteFont` atlases for localized titles |
| Centralize tokens in a semantic C# theme / Gum style sheet | Hard-code `Color.*` and pixel coordinates across `SpriteBatch.Draw` calls |
| Respect `Viewport.TitleSafeArea`, dynamic resize, and explicit controller focus graphs | Assume a fixed 1920×1080 backbuffer or mouse-only menu hitboxes |
| Expose HUD scale, subtitle backdrop, colorblind redundancy, and reduced-flash toggles | Leave accessibility/platform gaps undocumented or claim untested screen-reader support |

## Known traps

Static `SpriteFont` crashing or dropping glyphs on localized/player strings, blurry UI when scaling a low-res render target instead of rendering UI at native backbuffer resolution, missing controller focus restoration after closing Myra/custom dialogs, and un-clamped `gameTime.ElapsedGameTime` spiking UI tweens.

## Verification commands

```sh
dotnet test
dotnet build
dotnet run --project <GameProject>
```

Test backbuffer resize, ultrawide/handheld/TV `TitleSafeArea`, controller-only menu navigation, FontStashSharp localized glyph coverage, pause/interruption flows, and reduced-motion/flash settings (`rendered`).
