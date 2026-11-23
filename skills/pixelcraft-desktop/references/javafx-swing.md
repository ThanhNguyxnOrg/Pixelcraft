# Java desktop: JavaFX and Swing

## Token mapping

JavaFX: map tokens to semantic CSS variables/rules in application stylesheets and themed control classes. Swing: centralize colors/fonts/insets in UI constants/Look-and-Feel defaults; avoid raw literals per component. Do not force JavaFX web-like styling onto native Swing conventions.

## Layout and responsive idioms

JavaFX uses scene-graph layout panes, constraints, responsive resizing, FXML/controller separation where appropriate. Swing uses layout managers—never absolute pixel layout. Handle minimum window size, DPI scaling, split panes, resize persistence, monitor changes.

## Typography/custom fonts

Register bundled font files explicitly; verify fallback/glyphs, fractional DPI scaling, platform text settings, localization expansion. Do not hard-code pixel font metrics into preferred sizes.

## Motion/reduced motion

JavaFX Timeline/Transition and Swing Timer need lifecycle/cancellation and reduced-motion application setting because desktop OS preference integration varies. Animation must not block EDT/UI thread or correctness.

## Accessibility specifics

JavaFX exposes `AccessibleRole`, `accessibleText`, and native accessibility integration for built-in controls; custom nodes must set role/text explicitly. Swing uses `AccessibleContext`/accessible names/descriptions. Keyboard focus traversal, mnemonic conflicts, high contrast, and screen readers require real OS testing.

## States idiom

Background work belongs off the UI thread with progress/cancel/error/offline/permission states. Preserve dirty document state on close/crash/update. Model empty/loading/partial/concurrent editing explicitly.

## Forms idiom

Use labeled controls, correct focus order, validation timing, input preservation, clipboard/paste/IME behavior, keyboard mnemonics/accelerators, and recoverable error copy. Never validate modally on every keystroke.

## Do/don't pairs

| Do | Don't |
|---|---|
| JavaFX `node.setAccessibleText("Save invoice")` | custom clickable Pane without role/text |
| Swing layout managers | `setBounds` pixel layout |
| background worker with cancellation | blocking EDT/UI thread during load |
| semantic stylesheet tokens | scattered inline `-fx-background-color` |

## Known traps

EDT/UI-thread blocking, memory leaks in listeners, DPI scaling blur, custom control accessibility gaps, native packaging/runtime module issues, shortcut conflicts, FXML/controller drift, Look-and-Feel inconsistency.

## Verification commands

```sh
./mvnw verify
./gradlew test build
./gradlew run
```

Inspect actual Windows/macOS/Linux windows, resize/DPI/multi-monitor behavior, keyboard-only flow, Narrator/VoiceOver/or platform screen reader where required, crash/dirty-close recovery.
