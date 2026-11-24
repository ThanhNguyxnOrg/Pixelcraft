# Terminal protocols & capability detection

Modern terminal emulators (Ghostty, Kitty, WezTerm, Alacritty, iTerm2, Windows Terminal, foot) support rich protocols that eliminate flicker, unlock crisp keyboard shortcuts, and enable graphics and clipboard integration over SSH. Every protocol is **progressive enhancement**—never assume universal emulator or multiplexer (`tmux`/`screen`) support.

## Modern terminal protocols

| Protocol | Sequence / contract | Purpose | Mandatory fallback & safety rule |
|---|---|---|---|
| **DEC Mode 2026** (Synchronized Output) | Begin: `ESC [ ? 2026 h` · End: `ESC [ ? 2026 l` (query via DECRQM `ESC [ ? 2026 $ p`) | Batches screen updates atomically so the terminal renders one complete frame with zero mid-frame tearing/flicker. | Safely ignored by older terminals; **always** emit `ESC [ ? 2026 l` on exit/panic so terminals never freeze waiting for end-of-frame. |
| **Graphics Protocols** (Kitty / Sixel / iTerm2) | Kitty `APC G ... ST` · Sixel `DCS q ... ST` · iTerm2 `OSC 1337 ; File=... BEL/ST` | Renders crisp thumbnails, charts, or previews inside character cells. | Probe support (or use `ratatui-image` / Chafa-style detection); degrade cleanly to **Unicode halfblocks (`▀`/`▄`)**, Braille, or an explicit text placeholder (`[Image: diagram.png]`) inside unsupported terminals or un-configured `tmux`/SSH. |
| **OSC 8 Hyperlinks** | `OSC 8 ; params ; URI ST label OSC 8 ; ; ST` | Makes labels clickable links in supporting terminals without cluttering narrow columns. | Never hide essential URLs behind `"click here"`—keep link text self-explanatory or print the raw URL in plain/`!isatty` output so piped logs and non-OSC-8 terminals still have the destination. |
| **Kitty Keyboard Protocol (`CSI u`)** | Push flags: `ESC [ > flags u` · Pop on exit: `ESC [ < u` | Disambiguates `Ctrl+I` vs `Tab`, `Ctrl+M` vs `Enter`, `Ctrl+[` vs `Esc`, `Shift+Enter`, and key release/repeat events. | Negotiate cleanly and **always pop (`ESC [ < u`) on exit/panic**; maintain legacy ANSI keybinding fallbacks so users on older terminals or basic SSH sessions can complete every task. |
| **OSC 52 Clipboard** | `OSC 52 ; c ; <base64-utf8> ST` | Copies text directly to the user's local clipboard even across remote SSH and `tmux` (`set-clipboard on`) without `pbcopy`/`xclip`/`wl-copy`. | Respect emulator payload caps (~100 KB), handle user/terminal security denial silently, and show a visible confirmation or copyable view if clipboard writes are disabled. |
| **OSC 9;4 Progress** | `OSC 9 ; 4 ; <state> ; <0-100> ST` (`0`=clear, `1`=normal, `2`=error, `3`=indeterminate, `4`=paused) | Surfaces native taskbar/tab progress bars in Windows Terminal, Ghostty, WezTerm, and iTerm2. | Emit **only** to an interactive TTY and **always emit `state=0` (clear)** on completion, error exit, or `SIGINT` so stuck progress indicators never linger on the terminal tab. |

```text
# OSC 8 clickable hyperlink (ST = ESC \)
\x1b]8;;https://example.com/docs\x1b\\Read docs\x1b]8;;\x1b\\

# OSC 9;4 progress bar (42% normal), then clear on exit
\x1b]9;4;1;42\x1b\\
\x1b]9;4;0;\x1b\\
```

## Capability & environment-variable matrix

Check environment variables and TTY state in deterministic precedence order—never spray ANSI escapes unconditionally into files or CI logs:

| Signal | Meaning | Required behavior |
|---|---|---|
| `!isatty(stdout)` | Output is piped or redirected to a file | Disable alt-screen, spinners, cursor motion, OSC 9;4, and ANSI color on `stdout` (unless explicitly overridden by `--color=always` / `FORCE_COLOR`); write human progress to `stderr` only if `isatty(stderr)`. |
| `TERM=dumb` (or unset `TERM`) | Minimal non-ANSI environment (Emacs shell, basic CI, serial console) | Emit plain UTF-8/ASCII lines only; disable all CSI/OSC escapes, box drawing assumptions, and cursor addressing. |
| `NO_COLOR` (present and non-empty, per `no-color.org`) | User explicitly opted out of ANSI color | Strip all foreground/background color codes while preserving bold/plain-text markers (`[OK]`, `[ERR]`, `>`). `NO_COLOR` overrides `COLORTERM` and default TTY color detection. |
| `FORCE_COLOR` (non-empty and not `"0"`) | Caller forces color despite non-TTY pipe (e.g., CI log viewer) | Allow ANSI color output when explicitly non-zero; never enable full-screen interactive prompts or cursor-movement redraws just because `FORCE_COLOR` is set. |
| `COLORTERM=truecolor` or `24bit` | Terminal advertises 24-bit RGB support | Permit RGB colors (still respecting `NO_COLOR` and light/dark readability); otherwise downsample cleanly to ANSI 256 or ANSI 16. |
| `CI=true` / `CI=1` | Headless automated pipeline | Disable interactive prompts (`--no-interactive` default), switch spinners to discrete timestamped/milestone lines, and exit non-zero cleanly when required args are missing. |

## Do/don't pairs

| Do | Don't |
|---|---|
| Wrap complex frame redraws in DEC Mode 2026 (`?2026h` … `?2026l`) with cleanup on panic | Stream partial cursor redraws causing visible tearing or leave `?2026h` unclosed |
| Pop Kitty keyboard protocol (`CSI < u`) and clear OSC 9;4 (`9;4;0`) on exit and `SIGINT` | Leave the user's shell stuck in `CSI u` mode or with a permanent error progress bar |
| Honor `NO_COLOR` (non-empty), `TERM=dumb`, and `!isatty(stdout)` strictly | Ignore `NO_COLOR` or dump raw ANSI escape sequences into piped JSON output |
| Provide Unicode halfblock or text fallback when Kitty/Sixel graphics aren't supported | Emit raw Sixel or Kitty APC bytes unconditionally into `tmux` or unsupported terminals |
| Keep OSC 8 link text meaningful or print the URL in plain mode | Output `[click here]` with OSC 8 so non-supporting terminals lose the URL entirely |

## Verification commands

```sh
# Test capability degradation matrix explicitly:
NO_COLOR=1 your-cli --help
TERM=dumb your-cli --help
CI=1 your-cli --help | cat
# Verify stdout remains free of ANSI escape sequences when piped:
your-cli --help | LC_ALL=C grep -P '\x1b\[' && echo "FAIL: ANSI leaked to pipe" || echo "OK: clean pipe"
```

Piped escape checks provide deterministic `static`/output evidence. Inspect synchronized output, Kitty keyboard keys, OSC 8 clicks, OSC 52 clipboard over SSH/`tmux`, OSC 9;4 progress clearing, and graphics fallbacks in at least two real terminal emulators (`rendered`; label untested emulators `not-checked`).
