# State matrix template

Evidence: hardening/state coverage practice, usability heuristics, and response/robustness requirements.

Create this matrix for every meaningful view/component. Delete only rows proven irrelevant, and record why.

| State | Required design answer |
|---|---|
| initial/loading | immediate acknowledgement; stable skeleton/structure; no fake content |
| skeleton | approximate layout mass without mimicking false facts; screen-reader appropriate |
| optimistic | distinguish unconfirmed state, rollback failure visibly, preserve corrective action |
| empty first-use | explain value + primary creation/import/sample action |
| empty no-results | show query/filter context, useful broadening/clear action |
| empty cleared | acknowledge removal; undo if possible; next useful action |
| partial data | identify what is missing/stale; do not render gaps as zero/false |
| error validation | field/problem/recovery-specific message; preserve input |
| error server/system | plain-language cause boundary; retry/support/correlation detail as appropriate |
| offline | cached/stale indication; queue or block explicitly; preserve draft |
| permission needed | explain benefit/need before prompt; provide non-permission fallback |
| permission denied | explain consequence and exact settings recovery without shame |
| success | what happened, next consequence/action; avoid dead-end modal |
| disabled | reason visible or inferable; how/when enabled; tooltip not sole carrier |
| zero | distinguish absent, none allowed, none yet |
| one | avoid awkward plural/empty controls; direct edit/detail path |
| many | pagination/virtualization/filter/grouping; maintain selection/context |
| long content | wrap/truncate deliberately with expansion/copy path; no overlap |
| missing asset/data | meaningful fallback, no broken image/icon |
| interruption | autosave/draft/resume semantics; no duplicated side effects |
| resume/deep link | correct entity/step/filter/scroll/permission context |
| concurrency | lock/merge/version conflict behavior; show freshness/ownership |
| duplication/retry | idempotency, double-submit prevention, status visibility |
| background/expired | session/auth expiry with data preservation and reauthentication |

## AI, streaming, and agentic states

Include these rows whenever a surface streams LLM output, invokes tools, or executes agent actions:

| State | Required design answer |
|---|---|
| streaming tokens | acknowledge request immediately; stream incrementally without reflow jitter; pause auto-scroll if the user scrolls up to read; render partial markdown/code fences safely |
| stop / abort | expose a keyboard-reachable Stop/Cancel control throughout generation; keep partial output visible and allow editing, copying, or resuming from the prompt |
| tool-call progress | name the active tool/action and target concisely (`Searching invoices…`); distinguish running, succeeded, and failed tool steps with expandable inputs/outputs |
| approval pending (HITL) | before side effects (write, delete, send, spend), present exact scope, diff/preview, and explicit Approve / Edit / Reject controls with safe focus defaults |
| citation / provenance fallback | bind claims to verifiable source links/snippets; when grounding is absent or partial, mark unverified/unavailable provenance explicitly instead of fabricating citations |
| undo of agent action | expose rollback/checkpoint/revert for state mutations with clear summary of what will be restored; require upfront approval when an action is irreversible |
| rate-limit / context-limit | explain whether the limit is transient (show retry-after / backoff) or context-window overflow (offer trim/summarize/start-new-thread); always preserve the user's unsent prompt |

## Rules

- Do not use spinners as the only answer. Choose stable layout, progressive content, or explicit task state based on duration/context.
- “Empty” is not an error unless the user expected required data.
- Error copy must say what happened, what was preserved, and how to proceed.
- Simulate slow network, cancellation, token expiry, malformed data, streaming interruption, and concurrency where feasible; otherwise label `not-checked`.
