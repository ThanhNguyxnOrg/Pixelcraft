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

## Do/don't pairs

| Do | Don't |
|---|---|
| Show prorated charge due today and next invoice total before confirming | Charge a saved card silently when a user toggles a paid add-on or invites a seat |
| Let non-billing members request an upgrade from their workspace admin | Show a dead-end "Upgrade now" checkout button that errors on permissions |
| Preserve drafts and data read-only during trial expiry or dunning grace | Delete user data immediately on the first failed renewal attempt |
| Provide self-serve cancellation with clear end-of-period access date | Bury cancellation in 5 guilt-trip confirmation dialogs or phone-only traps |

## Verification

Test monthly/annual toggle math, mid-cycle seat addition proration, downgrade over-quota checks, non-admin paywall paths, usage meter 0%/80%/100%/overage states, failed-payment banner dismissal and recovery, cancellation confirmation and undo-before-period-end, localized currency formatting, and keyboard/screen-reader accessibility of comparison tables.
