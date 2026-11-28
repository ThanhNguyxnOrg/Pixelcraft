# Feedback, response time, and perceived performance

Evidence: response-time limits, Core Web Vitals (INP / LoAF), streaming UX patterns, and state-hardening practice.

## Time budget and INP / LoAF

| Elapsed time | UX requirement |
|---|---|
| `≤ 100 ms` | Direct manipulation feels instantaneous; press/drag/focus feedback must appear here |
| `≤ 200 ms` (INP good) | Web **Interaction to Next Paint (INP)** ceiling; inspect **Long Animation Frames (LoAF, > 50 ms)** and yield to the main thread (`scheduler.yield()` / chunked rendering / web workers) before heavy synchronous work blocks paint |
| `≤ 400 ms` (Doherty) | User momentum stays intact for search, filters, tab switches, and optimistic updates; never insert artificial animation delays |
| `~1 s` | Flow stays uninterrupted; avoid modal blocking chrome or flashing progress indicators below ~200–300 ms |
| `> 10 s` | Outer attention boundary; show explicit progress or stage status, cancellation, and whether navigating away cancels work |

## Skeleton vs. spinner vs. progress rules

Choose the loading pattern by duration and layout predictability—never throw a full-page spinner at every fetch:

| Situation | Use | Do not use |
|---|---|---|
| Fast response (`< 200–300 ms`) | No loader (or subtle pressed state); delay indicator onset to avoid visual flash | Flashing skeleton/spinner that disappears in 1 frame |
| Structured page/list load (`300 ms – ~3 s`) | **Skeleton** matching real container geometry (`aria-busy="true"`, single polite announcement) | Generic centered spinner that causes severe CLS on hydrate, or skeletons with fake numbers |
| Single button / inline action | Inline button pending label + spinner inside fixed-width button (`aria-disabled="true"` preserving focus) | Replacing the entire screen with a backdrop overlay |
| Multi-second upload, export, or batch job (`> 2–3 s`) | **Determinate progress bar** (with bytes/items/step count) + Cancel control | Fake progress bar that stalls at 99% |
| Indeterminate multi-step backend work | **Stage list** (`Queued → Validating → Indexing`) + Cancel / background notice | Silent frozen button or bare looping spinner with no context |

## AI and streaming UX (TTFT vs. completion)

LLM and agentic tasks split latency into **Time to First Token (TTFT)** and **Total Completion Time**:

- **Acknowledge immediately (`< 100 ms`):** append the user's message optimistically, focus/scroll cleanly, and indicate connection or tool execution before the first token arrives.
- **Keep reading stable during streaming:** stream into reserved/growing containers without shifting controls above the stream; disable auto-scroll the moment the user scrolls upward and offer a “Jump to latest” control.
- **Separate thinking/tools from answer:** show tool invocations or reasoning summaries in compact collapsible status blocks so users know progress is real without drowning the final answer.
- **Make stop/cancel first-class:** stopping mid-stream preserves generated text, stops billing/network traffic, and keeps the input ready for immediate correction.

## Optimistic UI and rollback race conditions

Optimistic updates improve perceived speed only when reconciliation is race-safe:

- **Tag every mutation with a monotonic client token/version** so a slow response from mutation #1 cannot overwrite the newer optimistic state of mutation #2.
- **Mark unconfirmed state subtly** when financial, collaborative, or offline stakes are high (e.g., pending sync badge).
- **Preserve user edits on failure:** if an optimistic edit rolls back, do not wipe what the user typed—restore the previous committed value clearly OR keep the failed draft editable with a one-click Retry and an explicit notice explaining what failed.
- **Guard double-submit & idempotency:** disable duplicate dispatch with an idempotency key while keeping keyboard focus intact.

## Peak-end confirmation, toast timers, and rage-click prevention

- **Peak-end inline `success` state:** for frequent low-stakes completions (copy, save, bookmark, toggle, inline edit), show a crisp inline `✓` confirmation right at the trigger control (`"Copied ✓"`, `"Saved ✓"`) without jarring page navigation or modal interruption, then settle cleanly back to the resting label while keeping control width stable.
- **Zero rage-clicking:** prevent repeated frustrated taps/clicks caused by ambiguous affordances or silent latency:
  - Distinguish interactive controls unambiguously from static badges, chips, or cards (clear hit area, hover/focus/pressed cues, and platform cursor/elevation semantics).
  - Render instant press/pending feedback within `≤ 100 ms` and lock duplicate dispatch via idempotency while preserving keyboard focus so slow responses never appear dead.
- **Toast auto-dismiss & stacked hover ergonomics:**
  - **Pause auto-dismiss timers whenever the tab/window is hidden or backgrounded** (e.g., `visibilitychange` / `document.hidden` on web, or app foreground/background lifecycle hooks on native mobile/desktop) as well as while hovered or keyboard-focused, so users returning to the app never miss transient confirmations or undo windows.
  - **Bridge hover gaps between stacked toasts** (use inner padding or a contiguous hit-bridge wrapper rather than dead pointer margins between toast cards) so moving the pointer from one toast to the next does not resume dismissal or collapse the stack mid-travel.
- **Confirmation pages & completion receipts:** for significant submissions (orders, bookings, applications, support tickets), end on a dedicated confirmation state that displays a durable **reference number**, concise summary of what succeeded, and an explicit **"What happens next"** block (expected timeline, notification channel, and next useful action)—never a bare `"Done"` or `"Success"` dead end.

## Destructive feedback and perceived performance

- Use **undo** instead of confirmation whenever reversal is cheap and reliable (`Deleted "Q3 Draft" · Undo` toast with generous timeout and keyboard access). Reserve modal confirmation for irreversible, high-cost, ambiguous, or externally visible destruction.
- Name the exact object and consequence in destructive copy: “Delete 14 invoices” not “Are you sure?”
- Prioritize primary content/action over decorative media and below-fold assets; reserve media dimensions (`width`/`height`/`aspect-ratio`) to keep CLS near `0`.
- Measure or inspect the actual interactive path (startup, route transition, INP/LoAF traces, scroll/jank, image decode, API wait). A high synthetic Lighthouse score alone does not prove responsive interaction.
