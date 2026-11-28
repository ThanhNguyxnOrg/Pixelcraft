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
| **`B2` Optical alignment & concentric radii** | Asymmetric glyphs (play triangles `▶`, chevrons, arrows, send icons) offset **`+1–2` units (`px`/`pt`/`dp`) toward visual mass** inside circular/square bounds. Nested rounded containers obey **`R_outer = R_inner + padding`** (clamped to `0` when `padding >= R_outer`). Single-line buttons/pills balance top vs bottom text-box padding optically against cap-height/baseline metrics. | High-zoom rendered crop + computed radius/padding check | `P3` (or `P2` when visibly pinched/crooked on primary chrome) |
| **`B3` Origin-aware scaling & asymmetric open/close** | Popovers, menus, and contextual sheets scale subtly (**`0.95 → 1.0`**, never `0 → 1` ballooning from screen center) anchored to the trigger origin. Exit runs **faster than enter (`~100–130ms` close vs `~160–200ms` open)**. Gesture springs preserve release velocity without rubbery bounce (`ζ ≥ 0.85`). | Video/frame capture or transition definition | `P2` / `P3` |
| **`B4` Dark-surface luminance & `1px` specular edges** | Dark mode never inverts light colors mechanically or drops `#000000` shadows onto dark cards. Higher z-layers step up **`+5% to +8%` OKLCH lightness** (`#000000` reserved for OLED wearable/battery or explicit high-contrast modes), separate stacked surfaces with a **`1px` subtle top/inner specular highlight** (`rgba(255,255,255,0.07–0.12)`), desaturate/lift semantic accents to prevent halation (`WCAG AA` + `APCA |Lc|`), and pair translucent blur with **`160–180%` saturation / OS vibrancy** plus a solid opaque fallback under Reduced Transparency. | Dark-mode + reduced-transparency rendered captures & contrast check | `P1` (contrast/halation failure) / `P2` (muddy flat layers) |
| **`B5` Hit-slop, Safe Triangle & pointer capture** | Compact `24–28` unit icon controls expand invisible hit-slop by **`+6–10` units per side**. Hover submenus/megamenus implement a **Safe Triangle diagonal cursor corridor** (or `120–180ms` directional grace timer) with keyboard parity. Drag sliders, scrubbers, and splitters lock **pointer/gesture capture** until release + `Escape` cancel + fine-stepping keys. | Pointer/touch hit-box & diagonal menu traversal test | `P1` (target floor `<24` units or collapsing menu blocking task) / `P2` |
| **`B6` Tabular numerals & true minus (`U+2212`)** | Every live counter, timer, price, KPI delta, progress %, scrubber, and table numeric column locks **tabular figures** (`tnum`) and uses true minus **`−` (`U+2212`)** rather than ASCII `-` (`U+002D`) for negative display values. | Rendered column alignment & live-tick jitter check | `P2` (jittering timer/misaligned financial table) / `P3` |

---

## 3. Non-Happy-Path, Accessibility & Input Completeness

| Surface boundary | Required studio-grade behavior | Severity if missing |
|---|---|---|
| **`loading` & skeleton stability** | Immediate acknowledgment (`≤ 100ms`), geometry-matched skeleton or progress (`> 1s` progress indicator, `> 10s` cancellable action) with zero layout shift and zero fake data | `P1` / `P2` |
| **`empty` (first-use & no-results)** | First-use explains value + direct creation/import CTA; search/filter `no-results` shows active query + one-click clear/broaden action | `P1` / `P2` |
| **`error` & input preservation** | Specific cause + preserved user input + actionable recovery step; never wipes typed forms or shows vague `"Something went wrong"` | `P1` |
| **`offline` & degraded network** | Explicit stale/offline indicator, draft preservation, idempotent retry, and double-submit protection | `P1` |
| **`404` / `500` / fatal recovery boundary** | Branded/idiomatic not-found and unhandled-error recovery screens with working navigation back to safe state and preserved draft where possible | `P1` |
| **`permission-denied` & auth expiry** | Plain-language explanation of missing role/OS permission + recovery path; session expiry preserves unsaved work across re-authentication | `P1` |
| **Sticky-chrome focus unobscured (`WCAG 2.4.11`/`2.4.12`)** | Sequential forward/reverse `Tab` and controller focus never hide behind sticky headers, toolbars, banners, or virtual keyboards | `P0` / `P1` |
| **IME composition `Enter` / `Escape` guard** | Active composition in Telex/VNI, Kana→Kanji, Hangul, or Pinyin **never** prematurely submits search, chat, forms, or inline edits (`Enter`/`Escape` commits or cancels candidates only) | `P1` |
| **Short-label expansion (`+50–100%`) & `Unicode NFC` glyphs** | Short buttons/tabs/badges survive **`+50–100%`** growth (`+30–40%` for prose) without fixed-width clipping; `Unicode NFC` normalization and stacked diacritics (`ư, ơ, ệ, ử, ẫ`) render with zero mid-word system-font fallback | `P1` / `P2` |
| **Reduced motion, reduced transparency & `EAA` readiness** | Non-vestibular motion path, opaque fallback for glass surfaces, `200%` text zoom, `320px` reflow, single-pointer drag alternative (`2.5.7`), and EU `EAA` / `EN 301 549` Accessibility Statement readiness when in B2C EU scope | `P0` / `P1` |

---

## 3b. Mandatory "Break UI" Stress-Test Pass

Never sign off a screen tested only with tidy 2-word labels and 3 sample items. Deliberately try to break the rendered surface (`pixelcraft-visual-qa`) across every applicable stress vector before closing polish:

| Stress vector | Concrete test case | Pass bar | Severity if broken |
|---|---|---|---|
| **60-char unbroken strings** | Inject a 60+ character unbroken email, URL, token, or identifier (`very.long.unbroken.department.identifier@enterprise-tenant.example`) into headings, cards, table cells, and chips | Wraps cleanly (`overflow-wrap: anywhere`) or truncates with full-value inspection; zero grid track blowout or page horizontal scroll | `P1` (blocks task/overflow) / `P2` |
| **Cardinality extremes (`0` / `1` / `500` items)** | Render every collection/list/grid/table with **`0`** items, **`1`** item, and **`500`** items | `0`: purposeful empty state + CTA; `1`: balanced geometry without awkward full-width stretch/orphan breakage; `500`: virtualized or paginated smoothly within frame/scroll budgets | `P1` (jank/blank screen) / `P2` |
| **Broken & slow images** | Block image URLs (`404`/offline) and throttle media load | Explicit dimensions/aspect-ratio preserve zero CLS, clean fallback surface/alt text renders, no broken icon collapses card/hero hierarchy | `P1` / `P2` |
| **3G / throttled network** | Throttle network to slow 3G during initial load, search, and form submit | Skeleton/progress renders immediately (`<= 100 ms`), text stays legible during font load, slow submits lock idempotently without duplicate mutations or dead spinners | `P1` / `P2` |
| **`200%` text / page zoom** | Zoom to `200%` at desktop and smallest supported width | All primary controls remain visible, clickable, and readable with clean reflow and zero clipped text or colliding sticky bars (`WCAG 1.4.4`/`1.4.10`) | `P0` / `P1` |
| **macOS `Show scroll bars: Always` *(Web)*** | Enable classic always-visible scrollbars (~15 px gutter) on scrollable panes, modals, tables, and sticky headers | Zero clipped right/end-edge controls, zero layout jump (`scrollbar-gutter: stable`), and zero spurious horizontal scrollbar | `P2` |
| **`iOS Low Power Mode` *(Web)*** | Test ambient `<video autoplay muted loop playsinline>` when OS Low Power Mode suppresses autoplay | Crisp `poster` renders cleanly with zero broken native play-button overlays and zero uncaught `play()` promise console errors | `P2` |
| **`0` runtime console warnings / errors** | Inspect DevTools Console / platform runtime log across full primary + recovery walkthrough | **`0`** uncaught exceptions, hydration mismatches, missing-key warnings, deprecation noise, CSP errors, or asset `404`s | `P1` (runtime error) / `P2` (warnings) |

---

## 4. Stack-Neutral Engineering & Commercial Handoff

Never sign off a build as studio-ready on visual appearance alone:

- [ ] **Zero dead controls or stubs (`P0`/`P1`):** zero `// TODO` / `FIXME` placeholders in requested flows, zero ellipsis-truncated source blocks, zero no-op callbacks/commands/links, zero unwired mobile drawers/menus, and zero unapproved hardcoded mock arrays posing as live data.
- [ ] **Clean strict static checks & dependency audit (`P1`):** compiler, typechecker, analyzer, linter, and ecosystem dependency vulnerability audit pass cleanly (`0` errors, `0` unaddressed critical/high advisories) without blanket suppressions.
- [ ] **Reproducible `< 10m` setup & isolated staging (`P1`):** pinned lockfile/toolchain manifest, configuration template, single-command bootstrap + verification path, and staging environment strictly isolated from production credentials/data.
- [ ] **Stack-native component / screen state previews (`P2`):** isolated state catalog where supported by the target stack, covering non-happy-path states (`loading`, `empty`, `error`, `offline`, `permission-denied`).
- [ ] **Zero client-exposed secrets (`P0`):** no private keys, service-role tokens, signing credentials, or internal endpoints leaked in client source, bundles, binaries, or logs.
- [ ] **Commercial license manifest, owner transfer & 30–90d warranty (`P0`/`P1`):** commercial embedding/redistribution licenses verified for all shipped fonts, icons, imagery, 3D, and audio; root billing/admin ownership boundary clean for domains, store accounts, analytics/error DSNs, CMS, and signing keys; target regulatory/store regime checked; and **30–90 day defect-warranty / severity-triage handoff note** documented for commercial deliveries.
- [ ] **Golden Evidence Rule (`Rule #0.3`) (`P0`):** every verification row carries `rendered`, `static`, `model-judgment`, `not-checked`, or `waived` with exact runtime/viewport/tool scope, and **`static` or `model-judgment` NEVER counts as `pass` / accepted for visual appearance, measured performance budgets, or interactive/assistive accessibility requirements** (supply `rendered` evidence, or record `not-checked` with concrete reason or `waived` with explicit user sign-off, scope, and consequence).

---

## 5. Mandatory `Scan → Fix → Rescan` Exit Gate & 3-Tier Final Grading

Never treat this document as passive reading. Before reporting completion:

1. **Walk Sections 1–4 (including Section 3b `"Break UI"` Stress-Test Pass) plus the active platform skill's `Pre-submit checklist` row-by-row** against the actual implementation and rendered captures.
2. **Execute every applicable deterministic scan, build gate, and acceptance manifest check:**
   - `node <pixelcraft-review>/scripts/slop-scan.mjs <target> --fail-on p2`
   - `node <pixelcraft-visual-qa>/scripts/check-contrast.mjs <tokens-or-css>` (plus `check-email.mjs`, `check-tui.mjs`, `check-pdf.mjs` where surface matches)
   - Active-language strict compiler, typechecker, linter, dependency vulnerability audit, and automated test suite
   - `node <pixelcraft-review>/scripts/check-acceptance.mjs .pixelcraft/acceptance.json`
3. **Loop until passing (`0` `fail` / `0` `pending`):** If any scan returns `P0`–`P2` findings, any build/test check exits non-zero, or any checklist / `.pixelcraft/acceptance.json` row is `fail`, `pending`, or violates `Rule #0.3`, **repair the root cause and re-run the exact scans and `check-acceptance.mjs` from scratch** until passing:
   - **`FAIL` (`exit 1` — Not Accepted):** any `fail`/`pending` row or `Rule #0.3` `static`/`model-judgment` violation remains. **Keep fixing and re-verifying; never claim completion.**
   - **`PASS_STUDIO_10K_20K` (`exit 0` — Studio $10k–$20k Bar)** *(or `PENDING_RENDERED_ENV` `exit 2` strictly when external physical hardware/store runtime is unavailable here)*: all Baseline `A1–A8` + 12-row Surface Matrix + platform thresholds/deliverables pass on target environments (`rendered` where required) with honest `not-checked` reasons or user-signed `waived` scope/consequence.
   - **`EXCEEDS_STUDIO` (`exit 0` — Exceeds Bar):** meets `PASS_STUDIO_10K_20K` plus real-user usability research, A/B experimentation, deep multi-locale validation, or high-scale systems integration.
