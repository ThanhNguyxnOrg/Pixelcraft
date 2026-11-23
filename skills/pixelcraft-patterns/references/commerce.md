# Commerce: PLP, PDP, cart, checkout

Commerce UX is trust plus momentum. Do not sacrifice clarity for visual novelty.

## Product listing pages

- Show honest availability, price, variant state, shipping/returns signals, and comparison-relevant attributes.
- Filter/sort state must be visible, shareable where possible, reversible, and preserved on back navigation.
- Empty filtered results suggest concrete removals or broadening; never say only “no results.”
- Pagination/infinite scroll must preserve scroll position and announce loaded/error state.

## Product detail pages

- Lead with identity, price/variant availability, media truthfulness, and primary purchase action.
- Variant selection must prevent impossible combinations clearly and preserve selection when inventory errors occur.
- sizing/specs/reviews/ugc require source and moderation context; no invented ratings or testimonials.
- Delivery estimates need location/date qualifiers.

## Cart and checkout

- Cart is editable without punishment: quantity, variant, save-for-later, removal/undo, price changes, fees, taxes, discounts.
- checkout minimizes distraction but must not trap users in a dead end; preserve entered data across validation and session interruption.
- payment errors distinguish authentication, decline, network, and merchant validation without exposing sensitive details.
- confirmation includes order state, next action, support/recovery, receipt/access details.

## Verification

Test out-of-stock variants, price/currency/locale formatting, expired cart, inventory race, validation failure, paste/autofill/password manager behavior, keyboard/touch flow, reduced motion, image failure, transparent fees, and dark mode.
