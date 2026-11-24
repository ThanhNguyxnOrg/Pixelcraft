# Commerce: PLP, PDP, cart, checkout

Commerce UX is trust plus momentum. Never sacrifice price, availability, or policy clarity for visual novelty. This reference covers **retail and transactional e-commerce**; for SaaS subscriptions, usage metering, seat upgrades, and feature paywalls, read [billing-paywalls.md](billing-paywalls.md).

## Product listing pages (PLP)

- Show honest availability, unit/total price, variant swatches with text/accessible names, shipping/returns cues, and decision-relevant specs on each tile/row.
- Keep filter, sort, and pagination state visible, shareable (deep-linkable where supported), reversible, and preserved when returning from a PDP.
- When filtered results are empty, diagnose why and offer concrete one-action recovery (remove a restrictive filter, broaden price range, include out-of-stock)—never display only "No results."
- Preserve scroll position across pagination or load-more transitions and announce newly loaded counts or fetch failures clearly.

## Product detail pages (PDP)

- Lead with product identity, current variant price and stock status, truthful media, and the primary purchase action.
- Prevent impossible variant combinations cleanly (disable or clearly mark unavailable size/color pairings without resetting unrelated choices) and preserve user selections when inventory errors occur.
- Sizing guides, specs, ratings, and reviews require clear provenance and moderation context; never fabricate ratings, counts, or testimonials.
- Pair delivery estimates with location and cutoff-time qualifiers rather than vague promises.

## Cart and checkout

- Keep the cart editable without friction: quantity changes, variant switches, save-for-later, removal with immediate undo, and transparent updates for price changes, shipping fees, taxes, and promo codes.
- Checkout minimizes distraction without trapping users in a dead end; preserve all entered fields across validation failures, session refreshes, and guest-vs-account switches.
- Payment errors must distinguish 3DS/bank authentication failure, card decline, network timeout, and field validation without leaking sensitive card details or clearing valid inputs.
- Order confirmation must show order ID, current status, itemized total, delivery/access timeline, receipt path, and support/cancellation options.

## State matrix

| State | Required behavior |
|---|---|
| Out-of-stock variant | Keep variant inspectable with explicit status, restock alert or nearest alternative; never silently switch variants |
| Inventory race at checkout | Highlight exact affected line item, available quantity, and revised total before allowing retry |
| Promo code invalid/expired | State specific reason (expired, minimum spend unmet, ineligible category) while keeping cart intact |
| Tax/shipping recalculated | Announce updated total clearly before final payment commitment |
| Payment pending / timeout | Prevent duplicate charge with idempotency, disable double-submit, and confirm order status before asking to retry |

## Do/don't pairs

| Do | Don't |
|---|---|
| Disclose shipping, fees, and taxes before final checkout review | Surprise buyers with hidden fees on the final pay step |
| Support guest checkout with optional post-purchase account creation | Force account registration before entering shipping details |
| Show real stock counts only when backed by live inventory | Display fabricated "Only 2 left!" or resetting countdown timers |
| Preserve cart and form input across failed promo or payment attempts | Clear the entire checkout form on a single field validation error |

## Verification

Test out-of-stock variants, multi-currency and locale formatting, expired cart/promo codes, inventory race, payment decline vs timeout, paste/autofill/password-manager behavior, keyboard/touch flow, reduced motion, failed product imagery, fee transparency, and light/dark contrast.
