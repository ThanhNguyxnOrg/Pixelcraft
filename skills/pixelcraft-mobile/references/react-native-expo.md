# React Native / Expo

## Architecture baseline (New Architecture & Expo SDK 52–54+)

React Native's **New Architecture**—**Fabric** (synchronous C++ renderer), **TurboModules** (lazy native modules over **JSI**), **Bridgeless** mode, and **Hermes / Static Hermes**—is the default in Expo SDK 52–54+ and mandatory in React Native 0.82+ (legacy JSON Bridge removed). Performance regressions now come from JS-thread blocking, layout thrash, or excessive shadow-tree churn rather than bridge serialization.

- Prefer **Expo CNG** (`app.config.ts` + `npx expo prebuild` + config plugins) and **Expo Router** (file-based typed routes, native stacks/tabs, universal deep linking, `+not-found.tsx`).
- Use **Expo DOM (`"use dom"`)** selectively to embed an isolated web component (e.g., rich-text editor or chart library) inside a native screen without turning the whole app into a WebView.
- For high-frequency native interop beyond standard Expo Modules, **Nitro Modules** provide zero-overhead JSI bindings with compile-time TypeScript→Swift/Kotlin specs.

## Token mapping

Generate TypeScript/JSON design tokens during your build step (e.g., from DTCG JSON) and wire them once into your styling engine plus Expo Router / React Navigation `ThemeProvider`:

```ts
export const lightTokens = {
  color: { action: '#0074ca', surface: '#ffffff', danger: '#c62828' },
  space: { controlInline: 12, sectionGap: 20 },
} as const;
```

Do not scatter raw hex literals across JSX props. Synchronize React Navigation / Expo Router header and tab-bar theme colors separately because native navigation chrome reads its own theme object.

## Styling engines & UI kits

Separate **styling engines** from **component kits** before choosing, and never combine two competing styling systems in one app:

| Tool | Layer | Trade-offs & best fit |
|---|---|---|
| **Uniwind** | Tailwind CSS v4 compiled natively for RN | Modern Tailwind v4 token/CSS-variable workflow with native binding performance; pair with accessible primitives. |
| **react-native-unistyles v3** | C++/JSI shadow-tree styling engine | Theme/breakpoint/adaptive-style updates directly in Fabric/C++ without React re-renders; strong for design-system teams. |
| **NativeWind v4 / v5** | Tailwind utility engine for RN | Familiar Tailwind mental model across web and mobile; verify exact Expo SDK & New Architecture compatibility. |
| **Tamagui** | Static compiler + tokens + UI kit | Strong RN+Web monorepo extraction performance; higher Metro/Babel/bundler config complexity. |
| **gluestack-ui** | Universal headless primitives + styled kit | Accessible RN+Web component baselines without heavy compiler coupling; profile dense lists. |
| **React Native Paper** | Material Design 3 component kit | Fast MD3 baseline for Android-first or internal tools; resists bespoke or Cupertino iOS aesthetics. |

## Layout, lists, media, & keyboard idioms

- Layout runs on Yoga (Flexbox). Always consume `react-native-safe-area-context` (`useSafeAreaInsets` / `SafeAreaView`) and honor iOS vs Android back/navigation idioms even when screens share code.
- **Virtualized lists**: prefer **FlashList v2** (built for the New Architecture without manual item size estimates) or **LegendList** (drop-in high-performance virtualization) over `FlatList` for large or dynamic-height feeds; always supply stable item IDs.
- **Keyboard handling**: use **`react-native-keyboard-controller`** (`KeyboardAvoidingView`, `KeyboardAwareScrollView`, `useReanimatedKeyboardAnimation`) for frame-synced 60/120fps keyboard tracking across both iOS and Android edge-to-edge.
- **Images**: use **`expo-image`** for native disk/memory caching, BlurHash/ThumbHash placeholders, content-fit transitions, and WebP/AVIF support.

## Typography & custom fonts

Load custom fonts via `expo-font` config plugin (embedded natively at build time rather than waiting for async runtime load flash). Respect platform font scaling (`allowFontScaling` defaults to `true`); reflow horizontal rows at large font scales instead of setting fixed heights or `maxFontSizeMultiplier={1}`.

## Motion, gestures, Skia, & reduced motion

- Use **Reanimated 4** (supporting both declarative CSS Transitions/Animations syntax and UI-thread worklets) paired with **`react-native-gesture-handler`** for native-threaded drag, sheet, and swipe physics.
- Use **React Native Skia** (`@shopify/react-native-skia`) for custom GPU 2D charts, shaders, or canvas drawing—never for standard buttons or forms that need native accessibility trees.
- Query and subscribe to system reduced motion, replacing spatial motion with instant or opacity transitions when enabled:

```ts
import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduced);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => sub.remove();
  }, []);
  return reduced;
}
```

## Accessibility, states, & forms idioms

Use `Pressable`, `accessibilityRole`, `accessibilityLabel`, `accessibilityState`, `accessibilityHint` (sparingly), and `accessibilityLiveRegion`. Keep hit areas ≥ `44 pt` (iOS) / `48 dp` (Android) using `hitSlop` when visual icons are compact.

Model async state explicitly (`loading`, `refreshing`, `empty`, `error`, `offline`, `optimistic`) with idempotent mutations and rollback on failure. For forms, configure `keyboardType`, `autoComplete`, `textContentType`, `returnKeyType`, focus forwarding via refs, paste/password-manager compatibility, and validation after field completion.

## Do/don't pairs

| Do | Don't |
|---|---|
| `<Pressable accessibilityRole="button" accessibilityLabel="Save invoice">` | Tap-only `<Text>` or unlabeled `<TouchableOpacity>` icon |
| `FlashList` v2 or `LegendList` with stable keys for large feeds | Mapping hundreds of items inside `<ScrollView>` |
| `react-native-keyboard-controller` + `useSafeAreaInsets()` | Hard-coded `KeyboardAvoidingView` magic `keyboardVerticalOffset` |
| Reanimated 4 UI-thread transitions + `AccessibilityInfo.isReduceMotionEnabled()` | JS `setInterval` animations or unconditional looping motion |
| `expo-image` + build-time `expo-font` config plugin | Uncached `<Image>` flickering or runtime font flash on every launch |

## Known traps

JS-thread blocking / excessive Fabric shadow-tree updates, unmaintained third-party libraries incompatible with New Architecture / Bridgeless mode, Expo SDK / native dependency drift, double safe-area padding with Expo Router headers, Android 15/16 edge-to-edge keyboard overlap, controlled `TextInput` cursor jumps, platform shadow/elevation divergence, font scaling clipped by fixed row heights.

## Verification commands

```sh
npm run lint
npm run test -- --watch=false
CI=1 npx expo install --check
npx expo start
```

Use the project's locally installed Expo CLI (`static` dependency verification via `CI=1 npx expo install --check` without auto-mutating packages; run `expo install --fix` only when authorized). Run native iOS/Android dev builds (`npx expo run:ios` / `npx expo run:android`) and inspect React Native DevTools, VoiceOver/TalkBack, `200%` font scaling, Dark Mode, offline/throttled network, and Android predictive back / iOS swipe-back for `rendered` evidence; label untested devices `not-checked`.
