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
- **Pre-ESP HTML & `<style>` byte budgets + `GANGA` inline survival**: keep pre-ESP compiled HTML **`< 85–90 KB` target** (`< 80 KB` ideal headroom before ESP click-tracking link wrapping hits Gmail's **`102 KB`** hard clip); keep `<style>` **`<= 8–16 KB`** with **zero modern CSS (`@layer`, `@property`, CSS nesting)** inside `<style>` (any unsupported syntax causes Gmail to strip the **entire** `<style>` block!); and ensure **Gmail Non-Google Account (`GANGA` IMAP/POP)** survival where `<style>` is stripped completely so layout and `>= 4.5:1` contrast hold on inline CSS alone.
- **Merge-tag fallbacks, descriptive links & Dual-Engine CTAs**: define **explicit personalization merge-tag fallbacks** (e.g., `{{ first_name | default: "there" }}`—never rendering raw `{{name}}` or blank awkward gaps); write **self-describing link text** (**never `"click here"`**); pair `<!--[if mso]><v:roundrect>` with `<!--[if !mso]><!--><table role="presentation"><tr><td bgcolor="..." style="border-radius:..."><a>` for Classic + New Outlook; and pad hidden preheaders with 50–90 repeats (`~140+` chars) of `&#847;&zwnj;&nbsp;`.
- **3-Regime Dark Mode survival**: design simultaneously for (1) **No change**, (2) **Partial inversion / CSS opt-in** (`Apple Mail`, `Outlook.com` / `New Outlook`, `Gmail iOS`), and (3) **Full forced inversion** (`Gmail Android`, `Classic Outlook Windows`). Declare `color-scheme: light dark`, wire `.light-img`/`.dark-img` swaps where supported, and add a **subtle light keyline/halo (`1–2px`) or translucent pill** around dark logos/icons so forced `#121212` backgrounds never swallow brand marks.
- **2025–2026 Bulk Sender Mandate (Gmail, Yahoo, Outlook.com)**:
  - Authenticate with aligned **`SPF` + `DKIM` (`>= 2048-bit`) + `DMARC` (`p=quarantine` or `p=reject`)**; optionally add **`BIMI`** (`SVG Tiny-PS` + VMC/CMC) for verified sender avatars.
  - Include **`List-Unsubscribe` + `List-Unsubscribe-Post: List-Unsubscribe=One-Click` (`RFC 8058`)** honored within **`<= 48h` with zero login wall** on all promotional/bulk mail, and keep transactional mail (receipts, OTPs, security alerts) strictly free of marketing upsells.
  - Hold Postmaster spam complaint rates **`< 0.10%` target** (**`0.30%` hard block**).
  - Account for **Apple Mail Privacy Protection (MPP)** proxy pre-fetches: never treat open pixels as human reads or gate workflows on opens; measure clicks, replies, and conversions.
- **Plaintext & accessibility parity**: ship a complete `text/plain` MIME companion matching HTML order, URLs, dates, and unsubscribe/legal text; set `lang`, `dir`, `<title>`, semantic `<h1>`–`<h3>`/`<p>`, `alt` text, descriptive anchor copy, and `role="presentation"` on every layout `<table>`.

## Anti-lazy-default & anti-slop guard

- **Never paste modern-CSS web layouts into email**: raw `display: flex`, CSS Grid, `position: fixed`, CSS custom properties, `@layer`/`@property`/nesting inside `<style>`, and uninlined utility sheets shatter in Classic Outlook, strip Gmail `<style>` blocks, fail `GANGA` IMAP/POP clients, and bloat past Gmail's `102 KB` clip threshold.
- **Pick an explicit email pipeline first**: commit to **MJML**, **React Email**, **Maizzle**, or hand-authored **HTML tables** (with MSO conditional comments) before writing markup.
- **Reject image-only hero blasts and bare `<a>` buttons**: never hide headlines, dates, prices, or CTAs inside a raster banner, never write vague `"click here"` links, and never ship a bare `<a style="padding:...">` CTA whose hit area and fill collapse in Classic Outlook.

## Common email failures

- beautiful hero image containing all essential copy, or generic `"click here"` link text;
- raw `{{name}}` merge tags leaking when recipient profile fields are null/empty;
- `@layer`, `@property`, or CSS nesting inside `<style>` causing Gmail to strip the entire `<style>` block, or uninlined styles collapsing in `GANGA` (IMAP/POP);
- bare `<a>` or VML-only CTA breaking in Classic Outlook or vanishing in New Outlook;
- dark logo/icon vanishing on forced `#121212` dark-mode backgrounds (`Gmail Android` / `Outlook Windows`);
- short 3-repeat preheader spacer leaking `"View in browser"` into 120-char inbox snippets;
- promotional mail missing `RFC 8058` one-click unsubscribe headers or gating unsubscribe behind a login wall;
- HTML exceeding `< 85–90 KB` pre-ESP (`102 KB` post-ESP) and clipping legal/unsubscribe footers, or missing `text/plain` parity.

## Verification options

Run `check-email.mjs` (`pixelcraft-visual-qa`) on compiled HTML + `text/plain` (`static`), then render across representative real clients or preview rigs (including `<style>`-stripped `GANGA` mode, all 3 dark-mode regimes, narrow mobile width, null-merge-tag fixture, and images-off mode) (`rendered`; **Rule #0.3** forbids counting browser-tab or `static` checks as client-rendered `pass`). Label untested clients `not-checked`.

## Pre-submit checklist

- [ ] zero `TODO`s, placeholder copy, raw `{{merge}}` leaks (**merge-tag fallbacks tested with null/empty data**), `"click here"` links, or dead CTA/unsubscribe URLs;
- [ ] explicit email pipeline used (MJML, React Email, Maizzle, or tested HTML tables)—no Flexbox/Grid/`var(--)` web markup;
- [ ] pre-ESP HTML **`< 85–90 KB` target** (`< 102 KB` post-ESP hard cap), `<style>` **`<= 8–16 KB`** with **zero `@layer` / `@property` / CSS nesting**, **`GANGA` (`<style>`-stripped) inline survival**, and `~140+`-char padded preheader (`50–90` `&#847;&zwnj;&nbsp;` repeats);
- [ ] Bulletproof Dual-Engine CTA (`<!--[if mso]><v:roundrect>` + `<td bgcolor>` HTML `<a>`) survives Classic & New Outlook;
- [ ] primary message, logos (with light halo/pill or `.dark-img` swap), descriptive links, and CTA survive images off and all 3 dark-mode regimes;
- [ ] bulk/promotional headers (`SPF`/`DKIM >= 2048-bit`/`DMARC`, `RFC 8058` one-click unsubscribe `<= 48h` no-login, `< 0.10%` complaint design, MPP-safe analytics) addressed;
- [ ] full `text/plain` MIME parity, `lang`/`dir`/`<title>`, and `role="presentation"` on every layout `<table>`;
- [ ] **Checklist-Until-Passing Stop-Gate (`<HARD-GATE>`):** walk every checklist item above + run `slop-scan.mjs --fail-on p2`, `check-email.mjs --plaintext --headers`, and `check-acceptance.mjs .pixelcraft/acceptance.json` (`pixelcraft-review`) in a `Fix → Re-verify` loop until passing (`0` `fail`/`pending` rows, `rendered` evidence on visual/client/a11y per `Rule #0.3`).

## Framework routing

- Read [references/html-tables.md](references/html-tables.md) for hand-authored table-based HTML email, Bulletproof Dual-Engine CTAs, and `< 80 KB` byte discipline.
- Read [references/mjml.md](references/mjml.md) for MJML.
- Read [references/react-email.md](references/react-email.md) for React Email.
- Read [references/maizzle.md](references/maizzle.md) for Maizzle (Tailwind CSS email build pipeline, inlining, purging, and Outlook parity).
- Read [references/client-quirks.md](references/client-quirks.md) whenever targeting Outlook, Gmail, Apple Mail, the 3-regime dark-mode matrix, 2025–2026 bulk-sender mandates, image blocking, clipping, or plaintext behavior.
