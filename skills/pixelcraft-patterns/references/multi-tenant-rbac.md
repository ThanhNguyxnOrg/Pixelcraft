# Multi-tenant workspaces, RBAC, SSO/SCIM, API keys, and audit logs

Enterprise and team products fail silently when tenant boundaries blur or privilege changes lack visibility. Make context, permissions, credentials, and audit trails unmistakable.

## Tenant and workspace switching

- Display the active **Organization / Workspace** persistently in the primary shell chrome with a distinct name/avatar/environment badge (`Production`, `Staging`, `Sandbox`) so operators never execute writes in the wrong tenant.
- Workspace switchers must support keyboard search when users belong to many tenants, indicate pending invites and role per tenant, and reset or scope active tabs, filters, drafts, and cached client data cleanly upon switching—**never leak objects or toast notifications across tenant boundaries**.
- When opening a deep link belonging to another tenant the user can access, offer a clear context-switch prompt ("This resource belongs to Acme EU — switch workspace?") instead of a generic 404.

## RBAC / ABAC permission matrix editors

- Separate **built-in roles** (Owner, Admin, Editor, Viewer — clearly marked read-only) from **custom roles** with clone-from-base starting points.
- Structure permission editors by domain resource × capability (`Projects: Read / Create / Edit / Delete`, `Billing: View / Manage`) rather than flat lists of backend scopes (`proj:w_all`).
- Explain **inherited vs explicit** permissions (e.g., granted via Team/Group membership or ABAC attribute rule) and prevent admins from accidentally locking out the last Organization Owner.
- Show an explicit impact preview before saving a role edit ("Affects 14 members across 3 groups").

## SSO / SCIM admin setup

- Guide SAML 2.0 / OIDC configuration as a verifiable checklist: copyable ACS URL / Entity ID -> IdP metadata/cert upload -> **Test connection in dry-run mode** -> enable optional SSO -> enforce mandatory SSO only after test succeeds.
- Preserve a documented break-glass owner sign-in or recovery code path so an expired IdP certificate never bricks the organization.
- For SCIM directory sync, display last sync timestamp, synced user/group counts, deprovisioning policy (suspend vs delete), and concrete per-record sync error logs.

## API keys and webhook management

| Surface | Mandatory safety & UX rules |
|---|---|
| **API keys / PATs** | Require descriptive name, least-privilege scopes, and expiration date; reveal the secret **exactly once** on creation with explicit copy confirmation and warning; afterward display only prefix/last-4, owner, scope summary, created date, last-used timestamp, and instant `Revoke` with blast-radius confirmation. |
| **Webhooks** | Display target URL, subscribed events, signing-secret rotation (with dual-secret overlap window), delivery history log (HTTP status, latency, request/response payload preview), manual redeliver/replay, and auto-disable warning after consecutive failures. |

## Audit logs

- Design audit logs as forensic instruments: immutable chronological table with UTC + local hover timestamp, actor (human user, API key, SCIM, or system automation), IP/user-agent, action verb, target resource ID/name, outcome (`Success` / `Denied` / `Failed`), and expandable **before/after JSON or field diff**.
- Support fast filtering by date range, actor, action category, resource ID, and outcome, plus verified CSV/JSON export with filter provenance and retention-window disclosure ("Logs retained for 365 days under Enterprise plan").

## Do/don't pairs

| Do | Don't |
|---|---|
| Flush tenant-scoped caches and drafts when switching workspaces | Show Tenant A's search results or notifications inside Tenant B |
| Test SSO connection in dry-run before enforcing mandatory SSO | Lock out all org admins immediately on a typoed SAML certificate |
| Show API secrets once on creation and track `last_used_at` | Display plaintext long-lived API secrets indefinitely in settings |
| Show before/after field diffs and actor identity in Audit Logs | Emit unsearchable text blobs like `"settings updated"` with no diff |

## Verification

Test cross-tenant deep links, workspace switch cache isolation, custom role permission inheritance, last-owner lockout guard, SSO dry-run failure states, one-time API key reveal and revocation, webhook delivery failure + replay, audit log filtering/export at high row counts, and read-only member views.
