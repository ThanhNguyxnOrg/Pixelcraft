# Bevy UI (Rust)

## Token mapping

Use semantic Rust constants/resources/components for theme values and shared styles. Current Bevy UI uses ECS nodes/components; avoid raw repeated colors/fonts. Coordinate game-art color grading with UI token intent.

## Layout and responsive idioms

Use `Node` layout properties/flex-like behavior, explicit hierarchy, camera/render-target scale, aspect/resolution changes, safe margins, HUD versus menu/world-space ownership. Verify resizing/window scaling rather than static editor assumptions.

## Typography/custom fonts

Load font assets explicitly; validate glyph coverage/localization, scaling, bitmap/vector rendering, texture atlas behavior. Text size/readability at gameplay distance is a design constraint, not a default.

## Motion/reduced motion

Implement animation through systems/timers/tweens deliberately. Expose reduced-motion/flash-reduction options, handle pause/cancellation/interruption, and never make critical state dependent on animation completion.

## Accessibility specifics

Bevy integrates AccessKit-oriented accessibility infrastructure in current versions; examples use `bevy::a11y::AccessibilityNode` with `accesskit::Role`. Add semantic nodes/roles/labels for custom UI and verify actual platform adapters/version support. ECS rendering does not automatically create usable focus/screen-reader behavior.

## States idiom

Use explicit ECS states/resources/events for loading/menu/pause/error/death/network/empty inventory/settings/remap/interruption. Model focus ownership and restoration after popups/scene/state transitions.

## Forms idiom

Text input is low-level/custom unless using mature widgets/plugins. Validate keyboard focus, selection/caret/clipboard/IME behavior, remapping conflicts, virtual keyboard needs, validation timing, and recovery before using it for consequential input.

## Do/don't pairs

| Do | Don't |
|---|---|
| `AccessibilityNode(Accessible::new(Role::Button))` where custom semantics are needed | drawing text/rectangles and calling it a button |
| explicit state machine/menu focus ownership | focus disappearing after entity despawn |
| semantic theme resource | raw color constants in every spawn bundle |
| reduced flash/motion gameplay setting | assuming engine automatically honors OS settings |

## Known traps

Rapid API churn/version mismatch, entity despawn focus loss, accessibility adapter gaps, font glyph omissions, scaling/render-target mismatch, ECS event ordering bugs, custom input complexity.

## Verification commands

```sh
cargo test
cargo clippy -- -D warnings
cargo run
```

Run resolution/aspect/input matrix, keyboard/controller-only flow, actual accessibility tooling where supported, pause/interruption/resume, localization/glyph tests, screenshots/device targets.
