# Mobile capture

## iOS Simulator

```bash
xcrun simctl list devices
xcrun simctl boot "iPhone 15"
xcrun simctl io booted screenshot capture.png
```

Capture the smallest and largest supported device classes when layout behavior differs. Exercise Dynamic Type sizes, dark mode, landscape/split multitasking where supported, safe-area edges, keyboard presentation, and VoiceOver focus order. Simulator evidence is `rendered` but not physical-device performance/touch evidence.

## Android emulator/device

```bash
adb devices
adb shell settings put system font_scale 1.3   # restore afterward
adb exec-out screencap -p > capture.png
```

Use emulator device definitions matching target API/density. Capture gesture-navigation edge conflicts, display cutouts, keyboard, dark/high-contrast text, font scaling, orientation/foldable resize, and TalkBack focus order. Restore changed settings. Physical-device evidence is stronger for touch, performance, haptics, and camera/sensor behavior.

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
