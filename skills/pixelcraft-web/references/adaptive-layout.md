# Adaptive web interfaces

Design the task for available space and input, not for a device name. Decide in the plan where navigation, order, density and controls actually need a different composition. Preserve the same destinations, meaningful information, task outcomes and state. Share behavior and data across presentations; avoid duplicate focusable controls and loss of form inputs, selection or focus when crossing a breakpoint.

## Representative size and input classes

Use these as starting CSS viewport sizes, not prescribed breakpoints. Check just below and above meaningful layout changes and resize between classes, not only at preset widths. Combine cases only if the resulting coverage exercises each constraint; document scope that cannot be tested.

| Class | Example width × height | Task constraint to check |
|---|---|---|
| Small / large phone portrait | 320×640 / 430×932 | One-handed reach, touch targets, no hover dependency, long labels and soft keyboard. |
| Phone landscape | 844×390 | Safe insets, short dialogs, keyboard/scroll recovery, primary action stays reachable. |
| Tablet portrait / landscape | 768×1024 / 1024×768 | Touch and attached keyboard/pointer; panes that adapt without losing current selection. |
| Foldable / split pane | Host pane sizes before and after change | Avoid a hinge or constrained pane when relevant; retain progress when resized or folded. |
| Laptop / desktop | 1280×720 / 1440×900 | Keep scan efficiency, pointer actions and all keyboard/focus paths; avoid hiding important actions in hover alone. |
| Ultrawide | 2560×1080 | Constrain reading measure and control travel without stretching unrelated content. |
| Short-height window | 1280×480 | Reachable focused fields and dialogs despite sticky bars and reduced vertical space. |

## Implementation

- Use fluid Grid/Flex, intrinsic sizing and logical properties. Use container queries for components reused in panels of different widths; reserve viewport queries for shell changes, including height and aspect-ratio constraints where needed.
- Consider a wide sidebar versus a compact tab bar or sheet, a table versus a summary list with details, and denser desktop controls versus touch targets. Choose only patterns that fit the task. Preserve actual table semantics or a usable comparison view when the task requires comparing rows/columns; do not remove fields to avoid reflow.
- Match affordances to keyboard, pointer and touch; use hover as enhancement, not the sole way to reveal an action. Test mixed-input devices and preserve Tab order and focus across presentation changes.
- Handle mobile browser chrome with supported dynamic viewport units (for example `dvh` for an available-height layout) and a compatible fallback; treat on-screen keyboard occlusion as a separate runtime check. Use safe-area insets as applicable and make constrained regions scroll rather than clipping or locking the whole page. Verify the control that has focus can still be reached visually.
- Test the actual primary task in each distinct layout. Check touch, mouse and keyboard where relevant; include long content/text scaling, keyboard-open state for forms, and orientation/resize mid-task. Label an emulated browser viewport separately from touch hardware, hinge or browser-chrome evidence.
