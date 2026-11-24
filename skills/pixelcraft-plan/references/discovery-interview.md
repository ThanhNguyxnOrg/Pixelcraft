# Project discovery and decision interview

Use this workflow only when a project or feature still has meaningful decisions to make. It is a conversation pattern inside `pixelcraft-plan`, not a separate skill and not a mandatory questionnaire.

## Choose the right path

Planning is required; a long interview is not.

| Situation | Path |
|---|---|
| The request is specific, the target and constraints are clear, and the remaining choices are low-risk | **Direct plan** — inspect evidence, state small assumptions, and proceed |
| The user explicitly asks to brainstorm, shape an idea, define scope, compare options, or choose a stack | **Discovery interview** — explore unresolved decisions before finalizing the plan |
| A greenfield product or feature brief is too broad to determine its outcome, primary workflow, platform, or constraints | **Discovery interview** — inspect supplied context, then ask only questions that affect the result |
| An existing repository is involved | **Brownfield first** — inspect code, design system, runtime, data contracts, and docs before asking |
| The request is a narrow bug fix, copy change, visual tweak, or implementation of an approved design | **Scoped/direct plan** — do not turn it into product discovery |

Enter discovery when at least one material decision is unresolved and the answer could change product scope, user outcome, core flow, platform, architecture, data model, security/privacy posture, distribution, or cost. An explicit request to brainstorm also starts discovery.

Do not enter discovery merely because some detail is unspecified. Use the smallest safe, reversible default for low-impact details and record it as an assumption. If the user says to decide, make an evidence-backed recommendation rather than returning the decision to them.

## Principles

1. **Read before asking.** Inspect the request, conversation context, repository, existing plan/brief, design artifacts, manifests and lockfiles, API contracts, analytics or product docs, and relevant tests. Check current official documentation or registries for facts that can change. Never ask the user for something already available in the environment.
2. **Separate facts from decisions.** Facts are the agent's responsibility to find. User-owned preferences, priorities, budgets, business constraints, and approval decisions belong to the user. Label observations, research, assumptions, and unknowns separately.
3. **Ask about outcomes, not trivia.** Find out what users need to accomplish before asking about components, libraries, or framework preferences. Do not make a non-technical user choose technologies without explaining the consequence in product terms.
4. **Recommend, do not dump options.** For a material choice, offer 2–4 plausible options, explain practical trade-offs, and lead with the recommended option and why it fits the evidence. Include “Other / not sure” when useful. Never fabricate a recommendation when evidence is insufficient.
5. **Keep the conversation adaptive.** Ask one principal question per turn by default. Ask a small group only when decisions are genuinely independent and easy to answer together. Dependent decisions wait until prerequisites are resolved.
6. **The user owns the decision.** A recommendation is not approval. Accept a direct answer, correction, “you decide”, or “skip this”; preserve explicit user decisions over model preference.
7. **Stop when the plan is actionable.** Do not settle every implementation detail before implementation. Resolve material branches, record remaining assumptions and risks, then move forward at the appropriate approval boundary.

## Build the decision map

Start with the outcome and work outward. Include only dimensions relevant to this project:

| Decision area | Questions the agent may need to resolve |
|---|---|
| Problem and outcome | What problem exists? Who experiences it? What should become easier, faster, safer, or possible? What signal would show success? |
| Users and context | Primary user or role, expertise, frequency, device, environment, language, accessibility needs, and network conditions |
| Scope | Core jobs, MVP boundary, must-have versus later, non-goals, roles/permissions, and cost of missing a capability |
| Product experience | Main flows, navigation, interaction model, content, visual ambition, states, recovery, and existing references or approved designs |
| Platform | Web, mobile, desktop, data app, TUI, email, game, spatial, embedded, or a justified combination; distribution and input modalities |
| Data and integrations | Existing API/backend, ownership, persistence, import/export, authentication, permissions, realtime/offline behavior, third-party services |
| Technical approach | Existing stack constraints, candidate languages/frameworks, rendering model, deployment, testing, operations, maintainability, and team capability |
| Quality and constraints | Performance, reliability, security, privacy, legal duties, accessibility, localization, budget, timeline, and maintenance horizon |
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

- the primary user outcome and task are clear enough to define success;
- project scope and non-goals are bounded;
- the platform and stack are selected, constrained by the repository, or explicitly deferred;
- important data, integration, privacy, security, accessibility, localization, and operational constraints are known or recorded as risks;
- major flows and critical states are understood well enough to plan;
- acceptance criteria and verification evidence are actionable; and
- each remaining material unknown has an owner, consequence, and next check.

Present the resulting brief/plan in a concise summary. Ask for explicit approval before an irreversible or high-impact product/architecture decision, a major scope expansion, or implementation when the user requested planning only. Do not add an approval ceremony to a routine, clearly requested implementation; ordinary user instructions remain authorization for the scoped work.

If the user asks to skip questions or move quickly, stop interviewing. Use conservative, reversible defaults, mark assumptions, and surface only risks that could materially change the result.