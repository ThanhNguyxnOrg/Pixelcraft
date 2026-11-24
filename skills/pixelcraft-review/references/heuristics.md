# Nielsen and AI/agentic heuristics as concrete checks

Translate every heuristic into an observable defect tied to a severity (`P0`–`P3`), evidence (`file:line` or rendered state), and concrete fix. Never average away a `P0` with a numeric score.

## Severity mapping (P0–P3)

| Severity | Heuristic failure bar | Example |
|---|---|---|
| **P0** | Task blocker, accessibility/floor breach, data loss, silent destructive action, fabricated claim/citation | Primary submit button unreachable by keyboard; agent deletes records without approval or undo; invented metric/citation |
| **P1** | Major workflow breakdown, missing recovery, misleading system state, wrong platform idiom | Error wipes entered form values; streaming AI response cannot be stopped; mobile back gesture loses unsaved sheet draft |
| **P2** | Comprehensibility, efficiency, or trust defect | Inconsistent action labels (`Archive` vs `Remove`); opaque tool-call spinner for > 10s; raw HTTP 500 error string |
| **P3** | Polish / craft friction with intact task flow | Minor optical misalignment, redundant microcopy, slightly sluggish non-blocking hover transition |

## Core Nielsen heuristics

| Heuristic | Concrete checks | Default severity when broken |
|---|---|---|
| Visibility of system status | Immediate input acknowledgment (`≤ 100ms`); truthful progress; sync/save/upload state; stale/offline badge | P1–P2 (P0 if silent data loss) |
| Match system & real world | Domain vocabulary, locale units/dates, logical ordering; zero raw DB/API jargon | P2 |
| User control & freedom | Undo/cancel/Escape/back; reversible defaults; no trapped modal; interruption/draft recovery | P0–P1 |
| Consistency & standards | Identical action names/icons/positions; native platform back, menu, focus, and shortcut idioms | P1–P2 |
| Error prevention | Forgiving input parsing, proportionate destructive friction, smart defaults, idempotent submit | P1–P2 |
| Recognition over recall | Persistent visible labels, active filters, recent context, visible key legends (no hidden-command lock-in) | P2 |
| Flexibility & efficiency | Keyboard shortcuts, bulk actions, saved views/filters that accelerate experts without cluttering novice flows | P2–P3 |
| Aesthetic & minimalist signal | Every region serves the task; zero decorative chrome, card-in-card clutter, or competing focal points | P2–P3 |
| Recognize, diagnose, recover | Plain-language cause + what was preserved + concrete recovery action; never blame user | P1 |
| Help & documentation | Contextual, searchable, consistent placement (WCAG 3.2.6); never a bandage for broken interaction | P2–P3 |

## AI, streaming, and agentic heuristics

Audit every LLM, copilot, or autonomous workflow against these five criteria:

| Heuristic | Concrete check | Failure signal |
|---|---|---|
| **Trust calibration** | Clearly distinguish deterministic facts, tool outputs, and probabilistic model generations; surface uncertainty honestly | Presenting unverified model guesses with authoritative badge styling or fake confidence percentages |
| **Cancellation & interruption** | Visible, keyboard-reachable Stop/Abort control stays active throughout streaming and multi-step tool runs | Disabled input or runaway agent loop with no way to halt generation or side effects |
| **Partial output safety** | Stopping or network drop preserves already-streamed tokens cleanly, renders unclosed markdown/code blocks safely, and supports retry/edit | Partial answer disappears on abort or broken code fence corrupts the surrounding page layout |
| **Provenance & grounding** | Every citation, file reference, or data claim links to an inspectable real source or explicitly marks `unverified` / `no source` | Dead/hallucinated URLs, unlinked footnote numbers, or hidden tool queries |
| **Side-effect approval & undo** | External writes, sends, deletes, or spending require explicit human-in-the-loop preview/approval OR verifiable one-click undo | Agent silently mutates state or fires external requests behind a single ambiguous “Continue” click |

## Multi-surface defect pairs (vague vs. actionable)

| Surface | Reject (vague taste prose) | Require (concrete evidence-backed finding) |
|---|---|---|
| **Web** | “The modal UX feels clunky.” | `P1` (`rendered`, `src/BillingModal.tsx:84`): Pressing `Esc` closes the upgrade dialog without warning, discarding 6 entered billing fields, and drops focus to `document.body`. Fix: guard dirty state and return focus to `#upgrade-btn`. |
| **Mobile** | “Buttons are hard to tap.” | `P1` (`rendered`, `ios/FilterBar.swift:42`): Filter chips measure `28×28 pt` with `2 pt` spacing below the 44 pt iOS touch baseline, causing mis-taps on narrow screens. Fix: expand hit area to `44×44 pt` with `8 pt` gap. |
| **Desktop** | “Keyboard support needs polish.” | `P1` (`rendered`, `src/main/menu.ts:51`): Settings window omits native `Cmd+,` / `Ctrl+,` shortcut and traps Tab inside custom tab strip; `Escape` does not dismiss unsaved popover. Fix: wire native menu accelerator and roving focus. |
| **TUI** | “Terminal colors are confusing.” | `P1` (`static`/`rendered`, `tui/status.py:118`): Error and success rows differ only by red/green ANSI foreground, becoming indistinguishable under `NO_COLOR=1` and monochrome terminals. Fix: prefix status column with `[OK]` / `[ERR]` tokens. |
| **Data app** | “Dashboard loading is jarring.” | `P2` (`rendered`, `app/overview.py:92`): Changing the date filter reruns the full page script, resetting table sort and scrolling back to top without pending state. Fix: scope reactive fragment/state persistence and show inline updating status. |
