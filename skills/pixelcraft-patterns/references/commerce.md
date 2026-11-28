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
- **Show concrete Delivery Dates instead of shipping-speed jargon:** display `"Arrives Thu, Apr 4"` or `"Estimated delivery: Thu, Apr 4 – Fri, Apr 5"` (computed from fulfillment + carrier transit) rather than internal shipping speeds like `"4–7 business days"`.
- **Display real order cutoff times as a live countdown:** when backed by actual warehouse cutoff logic, show `"Order within 43 min for delivery tomorrow"` in the shopper's local context rather than static foreign timezones like `"Order by 2:00 PM EST"` (never fabricate resetting scarcity timers).

## Cart and checkout

- **Cart quantity controls:** provide **`− / +` stepper buttons paired with an open numeric input field** so shoppers can tap for small adjustments or type/paste arbitrary quantities directly without repeated clicks or dropdowns capped at `10`.
- Keep the cart editable without friction: variant switches, save-for-later, removal with immediate undo, and transparent live updates for price changes, shipping fees, taxes, and promo codes. **Omit redundant `"Apply"` buttons** on straightforward choices (auto-apply shipping method selection, saved address switches, and debounced/blurred quantity edits; reserve explicit submit buttons for promo codes and final order placement).
- **Unify all fulfillment options in one selector:** present delivery, local courier, and in-store/curbside pickup inside a single unified selector comparing concrete delivery/pickup dates and cost side by side rather than splitting pickup into a separate hidden flow.
- **Allow gift designation in both cart and checkout** when gifting is offered (gift receipt, hidden prices, gift wrap/note) so buyers never have to backtrack out of checkout to mark a gift.
- **Collapse completed accordion steps into readable summaries:** in multi-step accordion checkouts, collapse finished steps into concise summaries (shipping address, chosen fulfillment + delivery date, masked payment method) with an explicit `Edit` button per step so shoppers can review accuracy at a glance.
- **Save optional account creation for the Confirmation step:** never interrupt mid-checkout with forced registration or account-creation gates. Let buyers check out as guests and offer one-step optional account creation *after* purchase on the Confirmation step (pre-filling the email/name already entered).
- Checkout minimizes distraction without trapping users in a dead end; preserve all entered fields across validation failures, session refreshes, and guest-vs-account switches.
- Payment errors must distinguish 3DS/bank authentication failure, card decline, network timeout, and field validation without leaking sensitive card details or clearing valid inputs.
- Order confirmation must show order ID/reference number, current status, itemized total, concrete delivery/access timeline + "What happens next", optional one-step account creation, receipt path, and support/cancellation options.

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
| Save optional account creation for the **Confirmation step** (pre-filled) | Interrupt mid-checkout with forced account registration |
| Display concrete **Delivery Dates** (`"Arrives Thu, Apr 4"`) and real local cutoff countdowns (`"Order within 43 min"`) | Show vague `"4–7 business days"` or static foreign timezones (`"2:00 PM EST"`)—or fake resetting urgency timers |
| Pair **`− / +` steppers with an open numeric input** and auto-apply shipping/quantity changes | Force dropdown quantity menus or redundant `"Apply"` / `"Update cart"` clicks |
| Unify delivery, local courier, and store pickup in one selector; collapse completed checkout steps into editable summaries | Fragment store pickup into a separate flow or force long unscannable forms without step summaries |
| Allow gift options in both cart and checkout (when gifting is offered) | Hide gift checkboxes in only one step, forcing checkout abandonment |
| Show real stock counts only when backed by live inventory | Display fabricated "Only 2 left!" scarcity banners |
| Preserve cart and form input across failed promo or payment attempts | Clear the entire checkout form on a single field validation error |

## Verification

Test out-of-stock variants, concrete delivery dates and real cutoff countdown updates, `− / +` stepper plus typed numeric quantity edits, unified delivery/pickup switching, accordion summary edit-and-return, confirmation-step account creation, gift options in both cart and checkout, multi-currency and locale formatting, expired cart/promo codes, inventory race, payment decline vs timeout, paste/autofill/password-manager behavior, keyboard/touch flow, reduced motion, failed product imagery, fee transparency, and light/dark contrast.
