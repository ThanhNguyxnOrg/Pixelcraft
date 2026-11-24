# Mobile capture

## iOS Simulator

```bash
xcrun simctl list devices available
xcrun simctl boot "<Current iPhone Simulator>"
xcrun simctl ui booted appearance dark
xcrun simctl ui booted content_size accessibility-extra-extra-large
xcrun simctl io booted screenshot capture-dark-axxl.png
# Restore defaults afterward
xcrun simctl ui booted appearance light
xcrun simctl ui booted content_size large
```

Capture the smallest and largest supported device classes when layout behavior differs. Exercise Dynamic Type sizes, dark mode, landscape/split multitasking where supported, safe-area edges, keyboard presentation, and VoiceOver focus order. Simulator evidence is `rendered` but not physical-device performance/touch evidence.

## Android emulator/device

```bash
adb devices
adb shell cmd uimode night yes
adb shell settings put system font_scale 1.3
adb exec-out screencap -p > capture-dark-large.png
# Restore defaults afterward
adb shell cmd uimode night no
adb shell settings put system font_scale 1.0
```

Use emulator device definitions matching target API/density. Capture gesture-navigation edge conflicts, display cutouts, keyboard, dark/high-contrast text, font scaling, orientation/foldable resize, and TalkBack focus order. Restore changed settings. Physical-device evidence is stronger for touch, performance, haptics, and camera/sensor behavior.

## Automated mobile UI & golden tests

- **Maestro (`maestro test flow.yaml`):** cross-platform declarative flows for iOS and Android driving real user tasks, assertions, and `takeScreenshot` captures.
- **Detox:** gray-box E2E test runner for React Native synchronizing with animations/network and capturing device screenshots on key steps.
- **Flutter golden tests:** `expectLater(find.byType(Screen), matchesGoldenFile('goldens/screen.png'))` via `flutter test` (`--update-goldens` only on intentional, reviewed UI changes); note golden tests run in Flutter's headless widget rasterizer, so pair with real simulator/device verification for fonts, platform views, and safe areas.

## Responsive web emulation

Browser emulation is useful for viewport geometry, DPR, touch hit layouts, and media queries. It is not proof of mobile browser chrome behavior, thermal/CPU performance, haptics, safe-area hardware, or platform accessibility. Label it browser emulation.

## Checklist

- [ ] smallest supported width/device and large/device rotation;
- [ ] system text scaling at default and a larger setting;
- [ ] dark mode and high-contrast text where supported;
- [ ] keyboard open and closed for form screens;
- [ ] safe-area/cutout/navigation-edge conflict;
- [ ] empty/loading/error/offline state on at least one key screen;
- [ ] accessibility focus path separately verified; screenshots alone do not prove it.
