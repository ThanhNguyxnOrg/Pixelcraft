# Layout composition library

Use this library when choosing the structural idea for a direction. It distills recurring techniques visible across strongly art-directed interfaces and curated visual collections without copying any particular site. Recurring evidence centers on expressive typography, experimental navigation, narrative scroll, bounded WebGL or shader accents, strong brand consistency, asymmetric editorial structure, and content-led restraint. Treat these patterns as secondary survey evidence, not a canonical census.

## Selection contract

1. Choose composition from the user's decision and material inventory, not because a shape is fashionable.
2. Spend novelty in one structural move; keep navigation, controls, text measure, and state behavior legible.
3. Preserve a grid even when breaking it: shared edges, repeatable spacing, and intentional overlap are what separate tension from mess.
4. Prototype in low fidelity with real copy/data/images before adding type scale, color, or motion.
5. For Operate surfaces, prefer familiar structure with one precise deviation. For Persuade/Experience, composition may carry more authorship if usability remains visible.
6. Never clone a specific site's arrangement, artwork, copy cadence, or interaction sequence. Extract the transferable mechanism only.

## Composition families

| Family | Use when | Structural rules | Web implementation notes | Native/mobile equivalent | Caveats and slop risk |
|---|---|---|---|---|---|
| Editorial modular grid | publication, analysis, documentation, institutional brand | 6/8/12-column modular grid; strong baseline rhythm; metadata in a narrow rail; vary column span rather than decorate | CSS grid subgrid/named areas; measure in `ch`; keep rail collapsible | multi-column adaptive layout on tablets; single-column semantic order on phones | becomes generic magazine cosplay when rules/hairlines/serifs carry no editorial meaning |
| Broken/asymmetric grid | campaign, portfolio, cultural surface needing tension | define the parent grid first; break one or two alignments; overlap only where reading order remains obvious | grid placement with negative-space spans; `clip-path` only for stable media shapes | large titles/cards offset within otherwise standard safe-area layout | random offsets are not asymmetry; text scaling/localization can destroy overlays |
| Oversized type as structure | short decisive copy, index pages, artist/studio identity | display type forms columns/edges; body and controls occupy clearly quieter zones; crop only decorative duplicates, never essential words | fluid `clamp()` type, `text-wrap: balance` where supported, reserve height to avoid CLS | scaled display text in a fixed header/hero region; respect Dynamic Type/sp by offering compact fallback | the giant-word hero is already a showcase cliché; fails when copy is long or translated |
| Split/sticky narrative | one artifact/process benefits from persistent context | sticky visual specimen on one side; concise chapters scroll opposite; each chapter changes artifact state/annotation | position sticky, scroll-driven progress, no input hijacking; static fallback column order | split view on large screens; top preview + paging or accordion on compact screens | sticky sections become trapped content; leave enough viewport for text and never require precise scroll position |
| Non-generic bento | heterogeneous but finite feature/proof inventory | modules sized by information importance, not equal rectangles; one dominant cell; shared baseline/edges; explicit content role per cell | CSS grid dense packing sparingly; avoid empty decorative cells | adaptive cards only where each is independently meaningful; otherwise use list sections | bento is peak AI/SaaS slop when all cells are rounded boxes with icons and pastel gradients |
| Horizontal section/gallery | chronology, comparative specimens, spatial sequence | horizontal motion must be inherent to content; provide visible progress and direct links; keep vertical page semantics available | horizontal scroll container with scroll snap; do not remap wheel input or trap the page | horizontal pager/carousel with paging control and accessibility labels | horizontal-scroll-as-personality is a cliché and mobile-hostile; never use for ordinary prose |
| Index/list-driven interface | archive, catalog, documentation, research collection | make the index the design: stable row anatomy, aligned metadata, filters as instruments, typographic hierarchy instead of cards | table/list/grid hybrid with logical DOM order independent of visual density | native list/collection view with segmented filtering and swipe/actions where idiomatic | can become sterile brutalism; invest in row microtypography, state, and sorting behavior |
| Object-led spatial composition | physical product, specimen, place, mechanism | object is the anchor; callouts/controls orbit it; preserve scale cues; blank space is part of the object silhouette | responsive image/SVG/canvas with overlay positions derived from intrinsic dimensions | zoomable object/detail pager; use safe hit targets and inspect gestures | generic floating product blob is slop; object must be real and semantically annotated |
| Instrument panel/control room | expert operations, live status, measurement | persistent primary readout; grouped secondary instruments; aligned values; alarm hierarchy beats decoration | dense CSS grid/flex regions; sticky toolbars only when useful | toolbar + pane/split controller; controller focus order must match spatial logic | fake dashboards full of meaningless dials are immediately suspect; every instrument needs live meaning |
| Magazine collision/overlap | fashion/culture/editorial campaign with strong art direction | one collision per scene; maintain baseline order in DOM; use crop/overlap to create figure-ground, not confusion | absolute positioning inside controlled grid cells; test text scaling | use layered artwork only in header/media zones; standard controls beneath | overlapping everything reads as chaos and clips under localization/accessibility scaling |
| Single-page decision narrative | one offering/idea where the whole page is the argument | sequence claim → evidence → mechanism → proof → action; vary pacing; navigation anchors map to real chapters | semantic sections with anchor navigation; View Transitions optional, never required | scroll view with jump list/segmented chapters; preserve state restoration | one-page minimalism becomes evasive when pricing/specs/support are hidden or absent |
| Comparative matrix/cutaway | users must choose or understand differences | align comparable attributes; expose tradeoffs honestly; visual emphasis follows decision importance | table first; enhance with sticky headers/annotations only after semantics work | native table/list/detail split; avoid cards that force pairwise scanning | fake comparison columns and checkmark propaganda destroy trust |

## Award-level translation rules

- **Brand/system consistency beats isolated spectacle.** Winners usually carry one coherent visual argument through navigation, transitions, imagery, copy, and footer—not unrelated effects per section.
- **Innovation is structural or behavioral before it is graphical.** Experimental navigation, scroll choreography, WebGL, and shader details recur in showcase work, but juries still score usability/function explicitly.
- **Typography often carries identity before imagery.** Use scale, measure, spacing, casing, numerals, and editorial sequencing; do not merely purchase an unusual font.
- **Content quality is part of the score.** Missing proof, thin copy, stock imagery, and hallucinated case studies cannot be hidden by composition.
- **Curated minimalism is not absence of design.** Restrained gallery-style composition depends on exact spacing, alignment, type detail, and image curation.
- **One-page clarity is a decision structure, not a long landing template.** Direct single-surface work removes navigational debt and orders the decision.

## Floor checklist

Before committing a composition, verify: logical reading order without visual order; keyboard/controller focus sequence; 200% text scaling; narrow/wide layouts; long translations; empty/error/loading states; sticky-element occlusion; reduced-motion equivalent; CWV cost of large media/effects; and whether the idea still works when the signature visual effect is removed.

## Prototypicality guardrail

Do not interpret anti-slop as “make every structure unfamiliar.” Users recognize operational patterns—lists, tables, navigation, checkout, auth, settings—and benefit when those patterns remain predictable. Preserve learned structure when frequency, urgency, expertise, accessibility, or error cost is high. Earn distinctiveness through subject-derived material, precise hierarchy, typography, content quality, motion behavior, and one controlled signature rather than by scrambling expected task anatomy.

A deviation is justified only when it improves the user's actual task or meaningfully expresses the subject without increasing interaction cost. Record the cost and fallback. If removing the novelty makes the screen easier but indistinguishable, the direction is under-specified; if the novelty blocks recognition, it is over-rotated.

## Visual-complexity budget

Before implementation, assign each screen/region a complexity posture: low, medium, high, or mixed. The budget covers visible element count, density, grouping depth, contour/border noise, motion concurrency, accent count, and focal competition.

- Operate defaults to low/medium with strong grouping; high density is acceptable only when rows/columns/instruments remain aligned and scannable.
- Persuade may spend complexity on one memorable scene while keeping navigation, proof, and action paths quiet.
- Read and Communicate protect measure and contrast above decoration.
- Play/Experience may use richer sensory layering only when orientation, target legibility, reduced-motion behavior, and performance survive.

Complexity must be controlled by structure: grouping, focal hierarchy, whitespace/rhythm, progressive disclosure, and stable landmarks. If reducing clutter requires removing essential information, redesign the information architecture; do not simply shrink type or hide controls.

## Recurring high-end mechanisms observed in live inspection

The following mechanisms recur across strongly art-directed interfaces. Corpus numbers represent the typical range in strong examples as calibration, never targets to hit: 1–3 active families were typical; rendered max/min type ratios clustered around 2.6–5.7; restrained rendered palettes clustered around 6–9 quantized color groups; estimated whitespace commonly fell around 0.42–0.68; payload and accessibility outcomes varied widely and often exposed what not to copy.

| Pattern and mechanism | When to use it | Why it works | How it fails | Measurable checks |
|---|---|---|---|---|
| Controlled spectacle plus quiet utility — concentrate novelty in one memorable scene while navigation, actions, and content structure remain conventional | a memorable object/scene must sell or explain one idea while navigation remains ordinary | novelty is concentrated in one layer, so orientation and actions remain legible | every control becomes experimental; spectacle delays content or hides the action | one named focal spectacle; navigation/controls use familiar anatomy; payload/CLS/LCP budget recorded |
| Expressive scale contrast — let display type create architecture while body text, metadata, and actions remain stable | short decisive copy or editorial voice can carry structure | display type becomes architecture while metadata/actions remain stable | long translated copy clips; ratio becomes illegibility or a giant-word cliché | inventory rendered size extremes, line-length, clipping at 200% text/mobile, and semantic reading order |
| Object-led composition — use a real artifact as the spatial anchor for annotation, sequence, and evidence | a real product/specimen/place/artifact has meaningful detail | scale cues and orbiting annotation make evidence spatial | generic floating object or stock visual; overlay text loses contrast | object provenance, annotation mapping, contrast over real assets, fallback image/text equivalence |
| Editorial indexing — make inventory structure, aligned metadata, filtering, and row anatomy carry the design | archive/catalog/research inventory is itself the content | aligned rows, metadata, numbering, and filtering create craft through information structure | sterile brutalism or impossible scan density; filters hide state | row anatomy stability, sort/filter recovery, keyboard order, empty/error states, density/grouping inspection |
| Intentional asymmetry/overlap — break selected edges or layer elements inside a documented parent grid | cultural/editorial/portfolio direction needs tension | a parent grid makes deviation legible and controlled | random offsets, clipped translations, focus order contradicts visual order | parent grid documented; overlap count localized; centroid deviation intentional; focus/DOM order unaffected |
| Motion as material continuity — animate identity/state changes only where motion explains causality or space | object identity or spatial state genuinely changes | motion explains causality and preserves orientation | decorative fades everywhere, scroll trapping, vestibular risk, payload cost | named purpose per motion; concurrency budget; reduced-motion replacement; frame/payload measurement |

## Measured prototype critique

Before defending asymmetry, overlap, or a wide/narrow composition as intentional, record the rendered geometry: maximum text-content measure independent of viewport width, estimated centroid deviation, overlap count, visible grid count, and behavior at desktop plus narrow widths. Full-bleed media must be named as an exception; body text, forms, controls, and dense data still need deliberate measure constraints. Treat the numbers as evidence to inspect, not scores to maximize.

## Do not copy from award sites

Copy the mechanism, never the surface or the excess. Do not copy multi-megabyte initial payloads, hundreds of requests, scroll hijacking, hidden scrollbars, disabled selection/zoom, cursor replacement without parity, canvas-only text, autoplaying sound/motion, mystery navigation, interaction-dependent essential content, or inaccessible contrast merely because they appear in celebrated work.

A direction inspired by high-end work must pass the ordinary floor first: semantic HTML/platform idioms, direct navigation links, normal input behavior, keyboard/focus visibility, reduced-motion equivalence, stable loading, readable type, truthful content, and measurable performance. If removing the visual effect reveals no content structure, the direction was decoration. If preserving the effect requires sacrificing usability, change the effect.
