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

For tablets, foldables, and ChromeOS/desktop windows, use **`material3-adaptive`** (`ListDetailPaneScaffold`, `SupportingPaneScaffold`, `NavigationSuiteScaffold`, `currentWindowAdaptiveInfo()`) instead of hard-coding web-style pixel breakpoints.

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

`MotionScheme` separates **spatial springs** (`defaultSpatialSpec` / `fastSpatialSpec` — position, size, bounds, allowed subtle overshoot) from **effects springs** (`defaultEffectsSpec` — color, alpha, elevation, critically damped with zero overshoot). Use **`SharedTransitionLayout`** (`Modifier.sharedElement` / `Modifier.sharedBounds`) for continuity between list and detail views.

Check `Settings.Global.ANIMATOR_DURATION_SCALE` (`0f` = Remove animations enabled) for custom loops, Lottie animations, or shared transitions, falling back to instant/crossfade state changes.

## Accessibility specifics

Use `Modifier.semantics` (`contentDescription`, `stateDescription`, `role`, `heading()`, `liveRegion`, `customActions`, `isTraversalGroup`, `traversalIndex`). Pass `contentDescription = null` for purely decorative vectors. Keep touch targets ≥ `48×48 dp` (`minimumInteractiveComponentSize()`). Verify TalkBack focus order on a real device/emulator.

## States, Strong Skipping Mode, & Forms (`TextFieldState`)

Hoist explicit sealed UI state (`Loading`, `Content`, `Empty`, `Error`, `Offline`) from `ViewModel` via `collectAsStateWithLifecycle()`. Provide stable keys in `LazyColumn`/`LazyRow` (`items(rows, key = { it.id })`).

**Strong Skipping Mode** is enabled by default in Kotlin 2.0.20+ Compose compilers (skipping composables with unstable parameters via instance equality and auto-remembering lambdas), which reduces defensive `@Stable` boilerplate—yet stable immutable models and explicit lazy item keys remain mandatory for predictable diffing and process-death restoration (`rememberSaveable` / `SavedStateHandle`).

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

## Do/don't pairs

| Do | Don't |
|---|---|
| `enableEdgeToEdge()` + `WindowInsets.safeDrawing` + `Modifier.imePadding()` | Assume system bars reserve space on Android 15/16 or hard-code `24.dp` status-bar padding |
| `PredictiveBackHandler` handling cancellation gracefully | Intercept `BackHandler` unconditionally and break Android predictive back preview |
| `TextFieldState` + `rememberTextFieldState()` for new inputs | Async `StateFlow` `value`/`onValueChange` loops that jump the IME cursor |
| `MotionScheme.expressive()` effects springs for color/alpha changes | Apply bouncy overshooting spatial springs to opacity or text color |
| `ListDetailPaneScaffold` / `NavigationSuiteScaffold` for large screens | Stretch a single phone column across a 12-inch tablet or unfolded display |
| `items(invoices, key = { it.id })` with explicit `Modifier.semantics` | Index-keyed lazy lists or clickable `Text` without `Role.Button` |

## Known traps

Double-applying `WindowInsets` padding (applying both `Scaffold` padding and `systemBarsPadding()`), uncancelled `PredictiveBackHandler` leaving partial swipe offsets stuck on screen, legacy `TextField` cursor jumping under fast IME typing, state loss across process death (`remember` vs `rememberSaveable`), custom animations ignoring `ANIMATOR_DURATION_SCALE == 0f`, skipping TalkBack traversal verification on `SharedTransitionLayout`.

## Verification commands

```sh
./gradlew assembleDebug
./gradlew testDebugUnitTest
./gradlew connectedDebugAndroidTest
./gradlew lint
```

Build/unit tests provide `static` evidence. Capture emulator/device runs with Layout Inspector, Accessibility Scanner, TalkBack, `200%` font scale, Dark Mode, foldable/tablet window sizes, Android 15/16 edge-to-edge + predictive back gestures, and Remove animations enabled for `rendered` evidence; label untested hardware `not-checked`.
