# Email client quirks

Treat this as verification guidance, not immutable truth. Client behavior changes; recheck current support matrices before release.

## Outlook (Windows/Word rendering)

- Expect weak support for modern CSS, margin/precision layout, border radius/background images/flex/grid.
- Use table alignment, inline styles, explicit dimensions, MSO conditional comments only where justified.
- Buttons need bulletproof/fallback structure or robust table cells; decorative rounding is optional, meaning is not.
- Test dark mode/high contrast separately; color inversion can break imagery/logos.

## Gmail / Google clients

- Watch total HTML size because long messages may clip; keep source/content focused.
- Style stripping/embedded CSS support varies by client/surface; inline critical CSS.
- Image blocking/proxying affects dimensions/alt visibility/tracking.
- Promotions/threading/conversation grouping affect perceived order; subject/preheader/first visible copy matter.

## Apple Mail / iOS Mail

- Often supports more modern behavior but still test dark mode, remote content privacy, text scaling, notched/small screens, and image failure.
- Do not treat Apple-only rendering as proof because market/client mix differs.

## Dark mode

There is no single dark mode. Clients may invert colors partially, force backgrounds, leave images unchanged, or honor media queries inconsistently. Use transparent assets carefully, test logos/icons, avoid pure-black/white assumptions, and ensure semantic contrast survives mutation.

## Image blocking/privacy

- Assume images may not load initially or ever.
- Essential copy/CTA/date/amount/action must be real text.
- Alt text should communicate function/content, not filename.
- Do not use hidden tracking imagery as a substitute for consent-aware measurement; privacy features can distort metrics.

## Plaintext parity

Plaintext is a real interface: ordering, headings, URLs, list structure, dates/time zones, legal/footer links, preference/unsubscribe actions, and tone must make sense without HTML. Generate it from shared content where possible.

## RTL/localization/accessibility

Test expansion, bidi punctuation/mixed URLs/email addresses, locale formats, font fallback, alt translation, line wrapping, screen-reader reading order, link purpose, target size on touch clients, high contrast, and zoom. Never assume text direction inheritance is consistent across clients.

## Verification matrix

At minimum record: client/app/version, OS/device, light/dark, images on/off, viewport width, zoom/text size, plaintext/HTML, forwarded/not forwarded, link destination/expiry, clipping status. Anything not tested is `not-checked`; never claim “works in all clients.”
