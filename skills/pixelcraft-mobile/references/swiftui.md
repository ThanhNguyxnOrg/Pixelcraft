# SwiftUI

Evidence: Apple environment keys verified in current docs: `@Environment(\.accessibilityReduceMotion)` and `@Environment(\.dynamicTypeSize)`.

## Token mapping

Map generated Swift colors/values into asset catalogs or a typed semantic theme enum. Prefer asset catalog colors for light/dark/high-contrast variants; use generated constants only where compile-time generation is intentional:

```swift
enum PC {
  static let action = Color("Semantic/Action")
  static let controlInline: CGFloat = 12
}
```

Do not scatter raw RGB/hex initializers through views. Use `ColorAsset` names that express semantic roles.

## Layout and responsive idioms

Use stacks, grids, safe-area behavior, size classes, dynamic type adaptation, and container resizing rather than fixed device frames. `ViewThatFits`, `Layout`, geometry-aware composition, and scroll behavior are selected by content need—not used reflexively. Respect navigation stack/split view/tab bar idioms and iPad/macOS resizing where targeted.

## Typography/custom fonts

Prefer system text styles (`.body`, `.headline`, `.title`) because they scale automatically. Register custom fonts correctly in the app target/Info.plist and use scalable relative sizing rather than fixed point-only assumptions. Read `dynamicTypeSize` when layout must switch at accessibility sizes.

## Motion/reduced motion

Use SwiftUI animation/spring/transition intentionally and read:

```swift
@Environment(\.accessibilityReduceMotion) private var reduceMotion
```

Choose non-motion or opacity/static alternatives when true. Do not add `.animation` globally to state that should update instantly; implicit animation scope matters.

## Accessibility specifics

Use SwiftUI accessibility modifiers: `accessibilityLabel`, `accessibilityValue`, `accessibilityHint` sparingly, `accessibilityTraits`, `accessibilityElement(children:)`, custom actions, adjustable values, sort priority. Verify VoiceOver order rather than assuming visual order. Minimum touch target baseline is 44×44 pt; padding must produce real hit area.

## States idiom

Model view state explicitly: loading/loaded/empty/error/permission/offline/optimistic. Keep state ownership clear through `@State`, `@Binding`, `@Observable`, environment ownership. Preserve state across backgrounding/process restoration where required. Pull-to-refresh/progress indicators must reflect actual lifecycle.

## Forms idiom

Use `Form`, `LabeledContent`, keyboard type/text content type/submit labels/autocorrection settings, validation after meaningful completion, and input preservation. Secure fields/password autofill/passkeys should integrate with system behavior rather than custom blocking.

## Do/don't pairs

| Do | Don't |
|---|---|
| `Button("Save invoice") { save() }` | `Text("Save invoice").onTapGesture { save() }` as fake button |
| `@Environment(\.dynamicTypeSize) private var typeSize` and adaptive layout | fixed-height row clipping accessibility text sizes |
| `if reduceMotion { instantUpdate() } else { withAnimation(...) }` | large animated movement regardless of Reduce Motion |
| `.accessibilityLabel("Delete \(invoice.name)")` | relying on a trash-can glyph as the only meaning |
| `.safeAreaInset(edge: .bottom)` for persistent action | placing CTA underneath home indicator/keyboard |

## Known traps

GeometryReader layout loops, implicit animation explosions, hidden Keyboard avoidance differences, navigation stack state duplication, sheet/full-screen cover focus and dismissal, custom large-title mismatch, preview data mistaken for runtime state, dynamic type truncation, safe-area double padding, task cancellation/lifecycle confusion.

## Verification commands

```sh
xcodebuild -scheme App -destination 'platform=iOS Simulator,name=iPhone 15' build
xcodebuild test -scheme App -destination 'platform=iOS Simulator,name=iPhone 15'
xcrun simctl boot <device> 2>/dev/null || true
```

Use Xcode Previews, snapshot tests, simulator screenshots, Accessibility Inspector, VoiceOver, Dynamic Type sizes, dark mode, orientation/split-view runs for rendered evidence.
