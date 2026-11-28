#!/usr/bin/env node
/**
 * Zero-dependency Studio-Grade ($10k-$20k+) UI/FE Acceptance Checklist & Grading Gate.
 *
 * Enforces:
 *   1. Universal Baseline (A1-A8)
 *   2. Shared 12-Row Surface Acceptance Matrix
 *   3. Platform-Specific Measurable Thresholds, Checklist Gates & Deliverable Artifacts (14 platforms)
 *   4. Evidence-Label Rule #0.3: `static` and `model-judgment` NEVER count as `pass` for
 *      visual appearance, measured performance, or interactive/assistive accessibility rows.
 *   5. 3-Tier Final Verdict: FAIL (exit 1), PENDING_RENDERED_ENV (exit 2, or 0 with --allow-not-checked),
 *      PASS_STUDIO_10K_20K (exit 0), EXCEEDS_STUDIO (exit 0).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CANONICAL_LABELS = new Set(['rendered', 'static', 'model-judgment', 'not-checked', 'waived']);
const LAZY_TEXT_RE = /^(?:n\/?a|none|ok|yes|done|pass|passed|true|todo|tbd|wip|skip|skipped|-|\.+)$/i;

const PLATFORM_ALIASES = {
  web: 'web',
  'responsive-web': 'web',
  mobile: 'mobile',
  ios: 'mobile',
  android: 'mobile',
  desktop: 'desktop',
  tui: 'tui',
  cli: 'tui',
  email: 'email',
  document: 'document',
  pdf: 'document',
  slides: 'document',
  'data-apps': 'data-apps',
  dataviz: 'data-apps',
  dashboard: 'data-apps',
  'game-ui': 'game-ui',
  game: 'game-ui',
  extensions: 'extensions',
  plugin: 'extensions',
  'chat-ui': 'chat-ui',
  bot: 'chat-ui',
  ai: 'chat-ui',
  constrained: 'constrained',
  embedded: 'constrained',
  tv: 'constrained',
  spatial: 'spatial',
  xr: 'spatial',
  media: 'media',
  og: 'media',
  brandkit: 'brandkit',
  brand: 'brandkit',
};

const BASELINE_ITEMS = [
  {
    id: 'A1-strategy-and-scope',
    title: 'Brief records business goal, primary persona, JTBD, above-the-fold What/Who/Why clarity, 1-2 conversion CTAs, numeric KPIs, locked route/IA map, upfront edge-case constraints, anti-goals, OS/browser/locale matrix, and real/near-real copy (zero lorem ipsum or invented proof).',
    requiresRendered: false,
  },
  {
    id: 'A2-design-system-tokens',
    title: 'Semantic tokens (color roles, type, spacing, radius, elevation, z-index, motion), token-backed light/dark modes without hardcoded hex, full component variants/states, multi-target code export, and naming/deprecation docs.',
    requiresRendered: false,
  },
  {
    id: 'A3-rendered-state-matrix',
    title: 'All 9 state families designed and rendered: loading skeleton/progress, empty + next action, 1/many items, long/missing data truncation, 4xx/5xx/network/validation error recovery, offline retry preserving input, permission-denied path, idempotent double-submit lock, and cancel/confirm/undo (with Peak-End success feedback).',
    requiresRendered: true,
  },
  {
    id: 'A4-accessibility-floor',
    title: 'WCAG 2.2 AA / platform equivalent: native controls first (zero accessibility overlay widgets), accessible names + persistent visible labels, >=4.5:1 text & >=3:1 UI contrast, non-color meaning, full keyboard/remote/controller path with unobscured focus, pre-mounted live regions + focus-on-delete/load-more, single-pointer drag alternative, reduced motion, 200% text scaling without clipping, paste-allowed auth, and real screen-reader test.',
    requiresRendered: true,
  },
  {
    id: 'A5-internationalization-and-ime',
    title: 'No concatenated grammar (plural-capable i18n), ~35% prose & +50-100% short-label pseudo-locale expansion without clipping, locale date/time/number/currency formatting, Accept-Language/OS locale detection (never IP/GPS), brand/code translate="no" guards, RTL mirroring when in scope, CJK/Thai/Devanagari/Vietnamese stacked-diacritic NFC font fallback, and active IME Enter-composition safety.',
    requiresRendered: true,
  },
  {
    id: 'A6-performance-and-stability',
    title: 'Direct input acknowledged within <=100ms, >1s tasks show progress, >10s tasks are cancellable, zero layout shift during load, and SOW payload/frame/memory/startup budgets measured on target runtime.',
    requiresRendered: true,
  },
  {
    id: 'A7-truthfulness-and-completeness',
    title: 'Zero // TODO, // FIXME, ellipsis code stubs, empty handlers, dead href="#", broken mobile menus, or runtime console errors/warnings; unused dependencies cleaned; zero dark patterns (symmetric accept/reject, same-channel cancellation, zero pre-checked add-ons/confirmshaming); zero unlabeled fake metrics posing as live data; verified commercial licenses for all fonts, icons, and media.',
    requiresRendered: false,
  },
  {
    id: 'A8-handoff-and-operations',
    title: 'Clean source + README running from clone to dev in <=10-15 min, pinned lockfile + clean vulnerability audit, CI (build+lint+test) + staging separated from prod, Client Autonomy (No Black-Box Build with safe owner-editable boundaries), structured handover training/docs + DIY-vs-dev support boundaries, error monitoring + key-event analytics, 30-90d warranty/SLA process, and source design/asset/font license handoff.',
    requiresRendered: false,
  },
];

const SURFACE_MATRIX_ITEMS = [
  { id: 'M1-responsive-adaptive-layout', title: 'Adaptive/responsive layout across agreed device, viewport, orientation, and short-height classes.', requiresRendered: true },
  { id: 'M2-navigation-and-back', title: 'Navigation hierarchy, deep-linking, connected multi-page flow (no decision paralysis), and back/dismissal behavior match platform expectations.', requiresRendered: true },
  { id: 'M3-input-modalities', title: 'Primary task completable via every supported input modality (pointer, touch, keyboard, controller, D-pad, or voice) with zero rage-clicking.', requiresRendered: true },
  { id: 'M4-focus-and-restoration', title: 'Visible, logical focus order, unobscured focus ring, and focus/state restoration across dialogs, deletes, load-more, routes, and restarts.', requiresRendered: true },
  { id: 'M5-state-matrix-coverage', title: 'Empty, loading, error, offline, permission, and Break UI stress-test states (60-char unbroken strings, 0/1/500 items, broken media, slow network, 200% zoom) verified in runtime.', requiresRendered: true },
  { id: 'M6-assistive-accessibility', title: 'Contrast, semantics, pre-mounted live regions, reduced-motion/transparency, and real platform screen-reader verification.', requiresRendered: true },
  { id: 'M7-text-scale-and-localization', title: '200% text scaling / Dynamic Type, +35-100% label expansion, NFC diacritics, and IME composition verified.', requiresRendered: true },
  { id: 'M8-measured-performance', title: 'Platform startup, interaction latency, frame rate, memory, and payload budgets measured against SOW (extensions disabled on web).', requiresRendered: true },
  { id: 'M9-safe-area-and-frame', title: 'Notches, gesture bars, overscan, folds, titlebars, or trim/bleed safe geometry respected.', requiresRendered: true },
  { id: 'M10-capture-and-recording-evidence', title: 'Required screenshots, videos, profiler traces, and scanner logs saved and redacted of secrets.', requiresRendered: true },
  { id: 'M11-data-security-and-privacy', title: 'Secure token storage, XSS/input sanitization, zero leaked secrets, anti-dark-pattern consent/subscription compliance, and safe mutations.', requiresRendered: false },
  { id: 'M12-platform-idiom-and-craft', title: 'Native platform idioms, Instant Trust Litmus, 5-second hierarchy, B1-B6 Invisible Craft, and micro-craft (spinner anti-flicker, press compression, zero hover weight jitter, interruptible gesture physics).', requiresRendered: true },
];

const RUBRIC_PILLARS = [
  { key: 'visualAndMotion', weight: 25, label: 'Visual Design & Motion' },
  { key: 'uxAndResponsive', weight: 25, label: 'UX, Flows & Responsive' },
  { key: 'performanceAndA11y', weight: 20, label: 'Performance & Accessibility' },
  { key: 'codeQuality', weight: 15, label: 'Code Quality & Hygiene' },
  { key: 'seoSecurityContent', weight: 15, label: 'SEO, Security, Trust & Handover' },
];

const PLATFORM_GATES = {
  web: [
    { id: 'WEB-1-cwv-and-3run-lighthouse', title: '3-run median Lighthouse Mobile with browser extensions disabled (4G throttle: Perf >=90, A11y >=95, BP >=95, SEO >=95), CWV p75 (LCP <=2.5s, INP <=200ms, CLS <=0.1) with real tags active, and bfcache eligibility verified (zero unload listeners).', requiresRendered: true },
    { id: 'WEB-2-payload-fonts-images-loaf', title: 'Initial compressed JS+CSS within class budget (content <=150-250KB, dashboard <=250-450KB, promo <=350-700KB, widget <=100-200KB), capo.js <head> priority order, <=2 self-hosted subsetted fonts, AVIF/WebP srcset + fetchpriority="high" LCP image (never lazy), muted <video> over heavy GIF, zero barrel icon bloat, and zero input-blocking Long Animation Frames.', requiresRendered: true },
    { id: 'WEB-3-architecture-and-purpose-libraries', title: 'Justified SSR/SSG/SPA choice, strict static/type/lint checks, 0 console warnings/errors, unused dependency purge, token/@layer CSS without !important sprawl, vetted accessible libraries for complex widgets, component previews, and E2E tests on critical flows.', requiresRendered: false },
    { id: 'WEB-4-responsive-breakpoints-and-forms', title: 'Verified at 360, 390, 768, 1024, 1280, 1440, 1920+ plus landscape, short-height (<600-650px), macOS Always-Scrollbars, and iOS Low Power Mode; zero horizontal scroll; >=24px (>=44px mobile primary) targets; >=16px mobile inputs (no iOS zoom / no maximum-scale=1); @media (hover: hover); Windows dark <select> contrast; working mobile nav + Escape; and input-preserving forms marking both required & optional fields with adaptive errors.', requiresRendered: true },
    { id: 'WEB-5-seo-security-and-ops', title: 'Per-route meta/OG/Twitter/canonical, adaptive SVG dark-mode favicon + apple-touch-icon + manifest.webmanifest, sitemap.xml, robots.txt, JSON-LD, 301 redirects, hreflang, XSS sanitization, CSP/HSTS/nosniff/Referrer-Policy headers, GDPR/Consent Mode v2 gating, CDN Brotli/cache headers, custom 404/500 pages, PR preview deploys, and rollback plan.', requiresRendered: false },
    { id: 'WEB-6-deliverable-bundle', title: 'Submitted 3-run mobile+desktop Lighthouse reports, heaviest-page Network capture, multi-breakpoint light/dark/reduced-motion/Break-UI state captures, keyboard + NVDA/VoiceOver notes, and Chrome/Firefox/Edge/Safari macOS/real Safari iOS/Chrome Android matrix.', requiresRendered: true },
  ],
  mobile: [
    { id: 'MOB-1-touch-startup-fps-budgets', title: 'Targets >=44x44pt (iOS) / >=48x48dp (Android) with >=8pt/dp gap around destructive actions, cold start <2s on agreed mid-tier hardware, and locked 60/120Hz frame pacing on long lists and transitions.', requiresRendered: true },
    { id: 'MOB-2-memory-energy-crashfree-size', title: 'Zero memory leak across 20-30 primary-flow repetitions (Instruments/LeakCanary), clean Energy/Battery profile, crash-free sessions >=99.5%, and install size within SOW cap ( plus 16 KB ELF native .so alignment on Android).', requiresRendered: true },
    { id: 'MOB-3-native-idioms-and-ergonomics', title: 'iOS HIG & Android Material 3 idioms (documented shared-vs-native split on cross-platform stacks), bottom sheets with detents + scroll handoff + explicit Close button, thumb-zone primary CTAs, and zero custom horizontal swipes in OS back-gesture edges.', requiresRendered: true },
    { id: 'MOB-4-insets-scaling-and-resilience', title: 'Safe areas/Dynamic Island/gesture bar/IME keyboard/landscape/foldable sw>=600dp/tablet adaptation, max Dynamic Type & 200% sp scaling without clipping, VoiceOver + TalkBack verification, offline sync queue, process-death survival, and pre-auth deep links.', requiresRendered: true },
    { id: 'MOB-5-privacy-security-and-store-ops', title: 'Keychain/Keystore token storage, minimal just-in-time permissions + denial recovery, PrivacyInfo.xcprivacy / Play Data Safety, in-app Account Deletion, Sign in with Apple parity, CI signed TestFlight/Play staged rollout, and force-update gate.', requiresRendered: false },
    { id: 'MOB-6-physical-device-deliverables', title: 'Submitted real-device videos, max-font & dark captures, low-end device profiler traces, crash-free report, and VoiceOver/TalkBack notes across compact/standard/Pro Max iOS + >=3 OEM/RAM-tier Android physical devices.', requiresRendered: true },
  ],
  desktop: [
    { id: 'DESK-1-startup-cpu-ram-update-budgets', title: 'Cold start <2-3s (<500ms native/Tauri target), ~0% idle CPU, 30-minute active RAM within SOW ceiling (Electron justified if chosen), ~100ms UI responsiveness with background workers, and signed delta auto-update + rollback verified across 2 consecutive versions.', requiresRendered: true },
    { id: 'DESK-2-native-chrome-and-windowing', title: 'Platform menu bar & OS shortcuts, zero WebView browser giveaways (arrow cursor, user-select: none on chrome, no white dark-boot flash), min/max resize, multi-monitor + mixed-DPI (100%/150%/200%) bounds clamping, two-way file DnD, and modern toolkit (no unwaived Tkinter).', requiresRendered: true },
    { id: 'DESK-3-keyboard-sr-and-contrast', title: 'Shortcut parity on all primary actions, NVDA/JAWS/Narrator (Win), VoiceOver (macOS), and Orca (Linux) compatibility (AccessKit/native a11y tree), plus Windows forced-colors / High Contrast and macOS Increase Contrast.', requiresRendered: true },
    { id: 'DESK-4-atomic-storage-and-session-restore', title: 'OS-standard AppData/Application Support/XDG directories, tested versioned schema migrations, crash-safe atomic writes / SQLite WAL, and full window/tab/document session restoration on restart.', requiresRendered: true },
    { id: 'DESK-5-signing-sandbox-and-clean-uninstall', title: 'MSI/MSIX, DMG/PKG, deb/rpm/Flatpak/AppImage installers, Windows Authenticode / Azure Artifact Signing + macOS Hardened Runtime & Notarization verified unblocked on a clean VM, strict IPC/CSP sandbox, clean uninstaller, and opt-in diagnostic log bundle.', requiresRendered: true },
  ],
  tui: [
    { id: 'TUI-1-geometry-resize-and-startup', title: 'Clean layout at 80x24 and 120x36 with flicker-free live resize, <200ms startup latency on CLI/compact tools, and instant key response.', requiresRendered: true },
    { id: 'TUI-2-pipe-nocolor-and-plain-modes', title: 'Zero ANSI leakage when piped to non-TTY stdout, full usability under NO_COLOR=1, 16-color, and 256-color palettes, --plain non-animated screen-reader mode, --json output, and documented non-zero exit codes + SIGPIPE safety.', requiresRendered: true },
    { id: 'TUI-3-grapheme-paste-ssh-and-teardown', title: 'Dedicated TUI toolkit (no raw print() frames), UAX #29 grapheme-cluster column widths (CJK, ZWJ emoji, diacritics) + Unicode fallback, DECSET 2004 bracketed paste, OSC 52 SSH/tmux clipboard, keyboard-complete mouse-optional controls, and 6-step crash/Ctrl+C terminal teardown.', requiresRendered: true },
    { id: 'TUI-4-cli-packaging-and-deliverables', title: 'Complete --help examples, --version, bash/zsh/fish/pwsh completions, signed/checksummed package-manager release + uninstall docs, check-tui.mjs pass, and asciinema/VHS captures across target terminals + tmux + SSH.', requiresRendered: true },
  ],
  email: [
    { id: 'EML-1-size-style-and-plaintext-budgets', title: 'Pre-ESP HTML <85-90KB (hard <102KB Gmail clip limit), <style> block <=8-16KB with zero @layer/@property/CSS-nesting syntax, ~600px responsive table/MJML/React-Email/Maizzle layout, and complete plaintext companion.', requiresRendered: false },
    { id: 'EML-2-cross-client-and-ganga-survival', title: 'Dual-engine bulletproof CTAs rendering in both Classic Outlook Word (VML) and New Outlook (Chromium), zero flex/grid reliance, layout & contrast surviving when Gmail IMAP/POP (GANGA) strips <style> completely, and blocked-image readability.', requiresRendered: true },
    { id: 'EML-3-dark-mode-retina-and-a11y', title: 'color-scheme / supported-color-schemes declared, dark-mode forced-inversion logo halo/swap survival, 2x retina HTTPS images with meaningful alt + explicit dimensions, role="presentation" layout tables, >=14-16px body copy, padded preheader, descriptive links, and merge-tag fallbacks (no raw {{name}}).', requiresRendered: true },
    { id: 'EML-4-deliverability-and-client-previews', title: 'Aligned SPF + DKIM + DMARC, RFC 8058 One-Click List-Unsubscribe on marketing mail, BIMI if scoped, check-email.mjs pass, and real light+dark client previews across Gmail web/mobile, Apple Mail, Classic Outlook, and New Outlook.', requiresRendered: true },
  ],
  document: [
    { id: 'DOC-1-dedicated-typesetter-and-pdfua', title: 'Generated via dedicated pagination engine (Typst/LaTeX/WeasyPrint/Paged.js/Playwright PDF/React-PDF/Quarto, never ad-hoc window.print()), valid PDF/UA structure (/StructTreeRoot, /MarkInfo, /Lang, /Title), and subsetted embedded fonts with intact /ToUnicode CMap copy extraction.', requiresRendered: false },
    { id: 'DOC-2-pagination-typography-and-data-integrity', title: 'Zero orphan headings or split figures, repeating table headers across page breaks, running headers/footers/page numbers/TOC/bookmarks, 9-12pt print body with tabular numerals, dynamic multi-page/Vietnamese/multilingual overflow resilience, and totals/clauses cross-checked against source data.', requiresRendered: true },
    { id: 'DOC-3-print-prepress-and-slide-parity', title: 'Color + grayscale print legibility verified (plus 3mm bleed, 5mm safe trim, 300 DPI photos, CMYK ICC, and 100% K body black when commercial print is in scope); editable Master-Slide PPTX matching PDF export with speaker notes when slides are in scope.', requiresRendered: true },
    { id: 'DOC-4-deliverables', title: 'Submitted final PDF, check-pdf.mjs / PAC / veraPDF report, embedded font list, rasterized page captures (first, middle, last, long-table break, edge cases), and print proof.', requiresRendered: true },
  ],
  'data-apps': [
    { id: 'DATA-1-latency-and-scale-budgets', title: 'Primary chart frame renders in <=1-2s (with progress beyond), filter/hover/brush responds in <=100-200ms, >500-row tables virtualized or server-paginated, dense series perceptually downsampled (LTTB/Min-Max), tested at peak dataset + concurrency.', requiresRendered: true },
    { id: 'DATA-2-honest-encoding-and-colorblind-a11y', title: 'Chart type matches analytical question, zero-baseline bars, no misleading dual axes/3D/over-sliced pies, visible data source + metric definitions + freshness/timezone badge, colorblind-safe non-color encodings, and screen-reader table/summary + keyboard point navigation.', requiresRendered: true },
    { id: 'DATA-3-states-url-and-safe-exports', title: 'Empty, 1-point, outlier, null-vs-0, stale, API-error, and live-disconnect states rendered; filters/sort/date-range serialized in shareable URL; CSV/XLSX formula-injection sanitized + PII masked on export/screenshots.', requiresRendered: true },
    { id: 'DATA-4-architecture-rbac-and-load-proof', title: 'Runtime matched to concurrency/DAG scale (no prototype-only framework stretched past multi-user SLA), RBAC/RLS + audit log + bulk-write Diff/Confirm modal, indexed queries with timeouts, and empty/normal/extreme/error captures + colorblind/load/SR reports.', requiresRendered: true },
  ],
  'game-ui': [
    { id: 'GAME-1-frame-input-and-zero-gc-budgets', title: 'Meets target frame budget (16.7ms@60Hz / 11.1ms@90Hz / 8.3ms@120Hz) in heaviest gameplay scene, <=100ms input-to-visual feedback, and 0 B/frame steady-state UI GC allocation in engine profiler.', requiresRendered: true },
    { id: 'GAME-2-hud-safezones-and-aspect-ratios', title: 'Built on native engine UI toolkit, non-occluding configurable HUD (scale/opacity), overscan/notch/Steam Deck 1280x800 legibility, 16:9/21:9/4:3 adaptation, and verified readable on both brightest glare and darkest scenes.', requiresRendered: true },
    { id: 'GAME-3-multimodal-input-and-game-a11y', title: 'Full KB/M + controller D-pad focus + touch parity with <=1-frame glyph swap and full remapping; adjustable subtitle size/backdrop, colorblind mode, camera-shake/flash (<=3Hz) reduction, and hold-instead-of-mash assist.', requiresRendered: true },
    { id: 'GAME-4-states-trc-and-deliverables', title: 'Pause, loading, disconnect, save-failed, controller-unplugged auto-pause, call/lock interruptions, CJK/Arabic/expansion i18n, Steam/Console store compliance, plus brightest/darkest/aspect/a11y screenshots, lowest-spec profiler trace, and controller+KB videos.', requiresRendered: true },
  ],
  extensions: [
    { id: 'EXT-1-least-privilege-host-theme-and-perf', title: 'Minimal justified permissions + privacy policy, native host theme/font/density inheritance with live mid-session theme & locale switching, zero idle host slowdown/background polling, and unauthenticated/offline/expired/empty states.', requiresRendered: true },
    { id: 'EXT-2-platform-architecture-and-isolation', title: 'Browser MV3 (ephemeral service worker state, zero remotely hosted code, Shadow DOM CSS + keydown isolation tested on hostile-CSS pages, Safari wrapper if scoped); IDE/SaaS (lazy activation, strict CSP webview + getState/setState persistence, remote workspace support, OAuth PKCE).', requiresRendered: true },
    { id: 'EXT-3-store-package-and-deliverables', title: 'Store-ready listing/screenshots/CHANGELOG/icons, host light+dark videos/captures, idle vs heavy memory/CPU profile, and permission justification manifest.', requiresRendered: true },
  ],
  'chat-ui': [
    { id: 'CHAT-1-messaging-bot-contracts', title: 'Uses native host components (Block Kit/Components V2/Adaptive Cards/Flows/Zalo/Mini App) within payload limits, acknowledges webhooks within host timeout (<2-3s) + async progress, handles invalid args/edits/deletes/idempotency/rate-limit queues, and discloses retention + deletion.', requiresRendered: true },
    { id: 'CHAT-2-streaming-citations-and-hitl', title: 'Thinking/streaming/interrupted/cancel/retry/error/long states with non-yanking scroll, unlocked composer + IME Enter guard, throttled polite aria-live announcements, grounded non-fabricated citations, Before->After HITL approval cards, and warm human-agent escalation.', requiresRendered: true },
    { id: 'CHAT-3-security-and-deliverables', title: 'Prompt-injection & Markdown external-image exfiltration defense (CSP img-src / proxy), scoped tool permissions, plus normal/streaming/error/cancel/long/unauthorized video captures and concurrency/queue test logs.', requiresRendered: true },
  ],
  constrained: [
    { id: 'CON-1-modality-and-lowest-hardware-budget', title: 'Every primary task completable solely via the target hardware input (remote D-pad, touch, rotary, physical keys, or voice) and verified on the lowest-spec contract hardware (RAM/Flash/CPU/FPS/battery measured on real device/board).', requiresRendered: true },
    { id: 'CON-2-class-specific-ergonomics', title: 'Meets class bar: TV (10ft type, D-pad, overscan, zero hover, QR auth); Watch (<=2-3s glance, #000000 OLED, phone-away standalone); E-Ink (minimal refresh, zero animation); Kiosk/POS (large targets, session timeout PII reset, offline + 72h soak); Automotive (distraction cap + voice); Voice (<300ms barge-in + readback confirm).', requiresRendered: true },
    { id: 'CON-3-powerloss-and-regulatory-boundary', title: 'Safe state/data recovery across sudden power loss or reboot, and explicit documentation of certified vs uncertified regulated-industry (automotive/medical/industrial/ADA) requirements.', requiresRendered: true },
  ],
  spatial: [
    { id: 'XR-1-framerate-and-ergonomic-comfort', title: 'Locked device framerate (72/90/120Hz) under peak object load without drops, comfortable 1.2-2.0m / slightly-below-horizon placement, zero forced camera motion sickness, vignette/snap-turn reduced-motion comfort, and physical headset multi-user comfort notes.', requiresRendered: true },
    { id: 'XR-2-multimodal-input-and-a11y', title: 'Hand/eye/controller input without fatiguing gestures + fallback modality + one-handed mode, platform target size/spacing (>=60pt visionOS) with zero eye-gaze geometry shift, seated/standing/wheelchair support, spatial captions, and visual cues for spatial audio.', requiresRendered: true },
    { id: 'XR-3-privacy-and-interruption-states', title: 'Just-in-time camera/eye/hand/room-mesh privacy disclosures with minimal retention, plus tracking-lost, low-light, bright-sunlit, small-room, call, and headset-removed interruption states captured in-headset.', requiresRendered: true },
  ],
  media: [
    { id: 'MED-1-aspect-safezones-and-thumbnail-readability', title: 'Exact platform dimensions & UI-overlay safe zones (1200x630 OG, 1:1, 9:16 vertical), legible when downscaled to 150-300px thumbnail width and across light/dark social feeds, using shared product tokens and brand rules.', requiresRendered: true },
    { id: 'MED-2-templated-pipeline-and-video-specs', title: 'Data-driven reproducible generation (Satori/Takumi/Sharp or Remotion/Motion Canvas/FFmpeg), legible 0.0s poster + muted-autoplay comprehension + captions, ~-14 LUFS audio normalization, and <=3Hz flash safety.', requiresRendered: true },
    { id: 'MED-3-unfurl-previews-and-licensing', title: 'Live share-debugger previews captured (Facebook, X, LinkedIn, Zalo), alt text supplied, editable source templates handed over, and commercial font/music/image licenses documented.', requiresRendered: true },
  ],
  brandkit: [
    { id: 'BRD-1-vector-marks-and-small-size-proof', title: 'SVG master logos (horizontal, stacked, icon-only, monochrome, inverted) with clearspace/minimum-size rules and dedicated optical legibility verified at 16-32px favicon/avatar scale.', requiresRendered: true },
    { id: 'BRD-2-color-type-and-token-governance', title: 'Role-mapped color system verified for text/surface contrast across HEX/RGB/OKLCH (and CMYK/Pantone when print is in scope), commercially licensed font pair with Vietnamese/multilingual fallbacks, unified illustration/icon rules + do/dont examples, and exported DTCG tokens.', requiresRendered: false },
    { id: 'BRD-3-applications-handoff-and-ip-screening', title: 'Real-world application mockups (cards, letterhead, social, slides, packaging/signage; print proof if physical), complete SVG/PNG/PDF/source/font-license handoff with IP transfer, and preliminary trademark-similarity screening (escalating formal legal counsel).', requiresRendered: true },
  ],
};

function help() {
  return `Usage:
  node check-acceptance.mjs --init <platform> [--out FILE] [--force]
  node check-acceptance.mjs --list-platforms [--json]
  node check-acceptance.mjs <acceptance.json> [--json] [--allow-not-checked] [--require-rubric]

Zero-dependency Studio-Grade ($10k-$20k+) UI/FE Acceptance Checklist & Grading Gate.
Validates Universal Baseline (A1-A8), Shared 12-Row Surface Acceptance Matrix,
Platform-Specific Measurable Thresholds & Deliverables across all 14 frontend platforms,
and an optional Hybrid Weighted 100-Point Rubric (25/25/20/15/15 + hard-floor lock).

Key enforcement rules:
  - Every row must carry a canonical evidence label: rendered, static, model-judgment, not-checked, or waived.
  - Rule #0.3: Visual, performance, and interactive accessibility rows (requiresRendered: true)
    CANNOT pass with "static" or "model-judgment" — they require "rendered" evidence (or explicit user "waived").
  - Hybrid Weighted Rubric (when rubric scores are populated or --require-rubric is set):
    Visual+Motion 25% + UX+Responsive 25% + Perf+A11y 20% + Code Quality 15% + SEO/Security/Content 15%.
    <70 = AMATEUR, 70-89.9 = GOOD, >=90 = STUDIO_10K_PLUS. Both weightedScore >= 90 AND zero hard-floor
    failures are required to pass when rubric scoring is active.
  - Exits 1 (FAIL) while any row is pending, failing, violates Rule #0.3, or falls below rubric threshold.
  - Exits 2 (PENDING_RENDERED_ENV) when all checkable items pass but hardware/runtime rows are not-checked
    (pass --allow-not-checked to exit 0 in headless CI while preserving the honest PENDING_RENDERED_ENV grade).
  - Exits 0 on PASS_STUDIO_10K_20K or EXCEEDS_STUDIO.

Options:
  --init PLATFORM       Generate a blank acceptance checklist JSON for PLATFORM (web, mobile, desktop,
                        tui, email, document, data-apps, game-ui, extensions, chat-ui, constrained,
                        spatial, media, brandkit)
  --out FILE            Output path for --init (default: .pixelcraft/acceptance.json; use - for stdout)
  --force               Overwrite existing --out file during --init
  --list-platforms      List all 14 supported canonical platform profiles
  --allow-not-checked   Exit 0 instead of 2 when grade is PENDING_RENDERED_ENV (0 failures, >0 not-checked)
  --require-rubric      Require all 5 weighted rubric pillar scores (0-100) and weightedScore >= 90
  --json                Emit machine-readable JSON output
  --help                Show this help`;
}

function resolvePlatform(raw) {
  const key = String(raw || '').trim().toLowerCase();
  return PLATFORM_ALIASES[key] || null;
}

function isMeaningfulText(val, minLen = 8) {
  if (typeof val !== 'string') return false;
  const trimmed = val.trim();
  return trimmed.length >= minLen && !LAZY_TEXT_RE.test(trimmed);
}

export function buildTemplate(platformInput) {
  const platform = resolvePlatform(platformInput);
  if (!platform) {
    throw new Error(`unknown platform '${platformInput}'; run --list-platforms to see valid platforms`);
  }
  const toMap = (items) => Object.fromEntries(
    items.map((item) => [
      item.id,
      {
        title: item.title,
        requiresRendered: item.requiresRendered,
        result: 'pending',
        label: 'not-checked',
        evidence: '',
      },
    ]),
  );

  return {
    schemaVersion: 1,
    platform,
    target: 'Describe route, app surface, or deliverable under acceptance',
    sowThresholds: {
      devicesAndEnvironments: 'Specify agreed physical devices, viewports, browsers/OS versions, and network profile',
      numericBudgets: 'Specify agreed startup, frame, payload, Lighthouse/CWV, or print/size budgets',
    },
    baseline: toMap(BASELINE_ITEMS),
    surfaceMatrix: toMap(SURFACE_MATRIX_ITEMS),
    platformGates: toMap(PLATFORM_GATES[platform]),
    rubric: Object.fromEntries(
      RUBRIC_PILLARS.map((pillar) => [
        pillar.key,
        { label: pillar.label, weight: pillar.weight, score: null, notes: '' },
      ]),
    ),
    exceeds: [],
  };
}

function evaluateRubric(rubricObj, requireRubric, issues, counts) {
  const hasObj = rubricObj && typeof rubricObj === 'object' && !Array.isArray(rubricObj);
  if (!hasObj) {
    if (requireRubric) {
      counts.invalid += 1;
      issues.push({
        id: 'rubric',
        rule: 'missing-rubric',
        message: 'Weighted 100-point rubric is required (--require-rubric) with all 5 pillars scored 0-100.',
      });
    }
    return null;
  }

  const rawValues = RUBRIC_PILLARS.map((pillar) => {
    const entry = rubricObj[pillar.key];
    if (typeof entry === 'number') return entry;
    if (entry && typeof entry === 'object' && !Array.isArray(entry)) return entry.score;
    return undefined;
  });

  const anyPopulated = rawValues.some((v) => v !== null && v !== undefined);
  if (!anyPopulated && !requireRubric) {
    return null;
  }

  let weightedTotal = 0;
  let allValid = true;
  const pillars = {};

  for (let i = 0; i < RUBRIC_PILLARS.length; i += 1) {
    const pillar = RUBRIC_PILLARS[i];
    const score = rawValues[i];
    if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > 100) {
      allValid = false;
      counts.invalid += 1;
      issues.push({
        id: `rubric.${pillar.key}`,
        rule: 'invalid-rubric-score',
        message: `rubric.${pillar.key} (${pillar.label}, weight ${pillar.weight}%) must be a finite number between 0 and 100.`,
      });
      continue;
    }
    weightedTotal += (score * pillar.weight) / 100;
    pillars[pillar.key] = { weight: pillar.weight, score };
  }

  if (!allValid) {
    return { weightedScore: null, band: 'INVALID', pillars };
  }

  const weightedScore = Math.round(weightedTotal * 10) / 10;
  const band = weightedScore >= 90 ? 'STUDIO_10K_PLUS' : weightedScore >= 70 ? 'GOOD' : 'AMATEUR';
  if (weightedScore < 90) {
    counts.failed += 1;
    issues.push({
      id: 'rubric',
      rule: 'rubric-below-studio-bar',
      message: `Weighted rubric score ${weightedScore}/100 (${band}) is below the >=90 Studio $10k+ threshold; improve weak pillars and re-score.`,
    });
  }
  return { weightedScore, band, pillars };
}

function validateSection(sectionObj, expectedItems, sectionName, allowNotApplicable, issues, counts) {
  if (!sectionObj || typeof sectionObj !== 'object' || Array.isArray(sectionObj)) {
    issues.push({
      id: sectionName,
      rule: 'missing-section',
      message: `Missing or invalid '${sectionName}' object in acceptance manifest.`,
    });
    return;
  }

  for (const spec of expectedItems) {
    const entry = sectionObj[spec.id];
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      counts.missing += 1;
      issues.push({
        id: spec.id,
        rule: 'missing-item',
        message: `${sectionName}.${spec.id} is missing from manifest.`,
      });
      continue;
    }

    const result = String(entry.result || '').trim();
    const label = String(entry.label || '').trim();

    if (!CANONICAL_LABELS.has(label)) {
      counts.invalid += 1;
      issues.push({
        id: spec.id,
        rule: 'invalid-evidence-label',
        message: `${spec.id} has invalid label '${label}'; expected rendered, static, model-judgment, not-checked, or waived.`,
      });
      continue;
    }

    if (result === 'pending') {
      counts.pending += 1;
      issues.push({
        id: spec.id,
        rule: 'item-pending',
        message: `${spec.id} is still 'pending' — walk this checklist item, verify it, and record evidence.`,
      });
      continue;
    }

    if (result === 'fail') {
      counts.failed += 1;
      issues.push({
        id: spec.id,
        rule: 'item-failed',
        message: `${spec.id} is marked 'fail'${entry.evidence ? ` (${entry.evidence})` : ''} — fix the defect and re-verify before stopping.`,
      });
      continue;
    }

    if (label === 'waived') {
      if (!isMeaningfulText(entry.approvedBy, 3) || !isMeaningfulText(entry.scope, 6) || !isMeaningfulText(entry.consequence, 8)) {
        counts.invalid += 1;
        issues.push({
          id: spec.id,
          rule: 'incomplete-waiver',
          message: `${spec.id} uses label 'waived' without explicit approvedBy, scope (>=6 chars), and consequence (>=8 chars).`,
        });
        continue;
      }
      counts.waived += 1;
      continue;
    }

    if (result === 'not-applicable') {
      if (!allowNotApplicable) {
        counts.invalid += 1;
        issues.push({
          id: spec.id,
          rule: 'baseline-not-skippable',
          message: `${spec.id} belongs to mandatory Baseline A and cannot be 'not-applicable' (use explicit client 'waived' if overridden by contract).`,
        });
        continue;
      }
      if (!isMeaningfulText(entry.reason, 10)) {
        counts.invalid += 1;
        issues.push({
          id: spec.id,
          rule: 'missing-na-reason',
          message: `${spec.id} is marked 'not-applicable' without a concrete product reason (>=10 chars).`,
        });
        continue;
      }
      counts.notApplicable += 1;
      continue;
    }

    if (result === 'not-checked' || label === 'not-checked') {
      if (result === 'pass') {
        counts.invalid += 1;
        issues.push({
          id: spec.id,
          rule: 'pass-cannot-be-not-checked',
          message: `${spec.id} cannot claim result 'pass' while label is 'not-checked'; set result to 'not-checked' with a concrete missing-runtime reason.`,
        });
        continue;
      }
      if (!isMeaningfulText(entry.reason, 12)) {
        counts.invalid += 1;
        issues.push({
          id: spec.id,
          rule: 'lazy-not-checked-reason',
          message: `${spec.id} is 'not-checked' without a concrete reason (>=12 chars naming the unavailable device, binary, or external account).`,
        });
        continue;
      }
      counts.notChecked += 1;
      continue;
    }

    if (result !== 'pass') {
      counts.invalid += 1;
      issues.push({
        id: spec.id,
        rule: 'invalid-result',
        message: `${spec.id} has unsupported result '${result}'; expected pass, fail, not-checked, not-applicable, or pending.`,
      });
      continue;
    }

    // Rule #0.3: Visual, performance, and interactive accessibility rows require `rendered` evidence!
    if (spec.requiresRendered && label !== 'rendered') {
      counts.rule03Violations += 1;
      issues.push({
        id: spec.id,
        rule: 'static-or-model-judgment-insufficient',
        message: `${spec.id} requires 'rendered' evidence (visual/performance/accessibility Rule #0.3), but got '${label}'. Measure/inspect the running output or mark 'not-checked' with concrete missing-runtime reason.`,
      });
      continue;
    }

    if (label === 'model-judgment') {
      counts.invalid += 1;
      issues.push({
        id: spec.id,
        rule: 'model-judgment-not-proof',
        message: `${spec.id} uses 'model-judgment', which is a hypothesis and cannot satisfy an acceptance pass without static/rendered verification.`,
      });
      continue;
    }

    if (!isMeaningfulText(entry.evidence, 8)) {
      counts.invalid += 1;
      issues.push({
        id: spec.id,
        rule: 'missing-evidence',
        message: `${spec.id} claims 'pass' without concrete evidence (>=8 chars: artifact path, executed command, or measured metric).`,
      });
      continue;
    }

    counts.passed += 1;
  }
}

export function evaluateAcceptance(manifest, options = {}) {
  const issues = [];
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    throw new Error('acceptance manifest must be a JSON object');
  }
  if (manifest.schemaVersion !== 1) {
    throw new Error('expected schemaVersion: 1');
  }
  const platform = resolvePlatform(manifest.platform);
  if (!platform) {
    throw new Error(`unsupported platform '${manifest.platform}'; see --list-platforms`);
  }
  if (!isMeaningfulText(manifest.target, 4) || /^Describe route, app surface/i.test(manifest.target)) {
    issues.push({
      id: 'target',
      rule: 'unfilled-target',
      message: 'Set manifest.target to the concrete application, route, or deliverable under acceptance.',
    });
  }
  if (!manifest.sowThresholds || typeof manifest.sowThresholds !== 'object'
      || !isMeaningfulText(manifest.sowThresholds.devicesAndEnvironments, 8)
      || !isMeaningfulText(manifest.sowThresholds.numericBudgets, 8)
      || /^Specify agreed /i.test(manifest.sowThresholds.devicesAndEnvironments)
      || /^Specify agreed /i.test(manifest.sowThresholds.numericBudgets)) {
    issues.push({
      id: 'sowThresholds',
      rule: 'unfilled-sow-thresholds',
      message: 'Lock concrete sowThresholds.devicesAndEnvironments and sowThresholds.numericBudgets before signing off acceptance.',
    });
  }

  const counts = {
    passed: 0,
    failed: 0,
    pending: 0,
    notChecked: 0,
    waived: 0,
    notApplicable: 0,
    missing: 0,
    invalid: 0,
    rule03Violations: 0,
    exceedsPassed: 0,
  };

  validateSection(manifest.baseline, BASELINE_ITEMS, 'baseline', false, issues, counts);
  validateSection(manifest.surfaceMatrix, SURFACE_MATRIX_ITEMS, 'surfaceMatrix', true, issues, counts);
  validateSection(manifest.platformGates, PLATFORM_GATES[platform], 'platformGates', true, issues, counts);
  const rubric = evaluateRubric(manifest.rubric, Boolean(options.requireRubric), issues, counts);

  if (Array.isArray(manifest.exceeds)) {
    for (const [idx, ex] of manifest.exceeds.entries()) {
      if (ex && ex.result === 'pass' && (ex.label === 'rendered' || ex.label === 'static') && isMeaningfulText(ex.evidence, 8)) {
        counts.exceedsPassed += 1;
      } else {
        issues.push({
          id: `exceeds[${idx}]`,
          rule: 'invalid-exceeds-entry',
          message: `exceeds[${idx}] must have result 'pass', label 'rendered' or 'static', and concrete evidence (>=8 chars).`,
        });
        counts.invalid += 1;
      }
    }
  }

  let grade = 'FAIL';
  if (issues.length === 0) {
    if (counts.notChecked > 0) {
      grade = 'PENDING_RENDERED_ENV';
    } else if (counts.exceedsPassed > 0) {
      grade = 'EXCEEDS_STUDIO';
    } else {
      grade = 'PASS_STUDIO_10K_20K';
    }
  }

  return {
    platform,
    target: manifest.target,
    grade,
    rubric,
    counts,
    issues,
  };
}

function parseArgs(argv) {
  const opts = {
    help: false,
    json: false,
    listPlatforms: false,
    allowNotChecked: false,
    requireRubric: false,
    force: false,
    init: '',
    out: '.pixelcraft/acceptance.json',
    input: '',
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') opts.help = true;
    else if (arg === '--json') opts.json = true;
    else if (arg === '--list-platforms') opts.listPlatforms = true;
    else if (arg === '--allow-not-checked') opts.allowNotChecked = true;
    else if (arg === '--require-rubric') opts.requireRubric = true;
    else if (arg === '--force') opts.force = true;
    else if (arg === '--init') {
      if (!argv[i + 1]) throw new Error('--init requires a platform name');
      opts.init = argv[++i];
    } else if (arg.startsWith('--init=')) opts.init = arg.slice('--init='.length);
    else if (arg === '--out') {
      if (!argv[i + 1]) throw new Error('--out requires a file path or -');
      opts.out = argv[++i];
    } else if (arg.startsWith('--out=')) opts.out = arg.slice('--out='.length);
    else if (arg.startsWith('-')) throw new Error(`unknown option: ${arg}`);
    else if (!opts.input) opts.input = arg;
    else throw new Error(`unexpected argument: ${arg}`);
  }
  return opts;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    console.log(help());
    return;
  }
  if (opts.listPlatforms) {
    const platforms = Object.keys(PLATFORM_GATES);
    if (opts.json) console.log(JSON.stringify({ platforms }, null, 2));
    else console.log(`Supported platforms (${platforms.length}): ${platforms.join(', ')}`);
    return;
  }
  if (opts.init) {
    const template = buildTemplate(opts.init);
    const serialized = `${JSON.stringify(template, null, 2)}\n`;
    if (opts.out === '-') {
      process.stdout.write(serialized);
      return;
    }
    const dest = path.resolve(opts.out);
    if (fs.existsSync(dest) && !opts.force) {
      throw new Error(`refusing to overwrite existing file '${opts.out}' without --force`);
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, serialized, 'utf8');
    console.log(`Initialized Studio Acceptance Checklist (${template.platform}) -> ${opts.out}`);
    return;
  }

  if (!opts.input) {
    throw new Error('provide an acceptance manifest JSON file or --init <platform>; see --help');
  }
  const filePath = path.resolve(opts.input);
  if (!fs.existsSync(filePath)) {
    throw new Error(`acceptance manifest not found: ${opts.input}`);
  }
  const manifest = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const report = evaluateAcceptance(manifest, { requireRubric: opts.requireRubric });

  if (opts.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    const rubricSuffix = report.rubric && report.rubric.weightedScore !== null
      ? `, rubric=${report.rubric.weightedScore}/100[${report.rubric.band}]`
      : '';
    console.log(`check-acceptance [${report.platform}]: ${report.grade} (passed=${report.counts.passed}, waived=${report.counts.waived}, na=${report.counts.notApplicable}, notChecked=${report.counts.notChecked}${rubricSuffix}, issues=${report.issues.length})`);
    for (const issue of report.issues) {
      console.log(`  FAIL ${issue.id} [${issue.rule}] — ${issue.message}`);
    }
    if (report.grade === 'FAIL') {
      console.log('action: Do NOT stop. Fix every failed/pending item, re-run scanners, record honest rendered/static evidence, and re-run check-acceptance.mjs until clean.');
    } else if (report.grade === 'PENDING_RENDERED_ENV') {
      console.log('note: All locally checkable items passed, but rendered hardware/environment checks remain not-checked; cannot claim full $10k-$20k acceptance until rendered checks run.');
    }
  }

  if (report.grade === 'FAIL') {
    process.exitCode = 1;
  } else if (report.grade === 'PENDING_RENDERED_ENV' && !opts.allowNotChecked) {
    process.exitCode = 2;
  }
}

const isEntrypoint = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntrypoint) {
  try {
    main();
  } catch (error) {
    console.error(`check-acceptance: ${error.message}`);
    process.exit(1);
  }
}
