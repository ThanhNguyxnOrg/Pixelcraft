# Agentic and AI-native workspace UI

Use this reference when designing web, desktop, or mobile AI assistant workspaces (streaming chat, tool-calling agents, reasoning traces, split artifact/canvas panes, citations, and approval gates) rather than constrained third-party messaging bots.

## Streaming and scroll ownership

| Behavior | Concrete rule |
|---|---|
| Auto-scroll lock | Follow incoming tokens only while the user is pinned near the bottom (`scrollHeight - scrollTop - clientHeight < 48`). The instant the user scrolls up, release auto-scroll and show a non-blocking `Jump to latest` button. |
| Cancellation | Render a persistent, keyboard-accessible `Stop` control while streaming; abort the in-flight request cleanly and keep the partial response clearly marked as stopped. |
| Screen-reader safety | Never attach `aria-live="polite"` directly to a raw token-by-token text node (it floods assistive tech). Announce coarse milestones (`Generating response`, `Response complete`, `Stopped`) in a dedicated status region. |
| Prompt preservation | If a request fails or times out, keep the user's message visible with an explicit `Retry` or `Edit & resend` control — never wipe the composer. |

## Tool-call and reasoning traces

- Collapse multi-step tool calls and intermediate reasoning by default into a compact scannable summary (`3 tools · 1.4s`) that users can expand on demand.
- Label every step with explicit semantic state (`running`, `completed`, `failed`, `needs-approval`) using text + icon, never color or spinner alone.
- Show real tool inputs/outputs or elapsed time only when actually emitted by the backend; never fabricate fake "thinking..." steps or artificial typing delays.

## Human-in-the-loop approval gates

- Before an agent executes an irreversible, financial, credential-touching, or external side effect (sending email, deleting records, pushing code, charging payment), render an explicit inline approval card naming the exact action, target, and parameters with `Approve` and `Decline` buttons.
- Support modifying parameters or declining with feedback without resetting the conversation.
- Ensure approvals are idempotent: disable/mark the card resolved once acted upon so double-clicks or page refreshes cannot re-trigger the side effect.

## Split artifact / canvas workbench

- When an assistant generates substantial structured output (documents, code, tables, previews), open a side-by-side artifact pane on wide viewports (and a full-height sheet/tab on mobile) instead of trapping long artifacts inside narrow chat bubbles.
- Preserve independent scroll positions for the conversation thread and the artifact pane.
- Provide `Copy`, `Download`, version selector (`v1`, `v2`), and `Preview` / `Code` / `Diff` toggles where applicable, with explicit visual indication of which turn produced the active version.

## Grounded citations, trust calibration, and scaffolded agency

- Render source citations as interactive inline references that open or highlight the exact supporting excerpt and source URL/file path.
- Never invent citations, confidence percentages, or tool results. When a tool fails or evidence is missing, state the gap plainly and offer the next concrete recovery action.
- **Prevent automation bias ("toxic trust")**: polished AI-generated layouts, forms, or summaries can lull users into rubber-stamping wrong values. Before consequential commitments, surface concise inline rationale/provenance (*why* the agent chose a field value, plan, or layout) and make defaults visibly editable.
- **Scaffolded agency (preserve spatial memory)**: when an agentic or generative UI synthesizes dynamic widgets or panels, keep primary navigation, global status, and exit/undo controls anchored in invariant positions so users do not lose orientation between turns.

## Verification checklist

- [ ] Scrolling up during active token streaming immediately stops auto-scroll and shows a jump-to-bottom control;
- [ ] `Stop` aborts streaming cleanly without corrupting state or losing partial output;
- [ ] Tool-call / reasoning panels are keyboard-toggleable and never flood `aria-live`;
- [ ] Destructive/external tool calls pause behind an explicit, idempotent approval card;
- [ ] Artifact split-pane degrades cleanly to a single-column sheet/tab at `390px` with zero horizontal overflow.
