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

## Layout, typography, motion, accessibility, & states idioms

- Query `useStdout()` (`stdout.columns`, `stdout.rows`) and subscribe to `resize` events to adapt layouts at `80×24` minimum; set `wrap="truncate-end"` intentionally on narrow labels so single rows do not blow up vertical cell height.
- Separate interactive TTY runs from CI/piped usage (`process.stdout.isTTY`, `CI=1`, `--json` / `--no-interactive`): when stdout is piped or non-interactive, skip full-screen Ink redraws and emit clean line-oriented or JSON output.
- Keep `Spinner` / `ProgressBar` updates truthful and quiet in CI; always clean up timers, child processes, and `AbortController` requests on unmount or `SIGINT` (`Ctrl+C`), and call `exit()` cleanly via `useApp()`.
- In multi-step forms, support back/cancel semantics, paste support, visible cursor/selection, validation copy on submit, and non-interactive CLI flags for every prompted field.

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
| Gate `useInput(..., { isActive })` by focus/modal state | Let hidden background components intercept `Enter`/`Escape` keys |
| Use `useFocus`/`useFocusManager` + visible text marker (`>`) + `@inkjs/ui` | Build color-only focus states or hand-rolled raw `stdin` hacks |
| Detect `!process.stdout.isTTY` / `CI=1` and emit plain/JSON output | Hang CI pipelines waiting on interactive `<Select>` or `useInput` |
| Assert frame text & key handling with `ink-testing-library` | Skip tests and eyeball only one wide terminal window |

## Known traps

Rendering unbounded lists outside `<Static>` causing severe terminal flicker and broken scrollback, forgetting `isActive` on `useInput` causing double key-handling in modals, React effect leaks after `Ctrl+C` keeping the Node event loop alive, emoji/CJK double-width cell misalignment in Yoga boxes, writing ANSI Ink output into piped `stdout` scripts.

## Verification commands

```sh
npm run lint
npm run test -- --run
npm run build
node dist/cli.js --help
# Verify CI / non-TTY / NO_COLOR behavior explicitly (must exit cleanly):
NO_COLOR=1 COLUMNS=80 node dist/cli.js --help
CI=1 node dist/cli.js --help | cat
```

Lint, build, and `ink-testing-library` assertions provide `static` / virtual-frame evidence. Run the built CLI in real terminals at `80×24`, `NO_COLOR=1`, piped stdout, and `Ctrl+C` interrupt paths for `rendered` evidence; label untested terminal emulators `not-checked`.
