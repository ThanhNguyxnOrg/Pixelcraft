# Ratatui

Evidence: Ratatui docs describe `TestBackend::new(width, height)` for integration testing and official recipes use `insta` snapshots of terminal output.

## Token mapping

Define semantic `Style`/`Color` constants or theme structs centrally:

```rust
pub struct PcTheme { pub action: Color, pub error: Color }
```

Use semantic fields rather than raw colors in widgets. Respect terminal color capability; do not assume truecolor. Ratatui itself does not impose a token pipeline—ownership is yours.

## Layout and responsive idioms

Use `Layout` constraints/direction/margins/splitting deliberately. Compute layout from current terminal area each frame; handle resize/minimum size/truncation/wrap/scroll state. Character-cell alignment, scanlines, density, and pane priority are explicit design decisions.

## Typography/custom fonts

Terminals control fonts. Use modifier flags (`BOLD`, `DIM`, `UNDERLINED`, `REVERSED`) and semantic color/sparse symbols. Unicode width requires width-aware handling; CJK/emoji/box glyphs may not occupy the width you expect.

## Motion/reduced motion

Animation is manual frame/tick state. Keep redraw frequency bounded and purposeful. Provide quiet/reduced-motion flags where relevant; terminal platforms lack a uniform hook. Do not flash or continuously repaint decorative noise.

## Accessibility specifics

Keyboard-first input/event model, visible focus/selection, plain text state equivalents, no color-only meaning, Unicode/NO_COLOR fallback, cursor visibility/position control, escape/cancel behavior, and careful alternate-screen vs scrollback choice. Screen-reader behavior varies and must not be overstated.

## States idiom

Use explicit application state/event ownership. Async/backend work requires channels/tasks with cancellation/timeout/stale-result handling. Render loading/error/empty/offline/permission/concurrency states into buffers rather than leaving blank panes. Preserve input/focus/scroll in app state across resize.

## Forms idiom

Implement or reuse input widgets deliberately: cursor/selection/IME constraints are hard. Validate input timing, preserve values, expose errors textually, support paste/editing keys realistically, and provide noninteractive flags where automation matters.

## Do/don't pairs

| Do | Don't |
|---|---|
| central semantic theme struct | raw `Color::Rgb` scattered through widgets |
| derive layout each frame from terminal area | fixed 120×40 assumptions |
| explicit async stale/cancel handling | backend result overwriting newer user state |
| text marker plus style for selection | color-only selection invisible/monochrome |
| `TestBackend`/buffer tests for critical views | visual QA only by occasional manual run |

## Known traps

Unicode width errors, terminal capability mismatch, high-frequency event/render loops, stale async responses, panic leaving terminal in raw/alternate mode, scrollback/alt-screen misuse, focus/input ownership complexity, incomplete custom text editing/IME behavior.

## Verification commands

```sh
cargo test
cargo insta review 2>/dev/null || true
cargo clippy -- -D warnings 2>/dev/null || true
cargo run
```

Use `TestBackend`/`insta` snapshots, actual terminal runs at multiple sizes, panic/cleanup behavior, piped/non-TTY modes where relevant, keyboard-driven tests, NO_COLOR/color matrices, and interrupt/cancellation checks.
