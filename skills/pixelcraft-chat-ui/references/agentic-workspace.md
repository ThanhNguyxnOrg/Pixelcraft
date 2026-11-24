# Agentic and AI-native workspace UI

Use this reference when designing app-owned web, desktop, or mobile AI assistant workspaces (streaming chat, tool-calling agents, reasoning traces, branching, multimodal composers, split artifact panes, citations, and approval gates) rather than host-constrained messaging bots.

## Streaming, scroll ownership, and resumable runs

| Behavior | Concrete rule |
|---|---|
| **Auto-scroll lock** | Follow incoming tokens only while the user is pinned near the bottom (`distanceFromBottom < 48px`). The instant the user scrolls up, release auto-scroll and show a non-blocking `Jump to latest` button. |
| **Cancellation** | Render a persistent, keyboard-accessible `Stop` control while running; abort cleanly and label the preserved partial output as stopped (`Stopped by user`). |
| **Screen-reader safety** | Never attach `aria-live="polite"` or `"assertive"` directly to a raw token-by-token text node. Announce coarse milestones (`Generating response`, `Approval needed`, `Response complete`, `Stopped`) in a dedicated status region. |
| **Long-running resumable runs** | Persist thread/run IDs server-side so closing a tab, navigating away, or refreshing reconnects cleanly to an active multi-minute research/agent run (`resume`) with real elapsed time and a working cancel action. |
| **Prompt preservation** | If a request fails or times out, keep the user's message visible with `Retry` and `Edit & resend`—never wipe the composer. |

## Conversation branching, edit-and-fork, and regeneration

- Allow users to **edit an earlier prompt** or **regenerate an assistant reply** without destroying prior output: fork a sibling branch and display a compact branch pager (`< 2 / 3 >`) inline on that turn.
- Keep artifact versions, citations, and tool traces strictly linked to the active branch so switching branches never displays stale code or files from another path.
- Confirm clearly when regenerating a turn that precedes approved external side effects (cannot un-send an already-sent email or API mutation).

## Multimodal attachments, voice input, and `@`-mention context pickers

- **Attachments (images, PDFs, audio, CSV/code)**: Render removable preview chips inside the composer showing filename, type, size/page hint, upload progress, and concrete rejection copy (oversized, unsupported MIME) while preserving typed text.
- **Voice input**: Show explicit microphone permission state, live waveform/level feedback, elapsed duration, and unambiguous `Send` vs `Cancel` controls; display editable transcript before irreversible tool-triggering prompts when accuracy matters.
- **`@`-mention context pickers**: Trigger a keyboard-accessible combobox on `@` (files, folders, docs, tables, connected tools) so users inspect and pin exact grounding scope explicitly rather than guessing what the model can see.

## Tool traces, multi-agent attribution, and context transparency

- Collapse multi-step tool calls and intermediate reasoning by default into a scannable summary (`3 tools · 1.4s`) expandable via keyboard.
- Label every step with explicit semantic state (`running`, `completed`, `failed`, `needs-approval`) using text + icon, never color or spinner alone.
- **Multi-agent attribution**: When specialized subagents or delegated workers run in parallel, attribute each trace group to its real agent role/name inside collapsible sub-cards (avoid theatrical cartoon personas or ungrounded roleplay).
- **Context-window & compaction transparency**: When a long thread approaches context limits or triggers automatic summarization/compaction, surface a calm indicator ("Earlier turns summarized to stay within context · 12 files attached") so users know when an old file or instruction is no longer verbatim in context.
- Show real tool inputs/outputs and elapsed times only when emitted by the backend; never fake "thinking…" steps or artificial typing delays.

## Streaming Markdown, code fences, LaTeX, and XSS safety

Model streams regularly emit **incomplete syntax** mid-token (` ```ts` without a closing fence, half-written Markdown tables, unclosed `$$` LaTeX delimiters, or untrusted raw HTML):

- Use a streaming-aware Markdown parser (or fence-balancing pre-processor) that cleanly renders open code blocks, lists, and math expressions without flicking raw syntax or jumping heights on every token.
- Keep code-block headers (`language`, `Copy`, `Open in artifact`) anchored stably while tokens stream into the block.
- **Strict XSS defense**: Disable raw HTML execution by default (or sanitize strictly with an allowlist), reject `javascript:` / `data:text/html` links, and never pass raw model output into `innerHTML` / `dangerouslySetInnerHTML`.

## Human-in-the-loop approval gates

- Before executing any irreversible, financial, credential-touching, or external mutation (sending email, deleting rows, pushing code, charging payment), pause behind an inline approval card naming the exact tool, target, and parameters with `Approve`, `Edit parameters` (where applicable), and `Decline`.
- Keep approvals strictly idempotent: mark the card resolved (`Approved by you at 14:02`) immediately upon decision so double-clicks, reloads, or branch switches cannot replay the side effect.

## Split artifact / canvas workbench

- Open substantial generated outputs (documents, code, interactive previews, tables, diffs) in a side-by-side artifact pane on wide viewports (and a full-height sheet/tab on mobile `390px`) with independent scroll from the chat thread.
- Provide `Copy`, `Download`, version selector (`v1`, `v2`), and `Preview` / `Code` / `Diff` toggles linked to the originating turn.

## Grounded citations, trust calibration, and scaffolded agency

- Render source citations as clickable inline references opening the exact excerpt and source URL/file path. Never invent citations or fake confidence scores.
- **Prevent automation bias ("toxic trust")**: Surface concise inline provenance (*why* the agent filled a field or chose a plan) and keep defaults visibly editable before commitment.
- **Scaffolded agency**: Anchor primary navigation, thread switcher, global status, and exit/undo controls in invariant positions even when dynamic generative UI widgets render inside turns.

## Verification checklist

- [ ] Scrolling up mid-stream immediately releases auto-scroll and shows `Jump to latest`;
- [ ] `Stop` aborts cleanly and reloading reconnects to long-running background runs without data loss;
- [ ] Editing a turn or regenerating creates inspectable branches (`< 1 / 2 >`) without corrupting artifact lineage;
- [ ] Unclosed code fences, partial tables, LaTeX, and malicious `<script>`/`javascript:` payloads render safely mid-stream;
- [ ] Multimodal attachments, voice cancel/retry, and `@`-mention pickers work via keyboard and preserve drafts;
- [ ] Tool/reasoning traces and multi-agent sub-runs are keyboard-toggleable and never flood `aria-live`;
- [ ] Destructive/external tool calls pause behind an idempotent approval card;
- [ ] Split artifact pane collapses cleanly to a single-column sheet/tab at `390px` with zero horizontal overflow.
