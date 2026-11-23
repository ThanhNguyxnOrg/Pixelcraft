---
name: pixelcraft-mobile
description: Translates Pixelcraft direction, tokens, UX, and floor requirements into idiomatic mobile UI across SwiftUI, UIKit, Jetpack Compose, Flutter, React Native/Expo, Kotlin Multiplatform, Ionic/Capacitor, .NET MAUI, Flet, and Kivy. Use for native or cross-platform app screens, navigation, safe areas, Dynamic Type/sp scaling, touch targets, gestures, haptics, platform conventions, forms, states, motion, accessibility, and device verification.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft mobile

Use this skill when the surface is a phone/tablet/foldable/watch-adjacent app. Respect the host platform: iOS uses Apple HIG idioms, Android uses Material behavior, and cross-platform runtimes must translate rather than average them.

## Detection signals

`Package.swift`, Xcode projects/workspaces, SwiftUI/UIKit imports, `build.gradle(.kts)` Compose dependencies, `pubspec.yaml`, React Native/Expo config, KMP shared modules, Ionic/Capacitor config, `.csproj` MAUI references, Flet controls/page setup, Kivy KV/App classes, platform folders (`ios/`, `android/`), and target/device family declarations.

## Translate direction to mobile idioms

1. Map DTCG semantic roles to native theme systems: SwiftUI asset catalogs/environment, UIKit trait-aware colors, Compose `MaterialTheme`, Flutter `ThemeData`/`ColorScheme`, RN theme context, Ionic CSS variables, MAUI resources, Flet theme objects, or Kivy KV/Python constants.
2. Recompose for touch and reach: primary actions within reach, no desktop hover dependence, dense information only where expert use justifies it.
3. Use platform navigation rather than web metaphors: navigation stack/tab bar/sheet on iOS; navigation bar/rail/drawer/predictive back on Android; large-title behavior only where idiomatic.
4. Scale type using Dynamic Type or sp scaling; restructure instead of truncating essential content at accessibility sizes.
5. Keep targets at least 44×44 pt iOS and 48×48 dp Android unless a documented platform exception applies.
6. Map motion to native spring/transition idioms and honor Reduce Motion/Remove animations. Haptics confirm meaningful physical/input moments only.

## Platform-wide rules

- Respect safe areas, status/navigation bars, display cutouts, split screen, landscape, foldables, keyboards, and edge gestures.
- Preserve state across process death/backgrounding where the platform expects it; interruption is normal mobile behavior.
- Back/swipe/home interruption must never silently discard work or duplicate side effects.
- Use platform pickers, keyboards, autofill, share sheets, permissions prompts, undo, and text editing behavior before custom replacements.
- Explain permission value before prompting and provide denied-state recovery.
- Test dark/light, increased contrast, reduced motion, bold/expanded text, RTL, offline, slow network, one-hand use, screen reader, keyboard/controller where relevant.

## Common mobile-specific failures

- fixed-height rows clipping Dynamic Type or sp scaling;
- bottom CTAs hidden by home indicator, keyboard, or system navigation;
- custom nav bars that break swipe/predictive back;
- web-style cards/hero layouts transplanted into native product UI;
- haptics/animation on every interaction;
- permission primer loops with no escape;
- scroll views nesting unpredictably or fighting edge gestures;
- cross-platform UI forced to look identical at the expense of both platforms.

## Verification options

Rendered verification is possible only through simulator/emulator/device tooling or existing snapshot/screenshot tests. Xcode Previews, Accessibility Inspector, Android Layout Inspector/Accessibility Scanner, Flutter widget tests/golden tests, RN/Expo device testing, and platform screenshot tests provide different evidence. Compilation or preview generation alone is not visual verification; label unavailable device inspection `not-checked`.

## Framework routing

- Read [references/swiftui.md](references/swiftui.md) for SwiftUI/iOS/watchOS/visionOS-style declarative Apple UI.
- Read [references/uikit.md](references/uikit.md) for UIKit/AppKit-adjacent imperative iOS UI.
- Read [references/jetpack-compose.md](references/jetpack-compose.md) for Android Compose.
- Read [references/flutter.md](references/flutter.md) for Flutter/Dart across mobile and embedded surfaces.
- Read [references/react-native-expo.md](references/react-native-expo.md) for React Native/Expo.
- Read [references/kotlin-multiplatform.md](references/kotlin-multiplatform.md) for Compose Multiplatform/KMP shared UI.
- Read [references/ionic-capacitor.md](references/ionic-capacitor.md) for Ionic/Capacitor hybrid apps.
- Read [references/dotnet-maui.md](references/dotnet-maui.md) for .NET MAUI.
- Read [references/flet.md](references/flet.md) for Flet cross-platform app surfaces.
- Read [references/kivy.md](references/kivy.md) for Kivy cross-platform app surfaces.
