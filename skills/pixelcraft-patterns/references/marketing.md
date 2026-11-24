# Marketing and conversion architecture

Marketing surfaces are persuasion instruments—landing pages, product announcements, pricing pages, app-store listings, and in-app upgrade campaigns. They carry stronger narrative focus than operational UI, while still honoring truthfulness, accessibility, and clarity.

> **Role distinction:** Use this reference for **conversion architecture, proof, trust, and persuasion ethics** (what claim you make, how you substantiate it, and how users act on it). Use [creative-web-composition.md](creative-web-composition.md) for **art-directed editorial layout rhythm, visual pacing, and expressive section patterns**.

## Persuasion vs operational app UI

| Marketing surface | Operational app UI |
|---|---|
| Orientation + memory + one clear next action | Repeated high-velocity task completion |
| Narrative sequence builds confidence progressively | Stable dense structure supports rapid scanning |
| Expressive composition carries brand distinctiveness | Predictable chrome and low friction lead |
| Focused conversion path with low exit confusion | Multiple parallel workflows and deep drill-downs |

Do not paste operational dashboard cards, fake KPI widgets, or app chrome onto a persuasion surface unless demonstrating a real, truthful product artifact.

## Conversion structure

1. **Concrete promise**: Name the audience, problem, and outcome in plain language rather than generic taglines.
2. **Truthful proof**: Real product artifacts, verifiable benchmarks (with test date and conditions), real customer quotes (with attribution), or live interactive tryouts.
3. **Mechanism and differentiation**: Explain *how* the product works and what trade-offs it intentionally makes compared to alternatives.
4. **Objection handling**: Clear pricing assumptions, security/compliance facts, migration path, limits, and FAQ answers near the decision point.
5. **Explicit next step**: Every CTA states what happens after clicking ("Start 14-day free trial — no card required", "Book 20-min demo", "Download macOS DMG") rather than vague "Get started".

## Trust and anti-dark-pattern rules

- Never fabricate logos, testimonials, user counts, awards, ratings, countdown timers, or artificial scarcity.
- Label illustrative or conceptual product visuals clearly if real screenshots/data are not yet available.
- Keep pricing, renewal cadence, seat minimums, and comparison dates transparent (for full SaaS billing/upgrade flows, read [billing-paywalls.md](billing-paywalls.md)).
- Lead-capture and waitlist forms state how contact data is used, preserve user input across validation errors, and confirm submission state explicitly.

## Do/don't pairs

| Do | Don't |
|---|---|
| Let the subject material and direction card dictate hero layout | Default to centered headline + two buttons + 3 generic icon cards |
| State exact CTA outcome ("Create free account", "View pricing") | Hide trials behind ambiguous "Get started" buttons |
| Include benchmark dates, units, and real customer attributions | Invent "+340% productivity" callouts or placeholder logo strips |
| Keep interactive demos functional with static/error fallbacks | Leave blank broken embeds when third-party scripts fail or offline |

## Verification

Test narrow/mobile reading order, long localized headlines, RTL mirroring, font fallback, failed hero media, reduced motion, keyboard path through skip link -> nav -> CTA -> form, text contrast over imagery, interactive demo error/offline fallbacks, and honest claim provenance.
