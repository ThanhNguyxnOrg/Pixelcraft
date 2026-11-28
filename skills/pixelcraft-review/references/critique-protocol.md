# Structured design critique protocol

Use this reference for critique mode. Critique is a decision process: it evaluates whether the design meets intent and exposes risk. It is not a vote about taste and not permission to redesign outside scope.

## Before the session

Prepare explicit inputs:

- design brief/plan, direction card, approved artifact/version, and scope of critique;
- user/audience/context evidence and open behavioral assumptions;
- platform/accessibility/localization constraints;
- state matrix, real content/data inventory, and verification evidence;
- decision owner and decision deadline;
- what is fixed versus open for change.

If these are absent, critique the missing evidence as a risk instead of filling gaps with personal preference.

## Roles

| Role | Responsibility |
|---|---|
| presenter/author | explain intent, constraints, evidence, and known trade-offs without defending every choice |
| facilitator | enforce scope/order, separate clarification from evaluation, prevent loudest-voice collapse |
| reviewers | independently inspect before group discussion; provide evidence-backed observations |
| decision owner | accept/reject/prioritize outcomes and own unresolved risk |
| recorder | preserve decision rationale, losing alternatives, waivers, and action owners |

In an agent workflow one agent may simulate roles, but must not pretend independent human review occurred. Label role simulation as model judgment.

## Independent review first

Before discussion or generation of fixes, each reviewer inspects independently against:

1. task success and cognitive walkthrough risks;
2. hierarchy/composition/visual complexity;
3. state coverage and recovery;
4. platform/input/accessibility floor;
5. localization/content truth;
6. token/component/system coherence;
7. distinctiveness/repetition against the brief and history.

Independent notes prevent anchoring. Require concrete evidence locations: screenshot region, flow step, state, file/component, or behavioral observation.

## 3-Tier Critique Order (`Structure → Behavior → Visual`)

Always evaluate and resolve issues strictly in this sequence—never debate spacing, palette, or motion polish while the mental model or interaction contract is broken:

| Tier | Focus | Core questions to settle before moving down |
|---:|---|---|
| **1. Structure** | Mental model, IA, hierarchy & reachability | Does the information architecture match the user's job? Within 5 seconds, is the primary action obvious and reachable without hunting or guessing? Are navigation, grouping, and route/screen boundaries coherent? |
| **2. Behavior** | Flows, states, input & recovery | Do primary and non-happy-path states (`loading`, `empty`, `error`, `offline`, `permission-denied`, `404`/`500`) work end-to-end? Are keyboard, touch, controller, focus restoration, `IME` composition, validation, and undo/back behavior sound? |
| **3. Visual** | Typography, color, optical craft & distinctiveness | Once Structure and Behavior hold, evaluate type scale/measure, contrast, spatial rhythm, `B1–B6` micro-craft, motion timing, and subject-specific distinctiveness against the brief and history. |

## Session order

1. **Restate intent/constraints:** outcome, user, mode, approval scope, hard floors.
2. **Clarify only:** resolve factual misunderstandings before evaluation.
3. **Evidence review:** inspect rendered/static/task evidence; separate observed fact from inference.
4. **Strengths:** identify what must be preserved so critique does not flatten the design.
5. **Risks/defects (strictly `Structure → Behavior → Visual`):** report severity, confidence, evidence, affected user/task, and scope.
6. **Alternatives:** generate only after problems are understood; do not jump to a preferred redesign.
7. **Decision:** accept, revise, escalate, defer, or waive each material issue with rationale.

## Feedback taxonomy

Classify every comment:

| Type | Example | Handling |
|---|---|---|
| defect | contrast failure, inaccessible dialog, clipped critical text | fix before release unless explicitly waived |
| behavioral risk | users may not understand navigation | inspect/test or choose safer convention |
| requirement conflict | approved design conflicts with localization/legal/platform constraint | escalate according to authority order |
| hypothesis | denser layout may improve scanning | mark experiment/test needed; do not present as fact |
| preference | reviewer dislikes hue/typeface | lowest authority; must not silently override brief/project direction |
| scope expansion | new feature/page/request | record separately; do not hide inside critique |

## Hybrid Weighted 100-Point Studio Rubric (with Hard-Floor Lock)

Score full reviews and pre-release evaluations across five weighted pillars (computed and enforced alongside `.pixelcraft/acceptance.json` via `node scripts/check-acceptance.mjs`):

| Pillar | Weight | Scope evaluated |
|---|---:|---|
| **Visual + Motion** | **25%** (`25 pts`) | 5-second hierarchy, typography/measure, color/dark-surface elevation (`B4`), optical alignment (`B2`), distinctiveness, motion cadence (`B1`, `B3`), reduced-motion parity |
| **UX + Responsive** | **25%** (`25 pts`) | Mental model/IA, primary task completion, full state matrix (`loading`/`empty`/`error`/`offline`/`404`/`500`), `Break UI` stress-test resilience, multi-width/safe-area adaptation, `IME`/i18n input safety |
| **Performance + Accessibility** | **20%** (`20 pts`) | Surface performance budgets (web CWV/3-run Lighthouse/`LoAF`/`bfcache` or native frame/startup/memory budgets), WCAG 2.2 AA floor, semantics, keyboard/focus unobscured (`2.4.11`), assistive parity |
| **Code Quality** | **15%** (`15 pts`) | Idiomatic architecture, semantic tokens, strict compiler/linter/analyzer cleanliness, zero dead controls/stubs, `0` runtime console warnings/errors, dead-code/unused-dep hygiene, reproducible `< 10m` setup |
| **SEO + Security + Content** | **15%** (`15 pts`) | Truthful non-invented copy, commercial license/ownership hygiene, zero exposed secrets, XSS/header/privacy safety, and surface discoverability metadata (web SEO/OG/`301`/JSON-LD/`/llms.txt`, or store/document/email metadata on non-web surfaces) |

**Hard-Floor Lock & Score Bands:**

| Band / Condition | Verdict | Meaning |
|---|---|---|
| **Any Hard-Floor failure** (`P0`, Baseline `A1–A8` failure, or `Rule #0.3` static-as-rendered falsification) | **`FAIL` (Hard-Floor Locked)** | A high weighted point score **never** overrides a Hard-Floor failure; repair every hard-floor defect before release |
| **`< 70` / 100** | **Amateur** | Material structural, behavioral, or craft gaps; not ready for delivery |
| **`70–89` / 100** | **Good** | Solid functional baseline, but falls short of studio craft/distinctiveness; resolve targeted pillar deductions before commercial sign-off |
| **`>= 90` / 100 + `0` Hard-Floor failures** | **Studio `$10k+`** | Meets the studio bar (`PASS_STUDIO_10K_20K` / `EXCEEDS_STUDIO` when backed by `rendered` evidence per `Rule #0.3`) |

## Final Instant Trust Litmus Question

Before closing any critique or polish review, look at the rendered surface as a skeptical first-time user for 3 seconds and ask:

> **Does this immediately read as *"This team is professional and credible"* — or does *"Something feels slightly off"*?**

- Treat the initial gut reaction strictly as a **`model-judgment` lead**, never as a vague dismissal or taste veto.
- Whenever the answer is *"Something feels slightly off"*, **hunt until you isolate the concrete cause** (misaligned optical icon centroid, mixed stroke weights, cramped `1280×620` fold, awkward copy rhythm, clipped badge, sluggish menu transition, muddy dark-mode card shadow, or missing state) and record it as a severity-ranked finding with observable location and fix.

## Decision log

```markdown
| Issue | Severity | Evidence/label | Decision | Owner | Rationale/trade-off | Follow-up |
|---|---|---|---|---|---|---|
```

Valid decisions include fix, preserve intentionally, test behavior, escalate override, defer with consequence, or waive explicitly. “No decision” is sometimes honest, but record it as unresolved risk rather than implying approval.

## Critique anti-patterns

- brainstorming fixes before agreeing on the problem;
- debating Visual polish before resolving Structure and Behavior blockers;
- letting a high weighted rubric score mask an unresolved Hard-Floor failure;
- shrugging off a *"Something feels slightly off"* trust signal instead of tracing its concrete cause;
- treating novelty as inherently good or bad;
- averaging conflicting feedback into a bland compromise;
- criticizing placeholder absence when real content was explicitly unavailable;
- letting visual polish crowd out floor/state/task blockers;
- using “users won't understand” without labeling it hypothesis/risk;
- redesigning approved visual scope without explicit authority;
- ending with no priority, owner, or preservation rule.

## Termination

Stop when material issues have decisions, additional comments repeat existing risks, evidence required is unavailable and recorded, or further changes would exceed scope. One focused revision round is normal; endless critique by taste is not verification.
