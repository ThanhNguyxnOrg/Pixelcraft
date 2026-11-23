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

## Rules

- Do not use spinners as the only answer. Choose stable layout, progressive content, or explicit task state based on duration/context.
- “Empty” is not an error unless the user expected required data.
- Error copy must say what happened, what was preserved, and how to proceed.
- Simulate slow network, cancellation, token expiry, malformed data, and concurrency where feasible; otherwise label `not-checked`.
