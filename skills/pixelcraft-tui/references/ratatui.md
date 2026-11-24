# Ratatui (Rust, 0.28–0.30+)

## Lifecycle & panic-safe teardown (`ratatui::run` / `init` + `restore`)

Never leave a user's terminal trapped in raw mode or the alternate screen after an error or panic. On Ratatui 0.28+, use **`ratatui::init()`** paired with **`ratatui::restore()`** (or **`ratatui::run(|terminal| ...)`** on 0.30+), which automatically installs a panic hook that restores terminal state before printing the panic payload:

```rust
use ratatui::{
    layout::{Constraint, Flex, Layout},
    style::{Color, Modifier, Style},
    DefaultTerminal, Frame,
};

pub struct PcTheme {
    pub action: Style,
    pub error: Style,
    pub focused: Style,
}

impl Default for PcTheme {
    fn default() -> Self {
        Self {
            action: Style::default().fg(Color::Cyan).add_modifier(Modifier::BOLD),
            error: Style::default().fg(Color::Red).add_modifier(Modifier::BOLD),
            focused: Style::default().fg(Color::Yellow).add_modifier(Modifier::REVERSED),
        }
    }
}

fn main() -> color_eyre::Result<()> {
    ratatui::run(|terminal: &mut DefaultTerminal| app_loop(terminal))
}
```

## Token mapping & terminal capability respect

Define semantic `Style` / `Color` fields in one theme struct (defaulting to ANSI 16 named colors or mapping down cleanly when `NO_COLOR` is set or `COLORTERM` is absent) instead of scattering `Color::Rgb(...)` literals across widgets. Respect light and dark terminal backgrounds by avoiding hard-coded dark-only `Color::White` text over default terminal backgrounds—prefer `Color::Reset` for standard foreground/background cells.

## Layout (`Constraint::Fill` / `Flex`) & ecosystem crates

- Derive layout every frame from `frame.area()` using **`Constraint::Fill(weight)`**, `Constraint::Length`, `Constraint::Min`, `Constraint::Max`, and **`Flex`** (`Flex::SpaceBetween`, `Flex::Center`, `Flex::Start`, `Flex::Legacy`) instead of error-prone percentage math that leaves 1-cell gaps:

```rust
let [header, body, footer] = Layout::vertical([
    Constraint::Length(2),
    Constraint::Fill(1),
    Constraint::Length(1),
])
.flex(Flex::Legacy)
.areas(frame.area());
```

- **Images in terminal cells (`ratatui-image`)**: use `ratatui-image` when displaying previews/thumbnails—it automatically probes and renders via Kitty Graphics, Sixel, iTerm2 inline images, or Unicode halfblock (`▀`/`▄`) fallback without crashing unsupported terminals.
- **Multi-line text input (`tui-textarea` / `edtui`)**: reuse mature editing crates for cursor movement, selection, undo/redo, and paste rather than hand-rolling byte-offset UTF-8 string slicing (which panics on multi-byte Unicode/CJK graphemes).

## Typography, motion, accessibility, & states idioms

Terminals control fonts—communicate hierarchy with `Modifier::BOLD`, `DIM`, `UNDERLINED`, `REVERSED`, alignment, and borders. Always measure printable display width via `unicode-width` (`Line::width()`) rather than `.len()`.

Keep event polling (`crossterm::event::poll`) and tick intervals bounded so idle TUIs consume near-zero CPU. Manage async backend work on Tokio channels with explicit request IDs and cancellation (`CancellationToken`) so stale results never overwrite newer selections. Render explicit loading, empty, error, offline, and narrow-terminal fallback views into buffers—never leave blank black panes.

Include plain-text state markers (`>`, `[x]`, `[ERR]`) alongside color, position the real terminal cursor (`frame.set_cursor_position(...)`) inside focused text inputs for assistive tools/IME, and expose non-interactive CLI flags (`--json`, `--plain`) when stdout is not a TTY.

## Snapshot & buffer verification (`TestBackend` + `insta`)

Test layout, narrow `80×24` collapse behavior, focus markers, and error states deterministically with **`TestBackend::new(width, height)`** and **`insta`** snapshots:

```rust
#[test]
fn renders_cleanly_at_80x24() {
    let mut terminal = ratatui::Terminal::new(ratatui::backend::TestBackend::new(80, 24)).unwrap();
    terminal.draw(|f| draw_ui(f, &App::sample())).unwrap();
    insta::assert_snapshot!(terminal.backend());
}
```

## Do/don't pairs

| Do | Don't |
|---|---|
| Use `ratatui::run(...)` or `ratatui::init()` + `ratatui::restore()` | Manual raw-mode setup with no panic hook leaving user shells broken |
| Use `Constraint::Fill` + `Flex` derived from `frame.area()` | Hard-code `120×40` coordinates or fragile `Percentage` sums |
| Centralize semantic `PcTheme` using ANSI/Reset-safe fallbacks | Scatter `Color::Rgb(255, 255, 255)` unreadable on light terminals |
| Use `tui-textarea` / `unicode-width` and `ratatui-image` | Slice UTF-8 strings by byte index or emit unprobed Sixel bytes |
| Verify buffers across `80×24` and wide sizes with `TestBackend` + `insta` | Rely solely on `cargo build` or one wide manual glance |

## Known traps

Byte-index string slicing panicking on UTF-8/emoji/CJK characters, forgetting `ratatui::init`/`run` leaving terminals corrupted after panics, hard-coding `Color::White` on light-background terminals, spinning a 0ms event loop burning 100% CPU, emitting alt-screen control codes when piped to `grep`/`jq`, stale async task messages overwriting active UI state.

## Verification commands

```sh
cargo test
cargo clippy --all-targets -- -D warnings
cargo run
# Interactive snapshot review (only when snapshots changed intentionally):
# cargo insta review
# Verify non-TTY / NO_COLOR handling:
NO_COLOR=1 cargo run -- --help
```

`cargo test` (`TestBackend` / `insta` snapshots) and `cargo clippy` provide `static` and deterministic buffer evidence. Run the compiled binary in real dark and light terminals at `80×24`, `NO_COLOR=1`, `TERM=dumb`, and panic/interrupt recovery paths for `rendered` evidence; label untested emulators `not-checked`.
