# Desktop and game capture

## Desktop windows

Capture real application windows at minimum size, default size, resize/maximized state, and high-DPI scaling. Verify native versus custom chrome, menu/shortcut behavior, focus rings, text scaling, dark/high-contrast mode, multi-window identity, dialog ownership, and restoration after minimize/resize.

Platform capture commands:

```bash
# macOS interactive/window capture
screencapture -i -w capture.png

# Linux Wayland (wlroots/Sway/Hyprland, KDE Plasma, GNOME)
grim capture.png                          # wlroots compositors
spectacle -b -n -o capture.png            # KDE Plasma headless background capture
gnome-screenshot -w -f capture.png        # GNOME active window

# Linux X11 (ImageMagick)
import -window root capture.png
```

```powershell
# Windows PowerShell screen capture (System.Drawing)
Add-Type -AssemblyName System.Windows.Forms,System.Drawing
$b = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$bmp = New-Object System.Drawing.Bitmap $b.Width, $b.Height
$g = [System.Drawing.Graphics]::FromImage($bmp); $g.CopyFromScreen($b.Location, [System.Drawing.Point]::Empty, $b.Size)
$bmp.Save("capture.png")
```

Automated desktop drivers:

- **Electron:** launch and inspect the actual desktop window with Playwright `const app = await _electron.launch({ args: ['main.js'] }); const win = await app.firstWindow(); await win.screenshot({ path: 'app.png' });`.
- **Tauri:** drive the compiled native WebView binary with **`tauri-driver`** over WebDriver (paired with WebdriverIO or Selenium) so native IPC, window chrome, and OS webview rendering are verified end-to-end.
- Prefer platform-native capture/test tooling where available. A standalone browser preview of an Electron/Tauri frontend is not proof of desktop window chrome or native IPC behavior.

## Game UI

Capture HUDs at target resolutions/aspect ratios, including ultrawide and minimum supported size. Validate safe-area insets, text legibility at viewing distance, controller focus path, menu pause/resume state, localization expansion, colorblind-critical cues, and damage/alert readability over real gameplay backgrounds—not isolated gray screens.

Use engine capture/profilers and playmode screenshot hooks:

- **Unity:** Game view resolution/aspect matrix, Device Simulator, `ScreenCapture.CaptureScreenshot`, frame debugger/profiler;
- **Godot:** viewport resolution/stretch modes, `get_viewport().get_texture().get_image().save_png("user://qa.png")`;
- **Unreal:** PIE viewport presets, `HighResShot` / `AutomationDriver`, safe-zone visualization, UMG focus/navigation instrumentation;
- **Bevy (Rust):** spawn `Screenshot::primary_window()` with `save_to_disk("qa.png")` observer during playmode/test scenes;
- **MonoGame (C#):** render HUD scene to `RenderTarget2D` and export via `renderTarget.SaveAsPng(stream, width, height)`;
- **LÖVE2D (Lua):** call `love.graphics.captureScreenshot("qa.png")` on deterministic test frames.

Performance claims require scene-representative frame data. Menu-only capture says nothing about combat/effects scenes.

## Evidence checklist

- [ ] actual OS/window scale/density named;
- [ ] resize/reflow behavior captured rather than inferred;
- [ ] keyboard/controller focus order tested separately;
- [ ] fullscreen/windowed/multi-monitor behavior in scope;
- [ ] high-contrast/reduced-motion path inspected;
- [ ] game safe areas and legibility over noisy real content verified.
