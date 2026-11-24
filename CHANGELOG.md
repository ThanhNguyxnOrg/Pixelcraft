# Changelog

All notable changes to Pixelcraft are documented in this file.

## [Unreleased]

### Added

- **Socratic discovery & creative brainstorming gates:** Added `skills/pixelcraft-plan/references/grill-me-protocol.md` (Codebase-First Inspection Gate + single-question-per-turn decision tree with `(Recommended)` options) and `skills/pixelcraft-direction/references/creative-brainstorming.md` (3-Tier Ambition Pitch, 4 ideation operators, ASCII wireframe + real-copy draft, and a Pre-Code Design Approval `<HARD-GATE>`).
- **Anti-laziness Iron Laws & Stack Craft Gate:** Added explicit Rationalization Tables, Zero-Stub / Zero-Placeholder floor rules, Pre-submit Checklists across core and surface skills, and a mandatory Stack Craft Gate blocking low-craft defaults (`Tkinter`, raw unstyled HTML, hand-rolled datepickers/editors/comboboxes) when production alternatives exist.
- **2026 multi-stack ecosystem parity:**
  - Added `skills/pixelcraft-web/references/interaction-and-search-primitives.md` (`cmdk`, `kbar`, `vaul`, `sonner`, Embla Carousel, `react-day-picker`, `react-resizable-panels`, Pagefind, Orama, Fuse.js, Algolia InstantSearch, Meilisearch/Typesense, Lucide/Phosphor/Tabler/Iconify, Fontsource, Unpic + ThumbHash/BlurHash) and updated web component, 3D/scene, rich-text/code editor, and server-rendered references.
  - Added `skills/pixelcraft-mobile/references/harmonyos-and-emerging-mobile.md` (HarmonyOS ArkUI/ArkTS, Elixir LiveView Native, Taro/uni-app) and added The Composable Architecture (TCA) to SwiftUI guidance.
  - Expanded desktop (`PyQt6`, `JUCE`, `GTKmm`, `Nuklear`, `Ultralight`, `libcosmic`, `Vizia`), game UI (`Godot C#`, `Ebitengine`, `Macroquad`, `Flame`, `Pygame`, `Arcade`), dataviz (`Apache ECharts`, `Observable Plot`, `Vega-Lite`, `Grafana`, `Apache Superset`, `Leaflet`, `Mapbox`), and reactive data apps (`Polars`, `Narwhals`).
- **Four cross-platform zero-dependency QA CLIs:** Added `check-contrast.mjs` (WCAG 2.2 AA/AAA + APCA Lc), `check-email.mjs` (Gmail 102 KB clip, MSO/dark-mode/image-alt checks), `check-tui.mjs` (ANSI / `NO_COLOR` / box-width checks), and `check-pdf.mjs` (PDF/UA tags, bookmarks, fonts, `/Lang`, `/Title` checks) under `skills/pixelcraft-visual-qa/scripts/`, with automated tests in `scripts/test-cross-platform-qa.mjs`.
- **Six new non-JS DTCG token export targets (19 total):** Added `go-lipgloss`, `godot`, `unity-uss`, `slint`, `gtk4`, and `typst` plus DTCG `$root` and `$deprecated` handling in `skills/pixelcraft-tokens/scripts/export-tokens.mjs`.
- **Developer CLI subcommands:** Added `doctor`, `remove`, `init-router`, and `check` subcommands to `bin/pixelcraft.mjs` alongside `add` and `list`.
- **Offline eval runner & 18 non-JS/Grill-Me JSON fixtures (66 total):** Added `scripts/run-evals.mjs` (`npm run eval:offline`) and expanded `evals/fixtures/` from 48 to 66 fixtures covering Rust, Swift, Kotlin, Go, Python, C#, Typst, and Grill-Me/Brainstorming gates.
- **6-exhibit multi-stack showcase gallery:** Rebuilt `website/` into 7 instant-render sections and expanded the proof gallery from 3 web exhibits to 6 exhibits (`coffee`, `clinic`, `grid`, `tui` Ratatui, `mobile` SwiftUI AX3, `document` Typst + MJML) with interactive issue pins, Python Pillow WebP capture fallback, and dogfooded `slop-scan` verification.
- **Open-source community health files:** Added `SECURITY.md`, `CODE_OF_CONDUCT.md`, `docs/INSTALL.md`, `.github/ISSUE_TEMPLATE/{bug_report,stack_request}.yml`, and `.github/PULL_REQUEST_TEMPLATE.md`.

### Changed

- **Multi-language `slop-scan.mjs` hardening:** Expanded file extension coverage across 20+ non-JS languages, added `#`/`--`/`;` comment masking, fixed `hardcoded-color-literals` false positives, added `--fail-on <p0|p1|p2|any>`, and introduced rules for `todo-stub-in-ui`, `empty-event-handler`, `lazy-diy-antipattern`, 2025–2026 `generic-copy`, Motion/GSAP/SwiftUI/Compose/Flutter `missing-reduced-motion`, `compose-dp-font-size`, `flutter-text-scaling-locked`, and `egui-unconditional-repaint`.
- **Hardened `finish-gate.mjs` & `validate-skills.mjs`:** Added surface-typed profiles, duplicate breakpoint artifact rejection, and lazy `n/a` excuse rejection in `finish-gate.mjs`; added duplicate heading detection and Platform routing table vs `skills/*/references/*.md` sync verification in `validate-skills.mjs`.
- **Unified Copilot `applyTo` globs:** Synchronized non-JS/TS file extensions across `bin/pixelcraft.mjs`, `install.sh`, `install.ps1`, and `scripts/build-adapters.mjs`.
- **Lean showcase website:** Removed 11.5 MB of unused MP4/WebM media, uninstalled `motion` and `gsap`, removed autonomous hero/promo animation loops, switched to Latin-only font subsets, and enforced WCAG 3:1 interactive border contrast.
- **Documentation & metadata overhaul:** Streamlined root `README.md` with banner, badges, 5-layer skill grouping, and collapsible 21-language routing table; moved full 20-host installation details to `docs/INSTALL.md`; fixed French Windsurf doc link and stale roadmap/eval/website documentation.
- Route ordinary browser 3D through `pixelcraft-web`; reserve `pixelcraft-spatial` for embodied XR/VR/AR workflows.
- Keep planning mandatory and discovery adaptive: complete briefs and scoped fixes take the direct path; ambiguous ideas trigger the single-question Grill-Me protocol.

## [0.1.0] - 2026-11-24

### Features

- support more harnesses and per-skill uploads ([6d4b4b0](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/6d4b4b011285dc393bb4b3d30594385f437be13b))
- enroll Pixelcraft in managed publishing ([37bda92](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/37bda92339415bc020556dfcf2590b2cc16fa807))

### Bug Fixes and Performance

- separate skill ZIP and adapter outputs ([ddd061b](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/ddd061ba73938dfd6c9f0be2c18819ce41455a53))
- resolve Claude GitHub plugins with a native manifest ([fcd120d](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/fcd120d67e0e458e8920952ebd6c6129f36c22c8))
- harden token exporter hex parsing, remove dead color-utils, add npm test, and sync docs/routing ([774188c](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/774188c1c6139a3347c18818561caf9793f6dd5b))
- populate plugin.json metadata/icon and use self-root ./ source for Claude Desktop validation ([0f21562](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/0f21562fbeeaf9c3db1c68a38b3f31df048558a5))
- Remove the directory-only `icon` field from the Claude plugin manifest for Cowork sync ([#20](https://github.com/ThanhNguyxnOrg/Pixelcraft/pull/20)).

### Other changes

- Mirror the Claude skills catalog and use matching tags for npm releases ([89a3c31](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/89a3c31ada009b66834fd81130ea7a9b58af871e))
- Rename the npm package from `pixelcraft` to `@thanhnguyxn/pixelcraft`; the CLI command remains `pixelcraft` ([#22](https://github.com/ThanhNguyxnOrg/Pixelcraft/pull/22)).
- fix(release): build reproducible release archives ([fb28d1a](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/fb28d1a32c49be98ea7a9b58af871e))
- Update marketplace.json ([e3b8a6c](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/e3b8a6cc500137c99a89bbdfc860cec08d16811b))
