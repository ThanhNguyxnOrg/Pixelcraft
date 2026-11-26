# Terminal protocols & capability detection

Modern terminal emulators (Ghostty, Kitty, WezTerm, Alacritty, iTerm2, Windows Terminal, foot) support rich protocols that eliminate flicker, unlock crisp keyboard shortcuts, and enable graphics and clipboard integration over SSH. Every protocol is **progressive enhancement**—never assume universal emulator or multiplexer (`tmux`/`screen`) support.

## Modern terminal protocols

| Protocol | Sequence / contract | Purpose | Mandatory fallback & safety rule |
|---|---|---|---|
| **DEC Mode 2004** (Bracketed Paste) | Enable: `ESC [ ? 2004 h` · Disable: `ESC [ ? 2004 l` · Paste payload wrapped in `ESC [ 200 ~ ... ESC [ 201 ~` | Distinguishes pasted multi-line text from typed keystrokes. | **Mandatory** whenever reading raw/interactive input so pasting multi-line configs/SQL/commands never fires each newline as an accidental `Enter` submit! Always disable (`?2004l`) on exit. |
| **DEC Mode 2026** (Synchronized Output) | Begin: `ESC [ ? 2026 h` · End: `ESC [ ? 2026 l` (query via DECRQM `ESC [ ? 2026 $ p`) | Batches screen updates atomically so the terminal renders one complete frame with zero mid-frame tearing/flicker. | Safely ignored by older terminals; **always** emit `ESC [ ? 2026 l` on exit/panic so terminals never freeze waiting for end-of-frame. |
| **Graphics Protocols** (Kitty / Sixel / iTerm2) | Kitty `APC G ... ST` · Sixel `DCS q ... ST` · iTerm2 `OSC 1337 ; File=... BEL/ST` | Renders crisp thumbnails, charts, or previews inside character cells. | Probe support (or use `ratatui-image` / Chafa-style detection); degrade cleanly to **Unicode halfblocks (`▀`/`▄`)**, Braille, or an explicit text placeholder (`[Image: diagram.png]`) inside unsupported terminals or un-configured `tmux`/SSH. |
| **OSC 8 Hyperlinks** | `OSC 8 ; params ; URI ST label OSC 8 ; ; ST` | Makes labels clickable links in supporting terminals without cluttering narrow columns. | Never hide essential URLs behind `"click here"`—keep link text self-explanatory or print the raw URL in plain/`!isatty` output so piped logs and non-OSC-8 terminals still have the destination. |
| **Kitty Keyboard Protocol (`CSI u`)** | Push flags: `ESC [ > flags u` · Pop on exit: `ESC [ < u` | Disambiguates `Ctrl+I` vs `Tab`, `Ctrl+M` vs `Enter`, `Ctrl+[` vs `Esc`, `Shift+Enter`, and key release/repeat events. | Negotiate cleanly and **always pop (`ESC [ < u`) on exit/panic**; maintain legacy ANSI keybinding fallbacks so users on older terminals or basic SSH sessions can complete every task. |
| **OSC 52 Clipboard** | `OSC 52 ; c ; <base64-utf8> ST` | Copies text directly to the user's local clipboard even across remote SSH and `tmux` (`set-clipboard on`) without `pbcopy`/`xclip`/`wl-copy`. | Pair with local OS clipboard when running locally, respect emulator payload caps (~100 KB), handle security denial silently, and show visible copy confirmation. |
| **OSC 9;4 Progress** | `OSC 9 ; 4 ; <state> ; <0-100> ST` (`0`=clear, `1`=normal, `2`=error, `3`=indeterminate, `4`=paused) | Surfaces native taskbar/tab progress bars in Windows Terminal, Ghostty, WezTerm, and iTerm2. | Emit **only** to an interactive TTY and **always emit `state=0` (clear)** on completion, error exit, or `SIGINT` so stuck progress indicators never linger on the terminal tab. |

## Grapheme-cluster column width (`UAX #29`) & `--ascii` fallback

**Never** compute terminal column width with `.length`, `.len()`, `len()`, or UTF-16 code units—every border and table column will misalign on real international text:

- Segment by **Unicode Standard Annex #29 (`UAX #29`) extended grapheme clusters** + **East Asian Width**:
  - **CJK ideographs** (`日本語` / `中文`) = **`2` cols** per character;
  - **ZWJ Emoji sequences** (`👨‍👩‍👧‍👦`) = **`2` cols** total (not 8 or 11);
  - **Variation Selector-16 (`VS16`, `U+FE0F`)** (`⚠️`) = **`2` cols**;
  - **Vietnamese & combining diacritics** (e.g., `Nguyễn` NFD combining marks `U+0300`–`U+036F`) = **`0` extra cols**.
- Use proven width libraries per runtime: `unicode-segmentation` + `unicode-width` (Rust), `rivo/uniseg` / `go-runewidth` / `lipgloss.Width` (Go), `Intl.Segmenter` + `string-width` (Node/Bun), and `wcwidth` / `rich.cells.cell_len` (Python).
- **`--ascii` & non-UTF-8 locale fallback**: when `--ascii` is passed, `TERM=dumb`, or `LC_ALL`/`LANG` is `C`/`POSIX` (non-UTF-8), replace Unicode box-drawing (`╭─╮` → `+--+`), Braille spinners (`⠋` → `- \ | /`), and status glyphs (`✔`/`✖` → `[OK]`/`[ERR]`).

## 6-step panic & signal terminal restoration hook

Register a teardown hook covering normal exit, **`SIGINT`**, **`SIGTERM`**, **`SIGHUP`**, and uncaught **panics/exceptions** that executes all 6 restoration steps in order before writing any crash traceback:

1. **Leave alternate screen**: `\x1b[?1049l`
2. **Disable mouse tracking**: `\x1b[?1000l\x1b[?1002l\x1b[?1003l\x1b[?1006l`
3. **Disable bracketed paste**: `\x1b[?2004l`
4. **Disable synchronized output**: `\x1b[?2026l` (and clear `OSC 9;4` progress `\x1b]9;4;0;\x1b\\`)
5. **Pop Kitty keyboard protocol flags**: `\x1b[<u`
6. **Show cursor & exit raw mode**: `\x1b[?25h` + restore cooked `termios` / console mode.

## Capability, stream hygiene, `SIGPIPE`, color tiers & `--plain` screen-reader mode

| Signal / Condition | Required behavior |
|---|---|
| **Startup latency & live resize (`80×24` + `120×36`)** | Boot in **`< 200 ms`** (`hyperfine`/`time`) for compact CLIs/TUIs via lazy subcommand/plugin imports; reflow cleanly with **zero tearing/flicker** across **`80×24`** and **`120×36`** live `SIGWINCH` resizes. |
| **Stream separation (`stdout` vs `stderr`)** | Interactive TUI chrome, spinners, progress bars, and human warnings go strictly to `stderr` (or alternate screen only when `isatty(stdout)`). Machine-parseable payloads (`--json`, `--plain`, CSV) go strictly to `stdout`. |
| **Downstream pipe close (`SIGPIPE` / `EPIPE` / `BrokenPipeError`)** | Piping into `head -n 5` or `jq` closes `stdout` early. Catch `BrokenPipe` / `EPIPE` / `BrokenPipeError` and exit `0` **silently**—never print uncaught stack traces or panic dumps! |
| **`NO_COLOR=1` / `TERM=dumb` / `CI=true` / `--plain` screen-reader mode** | Strip ANSI colors (`NO_COLOR=1`), disable CSI/OSC escapes (`TERM=dumb`), disable interactive prompts (`CI=true`), and provide **`--plain`** (linear, non-animated, cursor-stable text output with explicit `[OK]`/`[ERR]` markers so terminal screen readers like NVDA, VoiceOver, and TDSR/Fenrir are never spammed by redrawing spinners). |
| **`16-color` + `256-color` + truecolor themes** | **Never** hardcode `#ffffff` assuming a black terminal or `#000000` assuming a white terminal. Verify graceful downgrade across `COLORTERM=truecolor`, `TERM=xterm-256color` (`256-color` palette), and **`16-color` dark + light ANSI themes**. |

## CLI & TUI distribution, `SHA-256` integrity & deliverables

Ship production terminal tools with complete operator ergonomics:
- **Standard flags & semantic exit codes**: `-h`/`--help`, `-V`/`--version`, `--json`, **`--plain`** (screen-reader non-animated mode), `--no-color`, `--ascii`; exit **`0`** on success, **`1`** on runtime/API failure, **`2`** on CLI usage/flag error, and **`130`** on `SIGINT` (`Ctrl+C`).
- **Shell completions & `man` page**: generate completions for **`bash`, `zsh`, `fish`, and `pwsh`** (`mycli completions <shell>`) plus a `roff` **`man` page** (`man 1 mycli`).
- **Checksums, signatures & clean uninstall**: publish **`SHA-256` (`SHA256SUMS`) checksums and cryptographic release signatures** (`cosign` / GPG / GitHub Attestations) across **Homebrew**, **Winget**, **Scoop**, **Cargo**, **npm**, or **PyPI**, paired with **documented uninstall instructions** removing binaries, completions, caches, and config files cleanly.
- **Required deliverable captures**: attach **`asciinema` (`.cast`) or Charm `VHS` recordings** plus rendered verification across **`iTerm2` / `Terminal.app`, `Windows Terminal`, `GNOME Terminal`, `tmux`, and `SSH`**.

## Do/don't pairs

| Do | Don't |
|---|---|
| Boot in `< 200 ms` (`hyperfine`), enable `?2004h` Bracketed Paste, and run the 6-step teardown on panic/signal | Ship a `1.5 s` CLI cold start, fire `Enter` on multi-line paste, or leave `?1049h`/`?1003h`/`CSI u` stuck after a crash |
| Measure columns with `UAX #29` grapheme + East Asian Width + `--ascii` fallback across `80×24` and `120×36` live resizes | Align borders with `.length`/`.len()`, breaking CJK, `👨‍👩‍👧‍👦`, `⚠️`, and Vietnamese diacritics |
| Route spinners to `stderr`, JSON/plain data to `stdout`, support `--plain` screen-reader mode, and exit silently on `SIGPIPE` | Spam screen readers with `60 Hz` Braille spinner redraws or dump a stack trace on `mycli list \| head -n 5` |
| Verify `16-color` (dark+light), `256-color`, and `NO_COLOR=1` legibility | Hardcode `#ffffff` text invisible on Solarized/macOS Light terminals |
| Ship `--help`, `--version`, `0/1/2/130` exit codes, completions, `man` page, `SHA-256` checksums/signatures, and uninstall docs | Exit `0` on errors or ship unsigned archives with no checksums or uninstall cleanup |

## Verification commands

```sh
# Benchmark < 200ms startup latency and test capability degradation / SIGPIPE:
hyperfine --warmup 3 'your-cli --version'
NO_COLOR=1 your-cli --help
TERM=xterm-256color your-cli --help
TERM=dumb your-cli --plain | head -n 5
# Verify stdout remains free of ANSI escape sequences when piped:
if your-cli --plain | LC_ALL=C grep -q $'\x1b\['; then echo "FAIL: ANSI leaked"; exit 1; fi
```

Piped escape, `SHA-256` checksum, and `head -n 5` `SIGPIPE` checks provide deterministic `static`/output evidence. Record **`hyperfine`/`time` (`< 200 ms`)**, **`asciinema`/`VHS` walkthroughs**, `80×24` + `120×36` live resize, `16-color`/`256-color`/`NO_COLOR=1`/`--plain` modes, and 6-step panic restoration across **`iTerm2`/`Terminal.app`, `Windows Terminal`, `GNOME Terminal`, `tmux`, and `SSH`** (`rendered`; label unavailable host OS emulators `not-checked`).
