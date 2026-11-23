# Desktop and game capture

## Desktop windows

Capture real application windows at minimum size, default size, resize/maximized state, and high-DPI scaling. Verify native versus custom chrome, menu/shortcut behavior, focus rings, text scaling, dark/high-contrast mode, multi-window identity, dialog ownership, and restoration after minimize/resize.

Useful local commands:

```bash
# macOS interactive/window capture
screencapture -i -w capture.png

# Linux X11 only; inspect active window manually when available
import -window root capture.png
```

Prefer platform-native capture/test tooling where available. A browser DOM inspection inside Electron/Tauri is static unless the actual frame is rendered.

## Game UI

Capture HUDs at target resolutions/aspect ratios, including ultrawide and minimum supported size. Validate safe-area insets, text legibility at viewing distance, controller focus path, menu pause/resume state, localization expansion, colorblind-critical cues, and damage/alert readability over real gameplay backgrounds—not isolated gray screens.

Use engine capture/profilers:

- Unity: Game view resolution/aspect matrix, Device Simulator, frame debugger/profiler;
- Godot: viewport resolution/stretch modes, editor screenshots/runtime capture;
- Unreal: PIE viewport presets, safe-zone visualization, UMG focus/navigation instrumentation.

Performance claims require scene-representative frame data. Menu-only capture says nothing about combat/effects scenes.

## Evidence checklist

- [ ] actual OS/window scale/density named;
- [ ] resize/reflow behavior captured rather than inferred;
- [ ] keyboard/controller focus order tested separately;
- [ ] fullscreen/windowed/multi-monitor behavior in scope;
- [ ] high-contrast/reduced-motion path inspected;
- [ ] game safe areas and legibility over noisy real content verified.
