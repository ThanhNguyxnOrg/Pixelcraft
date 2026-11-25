import { motion, useReducedMotion } from "motion/react";
import { useState, type ComponentProps } from "react";
import {
  AGENT_TARGET_COUNT,
  GALLERY,
  SKILLS,
  TOKEN_FORMATS,
  TOTAL_EVAL_FIXTURES,
  TOTAL_REFERENCES,
  TOTAL_SCRIPTS,
} from "../data";
import { publicUrl } from "../lib/publicUrl";
import { dispatchJump } from "../lib/urlState";
import { EvidenceStamp, PixelFrame, PixelIcon, SectionHead } from "./pixel";

type EvidenceKind = ComponentProps<typeof EvidenceStamp>["label"];

type Pillar = {
  id: string;
  code: string;
  title: string;
  domain: string;
  evidence: EvidenceKind;
  summary: string;
  templateDefault: string;
  engineeredStandard: string;
  deliverables: string[];
  proofLabel: string;
  proofHref?: string;
  proofAction?: () => void;
};

export function Blueprint() {
  const reducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string>("strategy");

  const pillars: Pillar[] = [
    {
      id: "strategy",
      code: "01",
      title: "Strategy & Socratic Discovery",
      domain: "Discovery · Persona · KPIs",
      evidence: "static",
      summary:
        "Production engagements fail when code starts before scope, audience, and measurable outcomes are locked. Pixelcraft forces structured discovery and three distinct creative directions before a component is written.",
      templateDefault:
        "Skips discovery, clones a stock marketing layout, and fills boxes with placeholder copy and zero user-flow model.",
      engineeredStandard:
        "Repo inspection, one-question-at-a-time Socratic interview, explicit persona/JTBD framing, and 7-axis direction scoring.",
      deliverables: [
        "Step-zero stack, surface-mode (Persuade / Operate / Communicate), and ownership audit via pixelcraft-plan.",
        "Three genuinely divergent IA and visual proposals with ASCII wireframes and real-copy drafts via pixelcraft-direction.",
        "Complete state matrix (empty, loading, error, offline, long-copy, permission) authored before UI code.",
      ],
      proofLabel: "Inspect 4-direction receipt ↓",
      proofHref: "#receipt",
    },
    {
      id: "system",
      code: "02",
      title: "Bespoke Design System & Tokens",
      domain: "DTCG 2025.10 · Typography · Motion",
      evidence: "static",
      summary:
        "Custom semantic design tokens decouple brand identity from raw hex literals, allowing one system to scale cleanly across web, native mobile, desktop, TUI, email, and print.",
      templateDefault:
        "Reskins a stock UI kit with hardcoded neon hex values, third-party font CDNs, and arbitrary spacing.",
      engineeredStandard: `Semantic DTCG 2025.10 tokens compiled to ${TOKEN_FORMATS.length} native targets, self-hosted variable typography, and purposeful choreography.`,
      deliverables: [
        `Deterministic export-tokens.mjs compiler emitting CSS, Tailwind v4, Swift, Kotlin, Dart, Rust, Typst, Godot, and ${TOKEN_FORMATS.length - 8} more targets.`,
        "100% locally bundled Fontsource WOFF2 fonts (Archivo variable width, IBM Plex Mono, Silkscreen) with critical font preloading.",
        "Interactive sampled PixelLogo canvas, GSAP SplitText/ScrollTrigger choreography, and spring layout transitions.",
      ],
      proofLabel: "Inspect token compiler ↓",
      proofHref: "#tools",
    },
    {
      id: "architecture",
      code: "03",
      title: "Architecture, Deep Links & CI",
      domain: "Typed State · Cmd+K · Contracts",
      evidence: "static",
      summary:
        "Every view state is addressable by URL, searchable via keyboard command palette, and guarded by automated build, scanner, and repository-sync contracts in GitHub Actions.",
      templateDefault:
        "Fragile plugin soup edited live in production with ephemeral modal state and zero automated tests.",
      engineeredStandard: `Typed zero-lock-in build, shareable URL query state, global Ctrl/⌘+K palette, and ${TOTAL_EVAL_FIXTURES} offline evaluation fixtures.`,
      deliverables: [
        "Shareable URL query synchronization (?exhibit=, ?view=, ?skill=, ?agent=) across Workbench, Skill Index, and Installer.",
        `Instant Ctrl/⌘+K Command Palette indexing all ${GALLERY.length} exhibits, ${SKILLS.length} skills, and ${AGENT_TARGET_COUNT} agent hosts.`,
        `Automated CI pipeline running TypeScript strict check, Prettier, slop-scan dogfooding, ${TOTAL_REFERENCES}-ref sync, and live bundle probes.`,
      ],
      proofLabel: "Open Ctrl/⌘+K palette",
      proofAction: () => dispatchJump({ kind: "palette" }),
    },
    {
      id: "performance",
      code: "04",
      title: "Performance & Asset Discipline",
      domain: "Zero CLS · WebP · Offscreen Pause",
      evidence: "rendered",
      summary:
        "High craft never excuses sluggish pages. Critical fonts preload ahead of render, media streams support HTTP 206 byte ranges, and off-screen animations pause automatically.",
      templateDefault:
        "Uncompressed multi-megabyte PNGs, layout-shifting webfont swaps, and continuous off-screen GPU loops.",
      engineeredStandard:
        "Preloaded WOFF2 fonts, explicit 1440×900 aspect-ratio locks, 88-quality WebP captures, and ScrollTrigger/IntersectionObserver pause.",
      deliverables: [
        "Rollup chunk splitting (vendor, motion, choreography, showcase-data) with immutable 1-year asset caching.",
        "Explicit width/height dimensions on every gallery plate and lazy decoding across the 22-surface contact sheet.",
        "Automatic visibilitychange and IntersectionObserver suspension for canvas particles, tickers, and background video.",
      ],
      proofLabel: `Inspect ${GALLERY.length} WebP exhibits ↓`,
      proofHref: "#gallery",
    },
    {
      id: "seo",
      code: "05",
      title: "Technical SEO & Agent Discovery",
      domain: "JSON-LD · Sitemap · llms.txt",
      evidence: "static",
      summary:
        "Both search engines and coding agents receive structured, canonical metadata synced directly from package.json and live repository counts at build time.",
      templateDefault:
        "Missing canonical URLs, broken social cards, empty meta descriptions, and unstructured div soup.",
      engineeredStandard:
        "Canonical URLs, Schema.org @graph JSON-LD (WebSite + SoftwareSourceCode + FAQPage), XML sitemap, robots.txt, and llms.txt.",
      deliverables: [
        `Auto-generated sitemap.xml indexing the canonical showcase and all ${GALLERY.length} standalone multi-stack HTML exhibits.`,
        "Schema.org application/ld+json structured data embedded in both index.html and every standalone gallery exhibit.",
        `Machine-readable llms.txt manifest exposing all ${SKILLS.length} skills, ${TOTAL_SCRIPTS} QA CLIs, and live exhibit URLs.`,
      ],
      proofLabel: "View sitemap.xml ↗",
      proofHref: publicUrl("sitemap.xml"),
    },
    {
      id: "accessibility",
      code: "06",
      title: "WCAG 2.2 AA & Adaptive Ergonomics",
      domain: "Contrast · Keyboard · 320px–1440px",
      evidence: "rendered",
      summary:
        "Accessibility and mobile ergonomics are enforced as non-negotiable engineering gates rather than post-launch patches.",
      templateDefault:
        "Removed focus outlines, low-contrast muted text, desktop layouts squeezed onto phones, and color-only status dots.",
      engineeredStandard:
        "WCAG 2.2 AA contrast, >= 24px/44px touch targets, mobile thumb-zone bottom dock, forced-colors mode, and WCAG 2.2.2 motion pause.",
      deliverables: [
        "Verified 0 horizontal overflow (docScrollWidth === innerWidth) at 320×568, 390×844 mobile touch, and 1440×900 desktop.",
        "Full keyboard roving-tabindex tabs, skip-to-content links across all 22 exhibits, and high-contrast forced-colors overrides.",
        "One-click 'Pause page motion' control halting GSAP timelines, Motion springs, tickers, and background media.",
      ],
      proofLabel: "Inspect 10-point floor ↓",
      proofHref: "#floor",
    },
    {
      id: "security",
      code: "07",
      title: "Security & Zero-Telemetry Privacy",
      domain: "CSP · Traversal Guard · 0 Cookies",
      evidence: "static",
      summary:
        "Self-hosted assets and hardened HTTP response headers eliminate third-party data leakage, supply-chain font tracking, and frame-injection vectors.",
      templateDefault:
        "Third-party tracker scripts, unvetted CDN tags, missing CSP headers, and intrusive cookie banners.",
      engineeredStandard:
        "Strict Content-Security-Policy, Permissions-Policy, COOP, nosniff, path-traversal rejection, and zero cookies or analytics.",
      deliverables: [
        "Production server (scripts/serve.mjs) enforces CSP, X-Frame-Options: SAMEORIGIN, COOP: same-origin, and Permissions-Policy.",
        "Automated server.test.mjs verifies URL-encoded directory traversal (%2e%2e%2f) rejection, HTTP 416 range bounds, and HEAD/gzip.",
        "Zero cookies, zero third-party analytics beacons, and 100% offline-capable local fonts and media.",
      ],
      proofLabel: "Read llms.txt spec ↗",
      proofHref: publicUrl("llms.txt"),
    },
    {
      id: "handoff",
      code: "08",
      title: "Self-Operating Sync & Handoff",
      domain: "Single Source · MIT · Docs Sync",
      evidence: "static",
      summary:
        "Adding a skill, reference, or exhibit updates documentation, website counts, sitemaps, and test contracts automatically from one canonical source.",
      templateDefault:
        "Hardcoded marketing numbers that drift out of date the week after launch with opaque vendor lock-in.",
      engineeredStandard:
        "Deterministic sync-repo-data.mjs + capture-gallery.mjs + sync-docs.mjs pipeline with full MIT source ownership.",
      deliverables: [
        "sync-docs.mjs --check verifies README, ARCHITECTURE, website docs, and IDE manifests match live repo state on every commit.",
        "capture-gallery.mjs renders all 22 before/after pairs in headless Chromium and records exact slop-scan JSON findings.",
        "Standalone skill folders and zero-dependency Node >= 18 CLIs adoptable incrementally without framework lock-in.",
      ],
      proofLabel: "Configure installer ↓",
      proofHref: "#install",
    },
  ];

  const active = pillars.find((p) => p.id === activeId) ?? pillars[0];

  return (
    <section
      id="blueprint"
      aria-labelledby="blueprint-title"
      className="relative overflow-x-clip border-y border-line bg-deep/60"
    >
      <div className="mx-auto max-w-[88rem] px-4 py-16 sm:px-8 sm:py-24 lg:py-32">
        <SectionHead
          id="blueprint-title"
          kicker="Production engineering standard · 8 pillars"
          title="What separates engineered craft from a reskinned template."
        >
          <p>
            High-value software isn’t measured by page count. Inspect how
            strategy, design tokens, performance, technical SEO, accessibility,
            security, and automated QA are wired into this showcase and every
            exhibit.
          </p>
        </SectionHead>

        <div className="mt-10 grid min-w-0 gap-6 sm:mt-12 lg:grid-cols-12 lg:items-start">
          <div
            role="tablist"
            aria-label="Production engineering pillars"
            className="rail-scroll flex gap-2 pb-1 lg:col-span-4 lg:grid lg:gap-2 lg:overflow-visible lg:pb-0"
          >
            {pillars.map((p) => {
              const selected = p.id === active.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  id={`pillar-tab-${p.id}`}
                  aria-selected={selected}
                  aria-controls={`pillar-panel-${p.id}`}
                  onClick={() => setActiveId(p.id)}
                  className={`relative flex min-h-12 shrink-0 items-center justify-between gap-3 rounded-tile border px-4 py-3 text-start transition-colors lg:w-full motion-reduce:transition-none ${
                    selected
                      ? "border-action/60 text-ink"
                      : "border-line bg-void/60 text-ink-muted hover:border-line-strong hover:text-ink"
                  }`}
                >
                  {selected ? (
                    <motion.span
                      layoutId={
                        reducedMotion ? undefined : "blueprint-active-pill"
                      }
                      aria-hidden="true"
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 420, damping: 34 }
                      }
                      className="pointer-events-none absolute inset-0 rounded-tile bg-raised ring-1 ring-action/45"
                    />
                  ) : null}
                  <span className="relative z-10 flex min-w-0 items-center gap-3">
                    <span
                      className={`font-mono text-[0.75rem] font-semibold tabular ${
                        selected ? "text-action" : "text-ink-faint"
                      }`}
                    >
                      {p.code}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[0.9375rem] font-semibold">
                        {p.title}
                      </span>
                      <span className="hidden truncate font-mono text-[0.6875rem] text-ink-faint sm:block">
                        {p.domain}
                      </span>
                    </span>
                  </span>
                  <PixelIcon
                    name="arrow"
                    size={11}
                    className={`relative z-10 hidden shrink-0 lg:block ${
                      selected ? "text-action" : "text-ink-faint"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`pillar-panel-${active.id}`}
            aria-labelledby={`pillar-tab-${active.id}`}
            className="min-w-0 lg:col-span-8"
          >
            <PixelFrame
              lit
              innerClassName="p-5 sm:p-8 flex flex-col gap-6 bg-void/90"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-5">
                <div className="min-w-0">
                  <p className="font-mono text-[0.75rem] text-action uppercase">
                    Pillar {active.code} · {active.domain}
                  </p>
                  <h3 className="mt-1.5 display-wide text-[clamp(1.45rem,2.5vw,2.1rem)] leading-tight">
                    {active.title}
                  </h3>
                </div>
                <EvidenceStamp label={active.evidence} />
              </div>

              <p className="max-w-[64ch] text-[1rem] leading-relaxed text-ink-muted">
                {active.summary}
              </p>

              <div className="grid min-w-0 gap-4 md:grid-cols-2">
                <div className="rounded-tile border border-line bg-deep p-4">
                  <p className="font-mono text-[0.6875rem] font-semibold text-p1 uppercase">
                    Commodity template shortcut
                  </p>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">
                    {active.templateDefault}
                  </p>
                </div>
                <div className="rounded-tile border border-action/40 bg-raised/70 p-4">
                  <p className="font-mono text-[0.6875rem] font-semibold text-action uppercase">
                    Engineered production standard
                  </p>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-ink">
                    {active.engineeredStandard}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-mono text-[0.75rem] font-semibold text-ink-faint uppercase">
                  Shipped implementation in this repository
                </h4>
                <ul className="mt-3 grid gap-2.5 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {active.deliverables.map((item) => (
                    <li key={item} className="flex items-baseline gap-2.5">
                      <span
                        aria-hidden="true"
                        className="font-mono text-xs text-action"
                      >
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                <span className="font-mono text-[0.75rem] text-ink-faint">
                  0 cookies · 0 trackers · 100% source-verifiable
                </span>
                {active.proofAction ? (
                  <button
                    type="button"
                    onClick={active.proofAction}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full bg-action px-4 font-mono text-[0.8125rem] font-semibold text-on-action transition-colors hover:bg-ink motion-reduce:transition-none"
                  >
                    <PixelIcon name="search" size={12} />
                    {active.proofLabel}
                  </button>
                ) : active.proofHref ? (
                  <a
                    href={active.proofHref}
                    target={
                      active.proofHref.startsWith("#") ? undefined : "_blank"
                    }
                    rel={
                      active.proofHref.startsWith("#")
                        ? undefined
                        : "noreferrer"
                    }
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-action/50 bg-panel px-4 font-mono text-[0.8125rem] font-semibold text-action transition-colors hover:bg-action hover:text-on-action motion-reduce:transition-none"
                  >
                    {active.proofLabel}
                  </a>
                ) : null}
              </div>
            </PixelFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
