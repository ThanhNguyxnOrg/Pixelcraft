# React Native / Expo

Evidence: `AccessibilityInfo.isReduceMotionEnabled()` and `reduceMotionChanged` are documented RN APIs.

## Token mapping

Generate JS/TS constants or consume the Python-dict/JSON form through build generation, then create typed semantic theme context/navigation themes:

```ts
export const theme = { colors: { action: '#0074ca' }, spacing: { controlInline: 12 } };
```

Do not copy hex constants into component style props. Map navigation/tab/header colors separately because React Navigation themes are not identical to component themes.

## Layout and responsive idioms

Yoga/flex layout is the default. Use safe-area context/insets, keyboard avoiding behavior deliberately, orientation/window dimensions, platform-specific files/props sparingly, and scroll/flat-list semantics. Respect iOS vs Android navigation/back/gesture differences even when visuals share code.

## Typography/custom fonts

Load fonts through Expo font/asset pipeline or native linkage; configure fallback/weight behavior. Use scalable text and respect platform font scaling unless a bounded exception is intentional. Never use fixed-height clipping for essential localized copy.

## Motion/reduced motion

Use Reanimated/native driver or platform primitives intentionally. Query and subscribe:

```ts
AccessibilityInfo.isReduceMotionEnabled();
AccessibilityInfo.addEventListener('reduceMotionChanged', handler);
```

Provide reduced/static behavior. JS-thread blocking can turn even correct animation specs into jank.

## Accessibility specifics

Use `accessibilityRole`, `accessibilityLabel`, `accessibilityHint` sparingly, `accessibilityState`, live region props where supported, focus/traversal behavior, and native control equivalents. Do not use `TouchableOpacity` around text as a substitute for a properly labeled control. Minimum target expectations follow host platform (44pt/48dp).

## States idiom

Represent query/mutation lifecycle explicitly: loading/refreshing/empty/error/offline/optimistic/permission. Preserve input/navigation state across backgrounding/reload where expected. FlatList keys, pagination, refresh, scroll position, and memory pressure are UX state, not implementation trivia.

## Forms idiom

Use correct keyboard type, return key, auto-capitalization/correction, text content type/autocomplete, secure entry/password manager behavior, paste support, focus sequencing, validation timing, and keyboard occlusion handling. Preserve values through failed submit/navigation.

## Do/don't pairs

| Do | Don't |
|---|---|
| `<Pressable accessibilityRole="button" accessibilityLabel="Save invoice">` | tap-only `<Text>` pretending to be a button |
| `useSafeAreaInsets()` for bottom action placement | hard-coded bottom padding copied from one emulator |
| stable `keyExtractor={item => item.id}` | array-index keys for mutable rows |
| reduced-motion listener controlling animation state | unconditional looping animation |
| correct `autoComplete="email" keyboardType="email-address"` | blocking paste/custom keyboard behavior |

## Known traps

Bridge/JS-thread jank, Hermes/runtime differences, Expo/native module mismatch, safe-area double padding, keyboard avoiding inconsistency, controlled text input cursor loss, navigation header/custom header duplication, platform shadow/elevation mismatch, font scaling clipped, optimistic state rollback absent.

## Verification commands

```sh
npm run lint
npm run test -- --watch=false
npx expo start
npx expo run:ios 2>/dev/null || true
npx expo run:android 2>/dev/null || true
```

Use actual device/emulator inspection, React Navigation state, Flipper/dev tools where relevant, VoiceOver/TalkBack, font scaling, dark mode, offline/throttled network, and platform back/gesture tests.
