# Tauri

## Token mapping

Use generated CSS variables inside the webview exactly as web UI, but treat desktop shell colors/titlebar/menu behavior as separate integration. Rust/backend configuration may need matching semantic constants for native menus/tray/notifications; generate or mirror them deliberately rather than copying random hex strings.

## Layout and responsive idioms

Design browser layout plus window behavior: minimum width/height, resizing/maximized/fullscreen, split panes, DPI changes, multi-window state, custom/native titlebar decision. `tauri.conf.json` controls capabilities/windows only at configuration level; actual UX must handle runtime resize and restore.

## Typography/custom fonts

Use web font loading inside the webview, but package/license/fallback behavior must work offline where desktop expectations demand it. System font stacks are often appropriate for native feel. Verify text scaling/zoom behavior and high-DPI rendering.

## Motion/reduced motion

Use CSS/JS motion honoring `prefers-reduced-motion` in the webview. Desktop platform settings may not propagate identically in every runtime/version; verify actual webview behavior. Avoid animation that blocks window manipulation/input.

## Accessibility specifics

Web accessibility remains necessary but insufficient. Menus, tray icons, shortcuts, notifications, dialogs, file associations, custom titlebar controls, drag regions, and multi-window focus need platform verification. Use native dialogs/menu APIs where appropriate.

## States idiom

Model web content state plus desktop process state: backend availability/startup failure, updater status, file permission, deep link/file open cold start, offline state, background/tray mode, second instance, crash/restart. Preserve unsaved work before close.

## Forms idiom

Use web form rules inside the webview; integrate native file pickers/autofill limitations/clipboard behavior honestly. Validate input preservation across window close/minimize/reload/deep-link flows.

## Do/don't pairs

| Do | Don't |
|---|---|
| explicit drag region plus accessible window controls in custom chrome | invisible/half-working custom titlebar |
| backend startup/permission error surface | blank webview when Rust initialization fails |
| native menu/shortcut registration and display | browser-only hidden shortcuts with no desktop discovery |
| preserve unsaved document state on close | treating window close like browser tab refresh |
| test narrow/minimum window and high DPI | validating only fullscreen developer monitor layout |

## Known traps

Custom titlebar drag/double-click/system menu omissions, CSP/asset loading, webview version differences, updater/restart state, permissions/capability misconfiguration, tray lifecycle, multi-window focus leakage, file association/deep-link cold start, confusing dev/prod backend behavior.

## Verification commands

```sh
npm run build
cargo test --manifest-path src-tauri/Cargo.toml
cargo tauri dev
cargo tauri build
```

Use real OS runs for window/menu/shortcut/high-DPI evidence; browser-only inspection is inner-webview evidence only.
