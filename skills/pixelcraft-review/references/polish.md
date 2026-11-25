# Comprehensive Studio-Grade Polish & Delivery Gate

Polish refines and hardens an accepted direction into a release-ready product; do not use it to restart visual exploration or silently override an approved design. Every finding from this gate requires severity (`P0`–`P3`), observable location (`file:line` or capture crop), concrete fix, and an honest evidence label (`rendered`, `static`, `model-judgment`, `not-checked`, or `waived`).

---

## 1. Art Direction & 5-Second Hierarchy

| Check | Pass bar | Typical defect & severity |
|---|---|---|
| **5-second hierarchy & 1–2 primary CTAs** | Within 5 seconds (and under a squint/blur test), a first-time user identifies what the surface is, why it matters, and the **1–2 primary CTAs** without competing equal-weight buttons | `P1`/`P2`: 4+ equal-prominence CTAs, buried primary action, or hierarchy dependent on color alone |
| **Bespoke subject commitment (no SaaS clone)** | Removing brand names and copy still leaves a domain-specific layout, material, index, or signature moment—never an untouched starter template, bento cliché, or purple-glow AI clone | `P2`: interchangeable boilerplate chrome across unrelated domains |
| **Intentional type palette (`≤ 2` families + `1` mono)** | At most **2 active font families + 1 monospace** (`display` + `body/UI` + optional `code/data` mono) unless explicitly justified by the brief; unused weights/styles purged | `P2`/`P3`: 4+ competing font families or synthetic bold/oblique |
| **Prose reading measure (`45–75ch`)** | Continuous Latin prose columns stay within **`45–75ch`** (`60–70ch` target; equivalent CJK/RTL density) rather than stretching edge-to-edge across wide desktop viewports | `P2`: `110ch+` wall-to-wall paragraphs harming comprehension |
| **Unified icon & media language** | One consistent icon stroke weight, cap/join style, corner radius, and optical scale (`1cap`); real or purpose-built domain media—zero cheesy stock photos, `lorem ipsum`, or invented testimonials/KPIs | `P0` for fake proof/`lorem ipsum` in production UI; `P2`/`P3` for mixed icon sets |

---

## 2. Studio Invisible Craft (`B1–B6`)

Verify the micro-physical details that separate studio software from fragile prototypes (see `pixelcraft-craft` references for full platform idioms):

| Law | Concrete inspection check | Pass evidence | Severity if broken |
|---|---|---|---|
| **`B1` Frequency-calibrated motion & warm tooltips** | High-frequency actions (`50–100+×/day`: command palettes, menus, tab/row switches) finish in **`0–100ms`** (`0ms` on key-repeat); drawers/modals **`150–220ms`**; expressive onboarding/first-reveal **`300–500ms`** (non-blocking). Once one tooltip opens, sibling tooltips open with **`0ms` delay and `0ms` fade**. | Interaction trace / stylesheet / spring config inspection | `P2` (sluggish daily flow) / `P3` |
| **`B2` Optical alignment & concentric radii** | Asymmetric glyphs (play triangles `▶`, chevrons, arrows, send icons) offset **`+1–2` units (`px`/`pt`/`dp`) toward visual mass** inside circular/square bounds. Nested rounded containers obey **`R_outer = R_inner + padding`** (clamped to `0` when `padding >= R_outer`). Single-line buttons/pills balance top vs bottom text-box padding optically (`text-box-trim` / `FirstBaseline` / `-1..2` unit bottom compensation). | High-zoom rendered crop + computed radius/padding check | `P3` (or `P2` when visibly pinched/crooked on primary chrome) |
| **`B3` Origin-aware scaling & asymmetric open/close** | Popovers, menus, and contextual sheets scale subtly (**`0.95 → 1.0`**, never `0 → 1` ballooning from screen center) anchored to trigger origin (`transform-origin`, `PopoverAttachmentAnchor`, `TransformOrigin`). Exit runs **faster than enter (`~100–130ms` close vs `~160–200ms` open)**. Gesture springs preserve velocity without rubbery bounce (`ζ ≥ 0.85`). | Video/frame capture or transition definition | `P2` / `P3` |
| **`B4` Dark-surface luminance & `1px` specular edges** | Dark mode never inverts light colors mechanically or drops `#000000` shadows onto dark cards. Higher z-layers step up **`+5% to +8%` OKLCH lightness** (`#000000` reserved for OLED wearable/battery or explicit high-contrast modes), separate stacked surfaces with a **`1px` subtle top/inner specular highlight** (`rgba(255,255,255,0.07–0.12)`), desaturate/lift semantic accents to prevent halation (`WCAG AA` + `APCA |Lc|`), and pair translucent blur with **`160–180%` saturation / OS vibrancy** plus a solid opaque fallback under Reduced Transparency. | Dark-mode + reduced-transparency rendered captures & contrast check | `P1` (contrast/halation failure) / `P2` (muddy flat layers) |
| **`B5` Hit-slop, Safe Triangle & pointer capture** | Compact `24–28` unit icon controls expand invisible hit-slop by **`+6–10` units per side** (`::before` inset, `.padding().contentShape()`, `TouchDelegate` / `minimumInteractiveComponentSize`, `HitTestBehavior`). Hover submenus/megamenus implement a **Safe Triangle diagonal cursor corridor** (or `120–180ms` directional grace timer) with keyboard parity. Drag sliders, scrubbers, and splitters lock **pointer capture** (`setPointerCapture`, gesture capture, `grabMouse`) until release + `Escape` cancel + `Shift`/arrow fine-stepping. | Pointer/touch hit-box & diagonal menu traversal test | `P1` (target floor `<24px` or collapsing menu blocking task) / `P2` |
| **`B6` Tabular numerals & true minus (`U+2212`)** | Every live counter, timer, price, KPI delta, progress %, scrubber, and table numeric column locks **tabular figures** (CSS `tabular-nums`, SwiftUI `.monospacedDigit()`, Compose `fontFeatureSettings = "tnum"`, Flutter `FontFeature.tabularFigures()`, Qt/Desktop OpenType `tnum`) and uses true minus **`−` (`U+2212`)** rather than ASCII `-` (`U+002D`) for negative display values. | Rendered column alignment & live-tick jitter check | `P2` (jittering timer/misaligned financial table) / `P3` |

---

## 3. Non-Happy-Path, Accessibility & Input Completeness

| Surface boundary | Required studio-grade behavior | Severity if missing |
|---|---|---|
| **`loading` & skeleton stability** | Immediate acknowledgment (`≤ 100ms`), geometry-matched skeleton or progress state with zero layout shift (CLS) and zero fake data | `P1` / `P2` |
| **`empty` (first-use & no-results)** | First-use explains value + direct creation/import CTA; search/filter `no-results` shows active query + one-click clear/broaden action | `P1` / `P2` |
| **`error` & input preservation** | Specific cause + preserved user input + actionable recovery step; never wipes typed forms or shows vague `"Something went wrong"` | `P1` |
| **`offline` & degraded network** | Explicit stale/offline indicator, draft preservation, idempotent retry, and double-submit protection | `P1` |
| **`404` / `500` / fatal recovery boundary** | Branded/idiomatic not-found and unhandled-error recovery screens with working navigation back to safe state and preserved draft where possible | `P1` |
| **`permission-denied` & auth expiry** | Plain-language explanation of missing role/OS permission + recovery path; session expiry preserves unsaved work across re-authentication | `P1` |
| **Sticky-chrome focus unobscured (`WCAG 2.4.11`/`2.4.12`)** | Sequential forward/reverse `Tab` and controller focus never hide behind sticky headers, toolbars, banners, or virtual keyboards (`scroll-padding-block`, `.safeAreaInset`, `imePadding`) | `P0` / `P1` |
| **IME composition `Enter` / `Escape` guard** | Active composition in Telex/VNI, Kana→Kanji, Hangul, or Pinyin (`event.isComposing \|\| keyCode === 229`, `markedTextRange != nil`, `composition != null`, `hasMarkedText()`) **never** prematurely submits search, chat, forms, or inline edits | `P1` |
| **Short-label expansion (`+50–100%`) & `Unicode NFC` glyphs** | Short buttons/tabs/badges survive **`+50–100%`** growth (`+30–40%` for prose) without fixed-width clipping; `Unicode NFC` normalization and stacked diacritics (`ư, ơ, ệ, ử, ẫ`) render with zero mid-word system-font fallback | `P1` / `P2` |
| **Reduced motion, reduced transparency & `EAA` readiness** | Non-vestibular motion path, opaque fallback for glass surfaces, `200%` text zoom, `320px` reflow, single-pointer drag alternative (`2.5.7`), and EU `EAA` / `EN 301 549` Accessibility Statement readiness when in B2C EU scope | `P0` / `P1` |

---

## 4. Stack-Neutral Engineering & Commercial Handoff

Never sign off a build as studio-ready on visual appearance alone:

- [ ] **Zero dead controls or stubs (`P0`/`P1`):** zero `// TODO` / `FIXME` placeholders in requested flows, zero ellipsis-truncated source blocks, zero no-op callbacks/commands/links, zero unwired mobile drawers/menus, and zero unapproved hardcoded mock arrays posing as live data.
- [ ] **Clean strict static checks for the active language (`P1`):** compiler, typechecker, analyzer, and linter pass with zero errors in the project's native ecosystem (`rustc` + `clippy`, Swift strict concurrency, Kotlin/Dart analyzer, `mypy`/`pyright`, C# nullable analysis, Go `vet`, C++ warnings, or `tsc --strict`) without blanket suppressions.
- [ ] **Reproducible `< 10m` clean-clone setup (`P1`):** pinned lockfile/toolchain manifest, `.env.example` or platform config template, and documented single-command bootstrap + test path verified or explicitly labeled `not-checked`.
- [ ] **Stack-native component / screen state previews (`P2`):** isolated state catalog where supported by the stack (SwiftUI `#Preview`, Compose `@Preview`, Flutter Widgetbook, Qt/QML fixtures, TUI snapshots, or Storybook/Ladle) covering non-happy-path states.
- [ ] **Zero client-exposed secrets (`P0`):** no private keys, service-role tokens, signing credentials, or internal endpoints leaked in client source, bundles, binaries, or logs.
- [ ] **Commercial license manifest & owner handoff (`P0`/`P1`):** commercial embedding/redistribution licenses verified for all shipped fonts, icons, imagery, 3D, and audio; root billing/admin ownership boundary clean for DNS, App Store / Google Play / extension / game stores, analytics/error DSNs, CMS, and signing keys; target regulatory/store regime (`MV3`, `PDF/X-4`, `RFC 8058`, `TRC`, `EAA`) checked.
- [ ] **Honest evidence labels (`P0`):** every verification row carries `rendered`, `static`, `model-judgment`, `not-checked`, or `waived` with exact runtime/viewport/tool scope.
