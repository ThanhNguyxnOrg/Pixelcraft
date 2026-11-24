---
name: pixelcraft-mobile
description: Translates Pixelcraft direction, tokens, UX, and floor requirements into idiomatic mobile UI across SwiftUI (incl. TCA), UIKit, Jetpack Compose, Flutter, React Native/Expo, Expo Router, LynxJS, Kotlin Multiplatform, NativeScript, Skip, HarmonyOS ArkUI, Elixir LiveView Native, Taro/uni-app, Ionic/Capacitor, .NET MAUI, Flet, and Kivy. Use for native or cross-platform app screens, iOS 26 Liquid Glass, Material 3 Expressive, safe areas, Dynamic Type/sp scaling, touch targets, bottom sheets, gestures, haptics, Live Activities, forms, states, accessibility, and device verification.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft mobile

Use this skill when the surface is a phone/tablet/foldable/watch-adjacent app. Respect the host platform: iOS uses Apple HIG idioms (including iOS 26 Liquid Glass with contrast/transparency fallbacks), Android uses Material 3 / Material 3 Expressive behavior with edge-to-edge and predictive back, and cross-platform runtimes must translate rather than average them.

## Surface craft

Give the primary task a short route with native back/dismiss behavior; add delight at a meaningful state transition, not at every tap. Compare Compact and large-text layouts, resume after interruption, and make haptics optional reinforcement rather than the only confirmation. Do not copy a gallery's onboarding screens without following the activation and recovery steps.

## Detection signals

`Package.swift`, Xcode projects/workspaces, SwiftUI/UIKit/TCA imports, `build.gradle(.kts)` Compose/Material3 dependencies, `pubspec.yaml`, React Native/Expo config (`app.config.*`, Expo Router `app/_layout.tsx`), LynxJS (`@lynx-js/react`, `lynx.config.*`, `rspeedy`), KMP/Compose Multiplatform (`composeResources/`, `commonMain`), NativeScript (`nativescript.config.ts`), Skip (`Skip/skip.yml`), HarmonyOS (`oh-package.json5`, `build-profile.json5`, `.ets` ArkTS), LiveView Native (`.swiftui.heex`/`.jetpack.heex`), Taro/uni-app (`config/index.*`, `pages.json`, `manifest.json`), Ionic/Capacitor config (`capacitor.config.*`), `.csproj` MAUI references, Flet controls/page setup, Kivy/KivyMD KV/App classes, platform folders (`ios/`, `android/`), and target/device family declarations.

## Translate direction to mobile idioms

1. Map DTCG semantic roles to native theme systems: SwiftUI `ColorResource` Asset Catalogs/`@Entry`, UIKit trait-aware colors, Compose `MaterialExpressiveTheme`/`ColorScheme`, Flutter `ThemeData`/`ThemeExtension`, RN styling engines (`Uniwind`, `unistyles`, `NativeWind`), LynxJS CSS custom properties, HarmonyOS `$r('app.color.*')`, Ionic 8 `light-dark()` variables, NativeScript `.ns-dark` CSS, Skip Asset Catalogs, MAUI `AppThemeBinding`, Flet `ft.Theme`, or KivyMD `theme_cls`.
2. Recompose for touch and reach: primary actions in the lower thumb zone, no desktop hover dependence, dense information only where expert use justifies it.
3. Use platform navigation rather than web metaphors: `NavigationStack`/`Tab`/`TabSection`/sheets on iOS; Navigation 3 or Compose Navigation + predictive back + Material 3 adaptive panes on Android; Expo Router native stacks/tabs on RN; `GoRouter` `StatefulShellRoute` on Flutter; `Navigation` + `GridRow`/`GridCol` on HarmonyOS.
4. Scale type using Dynamic Type (`.font(.custom(..., relativeTo:))`), Android `sp`, or HarmonyOS `fp` scaling; restructure horizontal rows instead of truncating essential content at accessibility sizes.
5. Keep targets at least `44×44 pt` iOS and `48×48 dp` Android unless a documented platform exception applies.
6. Map motion to native spring/transition idioms (`MotionScheme.expressive()` spatial vs effects springs, Reanimated 4, SwiftUI springs) and honor Reduce Motion/Remove animations/Reduce Transparency. Haptics confirm meaningful physical/input moments only.

## Platform-wide rules

- Respect safe areas, Android 15/16 enforced edge-to-edge insets, status/navigation bars, display cutouts, split screen, landscape, foldables, keyboards, and edge gestures.
- Preserve state across process death/backgrounding where the platform expects it; interruption is normal mobile behavior.
- Back/swipe/home interruption must never silently discard work or duplicate side effects.
- Use platform pickers, keyboards, autofill, share sheets, permissions prompts, undo, and text editing behavior before custom replacements.
- Explain permission value before prompting and provide denied-state recovery.
- Test dark/light, increased contrast, reduced transparency, reduced motion, bold/expanded text (`200%` / `AX3`), RTL, offline, slow network, one-hand use, screen reader, keyboard/controller where relevant.

## Anti-lazy-default & anti-slop guard

- **Reject lazy wrappers on greenfield mobile apps**: do not wrap a web SPA in Ionic/Capacitor/WebView or default to Python Kivy merely out of habit when native **SwiftUI**, **Jetpack Compose**, **Flutter**, **KMP**, or **React Native New Architecture** fits the product's gesture fidelity, offline durability, and platform expectations. Use Capacitor/Kivy/LiveView Native/Taro only when their trade-offs match explicit team or distribution constraints.
- **Reject transplanted web slop**: never drop centered web marketing heroes, hover-only tooltips, floating 3-card SaaS grids, or custom fake nav bars onto native mobile screens.
- **Do not hand-roll native primitives**: use native sheets/detents, date pickers, autofill, predictive back, and swipe-back gestures instead of brittle custom overlays.

## Common mobile-specific failures

- fixed-height rows clipping Dynamic Type or `sp` scaling;
- bottom CTAs hidden by home indicator, keyboard, or Android 15/16 gesture bar;
- custom nav bars that break swipe-back or Android predictive back;
- Liquid Glass stacked on reading content or unreadable under Reduce Transparency / Increase Contrast;
- web-style cards/hero layouts transplanted into native product UI;
- haptics/animation on every interaction;
- permission primer loops with no escape;
- scroll views nesting unpredictably or fighting edge gestures;
- cross-platform UI forced to look identical at the expense of both platforms.

## Verification options

Rendered verification is possible only through simulator/emulator/device tooling or existing snapshot/screenshot tests. Xcode Previews, Accessibility Inspector, Android Layout Inspector/Accessibility Scanner, Flutter widget/golden tests, RN/Expo native builds, and platform screenshot tests provide different evidence. Compilation or preview generation alone is `static`, not `rendered` verification; label unavailable device inspection `not-checked`.

## Pre-submit checklist

- [ ] zero `TODO`s, placeholder stubs, invented copy, or dead tap/gesture handlers;
- [ ] safe areas, Android 15/16 edge-to-edge insets, cutouts, and keyboard avoidance verified without hidden bottom CTAs;
- [ ] Dynamic Type (`AX3`) / `sp` (`200%`) reflows cleanly without clipped labels, and touch targets meet `44×44 pt` / `48×48 dp`;
- [ ] native navigation (swipe-back, predictive back, sheet detents) and interruption/process-death state preservation work cleanly;
- [ ] loading, empty, error, offline, and denied-permission states are wired end to end;
- [ ] Dark Mode, Increase Contrast, Reduce Transparency, Reduce Motion, and VoiceOver/TalkBack checked (or labeled `not-checked` honestly).

## Framework routing

- Read [references/task-state-composition.md](references/task-state-composition.md) when designing timers, capture/recording flows, delivery/ride trackers, iOS Live Activities, or Android Live Updates with distinct setup/active/complete stages.
- Read [references/tactile-interactions.md](references/tactile-interactions.md) when implementing bottom sheet detents, scroll handover, thumb-zone ergonomics, semantic haptics, swipe-to-act with undo, offline queues, or Dynamic Type/`sp` reflow.
- Read [references/swiftui.md](references/swiftui.md) when building SwiftUI iOS/iPadOS/watchOS-adjacent apps, iOS 26 Liquid Glass chrome, iOS 18–26 declarative Apple APIs, or The Composable Architecture (TCA).
- Read [references/uikit.md](references/uikit.md) when maintaining or building imperative UIKit apps, `UIGlassEffect`, `UIHostingConfiguration`, or Swift 6 `@MainActor` view controllers.
- Read [references/jetpack-compose.md](references/jetpack-compose.md) when building Android Compose UI, Material 3 Expressive, Android 15/16 edge-to-edge, Predictive Back, Navigation 3, or `TextFieldState`.
- Read [references/flutter.md](references/flutter.md) when building Flutter/Dart mobile or embedded UI with Impeller, Cupertino adaptive controls, GoRouter, or Riverpod 3.
- Read [references/react-native-expo.md](references/react-native-expo.md) when building React Native New Architecture or Expo SDK 52–54+ apps with Expo Router, Uniwind/Unistyles/NativeWind, Reanimated 4, Skia, or FlashList v2.
- Read [references/lynxjs.md](references/lynxjs.md) when building Lynx / LynxJS (`@lynx-js/react`, `@lynx-js/rspeedy`) dual-threaded native mobile UI.
- Read [references/kotlin-multiplatform.md](references/kotlin-multiplatform.md) when sharing business logic via KMP/SKIE or sharing UI via Compose Multiplatform (iOS Stable 1.8+, Android, Desktop, Wasm).
- Read [references/nativescript-and-skip.md](references/nativescript-and-skip.md) when building native cross-platform mobile apps with NativeScript (JS/TS direct native APIs) or Skip (`skip.tools` Swift/SwiftUI to Android Compose).
- Read [references/harmonyos-and-emerging-mobile.md](references/harmonyos-and-emerging-mobile.md) when building HarmonyOS ArkUI/ArkTS apps, Elixir LiveView Native (SwiftUI/Compose over Phoenix), or cross-mini-app Taro / uni-app interfaces.
- Read [references/ionic-capacitor.md](references/ionic-capacitor.md) when building Ionic 7/8 or Capacitor 6–8 hybrid apps (including Capacitor without Ionic).
- Read [references/dotnet-maui.md](references/dotnet-maui.md) when building .NET MAUI (`net9.0`/`net10.0`), Blazor Hybrid, or `HybridWebView` mobile/desktop apps.
- Read [references/flet.md](references/flet.md) when building Python Flet (`0.25–1.0`) cross-platform mobile/desktop UI.
- Read [references/kivy.md](references/kivy.md) when building Python Kivy or KivyMD cross-platform apps packaged with Buildozer or `kivy-ios`.

For watchOS/Wear OS wearables and tvOS/10-foot living-room surfaces, use `pixelcraft-constrained` as the primary surface skill alongside framework idioms here; for visionOS/XR spatial surfaces, use `pixelcraft-spatial`.
