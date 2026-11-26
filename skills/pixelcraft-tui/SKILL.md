---
name: pixelcraft-tui
description: Translates Pixelcraft direction, tokens, UX, and floor requirements into terminal user interfaces across Textual, Rich, Ink, Bubble Tea v2/Lip Gloss, Ratatui, Terminal.Gui, Spectre.Console, prompt_toolkit, OpenTUI, FTXUI, and Clack/CLI prompts. Use for keyboard-first CLI apps, dashboards, installers, logs, forms, character-grid layout, Kitty/Sixel/OSC 8/DEC 2026 terminal protocols, NO_COLOR fallback, resizing, snapshots, accessibility, and state feedback.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft TUI

Use this skill when the rendering surface is a terminal character grid. Terminal constraints are design constraints, not an excuse for unstructured text output.

## Surface craft

Give repeated keyboard work stable regions: list or prompt, result, status and a short reversible help layer. Preserve task progress through terminal resize; keep a text marker when terminal colors or Unicode are limited. Check the smallest supported columns/rows after switching panes, with no mouse and in a low-capability terminal.

## Detection signals

Python `textual`/`rich`/`prompt_toolkit`/`questionary`, Node/Bun `ink`/`@inkjs/ui`/`@opentui/*`/`@clack/prompts`/`@inquirer/prompts`, Go `bubbletea`/`lipgloss`/`huh`/`tcell`/`tview`, Rust `ratatui`/`crossterm`/`cliclack`/`inquire`/`dialoguer`, .NET `Terminal.Gui`/`Spectre.Console`, C++ `ftxui`/`notcurses`, alternate-screen/raw-mode setup, keybinding tables, snapshot tests, and terminal capability handling.

## Translate direction to terminal idioms

1. Treat cells/rows/columns as the layout system. Establish alignment, scanlines, density, focus, and rhythm explicitly.
2. Map tokens to semantic styles supported by the framework; do not assume truecolor, Unicode width, mouse support, or persistent screen size.
3. Keyboard-first means every task has discoverable keys, focus/order, escape/cancel behavior, help, and no hidden mouse-only path.
4. Use color as enhancement; meaning must survive 16-color, monochrome, low contrast, `TERM=dumb`, and `NO_COLOR` environments.
5. Unicode box glyphs/braille/sparklines/graphics protocols need fallback glyphs or plain-text degradation because terminal and `tmux` support varies.
6. Design resize behavior: minimum dimensions (`80×24`), truncation/wrapping, pane priority, scrollback vs alternate screen, and terminal reflow.

## Platform-wide rules

- **Startup latency & flicker-free live resize**: hit **`< 200 ms` cold startup latency** (measured with `hyperfine` or `time`) for compact CLIs/TUIs, and verify **flicker-free live resize** across **`80×24`** (minimum floor) and **`120×36`** (standard workspace) using DEC Mode `2026` synchronized output where supported.
- **Grapheme-cluster width (`UAX #29`) & `--ascii` fallback**: **never** measure column width with `.length`, `.len()`, or UTF-16 code units! Compute **`UAX #29` grapheme-cluster + East Asian Width** (`unicode-width` + `unicode-segmentation` in Rust, `uniseg`/`go-runewidth` in Go, `Intl.Segmenter` + `string-width` in Node, `wcwidth`/`rich.cells` in Python) so **CJK (`2` cols), ZWJ Emoji (`👨‍👩‍👧‍👦` = `2` cols), `VS16` (`⚠️` = `2` cols), and Vietnamese combining diacritics (`0` extra cols)** never corrupt box borders; degrade to `--ascii` / `+--+` glyphs when `TERM=dumb` or locale is non-UTF-8.
- **`DECSET 2004` Bracketed Paste & `OSC 52` clipboard**: enable Bracketed Paste (`\x1b[?2004h` … `\x1b[?2004l`) on interactive inputs so multi-line pastes never fire each newline as an accidental `Enter` confirmation; support **`OSC 52`** escape sequences for copying over remote SSH/`tmux` sessions alongside local OS clipboards.
- **Stream hygiene, `SIGPIPE`, color tiers & `--plain` screen-reader mode**: send interactive TUI chrome, spinners, and progress bars to `stderr` (or alternate screen only when `isatty(stdout)`); write machine-parseable output (`--json`, `--plain`) strictly to `stdout`; handle **`SIGPIPE` / `EPIPE` / `BrokenPipeError`** (`| head -n 5` / `| jq`) silently without stack traces; and verify **`16-color` (dark + light ANSI)**, **`256-color`**, **`NO_COLOR=1`**, `TERM=dumb`, `CI=true`, and a **`--plain` screen-reader non-animated mode** (linear line-by-line output with zero cursor-rewriting spinners).
- **6-step panic & signal terminal restoration**: on normal exit, `SIGINT`, `SIGTERM`, `SIGHUP`, and uncaught panics/exceptions, execute all 6 teardown steps in order: **(1)** leave alternate screen `?1049l`, **(2)** disable mouse tracking `?1000l/?1002l/?1003l/?1006l`, **(3)** disable bracketed paste `?2004l`, **(4)** disable synchronized output `?2026l` (and clear `OSC 9;4` progress), **(5)** pop Kitty keyboard flags `\x1b[<u`, **(6)** show cursor `?25h` & exit raw mode.
- **CLI distribution, `SHA-256` signatures & uninstall contract**: ship `--help`, `--version`, semantic exit codes (**`0`** ok, **`1`** runtime error, **`2`** usage error, **`130`** `SIGINT`), **shell completions (`bash`, `zsh`, `fish`, `pwsh`)**, a `man` page, Homebrew/Winget/Scoop/Cargo/npm binary packaging, **release `SHA-256` checksums/signatures**, and **explicit uninstall instructions** (cleaning binaries, completions, and config paths).

## Anti-lazy-default & anti-slop guard

- **Reject raw `print()` / `console.log()` / manual ANSI escape spaghetti** (`\x1b[31m...`) when structured TUI/CLI libraries fit the language: **Rich** / **Textual** (Python), **Bubble Tea v2 + Lip Gloss v2 + Huh** (Go), **Ratatui** (Rust), **Ink** / **`@clack/prompts`** (Node/Bun), or **Spectre.Console** / **Terminal.Gui v2** (.NET).
- **Match buffer mode to task scope**: use inline CLI prompts/output for one-shot commands and reserve full-screen alternate-buffer TUIs for persistent interactive workspaces; reject decorative ASCII banners that crowd out real data at `80×24`.

## Common TUI failures

- measuring columns with `.length`/`.len()` so CJK, ZWJ emoji (`👨‍👩‍👧‍👦`), `⚠️`, or Vietnamese diacritics break borders;
- `> 500 ms` sluggish startup, missing `--plain` non-animated screen-reader mode, or tearing on `80×24` ↔ `120×36` live resize;
- missing `?2004h` Bracketed Paste causing pasted multi-line configs to execute every line on `Enter`;
- crashing with `BrokenPipeError` / `EPIPE` / Rust `.unwrap()` panic when piped into `head -n 5`, or leaking spinner ANSI to `stdout`;
- hardcoded `#ffffff` text unreadable on light 16-color terminals, or color-only diffs invisible under `NO_COLOR=1`;
- incomplete panic/signal teardown leaving `?1049h`, mouse tracking `?1003h`, `?2026h`, or Kitty `CSI u` stuck in the user's shell;
- missing `--version`, completions, `man` page, `SHA-256` release checksums, uninstall instructions, or exiting `0` on failure.

## Verification options

Passing a unit test without a rendered frame/buffer/recording is `static`, never `rendered` (**Rule #0.3**). Deliver `hyperfine`/`time` startup benchmarks (`< 200 ms`), **`asciinema` or Charm `VHS` terminal recordings**, framework snapshot tests (`Pilot`, `TestBackend`+`insta`, `Teatest`, `ink-testing-library`), and rendered checks across **`iTerm2` / `Terminal.app`, `Windows Terminal`, `GNOME Terminal`, `tmux`, and `SSH`** (`rendered`, labeling unavailable OS emulators `not-checked`).

## Pre-submit checklist

- [ ] zero `TODO`s, placeholder stubs, dead keybindings, or raw hardcoded ANSI escape spaghetti;
- [ ] **`< 200 ms` startup latency** (`hyperfine`/`time`), **`UAX #29` grapheme width** (CJK `2`, ZWJ emoji `2`, `VS16` `2`, Vietnamese diacritics `0`), `--ascii` fallback, and **flicker-free `80×24` + `120×36` live resize** verified;
- [ ] `DECSET 2004` Bracketed Paste (`?2004h`…`?2004l`) and `OSC 52` SSH/`tmux` + local clipboard wired;
- [ ] `stderr`/`stdout` separation, silent `SIGPIPE`/`EPIPE`/`BrokenPipeError` exit (`| head -n 5`), **`16-color` (dark+light)**, **`256-color`**, **`NO_COLOR=1`**, `TERM=dumb`, `CI=true`, and **`--plain` screen-reader non-animated mode** verified;
- [ ] full 6-step terminal restoration (`?1049l`, mouse `?1000–1006l`, `?2004l`, `?2026l`, `\x1b[<u`, `?25h` + raw mode) verified on exit, `SIGINT`/`SIGTERM`/`SIGHUP`, and panic;
- [ ] `--help`, `--version`, `0/1/2/130` exit codes, `bash`/`zsh`/`fish`/`pwsh` completions, `man` page, **`SHA-256` release checksums/signatures + uninstall instructions**, and **`asciinema`/`VHS` + multi-terminal (`iTerm2`/`Terminal.app`, `Windows Terminal`, `GNOME Terminal`, `tmux`, `SSH`)** deliverables verified or labeled `not-checked`;
- [ ] **Checklist-Until-Passing Stop-Gate (`<HARD-GATE>`):** walk every checklist item above + run `slop-scan.mjs --fail-on p2`, `check-tui.mjs` (`--cols 80`, `--cols 120`, `NO_COLOR=1`), compiler/tests, and `check-acceptance.mjs .pixelcraft/acceptance.json` (`pixelcraft-review`) in a `Fix → Re-verify` loop until passing (`0` `fail`/`pending` rows, `rendered` evidence on visual/perf/a11y per `Rule #0.3`).

## Framework routing

- Read [references/terminal-protocols.md](references/terminal-protocols.md) when implementing DEC Mode 2026 synchronized output, Kitty/Sixel/iTerm2 graphics fallbacks, OSC 8 hyperlinks, Kitty keyboard protocol (`CSI u`), OSC 52 clipboard, OSC 9;4 progress, or `NO_COLOR`/`TERM`/`isatty` capability handling.
- Read [references/textual.md](references/textual.md) when building Python Textual apps with `Theme`, TCSS cell units, `CommandPalette`, `@work(exclusive=True)`, and `Pilot`/SVG snapshots.
- Read [references/rich.md](references/rich.md) when building Python Rich CLI output, `Theme` consoles, `stderr` progress/live displays, or markup-safe logging.
- Read [references/ink.md](references/ink.md) when building Node/Bun Ink 5/6 (React 19) terminal UIs with `<Static>`, `useInput`, `useFocus`, `@inkjs/ui`, and `ink-testing-library`.
- Read [references/bubbletea-lipgloss.md](references/bubbletea-lipgloss.md) when building Go Bubble Tea v2 / Lip Gloss v2 TUIs or using the Charm ecosystem (Huh, Bubbles, Glamour, Gum, Fang, Teatest).
- Read [references/ratatui.md](references/ratatui.md) when building Rust Ratatui (`0.28–0.30+`) TUIs with `ratatui::run`/`init`+`restore`, `Constraint::Fill`/`Flex`, `ratatui-image`, and `TestBackend`+`insta`.
- Read [references/extended-tui-toolkits.md](references/extended-tui-toolkits.md) when building .NET `Terminal.Gui v2` or `Spectre.Console`, Python `prompt_toolkit`, `OpenTUI`, C++ `FTXUI`, `Notcurses`, Go `tcell`/`tview`, migrating off Blessed, or choosing inline CLI prompts (`@clack/prompts`, `@inquirer/prompts`, `questionary`, `cliclack`/`inquire`/`dialoguer`).
