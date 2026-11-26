# Pixelcraft design rationale

This document explains why Pixelcraft's rules exist. It is written for contributors before they change behavior. It is deliberately prose rather than a citation registry: the goal is to preserve the reasoning and trade-offs in Pixelcraft's own words, not to outsource judgment to a bibliography.

Public standards and platform guidelines such as WCAG 2.2, WAI-ARIA, Apple Human Interface Guidelines, Material Design, DTCG, Unicode CLDR, W3C internationalization guidance, and host documentation remain authoritative in their own domains. This document explains how Pixelcraft uses them; it does not replace them.

## Planning-first

**Rule:** inspect the existing repository or explicitly choose a greenfield stack before visual direction or implementation.

**Why:** UI decisions are constrained by architecture, ownership, data flow, distribution, verification tools, localization, and existing design authority. Without planning, agents confuse greenfield freedom with brownfield obligation and rediscover the same facts repeatedly.

**Trade-off:** planning adds a step before visible output. Pixelcraft accepts that cost because premature visual novelty is usually more expensive to undo than a concise plan is to write.

The design brief and evidence classification exist because agents otherwise mix user facts, repository observations, visual-source inference, research, assumptions, and unknowns into one confident narrative. Keeping those classes separate makes escalation and waiver decisions auditable without requiring a heavyweight requirements process.

## Discovery without compulsory questionnaires

**Rule:** distinguish planning from discovery. Always gather enough evidence to plan safely, but interview the user only when they ask for help shaping the idea or when an unresolved decision could materially change product scope, outcome, platform, architecture, data, or major constraints.

**Why:** agents can discover repository facts, current APIs, dependencies, and existing conventions themselves. The user should not have to repeat those facts or choose technology without understanding its consequences. At the same time, a vague product idea cannot be made precise by silently filling every gap with model assumptions.

**Trade-off:** too little questioning hides important product decisions; too much questioning turns simple work into bureaucracy and makes users do the agent's research. Pixelcraft therefore uses an adaptive interview: ask about the highest-impact unknown, present a small set of credible options with a recommendation and trade-offs, respect user ownership of priorities, and stop when the plan is actionable. Complete briefs and scoped fixes use a direct path. Durable decisions are recorded in existing plan/brief artifacts; ADRs and glossaries are created only when their specific value justifies them.

## Authority order

**Rule:** the explicit user brief outranks project conventions; project conventions outrank platform defaults; platform and legal constraints outrank Pixelcraft guidance; model taste is last.

**Why:** taste is the easiest thing for a model to supply and the least reliable source of authority. Existing products encode decisions, constraints, and user expectations that are invisible in a prompt.

**Trade-off:** Pixelcraft may preserve a choice it would not have invented. That is intentional. The system flags material conflicts instead of silently replacing user or project decisions. An approved design fixes visual intent, but never silently overrides accessibility, legal/platform duties, architecture, security, or existing semantic constraints.

## Divergence and anti-slop

**Rule:** when visual direction is undecided, generate several genuinely different directions, score them, choose one, and record why alternatives lost. Do not rediverge an approved design.

**Why:** single-shot generation tends toward statistically safe layouts, palettes, copy, and components. Repetition across outputs is the root of recognizable AI slop. Deliberate divergence forces contact with subject matter, audience, material, and constraints before convergence on implementation detail.

**Trade-off:** divergence costs tokens and can produce unusable candidates. Pixelcraft treats that as exploration cost, but bounds it: divergence is skipped where the user has already decided the direction and applies only to undecided scope.

The scoring rubric, prototypicality guardrail, visual-complexity budget, and repetition-history schema exist to keep divergence disciplined. Anti-slop does not mean maximal novelty: operational interfaces benefit from familiar structure, while repetition history prevents unrelated outputs from converging on the same fashionable fingerprint.

## Typography, color, layout, and motion craft

**Rule:** craft decisions must be semantic, systematic, platform-aware, and testable. Type needs role/measure/hierarchy; color needs roles, ramps, contrast behavior, and mode logic; layout needs structure rather than decorative rearrangement; motion needs purpose, duration budget, rendering cost awareness, and reduced-motion fallback.

**Why:** superficial variation is easy to imitate and quickly becomes another template. Durable distinctiveness comes from coherent relationships among content, spacing, rhythm, material, interaction, and platform behavior.

**Trade-off:** systematic craft is less spontaneous than styling by instinct. It can also feel restrictive for expressive work. Pixelcraft still allows deliberate exceptions, but expects them to be named and verified rather than accidental.

Layout-quality inspection translates otherwise vague spacing critique into observable focal path, grouping, contour clutter, density, alignment, balance, and resize behavior. This keeps craft feedback repairable and reduces low-confidence iteration by taste.

## UX states, forms, and flows

**Rule:** design the job, flow, navigation, feedback, validation, recovery, and complete state matrix before polishing pixels.

**Why:** interfaces fail most often at the boundaries: empty data, loading, errors, permissions, long text, offline behavior, interruptions, destructive actions, concurrency, and malformed input. A visually faithful static screen can still be operationally broken.

**Trade-off:** state coverage increases implementation scope. Pixelcraft prefers explicit assumptions and prioritized matrices over pretending one happy-path frame represents the whole product.

Cognitive walkthroughs and lightweight usability-test escalation exist because inspection and real-user behavior answer different questions. Forms receive unusually detailed rules because validation timing, input preservation, tolerant parsing, assistive input, error summaries, and focus movement determine whether recovery is possible; generic “show clear errors” advice is insufficient.

## Accessibility floor

**Rule:** accessibility is mandatory unless the user explicitly waives a scoped item. WCAG 2.2 is treated as a floor, not a finish line.

**Why:** semantic structure, keyboard interaction, names/labels, focus visibility, contrast, target size, text scaling, reduced motion, error identity, and non-color meaning determine whether people can use the interface at all. They are not optional polish.

**Trade-off:** some visual concepts require adaptation or rejection. Pixelcraft accepts that constraint because inaccessible fidelity is not fidelity to a usable product.

Composite-widget contracts exist because adding an ARIA role does not create keyboard behavior, focus restoration, state exposure, or a usable screen-reader experience. Explicit WCAG 2.2 addition matrices and repeatable manual scripts prevent a passing scan or vague manual inspection from being mistaken for task completion.

## Internationalization

**Rule:** plan for text expansion and contraction, script shaping, font fallback, directionality, locale formatting, plural and grammatical variation, input composition, culturally appropriate copy, and emoji behavior from the start.

**Why:** English-shaped layouts hide fragility. Dense CJK text, long compounded words, RTL mirroring, stacked diacritics, line-breaking rules, and localized formats expose assumptions that cannot be fixed by translating strings at the end.

**Trade-off:** early i18n constraints reduce layout freedom and increase test matrices. The benefit is that the design survives real language rather than treating localization as a destructive afterthought.

Message-authoring and pseudolocalization rules exist because concatenated grammar cannot be repaired by translation memory or a wider column. Pseudolocalization is used as a controlled diagnostic for hard-coded strings, clipping, directionality, and placeholder corruption while explicitly remaining unable to validate translation quality or cultural appropriateness.

## Platform idioms

**Rule:** translate principles into the actual stack rather than copying web assumptions into mobile, desktop, data apps, TUI, email, documents, games, spatial UI, or constrained hardware.

**Why:** each platform has its own layout model, input modality, navigation contract, accessibility machinery, performance envelope, packaging limits, and user expectations. Literal visual copying often destroys usability even when it preserves pixels.

**Trade-off:** idiomatic translation means a design will not be byte-identical across platforms. Pixelcraft values behavioral fidelity and user success over false uniformity.

The shared surface acceptance matrix exists because platform references otherwise vary in depth. It gives every surface the same ownership questions—layout, navigation, input, restoration, accessibility exposure, localization, performance, safe geometry, capture, and privacy—while leaving the implementation idiom to the platform skill.

## Design tokens

**Rule:** use semantic tokens with explicit modes, aliases, and export targets rather than scattering leaf hex or measurement values through components.

**Why:** tokens preserve intent across themes, density, platforms, and rebrands. DTCG-style structure gives implementations a shared contract, while semantic naming prevents two visually identical values with different meanings from collapsing into one accidental constant.

**Trade-off:** token architecture requires maintenance and can feel heavy for a tiny prototype. Pixelcraft scales depth to the project but does not treat hard-coded drift as a neutral choice in durable systems.

Governance, state matrices, and adoption guidance exist because a token file is only the start of a design system. Renames, deprecations, semantic redefinitions, consumer migration, state combinations, rollback, and documentation determine whether teams can trust the system. Pixelcraft treats those as lightweight lifecycle rules rather than enterprise bureaucracy.

## Visual QA and verification

**Rule:** claims must carry evidence labels, and **Golden Evidence Rule (`Rule #0.3`)** forbids counting `static` or `model-judgment` as `pass` / accepted for visual appearance, measured performance budgets, or interactive/assistive accessibility requirements—those claims require `rendered` evidence, or must be recorded honestly as `not-checked` (with concrete environment reason) or `waived` (with explicit user authorization, scope, and consequence).

**Why:** agents overestimate visual quality when they inspect only source code or judge screenshots heuristically without runtime measurements. Rendering and instrumentation expose clipping, contrast failure, font fallback, motion jank, overflow, state mismatch, rasterization differences, and broken assistive interaction that static source inspection systematically misses.

**Trade-off:** verification is environment-dependent and sometimes impossible inside a headless sandbox. Pixelcraft requires honest `not-checked` (`PENDING_RENDERED_ENV`) or user-signed `waived` labels instead of fabricated certainty or downgraded static passes.

Task-driven QA, critic calibration, fidelity tolerance, and screenshot-baseline governance exist because visual verification is itself fallible. A screenshot can look convincing while the task fails; model critique can hallucinate or degrade through iteration; pixel diffs can hide hard state failures; baselines can become meaningless when updated merely to pass. These rules preserve evidence provenance and stop conditions.

## Evaluations

**Rule:** behavior-changing guidance should be represented by evaluation prompts, expected behaviors, and failure signals.

**Why:** prose that sounds good can still fail to alter agent behavior. Evals expose missing triggers, generic output, ignored constraints, false verification claims, and regressions caused by later edits.

**Trade-off:** evals require maintenance and cannot prove taste. They are regression instruments, not a substitute for human review or rendered evidence.

Structured fixture metadata exists to make negative controls explicit. A passing build, flattering screenshot, scanner zero, low pixel difference, or familiar framework choice should not be accepted as proof of the desired behavior. The validator checks fixture structure only; behavioral judgment still belongs to evaluators.

## Distribution and installer safety

**Rule:** canonical skills remain self-contained; generated adapters are reproducible artifacts; installers default to project scope, avoid privilege escalation, refuse symlink traversal, preserve existing files unless forced, and support dry runs.

**Why:** a skill pack edits the user's workspace. Trust depends on predictable scope, reversible inspection, no hidden overwrite behavior, and clear separation between canonical content and generated integration fragments.

**Trade-off:** supporting fewer verified targets is less flashy than claiming universal compatibility. Pixelcraft chooses explicit support boundaries over unsafe guesses about agent-specific paths.

## Brand and logo craft

**Rule:** identity work starts with strategy, metaphor inventory, many small concepts, silhouette reduction, appropriate reproduction, and small-size evidence. Pixel-art identities additionally require integer-grid discipline, curated palettes, deliberate dithering, and explicit small-size reductions.

**Why:** a logo identifies rather than explaining everything. Detail that looks impressive at hero size often disappears at 16 or 32 px, while mascot and pixel-art systems fail when geometry, palette, or personality is inconsistent.

**Trade-off:** reduction can remove clever detail. Pixelcraft prefers recognition, reproducibility, and contextual appropriateness over decorative complexity.

Brand governance exists because generated imagery is not yet a usable identity system. Ownership/versioning, provenance and licensing boundaries, clearspace, minimum sizes, incorrect-use rules, contrast pairs, and small-size artifacts prevent a strong concept from fragmenting into inconsistent exports. Legal clearance remains outside the agent's authority and must be escalated rather than implied.

## Live interface measurement

**Rule:** visual direction and critique must be grounded in rendered measurements as well as principles. Typography, palette, geometry, motion, cursor behavior, payload, and basic semantics should be inventoried when a browser runtime is available.

**Why:** live inspection of strongly art-directed interfaces showed a consistent separation between transferable mechanisms and harmful surface excess. Restrained type/palette inventories, controlled scale contrast, object-led composition, editorial indexing, intentional overlap, and motion used for spatial continuity can be measured. The same evidence also exposed heavy payloads, scroll manipulation, missing reduced-motion behavior, custom cursors, canvas-hidden semantics, and accessibility defects that visual acclaim can mask.

**Trade-off:** measurements can be misread as targets or false proof. Pixelcraft therefore treats corpus ranges as calibration, labels heuristic extraction limits, and requires human inspection plus task verification. The goal is not imitation by number; it is preventing taste adjectives and celebrated surfaces from overriding evidence.

## Creative engineering without skill sprawl

**Rule:** extend the existing skill that owns the design or platform concern before creating a new skill. Split only when a capability has an independent trigger, workflow, verification contract, and installation value that cannot stay coherent as a reference of an existing skill.

**Why:** motion, 3D, shaders, scrollytelling, and interactive media share browser/runtime constraints with existing craft, web, patterns, accessibility, and visual QA work. Parallel skills would duplicate routing and fragment source-of-truth.

**Trade-off:** reference files can become deep. Progressive disclosure keeps top-level skills concise while adding detailed implementation guidance without expanding the install catalog. A future standalone skill requires evidence of independent usage and an evaluation showing that the split improves behavior.

## Anti-laziness enforcement, Grill-Me discovery, and pre-code sign-off

**Rule:** pair polite principles with adversarial Iron Laws, rationalization tables, concrete pre-submit checklists, one-question-at-a-time Grill-Me discovery for unresolved scope, and a pre-code Design Approval gate before implementing greenfield or undecided redesign work.

**Why:** under turn pressure, models systematically rationalize skipping planning, guessing vague requirements, leaving `// TODO` or empty click handlers, reusing one screenshot across breakpoints, and self-approving conventional templates. Explicit refusal tables and structural ASCII wireframes close those shortcuts without turning narrow bug fixes or approved handoffs into bureaucracy.

**Trade-off:** asking one targeted question per turn and confirming a direction card adds conversational turns on open briefs. Pixelcraft accepts that cost on greenfield and redesign work while preserving a direct execution path for narrowly scoped edits and approved specifications.

## Stack and sub-stack library craft

**Rule:** reject path-of-least-resistance platform defaults (such as Tkinter for greenfield Python desktop, unjustified heavy WebViews, bare `print()` TUIs, `window.print()` PDFs, or Flexbox HTML emails) and resolve complex UI capabilities (rich text, code editors, large grids, maps, search, command palettes, drawers, toasts, carousels, drag-and-drop) to native platform primitives or vetted purpose-built libraries rather than fragile DIY substitutes.

**Why:** choosing a macro framework alone does not stop agents from hand-rolling broken `contenteditable` editors, static-pixel charts, or keyboard-trapping custom overlays. Escalating sub-stack capabilities during planning prevents structural defects that visual polish cannot repair.

**Trade-off:** purpose-built libraries add dependency evaluation and version verification work. Pixelcraft still prefers native HTML/OS primitives whenever they cover the interaction cleanly, escalating to specialized libraries only where native semantics fall short.

## Invisible craft, composition safety, and release-grade delivery

**Rule:** pair macro aesthetic direction with frequency-calibrated interaction physics, optical geometry, dark-surface luminance elevation, input-method and script-shaping safety, and reproducible commercial release gates across every target stack.

**Why:** the distance between a convincing static mockup and a studio-grade product lives in sub-second, sub-pixel, and operational execution. High-frequency menus or command palettes that animate like ceremonial reveals feel sluggish by the twentieth repetition; asymmetric glyphs centered by bounding box appear off-axis; dark surfaces built by mechanical inversion or black drop shadows collapse into muddy halation; compact icon controls without expanded invisible hit-slop or diagonal submenu corridors punish ordinary pointer and touch travel; proportional numerals jitter live counters, timers, and financial columns. At the text-entry boundary, treating `Enter` as submit during active input-method (`IME`) composition corrupts Vietnamese Telex/VNI, Japanese Kana-to-Kanji, Korean Hangul, and Chinese Pinyin input, while unnormalized combining marks (`NFD` vs `NFC`) or incomplete font subsets produce mid-word fallback glyphs across Latin diacritics, CJK, and RTL scripts. Finally, an interface is not release-ready if a clean clone takes hours to boot, strict language-appropriate static analyzers or dependency vulnerability audits fail, staging shares production data, secrets leak into client artifacts, store or regulatory regimes (`EAA`, App Store, Google Play, `MV3`, `PDF/X-4`, `RFC 8058`) go unaddressed, or commercial font/media licenses, defect-warranty triage handoff, and root account credentials stay locked to the implementer.

**Trade-off:** micro-physical calibration, composition-aware input guards, and commercial handoff verification require discipline that a single happy-path screenshot never rewards. Pixelcraft accepts that cost because durable quality is judged on the hundredth daily interaction, across every writing system, and at the moment a client or engineering team takes legal and operational ownership of the build.

## Completion gate, acceptance manifest, and scan-until-clean

**Rule:** bind a mandatory Definition-of-Done completion contract inside `.pixelcraft/plan.md` plus a structured `.pixelcraft/acceptance.json` manifest (`check-acceptance.mjs --init <platform>`) during planning, and enforce a hard `Phase 5 → Phase 6` exit gate requiring the agent to walk every applicable checklist (`floor.md`, the active platform skill's `Pre-submit checklist`, and `polish.md`) and run a `scan → fix → rescan` loop until all deterministic scanners (`slop-scan.mjs --fail-on p2`, `check-contrast.mjs`, `check-email.mjs`, `check-tui.mjs`, `check-pdf.mjs`), active-language compiler/linter/test suites, and `check-acceptance.mjs .pixelcraft/acceptance.json` pass with zero `fail` or `pending` rows under a 3-tier Studio verdict (`FAIL`, `PASS_STUDIO_10K_20K`, `EXCEEDS_STUDIO`) before stopping.

**Why:** defining checklists and static scanners is useless if an agent writes `.pixelcraft/plan.md` without measurable target thresholds, runs zero or one perfunctory pass after coding, marks visual/performance/accessibility rows as passed from static source reading (`Rule #0.3` violation), and stops while fixable `P0–P2` defects, compiler errors, or `pending` acceptance rows remain. Separating deterministic and measurable acceptance defects from subjective visual oscillation solves both failure modes: deterministic scan, build, state, floor, and acceptance-manifest failures must be fixed and re-verified until clean (`0` `fail`/`pending`), whereas rendered layout/pixel critique remains bounded at three documented `finish-gate.mjs` rounds so agents never loop endlessly by taste or overwrite baselines to fake a pass.

**Trade-off:** mandatory checklist execution, acceptance-manifest tracking, and rescan loops cost extra verification turns at the end of implementation. Pixelcraft accepts that cost because shipping after a single unverified pass defeats every upstream planning and craft rule.

## Changing these rules

Do not weaken a rule merely because a task is inconvenient. Change the rule when the underlying trade-off changed, when evidence shows the rule produces worse outcomes, or when a platform/standard changed. Record the reason in the commit and update affected skills, evals, and verification tooling together.
