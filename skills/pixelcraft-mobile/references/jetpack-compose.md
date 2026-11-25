# Jetpack Compose

## Token mapping & Material 3 Expressive

Map DTCG semantic tokens into `ColorScheme`, `Typography`, `Shapes`, `MotionScheme`, and a typed spacing `CompositionLocal` only when Material theme slots cannot express the role. On Material 3 Expressive (`material3` 1.4+), use **`MaterialExpressiveTheme`** and **`MotionScheme.expressive()`** rather than scattering raw `Color(0xff…)` or ad-hoc spring specs:

```kotlin
@OptIn(ExperimentalMaterial3ExpressiveApi::class)
@Composable
fun PixelcraftTheme(
  darkTheme: Boolean = isSystemInDarkTheme(),
  content: @Composable () -> Unit,
) {
  val colors = if (darkTheme) DarkSemanticColors else LightSemanticColors
  MaterialExpressiveTheme(
    colorScheme = colors,
    motionScheme = MotionScheme.expressive(),
    typography = SemanticTypography,
    content = content,
  )
}
```

Adopt Material 3 Expressive components where they clarify action hierarchy: **`FloatingToolbar`** (horizontal/vertical contextual toolbars), **`SplitButtonLayout`** (primary action + attached menu), **`ButtonGroup`** (connected option clusters), and **`LoadingIndicator` / `ContainedLoadingIndicator`** (shape-morphing indeterminate progress).

## Edge-to-Edge (Android 15/16) & responsive adaptive layouts

Android 15 (API 35) enforces edge-to-edge by default and Android 16 (API 36) removes the opt-out window flag. Call **`enableEdgeToEdge()`** before `setContent` in `ComponentActivity`, and consume insets deliberately so content never hides behind status bars, display cutouts, gesture navigation bars, or the soft keyboard:

```kotlin
enableEdgeToEdge()
setContent {
  PixelcraftTheme {
    Scaffold(
      contentWindowInsets = WindowInsets.safeDrawing,
      bottomBar = { ActionBar(Modifier.imePadding()) },
    ) { innerPadding ->
      ContentList(Modifier.padding(innerPadding).consumeWindowInsets(innerPadding))
    }
  }
}
```

For tablets, foldables, and ChromeOS/desktop windows (`sw >= 600dp`), Android 16 (`targetSdk 36`) **ignores fixed `screenOrientation="portrait"` and non-resizable manifest locks**. Never hard-lock portrait on large screens: use **`material3-adaptive`** (`ListDetailPaneScaffold`, `SupportingPaneScaffold`, `NavigationSuiteScaffold`, `currentWindowAdaptiveInfo()`) and survive live fold/unfold posture transitions (`FoldingFeature.State.HALF_OPENED` / `FLAT`) without losing form input, scroll offset, or media playback.

## Navigation 3 & Predictive Back

- **Predictive Back**: declare `android:enableOnBackInvokedCallback="true"` in `AndroidManifest.xml` and handle custom interruptible back gestures with **`PredictiveBackHandler`** (consuming `progress: Flow<BackEventCompat>`, cleaning up on `CancellationException` when the user aborts the swipe, and committing only on completion):

```kotlin
PredictiveBackHandler(enabled = hasUnsavedDraft) { progress: Flow<BackEventCompat> ->
  try {
    progress.collect { backEvent -> previewDismissProgress = backEvent.progress }
    discardOrPromptDraft()
  } catch (_: CancellationException) {
    previewDismissProgress = 0f
  }
}
```

- **Navigation 3 (`androidx.navigation3`)**: for new Compose-first architectures, prefer Navigation 3's user-owned back stack (`rememberNavBackStack` / `SnapshotStateList`), `NavDisplay`, `entryProvider`, and multi-pane `SceneStrategy` (retaining Navigation 2 where an existing codebase already standardizes on it).

## Typography & custom fonts

Use Material typography roles and `sp` scaling. Declare bundled or downloadable font weights and fallbacks explicitly. Test at `200%` font scale and large display size; switch horizontal rows to vertical stacks instead of single-line clipping essential values.

## Motion, springs, & reduced motion

`MotionScheme` separates **spatial springs** (`defaultSpatialSpec` / `fastSpatialSpec` — position, size, bounds, allowed subtle overshoot) from **effects springs** (`defaultEffectsSpec` — color, alpha, elevation, critically damped with zero overshoot). Seed gesture-driven `Animatable.animateTo(..., initialVelocity = velocity)` with finger release velocity, and use **`SharedTransitionLayout`** (`Modifier.sharedElement` / `Modifier.sharedBounds`) for continuity between list and detail views.

Check `Settings.Global.ANIMATOR_DURATION_SCALE` (`0f` = Remove animations enabled) for custom loops, Lottie animations, or shared transitions, falling back to instant/crossfade state changes.

## Accessibility specifics

Use `Modifier.semantics` (`contentDescription`, `stateDescription`, `role`, `heading()`, `liveRegion`, `customActions`, `isTraversalGroup`, `traversalIndex`). Pass `contentDescription = null` for purely decorative vectors. Keep touch targets ≥ `48×48 dp` (`minimumInteractiveComponentSize()`). Verify TalkBack focus order on a real device/emulator.

## States, process-death restoration, & Forms (`TextFieldState`)

Hoist explicit sealed UI state (`Loading`, `Content`, `Empty`, `Error`, `Offline`) from `ViewModel` via `collectAsStateWithLifecycle()`. Provide stable keys in `LazyColumn`/`LazyRow` (`items(rows, key = { it.id })`) and attach **`Modifier.imeNestedScroll()`** (`WindowInsetsAnimationCompat`) so scrolling interactively drags the soft keyboard open/closed at display refresh rate.

**Strong Skipping Mode** is enabled by default in Kotlin 2.0.20+ Compose compilers, yet stable immutable models, explicit lazy item keys, and **OS process-death restoration** (`rememberSaveable` for UI state + `SavedStateHandle` in `ViewModel` for route IDs/filters/drafts, verified via `adb shell am kill <package>` while backgrounded) remain mandatory.

For text input, prefer **`TextFieldState` + `BasicTextField` v2** (and Material `TextField(state = ...)` overloads) over legacy `value`/`onValueChange` to eliminate async IME/cursor race conditions:

```kotlin
val emailState = rememberTextFieldState()
OutlinedTextField(
  state = emailState,
  label = { Text("Work email") },
  lineLimits = TextFieldLineLimits.SingleLine,
  keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email, imeAction = ImeAction.Next),
  inputTransformation = InputTransformation.maxLength(120),
)
```

## 2026 Google Play submission, 16 KB page alignment & Baseline Profiles

- **`targetSdk 36` & signed `.aab`**: compile and target **API 36 (Android 16)**, ship signed Android App Bundles (`.aab`) with Play App Signing, and upload R8/ProGuard mapping files + native debug symbols on every release to hold **`>= 99.5%` crash-free sessions** and **`0` ANRs**.
- **Mandatory `16 KB` memory page size native `.so` alignment**: Google Play requires all apps with native code (`.so` from C/C++/Rust/JNI or third-party SDKs) targeting Android 15/16+ to support **16 KB ELF segment alignment**. Build with **NDK r28+** (default 16 KB alignment) + **AGP 8.5.1+** (uncompressed shared libs), or pass `-Wl,-z,max-page-size=16384` on NDK r27, and verify every bundled `.so` before upload (`zipalign -c -P 16 -v 4 app-release.apk`).
- **Baseline Profiles & `< 800 ms–1.2 s` cold start**: generate Macrobenchmark **Baseline Profiles** (`androidx.profileinstaller`) for startup and critical scroll/navigation journeys, and initialize non-essential SDKs asynchronously via `androidx.startup` / background dispatchers so cold TTID stays `< 1.2 s` (hard ceiling `< 2.0 s`) on mid-tier Android hardware.
- **Android Keystore encrypted storage & Photo Picker**: store tokens and secrets with **Jetpack Tink (`AndroidKeysetManager`)** + DataStore (or Keystore-backed `EncryptedSharedPreferences` where maintained)—**never** plaintext `SharedPreferences`. Use the system **Android Photo Picker** (`PickVisualMedia`) instead of requesting broad `READ_MEDIA_IMAGES` permissions, and provide in-app + web Account Deletion parity per Google Play Data Safety rules.

## Do/don't pairs

| Do | Don't |
|---|---|
| `enableEdgeToEdge()` + `WindowInsets.safeDrawing` + `Modifier.imePadding()` + `imeNestedScroll()` | Assume system bars reserve space on Android 15/16 or hard-code `24.dp` status-bar padding |
| `PredictiveBackHandler` handling cancellation gracefully | Intercept `BackHandler` unconditionally and break Android predictive back preview |
| `ListDetailPaneScaffold` / `NavigationSuiteScaffold` unlocked across postures on `sw >= 600dp` | Hard-lock `android:screenOrientation="portrait"` (ignored on Android 16 large screens) or lose state on unfold |
| Build native libs with NDK r28+ (`16 KB` ELF alignment), ship Baseline Profiles, and encrypt tokens via Keystore/Tink | Ship `4 KB`-aligned `.so` binaries rejected by Google Play or store JWTs in plaintext `SharedPreferences` |
| Persist route/draft keys in `SavedStateHandle` + `rememberSaveable` and test `adb shell am kill` | Hold critical screen state only in `remember` or unpersisted `ViewModel` fields |
| `TextFieldState` + `rememberTextFieldState()` and `items(invoices, key = { it.id })` | Legacy `StateFlow` `value`/`onValueChange` IME cursor loops or index-keyed lazy lists |

## Known traps

Double-applying `WindowInsets` padding, uncancelled `PredictiveBackHandler` leaving partial swipe offsets stuck, third-party AARs bundling unaligned `4 KB` `.so` files, state loss on foldable posture change or `adb shell am kill`, plaintext `SharedPreferences` token leaks, custom animations ignoring `ANIMATOR_DURATION_SCALE == 0f`, skipping TalkBack verification on OEM skins.

## Verification commands

```sh
./gradlew assembleRelease
./gradlew testDebugUnitTest
./gradlew connectedDebugAndroidTest
./gradlew lint
# Verify 16 KB ELF page alignment on release APK extracted from bundle:
zipalign -c -P 16 -v 4 app/build/outputs/apk/release/app-release.apk
```

Build/unit tests and `zipalign -c -P 16` provide `static` evidence. Capture real-device/emulator runs (`>= 3` Android devices across Pixel + Samsung One UI / Xiaomi / OPPO OEM skins) with TalkBack, `200%` font scale, Dark Mode, foldable posture changes, `adb shell am kill` background restoration, Android 16 edge-to-edge + predictive back, and Remove animations enabled for `rendered` evidence; label untested hardware `not-checked`.
