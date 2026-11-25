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

## Forms, restoration & 2026 store gates

Use `Form` + `TextFormField` with explicit `keyboardType`, `textInputAction`, `autofillHints` (`AutofillHints.email`, etc.), `FocusNode` traversal, `ScrollViewKeyboardDismissBehavior.onDrag` for interactive keyboard dismissal, and `AutovalidateMode.onUnfocus` (or on-submit) so errors do not scold mid-keystroke.

- **OS process-death restoration**: set `restorationScopeId: 'app'` on `MaterialApp.router` / `CupertinoApp.router` and persist active tab/route and unsent form inputs with `RestorationMixin` (`RestorableTextEditingController`, `RestorableInt`) or Riverpod persisted storage so `adb shell am kill` and iOS RAM eviction never wipe active tasks.
- **`120fps` ProMotion & `< 1.2 s` cold start**: enable `<key>CADisableMinimumFrameDurationOnPhone</key><true/>` in `ios/Runner/Info.plist` so Impeller drives `120 Hz` ProMotion (`< 8.33 ms`/frame), seed release gestures into `SpringSimulation(..., velocity)`, and defer heavy plugin init past `runApp()`.
- **2026 App Store & Google Play compliance**:
  - **iOS**: build with **Xcode 26 SDK**, ship `PrivacyInfo.xcprivacy` (auditing every CocoaPod/SPM plugin's privacy manifest), store tokens solely in Keychain via `flutter_secure_storage` (never `shared_preferences`), offer **Sign in with Apple** parity whenever social login exists, wire real **in-app Account Deletion**, and use zero-permission system photo pickers (`image_picker` PHPicker / Android Photo Picker).
  - **Android**: target **`targetSdk = 36`** (`.aab`), call `SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge)` while consuming `MediaQuery.paddingOf(context)` / `viewInsetsOf(context)`, keep `sw >= 600dp` tablets/foldables unlocked across orientations/postures, enable Predictive Back (`android:enableOnBackInvokedCallback="true"` + `PopScope`), store secrets in Android Keystore (`flutter_secure_storage`), and compile all FFI/plugin native `.so` binaries with **NDK r28+** (`16 KB` ELF page alignment verified via `zipalign -c -P 16`).

## Flutter web (WasmGC / Skwasm) note

Flutter 3.29 removed the legacy HTML renderer; Flutter Web now compiles to **WasmGC (`Skwasm`)** (`flutter build web --wasm`) or CanvasKit (`JS`). Canvas-rendered web apps require explicit `SemanticsBinding.instance.ensureSemantics()` / accessibility verification and still trade off native browser text selection, bundle startup size, and SEO. For browser-dominant or content/SEO products, apply `pixelcraft-web` verification and compare a DOM-rendered alternative in `pixelcraft-plan` before committing.

## Do/don't pairs

| Do | Don't |
|---|---|
| `FilledButton(onPressed: save, child: const Text('Save invoice'))` | `GestureDetector` wrapping styled `Text` as a primary control |
| Check both `MediaQuery.disableAnimationsOf(context)` and `accessibilityFeatures.reduceMotion` | Assume Flutter disables custom `AnimationController` loops automatically |
| Set `CADisableMinimumFrameDurationOnPhone = true`, `targetSdk = 36`, NDK r28+ (`16 KB` `.so`), and `flutter_secure_storage` | Cap ProMotion at `60fps`, ship `4 KB`-aligned `.so` plugins, or store auth tokens in `shared_preferences` |
| Wire `restorationScopeId` + `RestorationMixin`, `PrivacyInfo.xcprivacy`, and real in-app Account Deletion | Lose form drafts on `adb shell am kill` or punt account deletion to a support email |
| `StatefulShellRoute.indexedStack` + `Switch.adaptive` / `CupertinoSheetRoute` | Rebuild tab roots on every tap or force identical Android dialogs onto iOS |

## Known traps

Using `BuildContext` across `async` gaps without `context.mounted` checks, `AnimationController`/`TextEditingController` disposal leaks, fixed-height `Container` clipping `TextScaler` at `200%`, outdated FFI plugins bundling `4 KB`-aligned Android `.so` binaries, storing tokens in `shared_preferences`, missing `Semantics` labels on custom `CustomPainter` views, brittle golden tests using fake single-word fixtures.

## Verification commands

```sh
flutter analyze
flutter test
flutter build appbundle --release
# Verify 16 KB native library alignment on Android release artifact:
zipalign -c -P 16 -v 4 build/app/outputs/flutter-apk/app-release.apk
```

`flutter analyze`, unit/widget tests, and `zipalign -c -P 16` are `static` evidence. Inspect real iOS (`>= 2`) and Android (`>= 3` across Pixel + OEM skins) devices across TalkBack/VoiceOver, `TextScaler` `200%`, Dark Mode, High Contrast, Reduce Motion, `adb shell am kill` restoration, and predictive/swipe back for `rendered` evidence; label untested targets `not-checked`.
