# Electron

## Token mapping

Use generated CSS variables in renderer UI. Main-process/native UI such as tray icons/menus/dialogs may need parallel semantic constants or native system colors. Avoid shipping secrets/platform logic into renderer merely to synchronize visuals.

## Layout and responsive idioms

Treat the BrowserWindow as desktop chrome: minimum/default size, resize/maximize/fullscreen, restore bounds, zoom factor, display DPI/movement, multi-window behavior, native vs frameless chrome. Renderer responsive CSS does not solve window/menu integration.

## Typography/custom fonts

Use web font loading with offline packaging/fallback expectations. Respect zoom/text scaling/high-DPI. Font behavior can differ across OS graphics stacks; inspect target OS rather than assuming Chromium sameness.

## Motion/reduced motion

Use CSS `prefers-reduced-motion` and verify Chromium receives the platform setting. Keep UI animation nonblocking and avoid expensive GPU/effects in large windows. Do not animate window chrome manipulation unless native/intentional.

## Accessibility specifics

Renderer semantics are necessary but not sufficient. Menus, shortcuts, tray, native dialogs, notifications, touch bar/dock/taskbar integration, screen reader/focus behavior across window boundaries, keyboard-only navigation, and custom titlebar controls require OS-level verification.

## States idiom

Model renderer state plus main-process state: startup failure, backend IPC errors, update/restart, offline, file permissions, crash recovery, second instance/deep link, background/tray, power suspend/resume. Preserve dirty document state before close.

## Forms idiom

Use standard web form practices in renderer. Validate clipboard/paste/password manager/autofill behavior in actual Electron runtime; do not block paste. File pickers/security permissions and drag/drop need explicit error recovery.

## Do/don't pairs

| Do | Don't |
|---|---|
| explicit IPC error/timeout state in renderer | renderer hanging forever when main process fails |
| native menu/shortcut equivalents for key commands | web-only shortcuts invisible to desktop users |
| accessible custom titlebar buttons/drag regions | frameless window with no reliable way to move/close |
| secure context isolation/preload boundary | exposing broad Node APIs to renderer for convenience |
| preserve unsaved state across close/crash | treating close as harmless navigation |

## Known traps

Security boundary shortcuts, main/renderer state divergence, memory/resource use, custom chrome accessibility, auto-updater interruption, multi-monitor DPI change, window restore invalid coordinates, keyboard shortcut conflicts, deep-link/second-instance cold start, blurry assets at scaling.

## Verification commands

```sh
npm run lint
npm run test -- --run
npm run build
npm start
```

Use real OS/window-manager testing, keyboard/screen reader inspection, resize/DPI/multi-window matrices, packaged-app smoke tests, and crash/close/update flows for evidence.
