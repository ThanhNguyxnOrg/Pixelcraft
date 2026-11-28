---
name: pixelcraft
description: Orchestrates distinctive, evidence-verified UI work across any frontend stack. Use when designing, building, redesigning, auditing, brainstorming, grilling requirements, or polishing web apps, mobile apps, desktop windows, data apps, terminal UI, game UI, emails, paginated documents/PDFs/slides, social/video media, chat/bot/AI assistant UI, spatial/XR, constrained TV/wearable/voice/embedded surfaces, browser/IDE extensions, dataviz dashboards, brand kits, or Figma design handoffs. Detects the stack and surface mode, runs the Pixelcraft loop with Grill-Me discovery, creative divergence, anti-slop iron laws, and produces an evidence-labeled final report.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft orchestrator

Use this skill first whenever the task creates or changes a user-facing interface. It coordinates other Pixelcraft skills by name; each skill is independently installable and intentionally not imported by path.

## Authority order

Apply constraints in this order and stop at the first conflict:

1. explicit user brief;
2. existing project design system, tokens, components, content, and conventions;
3. platform conventions, legal requirements, and the accessibility floor;
4. Pixelcraft guidance;
5. model taste.

Never override a user or project decision because it resembles a common pattern. Flag conflict instead of silently replacing it.

## Approved-design rule

When the user asks to implement an approved design, do **not** run divergence or change visual direction. Route through `pixelcraft-handoff` to preserve layout, hierarchy, token/color/type decisions, interaction meaning, and accessibility while translating into the actual stack. Divergence applies only to undecided parts: missing states/breakpoints/behavior, token or accessibility gaps, and regions explicitly classified as inspiration rather than specification.

## Iron laws and rationalization table

| Excuse the agent is tempted to use | Required reality |
|---|---|
| "This is a quick demo / small page, skip Plan & Diverge." | Scale depth proportionally, never skip checkpoints. Only narrow bug fixes, copy tweaks, or approved designs use Direct Execution. |
| "I'll guess requirements and jump straight to code to save a turn." | When scope or direction is open, inspect the repo first, run `pixelcraft-plan` Grill-Me one question at a time, and stop at the pre-code Design Approval gate. |
| "Tkinter / Electron / Streamlit / raw `print()` / DIY modal is faster." | Reject lazy defaults and fragile DIY widgets. Use the Stack & Library Craft Gate in `pixelcraft-plan` to pick native primitives or purpose-built libraries. |
| "I'll leave `// TODO`, `// ...`, empty `onClick`, or 3 mock rows for now." | Zero stubs, zero ellipsis truncation, zero dead handlers, zero unapproved mock data posing as live state. |
| "Playwright/device isn't handy, so `not-checked` or `static` means pass." | Attempt available local tools first (`slop-scan`, `check-*`, `check-acceptance`, runtime/test runner). **Rule #0.3:** `static` or `model-judgment` **never** counts as `pass` for visual appearance, performance budgets, or interactive/assistive a11y; never claim "ready to ship" on `not-checked` scope. |
| "Code is written / I did one quick pass, so I can stop now." | **Forbidden.** Enforce the **Completion & Scan-Until-Clean `<HARD-GATE>`**: walk every applicable checklist (`floor.md`, platform `Pre-submit`, `polish.md`) and run `scan → fix → rescan` until all deterministic scans (`slop-scan --fail-on p2`, `check-*`, compiler/linter/tests) and `check-acceptance.mjs .pixelcraft/acceptance.json` pass with `0` `fail`/`pending` rows. |

## References

- Read [references/stack-detection.md](references/stack-detection.md) when identifying the frontend stack, rendering surface, input modality, or existing design system.
- Read [references/design-brief.md](references/design-brief.md) during framing whenever the work changes a user-facing surface.
- Read [references/workflow-checkpoints.md](references/workflow-checkpoints.md) before planning; it selects Grill-Me vs Fast Confirm vs Direct Execution and defines hard phase exit gates.
- Read [references/surface-acceptance.md](references/surface-acceptance.md) before choosing platform-specific acceptance evidence.
- Read [references/floor.md](references/floor.md) before implementation and again before reporting; every rule is mandatory unless the user explicitly waives it.
- Read [references/report-template.md](references/report-template.md) before the final response or handoff.

## Frame before designing

Inspect available context first (repository, tokens, manifests, existing screens). Then select the planning mode in `pixelcraft-plan`:
- **Grill-Me / Deep Shaping:** greenfield products, vague briefs, major redesigns, or when the user asks to brainstorm/grill — walk unresolved branches **one question per turn** with 2–4 options leading with **(Recommended)**.
- **Fast Confirm:** clear feature with a few open direction/library choices.
- **Direct Execution:** narrow bug fix, copy edit, or already-approved design.

Classify the surface using evidence in the repository rather than assumptions:

| Mode | User success | Expression budget | Typical surfaces |
|---|---|---|---|
| Persuade | understand or choose an offering | highest | landing pages, campaigns, portfolios |
| Operate | complete a task efficiently | restrained, earned familiarity | dashboards, settings, forms, admin/product UI |
| Read | comprehend content | typography and measure first | docs, editorial, reports |
| Experience | inhabit a memorable artifact | high but controlled | exhibitions, interactive stories, launches |
| Play | play, explore, or compete | high within legibility/HUD constraints | games, toys, playful education |
| Communicate | receive a clear message across clients/locales | constrained by medium | email, notifications, documents |

Hybrid surfaces pick one primary mode per screen or region. Do not let a persuasive visual system leak into high-frequency operational UI.

## The Pixelcraft loop

0. **Plan** — use the `pixelcraft-plan` skill first. In brownfield work, map the repository systematically and write `.pixelcraft/plan.md`; in greenfield or ambiguous work, run Grill-Me / Discovery one question at a time, choose the **Workflow Track (`Code-First` vs `Mockup-First`)** based on visual-alignment stakes and image-generation capability, reject lazy tech-stack defaults, resolve purpose-built sub-stack libraries, justify stack selection with evidence, **initialize `.pixelcraft/acceptance.json` (`check-acceptance.mjs --init <platform> --out .pixelcraft/acceptance.json` in `pixelcraft-review`) with agreed numeric/device thresholds upfront**, and **lock in the Mandatory Completion Gate & Scan-Until-Clean Contract** inside `.pixelcraft/plan.md` before visual direction. If `pixelcraft-plan` is not installed, meet the Plan checkpoint inline and record missing evidence as `not-checked`.
1. **Frame** — detect stack/surface/input modality; identify audience, job-to-be-done, real material inventory, constraints, locale scope, and existing design system. Update the design brief using `references/design-brief.md`; classify facts as user-provided, repo-observed, artifact-observed, research/analytics, assumption, or unknown.
2. **Diverge** — only for undecided visual/IA scope. Use `pixelcraft-direction` (plus `pixelcraft-ux` for competing IA/workflow shapes) to generate 3–5 far-apart directions across IA, visual posture, and craft ambition, each with an ASCII structural skeleton and real-copy draft. On the **Mockup-First** track (when image generation is available), convert the top 2–3 contrasting direction cards into orthographic UI mockup images for visual comparison and approval; otherwise stay on **Code-First** (direction cards + ASCII skeletons). Enforce the **Pre-Code Design Approval `<HARD-GATE>`**: present top contrasting options (visual mockups or ASCII skeletons) + `(Recommended)` pick and confirm before coding on greenfield/redesign scope unless the user explicitly asks to decide and build directly. Allow a feedback loop back to `pixelcraft-plan` if the winning concept requires upgrading the stack. For brand-kit/logo image generation, route through `pixelcraft-brandkit`.
3. **Specify** — produce the direction card (with ASCII skeleton + real-copy draft); use `pixelcraft-tokens` for DTCG 2025.10 tokens, `pixelcraft-handoff` for Figma, approved-design, screenshot, or **approved Mockup-First image-to-code** translation, `pixelcraft-ux` for flows + complete state matrix, `pixelcraft-patterns` for named product patterns (escalating complex widgets to vetted libraries), and `pixelcraft-dataviz` for quantitative dashboards, maps, or graphs.
4. **Build** — use the matching platform skill by name (`pixelcraft-web`, `pixelcraft-mobile`, `pixelcraft-data-apps`, `pixelcraft-desktop`, `pixelcraft-tui`, `pixelcraft-email`, `pixelcraft-document`, `pixelcraft-media`, `pixelcraft-chat-ui`, `pixelcraft-constrained`, `pixelcraft-spatial`, `pixelcraft-game-ui`, or `pixelcraft-extensions`). Translate idiomatically without importing web assumptions. Deliver complete in-scope behavior: zero `// TODO`, zero ellipsis truncation, zero empty handlers, zero unapproved mocks. Verify version-sensitive APIs against versioned official docs/registries and commit reproducible locks (never floating `@latest`).
5. **Verify (`Completion & Scan-Until-Clean <HARD-GATE>`)** — **never stop after Build.** Execute the planned verification contract in `pixelcraft-review` and `pixelcraft-visual-qa`: (a) walk every applicable row of `references/floor.md`, the active platform skill's `Pre-submit checklist`, and `pixelcraft-review`'s `polish.md`; (b) run `slop-scan.mjs <target> --fail-on p2`, applicable surface CLIs (`check-contrast.mjs`, `check-email.mjs`, `check-tui.mjs`, `check-pdf.mjs`), and strict active-language compiler/type/linter/test suites; (c) run rendered QA (`shoot.mjs`, simulator/device/CLI capture, and `finish-gate.mjs` where applicable); (d) update `.pixelcraft/acceptance.json` and run `check-acceptance.mjs .pixelcraft/acceptance.json` (enforcing **Evidence Rule #0.3** and 3-tier Studio grading). **If any deterministic scan, compiler/test check, checklist item, or acceptance row fails or remains `pending`, fix the root cause and re-run the scans until `0` `fail` and `0` `pending` rows remain before advancing to Report.**
6. **Report** — only after passing the Phase 5 `<HARD-GATE>`, report the 3-tier Studio verdict (`PASS_STUDIO_10K_20K` / `EXCEEDS_STUDIO`, or `PENDING_RENDERED_ENV` when external hardware is unavailable—never `FAIL`), decisions, executed scan commands + exit codes, checklist sign-off, verification evidence by label, unresolved risks, and waived items using `references/report-template.md`.

Deterministic scan, compiler/test, stub, state, and floor-checklist failures have **zero repair-round shortcut**: keep fixing and rescanning until clean (never suppress errors, delete essential content, or invent waivers). For rendered layout/pixel loops under `finish-gate.mjs`, use at most three documented rendered repair rounds before escalating a genuinely blocked visual conflict as `OPEN` alongside unchecked scope. A command with a suppressed failure is a probe, not evidence of a passing check.

## Scoped work and stopping

- Before editing, name the affected route/interaction, preserved behavior, and the smallest check that can disprove success. For narrow changes, reuse the current plan and approved direction; read only the relevant reference sections. New or materially changed flows still require the applicable finish gate.
- Reuse recorded repository and version evidence unless scope, inputs, or dependencies change. Run the affected check first; expand coverage for shared behavior or demonstrated risk.
- If the tool/time/context budget runs low, preserve revision, changed scope, evidence paths, unchecked checks, and the next discriminating command in the handoff. Never trade outcome evidence for a completion claim.

## Platform routing

After detecting the stack, use the matching platform skill by name and read only the relevant framework reference inside it:

| Platform skill | Framework and surface references |
|---|---|
| `pixelcraft-web` | Frameworks: `html-css`, `react-next`, `vue-nuxt`, `svelte`, `solid`, `angular`, `astro`, `qwik`, `preact-fresh-hono`, `htmx-alpine`, `lit-web-components`, `server-rendered`, `leptos-yew`, `kotlin-web`, `elm`, `clojurescript`, `fsharp-fable`, `scala-laminar`, `java-web`; Engineering: `tailwind`, `styling-ecosystem`, `component-systems`, `interaction-and-search-primitives`, `state-architecture`, `forms-validation`, `enterprise-data-ui`, `rich-text-and-code-editors`, `canvas-and-node-editors`, `local-first-sync`, `auth-and-checkout-ui`, `file-upload-media-ui`, `i18n-engineering`, `build-and-architecture`, `component-testing`, `adaptive-layout`, `pwa`; Motion/3D/Media: `gsap`, `motion-react`, `smooth-scroll`, `motion-recipes`, `rive-lottie`, `scene-architecture`, `r3f-integration`, `web-3d-engines`, `assets-pipeline`, `rendering-choice`, `rendering-performance`, `shader-workflow`, `creative-effects`, `creative-runtime`, `media-players`, `video-media`, `audio-reactive`, `accessibility-performance` |
| `pixelcraft-mobile` | `swiftui`, `uikit`, `jetpack-compose`, `flutter`, `react-native-expo`, `lynxjs`, `kotlin-multiplatform`, `nativescript-and-skip`, `harmonyos-and-emerging-mobile`, `ionic-capacitor`, `dotnet-maui`, `flet`, `kivy`, `tactile-interactions`, `task-state-composition` |
| `pixelcraft-data-apps` | `streamlit`, `gradio`, `reactive-data-apps`, `ai-and-internal-data-apps`, `reflex`, `nicegui`, `dash`, `panel`, `shiny`, `jupyter-widgets`, `r-shiny`, `julia-genie`, `observable-framework`, `evidence` |
| `pixelcraft-desktop` | `tauri`, `electron`, `qt-pyside-qml`, `winui-wpf`, `appkit`, `gtk`, `avalonia`, `rust-gui`, `javafx-swing`, `cpp-gui`, `go-gui`, `uno-platform`, `working-context` |
| `pixelcraft-tui` | `textual`, `rich`, `ink`, `bubbletea-lipgloss`, `ratatui`, `extended-tui-toolkits`, `terminal-protocols` |
| `pixelcraft-email` | `html-tables`, `mjml`, `react-email`, `maizzle`, `client-quirks` |
| `pixelcraft-document` | `print-css`, `pdf-tools`, `pdfjs-and-pptx`, `archetypes`, `slides` |
| `pixelcraft-media` | `social-cards`, `og-generation`, `banners-video` |
| `pixelcraft-chat-ui` | `slack-discord`, `mobile-business-platforms`, `conversation-design`, `agentic-workspace`, `ai-ui-libraries` |
| `pixelcraft-constrained` | `tv-wearables`, `specialized-hardware`, `voice-ui` |
| `pixelcraft-handoff` | `design-translation`, `image-to-code`, `fidelity-tolerance`, `motion-handoff` |
| `pixelcraft-spatial` | `platforms`, `comfort-accessibility` |
| `pixelcraft-game-ui` | `unity-ui-toolkit`, `unity-ugui`, `godot`, `unreal-umg`, `hud-principles`, `love2d`, `bevy`, `monogame`, `web-and-middleware-game-ui` |
| `pixelcraft-extensions` | `browser-extensions`, `vscode-webviews`, `raycast`, `figma-office`, `ide-and-saas-plugins` |

References are named here for routing only. Do not construct relative paths across skill folders; read the file inside the installed platform skill.

Use `pixelcraft-craft` for motion design intent; `pixelcraft-web` for browser implementation including GSAP/Motion, scroll controllers, Canvas/PixiJS, shaders, Three.js/R3F/Babylon/PlayCanvas/Threlte/TresJS/`<model-viewer>`/Theatre.js/Spline, WebGPU/TSL fallbacks, and browser audio/video players. `pixelcraft-spatial` remains responsible for embodied XR/VR/AR interaction; ordinary browser 3D scenes route through `pixelcraft-web`.

## Domain and brand routing

- **Dataviz:** Use `pixelcraft-dataviz` alongside the platform skill whenever the deliverable depends on charts, analytical tables, metrics dashboards, streaming visualization, node graphs, maps, or BI plugins.
- **Brand identity:** Use `pixelcraft-brandkit` alongside `pixelcraft-direction` for brand kits, identity boards, logo systems, moodboards, or visual-world boards, and `pixelcraft-tokens` to export DTCG tokens.

## Mandatory floor summary

The full floor in `references/floor.md` is normative. At minimum:

- truthfulness & completeness: no invented facts, metrics, logos, or testimonials; zero `// TODO`, zero ellipsis truncation, zero no-op handlers/commands/links, zero unapproved mock arrays posing as live data;
- accessibility: native semantic controls, persistent names/labels, visible & unobscured keyboard/focus path (`WCAG 2.4.11`), contrast floor, reduced-motion & reduced-transparency paths, text scaling/reflow, no color-only meaning, plus `EAA`/`EN 301 549` statement readiness where applicable;
- interaction & invisible craft: frequency-calibrated timing, origin-aware overlays, optical alignment, forgiving hit-slop, tabular numerals, cancellation/undo/escape, no conflicting gestures, complete states;
- adaptation: restructure across sizes, orientations, input modalities, and platform idioms;
- localization: `+30–40%` prose and `+50–100%` short-label expansion, logical directionality, `Unicode NFC` diacritic & font-glyph integrity, active `IME` `Enter`-commit safety, locale formatting;
- performance: instant orientation, stable layout, asset budgets, nonblocking interaction;
- robustness: zero/one/many/long/missing/error/offline/permission/interruption/concurrency/AI-streaming states;
- coherence: semantic tokens and consistent hierarchy, affordances, motion, iconography, and copy;
- distinctiveness: at least one deliberate subject-specific commitment when mode permits;
- engineering & handoff hygiene: strict compiler/type/analyzer checks for the active language, clean ecosystem dependency vulnerability audit alongside lockfiles, staging separated from production, `< 10m` clean-clone setup, isolated state previews where supported, zero client-exposed secrets, verified commercial font/icon/media licenses, owner-level account/key handoff, and 30–90 day defect-warranty triage handoff note;
- verifiability: no claim without an evidence label (`references/surface-acceptance.md` covers the 12-row Surface Matrix and 3-tier Studio verdict).

The floor never mandates a hero, card, palette, typeface, border radius, shadow, layout shape, or visual movement.

## Evidence labels

| Label | Meaning |
|---|---|
| `rendered` | inspected actual rendered output, screenshot, device, simulator, terminal buffer, or runtime profiler |
| `static` | inferred from source, schema, configuration, or deterministic static analysis |
| `model-judgment` | heuristic/model evaluation; useful hypothesis, not proof |
| `not-checked` | relevant but not inspected; state concrete environment reason and next command when material |
| `waived` | user/brief explicitly overrides the rule; record client sign-off, scope, and consequence |

**Golden Evidence Rule (`Rule #0.3`):** **`static` or `model-judgment` NEVER counts as `pass` / accepted for visual appearance, measured performance budgets, or interactive/assistive accessibility requirements.** Those rows require `rendered` evidence—or must be recorded honestly as `not-checked` (with concrete reason) or `waived` (with explicit user authorization, scope, and consequence).

## Pre-submit checklist

- [ ] planning mode selected honestly (`Grill-Me` / `Fast Confirm` / `Direct Execution`), repo inspected first, and `.pixelcraft/acceptance.json` initialized (`check-acceptance.mjs --init <platform>`) with agreed numeric/device thresholds;
- [ ] lazy stack defaults rejected and complex UI capabilities routed to native primitives or purpose-built libraries;
- [ ] pre-code Design Approval gate met for greenfield/redesign/undecided scope (or approved design preserved via `pixelcraft-handoff`);
- [ ] zero `// TODO`, zero ellipsis stubs, zero dead controls/handlers, zero unwired mobile navigation, zero client secrets, zero unapproved fake proof/mocks;
- [ ] mandatory floor (`A1–A8`: a11y, `<=100ms`/`>1s`/`>10s` latency ladder, states, adaptation, `+50–100%` short-label i18n & `IME`/`NFC` safety, invisible craft, tokens, strict language & dependency vulnerability checks, staging separation, license & 30–90d warranty handoff) applied natively;
- [ ] **Completion & Scan-Until-Clean `<HARD-GATE>` passed:** every applicable checklist (`floor.md`, active platform `Pre-submit checklist`, and `pixelcraft-review` `polish.md`) walked item-by-item, and `slop-scan.mjs --fail-on p2`, applicable `check-*` CLIs, compiler/type/linter/test suites, `finish-gate.mjs`, and `check-acceptance.mjs .pixelcraft/acceptance.json` re-run after fixes until `0` `fail`/`pending` rows remain (enforcing **Rule #0.3**);
- [ ] final response reports the 3-tier Studio verdict (`PASS_STUDIO_10K_20K` / `EXCEEDS_STUDIO` / `PENDING_RENDERED_ENV`, never `FAIL`), selected direction, executed scan commands + exit codes, 12-row Surface Matrix, `not-checked`/`waived` items, and open risks.
