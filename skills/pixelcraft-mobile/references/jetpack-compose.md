# Jetpack Compose

## Token mapping

Map generated Kotlin values into `ColorScheme`, typography, shapes, spacing object, and `CompositionLocal` only when Material/theme APIs cannot express the role:

```kotlin
val LightColors = lightColorScheme(primary = SemanticAction)
val spacing = LocalSpacing.current
```

Use generated `.dp`/`.sp` output semantically. Do not scatter raw `Color(0xff…)` or hard-coded dimensions in composables.

## Layout and responsive idioms

Use `Column`/`Row`/lazy layouts/box/grid constraints deliberately; measure with constraints and adapt through window size classes/pane scaffold where relevant. Handle predictive back, system bars, display cutouts, foldables, landscape, keyboard insets, and content padding. Do not hard-code screen width buckets copied from web breakpoints.

## Typography/custom fonts

Use Material typography roles and `sp` scaling. Font resources/downloadable fonts must declare fallbacks/weights correctly. Respect user font scale; avoid fixed-height single-line text for essential content unless truncation/expansion behavior is deliberate.

## Motion/reduced motion

Compose animation APIs since 1.2 generally honor Android Remove animations for Animator-based behavior, but custom/Lottie/progress motion may need explicit checks. Use `Settings.Global.ANIMATOR_DURATION_SCALE` (and transition scale where appropriate) as a proxy; zero means animations disabled. Provide static/opacity alternatives.

## Accessibility specifics

Use semantics modifiers: `semantics`, `contentDescription`, `role`, `stateDescription`, `progressBarRangeInfo`, custom actions, traversal ordering. Do not label decorative images. Test TalkBack order/action semantics. Touch target baseline is 48×48 dp; use size/minimum touch target behavior rather than visual-only padding illusions.

## States idiom

State hoisting/recomposition ownership must be explicit. Represent loading/refreshing/empty/error/offline/permission/optimistic state in UI state rather than boolean soup. Use stable keys in lazy lists; preserve/restore state with lifecycle-aware primitives. Duplicate clicks/recomposition/network retry need idempotent behavior.

## Forms idiom

Use `KeyboardOptions`, `KeyboardActions`, correct `keyboardType`/`imeAction`, capitalization/autocorrect where exposed, focus requester/order, validation after completion, and input preservation through process/state changes. Do not clear text field state because recomposition recreated it incorrectly.

## Do/don't pairs

| Do | Don't |
|---|---|
| `Button(onClick = { save() }) { Text("Save invoice") }` | clickable `Text` masquerading as a button |
| stable lazy item key `items(items, key = { it.id })` | index-only reuse causing wrong focus/scroll/state |
| consume `WindowInsets` / scaffold padding deliberately | CTA hidden behind gesture navigation/keyboard |
| validate after field completion/submit with recovery copy | error every keystroke before input is finished |
| `Modifier.semantics { contentDescription = "Delete invoice" }` | trash-can vector as sole accessible meaning |

## Known traps

Recomposition caused by unstable inputs, state loss across process death, incorrect `remember` keys, lazy list focus/reuse, inset double padding, gesture conflicts/nested scroll, accessibility traversal order, custom theme bypassing Material state layers, assuming all animation automatically respects Remove animations.

## Verification commands

```sh
./gradlew assembleDebug
./gradlew testDebugUnitTest
./gradlew connectedDebugAndroidTest
./gradlew lint
```

Use emulator/device screenshots, Layout Inspector, Accessibility Scanner, TalkBack, font scale/display size, dark mode, landscape/foldable/split-screen, network throttling, and Remove animations settings for evidence.
