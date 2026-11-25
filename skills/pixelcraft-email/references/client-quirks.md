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

- **102 KB clipping ceiling (`< 80 KB` safety target)**: Gmail clips the `text/html` MIME part strictly at **102 KB** (`104,448` UTF-8 bytes including whitespace, MSO comments, and ESP click-tracking URL rewrites), replacing the bottom of the email with `[Message clipped] View entire message` and hiding legal/unsubscribe footers plus open pixels. Target **`< 80 KB` compiled HTML** before ESP link wrapping.
- **`<style>` size limit (~8–16 KB)**: Gmail webmail drops `<style>` blocks exceeding ~16 KB (and Gmail mobile apps drop around ~8 KB); keep `<style>` minimal and inline critical properties.
- **Full `<style>` stripping on syntax errors**: any unsupported rule or syntax error inside `<style>`—including Tailwind v4 `@layer`, native CSS nesting, `@property`, or unclosed declarations—causes Gmail to discard the **entire** `<style>` block.
- **GANGA (Gmail Apps with Non-Google Accounts)**: IMAP/POP accounts opened in Gmail iOS/Android strip `<style>` blocks completely; layout, typography, spacing, and contrast must survive inline-only.
- **Image proxying & threading**: Gmail proxies remote images (requiring public HTTPS URLs) and groups threads; lead every message with clear subject, preheader, and opening live text.

## 3-Regime Dark Mode Matrix

Email clients handle dark mode across **three incompatible regimes**. Never assume `@media (prefers-color-scheme: dark)` works everywhere:

| Regime | Representative clients | Color behavior | `@media (prefers-color-scheme: dark)` | Survival strategy |
|---|---|---|---|---|
| **1. No change** | Gmail Web (default), Yahoo Mail Web, legacy desktop webmail | Renders authored light/dark hex colors verbatim | Ignored | Authored baseline palette must have `>= 4.5:1` contrast with zero reliance on dark-mode CSS |
| **2. Partial color inversion / CSS opt-in** | Apple Mail (macOS/iOS), `Outlook.com` / New Outlook, `Gmail iOS` (partial surface rewrite) | Inverts light surfaces & dark text selectively; Apple Mail honors CSS dark media queries; Outlook exposes `[data-ogsc]` / `[data-ogsb]` | Honored in Apple Mail; Outlook uses `[data-ogsc]` / `[data-ogsb]` | Declare `<meta name="color-scheme" content="light dark">`, `@media (prefers-color-scheme: dark)` overrides with `!important`, `[data-ogsc]`/`[data-ogsb]` hooks, and `.light-img` / `.dark-img` swaps |
| **3. Full forced inversion** | `Gmail Android`, `Classic Outlook for Windows` (Dark Mode) | Algorithmically inverts **all** light backgrounds to `#121212`–`#1e1e1e` and dark text to light gray, **ignoring CSS media queries** | **Ignored** | Avoid pure `#000000` / `#ffffff` glare (use `#111827` on `#f8fafc` / `#ffffff`), and protect dark transparent PNG logos/icons with a **`1–2px` light keyline/halo or translucent light pill** so they never vanish on forced `#121212` backgrounds |

Dark-mode head boilerplate + dual-logo swap (with MSO hide guard so Classic Outlook never renders duplicate logos, plus light-pill fallback on the default logo for Regime 3):

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
    .bg-card { background-color: #1a1f26 !important; }
    .text-body { color: #f1f5f9 !important; }
    .light-img { display: none !important; }
    .dark-img { display: block !important; width: auto !important; max-height: none !important; overflow: visible !important; }
  }
  [data-ogsc] .text-body { color: #f1f5f9 !important; }
  [data-ogsb] .bg-card { background-color: #1a1f26 !important; }
  [data-ogsc] .light-img { display: none !important; }
  [data-ogsc] .dark-img { display: block !important; width: auto !important; max-height: none !important; overflow: visible !important; }
</style>

<!-- Default logo carries a subtle light keyline/pill so Regime 3 (Gmail Android / Classic Outlook) stays legible -->
<img class="light-img" src="https://example.com/logo-dark-with-keyline.png" width="132" height="32" alt="Acme" style="display:block;border:0;">
<!--[if !mso]><!-->
<div class="dark-img" style="display:none;overflow:hidden;width:0;max-height:0;mso-hide:all;">
  <img src="https://example.com/logo-light.png" width="132" height="32" alt="Acme" style="display:block;border:0;">
</div>
<!--<![endif]-->
```

- **Apple Intelligence inbox summaries**: iOS/macOS Mail generates AI summaries from opening live text, competing with manual preheaders. State sender, action, date, and amount plainly in the first real `<p>` instead of burying them in an image hero.

## 2025–2026 Bulk Sender Mandate (Gmail, Yahoo, Outlook.com)

Mailbox providers enforce strict protocol gates at the SMTP/inbox edge (especially at `>= 5,000` messages/day to Gmail/Yahoo/Outlook.com, and best practice for every production domain):

| Requirement | Concrete specification | Promotional / Bulk | Transactional (Receipts, OTPs, Alerts) |
|---|---|---|---|
| **Authentication & alignment** | `SPF` + `DKIM` (`>= 2048-bit` RSA or Ed25519) + `DMARC` (`p=quarantine` or `p=reject` recommended; strict/relaxed alignment with visible `RFC5322.From`), valid forward/reverse DNS (`PTR`) | Mandatory | Mandatory (isolate on a dedicated subdomain e.g. `tx.example.com` so marketing reputation never delays OTPs) |
| **One-click unsubscribe (`RFC 8058`)** | Both `List-Unsubscribe: <https://example.com/unsub?t=...>, <mailto:unsub@...>` AND `List-Unsubscribe-Post: List-Unsubscribe=One-Click`, plus a visible 1-click footer link; process within **`<= 48h` with zero login wall or survey gate** | **Mandatory** | **Omit** `List-Unsubscribe` on security/OTP/receipt mail—and **never** inject promotional cross-sells that reclassify transactional mail as marketing |
| **Spam complaint rate** | Monitor Google Postmaster Tools, Yahoo Sender Hub, and Microsoft SNDS | **`< 0.10%` target** (`>= 0.30%` triggers bulk rejection/spam routing) | `< 0.05%` expected |
| **Apple MPP analytics** | Apple Mail Privacy Protection pre-fetches tracking pixels via relay proxies regardless of whether the human opened the email | Measure **verified link clicks, conversions, and replies**; never trigger drip branches or purge lists solely from open pixels | Never use open pixels as delivery/read proof for legal or billing notices |
| **BIMI (optional brand trust)** | Enforced `DMARC` (`p=quarantine` or `p=reject`), square **SVG Tiny-PS** logo over HTTPS, and **VMC** / **CMC** certificate | Recommended | Recommended |

## Preheaders and interactive extensions

- **Preheader zero-width padding (`50–90` repeats / `~140+` chars)**: keep preview text concise (`40–90` chars) and follow it with **50–90 repeats** of `&#847;&zwnj;&nbsp;` (`~150–270` invisible characters). Repeating only 3–5 times pads ~12 characters and leaks `"View in browser"` or header `alt` text into 120–140 character inbox snippets:

```html
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;" aria-hidden="true">
  Invoice #2026-041 due 15 Dec — €1,420.50&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;<!-- repeat &#847;&zwnj;&nbsp; 50–90 times (~140+ chars) in compiled output -->
</div>
```

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

Record: client/app/version (**New Outlook** vs **Classic Outlook**, Gmail Web/iOS/Android, Apple Mail), OS/device, all 3 dark-mode regimes, images on/off, viewport width, zoom/text size, HTML byte size vs `< 80 KB` target / `102 KB` cap, plaintext parity, forwarded/quoted behavior, `RFC 8058` / `SPF` / `DKIM` / `DMARC` headers, and accessibility inspection. Label untested clients `not-checked`; never claim universal compatibility.
