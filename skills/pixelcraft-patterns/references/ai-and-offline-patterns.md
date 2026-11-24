# In-app AI patterns and offline-first sync UX

Modern operational products increasingly blend **embedded AI assistance** (outside standalone chat) with **local-first / offline resilience**. Both fail when automation or background syncing hides system state from the user.

## Part 1: In-app AI and copilot product patterns

> **Cross-skill boundary:** Use this reference for **embedded AI capabilities inside product workflows** (search, inline authoring, NL-to-filter, autonomous suggestions, approval gates). For full conversational/agentic chat workspaces, streaming token lifecycles, tool-call traces, artifact split views, and hosted messaging bots, coordinate with `pixelcraft-chat-ui`.

### Embedded AI pattern matrix

| Pattern | Best fit | Mandatory trust & UX rules |
|---|---|---|
| **Semantic / hybrid search** | Docs, knowledge bases, large catalogs where users describe intent | Combine lexical + semantic results transparently; show *why* a result matched (highlighted snippet or source citation), preserve classic exact-match/filter fallback, and never fabricate answers when zero sources match. |
| **NL-to-filter / query builder** | Analytics, issue trackers, CRMs with complex query languages | Translate natural language into **visible, editable structured filter chips** (`status:open`, `created:>30d`) rather than running an opaque hidden query; let users inspect, tweak, or clear any chip. |
| **Inline AI command / authoring** | Document editors, email composers, code/SQL fields | Trigger deliberately (selection toolbar, slash command, or shortcut); stream proposed edits into a **preview/diff state** with explicit `Accept`, `Insert below`, `Refine`, and `Discard` (`Escape`) controls—never silently overwrite user prose. |
| **Background triage / suggestions** | Auto-categorization, duplicate detection, reply drafts, anomaly summaries | Clearly mark AI-generated labels/summaries with provenance and confidence or source links; keep suggestions reversible and dismissible; allow workspace admins to toggle AI features off cleanly. |
| **Agentic approval gates (Human-in-the-Loop)** | Any AI action that mutates external state (send email, refund, delete, deploy, run SQL write) | Pause before execution with an explicit action summary (exact parameters, target records, blast radius), require clear `Approve` / `Edit parameters` / `Deny`, and record both prompt and approver in the audit trail. |

### AI truthfulness & failure handling

- Distinguish **loading/thinking**, **streaming**, **grounded with sources**, **uncertain/insufficient evidence**, **rate-limited/quota exceeded**, and **model error** states clearly—always preserving the user's original prompt or selection for retry.
- Never replace deterministic UI controls (date pickers, exact filters, CRUD buttons) with a forced prompt box.

## Part 2: Offline-first, sync status, and conflict resolution UX

Products used on flights, field sites, unstable Wi-Fi, or local-first desktop/mobile workspaces must stay calm, predictable, and lossless across connectivity transitions.

### Calm sync indicators and offline outbox

- **Calm status indicator**: Stay quiet when healthy ("Saved" unobtrusive or icon-only on hover); surface visible state only on meaningful transitions: `Saving…`, `Offline — edits saved locally (3 pending)`, `Syncing 3 changes…`, or `Sync paused — action required`.
- **Transparent offline outbox**: Let users inspect queued mutations (pending messages, form submissions, uploads), see which items failed validation on reconnect, and retry or discard individual entries without blocking unrelated work.
- **Honest capability gating**: Keep cached read views and local-safe edits usable offline; clearly disable or label strictly online-only actions (live payment capture, real-time seat billing, external search) with a plain explanation ("Requires connection") rather than letting clicks spin into generic network errors.

### Conflict resolution and stale-app update prompts

| Sync scenario | Required UX behavior |
|---|---|
| **Non-overlapping edits** | Merge automatically (CRDT / field-level merge) and preserve both users' changes without interrupting flow. |
| **Irreconcilable field/file conflict** | Never silently overwrite remote or local data. Present a clear conflict banner or diff view showing **Your local version** vs **Latest server version** (with author and timestamp) and offer `Keep mine`, `Use server`, `Save both (duplicate copy)`, or field-level merge (see [history-diff-undo.md](history-diff-undo.md)). |
| **Auth expired while offline** | Keep the offline outbox intact locally; prompt re-authentication on reconnect and flush queued changes only after session recovery succeeds. |
| **Stale client / version update** | Show a non-destructive `"Update available — reload to apply"` banner instead of force-reloading mid-edit; block writes gracefully only if a breaking schema mismatch requires upgrading first, preserving local unsent drafts. |

## Do/don't pairs

| Do | Don't |
|---|---|
| Render NL-to-filter output as visible, editable filter chips | Run invisible AI-generated filters users cannot inspect or correct |
| Preview inline AI rewrites as a diff with `Accept` / `Discard` | Silently replace selected user text without undo or preview |
| Require explicit human approval before AI writes or external sends | Auto-execute destructive or billing-impacting tool calls silently |
| Queue offline edits visibly and resolve conflicts without data loss | Silently overwrite remote changes with last-write-wins or discard drafts on reconnect |

## Verification

Test NL-to-filter chip inspection and failure fallback, inline AI cancel/undo/error retention, approval gate deny/edit/approve flows, airplane-mode edit -> outbox -> reconnect flush, expired-token reconnect without losing queued edits, two-device offline conflict UI, and stale-app update prompts while a draft is dirty.
