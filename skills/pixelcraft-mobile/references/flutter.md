# Flutter

## Token mapping

Map DTCG tokens into `ColorScheme`, `ThemeData`, `TextTheme`, component themes, and typed `ThemeExtension` subclasses for semantic roles outside Material defaults (spacing, semantic status surfaces, radii):

```dart
@immutable
class PcSpacing extends ThemeExtension<PcSpacing> {
  const PcSpacing({required this.controlInline, required this.sectionGap});
  final double controlInline;
  final double sectionGap;

  @override
  PcSpacing copyWith({double? controlInline, double? sectionGap}) => PcSpacing(
    controlInline: controlInline ?? this.controlInline,
    sectionGap: sectionGap ?? this.sectionGap,
  );

  @override
  PcSpacing lerp(PcSpacing? other, double t) => other == null
      ? this
      : PcSpacing(
          controlInline: lerpDouble(controlInline, other.controlInline, t)!,
          sectionGap: lerpDouble(sectionGap, other.sectionGap, t)!,
        );
}

final lightTheme = ThemeData(
  colorScheme: ColorScheme.fromSeed(seedColor: PcTokens.brandSeed),
  extensions: const [PcSpacing(controlInline: 12, sectionGap: 20)],
);
```

Never scatter raw `Color(0xff…)` or hard-coded padding numbers across widgets.

## Rendering engine (Impeller) & platform adaptation

- **Impeller** is Flutter's default renderer on iOS and Android (API 29+ via Vulkan with OpenGLES fallback on older/unsupported GPUs), eliminating Skia shader-compilation jank. Still profile custom fragment shaders, backdrop blurs, and heavy `saveLayer` clipping on mid-tier Android hardware rather than assuming desktop/simulator frame pacing.
- Respect host platform conventions rather than forcing identical chrome on iOS and Android: use adaptive widgets (`Switch.adaptive`, `Slider.adaptive`, `CircularProgressIndicator.adaptive`, `AlertDialog.adaptive`), iOS-idiomatic **`CupertinoSheetRoute` / `showCupertinoSheet`** for stacked modal sheets on Apple devices, and Material navigation/predictive back on Android.

## Navigation (`GoRouter`) & state (`Riverpod 3`)

- Use **`GoRouter`** with **`StatefulShellRoute.indexedStack`** for persistent multi-tab state, typed deep-link routes, redirect guards, and Android predictive back integration:

```dart
StatefulShellRoute.indexedStack(
  builder: (context, state, navShell) => AppShell(navigationShell: navShell),
  branches: [
    StatefulShellBranch(routes: [GoRoute(path: '/invoices', builder: (_, __) => const InvoicesScreen())]),
    StatefulShellBranch(routes: [GoRoute(path: '/settings', builder: (_, __) => const SettingsScreen())]),
  ],
);
```

- Model async state explicitly (`AsyncValue` / sealed state) with **`Riverpod 3`** (`@riverpod` codegen, built-in retry/offline persistence primitives, automatic `Ref` disposal) or your project's established `Bloc`/`ValueNotifier` architecture. Never rely on uncoordinated boolean flags (`isLoading && !hasError`).

## Typography, accessibility, & reduced motion

Declare font families in `pubspec.yaml` with localization fallbacks. Read platform scaling, contrast, and motion preferences explicitly through `MediaQuery` and `AccessibilityFeatures`:

```dart
final textScaler = MediaQuery.textScalerOf(context);
final highContrast = MediaQuery.highContrastOf(context);
final reduceMotion =
    MediaQuery.disableAnimationsOf(context) ||
    View.of(context).platformDispatcher.accessibilityFeatures.reduceMotion;
final largeText = textScaler.scale(16) >= 24;
```

- Reflow horizontal label/value rows into `Column` layouts when `largeText` is true rather than clipping in fixed-height `SizedBox` containers.
- Dispose every `AnimationController` and skip non-essential spatial transitions when `reduceMotion` is true.
- Wrap custom visuals with `Semantics(label:, button:, liveRegion:)` and exclude decorative icons with `ExcludeSemantics`. Maintain ≥ `48×48 dp` (Android) / `44×44 pt` (iOS) targets (`kMinInteractiveDimension`). Verify semantic trees in TalkBack and VoiceOver.

## Forms idiom

Use `Form` + `TextFormField` with explicit `keyboardType`, `textInputAction`, `autofillHints` (`AutofillHints.email`, etc.), `FocusNode` traversal, and `AutovalidateMode.onUnfocus` (or on-submit) so errors do not scold mid-keystroke. Preserve controller text across rebuilds and navigation.

## Flutter web (WasmGC / Skwasm) note

Flutter 3.29 removed the legacy HTML renderer; Flutter Web now compiles to **WasmGC (`Skwasm`)** (`flutter build web --wasm`) or CanvasKit (`JS`). Canvas-rendered web apps require explicit `SemanticsBinding.instance.ensureSemantics()` / accessibility verification and still trade off native browser text selection, bundle startup size, and SEO. For browser-dominant or content/SEO products, apply `pixelcraft-web` verification and compare a DOM-rendered alternative in `pixelcraft-plan` before committing.

## Do/don't pairs

| Do | Don't |
|---|---|
| `FilledButton(onPressed: save, child: const Text('Save invoice'))` | `GestureDetector` wrapping styled `Text` as a primary control |
| Check both `MediaQuery.disableAnimationsOf(context)` and `accessibilityFeatures.reduceMotion` | Assume Flutter disables custom `AnimationController` loops automatically |
| Semantic `ThemeExtension` + `ColorScheme` roles | Raw `Color(0xff...)` literals scattered across widgets |
| `StatefulShellRoute.indexedStack` for persistent tab state | Rebuilding tab root screens from scratch on every tab tap |
| `Switch.adaptive` / `CupertinoSheetRoute` where platform idioms differ | Forcing identical Android dialogs and Material back bars onto iOS |

## Known traps

Using `BuildContext` across `async` gaps without `context.mounted` checks, `AnimationController`/`TextEditingController` disposal leaks, fixed-height `Container` clipping `TextScaler` at `200%`, Impeller fallback differences on older Android GPUs, missing `Semantics` labels on custom `CustomPainter` views, brittle golden tests using fake single-word fixtures.

## Verification commands

```sh
flutter analyze
flutter test
# Intentionally refresh goldens only after visual review:
# flutter test --update-goldens
# Run target build/device verification when SDK & device are available:
flutter build apk --debug
flutter run -d <device-id>
```

`flutter analyze` and unit/widget tests are `static` evidence (golden images validate layout only against real localized/long-string fixtures). Inspect real iOS/Android devices or emulators across TalkBack/VoiceOver, `TextScaler` `200%`, Dark Mode, High Contrast, Reduce Motion, and predictive/swipe back for `rendered` evidence; label untested targets `not-checked`.
