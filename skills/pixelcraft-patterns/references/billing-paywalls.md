# SaaS billing, usage metering, and feature paywalls

Billing and entitlement UI sits directly on user trust and revenue compliance. Every charge, quota, upgrade, and cancellation path must be transparent, predictable, and free of dark patterns. For retail storefronts and one-time carts, see [commerce.md](commerce.md).

## Pricing tables and plan comparisons

- Distinguish **seat-based**, **usage/metered** (tokens, compute minutes, API calls, storage GB), and **hybrid** pricing explicitly—show the unit, billing cadence (monthly vs annual total, not just discounted per-month), currency, and tax/VAT note up front.
- When toggling Monthly / Annual, update both the unit rate and the billed-today total without hiding the lump-sum commitment.
- Highlight differences that affect real user decisions (quotas, SSO/RBAC, retention, support SLA) rather than padding 40 identical checkmark rows.
- Mark the user's **current plan** clearly and show concrete upgrade/downgrade consequences (what unlocks, what becomes read-only or capped).

## Proration, upgrades, and downgrades

- Always display a **proration preview** before committing a mid-cycle plan or seat change: unused credit from current period, prorated charge due today, next recurring invoice date, and recurring amount.
- When adding seats or billable collaborators, show the incremental cost *before* sending the invitation ("Adding 2 editors adds \$32/mo, \$18.40 prorated today").
- On downgrade, list exact features or quotas exceeding the target tier (e.g., "You currently have 7 active workspaces; Starter allows 3—choose which to archive") instead of failing silently or deleting data.

## Paywalls, trials, usage meters, and dunning

| Surface / state | Required UX behavior |
|---|---|
| **Soft paywall (in-context gate)** | Let users inspect the workflow or preview results, state which plan unlocks it, explain the specific value, and provide a dismissible path back without trapping navigation. |
| **Hard paywall (quota/entitlement block)** | Name the exact limit reached, show current consumption vs cap, preserve user work/drafts in place, and link non-admins to a one-click "Request upgrade from billing admin" flow. |
| **Trial & grace periods** | Show remaining days truthfully without alarming fake countdowns; clearly state whether a card is charged automatically or the workspace gracefully downgrades to read-only/free at expiry. |
| **Usage meters & overage alerts** | Display current usage, included allowance, reset date, projected trajectory (only if grounded in real run-rate), and configurable spend caps or threshold alerts (80% / 100%). |
| **Dunning / failed payment** | Show a calm, persistent workspace banner to billing admins (and non-intrusive notice to members only when service impact is imminent), explain exact retry schedule and grace deadline, and link directly to payment-method update without locking users out of exporting their data. |
| **Cancellation flow** | Make cancellation discoverable in Billing settings with clear effective end date (access kept through paid period), optional pause/downgrade offer at most once, optional non-blocking exit reason, and immediate email/on-screen confirmation. Never hide cancel behind support tickets when signup was self-serve. |

## Anti-dark-pattern subscription compliance (EU DSA Art. 25, US ROSCA, CA/MA ARL)

Treat subscription transparency and symmetric cancellation as a non-negotiable UX/engineering floor across recurring-billing surfaces (escalating final jurisdiction-specific legal wording to counsel):

| Compliance pillar | Concrete UI requirement | Forbidden dark pattern |
|---|---|---|
| **Conspicuous pre-billing disclosure** | Before payment entry, state clearly and visibly: exact recurring price, billing cadence (monthly/annual total), trial-to-paid conversion date and charge, automatic renewal behavior, and **how to cancel** | Burying auto-renewal terms or annual lump-sum totals inside collapsed fine print, tooltips, or linked Terms of Service |
| **Affirmative, un-prechecked consent** | Require explicit, **un-prechecked** affirmative consent to recurring billing / automatic renewal (separate from general ToS acceptance where required) | Pre-checked auto-renew boxes, silent trial-to-paid enrollment, or sneaking recurring add-ons into one-time purchases |
| **Post-sale confirmation & terms** | Immediately display on-screen and send a durable email/receipt containing plan name, recurring amount, renewal cadence/date, cancellation policy, and a **direct cancel / manage link** | Omitting renewal terms or cancel links from confirmation screens and welcome emails |
| **Same-channel cancellation as easy as signup** | Cancellation MUST work in the **exact same channel** as signup (online/in-app) with comparable step count and direct discoverability in Billing settings | **Roach Motel friction**: 2-click online signup paired with phone-only cancellation, support-ticket queues, hidden account paths, or multi-screen retention mazes |
| **Neutral, truthful copy & timing** | Use neutral factual labels (`Cancel subscription`, `Keep free plan`, `No thanks`) and real dates/deadlines only | **Confirmshaming** (`"No thanks, I prefer overpaying"`), asymmetric Accept/Reject button prominence, or fake resetting urgency timers |

## Do/don't pairs

| Do | Don't |
|---|---|
| Disclose price, renewal cadence, and cancellation method *before* payment entry | Hide recurring billing terms behind tiny links or post-submit receipts |
| Require un-prechecked affirmative consent to recurring charges and send a confirmation receipt with a direct cancel link | Pre-check auto-renewal boxes or omit cancellation instructions from receipts |
| Show prorated charge due today and next invoice total before confirming | Charge a saved card silently when a user toggles a paid add-on or invites a seat |
| Let non-billing members request an upgrade from their workspace admin | Show a dead-end "Upgrade now" checkout button that errors on permissions |
| Preserve drafts and data read-only during trial expiry or dunning grace | Delete user data immediately on the first failed renewal attempt |
| Provide same-channel self-serve cancellation as easy as signup, with clear end-of-period access date | Bury cancellation in 5 confirmshaming dialogs, support tickets, or phone-only Roach Motel traps |

## Verification

Test monthly/annual toggle math, conspicuous pre-billing disclosures before payment entry, un-prechecked recurring consent, post-sale confirmation terms + direct cancel link, same-channel cancellation parity vs. signup step count, mid-cycle seat addition proration, downgrade over-quota checks, non-admin paywall paths, usage meter 0%/80%/100%/overage states, failed-payment banner dismissal and recovery, cancellation confirmation and undo-before-period-end, zero confirmshaming or fake timers, localized currency formatting, and keyboard/screen-reader accessibility of comparison tables.
