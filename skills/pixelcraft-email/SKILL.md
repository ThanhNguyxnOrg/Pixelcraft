---
name: pixelcraft-email
description: Translates Pixelcraft direction, tokens, UX, and floor requirements into email that survives real clients. Use for HTML email, table-based email, MJML, React Email, Maizzle, Vue Email, Resend, Loops, AMP for Email, BIMI, transactional messages, newsletters, onboarding email, Outlook, Gmail clipping, dark mode, image blocking, plaintext parity, accessibility, localization, responsive behavior, client quirks, and deliverability-conscious design.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft email

Use this skill when the rendering surface is an email client. Email is not the modern web: CSS support is fragmented, images may be blocked, dark mode may mutate colors, and forwarding/clipping/rendering are outside your control.

## Surface craft

Make the subject and opening live text state who sent the message, why it matters and what to do next; use image-led moments only if the same path survives images off. Inspect a sent message in representative clients, with dark mode, narrow width and plain-text fallback. An attractive browser preview does not prove that email clients preserve contrast or links.

## Detection signals

`.mjml`, React Email / Vue Email / Svelte Email packages, `maizzle.config.*`, table-heavy HTML email, inline CSS tooling, ESP templates (Resend, Loops, Postmark, Stripo), plaintext templates, MIME generation, email screenshots/previews, localization catalogs.

## Translate direction with constrained fidelity

1. Preserve concept through hierarchy, typography fallback, spacing, real copy, restrained color, and signature structure—not fragile pixel precision.
2. Map tokens manually into inline/table-compatible values or generator constants. CSS variables are unreliable across clients.
3. Choose implementation: hand-written tables for maximum control, MJML for responsive abstraction, React Email (or Vue/Svelte Email) for component workflow, or Maizzle for Tailwind CSS inlining and purging. Do not pretend they produce identical client support automatically.
4. Design image-off and plaintext as first-class variants, not fallbacks written afterward.
5. Use progressive enhancement: modern clients may receive polish; baseline must remain readable/actionable everywhere.

## Platform-wide rules

- **Zero external dependency for core meaning**: primary message and CTA must work without images, custom fonts, CSS backgrounds, animation, JavaScript, forms, or exact viewport control.
- **Compiled HTML byte budget**: keep compiled HTML **`< 80 KB` safety target** (hard Gmail clip ceiling **`102 KB`** including whitespace and ESP click-tracking URL rewrites) so `[Message clipped]` never hides legal or unsubscribe footers.
- **Bulletproof Dual-Engine CTAs & padded preheaders**: pair `<!--[if mso]><v:roundrect>` with `<!--[if !mso]><!--><table role="presentation"><tr><td bgcolor="..." style="border-radius:..."><a>` so buttons survive both Classic Outlook (Word) and New Outlook (WebView2); pad hidden preheaders with 50–90 repeats (`~140+` chars) of `&#847;&zwnj;&nbsp;`.
- **3-Regime Dark Mode survival**: design simultaneously for (1) **No change**, (2) **Partial inversion / CSS opt-in** (`Apple Mail`, `Outlook.com` / `New Outlook`, `Gmail iOS`), and (3) **Full forced inversion** (`Gmail Android`, `Classic Outlook Windows`). Declare `color-scheme: light dark`, wire `.light-img`/`.dark-img` swaps where supported, and add a **subtle light keyline/halo (`1–2px`) or translucent pill** around dark logos/icons so forced `#121212` backgrounds never swallow brand marks.
- **2025–2026 Bulk Sender Mandate (Gmail, Yahoo, Outlook.com)**:
  - Authenticate with aligned **`SPF` + `DKIM` (`>= 2048-bit`) + `DMARC` (`p=quarantine` or `p=reject`)**; optionally add **`BIMI`** (`SVG Tiny-PS` + VMC/CMC) for verified sender avatars.
  - Include **`List-Unsubscribe` + `List-Unsubscribe-Post: List-Unsubscribe=One-Click` (`RFC 8058`)** honored within **`<= 48h` with zero login wall** on all promotional/bulk mail, and keep transactional mail (receipts, OTPs, security alerts) strictly free of marketing upsells.
  - Hold Postmaster spam complaint rates **`< 0.10%` target** (**`0.30%` hard block**).
  - Account for **Apple Mail Privacy Protection (MPP)** proxy pre-fetches: never treat open pixels as human reads or gate workflows on opens; measure clicks, replies, and conversions.
- **Plaintext & accessibility parity**: ship a complete `text/plain` MIME companion matching HTML order, URLs, dates, and unsubscribe/legal text; set `lang`, `dir`, `<title>`, semantic `<h1>`–`<h3>`/`<p>`, `alt` text, and `role="presentation"` on every layout `<table>`.

## Anti-lazy-default & anti-slop guard

- **Never paste modern-CSS web layouts into email**: raw `display: flex`, CSS Grid, `position: fixed`, CSS custom properties, and uninlined utility sheets shatter in Classic Outlook (Word engine), strip `<style>` blocks in strict clients, and bloat past Gmail's 102 KB clip threshold.
- **Pick an explicit email pipeline first**: commit to **MJML**, **React Email**, **Maizzle**, or hand-authored **HTML tables** (with MSO conditional comments) before writing markup.
- **Reject image-only hero blasts and bare `<a>` buttons**: never hide headlines, dates, prices, or CTAs inside a raster banner, and never ship a bare `<a style="padding:...">` CTA whose hit area and fill collapse in Classic Outlook.

## Common email failures

- beautiful hero image containing all essential copy;
- bare `<a>` or VML-only CTA breaking in Classic Outlook or vanishing in New Outlook;
- dark logo/icon vanishing on forced `#121212` dark-mode backgrounds (`Gmail Android` / `Outlook Windows`);
- short 3-repeat preheader spacer leaking `"View in browser"` into 120-char inbox snippets;
- promotional mail missing `RFC 8058` one-click unsubscribe headers or gating unsubscribe behind a login wall;
- treating Apple MPP proxy opens as verified human engagement;
- HTML exceeding `80–102 KB` and clipping legal/unsubscribe footers;
- no plaintext or plaintext generated as raw HTML dump.

## Verification options

Run `check-email.mjs` (`pixelcraft-visual-qa`) on compiled HTML + `text/plain` (`static`), then render across representative real clients or preview rigs in all 3 dark-mode regimes, narrow mobile width, and images-off mode (`rendered`). Label untested clients explicitly as `not-checked`; never claim universal compatibility from a browser tab.

## Pre-submit checklist

- [ ] zero `TODO`s, placeholder copy, broken merge variables, or dead CTA/unsubscribe/preference URLs;
- [ ] explicit email pipeline used (MJML, React Email, Maizzle, or tested HTML tables)—no Flexbox/Grid/`var(--)` web markup;
- [ ] compiled HTML `< 80 KB` target (`< 102 KB` hard cap) and hidden preheader padded to `~140+` chars (`50–90` `&#847;&zwnj;&nbsp;` repeats);
- [ ] Bulletproof Dual-Engine CTA (`<!--[if mso]><v:roundrect>` + `<td bgcolor>` HTML `<a>`) survives Classic & New Outlook;
- [ ] primary message, logos (with light halo/pill or `.dark-img` swap), and CTA survive images off and all 3 dark-mode regimes;
- [ ] bulk/promotional headers (`SPF`/`DKIM >= 2048-bit`/`DMARC`, `RFC 8058` one-click unsubscribe `<= 48h` no-login, `< 0.10%` complaint design, MPP-safe analytics) addressed;
- [ ] full `text/plain` MIME parity, `lang`/`dir`/`<title>`, and `role="presentation"` on every layout `<table>`;
- [ ] tested clients labeled `rendered` and untested clients labeled `not-checked`.

## Framework routing

- Read [references/html-tables.md](references/html-tables.md) for hand-authored table-based HTML email, Bulletproof Dual-Engine CTAs, and `< 80 KB` byte discipline.
- Read [references/mjml.md](references/mjml.md) for MJML.
- Read [references/react-email.md](references/react-email.md) for React Email.
- Read [references/maizzle.md](references/maizzle.md) for Maizzle (Tailwind CSS email build pipeline, inlining, purging, and Outlook parity).
- Read [references/client-quirks.md](references/client-quirks.md) whenever targeting Outlook, Gmail, Apple Mail, the 3-regime dark-mode matrix, 2025–2026 bulk-sender mandates, image blocking, clipping, or plaintext behavior.
