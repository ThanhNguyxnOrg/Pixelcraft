---
name: pixelcraft
description: Orchestrates distinctive, evidence-verified UI work across any frontend stack. Use when designing, building, redesigning, auditing, or polishing web apps, mobile apps, desktop windows, data apps, terminal UI, game UI, emails, paginated documents/PDFs/slides, social/video media, chat/bot/AI assistant UI, spatial/XR, constrained TV/wearable/voice/embedded surfaces, browser/IDE extensions, dataviz dashboards, brand kits, or Figma design handoffs. Detects the stack and surface mode, runs the Pixelcraft loop, routes to named Pixelcraft skills, applies the mandatory cross-platform floor, and produces an evidence-labeled final report.
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

## References

- Read [references/stack-detection.md](references/stack-detection.md) when identifying the frontend stack, rendering surface, input modality, or existing design system.
- Read [references/design-brief.md](references/design-brief.md) during framing whenever the work changes a user-facing surface.
- Read [references/workflow-checkpoints.md](references/workflow-checkpoints.md) before planning; it selects the task route and defines what must exist before advancing each phase.
- Read [references/surface-acceptance.md](references/surface-acceptance.md) before choosing platform-specific acceptance evidence.
- Read [references/floor.md](references/floor.md) before implementation and again before reporting; every rule is mandatory unless the user explicitly waives it.
- Read [references/report-template.md](references/report-template.md) before the final response or handoff.

## Frame before designing

The Plan phase distinguishes evidence gathering from optional product discovery. Do not start a questionnaire automatically: inspect available context first, then ask only about unresolved choices that could materially change the outcome, scope, platform, architecture, or constraints. A complete brief, approved design, or narrow fix should use a direct/scoped plan.

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

0. **Plan** — use the `pixelcraft-plan` skill first. In brownfield work, read the repository systematically and write `.pixelcraft/plan.md`; in greenfield work, establish product constraints and justify stack selection with evidence before any visual direction. `pixelcraft-plan` chooses a direct plan or an optional discovery interview; it does not require a long interview for every task. If `pixelcraft-plan` is not installed, meet the applicable Plan checkpoint inline and record missing evidence as `not-checked`; a missing skill is not permission to skip planning.
1. **Frame** — detect stack/surface/input modality; identify audience, job-to-be-done, real material inventory, constraints, locale scope, and existing design system. Create or update the design brief artifact using `references/design-brief.md`; classify facts as user-provided, repo-observed, artifact-observed, research/analytics, assumption, or unknown. Ask only for information that materially changes the design and cannot be established from project evidence or research.
2. **Diverge** — only for undecided visual scope. Use the `pixelcraft-direction` skill to generate 3–5 far-apart directions with probabilities, score them, select one, record why the others lost, and inspect repetition history. Do not rediverge an approved design; handoff preserves that intent. For brand-kit, identity-board, logo-system, moodboard, or visual-identity image generation, use the `pixelcraft-brandkit` skill by name and its 2–3 brand-world divergence flow before image prompting.
3. **Specify** — produce the direction card; use `pixelcraft-tokens` for DTCG tokens, `pixelcraft-handoff` when translating Figma/design-system artifacts into implementation, `pixelcraft-ux` for flows plus the state matrix, `pixelcraft-patterns` when the work matches a named product pattern, and `pixelcraft-dataviz` when the work communicates quantitative data, dashboards, maps, graphs, or visualization-heavy interfaces. Do not start with component trivia before direction and constraints exist.
4. **Build** — use the appropriate platform skill by name when installed (`pixelcraft-web`, `pixelcraft-mobile`, `pixelcraft-data-apps`, `pixelcraft-desktop`, `pixelcraft-tui`, `pixelcraft-email`, `pixelcraft-document`, `pixelcraft-media`, `pixelcraft-chat-ui`, `pixelcraft-constrained`, `pixelcraft-spatial`, `pixelcraft-game-ui`, or `pixelcraft-extensions`). If absent, translate the direction idiomatically yourself without importing web assumptions. Match version-sensitive APIs to the resolved stack in the plan; verify against versioned official docs, optional Context7 and registry metadata as available. Record source and date, or mark assumptions `not-checked`. Preserve existing locks and runtimes unless upgrades are authorized; commit reproducible locks for new apps, never floating `@latest` in CI/deploy.
5. **Verify** — use `pixelcraft-review` for slop scanning, heuristic critique, accessibility/state review, and evidence-ranked findings; use `pixelcraft-visual-qa` for rendered QA and performance budgets. For new or materially changed UI flows, run its evidence finish gate. If the gate or runtime is unavailable, report unchecked scope and open defects rather than declaring a pass.
6. **Report** — decisions, verification evidence, unresolved risks, and waived items using the report contract.

One repair round is normal. Use at most three for reproducible, measurable failures, then report unresolved defects as OPEN and state unchecked scope. A command with a suppressed failure is a probe, not evidence of a passing check.

Before advancing, record the applicable phase result and its evidence using the workflow checkpoints. Reuse current artifacts rather than making new copies. If a prerequisite is missing, resolve it before dependent work or report the blocker; a skill name, unchecked box, or polished output is not phase evidence.

## Scoped work and stopping

- Before editing, name the affected route/interaction, preserved behavior, and the smallest check that can disprove success. For narrow changes, reuse the current plan and approved direction; read only the relevant reference sections. New or materially changed flows still need the full applicable finish gate.
- Reuse recorded repository and version evidence unless scope, inputs, or dependencies change. Run the affected check first; expand coverage for shared behavior or a demonstrated risk. Do not rerun unchanged commands to gain confidence or repeat a failed lookup without a better source.
- If the tool/time/context budget runs low, preserve revision, changed scope, evidence paths, unchecked checks and the next discriminating command in the handoff. Never trade outcome evidence for a completion claim.

## Platform routing

After detecting the stack, use the matching platform skill by name and read only the relevant framework reference inside it:

| Platform skill | Framework and surface references |
|---|---|
| `pixelcraft-web` | Frameworks: `html-css`, `react-next`, `vue-nuxt`, `svelte`, `solid`, `angular`, `astro`, `qwik`, `preact-fresh-hono`, `htmx-alpine`, `lit-web-components`, `server-rendered`, `leptos-yew`, `kotlin-web`, `elm`, `clojurescript`, `fsharp-fable`, `scala-laminar`, `java-web`; Engineering: `tailwind`, `styling-ecosystem`, `component-systems`, `state-architecture`, `forms-validation`, `enterprise-data-ui`, `rich-text-and-code-editors`, `canvas-and-node-editors`, `local-first-sync`, `auth-and-checkout-ui`, `file-upload-media-ui`, `i18n-engineering`, `build-and-architecture`, `component-testing`, `adaptive-layout`, `pwa`; Motion/3D/Media: `gsap`, `motion-react`, `smooth-scroll`, `motion-recipes`, `rive-lottie`, `scene-architecture`, `r3f-integration`, `web-3d-engines`, `assets-pipeline`, `rendering-choice`, `rendering-performance`, `shader-workflow`, `creative-effects`, `creative-runtime`, `media-players`, `video-media`, `audio-reactive`, `accessibility-performance` |
| `pixelcraft-mobile` | `swiftui`, `uikit`, `jetpack-compose`, `flutter`, `react-native-expo`, `lynxjs`, `kotlin-multiplatform`, `nativescript-and-skip`, `ionic-capacitor`, `dotnet-maui`, `flet`, `kivy`, `tactile-interactions`, `task-state-composition` |
| `pixelcraft-data-apps` | `streamlit`, `gradio`, `reactive-data-apps`, `ai-and-internal-data-apps`, `reflex`, `nicegui`, `dash`, `panel`, `shiny`, `jupyter-widgets`, `r-shiny`, `julia-genie`, `observable-framework`, `evidence` |
| `pixelcraft-desktop` | `tauri`, `electron`, `qt-pyside-qml`, `winui-wpf`, `appkit`, `gtk`, `avalonia`, `rust-gui`, `javafx-swing`, `cpp-gui`, `go-gui`, `uno-platform`, `working-context` |
| `pixelcraft-tui` | `textual`, `rich`, `ink`, `bubbletea-lipgloss`, `ratatui`, `extended-tui-toolkits`, `terminal-protocols` |
| `pixelcraft-email` | `html-tables`, `mjml`, `react-email`, `maizzle`, `client-quirks` |
| `pixelcraft-document` | `print-css`, `pdf-tools`, `pdfjs-and-pptx`, `archetypes`, `slides` |
| `pixelcraft-media` | `social-cards`, `og-generation`, `banners-video` |
| `pixelcraft-chat-ui` | `slack-discord`, `mobile-business-platforms`, `conversation-design`, `agentic-workspace`, `ai-ui-libraries` |
| `pixelcraft-constrained` | `tv-wearables`, `specialized-hardware`, `voice-ui` |
| `pixelcraft-handoff` | `design-translation`, `fidelity-tolerance`, `motion-handoff` |
| `pixelcraft-spatial` | `platforms`, `comfort-accessibility` |
| `pixelcraft-game-ui` | `unity-ui-toolkit`, `unity-ugui`, `godot`, `unreal-umg`, `hud-principles`, `love2d`, `bevy`, `monogame`, `web-and-middleware-game-ui` |
| `pixelcraft-extensions` | `browser-extensions`, `vscode-webviews`, `raycast`, `figma-office`, `ide-and-saas-plugins` |

References are named here for routing only. Do not construct relative paths across skill folders; read the file inside the installed platform skill.

Use `pixelcraft-craft` for motion design intent; `pixelcraft-web` for browser implementation including GSAP/Motion, scroll controllers, Canvas/PixiJS, shaders, Three.js/R3F/Babylon/PlayCanvas/Threlte/TresJS/`<model-viewer>`, WebGPU/TSL fallbacks, and browser audio/video players (`hls.js`, Shaka, Vidstack, Media Chrome, Tone.js). Use `pixelcraft-patterns` for narrative/scrollytelling structure, `pixelcraft-direction` for evidence-based reference analysis, `pixelcraft-accessibility` for motion/canvas/media alternatives, and `pixelcraft-visual-qa` for timeline and real-time graphics verification.

`pixelcraft-spatial` remains responsible for embodied XR/VR/AR interaction (visionOS, Android XR, Horizon OS, WebXR, Unity XRI, Unreal OpenXR — headset, gaze, hand/controller input, room-scale comfort and privacy). Ordinary browser 3D product/portfolio scenes route through `pixelcraft-web`.

## Domain routing

Use `pixelcraft-dataviz` alongside the platform skill whenever the deliverable depends on charts, analytical tables, metrics dashboards, streaming visualization, node graphs, maps, or canvas/WebGL rendering. It governs analytical truth, encoding, color/accessibility, and library selection; the platform skill still governs implementation idioms.

## Brand routing

Use `pixelcraft-brandkit` when the deliverable is a brand kit, identity board, logo system, brand guidelines image, moodboard, visual-world board, rebrand/refresh concept, or implementation-oriented brand direction. It runs alongside `pixelcraft-direction` rather than replacing it: direction supplies divergence discipline; brandkit supplies intake, logo methods, board composition, prompt construction, and brand-specific QA. Use `pixelcraft-tokens` when the selected palette/type must become DTCG implementation tokens.

## Mandatory floor summary

The full floor is normative. At minimum:

- truthfulness: no invented facts, proof, assets, metrics, logos, or testimonials;
- accessibility: semantic controls, names/labels, keyboard/focus path, contrast floor, reduced-motion path, text scaling/reflow, no color-only meaning;
- interaction: visible feedback, suitable targets, cancellation/undo/escape, no conflicting gestures, complete states;
- adaptation: restructure across sizes, orientations, input modalities, and platform idioms;
- localization: expansion/contraction, directionality, script/font fallback, input composition, plural/gender/case, locale formatting, culturally appropriate copy/imagery;
- performance: fast acknowledgment, stable layout, asset budgets, nonblocking interaction;
- robustness: zero/one/many/long/missing/error/offline/permission/interruption/concurrency states;
- coherence: semantic tokens and consistent hierarchy, affordances, motion, iconography, and copy;
- distinctiveness: at least one deliberate subject-specific commitment when mode permits;
- verifiability: no claim without an evidence label.

The floor never mandates a hero, card, palette, typeface, border radius, shadow, layout shape, or visual movement.

## Evidence labels

Use exactly these labels in reports and critique:

| Label | Meaning |
|---|---|
| `rendered` | inspected actual rendered output, screenshot, device, simulator, snapshot, or browser surface |
| `static` | inferred from source, schema, configuration, or deterministic static analysis |
| `model-judgment` | heuristic/model evaluation; useful hypothesis, not proof |
| `not-checked` | relevant but not inspected; state why when material |
| `waived` | user/brief explicitly overrides the rule; record scope and consequence |

## Final response contract

End with: what changed; which direction was selected and why; verification performed by evidence label; floor items remaining `not-checked` or `waived`; and concrete open risks. Do not claim visual quality because the app compiled, a page loaded, or code merely exists.
