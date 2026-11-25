# Grill-Me Socratic Decision-Tree Protocol

Use this protocol inside `pixelcraft-plan` whenever the user enters **Grill-Me / Deep Shaping**: greenfield products, vague or under-specified briefs, major redesigns, or explicit requests to brainstorm, grill, or compare options. The goal is to resolve every high-leverage product, IA, visual-ambition, and stack decision *before* writing code—without dumping a questionnaire wall or asking facts already present in the codebase.

## Step 1: Codebase-First Inspection Gate

Before asking the user **any** question:

1. Inspect the workspace, git history, manifests, lockfiles, existing routes/screens, tokens/theme files, component primitives, docs, and supplied design artifacts.
2. Cite the observed files and established constraints in a 3–5 line context replay at the top of your first turn.
3. **Never ask the user facts readable from the repo** (installed framework, package manager, existing palette tokens, database schema, current routes, or test runner). Reserve user turns exclusively for intent, priorities, anti-goals, taste boundaries, and trade-off approvals.

If the repo is empty, state that explicitly ("Workspace is greenfield; no existing manifests or tokens found") and move directly to the first unresolved branch.

## Step 2: Walk the Decision Tree — One Principal Question Per Turn

Walk only the **unresolved** branches below, in dependency order. Skip any branch already settled by the prompt, supplied artifacts, or repository evidence.

**Strict pacing rule:** ask **one principal question per turn**. Never dump a 5-to-10-question numbered list in a single message. Downstream branches wait until upstream branches are resolved because the answer to an earlier branch often collapses later branches.

| Order | Branch | What to resolve | Skip when |
|---|---|---|---|
| 1 | **Problem, KPIs & 1–2 Primary CTAs** | Who uses this, what business KPI or task outcome proves success, which **1–2 primary CTAs** dominate the flow, and what is strictly in/out of MVP scope? | Brief already states actor, measurable KPI/outcome, primary CTAs, and MVP boundary. |
| 2 | **Anti-Goals & Hate-List** | Which competitor tropes, visual clichés, or UX patterns does the user **hate** or explicitly refuse (e.g., cluttered SaaS cards, modal traps, generic dark-neon AI styling, bloated wizards)? | User already supplied explicit taboos or an approved locked design. |
| 3 | **Core Workflow, 5-Second Hierarchy & Content/CMS Ownership** | What must a user grasp and see where to act within **5 seconds**, what is the primary IA/workspace shape, and **who owns/updates copy & media** (static repo files, Git Markdown, headless/integrated CMS, localization pipeline)? | Existing app IA, content/CMS pipeline, or approved wireframes fix these. |
| 4 | **Visual World, Ambition Tier & Signature Moment** | Which ambition tier fits the stakes—**Pragmatic High-Craft**, **Editorial / Domain-Object Signature**, or **Bold Experimental**—and what real subject material or single signature moment anchors it? | Approved brand/design spec locks visual direction. |
| 5 | **Stack & Library Craft Bar** | Confirm target platform(s), runtime stack (rejecting lazy defaults), and purpose-built libraries for complex sub-stack capabilities (editors, charts, tables, drawers, search, maps, PDF) instead of DIY hand-rolls. | Brownfield stack and approved libraries already cover every capability. |
| 6 | **Regulatory/Store Regime, Critical States & Acceptance** | Confirm target **regulatory/distribution regime** (App Store, Google Play, Chrome `MV3`, EU `EAA` / `EN 301 549`, Steam Deck/Console `TRC`, Commercial Print `PDF/X-4`, Bulk Email `RFC 8058`), non-happy-path states, and acceptance proof. | Brief + repo configs already specify distribution regime, states, and acceptance checks. |

## Step 3: Per-Decision Frame & Option Contract

For every unresolved branch you ask:

1. **Why it matters (1 sentence):** tie the choice directly to a concrete product, UX, or architecture consequence.
2. **2–4 concrete options, leading with `(Recommended)`:** label the strongest evidence-backed choice first with **(Recommended)**, and state the concrete trade-off for each alternative (never vague adjectives like "clean" or "modern").
3. **Flexible exit on every turn:** explicitly allow a short letter/name reply, a free-form answer, **"you decide"**, or **"skip"** (which records a reversible assumption and moves to the next unresolved branch).

Compact turn shape:

```markdown
**Observed context:** [1–2 lines citing repo/brief facts already established — omit after turn 1 unless new facts were inspected]

**Decision [N/6] — [Branch topic]**
Why it matters: [one concrete sentence tied to user outcome or architecture].

1. **(Recommended) [Option A]** — [concrete shape + why it fits observed constraints; key trade-off].
2. **[Option B]** — [concrete alternative + main trade-off].
3. **[Option C]** — [concrete alternative + main trade-off].

Reply with a number, combine parts, give a custom answer, or say "you decide" / "skip".
```

## Step 4: Exit Condition & Handoff

Stop grilling immediately once all 6 branches are either **resolved by the user**, **constrained by observed repo/artifact facts**, or **recorded as explicit reversible assumptions** (typically 2–5 turns total—never drag out trivia).

Before writing any implementation code:

1. Write or update `.pixelcraft/plan.md` (using `references/plan-template.md`), recording:
   - mode (`Grill-Me / Deep Shaping`), observed repo files, resolved decisions, anti-goals/hate-list, chosen stack + rejected lazy defaults, and the **Sub-Stack Capability → Purpose-Built Library** table;
   - every remaining assumption with its consequence and reversal cost.
2. Hand off cleanly to `pixelcraft-direction` (creative brainstorming) to pitch 2–3 contrasting directions with ASCII structural skeletons and real-copy lead drafts, then pause at the **Design Approval `<HARD-GATE>`** before entering Build—unless the user explicitly says to decide and build directly.
3. Keep the **Creative Direction → Plan Feedback Loop** open: if the user picks a direction in `pixelcraft-direction` that calls for a richer runtime or renderer (e.g., Rive, WebGPU, Typst, Tauri, or native desktop/mobile), update `.pixelcraft/plan.md` before coding rather than forcing the concept onto a mismatched stack.
