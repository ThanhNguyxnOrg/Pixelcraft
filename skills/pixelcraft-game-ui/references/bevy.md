# Bevy UI (Rust, Bevy 0.15–0.18)

## Token mapping and Required Components (Bevy 0.15+)

Bevy 0.15+ replaced legacy `*Bundle` structs (`NodeBundle`, `ButtonBundle`, `TextBundle`) and `Style` with **Required Components**: spawn `Node`, `BackgroundColor`, `BorderColor`, `Button`, `Text`, `TextFont`, and `TextColor` directly, and compose hierarchies with Bevy 0.16+ **`children![...]`** relationships. Store palette, typography, and spacing in a semantic `Resource` rather than scattering raw `Color::srgb(...)` literals across spawn sites:

```rust
use bevy::a11y::AccessibilityNode;
use bevy::picking::events::{Click, Pointer};
use bevy::prelude::*;
use bevy::ui::Val;
use accesskit::{Node as AccessibleNode, Role};

#[derive(Resource)]
struct UiTokens {
    action_bg: Color,
    action_text: Color,
    border: Color,
    font: Handle<Font>,
}

fn spawn_pause_menu(mut commands: Commands, tokens: Res<UiTokens>) {
    commands.spawn((
        Node {
            width: Val::Percent(100.0),
            height: Val::Percent(100.0),
            justify_content: JustifyContent::Center,
            align_items: AlignItems::Center,
            ..default()
        },
        children![(
            Button,
            Node {
                padding: UiRect::axes(Val::Px(24.0), Val::Px(14.0)),
                border: UiRect::all(Val::Px(2.0)),
                ..default()
            },
            BackgroundColor(tokens.action_bg),
            BorderColor(tokens.border),
            AccessibilityNode(AccessibleNode::new(Role::Button)),
            children![(
                Text::new("Resume"),
                TextFont { font: tokens.font.clone(), font_size: 22.0, ..default() },
                TextColor(tokens.action_text),
            )],
        )],
    ))
    .observe(|_trigger: Trigger<Pointer<Click>>| {
        // Bevy 0.15–0.16: Trigger<Pointer<Click>> (Bevy 0.17+: On<Pointer<Click>>)
    });
}
```

## Native `bevy_picking`, `bevy_ui_widgets`, `bevy_feathers`, and focus (0.15–0.18)

- **Native `bevy_picking` (0.15+)**: attach ECS observers (`.observe(...)` handling `Pointer<Click>`, `Pointer<Over>`, `Pointer<Out>`, `Pointer<Drag>`) directly on UI entities instead of polling `Query<&Interaction>` manually for complex pointer states. Note exact observer parameter syntax across versions (`Trigger<Pointer<Click>>` in 0.15–0.16 vs `On<Pointer<Click>>` in 0.17+).
- **`bevy_ui_widgets` (0.17–0.18)**: use Bevy's official headless widgets (buttons, sliders, checkboxes, radio groups) for pointer/keyboard activation, disabled states, and AccessKit synchronization without locking visual appearance.
- **`bevy_feathers` (0.17–0.18)**: use the opinionated themed widget suite atop `bevy_ui_widgets` for rapid settings/debug/editor tooling when custom game skinning is not needed.
- **`bevy_input_focus` & `AutoDirectionalNavigation`**: track active focus through `InputFocus` / `InputFocusVisible` resources and wire D-pad/arrow traversal via `AutoDirectionalNavigation` (or explicit `DirectionalNavigationMap` edges) so controller navigation never depends on ad-hoc index counters.
- **BSN (Bevy Scene Notation)**: treat declarative BSN syntax as experimental until stabilized in your pinned Bevy minor release; do not mix unstable BSN examples with production Required Component code.

## Layout, typography, motion, and AccessKit accessibility

- Use Taffy-backed `Node` Flexbox/Grid properties (`Display::Flex`, `Display::Grid`, `Val::Percent`/`Val::Px`/`Val::Vw`), handle `WindowResized` / `UiScale` changes, and keep HUD vs menu camera layers distinct.
- Load TTF/OTF fonts explicitly via `AssetServer`, verify CJK/RTL/Cyrillic glyph coverage (cosmic-text handles shaping in Bevy 0.15+, but fallback fonts must still be available), and test distance legibility.
- **AccessKit semantics**: construct `AccessibilityNode(accesskit::Node::new(Role::Button))` from the `accesskit` crate, populate accessible labels/checked/value states on interactive widgets, and test actual OS screen-reader output (`rendered`, or label unsupported targets `not-checked`).
- Model pause, loading, disconnect, death/respawn, and modal focus restoration cleanly with `States` / `SubStates` and explicit `DespawnOnExit`; expose reduced-motion/flash settings in game options.

## Do/don't pairs

| Do | Don't |
|---|---|
| Spawn Required Components (`Node`, `BackgroundColor`, `BorderColor`, `Text`, `TextFont`, `TextColor`) + `children![...]` | Copy legacy pre-0.15 `NodeBundle` / `ButtonBundle` / `Style` snippets |
| Use `AccessibilityNode(accesskit::Node::new(Role::Button))` and `bevy_ui_widgets` where available | Draw plain rects/text without AccessKit `Node` semantics or focus wiring |
| Wire `bevy_picking` observers and `bevy_input_focus` / `AutoDirectionalNavigation` | Build mouse-only menus or drop focus silently when despawning modal entities |
| Keep theme tokens in a `Resource` and verify `UiScale` + reduced-motion toggles | Hard-code `Color::srgb(...)` per entity or assume OS reduced motion is auto-applied |

## Known traps

Fast minor-version API shifts across 0.15 → 0.18 (`Trigger<E>` vs `On<E>`, `BorderColor::all(...)` helpers, `DespawnOnExit`), despawning the focused entity without restoring `InputFocus`, forgetting `Pickable::IGNORE` on non-interactive HUD overlays that steal clicks, and incomplete font fallback in localized builds.

## Verification commands

```sh
cargo test
cargo clippy -- -D warnings
cargo run
```

Verify resolution/aspect/`UiScale` matrix, controller-only `AutoDirectionalNavigation` traversal, AccessKit inspection on supported platforms, pause/interruption transitions, and localization glyph rendering (`rendered`).
