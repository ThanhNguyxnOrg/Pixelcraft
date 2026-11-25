# Design translation

Use this reference when implementing an approved or supplied design: Figma frame/component, exported mockup, screenshot, prototype, existing UI rebuild, or design-system artifact. The task is faithful translation into the project's real architecture—not visual direction generation.

## Authority rule

When the user asks to implement an approved design, do **not** run divergence or redesign the visual direction. Preserve layout intent, hierarchy, spacing rhythm, color/type decisions, imagery, and interaction meaning. Divergence applies only to parts the design leaves undecided: missing states, missing breakpoints, unspecified behavior, implementation tokens, accessibility gaps, or places where the source is explicitly marked inspiration rather than specification.

Approved visual intent is preserved, but the accessibility floor, platform/legal requirements, existing component/token constraints, data ownership, security/privacy requirements, and architecture are never overridden silently. Resolve tension through existing components and platform idioms first. If faithful implementation genuinely requires an exception, record the conflict and obtain an explicit user override. Report intentional deviations; never silently “improve” the design.

## 1. Establish the translation contract

Record before coding:

- exact source provenance: file/link/version/frame/component/node or screenshot asset, date, owner, and approval state;
- target platform/framework/runtime and existing route/component ownership;
- breakpoint, orientation, density, theme/mode, locale/text direction, input modality;
- whether each source region is specification, inspiration, or out of scope;
- required states/data fixtures and acceptance tolerance;
- whether visual-qa rendering is available in the environment.

Do not treat an entire page capture as a precise component contract when only one region was approved.

## 1b. Structured design-source intake (Figma MCP, Code Connect, Penpot)

Prefer machine-readable design metadata over eyeballing screenshots whenever tools are available:

| Source / tool | Operational workflow | What it establishes |
|---|---|---|
| **Figma MCP Server** | 1) Call `get_code_connect_map` to locate existing production component bindings; 2) call `get_variable_defs` to fetch bound semantic variables and mode values; 3) call `get_design_context` for Auto Layout hierarchy, constraints, and variants; 4) call `get_screenshot` as the visual verification reference. | Authoritative layout structure, variable tokens, and mapped codebase components (`artifact-observed`) |
| **Figma Code Connect** | Consume component imports/props directly from `*.figma.tsx`/`.ts`/`.swift`/`.kt` bindings; never re-implement a Code-Connected primitive as raw markup. | Verified component API reuse (`static`) |
| **Figma Variables REST API** | Pull collection/mode JSON via `GET /v1/files/:file_key/variables/local` into DTCG / Resolver files (`pixelcraft-tokens`) rather than hand-transcribing hex codes. | Canonical mode/token parity across light, dark, brand, and density |
| **Penpot & Tokens Studio** | Export W3C DTCG JSON / CSS tokens directly from Penpot Design Tokens or Tokens Studio Git sync; inspect flex/grid layout properties rather than absolute x/y coordinates. | Open-format tokens and semantic layout intent |

Treat any auto-generated HTML/CSS snippet emitted by Figma MCP or Dev Mode as a **structural reference**, never final production code—refactor into the repository's real components, semantic tokens, routing, and accessibility primitives.

## 2. Inventory implementation before generation

Reuse is the default. Build a mapping table before writing UI:

| Design element | Existing equivalent | Translation decision |
|---|---|---|
| exact semantic component | production component exists | reuse; map props/variants/slots |
| near match | existing component missing state/variant | extend the existing API without breaking consumers |
| repeated structure | no component but recurrence is real | propose a primitive consistent with project taxonomy |
| one-off visual artifact | no reusable meaning | implement locally and contain the exception |
| raster/text/effect | platform support uncertain | choose semantic text/SVG/canvas/image deliberately |

Use layer metadata, Auto Layout/constraints, design variables, component variants, and screenshots as evidence. Generated code from a design tool is a hint, not architecture. Never flatten a screen into absolute positioning, rasterize text, duplicate an existing component, or copy placeholder content.

## 3. Map design variables to project tokens

Translate variables/styles through the `pixelcraft-tokens` skill rather than copying leaf values:

1. exact semantic token exists → use it;
2. primitive exists but semantic intent differs → choose or add the correct semantic role;
3. alias/mode exists → preserve alias and mode behavior instead of flattening values;
4. duplicate/near duplicate caused by design drift → flag and reconcile;
5. optical exception is repeatable → document/encode intentionally;
6. genuinely new scale step → extend the scale with provenance.

Capture collections/modes such as light/dark/brand/density/locale as explicit theme axes. Validate contrast and component states in every required mode. Do not create hundreds of one-off tokens for noise.

## 4. Translate to the actual stack

Preserve the target platform's architecture and idioms:

| Stack / Surface | Translation posture |
|---|---|
| React / Next.js / TanStack Start / React Router v7 / Solid / Qwik | compose existing components/hooks/loaders; preserve state ownership, server/client boundaries, routing, accessibility semantics, and CSS architecture |
| Vue / Nuxt | map props/slots/composables and template structure; preserve reactivity ownership rather than copying DOM literalism |
| Svelte / Angular / Astro / htmx / Lit / server-rendered web | use framework-native component contracts, islands/partial hydration, server-driven HTML forms/swaps, Shadow DOM encapsulation, and CSS scoping |
| Flutter | translate layout intent into widget composition/constraints, `ThemeData`/tokens, `MediaQuery`/size classes, semantic widgets, and immutable state flow |
| SwiftUI / UIKit | use view composition/modifiers or existing view controllers, Dynamic Type, safe areas, trait/size classes, environment/theme propagation |
| Jetpack Compose / Multiplatform | use composables/slots/Modifier chains, Material or project theme tokens, density/insets, state hoisting, semantics |
| React Native / Expo / LynxJS | preserve native navigation/gesture expectations, StyleSheet/CSS tokens, safe areas, native accessibility attributes, and platform splitting only when justified |
| Desktop (Tauri, Electron, Qt, WinUI/WPF, Avalonia, Rust GPUI/Slint) | map layout into native windowing, menus, keyboard shortcuts, system theme/DPI scaling, and platform accessibility APIs (UI Automation / NSAccessibility / AccessKit) |
| Data apps (marimo, Streamlit, Gradio, Reflex, NiceGUI, Dash, Shiny, Observable) | map visual hierarchy onto framework-native layout containers, reactive state cells, and accessible chart/table outputs without fighting framework rerun lifecycles |
| Extensions (browser MV3, VS Code webviews, Raycast, Figma/Office) | isolate content-script styles inside Shadow DOM, bind host theme variables (`--vscode-*`), respect CSP, and fit compact popup/sidebar budgets |
| Spatial / XR (visionOS, Android XR, Horizon OS, WebXR, Unity XRI) | translate 2D frames into comfortable viewing depth, angular target sizes, gaze/hand/controller affordances, and passthrough-safe contrast surfaces |
| Media (Satori, Takumi, Remotion, Motion Canvas, FFmpeg) | respect explicit renderer subset limits (Flexbox-only Satori, deterministic frame math, bundled fonts, platform safe zones) |
| TUI / email / document / game / constrained | translate visual meaning into the medium's constraints; never pretend DOM/CSS capabilities exist |

Responsive behavior must be inferred from constraints and breakpoint evidence, not guessed from one desktop capture. If missing, implement the smallest defensible adaptation and label it an assumption.

## 5. Resolve missing states before delivery

The design is incomplete until these are resolved or explicitly assigned as assumptions:

- hover/focus/active/disabled/selected/pressed/visited;
- loading/skeleton/optimistic/error/empty/offline/permission;
- zero/one/many/long/overflowing data and missing media/fonts;
- validation, destructive confirmation, undo/cancel/escape;
- narrow/wide/resize/orientation/split-screen behavior;
- keyboard/screen reader/touch/controller/pointer input;
- localization expansion, bidi text, numerals, plural/date/currency boundaries;
- dark/light/high-contrast/reduced-motion/forced-colors modes.

Preserve architecture: state ownership, data loading, caching, mutation, routing, focus management, error recovery, and security/privacy constraints take precedence over screenshot literalism.

## 6. Accessibility and content fidelity

Visual fidelity never excuses broken semantics. Preserve accessible names, roles, labels, keyboard order, focus visibility, contrast, target size, text scaling/reflow, reduced motion, screen-reader announcements, input types/autocomplete, and platform-specific accessibility idioms. Copy must come from approved content or existing product truth; design placeholder text is not production copy unless the owner explicitly says so.

## 7. Fidelity loop with `pixelcraft-visual-qa`

Declare tolerance before comparing. Use the `pixelcraft-visual-qa` skill for the render → screenshot → crop/overlay/diff → repair loop:

1. capture/reference the approved design at the same breakpoint, scale, mode, locale, and data state;
2. render implementation with real fonts/assets/state;
3. align viewport/device scale and capture region exactly;
4. compare full frame plus meaningful crops;
5. inspect overlay/difference heatmap and structural evidence—never rely on one global pixel score;
6. classify divergence as layout geometry, typography/rasterization, color/theme, asset rendering, dynamic content, state mismatch, accessibility regression, or intentional deviation;
7. repair semantic/accessibility defects before pixel geometry;
8. rerun only changed comparisons.

Antialiasing, font shaping, platform rendering, and dynamic content make exact byte equality inappropriate. Use the region-aware tolerance schema, hard-failure rules, normalization requirements, and deterministic fixture contract in `references/fidelity-tolerance.md`. Record tolerances before inspecting the diff.

## 8. Commercial release, license manifest & ownership transfer

Studio-grade handoff means another engineer or client owner can build, verify, legally distribute, and operate the product without depending on the author's local machine or personal accounts:

| Handoff gate | Mandatory deliverable | Verification / failure boundary |
|---|---|---|
| **Reproducible `< 10m` clean-clone setup** | Committed lockfile/toolchain pins, `.env.example` (or native config template), and documented single-path bootstrap + verification commands | Clean checkout boots and passes strict active-language static checks (`rustc`/`clippy`, Swift strict concurrency, Kotlin/Dart analyzer, `mypy`/`pyright`, C# nullable, or `tsc --strict`) in `< 10 minutes` |
| **Stack-native component / screen catalog** | Isolated state previews where the target stack supports them (SwiftUI `#Preview`, Compose `@Preview`, Flutter Widgetbook, Qt/QML preview fixtures, TUI state snapshots, or Storybook/Ladle) | Exercises default, `loading`, `empty`, `error`, dark-mode, and `+50–100%` localized short-label states without live production backends |
| **Commercial license manifest** | Inventory of all shipped fonts (web/desktop/app embedding rights), icon packs, photography/illustrations, 3D models, shaders, audio clips, and copyleft/commercial packages | Every asset lists license type, redistribution scope, and seat/traffic bounds (`static`); trial/personal-only assets flagged `P0` blocker until replaced or procured |
| **Owner-level account & key transfer** | Root admin & billing ownership rests with the client/product owner for DNS/domains, Apple Developer / Google Play / Chrome Web Store / Steamworks accounts, OAuth apps, analytics/error `DSN`s, CMS, and signing certificates | Zero personal/agency root accounts left in production critical paths; zero hardcoded secrets or private keys in client source, bundles, or git history |
| **Post-launch warranty & regression baseline** | Frozen visual/behavioral QA baselines, documented waiver register, and clear defect-triage boundary distinguishing baseline regressions from new feature scope | Baselines reproducible via `pixelcraft-visual-qa` and native test suites |

## Acceptance report

Report: source/version/frame/mode/breakpoint; classification of specification versus inspiration; reused versus new components; token substitutions/exceptions; missing-state assumptions; rendered comparison evidence and tolerance; `< 10m` setup & isolated preview coverage; commercial license manifest & owner-account transfer status; post-launch regression baseline; intentional deviations; and remaining `not-checked` surfaces.
