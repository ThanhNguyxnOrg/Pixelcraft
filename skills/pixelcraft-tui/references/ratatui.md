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

## Grapheme width (`UAX #29`), Bracketed Paste, `OSC 52` & 6-step teardown

- **Grapheme-cluster column width**: never use `str::len()` or `chars().count()` for cell alignment or cursor slicing. Segment text with **`unicode-segmentation`** (`s.graphemes(true)`) and compute column width with **`unicode-width`** (`UnicodeWidthStr::width`) so CJK (`2` cols), ZWJ emoji (`👨‍👩‍👧‍👦` = `2` cols), `VS16` (`⚠️` = `2` cols), and Vietnamese combining diacritics (`0` extra cols) never corrupt box borders; switch to `ratatui::symbols::border::ASCII` (`+--+`) when `--ascii`, `TERM=dumb`, or non-UTF-8 locale is active.
- **Bracketed Paste (`DECSET 2004`) & `OSC 52` clipboard**: enable `crossterm::event::EnableBracketedPaste` (`Event::Paste(String)`) so multi-line pastes into inputs never fire `KeyCode::Enter` per line; support copying via `arboard` locally plus **`OSC 52`** (`crossterm::clipboard::CopyToClipboard`) over SSH/`tmux`.
- **Complete 6-step panic & signal restoration**: whenever enabling mouse capture, bracketed paste, synchronized updates, or Kitty keyboard enhancement alongside `ratatui::init()`, ensure your `Drop` guard + panic hook + `tokio::signal` (`SIGINT`, `SIGTERM`, `SIGHUP`) handler executes all 6 steps ([terminal-protocols.md](terminal-protocols.md)): `?1049l` (leave alt screen), `?1000l/?1002l/?1003l/?1006l` (disable mouse), `?2004l` (disable bracketed paste), `?2026l` (end sync output), `\x1b[<u` (pop Kitty keyboard flags), and `?25h` + `disable_raw_mode()`.
- **Stream hygiene, `BrokenPipe`, & CLI packaging**: write TUI/spinners to `stderr` (or alt-screen only when `std::io::stdout().is_terminal()`), emit `--json`/`--plain` strictly to `stdout` while catching **`io::ErrorKind::BrokenPipe`** (`exit(0)` silently on `| head -n 5` instead of `.unwrap()` panicking!), use semantic exit codes (`0`, `1`, `2`, `130`), and generate `bash`/`zsh`/`fish`/`pwsh` completions + `man` pages via **`clap_complete`** and **`clap_mangen`** (`cargo-dist` / Homebrew / Winget / Scoop / Cargo).

Keep event polling (`crossterm::event::poll`) and tick intervals bounded so idle TUIs consume near-zero CPU. Manage async backend work on Tokio channels with explicit request IDs and cancellation (`CancellationToken`) so stale results never overwrite newer selections. Render explicit loading, empty, error, offline, and narrow-terminal fallback views into buffers—never leave blank black panes, and position the real terminal cursor (`frame.set_cursor_position(...)`) inside focused text inputs for assistive tools/IME.

## Snapshot & buffer verification (`TestBackend` + `insta`)

Test layout, narrow `80×24` collapse behavior, CJK/ZWJ/Vietnamese grapheme alignment, focus markers, and error states deterministically with **`TestBackend::new(width, height)`** and **`insta`** snapshots:

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
| Run `ratatui::run`/`restore` + full 6-step teardown (`?2004l`, `?1003l`, `\x1b[<u`) on panic & signals | Manual raw-mode setup leaving mouse capture, bracketed paste, or `CSI u` stuck after crashes |
| Measure/slice via `unicode-segmentation` + `unicode-width` + `border::ASCII` fallback | Slice UTF-8 strings by byte index or use `.len()` on CJK / `👨‍👩‍👧‍👦` / Vietnamese text |
| Enable `EnableBracketedPaste` (`Event::Paste`) and `OSC 52` SSH clipboard | Treat pasted newlines as accidental `Enter` confirmations |
| Catch `ErrorKind::BrokenPipe` on `--json`/`--plain` `stdout` writes and ship `clap_complete` + `man` pages | `.unwrap()` `writeln!(stdout)` so `mycli --plain \| head -n 5` panics with a backtrace |
| Centralize semantic `PcTheme` using `Color::Reset` + ANSI 16 dark/light-safe roles | Scatter `Color::Rgb(255, 255, 255)` unreadable on light terminals |
| Verify buffers across `80×24` and wide sizes with `TestBackend` + `insta` | Rely solely on `cargo build` or one wide manual glance |

## Known traps

Byte-index string slicing panicking on UTF-8/emoji/CJK/Vietnamese characters, forgetting `DisableBracketedPaste` / `PopKeyboardEnhancementFlags` on panic, `.unwrap()` panicking on `SIGPIPE`/`BrokenPipe`, hard-coding `Color::White` on light-background terminals, spinning a 0ms event loop burning 100% CPU, emitting alt-screen control codes when piped to `grep`/`jq`.

## Verification commands

```sh
cargo test
cargo clippy --all-targets -- -D warnings
NO_COLOR=1 cargo run -- --help
cargo run -- --plain | head -n 5
```

`cargo test` (`TestBackend` / `insta` snapshots) and `cargo clippy` provide `static` and deterministic buffer evidence. Run the compiled binary in real dark and light terminals at `80×24`, `NO_COLOR=1`, `TERM=dumb`, `--ascii`, multi-line paste, and panic/interrupt recovery paths for `rendered` evidence; label untested emulators `not-checked`.
