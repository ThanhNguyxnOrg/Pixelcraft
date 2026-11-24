# Email client quirks

Treat this as verification guidance, not immutable truth. Client engines evolve—recheck current support on Can I email (`caniemail.com`) and real client previews before release.

## Outlook: New Outlook vs Classic Outlook

Never treat "Outlook on Windows" as a single engine. During the 2026–2029 enterprise sunset transition, corporate inboxes split across two incompatible renderers:

| Client | Rendering engine | `<!--[if mso]>` & VML | Practical rule |
|---|---|---|---|
| **New Outlook for Windows** | WebView2 / Chromium (shares core with Outlook on the web) | **ignored** (comments stripped/skipped, VML does not render) | modern CSS mostly works, distinct dark-mode rewrites (`[data-ogsc]`/`[data-ogsb]`); never rely on VML-only buttons or backgrounds |
| **Classic Outlook for Windows** | Microsoft Word HTML engine (enterprise sunset 2026–2029) | **executed** | weak flex/grid/margin/`border-radius`/CSS-background support; requires table cells, explicit widths, inline CSS, and narrowly scoped MSO/VML fallbacks |

Rules:

- **Dual-safe CTAs**: render a real styled HTML `<a>` inside a table cell for New Outlook and modern clients, wrapped in `<!--[if !mso]><!--> ... <!--<![endif]-->` only if a separate `<!--[if mso]>` VML `<v:roundrect>` fallback is needed—never hide the HTML fallback from New Outlook;
- test **both** New Outlook and Classic Outlook; a VML-only CTA or VML-only hero background renders as invisible or blank in New Outlook.

## Gmail / Google clients

- **102 KB clipping limit**: Gmail clips the HTML MIME part at **102 KB** (UTF-8 bytes including indentation, comments, and ESP click-tracking URL rewrites), replacing the bottom of the email with `[Message clipped] View entire message` and hiding unsubscribe/legal footers. Budget compiled HTML under ~85–90 KB before ESP link wrapping.
- **`<style>` size limit (~8–16 KB)**: Gmail webmail drops `<style>` blocks exceeding ~16 KB (and Gmail mobile apps drop around ~8 KB); keep `<style>` minimal and inline critical properties.
- **Full `<style>` stripping on syntax errors**: any unsupported rule or syntax error inside `<style>`—including Tailwind v4 `@layer`, native CSS nesting, `@property`, or unclosed declarations—causes Gmail to discard the **entire** `<style>` block.
- **GANGA (Gmail Apps with Non-Google Accounts)**: IMAP/POP accounts opened in Gmail iOS/Android strip `<style>` blocks completely; layout, typography, spacing, and contrast must survive inline-only.
- **Image proxying & threading**: Gmail proxies remote images (requiring public HTTPS URLs) and groups threads; lead every message with clear subject, preheader, and opening live text.

## Apple Mail, iOS, and Dark Mode

Opt into dark mode deliberately in `<head>` and `<style>`:

```html
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<style>
  :root { color-scheme: light dark; supported-color-schemes: light dark; }
  a[x-apple-data-detectors] {
    color: inherit !important; text-decoration: none !important;
    font-size: inherit !important; font-family: inherit !important;
    font-weight: inherit !important; line-height: inherit !important;
  }
  @media (prefers-color-scheme: dark) {
    .bg-page { background-color: #121417 !important; }
    .text-body { color: #f1f5f9 !important; }
  }
  [data-ogsc] .text-body { color: #f1f5f9 !important; }
  [data-ogsb] .bg-page { background-color: #121417 !important; }
</style>
```

- **Apple Mail & iOS dark mode**: honors `@media (prefers-color-scheme: dark)` when `<meta name="color-scheme">` is present; use `!important` to override inlined light colors.
- **Outlook dark mode**: Outlook.com, New Outlook, and Outlook mobile rewrite inline colors and expose `[data-ogsc]` (text color) and `[data-ogsb]` (background) attribute hooks.
- **Forced inversion (Gmail mobile, Outlook Windows)**: clients may invert colors without honoring media queries. Avoid pure `#000000`/`#ffffff` glare, give dark transparent logos a subtle light outer glow/backing or swap light/dark assets, and verify contrast after forced inversion.
- **Apple Mail Privacy Protection (MPP)**: Apple pre-fetches remote images via proxy servers, inflating open counts and masking IP/time-of-open. Never gate product logic or dynamic real-time images on open-pixel fetches.
- **Apple Intelligence inbox summaries**: iOS/macOS Mail generates AI summaries from opening live text, competing with or replacing manual preheaders. State the sender, action, date, and amount plainly in the first real text paragraph instead of burying them in an image hero.

## Deliverability, headers, preheaders, and interactive standards

- **Preheader zero-width spacer**: keep preview text concise (40–90 chars) and follow it with repeated hidden zero-width fillers so inbox lists do not pull header links or legal copy into the snippet:

```html
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;" aria-hidden="true">
  Invoice #2026-041 due 15 Dec — €1,420.50
  &#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
</div>
```

- **RFC 8058 One-Click Unsubscribe**: bulk senders (required by Gmail, Yahoo, and Microsoft) must include both `List-Unsubscribe: <https://example.com/unsub?token=...>` and `List-Unsubscribe-Post: List-Unsubscribe=One-Click` headers alongside a visible footer unsubscribe link; the endpoint must process `POST` immediately without requiring login.
- **BIMI (Brand Indicators for Message Identification)**: displaying a verified sender logo in Gmail/Apple Mail requires enforced DMARC (`p=quarantine` or `p=reject`), a square **SVG Tiny-PS** logo hosted over HTTPS, and a **VMC** (Verified Mark Certificate) or **CMC** (Common Mark Certificate) where required by the mailbox provider.
- **AMP for Email (`text/x-amp-html`)**: optional third MIME part (`text/plain`, `text/html`, `text/x-amp-html`) for interactive state in Gmail/Yahoo/Mail.ru. Requires SPF/DKIM/DMARC + sender approval, expires after ~30 days, and is ignored by Apple Mail and Outlook—always preserve full functional parity in `text/html` and `text/plain`.

## Email accessibility rules

- Set `lang="en"` (or exact BCP-47 locale) and `dir="ltr"` / `"rtl"` on `<html>` AND repeat `dir` on the main container table (some webmail clients strip `<html>` attributes).
- Include a descriptive `<title>` (announced by screen readers in webmail and browser views).
- Add `role="presentation"` (or `role="none"`) to **every** layout `<table>` so assistive technologies do not announce table row/column grids; leave real tabular data tables with semantic `<th>` headers and no `role="presentation"`.
- Mark decorative spacer cells, zero-width preheader blocks, and visual dividers with `aria-hidden="true"`, and set `alt=""` on purely decorative images.
- Use real semantic headings (`<h1>`–`<h3>`) and `<p>` elements with inline typography instead of raw `<td>` text blocks or deprecated `<font>` tags.

## Image blocking and plaintext parity

- Assume images may never load: essential copy, CTA, dates, amounts, and links must be live HTML text; alt text must convey meaning rather than filenames.
- Plaintext (`text/plain`) is a first-class surface: preserve reading order, absolute URLs, dates/time zones, legal/preference/unsubscribe links, and clear section breaks generated from the same data model as HTML.

## Verification matrix

Record: client/app/version (including **New Outlook** vs **Classic Outlook**), OS/device, light/dark mode, images on/off, viewport width, zoom/text size, HTML byte size vs Gmail 102 KB cap, plaintext parity, forwarded/quoted behavior, RFC 8058 headers, and accessibility inspection. Label untested clients `not-checked`; never claim universal compatibility.
