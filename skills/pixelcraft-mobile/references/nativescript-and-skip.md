# NativeScript and Skip (`skip.tools`)

Use this reference when targeting native iOS and Android UI via either **NativeScript** (direct JS/TS runtime marshaling to native platform APIs without a WebView) or **Skip** (Swift + SwiftUI apps targeting both iOS natively and Android via Jetpack Compose).

## Architecture decision table

| Approach | Language & UI authoring | Android runtime & UI | iOS runtime & UI | Best fit | Primary trade-off |
|---|---|---|---|---|---|
| **NativeScript** | TS/JS + Core XML, Angular, Vue, Solid, or Svelte | V8 runtime calling Android Java/Kotlin Views directly | V8/JavaScriptCore calling UIKit/ObjC/Swift APIs directly | Web/TS teams needing direct zero-bridge-boilerplate access to native iOS/Android SDKs without React Native's layer | Smaller widget ecosystem than RN/Flutter; platform layout differences require explicit testing |
| **Skip Lite** | Swift + SwiftUI | Transpiles Swift → Kotlin and SwiftUI → Material 3 Jetpack Compose (`skip-ui`) | 100% unmodified native Swift/SwiftUI | Apple-first SwiftUI teams shipping a true native Android Material 3 app with zero Android runtime overhead | Transpiled Swift subset (no arbitrary C/Swift-only binary deps without Kotlin equivalents) |
| **Skip Fuse** | Swift + SwiftUI | Compiles Swift natively via Swift SDK for Android (JNI) + bridges SwiftUI to Jetpack Compose | 100% unmodified native Swift/SwiftUI | Swift teams needing full Swift stdlib, SwiftPM/C packages, and Swift concurrency on Android alongside native Compose UI | Larger APK size from bundled Swift runtime; native JNI boundary to debug |

## NativeScript idioms

- **Token mapping**: define CSS custom properties in `app.css` (using `.ns-dark` / `.ns-light` root classes automatically applied by `@nativescript/core` for system theme changes) rather than repeating inline colors in templates.
- **Direct native interop**: NativeScript exposes native classes directly (`UIImpactFeedbackGenerator`, `android.view.HapticFeedbackConstants`) without writing glue modules—guard platform calls with `isIOS` / `isAndroid` (`@nativescript/core`).
- **Lists & layout**: use `GridLayout` / `FlexboxLayout` / `StackLayout` with `iosOverflowSafeArea` configured intentionally, and use `ListView` (or `@nativescript-community/ui-collectionview`) for native view recycling—never nest dozens of items inside a `ScrollView`.

```ts
import { isAndroid, isIOS, Utils } from '@nativescript/core';

export function triggerConfirmHaptic(): void {
  if (isIOS) {
    const gen = UINotificationFeedbackGenerator.alloc().init();
    gen.notificationOccurred(UINotificationFeedbackType.Success);
  } else if (isAndroid) {
    const view = Utils.android.getCurrentActivity()?.getWindow()?.getDecorView();
    view?.performHapticFeedback(android.view.HapticFeedbackConstants.CONFIRM);
  }
}
```

- **Accessibility**: set `accessible="true"`, `accessibilityLabel`, `accessibilityRole`, and `accessibilityLiveRegion` on interactive elements; verify VoiceOver and TalkBack because custom gesture-attached `<Label>` or `<StackLayout>` nodes do not announce as buttons automatically.

## Skip (`skip.tools`) idioms

- **Write idiomatic SwiftUI first**: Skip preserves standard SwiftUI on iOS untouched while mapping `NavigationStack`, `TabView`, `List`, `Form`, `Sheet`, Asset Catalog colors, and `Localizable.xcstrings` onto native Jetpack Compose Material 3 equivalents on Android (`skip-ui`).
- **Platform escape hatches**: isolate genuine Android-only or iOS-only differences with `#if os(Android)` / `#if SKIP` and embed custom Jetpack Compose UI directly inside SwiftUI via `ComposeView` when Android platform idioms (e.g., Material 3 Expressive components or Android 16 Live Updates) diverge from Apple HIG:

```swift
import SwiftUI

struct InvoiceScreen: View {
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  var body: some View {
    NavigationStack {
      List {
        Text("Invoice #1042")
      }
      .navigationTitle("Invoices")
      #if os(Android)
      .toolbarBackground(.visible, for: .navigationBar)
      #endif
    }
  }
}
```

- **Token mapping & typography**: store semantic colors in Xcode Asset Catalogs and use SwiftUI text styles (`.body`, `.headline`) so iOS scales with Dynamic Type and Skip maps them to Compose Material typography (`sp` scaling) automatically.

## Do/don't pairs

| Do | Don't |
|---|---|
| Guard NativeScript native API calls with `isIOS` / `isAndroid` | Call UIKit or `android.*` APIs unconditionally across platforms |
| Use `.ns-dark` CSS custom properties in NativeScript and Asset Catalog tokens in Skip | Hard-code hex literals across templates or views |
| Use `ListView` / `CollectionView` (NativeScript) or SwiftUI `List` / `LazyVStack` (Skip) | Render large feeds inside unrecycled `ScrollView` containers |
| Inspect Android Material 3 layout, back gesture, and TalkBack separately in Skip | Assume passing Xcode Previews proves Android Compose parity |
| Choose Skip Fuse when Android needs full SwiftPM/C libraries; Skip Lite for minimal APK | Fight Skip Lite transpiler limits with unsupported C-interop libraries |

## Known traps

- **NativeScript**: leaking native ObjC/Java references across closures, missing `accessible="true"` on tappable layouts, ignoring Android 15/16 edge-to-edge safe areas, mixing Vite/Webpack plugin configs inconsistently.
- **Skip**: using iOS-only modifiers (`glassEffect`, UIKit representables) without `#if !os(Android)` fallbacks, assuming every SwiftUI layout modifier behaves identically in Compose without testing on an Android emulator, oversized Skip Fuse APKs without ABI splitting.

## Verification commands

```sh
# NativeScript:
ns doctor
ns build ios
ns build android
# Skip (requires Xcode + Android SDK + skip CLI):
skip doctor
swift test
skip test
skip android build
```

Compilation and unit tests (`swift test`, `ns build`) are `static` evidence. Run real iOS Simulator and Android Emulator/device builds (`ns run ios`/`android`, `skip android run`) to verify TalkBack, VoiceOver, safe areas, dark mode, text scaling, and platform back gestures for `rendered` evidence; label unavailable targets `not-checked`.
