# UIKit

## Token mapping

Store light, dark, and high-contrast semantic colors in Asset Catalogs and reference them through generated `ColorResource` symbols (`UIColor(resource: .semanticAction)`) or dynamic trait providers (`UIColor { traits in ... }`). Keep spacing, corner radii, and motion constants in a typed semantic namespace—never duplicate raw RGB values across view controllers or cells.

```swift
enum PCColor {
  static let action = UIColor(resource: .semanticAction)
  static let surface = UIColor(resource: .semanticSurface)
}
```

## Trait changes & Swift 6 `@MainActor` isolation

`traitCollectionDidChange(_:)` is **deprecated (iOS 17+)**. Register explicit trait observers with **`registerForTraitChanges`** so updates run only for the traits you care about, and maintain **Swift 6 `@MainActor`** isolation on UIKit subclasses (avoiding `DispatchQueue.main.async` workarounds or `nonisolated` UI mutations):

```swift
@MainActor
final class InvoiceViewController: UIViewController {
  override func viewDidLoad() {
    super.viewDidLoad()
    registerForTraitChanges(
      [UITraitPreferredContentSizeCategory.self, UITraitAccessibilityContrast.self]
    ) { (self: Self, _) in
      self.updateTypographyAndBorders()
    }
  }
}
```

## Layout, sheets, Liquid Glass, & SwiftUI interop

- Use Auto Layout constraints against `view.safeAreaLayoutGuide`, `readableContentGuide`, `keyboardLayoutGuide`, `UIStackView`, and `UICollectionViewCompositionalLayout`. Avoid fixed frames except controlled custom drawing.
- **iOS 26 Liquid Glass (`UIGlassEffect` / `UIGlassContainerEffect`)**: wrap floating controls and bars in `UIVisualEffectView(effect: UIGlassEffect())` (configuring `isInteractive` / `tintColor` where appropriate) and group adjacent glass views inside a `UIGlassContainerEffect` view. Always observe `UIAccessibility.reduceTransparencyStatusDidChangeNotification` and `UIAccessibility.darkerSystemColorsStatusDidChangeNotification` (`UIAccessibility.isReduceTransparencyEnabled` / `isDarkerSystemColorsEnabled`) to fall back to opaque high-contrast surfaces.
- **Modern modal sheets (`UISheetPresentationController.Detent`)**: declare explicit `.medium()`, `.large()`, or content-fitting `.custom(identifier:) { ctx in ... }` detents, set `prefersGrabberVisible = true`, configure `largestUndimmedDetentIdentifier` when background interaction is intentional, and expose a visible Close/Done button for non-drag accessibility.
- **Empty & loading states (`UIContentUnavailableConfiguration`)**: assign `contentUnavailableConfiguration` (`.empty()`, `.loading()`, `.search()`, with action button configuration) on `UIViewController` instead of toggling hidden placeholder subviews.
- **Embedding SwiftUI cells (`UIHostingConfiguration`)**: host complex responsive cell layouts inside `UICollectionViewCell` / `UITableViewCell` via `cell.contentConfiguration = UIHostingConfiguration { ... }` rather than maintaining parallel Auto Layout cell subclasses.

```swift
var config = UIContentUnavailableConfiguration.empty()
config.text = "No Pending Invoices"
config.secondaryText = "New invoices will appear here when synced."
config.image = UIImage(systemName: "doc.text")
contentUnavailableConfiguration = config
```

## Typography & Dynamic Type

Scale every custom and system font via `UIFontMetrics(forTextStyle: .body).scaledFont(for: baseFont)` and set `adjustsFontForContentSizeCategory = true`. Configure `numberOfLines = 0` on essential labels and reflow horizontal `UIStackView` axes to `.vertical` at accessibility content-size categories.

## Motion & reduced motion

Use `UIViewPropertyAnimator` for interruptible animations and check `UIAccessibility.isReduceMotionEnabled` (observing `UIAccessibility.reduceMotionStatusDidChangeNotification`). Never rely on animation completion blocks for correctness without handling cancellation or interrupted transitions.

## Accessibility specifics

Configure `accessibilityLabel`, `accessibilityValue`, `accessibilityHint` (sparingly), `accessibilityTraits`, `accessibilityCustomActions`, `accessibilityElements` order, and `UIAccessibility.post(notification: .announcement / .screenChanged, argument:)`. Verify touch hit areas are at least `44×44 pt` (expanding via `point(inside:with:)` when a visual glyph is smaller).

## States, forms & 2026 App Store gates

Drive tables and collections with `UICollectionViewDiffableDataSource` / `UITableViewDiffableDataSource` using stable item identifiers—never rely on `reloadData()` to hide identity bugs. Reset reused cell state explicitly in `prepareForReuse()` or cell configuration handlers. Preserve route and draft state across OS background memory eviction via `NSUserActivity` and `UIWindowSceneDelegate` state restoration (`stateRestorationActivity(for:)`).

In forms and scrollable editors, set **`scrollView.keyboardDismissMode = .interactive`**, configure `keyboardType`, `textContentType`, `returnKeyType`, password autofill/passkeys, and pin bottom actions to `view.keyboardLayoutGuide.topAnchor`. Manage `becomeFirstResponder()` / `resignFirstResponder()` deliberately and validate after field completion rather than interrupting every keystroke.

- **App Store privacy, security & compliance**: compile against the **Xcode 26 SDK**, ship `PrivacyInfo.xcprivacy` covering first-party code and every embedded SDK, store tokens solely in **Keychain** (never `UserDefaults`), include **Sign in with Apple** (`ASAuthorizationAppleIDButton`) alongside any third-party social login, ship real **in-app Account Deletion** (never a `mailto:` support link), use **`PHPickerViewController`** (and support `.limited` photo library authorization + `UIApplication.openSettingsURLString` recovery when camera/mic/location is denied), and enable **`CADisableMinimumFrameDurationOnPhone = true`** in `Info.plist` for `120fps` ProMotion responsiveness with `UISpringTimingParameters(dampingRatio:initialVelocity:)` velocity handover.

## Do/don't pairs

| Do | Don't |
|---|---|
| `registerForTraitChanges([UITraitUserInterfaceStyle.self])` | Overriding deprecated `traitCollectionDidChange(_:)` on iOS 17+ |
| `UIButton(configuration: .filled())` / `.glass()` | Adding `UITapGestureRecognizer` to a plain `UILabel` |
| Pin bottom CTA to `view.keyboardLayoutGuide.topAnchor` + `keyboardDismissMode = .interactive` | Manually parsing keyboard frame notifications with magic offsets |
| Use `PHPickerViewController`, Keychain storage, `PrivacyInfo.xcprivacy`, and real in-app Account Deletion | Use legacy `UIImagePickerController` for photo picking, save tokens in `UserDefaults`, or link account deletion to email |
| `contentUnavailableConfiguration = UIContentUnavailableConfiguration.empty()` | Toggling ad-hoc hidden empty-state views over a collection view |
| `UIFontMetrics.default.scaledFont(for:)` + `adjustsFontForContentSizeCategory` | Fixed point `UIFont(name:size:)` ignoring Dynamic Type |
| Check `isReduceTransparencyEnabled` around `UIGlassEffect` | Leave translucent glass unreadable under Reduce Transparency / Increase Contrast |

## Known traps

Auto Layout constraint ambiguity, cell reuse state leakage, retain cycles in trait/button closures (`[weak self]`), Swift 6 `@MainActor` sendability warnings silenced with unsafe `@unchecked Sendable`, keyboard obstruction, modal presentation dismissal skipping `viewWillAppear` on page-sheet parents, missing `UIGlassEffect` accessibility fallbacks, tokens leaked into `UserDefaults`, missing `CADisableMinimumFrameDurationOnPhone`.

## Verification commands

```sh
xcrun simctl list devices available
xcodebuild -scheme App -destination 'platform=iOS Simulator,name=<SimulatorName>' build
xcodebuild test -scheme App -destination 'platform=iOS Simulator,name=<SimulatorName>'
```

Inspect real simulator and physical-device builds (`>= 2` iOS devices) with View Debugger, Accessibility Inspector, VoiceOver, Dynamic Type (`AX3` / `200%`), Dark Mode, Increase Contrast, Reduce Transparency, background termination restoration, and rotation/split-screen for `rendered` evidence; compilation alone is `static`. Label untested hardware `not-checked`.
