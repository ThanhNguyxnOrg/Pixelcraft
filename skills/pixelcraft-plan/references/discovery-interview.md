# Project discovery and decision interview

Discovery is how `pixelcraft-plan` turns an under-specified brief into an actionable plan without guessing silently. Choose the lightest mode that actually resolves uncertainty: **Grill-Me / Deep Shaping** for open-ended or ambiguous scope, **Fast Confirm** for clear features with 1–2 open choices, and **Direct Execution** for narrow fixes or approved designs.

## Choose the right mode

Planning is always required. **Do not jump straight to code on a greenfield product, vague brief, or undecided redesign**—silently filling major product, IA, visual, and stack blanks with model assumptions produces generic output that has to be rewritten.

| Situation | Mode | What to do |
|---|---|---|
| Greenfield product, vague or ambiguous brief, major redesign, or user asks to brainstorm / grill / compare options | **Grill-Me / Deep Shaping** | Inspect the repo/brief first, then run [grill-me-protocol.md](grill-me-protocol.md): walk unresolved branches one principal question per turn with **(Recommended)** options until actionable. |
| Clear feature or scoped surface with 1–2 undecided design, IA, or stack/library choices | **Fast Confirm** | Inspect code and artifacts, propose concrete options with a recommendation and trade-offs in one focused turn, and confirm before coding. |
| An existing repository is involved | **Brownfield first** | Always run the codebase-first inspection gate (code, design system, runtime, data contracts, docs) *before* deciding between Grill-Me, Fast Confirm, or Direct Execution. |
| Narrow bug fix, copy change, visual tweak, behavior-preserving refactor, or already-approved design spec | **Direct Execution** | Skip product discovery; write a compact scoped plan, use safe reversible defaults for minor details, and build directly. |

Actively enter **Grill-Me / Deep Shaping** whenever the brief leaves any of these materially undecided: primary user/job, anti-goals/taboos, core workflow/IA shape, visual ambition, platform/stack or sub-stack capability libraries, data/auth model, or acceptance criteria. An explicit request to brainstorm or shape an idea always triggers Grill-Me.

Reserve **Direct Execution** for genuinely complete briefs, approved designs, or narrow edits. If the user explicitly says "you decide and build directly," honor that override, record conservative defaults and risks in `.pixelcraft/plan.md`, and proceed.

## Principles

1. **Read before asking (Codebase-First Gate).** Inspect the request, conversation context, repository, existing plan/brief, design artifacts, manifests and lockfiles, API contracts, analytics or product docs, and relevant tests. Check current official documentation or registries for facts that can change. Never ask the user for something already readable in the environment.
2. **Separate facts from decisions.** Facts are the agent's responsibility to find. User-owned preferences, anti-goals/hate-lists, priorities, budgets, business constraints, and approval decisions belong to the user. Label observations, research, assumptions, and unknowns separately.
3. **Ask about outcomes and anti-goals before trivia.** Establish what users must accomplish and what competitor tropes or UX patterns the user rejects before debating component details. Do not make a non-technical user choose technologies without explaining the product consequence.
4. **Recommend, do not dump options.** For every material choice, explain why it matters in one sentence, offer 2–4 concrete options, lead with **(Recommended)** and evidence-backed trade-offs, and allow free-form answers, "you decide", or "skip". Never fabricate a recommendation when evidence is insufficient.
5. **One principal question per turn.** Follow [grill-me-protocol.md](grill-me-protocol.md): never dump a 10-question questionnaire wall. Wait for upstream answers before asking dependent downstream questions.
6. **The user owns the decision.** A recommendation is not approval. Preserve explicit user decisions over model preference, and pause for design sign-off before coding on undecided greenfield or redesign scope.
7. **Stop when the plan is actionable.** Resolve material branches, record remaining assumptions and risks, then move to `pixelcraft-direction` and the Design Approval `<HARD-GATE>`.

## Build the decision map

Start with the outcome and work outward. Include only dimensions relevant to this project:

| Decision area | Questions the agent may need to resolve |
|---|---|
| Problem, KPIs & primary CTAs | What problem exists? Which measurable business/task KPI signals success, and which **1–2 primary CTAs** outrank secondary actions? |
| Users and context | Primary user or role, expertise, frequency, device, environment, language/IME scripts, accessibility needs, and network conditions |
| Scope | Core jobs, MVP boundary, must-have versus later, non-goals, roles/permissions, and cost of missing a capability |
| Experience & 5-second hierarchy | What must a user understand and see where to act within **5 seconds**? Main flows, navigation, visual ambition, states, recovery, and approved designs |
| Content & CMS ownership | Who writes, localizes, and maintains copy, pricing, legal text, and media post-launch (static source, Git Markdown/MDX, headless/integrated CMS, translation catalog)? |
| Platform & distribution regime | Web, mobile, desktop, data app, TUI, email, document, game, spatial, or constrained hardware; store/host gates (App Store, Google Play, `MV3`, Steam Deck/Console `TRC`, `PDF/X-4`, `RFC 8058`) |
| Data and integrations | Existing API/backend, ownership, persistence, import/export, authentication, permissions, realtime/offline behavior, third-party services |
| Technical approach | Existing stack constraints, candidate languages/frameworks, rendering model, deployment, testing, operations, maintainability, and team capability |
| Regulatory, quality & constraints | EU `EAA` / `EN 301 549`, `ADA Title II`, privacy/data residency, performance, security, licensing/IP ownership, budget, timeline, and maintenance horizon |
| Validation | Acceptance criteria, critical states, measurement source, tests, and evidence needed to call the work complete |

Do not ask every row as a checklist. A landing page with no backend does not need a database interview; a brownfield feature does not need a fresh framework comparison when the existing stack is authoritative.

## Interview loop

1. **Summarize what is already known.** Briefly replay the goal and evidence found. Mention important unknowns without pretending they are facts.
2. **Find the highest-impact unresolved decision.** Map dependencies between decisions. Ask only a question whose answer is not already known and can change the plan.
3. **Frame the choice.** Explain why the decision matters, then provide concrete choices in user language. For example, distinguish “show information and collect interest” from “support account-based workflows and saved data” before comparing web architecture.
4. **Give a recommendation.** State the suggested choice and reason. Note important trade-offs and confidence. A simple “yes” may accept the recommendation; the user can choose another option or answer freely.
5. **Wait and update the map.** Treat the user's answer as authoritative, update dependent decisions, and ask the next highest-impact question. Do not ask downstream questions whose premises are not yet settled.
6. **Research technical branches.** When a choice depends on current framework support, compatibility, pricing, hosting, APIs, or version-specific behavior, verify against current primary sources and registries. Return a short comparison, not an unbounded technology catalogue.
7. **Close the interview.** When all material branches are resolved or explicitly recorded as assumptions, summarize decisions, recommendation, trade-offs, non-goals, risks, and validation criteria. Do not continue asking low-value questions.

Use this response shape for each material choice:

> **Decision — [plain-language topic]**
>
> Why it matters: [one sentence tied to the user's outcome]
>
> A. **[Recommended option]** — [what it means and why it fits]
> B. [Alternative] — [main trade-off]
> C. [Alternative] — [main trade-off]
> D. Other / not sure — [free-form answer or request for comparison]
>
> Recommendation: [A], because [evidence and consequence]. Reply with a letter, correct the recommendation, or tell me to decide.

Do not force this exact formatting for a trivial question. Keep the prompt concise and conversational.

## Technology and stack decisions

Treat stack choice as a consequence of product requirements, not the opening question.

- In brownfield work, keep the existing stack unless a separate runtime/platform is required or the user authorizes a migration. First inspect locked versions, shared components, backend contracts, deployment, team conventions, and neighboring tests.
- In greenfield work, establish platform, user jobs, content/data needs, interaction/rendering requirements, offline/network needs, team capability, distribution, hosting, accessibility/legal duties, performance, budget, and maintenance expectations before narrowing candidates.
- Compare a small credible shortlist (normally 2–4) against actual constraints. Use hard gates before weighted scoring. Explain developer-experience and operational trade-offs in terms the user can evaluate.
- Prefer the least complex sufficient architecture. A visually rich interface does not automatically need a 3D renderer; an interactive app does not automatically need a large SPA; a static/content experience may not need a backend.
- Verify current versions and APIs with official docs and registries before committing to a version-sensitive choice. If unavailable, state the version assumption and what remains unchecked.
- Record the winner, runner-up where meaningful, why alternatives lost, confidence, reversal conditions, and whether the user explicitly selected or accepted the recommendation.

## Documents and decision memory

Use the existing Pixelcraft artifacts as the source of truth:

- `.pixelcraft/brief.md` records product outcome, audience, constraints, material, boundaries, and validation.
- `.pixelcraft/plan.md` records project mode, repository/system evidence, platform/stack, implementation routing, verification, risks, and discovery outcome.

Do not create parallel specification files when these artifacts are sufficient. Preserve prior decisions when updating a plan.

Create an ADR only when a decision is difficult to reverse, surprising without context, and based on a genuine trade-off. Create or update a glossary only when the project has recurring domain-specific or overloaded terms that will materially help future work; follow existing repository conventions and do not create one by default. Never write documents merely to imitate a process.

## Completion and approval boundary

Discovery is complete when:

- the primary user outcome, task, and anti-goals/hate-list are clear enough to define success;
- project scope and non-goals are bounded;
- the platform, stack (rejecting lazy defaults), and Sub-Stack Capability libraries are selected, constrained by the repository, or explicitly deferred;
- important data, integration, privacy, security, accessibility, localization, and operational constraints are known or recorded as risks;
- major flows and critical states are understood well enough to plan;
- acceptance criteria and verification evidence are actionable; and
- each remaining material unknown has an owner, consequence, and next check.

Present the resulting brief/plan in a concise summary. **For undecided greenfield products, multi-screen features, or major redesigns, require explicit design sign-off** (combining the plan summary with `pixelcraft-direction`'s 2–3 contrasting directions + ASCII structural skeletons + stack/library choices) before writing implementation code. Preserve the **Direct Execution** path without extra ceremony for narrow bug fixes, copy tweaks, visual polish, behavior-preserving refactors, or implementations of an already-approved design.

If the user explicitly asks to skip questions or says "you decide and build directly," stop interviewing, record conservative reversible defaults and rejected lazy defaults in `.pixelcraft/plan.md`, surface only material risks, and proceed.