# Slop fingerprints

Evidence base: recurring generated-UI patterns and output-homogenization evidence. These are recurrence signals, not universal moral bans. The response is redesign or explicit justification—not shame.

## High-confidence visual fingerprints

| Fingerprint | Why it converges | Redesign move |
|---|---|---|
| cream paper + high-contrast serif + orange/terracotta accent | current “crafted AI” neo-slop cluster | derive palette/material from subject; use accent as a semantic system rather than one fashionable color |
| near-black page + single acid green/purple accent | generic futurism | define lighting/material logic and more than one semantic state color |
| Inter/Geist/Helvetica-like sans for every role | model default typography | choose voice by subject; use optical sizes, serif/mono/serifless contrast, native platform defaults when appropriate |
| purple-to-blue gradient | model/default AI branding | use color posture with physical or symbolic basis; gradients only when they encode light/material/data |
| centered hero + eyebrow + H1 + subcopy + two CTAs | template composition | choose hierarchy from user decision; asymmetric, editorial, instrument, object-led, or content-first composition |
| exactly three rounded feature cards with icon/title/text | homogeneous SaaS kit | match information structure to actual number/meaning of ideas; use table, index, timeline, object anatomy, comparison, or spatial layout |
| emoji as structural icons | cheap visual noise | use a coherent icon system or text; emoji only when culturally/semantically appropriate and never as sole critical meaning |
| `rounded-2xl` + large soft shadow everywhere | depth without material logic | choose radius/elevation from component semantics and material; flat can be intentional |
| default glassmorphism panels | decorative translucency | use translucency only where layered context/background matters; test contrast and performance |
| one italic/accented word inside roman heading | model typography tic | create hierarchy through size/weight/measure/language instead |
| unnecessary uppercase eyebrow labels | false sophistication | remove or replace with meaningful metadata/navigation |
| decorative section numbers with no sequence semantics | pseudo-editorial signaling | use actual indexing or remove |
| generic aurora/blob/grid background | meaningless generated atmosphere | derive visual field from content or omit background effect |
| card inside card inside card | noisy containment | use spacing/hairline/typographic grouping; reserve containers for semantic boundaries |
| everything centered regardless of content length | lowest-effort layout | align to reading/task logic; use measure and asymmetric negative space deliberately |
| identical radius/spacing/shadow on every component | token misunderstanding | define semantic variation and density hierarchy |
| glowing / mouse-spotlight Bento grid | 2025–2026 SaaS landing cliché | choose layout from content hierarchy; use bento grouping only when heterogeneous modules genuinely need side-by-side comparison without hover spotlights |
| fake macOS traffic-light terminal chrome on non-dev products | decorative credibility prop | show real product artifact/data or real terminal output only when the product actually runs in a terminal |
| infinite logo marquee strip | automated social-proof filler | list real, verifiable partner proof statically or omit the strip when no verified partners exist |
| fake “Trusted by 10,000+ / 4.9★” avatar stack | fabricated proof + template trust strip | remove invented metrics and generic stock avatars; use verified user-provided proof with provenance or none |
| `✨` sparkle icon spam on buttons and headings | default “AI feature” shorthand | name the concrete capability in plain language (`Summarize`, `Generate SQL`) with a system-coherent icon |
| default shadcn zinc + 1px border + pill badge hero | unexamined starter-kit collapse | treat primitives as unstyled behavior; author tokens, type voice, spacing rhythm, and surface contrast from the committed direction |
| cargo-cult Liquid Glass blur | copying iOS/macOS 26 chrome onto web/apps without layered context | restrict translucency to floating chrome over rich media, verify composited contrast over worst-case backgrounds, and provide a `prefers-reduced-transparency` solid fallback |
| generic icon inside tinted `40×40` rounded-square card badge | automated feature-card kit | drop decorative icon badges; use real product crops, structured specification rows, inline diagrams, or typography-led hierarchy |
| fake SVG sparklines & arbitrary KPI deltas (`+24.5%`, `+12.8%`) | fabricated dashboard decoration | bind charts to real data via a vetted dataviz library, show honest empty/loading states, or omit metrics entirely when no data exists |
| pulsing `animate-ping` green-dot “Live” / “v2.0” pill badge | template launch-page cliché | reserve live status indicators for real telemetry/WebSocket state paired with accessible status text, never decorative hero chrome |
| indigo-purple-pink mesh gradients & glowing border-beam cards | 2025–2026 AI wrapper cliché | derive lighting, surface contrast, and borders from the domain material and semantic elevation hierarchy |
| unstyled or half-wired forms (floating inputs, missing focus/validation/submit feedback) | rushing past operational states | author real labels, tolerant parsing, accessible error summaries, disabled/pending submit states, and input preservation |

## Copy fingerprints

- generic AI marketing clichés without concrete evidence: `supercharge`, `elevate`, `revolutionize`, `unlock`, `seamless`, `cutting-edge`, `next-gen`, `effortless`, `empower`, `streamline`, `all-in-one`, `reimagine`, `unleash`, `AI-powered`, `built for modern teams`, `delve`, `transform your`;
- fake statistics, logos, testimonials, customer counts, awards, or case studies;
- headings that say “Features/Benefits/Why choose us” instead of subject-specific claims;
- error copy that apologizes but gives no recovery path;
- empty-state copy that explains the obvious (“No items yet”) without the next useful action;
- buttons that all say “Learn more” or “Get started” regardless of consequence.

## Implementation laziness fingerprints

Treat these as hard delivery defects (`P0`/`P1`), never acceptable shortcuts:

- `// TODO`, `// FIXME`, or placeholder comments standing in for requested UI or state logic;
- ellipsis code truncation (`// ... rest of component`, `/* ... */`, omitted branches);
- empty or no-op event handlers (`onClick={() => {}}`, `onSubmit={() => {}}`, buttons wired to `console.log`);
- dead `href="#"` or `javascript:void(0)` links pretending to be working navigation;
- unapproved 3-item hardcoded mock arrays (`const items = [item1, item2, item3]`) masquerading as live, fetched, or persisted data;
- unwired mobile navigation (hamburger button that toggles nothing, traps focus, or silently drops desktop routes);
- lazy DIY substitutes for complex capabilities (hand-rolled `<div>` modals without focus traps, `contenteditable` rich editors, hardcoded inline SVG charts, unvirtualized massive tables, mouse-only drag-and-drop).

## Behavior fingerprints

- animation on every section entrance regardless of purpose;
- `transition: all` and long easing everywhere;
- hover-only disclosure with no keyboard/touch path;
- skeletons that mimic fake content rather than stable structure;
- modal chains and cookie/banner chrome occupying the first screen;
- responsive behavior that only scales a desktop layout down instead of restructuring.

## Evaluation rule

A page can have zero fingerprints and still be bad; absence of slop is not presence of design. Judge subject fit, hierarchy, craft, usability, and evidence separately.

## Scanner traceability (`slop-scan.mjs` vs judgment)

`pixelcraft-review` runs `slop-scan.mjs` to catch the mechanically detectable subset statically (`static`); visual/taste fingerprints remain human/rendered review (`rendered` / `model-judgment`). In `slop-scan.mjs`, `--waivers` accepts ONLY the 7 advisory brand rules (`default-font-only`, `purple-blue-gradient`, plus the 5 P3 rules); P0/P1 floor rules and non-brand P2 rules cannot be suppressed via brand waivers:

| Fingerprint family | Automated `slop-scan.mjs` rule ID(s) | Check mode |
|---|---|---|
| Focus removal, zoom lock, paste blocking | `outline-removed`, `zoom-disabled`, `paste-blocked` | `static` (P0, non-waivable) |
| Placeholder-as-label, missing reduced-motion | `placeholder-as-label`, `missing-reduced-motion` | `static` (P1, non-waivable) |
| `transition: all`, emoji icons, cliché copy, hardcoded hexes | `transition-all`, `emoji-as-icon`, `generic-copy`, `hardcoded-color-literals` | `static` (P2, non-waivable) |
| Default fonts, purple-blue gradients | `default-font-only`, `purple-blue-gradient` | `static` (P2 advisory, waivable for approved brand) |
| Repeated `rounded-2xl`, uniform shadows, centered hero + 2 CTAs, gradient text, rounded accent rails | `rounded-2xl-repetition`, `uniform-shadow`, `centered-hero-two-ctas`, `gradient-text-treatment`, `rounded-accent-rail` | `static` (P3, waivable for approved brand) |
| Cream+serif+terracotta defaults, spotlight Bento grids, tinted `40×40` icon card badges, fake sparklines/KPI deltas, pulsing `animate-ping` pill badges, mesh/border-beam glow cards, fake terminal chrome, logo marquees, fake avatar proof stacks, `✨` sparkle spam, default shadcn zinc hero, cargo-cult Liquid Glass blur, implementation laziness stubs & DIY widgets | — (plus static stub/handler inspection during review) | `rendered` / `static` / `model-judgment` |
