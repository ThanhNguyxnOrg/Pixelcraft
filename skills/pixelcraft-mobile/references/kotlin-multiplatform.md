# Kotlin Multiplatform / Compose Multiplatform

## Architecture decision: shared logic + native UI vs shared UI

Decide the sharing boundary explicitly before writing screens:

| Dimension | KMP shared logic + native SwiftUI / Compose UI | Compose Multiplatform shared UI (iOS Stable 1.8+, Android, Desktop, Web) |
|---|---|---|
| **Platform fidelity** | Full access to iOS 26 Liquid Glass, SwiftUI `TabSection`, UIKit, and Android Material 3 Expressive natively. | High shared velocity via Skiko/Metal on iOS and native Compose on Android; iOS-specific chrome/materials require intentional platform adaptation or `UIKitView` interop. |
| **Swift interop** | Use **SKIE** (Touchlab) or **Kotlin Swift Export** so Kotlin `sealed class`, `Flow`, `suspend`, and default arguments feel idiomatic in Swift. | Minimal Swift surface needed (thin iOS host `ComposeUIViewController` + platform `expect`/`actual` bridges). |
| **Best fit** | Flagship consumer apps prioritizing native platform craft and separate iOS/Android UI teams. | Product/B2B/cross-platform apps prioritizing one UI codebase across Android, iOS, and Desktop with one Kotlin team. |

## Token mapping & Compose Resources (`Res.*`)

Share semantic colors, spacing, typography scales, and typed assets in `commonMain`. Use **Compose Multiplatform Resources** (`composeResources/` generating `Res.string.*`, `Res.drawable.*`, `Res.font.*`) for localized strings, vector drawables, and bundled fonts:

```kotlin
// commonMain
object PcTokens {
  val action = Color(0xFF0074CA)
  val controlInline = 12.dp
}

@Composable
fun InvoiceHeader() {
  Text(
    text = stringResource(Res.string.invoices_title),
    fontFamily = FontFamily(Font(Res.font.brand_semibold)),
    color = MaterialTheme.colorScheme.onSurface,
  )
}
```

Keep platform capabilities (haptics, biometrics, system reduced-motion, file pickers, dynamic platform colors) behind narrow `expect`/`actual` interfaces—never fake a single universal implementation where platforms diverge.

## Layout, Navigation, ViewModel, & Compose Hot Reload

- **Compose Multiplatform for iOS (Stable 1.8+)** supports native iOS predictive swipe-back gestures, platform scroll physics, `UIKitView` / `UIKitViewController` embedding, and safe-area insets (`WindowInsets.safeDrawing`). Still adapt navigation patterns per host (tab bar/back stack on mobile, split pane/menu bar on Desktop).
- Share navigation and lifecycle cleanly using JetBrains' multiplatform libraries: **`org.jetbrains.androidx.navigation:navigation-compose`**, **`lifecycle-viewmodel-compose`**, and **`SavedStateHandle`** in `commonMain`.
- Use **Compose Hot Reload** (JetBrains JVM desktop plugin/runtime) during UI iteration to inspect layout and state changes live without restarting the app—remember JVM desktop hot reload does not replace iOS Simulator or Android device verification.

## Kotlin/Wasm (`wasmJs`) & Desktop targets

- **Desktop (JVM)**: pair shared composables with desktop rules in `pixelcraft-desktop` (window minimum size, native menu bar, keyboard shortcuts, `F6` focus traversal, multi-monitor restore).
- **Web (`wasmJs` / WasmGC)**: Compose Multiplatform for Web renders onto HTML Canvas via Skiko/WasmGC (requires WasmGC-capable browsers). Like Flutter Web, canvas UI trades off native DOM semantics, SEO, and text-selection ergonomics; verify browser accessibility and compare a DOM surface in `pixelcraft-web` / `pixelcraft-plan` for public web products.

## Typography, motion, & reduced motion

Load custom fonts via `Res.font.*` and test glyph fallback and text scaling on **every** target (`sp` on Android, Dynamic Type on iOS, OS display scaling on Desktop).

Expose reduced-motion detection via an `expect` composable/provider (`Settings.Global.ANIMATOR_DURATION_SCALE == 0f` on Android; `UIAccessibilityIsReduceMotionEnabled()` on iOS; app toggle/OS query on Desktop) and switch transitions to instant/opacity updates when enabled.

## Accessibility, states, & forms idioms

Compose `Modifier.semantics` bridges to TalkBack (Android), VoiceOver (iOS accessibility tree), and desktop accessibility APIs, but traversal order, announcements, and custom actions still differ across targets—shared UI does **not** mean shared accessibility verification.

Own async work in multiplatform `ViewModel` (`viewModelScope` with structured coroutine cancellation and explicit `Dispatchers` injection). Use `TextFieldState` / Compose forms with per-platform testing for IME composition, autofill, password managers, paste, and hardware keyboards.

## Do/don't pairs

| Do | Don't |
|---|---|
| Isolate reduced motion, haptics, and native pickers behind `expect`/`actual` | Pretend Android, iOS, and Desktop expose identical OS accessibility hooks |
| Use `Res.string.*` / `Res.font.*` from `composeResources/` | Duplicate raw strings and font bundles manually across Android and Xcode targets |
| Use SKIE or Kotlin Swift Export when exposing KMP logic to SwiftUI | Force SwiftUI views to consume awkward ObjC-erased `Flow` / sealed-class wrappers |
| Adapt chrome/navigation per platform (`pixelcraft-desktop` for JVM Desktop) | Ship a phone bottom tab bar unchanged inside a 1440px macOS window |
| Verify VoiceOver, TalkBack, and IME on each shipped OS | Assume one passing Android Compose test proves iOS and Desktop parity |

## Known traps

Coroutine cancellation/dispatcher mismatches when bridging Kotlin `suspend`/`Flow` into Swift concurrency, Compose/Kotlin/Skiko version matrix misalignment, `UIKitView` touch/z-order interop clipping, platform-specific IME & paste bugs, font fallback differences across Android/iOS/Desktop/Wasm, unverified iOS VoiceOver traversal order, oversized Wasm bundle startup on slow mobile networks.

## Verification commands

```sh
./gradlew build
./gradlew test
# Target-specific checks (run when matching SDK/toolchain is installed):
./gradlew :composeApp:lintDebug
./gradlew :composeApp:connectedDebugAndroidTest
./gradlew :composeApp:desktopTest
# For iOS targets on macOS:
xcodebuild -project iosApp/iosApp.xcodeproj -scheme iosApp -destination 'platform=iOS Simulator,name=<SimulatorName>' build
```

Gradle builds and unit tests are `static` evidence. Capture simulator/device/desktop runs across VoiceOver, TalkBack, font scaling, dark mode, safe areas, and back gestures for `rendered` evidence; mark unavailable OS targets `not-checked`.
