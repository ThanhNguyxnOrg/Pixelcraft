# Mobile tactile interactions, sheets, and gestures

Use this reference alongside the target mobile framework guide (`swiftui.md`, `uikit.md`, `jetpack-compose.md`, `flutter.md`, `react-native-expo.md`, `lynxjs.md`) for high-craft touch ergonomics, bottom sheets, gestures, haptics, offline queues, and Dynamic Type/`sp` resilience.

## Bottom sheet detents & cross-framework idioms

| Concern | Concrete rule |
|---|---|
| **Detents** | Define explicit resting heights (`medium`/`peek`, `large`, or content-fit) rather than arbitrary pixel stops; dismiss smoothly on downward velocity fling, backdrop tap, or Escape/Back. |
| **Scroll handover** | When a sheet wraps a scrollable list, upward drags scroll content once at the top detent, and downward drags at `scrollOffset == 0` hand control back to the sheet without stutter or double-scrolling. |
| **Keyboard & safe areas** | Pair scroll-coupled interactive keyboard dismissal with soft-keyboard inset tracking so sheet inputs and primary submit actions stay visible above the IME and home indicator / gesture bar. |
| **Velocity handover (`panVelocity`)** | Spring animations completing a sheet fling, card swipe, or detent snap **must** inherit the finger's release velocity (`initialVelocity` / `panVelocity`)—never restart from zero velocity on finger lift. |
| **Accessibility** | Always expose a visible Close/Done button (and screen-reader escape gesture) so users who cannot drag are never trapped inside a modal sheet. |

| Framework | Sheet & interactive keyboard primitive | Velocity handover & detent idiom |
|---|---|---|
| **SwiftUI** | `.sheet(isPresented:)` + `.scrollDismissesKeyboard(.interactively)` | `.presentationDetents([.medium, .large])`, `.presentationDragIndicator(.visible)`, `Spring(duration: 0.35, bounce: 0.1)` seeded with gesture velocity |
| **UIKit** | `UISheetPresentationController` + `scrollView.keyboardDismissMode = .interactive` | `detents = [.medium(), .large()]`, `UISpringTimingParameters(dampingRatio: 0.85, initialVelocity: velocityVector)` |
| **Jetpack Compose** | `ModalBottomSheet` + `WindowInsetsAnimationCompat` / `Modifier.imeNestedScroll()` | `rememberModalBottomSheetState()`, `Animatable.animateTo(target, spring(), initialVelocity = panVelocity)` |
| **Flutter** | `showModalBottomSheet` / `showCupertinoSheet` + `ScrollViewKeyboardDismissBehavior.onDrag` | `SpringSimulation(springDesc, currentPos, targetPos, panVelocity)` via `AnimationController.animateWith` |
| **React Native / Expo** | `@gorhom/bottom-sheet` + `keyboardDismissMode="interactive"` + `react-native-keyboard-controller` | Reanimated 4 `withSpring(target, { velocity: event.velocityY, damping: 22, stiffness: 240 })` on UI thread |
| **LynxJS** | Custom sheet `<view>` driven by MTS | Handle `main-thread:bindtouchmove` / `touchend` spring physics with release velocity on main thread; sync state via `runOnBackground` |

## Performance physics: cold start & `120fps` ProMotion (`< 8.33 ms`/frame)

- **Cold start budget**: target **`< 800 ms–1.2 s`** (hard ceiling `< 2.0 s` TTID) on mid-tier hardware via Android **Baseline Profiles** (`androidx.profileinstaller`), lazy TurboModules, and deferring non-essential analytics/attribution SDK boot until after first interactive frame.
- **`120fps` ProMotion & high-refresh parity**: unlock `120 Hz` animations on iOS by setting `<key>CADisableMinimumFrameDurationOnPhone</key><true/>` in `Info.plist`, and keep all scroll, sheet, shared-element, and keyboard-tracking animations strictly on the native UI/Render/Impeller thread (`< 8.33 ms` frame budget)—never couple scroll or pan frames to JS-bridge round-trips or main-thread JSON parsing.

## Thumb-zone ergonomics & gesture conflict avoidance

- Place high-frequency navigation and primary commitment actions in the lower reachable third on tall phones, reserving top bars for orientation, back navigation, and secondary overflow actions.
- Keep touch targets ≥ `44×44 pt` (iOS) / `48×48 dp` (Android) with ≥ `8 pt/dp` separation between destructive and safe sibling actions.
- Never attach custom horizontal edge swipes inside the OS back-gesture zone (iOS left-edge swipe back, Android predictive back edges); inset horizontal carousels or provide explicit Previous/Next controls.

## 4-tier contextual haptics (restraint over noise)

Trigger haptics strictly across four semantic tiers—**never** buzz on routine button taps, tab switches, or list scrolling:

| Tier & moment | SwiftUI | Jetpack Compose | Flutter | React Native / Expo | LynxJS |
|---|---|---|---|---|---|
| **1. Light selection tick** (wheel, scrub, detent snap) | `.sensoryFeedback(.selection, trigger:)` | `performHapticFeedback(HapticFeedbackConstants.SEGMENT_TICK)` | `HapticFeedback.selectionClick()` | `Haptics.selectionAsync()` (`expo-haptics`) | Host native selection tick at threshold |
| **2. Crisp state toggle** (switch flip, pin/lock, long-press) | `.sensoryFeedback(.impact(weight: .light), trigger:)` | `HapticFeedbackConstants.CLOCK_TICK` / `CONTEXT_CLICK` | `HapticFeedback.lightImpact()` | `Haptics.impactAsync(ImpactFeedbackStyle.Light)` | Host native light impact via MTS |
| **3. Success confirmation** (payment settled, check-in done) | `.sensoryFeedback(.success, trigger:)` | `HapticFeedbackConstants.CONFIRM` | `HapticFeedback.mediumImpact()` | `Haptics.notificationAsync(NotificationFeedbackType.Success)` | Host native confirm notification |
| **4. Warning / error double-tap** (invalid code, hard limit, failed scan) | `.sensoryFeedback(.warning / .error, trigger:)` | `HapticFeedbackConstants.REJECT` | `HapticFeedback.vibrate()` / distinct double `heavyImpact()` | `Haptics.notificationAsync(NotificationFeedbackType.Warning / Error)` | Host native reject double-pulse |

Honor system haptic and reduced-motion preferences; degrade silently on hardware without a linear resonant actuator, and never use haptics as the sole confirmation without visible/accessible feedback.

## Swipe-to-act, OS process-death restoration & production stability

- Every swipe action on a list row (archive, pin, delete) must also be reachable via row detail, context menu, or accessibility custom actions (SwiftUI `.accessibilityAction(named:)`, Compose `CustomAccessibilityAction`, Flutter `Semantics(customSemanticsActions:)`, RN `accessibilityActions`), paired with an immediate `Undo` snackbar above the home indicator / tab bar.
- **Survive OS background process death**: mobile OSes routinely evict backgrounded apps under camera/game RAM pressure. Test explicitly with `adb shell am kill <package>` (while backgrounded) and Xcode background termination—restoring route stack, selected entity IDs, scroll context, and dirty form drafts via `SavedStateHandle` + `rememberSaveable`, `@SceneStorage` / SwiftData, `NSUserActivity`, `RestorationMixin`, or persisted router state.
- **Offline mutation queue & crash-free bar**: persist queued offline writes with visible `Pending sync` + retry/conflict UI; maintain **`>= 99.5%` crash-free sessions** and **`0` ANRs** backed by automated CI uploads of iOS **dSYMs** and Android **R8/ProGuard mappings + NDK symbols**.
- **Real-device & Dynamic Type QA matrix**: verify at default and **`200%` (`AX3+`)** font scales (reflowing horizontal pairs into vertical stacks without fixed-height clipping) across **`>= 2` physical iOS devices** and **`>= 3` physical Android devices** spanning Pixel + OEM skins (Samsung One UI, Xiaomi HyperOS / OPPO ColorOS) with both **VoiceOver** and **TalkBack**.
