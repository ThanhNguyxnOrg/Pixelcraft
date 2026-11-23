# UIKit

## Token mapping

Use asset catalog colors keyed by semantic role plus dynamic provider colors when needed:

```swift
let action = UIColor(named: "Semantic/Action")
```

Asset catalogs carry light/dark/high-contrast variants. Keep spacing/type constants in a typed semantic namespace; do not copy raw RGB values through view controllers/cells.

## Layout and responsive idioms

Use Auto Layout constraints, stack views, safe-area layout guides, trait collections, readable content guides, scroll view content layout guides, and collection/compositional layout intentionally. Avoid fixed frames except tightly controlled custom drawing/layout. Support multitasking/split-screen/orientation where target expects it.

## Typography/custom fonts

Use `UIFontMetrics` to scale custom/system fonts for Dynamic Type. Register custom fonts correctly and set `adjustsFontForContentSizeCategory` where appropriate. Layout must respond to trait collection/content size changes rather than truncating essential copy.

## Motion/reduced motion

Use UIView/CA animation intentionally. Check `UIAccessibility.isReduceMotionEnabled` and observe relevant notifications when behavior must adapt. Keep animations interruptible and provide non-motion state feedback. Do not rely on animation completion handlers for correctness without cancellation handling.

## Accessibility specifics

Configure `accessibilityLabel`, `accessibilityValue`, `accessibilityHint` sparingly, traits, custom actions, adjustable behavior, accessibility elements ordering (`accessibilityElements`), notifications (`UIAccessibility.post(notification:argument:)`), and focus behavior. Verify hit regions at 44×44 pt or document platform exception.

## States idiom

Use explicit view-state models rather than hiding/showing ad hoc controls. Diffable data sources need correct identity/reuse semantics. Preserve state across backgrounding/restoration and avoid duplicate operations when views reappear. Loading/empty/error/offline/permission states deserve designed content, not blank table/collection views.

## Forms idiom

Use correct keyboard type, text content type, return key behavior, autocapitalization/autocorrection, password autofill/passkeys, scroll adjustment for keyboard, validation after completion, and input preservation. First responder management is interaction design, not incidental plumbing.

## Do/don't pairs

| Do | Don't |
|---|---|
| `UIButton(configuration:)` or real control with target/action | tapping a plain `UILabel` as a fake control |
| constraints to safe-area layout guide | hard-coded bottom padding copied from one device screenshot |
| `UIFontMetrics.default.scaledFont(for:)` | fixed point font that ignores Dynamic Type |
| prepare/reuse cells resetting state explicitly | stale images/selection/progress leaking through reuse |
| VoiceOver order/name verification | assuming visual constraint order equals accessibility order |

## Known traps

Constraint ambiguity/performance, cell reuse state leakage, retain cycles in handlers, keyboard obstruction, safe-area mismatch, opaque view controller hierarchy state, trait collection changes ignored, modal presentation/navigation back inconsistency, restoration identifier misuse.

## Verification commands

```sh
xcodebuild -scheme App -destination 'platform=iOS Simulator,name=iPhone 15' build
xcodebuild test -scheme App -destination 'platform=iOS Simulator,name=iPhone 15'
```

Use simulator/device screenshots, View Debugger, Accessibility Inspector, VoiceOver, Dynamic Type, dark/high-contrast modes, rotation/split-screen, and network-link conditioning for evidence.
