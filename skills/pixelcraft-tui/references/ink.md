# Ink (React for CLI, v5 / v6)

Ink 5/6 runs **React 19** + **Yoga 3** Flexbox in terminal cells. Treat Ink as a keyboard-driven terminal surface—not a browser DOM running inside Node/Bun.

## Token mapping

Centralize semantic colors, borders, and spacing in a typed theme module or `@inkjs/ui` `ThemeProvider` / `extendTheme` so components reference semantic roles (`action`, `danger`, `muted`) rather than scattering raw hex/chalk strings:

```tsx
export const pcTheme = {
  action: 'cyan',
  success: 'green',
  error: 'red',
  muted: 'gray',
  focusBorder: 'blue',
} as const;
```

Prefer ANSI semantic palette names (`cyan`, `red`, `green`, `yellow`) or test graceful degradation under `NO_COLOR=1` and 16-color terminals—never assume truecolor support.

## Core Ink 5/6 primitives: `<Static>`, `useInput`, `useFocus`, & `@inkjs/ui`

- **`<Static items={completedLogs}>`**: render completed log lines, build steps, or historical entries once above the dynamic interactive footer so Ink appends cleanly to terminal scrollback without flickering or redrawing thousands of past lines.
- **`useInput((input, key) => ..., { isActive })`**: gate keyboard listeners with `isActive` whenever a modal, confirmation prompt, or nested pane opens so background views never steal `Enter`, `Escape`, or arrow keys.
- **`useFocus` & `useFocusManager`**: wire `Tab` / `Shift+Tab` focus traversal across panes and show an unmistakable focus indicator (border + text marker `>`, never color alone).
- **`@inkjs/ui`**: prefer official accessible-baseline Ink widgets (`Select`, `MultiSelect`, `ConfirmInput`, `TextInput`, `Spinner`, `ProgressBar`, `StatusMessage`, `Badge`, `ThemeProvider`) before hand-rolling raw keystroke handlers.

```tsx
import React, { useState } from 'react';
import { Box, Static, Text, useFocus, useInput } from 'ink';
import { StatusMessage } from '@inkjs/ui';

type LogEntry = { id: string; text: string };

export function DeployView({ logs, onCancel }: { logs: LogEntry[]; onCancel: () => void }) {
  const { isFocused } = useFocus({ autoFocus: true });
  const [confirming, setConfirming] = useState(false);

  useInput(
    (input, key) => {
      if (key.escape || input === 'q') setConfirming(true);
      if (confirming && input === 'y') onCancel();
      if (confirming && input === 'n') setConfirming(false);
    },
    { isActive: isFocused },
  );

  return (
    <Box flexDirection="column">
      <Static items={logs}>{(entry) => <Text key={entry.id}>{entry.text}</Text>}</Static>
      <Box borderStyle="round" borderColor={isFocused ? 'cyan' : 'gray'} paddingX={1}>
        <Text>{isFocused ? '> ' : '  '}</Text>
        {confirming ? (
          <StatusMessage variant="warning">Abort deploy? [y/n]</StatusMessage>
        ) : (
          <Text>Press q or Esc to abort</Text>
        )}
      </Box>
    </Box>
  );
}
```

## Layout, `UAX #29` width, Bracketed Paste, `EPIPE`, & teardown idioms

- **Grapheme width (`Intl.Segmenter` + `string-width`) & `--ascii`**: never pad or truncate terminal strings with JS `str.length` (UTF-16 code units corrupt CJK `2`-col glyphs, `👨‍👩‍👧‍👦` ZWJ emoji, `⚠️` `VS16`, and Vietnamese NFD combining marks). Segment cursor steps with `new Intl.Segmenter(undefined, { granularity: 'grapheme' })` and measure columns with **`string-width`**; switch `borderStyle` / glyphs to ASCII (`borderStyle="classic"` or `+--+`) under `--ascii`, `TERM=dumb`, or non-UTF-8 locales.
- **Query `useStdout()` (`stdout.columns`, `stdout.rows`)** and subscribe to `resize` events to adapt layouts at `80×24` minimum; set `wrap="truncate-end"` intentionally on narrow labels.
- **Bracketed Paste (`DECSET 2004`) & `OSC 52` clipboard**: enable `\x1b[?2004h` on interactive text inputs so multi-line pastes arrive intact instead of triggering `key.return` on every newline; emit `OSC 52` (`\x1b]52;c;<base64>\x07`) alongside local clipboard helpers for SSH/`tmux` copy support.
- **Stream hygiene & silent `EPIPE` exit**: render Ink diagnostic/progress UI on `stderr` (`render(<App />, { stdout: process.stderr })`) whenever `stdout` is reserved for pipeable results, emit `--json`/`--plain` strictly to `process.stdout`, and install `process.stdout.on('error', (err) => { if (err.code === 'EPIPE') process.exit(0); })` so `mycli --plain | head -n 5` never crashes with an unhandled `Error: write EPIPE` stack trace!
- **6-step signal/crash restoration & CLI distribution**: register cleanup handlers on `SIGINT`, `SIGTERM`, `SIGHUP`, and `uncaughtException` to run the 6-step terminal reset (`?1049l`, mouse `?1000l/?1002l/?1003l/?1006l`, `?2004l`, `?2026l`, `\x1b[<u`, `?25h` + `stdin.setRawMode(false)`) before exiting (`0` ok, `1` runtime error, `2` flag error, `130` `SIGINT`). Ship `--help`, `--version`, `bash`/`zsh`/`fish`/`pwsh` completions, a `man` page, and npm/Homebrew/Winget/Scoop distribution ([terminal-protocols.md](terminal-protocols.md)).

## Automated frame & input testing (`ink-testing-library`)

Drive deterministic component rendering and keystroke sequences with **`ink-testing-library`**:

```tsx
import { render } from 'ink-testing-library';
import { DeployView } from './DeployView.js';

const { lastFrame, stdin } = render(<DeployView logs={[]} onCancel={() => {}} />);
stdin.write('q');
// Assert frame contains "[y/n]" prompt text and focus marker ">"
```

## Do/don't pairs

| Do | Don't |
|---|---|
| Render completed log history inside `<Static>` above live status | Re-render a growing 500-line array inside the dynamic `<Box>` every tick |
| Measure/slice text with `Intl.Segmenter` + `string-width` and provide `--ascii` fallback | Pad columns with `str.length` / `.padEnd()`, breaking CJK, `👨‍👩‍👧‍👦`, and Vietnamese diacritics |
| Enable Bracketed Paste (`?2004h`), handle `stdout` `EPIPE` silently, and run 6-step reset on `SIGINT`/crash | Fire `key.return` on pasted newlines, crash with `EPIPE` on `\| head -n 5`, or leave raw mode stuck |
| Gate `useInput(..., { isActive })` by focus/modal state + ANSI 16 dark/light-safe colors | Let hidden views intercept `Enter`/`Escape` or hardcode `#ffffff` on light terminals |
| Detect `!process.stdout.isTTY` / `CI=1`, emit plain/JSON to `stdout`, and ship completions + `man` page | Hang CI pipelines waiting on interactive `<Select>` or leak spinner ANSI to `stdout` |

## Known traps

Rendering unbounded lists outside `<Static>`, `str.length` UTF-16 width misalignment on emoji/CJK/Vietnamese, unhandled `stdout` `EPIPE` stack traces when piped to `head`/`jq`, multi-line paste firing accidental `Enter` submits without `?2004h`, React effect leaks after `Ctrl+C` keeping the Node event loop alive.

## Verification commands

```sh
npm run lint
npm run test -- --run
npm run build
NO_COLOR=1 COLUMNS=80 node dist/cli.js --help
node dist/cli.js --plain | head -n 5
```

Lint, build, and `ink-testing-library` assertions provide `static` / virtual-frame evidence. Run the built CLI in real dark and light terminals at `80×24`, `NO_COLOR=1`, `--ascii`, multi-line paste, piped `head -n 5`, and `Ctrl+C` interrupt paths for `rendered` evidence; label untested terminal emulators `not-checked`.
