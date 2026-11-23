# Kotlin Multiplatform / Compose Multiplatform

## Token mapping

Share token objects in common code as semantic `expect`/plain Kotlin structures where possible, while platform-specific implementations resolve resources/capabilities:

```kotlin
object PcTokens { val action = Color(0xff0074ca) }
```

Keep platform channels for assets, fonts, haptics, accessibility settings, and system color behavior. Do not hide platform divergence behind fake universal behavior.

## Layout and responsive idioms

Compose Multiplatform layout follows Compose idioms, but target platform conventions still differ. Put shared visual composition in common UI; put navigation/back/window/insets/accessibility behavior in platform-aware layers. Desktop windows, Android devices, iOS surfaces, and web targets need different adaptation logic.

## Typography/custom fonts

Package/load fonts per target and expose semantic typography in shared theme. Verify glyph coverage and scaling per platform; sp/Dynamic Type behavior is not automatically equivalent across targets.

## Motion/reduced motion

Shared Compose animation can be reused, but reduced-motion detection is platform-specific. On Android use animator/transition scale proxies; on Apple platforms use native reduce-motion environment/API. Expose a small platform abstraction rather than pretending one universal hook exists.

## Accessibility specifics

Shared semantics modifiers help, but actual accessibility tree behavior differs by target. Verify TalkBack, VoiceOver, desktop keyboard/screen-reader APIs, focus traversal, target sizing, and platform-specific state descriptions. Shared UI does not mean shared verification coverage.

## States idiom

Shared view models can own async/task state, but lifecycle/process death/connectivity/navigation semantics remain platform-specific. Make source-of-truth and cancellation behavior explicit. Do not leak mutable state across platforms/users.

## Forms idiom

Keyboard options/focus behavior can be shared in part, but IME composition, autofill, secure input, paste, validation timing, and virtual keyboard behavior require platform verification. Preserve input through platform lifecycle events.

## Do/don't pairs

| Do | Don't |
|---|---|
| isolate platform capability behind `expect` interface | pretending Android/iOS/desktop reduced-motion APIs are identical |
| share semantic theme roles in common code | scattering target-specific hex constants through shared composables |
| adapt navigation/back per host platform | forcing mobile navigation model onto desktop windows |
| test semantics on each target | assuming one passing Compose test proves every platform tree |
| explicit lifecycle/cancellation ownership | shared singleton mutable state without user/session scope |

## Known traps

Resource packaging mismatch, target-specific font/glyph behavior, memory-model/concurrency surprises, lifecycle mismatch, accessibility API gaps, hidden platform branching, desktop/mobile input assumptions, dependency version alignment across Compose/Kotlin targets.

## Verification commands

```sh
./gradlew build
./gradlew test
./gradlew connectedDebugAndroidTest 2>/dev/null || true
./gradlew lint 2>/dev/null || true
```

Run target-specific simulator/device/desktop checks. Cross-platform compilation is static evidence, not rendered evidence.
