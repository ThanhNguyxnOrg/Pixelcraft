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

## High-trust premium marketing standards

| Standard | Concrete check | Failure signal |
|---|---|---|
| **Above-the-fold `What · Who · Why`** | Before any scrolling on both desktop and mobile, communicate **what the product does**, **who it is for**, and **why it matters (concrete outcome)** alongside the primary next action | Vague brand manifesto headline, abstract full-screen visual pushing value proposition below the fold, or unclear target audience |
| **Zero "DIY energy"** | Enforce studio-grade consistency across type scale, spacing rhythm, alignment grid, icon stroke weight, corner radii, and high-DPI cropped product visuals so every band feels deliberately engineered | Mismatched stock art, uneven padding, blurry or awkwardly clipped screenshots, generic default template chrome, or bolted-on sections |
| **Purposeful visuals, zero noise** | Break walls of text with domain-truthful, brand-aligned visuals (crisp annotated UI, architecture diagrams, real live previews, art-directed photography) that actively clarify how the product works | Walls of unbroken prose, OR decorative floating blobs, gratuitous sparkles/confetti, competing glow pills, and noisy backgrounds fighting text contrast |
| **Connected multi-page flow** | Link pages (`Home → Capabilities → Pricing → Proof/Docs → Trial/Demo`) so every page terminates in one clear, stage-appropriate next step—eliminating decision paralysis | Dead-end footers, orphaned feature pages, or 4–5 competing equal-weight primary CTAs fighting on the same viewport |
| **Verifiable first-minute proof** | Back every speed, ease, or zero-config claim (`"Deploy in 60s"`, `"Sub-second search"`) with immediate first-minute evidence—interactive tryout, runnable real CLI snippet, real output preview, or dated benchmark with test conditions | Unsubstantiated adjectives (`"blazingly fast"`, `"effortless setup"`) with no runnable proof or artifact |

## Conversion structure

1. **Concrete promise (above the fold)**: Name **what you do**, **who it's for**, and **why it matters** in plain language without requiring scroll, rather than generic taglines.
2. **Truthful, verifiable proof**: Real product artifacts, immediate first-minute proof for speed/simplicity claims, verifiable benchmarks (with test date and conditions), real customer quotes (with attribution), or live interactive tryouts.
3. **Mechanism and differentiation**: Explain *how* the product works with purposeful visuals breaking copy blocks, and state what trade-offs it intentionally makes compared to alternatives.
4. **Objection handling**: Clear pricing assumptions, security/compliance facts, migration path, limits, and FAQ answers near the decision point.
5. **Connected next step**: Every page and CTA states what happens after clicking ("Start 14-day free trial — no card required", "Book 20-min demo", "Download macOS DMG") and links cleanly into the next evaluation step rather than vague "Get started" or dead ends.

## Trust and anti-dark-pattern rules

- Never fabricate logos, testimonials, user counts, awards, ratings, countdown timers, or artificial scarcity.
- Label illustrative or conceptual product visuals clearly if real screenshots/data are not yet available.
- Keep pricing, renewal cadence, seat minimums, and comparison dates transparent (for full SaaS billing/upgrade flows, read [billing-paywalls.md](billing-paywalls.md)).
- Lead-capture and waitlist forms state how contact data is used, preserve user input across validation errors, and confirm submission state explicitly.

## Do/don't pairs

| Do | Don't |
|---|---|
| State `What · Who · Why` clearly above the fold on desktop and mobile | Force visitors to scroll past abstract art or cryptic slogans to learn what the product is |
| Let the subject material and direction card dictate hero layout with studio-grade visual coherence | Default to centered headline + two buttons + 3 generic icon cards or mismatched "DIY energy" assets |
| Break prose with purposeful brand-aligned product visuals or diagrams | Ship unbroken text walls or scatter decorative blobs, sparkles, and visual noise |
| Connect pages with one clear stage-matched next step | Strand visitors at dead ends or present five competing equal-weight primary CTAs |
| Substantiate speed/simplicity claims with runnable first-minute proof and dated benchmarks | Claim "instant effortless setup" or invent "+340% productivity" callouts and fake logo strips |
| State exact CTA outcome ("Create free account", "View pricing") | Hide trials behind ambiguous "Get started" buttons |
| Keep interactive demos functional with static/error fallbacks | Leave blank broken embeds when third-party scripts fail or offline |

## Verification

Test above-the-fold `What · Who · Why` legibility on desktop and mobile viewports, connected multi-page next-step flow, visual craft coherence (zero DIY mismatches or decorative noise), runnable first-minute proof artifacts, narrow/mobile reading order, long localized headlines, RTL mirroring, font fallback, failed hero media, reduced motion, keyboard path through skip link -> nav -> CTA -> form, text contrast over imagery, interactive demo error/offline fallbacks, and honest claim provenance.
