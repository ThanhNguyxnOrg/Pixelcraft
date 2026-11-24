# Mobile tactile interactions, sheets, and gestures

Use this reference alongside the target mobile framework guide (`swiftui.md`, `uikit.md`, `jetpack-compose.md`, `flutter.md`, `react-native-expo.md`, `lynxjs.md`) for high-craft touch ergonomics, bottom sheets, gestures, haptics, offline queues, and Dynamic Type/`sp` resilience.

## Bottom sheet detents & cross-framework idioms

| Concern | Concrete rule |
|---|---|
| **Detents** | Define explicit resting heights (`medium`/`peek`, `large`, or content-fit) rather than arbitrary pixel stops; dismiss smoothly on downward velocity fling, backdrop tap, or Escape/Back. |
| **Scroll handover** | When a sheet wraps a scrollable list, upward drags scroll content once at the top detent, and downward drags at `scrollOffset == 0` hand control back to the sheet without stutter or double-scrolling. |
| **Keyboard & safe areas** | Track soft-keyboard insets so sheet inputs and primary submit actions remain visible above the IME, and pad bottom content above the home indicator / gesture bar. |
| **Accessibility** | Always expose a visible Close/Done button (and screen-reader escape gesture) so users who cannot drag are never trapped inside a modal sheet. |

| Framework | Sheet primitive | Keyboard & detent idiom |
|---|---|---|
| **SwiftUI** | `.sheet(isPresented:)` | `.presentationDetents([.medium, .large])`, `.presentationDragIndicator(.visible)`, `.presentationBackgroundInteraction(.enabled(upThrough: .medium))` |
| **UIKit** | `UISheetPresentationController` | `detents = [.medium(), .large()]` or `.custom(identifier:)`, `prefersGrabberVisible = true`, pin CTA to `view.keyboardLayoutGuide` |
| **Jetpack Compose** | `ModalBottomSheet` (Material 3) | `rememberModalBottomSheetState(skipPartiallyExpanded = false)`, `contentWindowInsets = { WindowInsets.safeDrawing }`, `Modifier.imePadding()` |
| **Flutter** | `showModalBottomSheet` / `CupertinoSheetRoute` | `isScrollControlled: true` + `DraggableScrollableSheet` (Material) or `showCupertinoSheet` (iOS); pad by `MediaQuery.viewInsetsOf(context).bottom` |
| **React Native / Expo** | `@gorhom/bottom-sheet` (or native `react-native-true-sheet`) | `snapPoints={['50%', '90%']}`, `BottomSheetScrollView` / `BottomSheetFlatList`, paired with `react-native-keyboard-controller` |
| **LynxJS** | Custom sheet `<view>` driven by MTS | Handle `main-thread:bindtouchmove` / `touchend` snap physics on main thread; notify React state via `runOnBackground` |

## Thumb-zone ergonomics & gesture conflict avoidance

- Place high-frequency navigation and primary commitment actions in the lower reachable third on tall phones, reserving top bars for orientation, back navigation, and secondary overflow actions.
- Keep touch targets ≥ `44×44 pt` (iOS) / `48×48 dp` (Android) with ≥ `8 pt/dp` separation between destructive and safe sibling actions.
- Never attach custom horizontal edge swipes inside the OS back-gesture zone (iOS left-edge swipe back, Android predictive back edges); inset horizontal carousels or provide explicit Previous/Next controls.

## Semantic haptics (restraint over noise)

Trigger haptics only to confirm physical thresholds or consequential state changes—never on every scroll tick or routine tap:

| Moment | SwiftUI | Jetpack Compose | Flutter | React Native / Expo | LynxJS |
|---|---|---|---|---|---|
| **Picker / detent snap** | `.sensoryFeedback(.selection, trigger:)` | `LocalView.current.performHapticFeedback(HapticFeedbackConstants.SEGMENT_TICK)` | `HapticFeedback.selectionClick()` | `Haptics.selectionAsync()` (`expo-haptics`) | Host native haptic module triggered at detent threshold |
| **Tactile toggle / drag lock** | `.sensoryFeedback(.impact(weight: .light), trigger:)` | `LocalHapticFeedback.current.performHapticFeedback(HapticFeedbackType.LongPress)` / `CONTEXT_CLICK` | `HapticFeedback.lightImpact()` | `Haptics.impactAsync(ImpactFeedbackStyle.Light)` | Host native light impact via MTS callback / `runOnBackground` |
| **Completed task / error** | `.sensoryFeedback(.success, trigger:)` / `.error` | `HapticFeedbackConstants.CONFIRM` / `REJECT` | `HapticFeedback.mediumImpact()` / `heavyImpact()` | `Haptics.notificationAsync(NotificationFeedbackType.Success / Error)` | Host native notification haptic on background commit |

Honor system haptic and reduced-motion preferences; degrade silently on devices without a linear resonant actuator, and never use haptics as the sole confirmation without visible/accessible feedback.

## Swipe-to-act & optimistic offline queues

- Every swipe action on a list row (archive, pin, delete) must also be reachable via row detail, context menu, or accessibility custom actions (SwiftUI `.accessibilityAction(named:)`, Compose `CustomAccessibilityAction`, Flutter `Semantics(customSemanticsActions:)`, RN `accessibilityActions`).
- Pair swipe-archive/delete with an immediate `Undo` snackbar/toast positioned above the home indicator and tab bar, staying visible long enough for assistive users to reach it.
- Queue offline mutations visibly (`Pending sync` text + icon) with idempotent replay when connectivity returns; never discard drafted forms or media on backgrounding or network drop.

## Dynamic Type / `sp` scaling reflow

- Test every screen at default size **and** accessibility-large (`200%` / `AX3+`).
- Reflow side-by-side horizontal pairs (label + value, avatar + metadata + CTA) into vertical stacks when font scale exceeds standard thresholds instead of truncating essential numbers or actions.
- Never lock list rows, pills, chips, or bottom bars to fixed pixel/point heights that clip ascenders/descenders when text scales.
