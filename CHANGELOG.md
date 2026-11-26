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

## [0.2.0] - 2026-11-26

### Features

- add Pixelcraft Next.js showcase and promotional film ([044c230](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/044c23062325d3d51b53491d85f5f64a97a23871))
- re-art-direct Pixelcraft as a living creative studio ([2871e5a](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/2871e5afe3290b3f0e8741de7cfc884ed92c9bff))
- choreograph a kinetic Pixelcraft campaign film ([69fc829](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/69fc8291dc51ed0955da4b1fa7d9534922e7411a))
- add creative engineering skill set ([89166a2](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/89166a241261d87299cfbbe1becd88f10a4c3128))
- add creative engineering skill set ([179b8b5](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/179b8b5de02573248c284b583ee4e674e7af70d0))
- add optional product discovery interview ([3e426da](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/3e426dad5cbd5663594199f4bd997dab410cf7a4))
- refine owner-supplied showcase with GSAP and compact gallery ([4c956ec](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/4c956ec807eb24fed8aaee881b03d721e1450a2b))
- add modern native CSS, command-workspace, agentic UI, and mobile tactile patterns ([8233513](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/823351316a342a468a9e949bb8315bfb34b01fe3))
- add APCA contrast, spring/glass fallbacks, INP/LoAF/yield, and HCI trust calibration ([355905a](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/355905a33e0c433d0ac31bca6a612c286795bc7d))
- add P0.1 component systems and UI libraries architecture guide ([0e04fa2](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/0e04fa2d498ca51fd5a81eb19558d423e7991c36))
- add P0.2 state management and frontend data architecture guide ([8acaa7d](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/8acaa7d3e47beb9fa4d6570190ef10ab83d1eed6))
- add P0.3 form frameworks and Standard Schema validation guide ([1ab686e](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/1ab686e1ae765f2667a54b3c3f45ab5c7f14664c))
- add P0.4 styling and CSS ecosystem reference and eval ([8e30c33](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/8e30c33905f48a21cd9fd4787abd6c40cf1957e0))
- replace the long film with local GSAP promo studies ([45e287b](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/45e287bb8a1cf8d09d35191e6d9f2948eeb0b834))
- complete P0.5-P0.8 build, testing, editors, canvas, and i18n references ([04cdda6](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/04cdda671d2fafa99c65637099411b82906bfaa3))
- enrich P0 references with W3C, Unicode, HCI, and Vite 8/Playwright specs ([83f5b99](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/83f5b990d1131c0b77d625e40e1186ef96c89f5b))
- add P1 specialized UI ecosystems (P1.1-P1.6) ([2aeac44](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/2aeac448130029424d5cd5e68063e192fd5a4f22))
- add P2 token tooling, reactive data apps, TUI, Maizzle, PDF.js, and PptxGenJS ([abccc68](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/abccc683d917aa7667e6efbfb48ebdde704a991d))
- 2026 core framework refresh plus LynxJS, GPUI, Passkeys/Checkout, and File Upload UI ([e247d04](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/e247d047bd94073b60481fdbb7d9b1f44210ed7b))
- auto-sync repo stats, skills, and stacks; remove header pause button ([11ed69f](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/11ed69ffac24f452a3b9a856695caf44fc518508))
- fix snippet bugs, move browser 3D/media players to web, and expand 2026 ecosystems ([b07e748](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/b07e7485e8b15508354dc39f6e5a608865598872))
- upgrade mobile, desktop, tui, constrained, document, email, media, spatial, and game-ui ([d8b04e2](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/d8b04e263350841fda3a324eb078721333e93944))
- upgrade data-apps, dataviz, patterns, chat-ui, and extensions ([4f438c5](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/4f438c53b953b33aaf78b076a3849723e7102418))
- sync orchestrator routing, upgrade core design/quality skills, and refresh docs ([4f2bc43](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/4f2bc43ed662d3aad1cbb94b186cbbc0fb04e869))
- enforce strict skill contracts, add 26/26 eval fixtures, and sync showcase metadata ([3fc49ce](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/3fc49ced1605ed199d213308b5a2ae6c51be32e1))
- add Grill-Me protocol, creative brainstorming design gate, anti-laziness iron laws, and stack craft gate ([e9d16b3](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/e9d16b32e36580c4903b34349d23c5e1b6a02ff8))
- add missing high-craft web/mobile/desktop/game/dataviz ecosystems and surface checklists ([16dfe4d](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/16dfe4dc23201c0c825fe43b1fc67d7fc83c8cc0))
- upgrade multi-lang slop-scan, 19-target export-tokens, cross-platform QA CLIs, developer CLI, and 66-fixture eval harness ([7d7d8de](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/7d7d8de4ff462519c6c1ecfbe17bba255bcfb2a5))
- rebuild 7-section showcase and 6-exhibit multi-stack proof gallery with interactive pins ([f0ea80d](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/f0ea80d61751fed91ea1f9c8a89dc924fb1e6907))
- add zero-dep sync-docs drift checker and auto-synchronizer for docs and manifests ([5283192](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/5283192763b0c38984dc53e4155c67d159bda982))
- derive all live token formats, scan rules, eval counts, and HTML metadata from repo-meta ([a52c10e](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/a52c10e111719e575d435c844060084d72fa934f))
- add 16 multi-stack gallery pairs across 5 ecosystems (22 total) ([f8578cc](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/f8578cc602bd56c05d9d551b5303c4b0a27f302e))
- add ecosystem filters, live stage, prompt+code workbench, and 22-card contact sheet ([c5eb057](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/c5eb057cc7dc3f6202d1fd556a523b4ef920ac85))
- add native Cursor, Antigravity, Codex, Copilot, Devin, and Gemini CLI manifests with strict schema & version sync checks ([ff84580](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/ff84580eaf0b7954adbffde9c8af51ca3a8789c5))
- make all 22 gallery exhibits responsive down to 320px mobile viewports ([b6dd3b7](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/b6dd3b7a461834ab7cb6d3b0d87d3702611f0a00))
- restore animated PixelLogo + GSAP/Motion showcase with 22-exhibit responsive gallery and mobile dock ([1862be8](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/1862be8e7d059997f834f5fb1e5e8c2379e348d3))
- add engineering blueprint, Cmd+K palette, technical SEO/CSP, and upgrade all 22 exhibits to full interactive studios ([fe96c65](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/fe96c65b240ae6b1edc13669a117af21a8ea396c))
- codify Invisible Craft (B1-B6), IME/NFC safety, EAA, and studio handoff gates ([dcfe425](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/dcfe42596b215f92742023947762d192abaf1b05))
- add 2026 studio, store, signing, and protocol gates for Web, Mobile, Desktop, and TUI ([e876fe1](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/e876fe16530b48232f6d8a4daf2bf31f3381ceb1))
- add 2026 prepress, bulk-sender, security, console TRC, and XR gates across 11 skills ([9002c19](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/9002c199d21488c879d64cff36ff56f00e91fc58))
- upgrade check-tui, check-pdf, check-email, and slop-scan with 2026 checks and eval fixtures ([4db5c57](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/4db5c5737215ff298bbd22e55926e5e209a337da))
- enforce Completion & Scan-Until-Clean HARD-GATE in plan, orchestrator, and review ([c36ddf6](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/c36ddf6c647f642891c93b75f0e760114b1356c9))
- add check-acceptance.mjs 14-platform checklist CLI, Rule #0.3 gate, and email checks ([17ae689](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/17ae689de2fb01239f4d39bf39f3e0048f8b08f3))
- enforce check-acceptance Stop-Gate, Rule #0.3, and 15-section Studio acceptance parity ([01b32a8](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/01b32a897932046db86d5de86501d23a717d3900))

### Bug Fixes and Performance

- close media streams when visitors cancel downloads ([367bcaf](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/367bcafc00163a223317296cd360676fa7dd0b4b))
- respect gzip quality and explicit encoding opt-outs ([c4a9352](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/c4a93522db3a6e0c7a9f7759a7c9a7350d561e41))
- ignore byte ranges on HEAD media probes ([ee5500f](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/ee5500f25f918d7b66f7bd9cbf3b0af90ec4d33d))
- preserve comparison mode with surface-specific baselines ([ac417cf](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/ac417cffc9f016556033bc2f66ae914e3c456eb6))
- constrain skill URLs and sanitize rendered Markdown ([8e44998](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/8e44998e46fbfc5d7f029e2788fadf3e97ef22ab))
- select enhanced mode explicitly for film captures ([acd53d0](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/acd53d03de1031c3009f6cb8f4e1208b0613c2de))
- use the security-patched Markdown sanitizer ([8530ca4](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/8530ca48dc4457dbaee4df2593acc33962a1f555))
- preserve read-only task-list states in skill documentation ([c746f67](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/c746f6766ecb4232ab4aefc2b98a253ce32c05ba))
- wrap supported surfaces before tablet labels clip ([1ae7171](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/1ae717150f7219efa7c9e72b20f23f39cdeafa2a))
- contain proof artwork and hydrate motion preference safely ([5b88505](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/5b885059171c64d4d4b81b00f2b74adb48bd3b01))
- paint forced-color selection behind surface labels ([700e440](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/700e440fc2ddfd950f03277b521fb99088f221e0))
- preserve system colors without forced text backplates ([dbc1004](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/dbc1004d5ed9c9ccc5809a7774117b900c804863))
- render discovery reference markdown correctly ([5c85282](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/5c85282b1002df4a1c1db4e99f2604e1c78e3824))
- remove gallery names, fix WCAG/Web Audio issues, and add concrete creative code patterns ([50e5385](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/50e5385e9318ad58c8ef05ff2c2f9ec7e511d42d))
- keep reveal contexts acyclic and contain narrow gallery controls ([50a424b](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/50a424b87b9f3232dd33347976095bff2daa8ab5))
- route browser 3D to the existing scene reference ([2782889](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/278288992e2e374d0045ba2c6764a1314faaee8f))
- disclose installer force overwrites ([2c7d775](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/2c7d775e97996c6cc955fa2b500fb57c2ccbfbf4))
- build copyable commands only from valid selections ([304c03c](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/304c03cde20560d4e52fcfcd23e843a6c929a5ca))
- separate film controls from page motion state ([1774368](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/1774368737975fa43aa7403b391e34d7f4f8309f))
- match displayed reference filenames in skill search ([1ee0ef8](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/1ee0ef8524f3ad93da0c3ef0ded790dddab6be29))
- keep gallery scan findings readable outside the image ([70de401](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/70de401f116660c34a4c71774feebac0f9b2e184))
- preserve auto-added core protection for subset commands ([65744b0](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/65744b0dc06017d6cfcd82cf57f48b3ec4c8b0cc))
- complete cross-platform build dependency lock for clean npm ci ([5cbc93a](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/5cbc93a9472b0b61b3f5b9eee157025e4ea7a12a))
- link creative-web-composition and creative-runtime references from owner SKILL.md ([58777bf](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/58777bfb30c4183835388dec9237171f134326d3))
- smooth film playback and refine pixel choreography ([4000c77](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/4000c7718566ab6731c2c260358303fcf1119528))
- replace stale specialist skill names in creative-runtime.md with real 26-skill owners ([2db3cbc](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/2db3cbc1b144ae18aad3b8984c80907aa031c204))
- preserve gallery contrast in forced colors ([53c5dea](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/53c5dea9649592c34cbc3b03bce714501409bd07))
- sync showcase and film with scoped npm package ([8420afe](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/8420afeb88b1c5b5ed24c19a93e27a87bb1db388))
- use an opaque mobile navigation surface ([0b200bb](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/0b200bbaa3bed6da36d6996e8fa84c6da7aae15d))
- bound promo aspect-ratio frames to narrow viewports ([7ae71f3](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/7ae71f30795604fea458dce4d8e140ae852eb368))
- describe the promo direction choice outside decorative art ([5103459](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/5103459d29713ef7a3cc26803fe654e00c8a5d62))
- warm clipped promo images before awaiting their readiness ([fc67cb7](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/fc67cb783669a937bb988362aa40857869743278))
- defer trigger measurements until native anchor scrolling settles ([9a190fb](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/9a190fb325a637b42059edc6ce82266f1bf56cf0))
- give narrow command panels room above the copy action ([e7270cb](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/e7270cb0906f7a928cba5cb32ae855d972d5ee9d))
- remove anti-React over-correction bias in stack selection and update 2026 shortlists ([5d35c29](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/5d35c294539e69dde9fa854e00339df728a2a3af))
- show the global npm install instead of npx ([d854840](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/d8548408b4929a432cd867f808ed27ce5cbf5f5a))
- harden slop-scan, export-tokens, visual-qa, adapters, and installers ([1de45c2](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/1de45c23aac3199242effc3a4115a52bd94d488f))
- sync platform routing table and remove duplicate Domain routing heading in pixelcraft/SKILL.md ([12d8692](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/12d8692067b4df805f450a6b697212db71fc3b07))
- replace HTML-stripping regex and chained unescaping in check-email.mjs for CodeQL ([a5db591](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/a5db591090a455a2b9604dbea449fe9ac9c21298))
- split async gallery chunks, cut wire payload 64%, fix 22/22 WCAG touch targets, add EN/VI i18n, 404.html, and legal disclosure ([9a7a33c](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/9a7a33c267249dd4dfe4ca132e287b13c184fbd3))
- restore exact 3fc49ce 100% English main showcase with 22 responsive exhibits ([71e5553](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/71e55533b6564becf54c09dce7811fad27da136d))
- fix Authority rank-3 contrast, WCAG 2.5.8 targets, WCAG 2.2.2 motion pause, deep-path 404, and async gallery chunk ([ade0d9f](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/ade0d9f360f27c34ee7c08745f5df8245669fbd3))

### Other changes

- chore: patch the Remotion development toolchain ([154d96a](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/154d96a6e530a4885b3489f977258d622abd8816))
- refactor(skills): fold creative engineering into existing skills ([8a9859a](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/8a9859a5fce5e1c770498e555dd3516109fb890c))
- test(evals): cover creative frontend engineering in existing skills ([8a2f601](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/8a2f60190eb182ed0d0f0c1437d52ce68e1723f7))
- chore: remove redundant skill label replacement ([e1c3c12](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/e1c3c129d975333b31cf86678384366ad1cf3d2c))
- docs(skills): verify Base UI, Ark UI, React Aria, and Floating UI autoUpdate lifecycle against official docs ([91790e6](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/91790e6139bd23052c19a66e8a9b5433de190b6c))
- ci(website): deploy the showcase to GitHub Pages ([1ff8d12](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/1ff8d126d12e869cb41d19228ba272f2d4b2f587))
- docs: overhaul README, split INSTALL guide, fix CHANGELOG/sync drift, and add OSS community files ([39837ea](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/39837ea80c5de8bbb3dd5ebe610ec7cbd81dc863))
- docs(install): update live npm CLI install status and native multi-platform plugin commands ([dfadaa3](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/dfadaa3a178aa17b70e4ac810e24b54fc808ed4e))
- ci(validate): enforce doc sync, cross-platform QA, evals, and repo-meta version check ([6e54939](https://github.com/ThanhNguyxnOrg/Pixelcraft/commit/6e54939a33d0878a309939bd0dbd47cae4bdee77))

