---
name: pixelcraft
description: Orchestrates distinctive, evidence-verified UI work across any frontend stack. Use when designing, building, redesigning, auditing, or polishing interfaces, pages, screens, components, emails, terminal UI, game UI, or app shells. Detects the stack and surface mode, runs the Pixelcraft loop, routes to named Pixelcraft skills, applies the mandatory cross-platform floor, and produces an evidence-labeled final report.
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
- Read [references/surface-acceptance.md](references/surface-acceptance.md) before choosing platform-specific acceptance evidence.
- Read [references/floor.md](references/floor.md) before implementation and again before reporting; every rule is mandatory unless the user explicitly waives it.
- Read [references/report-template.md](references/report-template.md) before the final response or handoff.

## Frame before designing

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

0. **Plan** — use the `pixelcraft-plan` skill first. In brownfield work, read the repository systematically and write `.pixelcraft/plan.md`; in greenfield work, intake constraints and justify stack selection with a weighted matrix before any visual direction. If `pixelcraft-plan` is not installed, perform a minimal inline fallback before continuing: map repo/framework evidence, make or record the stack decision, create/update `.pixelcraft/plan.md` when writable, and label the reduced plan `not-checked` rather than pretending full planning happened.
1. **Frame** — detect stack/surface/input modality; identify audience, job-to-be-done, real material inventory, constraints, locale scope, and existing design system. Create or update the design brief artifact using `references/design-brief.md`; classify facts as user-provided, repo-observed, artifact-observed, research/analytics, assumption, or unknown. Ask only for information that materially changes the design.
2. **Diverge** — only for undecided visual scope. Use the `pixelcraft-direction` skill to generate 3–5 far-apart directions with probabilities, score them, select one, record why the others lost, and inspect repetition history. Do not rediverge an approved design; handoff preserves that intent. For brand-kit, identity-board, logo-system, moodboard, or visual-identity image generation, use the `pixelcraft-brandkit` skill by name and its 2–3 brand-world divergence flow before image prompting.
3. **Specify** — produce the direction card; use `pixelcraft-tokens` for DTCG tokens, `pixelcraft-handoff` when translating Figma/design-system artifacts into implementation, `pixelcraft-ux` for flows plus the state matrix, `pixelcraft-patterns` when the work matches a named product pattern, and `pixelcraft-dataviz` when the work communicates quantitative data, dashboards, maps, graphs, or visualization-heavy interfaces. Do not start with component trivia before direction and constraints exist.
4. **Build** — use the appropriate platform skill by name when installed (`pixelcraft-web`, `pixelcraft-mobile`, `pixelcraft-data-apps`, `pixelcraft-desktop`, `pixelcraft-tui`, `pixelcraft-email`, `pixelcraft-document`, `pixelcraft-media`, `pixelcraft-chat-ui`, `pixelcraft-constrained`, `pixelcraft-spatial`, `pixelcraft-game-ui`, or `pixelcraft-extensions`). If absent, translate the direction idiomatically yourself without importing web assumptions. Before writing version-sensitive framework, router, styling, or SDK code, check current documentation via the host's available docs tool/MCP (for example, Context7) or package registry when available; otherwise mark unverified API/version assumptions `not-checked`.
5. **Verify** — use `pixelcraft-review` for slop scanning, heuristic critique, accessibility/state review, and evidence-ranked findings; use `pixelcraft-visual-qa` for the render → screenshot → self-critique → fix loop and performance budgets. Inspect rendered output where the environment permits and label every claim honestly.
6. **Report** — decisions, verification evidence, unresolved risks, and waived items using the report contract.

Do not loop forever. One repair round is normal for clear deterministic failures; report remaining uncertainty rather than claiming completion.

## Platform routing

After detecting the stack, use the matching platform skill by name and read only the relevant framework reference inside it:

| Platform skill | Framework references |
|---|---|
| `pixelcraft-web` | `html-css`, `react-next`, `vue-nuxt`, `svelte`, `solid`, `angular`, `astro`, `qwik`, `htmx-alpine`, `lit-web-components`, `tailwind`, `server-rendered`, `leptos-yew`, `kotlin-web`, `elm`, `clojurescript`, `fsharp-fable`, `scala-laminar`, `java-web`, `pwa` |
| `pixelcraft-mobile` | `swiftui`, `uikit`, `jetpack-compose`, `flutter`, `react-native-expo`, `kotlin-multiplatform`, `ionic-capacitor`, `dotnet-maui`, `flet`, `kivy` |
| `pixelcraft-data-apps` | `streamlit`, `gradio`, `reflex`, `nicegui`, `dash`, `panel`, `shiny`, `jupyter-widgets`, `r-shiny`, `julia-genie`, `observable-framework`, `evidence` |
| `pixelcraft-desktop` | `tauri`, `electron`, `qt-pyside-qml`, `winui-wpf`, `appkit`, `gtk`, `avalonia`, `rust-gui`, `javafx-swing`, `cpp-gui`, `go-gui`, `uno-platform` |
| `pixelcraft-tui` | `textual`, `rich`, `ink`, `bubbletea-lipgloss`, `ratatui` |
| `pixelcraft-email` | `html-tables`, `mjml`, `react-email`, `client-quirks` |
| `pixelcraft-document` | `print-css`, `pdf-tools`, `archetypes`, `slides` |
| `pixelcraft-media` | `social-cards`, `og-generation`, `banners-video` |
| `pixelcraft-chat-ui` | `slack-discord`, `mobile-business-platforms`, `conversation-design` |
| `pixelcraft-constrained` | `tv-wearables`, `specialized-hardware`, `voice-ui` |
| `pixelcraft-handoff` | `design-translation` |
| `pixelcraft-spatial` | `platforms`, `comfort-accessibility` |
| `pixelcraft-game-ui` | `unity-ui-toolkit`, `godot`, `unreal-umg`, `hud-principles`, `love2d`, `bevy`, `monogame` |
| `pixelcraft-extensions` | `browser-extensions`, `vscode-webviews`, `raycast`, `figma-office` |

References are named here for routing only. Do not construct relative paths across skill folders; read the file inside the installed platform skill.

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
