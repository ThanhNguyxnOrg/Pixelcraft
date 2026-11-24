# Mobile tactile interactions, sheets, and gestures

Use this reference alongside the target mobile framework guide (`swiftui.md`, `jetpack-compose.md`, `flutter.md`, `react-native-expo.md`) for high-craft touch ergonomics, bottom sheets, gestures, haptics, and dynamic text resilience.

## Bottom sheet detents and scroll handover

| Concern | Concrete rule |
|---|---|
| Detents | Define explicit resting heights (`peek`/`medium`, `large`, or content-fit) rather than arbitrary pixel stops; dismiss smoothly on downward velocity fling or backdrop tap/Escape. |
| Scroll handover | When a sheet contains a scrollable list, upward drags scroll content once at the top detent, and downward drags at `scrollOffset === 0` hand control back to the sheet without stutter or double-scrolling. |
| Keyboard & safe areas | Track on-screen keyboard insets so sheet inputs and primary submit actions stay visible above the keyboard, and pad bottom content for the home indicator / gesture bar. |
| Accessibility | Always expose a visible Close/Done button (and screen-reader escape gesture) so users who cannot drag are never trapped in a modal sheet. |

## Thumb-zone ergonomics and action placement

- Place high-frequency navigation and primary commitment actions in the lower reachable third on tall phones, reserving top bars for orientation, back navigation, and secondary overflow actions.
- Keep touch targets at least `44×44 pt` (iOS) / `48×48 dp` (Android) with at least `8 pt/dp` separation between destructive and safe sibling actions.
- Never rely on edge swipes that collide with OS back gestures (iOS left-edge swipe back, Android predictive back); inset horizontal carousels or provide explicit controls.

## Semantic haptics (restraint over noise)

Trigger haptics only to confirm physical thresholds or consequential state changes — never on every scroll tick or routine button tap:

| Moment | iOS (`UIKit` / `SwiftUI`) | Android (`HapticFeedbackConstants`) |
|---|---|---|
| Discrete picker / detent snap | `UISelectionFeedbackGenerator` / `.selection` | `CLOCK_TICK` or `SEGMENT_TICK` |
| Tactile toggle / drag lock | `UIImpactFeedbackGenerator(.light)` | `CONFIRM` / `CONTEXT_CLICK` |
| Completed task / error | `UINotificationFeedbackGenerator(.success / .error)` | `CONFIRM` / `REJECT` |

Honor system haptic and reduced-motion preferences; degrade silently on devices without a linear resonant actuator.

## Swipe-to-act and optimistic offline queues

- Every swipe action on a list row (archive, pin, delete) must also be reachable via row detail, context menu, or accessibility custom actions (`accessibilityCustomActions` / `CustomAccessibilityAction`).
- Pair swipe-archive/delete with an immediate `Undo` snackbar/toast that clears the home indicator and does not auto-dismiss before a user can reach it.
- Queue offline mutations visibly (`Pending sync` indicator) with idempotent replay when connectivity returns; never discard drafted forms or media on backgrounding or network drop.

## Dynamic Type / `sp` scaling reflow

- Test every screen at default size **and** accessibility-large (`200%` / AX3+).
- Reflow side-by-side horizontal pairs (label + value, avatar + metadata + action button) into vertical stacks when font scale exceeds standard thresholds instead of truncating essential numbers or actions.
- Never lock list rows, pills, or bottom bars to fixed pixel/point heights that clip ascenders/descenders when text scales.
