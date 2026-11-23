# Flutter

Evidence: current Flutter docs confirm `MediaQuery.disableAnimationsOf(context)` corresponds to Android Remove animations; iOS reduce motion is exposed separately through accessibility features/reduceMotion in newer APIs.

## Token mapping

Map generated Dart constants into `ColorScheme`, `ThemeData`, text theme, extensions, and component themes:

```dart
final theme = ThemeData(
  colorScheme: ColorScheme.fromSeed(seedColor: PixelcraftTokens.colorBrand),
);
```

Prefer explicit semantic `ThemeExtension` when roles exceed Material defaults. Do not copy raw hex/dimensions into widgets.

## Layout and responsive idioms

Use constraints, `LayoutBuilder`, flexible/expanded, safe area, media query size/orientation/text scaler, slivers only when needed, and adaptive navigation scaffolds. Flutter renders consistently across platforms, but platform conventions still differ—do not force identical navigation/back idioms everywhere.

## Typography/custom fonts

Declare fonts/assets/pubspec correctly and map text theme roles. Respect `TextScaler`/system scaling; do not fixed-height clip essential text. Include glyph coverage for localization or configure fallback fonts deliberately.

## Motion/reduced motion

Use implicit/explicit animations purposefully. Check `MediaQuery.disableAnimationsOf(context)` for explicit/custom animations and respect reduce-motion platform signals where exposed in current Flutter version. Keep animation controllers disposed/cancelled and never block interaction unnecessarily.

## Accessibility specifics

Use `Semantics`, labels/hints/values, live region flags where appropriate, focus/traversal order, correct button/text-field semantics, and exclude decorative nodes. Test TalkBack/VoiceOver because material-looking widgets can still produce incorrect semantic trees. Target baseline follows platform: 48dp Android/44pt iOS expectations where applicable.

## States idiom

Use explicit state management ownership (`ValueNotifier`, Riverpod/Bloc/etc. per project) and immutable async state: loading/refreshing/data-empty/data-partial/error/offline/optimistic. Preserve scroll/input state through keys/restoration. Golden tests can validate states, but only if fixtures represent real data lengths/errors.

## Forms idiom

Use `Form`/`TextFormField`, correct keyboard type/text input action/autofill hints/input formatters, focus nodes, validation timing, and input preservation. Do not validate aggressively on every keystroke or clear controllers during rebuild/navigation.

## Do/don't pairs

| Do | Don't |
|---|---|
| `FilledButton(onPressed: save, child: Text('Save invoice'))` | `GestureDetector` around styled text as primary control |
| check `MediaQuery.disableAnimationsOf(context)` for custom motion | assuming the compiler removes motion automatically |
| semantic `ThemeExtension` roles | raw `Color(0xff...)` scattered through widgets |
| stable keys/scroll controllers for stateful lists | rebuild-dependent scroll/focus loss |
| `TextFormField(autofillHints: [AutofillHints.email])` | custom keyboard/paste-blocking behavior |

## Flutter web note

Flutter can target web, but choose rendering mode deliberately. Canvas-heavy Flutter web does not automatically provide normal browser semantics, text selection, SEO, deep-link behavior, or accessibility parity. For browser-dominant products, apply `pixelcraft-web` verification and compare a DOM/server-rendered alternative in `pixelcraft-plan` before committing.

## Known traps

Build context after async gaps, controller lifecycle leaks, fixed pixel design across densities/text scaling, platform back/navigation mismatch, nested scrollables, semantic tree mismatch, golden-test brittleness, font licensing/glyph coverage, treating identical cross-platform rendering as identical platform UX.

## Verification commands

```sh
flutter analyze
flutter test
flutter test --update-goldens  # only intentionally
flutter run -d <device>
flutter build apk 2>/dev/null || true
```

Use widget/golden tests, device/emulator screenshots, accessibility scanner/TalkBack/VoiceOver, text scaling, dark mode, orientation, offline/slow network, and platform back/gesture inspection as evidence.
