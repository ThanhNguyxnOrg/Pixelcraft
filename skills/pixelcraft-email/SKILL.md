---
name: pixelcraft-email
description: Translates Pixelcraft direction, tokens, UX, and floor requirements into email that survives real clients. Use for HTML email, table-based email, MJML, React Email, transactional messages, newsletters, onboarding email, dark mode, image blocking, plaintext parity, accessibility, localization, responsive behavior, client quirks, and deliverability-conscious design.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft email

Use this skill when the rendering surface is an email client. Email is not the modern web: CSS support is fragmented, images may be blocked, dark mode may mutate colors, and forwarding/clipping/rendering are outside your control.

## Detection signals

`.mjml`, React Email packages/templates, table-heavy HTML email, inline CSS tooling, ESP templates, plaintext templates, MIME generation, email screenshots/previews, localization catalogs.

## Translate direction with constrained fidelity

1. Preserve concept through hierarchy, typography fallback, spacing, real copy, restrained color, and signature structure—not fragile pixel precision.
2. Map tokens manually into inline/table-compatible values or generator constants. CSS variables are unreliable across clients.
3. Choose implementation: hand-written tables for maximum control, MJML for responsive abstraction, React Email for component workflow. Do not pretend they produce identical client support automatically.
4. Design image-off and plaintext as first-class variants, not fallbacks written afterward.
5. Use progressive enhancement: modern clients may receive polish; baseline must remain readable/actionable everywhere.

## Platform-wide rules

- Primary message and call to action must work without images, custom fonts, background images, animation, JavaScript, forms, or exact viewport control.
- Use real text for essential copy; meaningful images require concise alt text. Decorative images use empty alt where supported.
- Maintain plaintext parity: content order, links, dates, cancellation/preferences/legal details, and meaning.
- Use dark-mode-aware color choices and transparent imagery carefully; test inversion/mutation rather than assuming control.
- Respect accessibility: semantic-ish heading order where clients permit, readable contrast, target spacing, descriptive links, no image-only content.
- Account for clipping, forwarding, threading, preview text/preheader, localization expansion, RTL, and plain-text clients.

## Common email failures

- beautiful hero image containing all essential copy;
- CTA relying on background image/border-radius/CSS unsupported in Outlook;
- white/logotype disappearing in forced dark/light inversion;
- no plaintext or plaintext generated as raw HTML dump;
- dense multi-column desktop layout collapsing unpredictably;
- generic “View in browser” replacing actual resilient design;
- tracking/privacy/legal footer omitted or unreadable;
- testing only one modern webmail screenshot.

## Verification options

Email can be inspected only by rendering across real clients or preview services. Local HTML render is necessary but insufficient. Validate plaintext, image-off behavior, dark mode, narrow/wide rendering, clipping, forwarding, and accessibility manually or through ESP/client testing tools. Label untested clients explicitly; never claim universal compatibility.

## Framework routing

- Read [references/html-tables.md](references/html-tables.md) for hand-authored table-based HTML email.
- Read [references/mjml.md](references/mjml.md) for MJML.
- Read [references/react-email.md](references/react-email.md) for React Email.
- Read [references/client-quirks.md](references/client-quirks.md) whenever targeting Outlook, Gmail, Apple Mail, dark mode, image blocking, clipping, or plaintext behavior.
