# SwiftUI

## Token mapping

Map DTCG semantic roles into Asset Catalog color sets (carrying light, dark, and high-contrast variants) and reference them via Xcode-generated **`ColorResource`** symbols rather than raw RGB/hex literals:

```swift
enum PC {
  static let action = Color(.semanticAction)        // ColorResource from Assets.xcassets
  static let surface = Color(.semanticSurface)
  static let controlInline: CGFloat = 12
}

// Custom environment tokens with @Entry (iOS 18+ / Xcode 16+)
extension EnvironmentValues {
  @Entry var pcSpacingScale: CGFloat = 1.0
}
```

Use `ColorResource` names that express semantic roles (`semanticAction`, `semanticDanger`), not palette names (`blue500`). Reserve compile-time constant structs for spacing, radii, and motion durations that Asset Catalogs do not store.

## iOS 26 Liquid Glass & modern materials

On iOS 26+, reserve **Liquid Glass** for floating navigation, toolbars, and controls above scrolling content—never apply glass to primary reading surfaces or stack glass-on-glass:

```swift
GlassEffectContainer(spacing: 12) {
  HStack(spacing: 12) {
    Button("Filter", systemImage: "line.3.horizontal.decrease") { showFilter = true }
      .buttonStyle(.glass)
    Button("Create", systemImage: "plus") { createInvoice() }
      .buttonStyle(.glassProminent)
  }
}
.padding()
.glassEffect(.regular, in: ConcentricRectangle(corners: .concentric(minimum: 16)))
```

- Group neighboring glass controls inside `GlassEffectContainer` so they share backdrop sampling and morph smoothly during state transitions.
- Use `.buttonStyle(.glass)` / `.buttonStyle(.glassProminent)`, `ConcentricRectangle` for concentric corner nesting inside sheets/bezels, `.tabBarMinimizeBehavior(.onScrollDown)` for content-first scrolling tabs, and `.scrollEdgeEffectStyle(.soft, for: .top)` (or `.hard`) to preserve legibility where content passes beneath floating chrome.
- **Mandatory accessibility fallback**: read `@Environment(\.accessibilityReduceTransparency)` and `@Environment(\.colorSchemeContrast)` (`.increased`). When either is active, replace translucent `.glassEffect(...)` surfaces with opaque semantic surfaces and clear borders so text contrast stays ≥ 4.5:1.

## Layout, navigation, and iOS 18–26 idioms

- Use `NavigationStack`, `NavigationSplitView`, `ViewThatFits`, `Layout`, safe-area insets (`.safeAreaInset(edge: .bottom)`), and horizontal/vertical size classes rather than fixed device frames.
- Use the **`Tab` / `TabSection`** API (iOS 18+, replacing deprecated `.tabItem`) for adaptive iPhone tab bars and iPad floating tab bars / sidebars:

```swift
TabView(selection: $selectedTab) {
  Tab("Invoices", systemImage: "doc.text", value: AppTab.invoices) {
    InvoiceListView()
  }
  TabSection("Archive") {
    Tab("Paid", systemImage: "checkmark.circle", value: AppTab.paid) { PaidListView() }
  }
}
.tabBarMinimizeBehavior(.onScrollDown)
```

- Use `.navigationTransition(.zoom(sourceID: invoice.id, in: ns))` paired with `.matchedTransitionSource(id: invoice.id, in: ns)` for continuity transitions when opening detail cards/media (bypassing zoom motion when Reduce Motion is enabled).
- Use native **`ContentUnavailableView`** (and `ContentUnavailableView.search`) for empty, error, and no-results states.
- On iOS 26+, prefer native SwiftUI **`WebView`** / `WebPage` (WebKit) over custom `UIViewRepresentable` `WKWebView` wrappers when embedding web content.
- Extend glanceable and ongoing experiences to the Lock Screen / Home Screen via **`WidgetKit`** interactive widgets (`AppIntent`) and **`ActivityKit`** Live Activities (see `references/task-state-composition.md`).

## Typography & Dynamic Type

Prefer system text styles (`.body`, `.headline`, `.title2`) because they scale automatically with Dynamic Type. For custom bundled fonts registered in `Info.plist`, always bind scaling to a semantic text style:

```swift
Text(invoice.totalFormatted)
  .font(.custom("BrandSans-SemiBold", size: 17, relativeTo: .body))
```

Read `@Environment(\.dynamicTypeSize) private var typeSize` and switch horizontal label/value rows to `VStack` (or `ViewThatFits`) when `typeSize.isAccessibilitySize` so numbers and actions never clip.

## Motion, haptics, & reduced motion

Read `@Environment(\.accessibilityReduceMotion) private var reduceMotion` and switch spatial transitions/zooms to instant or cross-dissolve updates when true. Avoid unbounded implicit `.animation(_:)` modifiers; scope animations to explicit value changes or `withAnimation`.

Trigger semantic haptics declaratively with **`.sensoryFeedback`** (iOS 17+) rather than manual UIKit generators:

```swift
Button("Approve") { approve() }
  .sensoryFeedback(.success, trigger: approvalCount)
```

## Accessibility specifics

Use `.accessibilityLabel`, `.accessibilityValue`, `.accessibilityHint` (sparingly), `.accessibilityAddTraits`, `.accessibilityElement(children: .combine)`, `.accessibilityAction(named:)`, `.accessibilityAdjustableAction`, and `.accessibilitySortPriority`. Maintain ≥ `44×44 pt` hit targets with `.contentShape(Rectangle())` so visual padding actually receives touches. Verify VoiceOver focus order on device/simulator rather than assuming visual order.

## States & forms idioms

Model view state as an explicit enum (`loading`, `loaded`, `empty`, `error`, `offline`) owned via `@Observable`, `@State`, `@Binding`, or `@Environment`. Preserve navigation path (`Codable` `NavigationPath`) and drafts across OS background termination (`@SceneStorage` / SwiftData / disk) and handle `.task` cancellation cleanly.

In forms and scrollable editors, attach **`.scrollDismissesKeyboard(.interactively)`** so users can drag the keyboard down smoothly with their thumb, and use `Form`, `LabeledContent`, `.keyboardType`, `.textContentType`, `.submitLabel`, `.autocorrectionDisabled`, and `.focused($field)` sequencing. Integrate system password autofill, Passkeys, and `SignInWithAppleButton` (`AuthenticationServices`) instead of blocking paste or custom-masking credentials.

## The Composable Architecture (TCA)

Adopt **TCA** (`ComposableArchitecture` 1.x+) when an Apple-platform app needs strict unidirectional state, cancellable async effect choreography, deep-linkable navigation trees, and deterministic unit test coverage—skip TCA for simple 1–2 screen utilities where SwiftUI `@Observable` suffices:

- Annotate features with `@Reducer` and `@ObservableState struct State: Equatable`, and bind directly in views using **`@Bindable var store: StoreOf<Feature>`** (`$store.query`, `store.send(.saveTapped)`).
- Drive modals and push stacks from state via **`@Presents var destination: Destination.State?`** (`@Reducer enum Destination`) or `StackState` / `NavigationStack(path:)` so deep links and state restoration stay deterministic.
- Verify async race conditions, debouncing, error paths, and navigation dismissals deterministically with **`TestStore`** and injected `@Dependency(\.continuousClock)` / client dependencies before visual QA.

```swift
import ComposableArchitecture
import SwiftUI

@Reducer
struct InvoiceFeature {
  @ObservableState
  struct State: Equatable {
    var filter = ""
    var isSaving = false
    @Presents var destination: Destination.State?
  }

  enum Action: BindableAction {
    case binding(BindingAction<State>)
    case saveTapped
    case saveCompleted(Result<Void, Error>)
    case destination(PresentationAction<Destination.Action>)
  }

  @Reducer
  enum Destination {
    case editor(InvoiceEditorFeature)
  }

  @Dependency(\.invoiceClient) var invoiceClient

  var body: some ReducerOf<Self> {
    BindingReducer()
    Reduce { state, action in
      switch action {
      case .saveTapped:
        state.isSaving = true
        return .run { [filter = state.filter] send in
          await send(.saveCompleted(Result { try await invoiceClient.save(filter) }))
        }
      case .saveCompleted:
        state.isSaving = false
        return .none
      case .binding, .destination:
        return .none
      }
    }
    .ifLet(\.$destination, action: \.destination)
  }
}

struct InvoiceView: View {
  @Bindable var store: StoreOf<InvoiceFeature>

  var body: some View {
    Form {
      TextField("Filter", text: $store.filter)
      Button("Save") { store.send(.saveTapped) }
        .disabled(store.isSaving)
    }
    .sheet(item: $store.scope(state: \.destination?.editor, action: \.destination.editor)) { editorStore in
      InvoiceEditorView(store: editorStore)
    }
  }
}
```

## 2026 App Store submission, privacy & runtime gates

- **Xcode 26 SDK & `PrivacyInfo.xcprivacy`**: build against the current Xcode 26 iOS/iPadOS SDK and ship an accurate `PrivacyInfo.xcprivacy` declaring every first-party Required Reason API (`UserDefaults`, `FileTimestamp`, `SystemBootTime`, `DiskSpace`), collected data categories, and tracking domains—plus verify every third-party SPM/XCFramework dependency bundles its own signed privacy manifest.
- **Keychain-only credentials**: store OAuth/JWT access & refresh tokens, API secrets, and biometric keys exclusively in **Keychain** (`SecItemAdd` with `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly`)—**never** in `UserDefaults`, `@AppStorage`, or unencrypted files.
- **Sign in with Apple & in-app Account Deletion**: include **`SignInWithAppleButton`** with equal visual prominence whenever any third-party social sign-in (Google, Meta, GitHub, LINE, Zalo) is offered; if users can create an account in-app, provide a discoverable **Delete Account** flow in Settings that confirms consequences and actually deletes/schedules deletion in-app (linking out to a support email or contact form triggers App Review rejection).
- **Zero-permission pickers & Settings recovery**: use SwiftUI **`PhotosPicker`** (`PhotosUI`) so single/multiple photo selection needs zero photo-library permission prompt; for camera/microphone/location/notifications, trigger the system prompt just-in-time on user intent, support `.limited` photo access gracefully, and render a calm inline `"Open Settings"` button (`UIApplication.openSettingsURLString`) when authorization is `.denied`.
- **`120fps` ProMotion & dSYM symbolication**: set **`CADisableMinimumFrameDurationOnPhone = true`** in `Info.plist` for `120 Hz` ProMotion animations (`< 8.33 ms`/frame), target `< 800 ms` cold start, and upload archive **dSYMs** automatically in CI to maintain `>= 99.5%` crash-free sessions.

## Do/don't pairs

| Do | Don't |
|---|---|
| `Color(.semanticAction)` via Asset Catalog `ColorResource` | Scattered `Color(red: 0, green: 0.45, blue: 0.79)` literals |
| `Tab("Home", systemImage: "house") { ... }` + `TabSection` | Deprecated `.tabItem { Label(...) }` on iOS 18+ targets |
| `.font(.custom("Brand", size: 17, relativeTo: .body))` | `.font(.custom("Brand", fixedSize: 17))` ignoring Dynamic Type |
| Check `accessibilityReduceTransparency` & `colorSchemeContrast` around `.glassEffect` | Stack `.glassEffect` on reading cards or ignore Increase Contrast |
| Store tokens in Keychain, ship `PrivacyInfo.xcprivacy`, and wire real in-app Account Deletion + `SignInWithAppleButton` | Save JWTs in `@AppStorage`/`UserDefaults` or link "Delete Account" to a `mailto:` address |
| Use `PhotosPicker`, `.scrollDismissesKeyboard(.interactively)`, and `CADisableMinimumFrameDurationOnPhone = true` | Request full photo library access just for an avatar upload or cap animations at `60 Hz` on ProMotion iPhones |
| `ContentUnavailableView("No Invoices", systemImage: "doc")` + `.safeAreaInset(edge: .bottom)` | Blank white `List` on empty data or hard-coded bottom padding colliding with home indicator |

## Known traps

`GeometryReader` layout loops, implicit animation explosions, stacking glass-on-glass reducing legibility, `NavigationStack` path state duplication, `.task` re-firing on view identity changes, sheet/full-screen cover focus loss on dismiss, custom font fixed-size clipping, safe-area double padding, storing tokens in `UserDefaults`, missing SDK `PrivacyInfo.xcprivacy` manifests, preview fixtures mistaken for runtime persistence.

## Verification commands

```sh
xcrun simctl list devices available
xcodebuild -scheme App -destination 'platform=iOS Simulator,name=<SimulatorName>' build
xcodebuild test -scheme App -destination 'platform=iOS Simulator,name=<SimulatorName>'
```

Use Xcode Previews, snapshot tests, and real simulator/physical-device runs (`>= 2` iOS devices including ProMotion) across Dynamic Type (`AX3` / `200%`), Dark Mode, Increase Contrast, Reduce Transparency, Reduce Motion, background termination restoration, and VoiceOver/Accessibility Inspector for `rendered` evidence. Compilation alone is `static` evidence; label untested physical devices or iOS versions `not-checked`.
