# GTK / libadwaita

## Token mapping

Use GTK CSS/custom properties where supported plus named colors/styles in resource/theme files. libadwaita semantic colors/style classes should be preferred over hard-coded colors because they integrate with dark/high-contrast/platform behavior. Map generated values once into theme constants/CSS.

## Layout and responsive idioms

Use GTK boxes/grid/panes/adaptive layout widgets and libadwaita breakpoint/adaptive containers where applicable. Handle resizing/minimum width, tiling/window manager behavior, header bar/content hierarchy, menus/shortcuts, high-DPI scaling, and desktop environment differences without assuming one chrome shape.

## Typography/custom fonts

Use system font settings/Pango text layout and semantic style classes. Custom fonts require correct resource registration/fallback. Pango markup must escape user content. Verify text scaling, line breaking, ellipsization, CJK/RTL shaping, and localization expansion.

## Motion/reduced motion

Use GTK/libadwaita animations sparingly and honor system reduced-animation settings where exposed by toolkit/platform. Never make progress/state depend solely on animation. Keep window resizing/interaction responsive.

## Accessibility specifics

Use accessible names/descriptions/roles where exposed, mnemonic/keyboard shortcuts, focus chain, standard controls, high-contrast theme behavior, screen reader (orca) verification, keyboard-only navigation, and AT-SPI-compatible custom widget behavior. Do not strip focus styling.

## States idiom

Model loading/error/empty/offline/permission/dirty file state explicitly. Long operations need cancellable async/task behavior that does not block the main loop. Window close/delete-event semantics, lock screen/suspend, file monitor/external modification, and multi-window state are desktop UX.

## Forms idiom

Use labeled entries/combos/checks/switches, validation timing and visible recovery copy, focus/mnemonic order, paste/IME behavior, and input preservation. Placeholder text is not a persistent label substitute in dense forms.

## Do/don't pairs

| Do | Don't |
|---|---|
| semantic style classes/named colors | hard-coded colors that break dark/high contrast |
| adaptive containers/breakpoints where appropriate | fixed desktop-width window pasted into tiling/mobile-like contexts |
| cancellable async operation with visible progress | blocking GTK main loop during long work |
| standard accessible controls/labels | custom-drawn controls with no AT-SPI exposure |
| explicit close/dirty document behavior | treating window close as harmless navigation |

## Known traps

Blocking main loop, theme/CSS specificity surprises, focus/mnemonic conflicts, adaptive layout assumptions, distro/desktop variation, dark/high-contrast breakage, window manager differences, custom widgets missing AT-SPI behavior, text shaping/ellipsis localization errors.

## Verification commands

```sh
meson test 2>/dev/null || true
cargo test 2>/dev/null || true
python -m pytest 2>/dev/null || true
./your-app 2>/dev/null || true
```

Use actual GNOME/Linux environment inspection where relevant, orca/keyboard-only tests, resize/tiling/high-DPI checks, dark/high contrast themes, and window close/async cancellation evidence.
