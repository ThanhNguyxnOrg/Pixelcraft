import {
  CLI_COMMANDS,
  COMMANDS,
  GALLERY,
  GATE_EXITS,
  SCAN_RULES,
  TOKEN_FORMATS,
  TOOLS,
  TOTAL_SCRIPTS,
} from "../data";
import { SectionHead } from "./pixel";

const SEV: Record<string, string> = {
  P0: "text-p0",
  P1: "text-p1",
  P2: "text-p2",
  P3: "text-p3",
};

const scan = GALLERY[0].scanBefore;

// Verbatim first lines of `export-tokens.mjs skills/pixelcraft-tokens/assets/tokens.example.json --format css`
const TOKEN_SAMPLE = [
  ":root {",
  "  --color-brand: oklch(0.55 0.16 250);",
  "  --color-ink: oklch(0.22 0.02 265);",
  "  --space-base: 4px;",
  "  --radius-medium: 10px;",
  "  --motion-duration-fast: 120ms;",
  "}",
];

export function Tools() {
  return (
    <section
      id="tools"
      aria-labelledby="tools-title"
      className="border-b border-line bg-deep"
    >
      <div className="mx-auto max-w-[84rem] px-5 py-20 sm:px-8 lg:py-28">
        <SectionHead
          id="tools-title"
          meta={`${TOTAL_SCRIPTS} zero-dependency Node.js scripts`}
          title="Not just prose. Cross-platform tools that actually run."
        >
          <p>
            Every script uses Node.js built-ins only and supports{" "}
            <code className="text-ink">--help</code>. Together they cover web,
            native mobile/desktop code, DTCG tokens, WCAG+APCA contrast, email,
            TUI, and PDF/UA checks.
          </p>
        </SectionHead>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <article
              key={t.id}
              className="surface flex flex-col rounded-card p-6"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[0.875rem] font-semibold text-action">
                  {t.file}
                </p>
                <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[0.6875rem] text-ink-faint">
                  {t.surface}
                </span>
              </div>
              <p className="mt-3 mb-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.blurb}
              </p>
              <code className="mt-auto block overflow-x-auto rounded-ctl border border-line/70 bg-void/80 px-3.5 py-2.5 text-[0.75rem] whitespace-nowrap text-ink-muted">
                $ {t.command}
              </code>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-12">
          <div className="surface rounded-card p-6 lg:col-span-6">
            <p className="font-mono text-[0.8125rem] font-semibold text-ink">
              Real slop-scan.mjs output on the default coffee page
            </p>
            <ul className="mt-4 grid gap-2">
              {scan.findings.slice(0, 5).map((f, i) => (
                <li
                  key={f.rule + i}
                  className="flex items-baseline gap-3 rounded-ctl border border-line/70 bg-void/70 px-3.5 py-2 font-mono text-[0.8125rem]"
                >
                  <span className={`${SEV[f.severity]} w-6 shrink-0`}>
                    {f.severity}
                  </span>
                  <span className="text-ink">{f.rule}</span>
                  <span className="ms-auto text-ink-faint tabular">
                    line {f.line}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 font-mono text-[0.75rem] text-ink-faint">
              {SCAN_RULES.length} deterministic rule families across Web,
              SwiftUI, Compose, Flutter, Rust, Python, Go, and more.
            </p>
          </div>

          <div className="surface rounded-card p-6 lg:col-span-6">
            <p className="font-mono text-[0.8125rem] font-semibold text-ink">
              export-tokens.mjs · {TOKEN_FORMATS.length} cross-platform targets
            </p>
            <pre className="mt-4 overflow-x-auto rounded-ctl border border-line/70 bg-void/80 p-4 text-[0.8125rem] leading-relaxed text-ink-muted">
              <code>{TOKEN_SAMPLE.join("\n")}</code>
            </pre>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {TOKEN_FORMATS.map((f) => (
                <li
                  key={f}
                  className="rounded-full border border-line bg-void/70 px-2.5 py-0.5 font-mono text-[0.75rem] text-action"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <div className="surface rounded-card p-6 lg:col-span-5">
            <p className="font-mono text-[0.8125rem] font-semibold text-ink">
              finish-gate.mjs exit codes
            </p>
            <ul className="mt-4 grid gap-2">
              {GATE_EXITS.map((g) => (
                <li
                  key={g.code}
                  className="flex items-center gap-3 rounded-ctl border border-line/70 bg-void/70 px-3.5 py-2 font-mono text-[0.8125rem]"
                >
                  <span className="grid size-6 place-items-center rounded-full bg-raised text-[0.75rem] text-action tabular">
                    {g.code}
                  </span>
                  <span className="text-ink">{g.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface rounded-card p-6 lg:col-span-7">
            <p className="font-mono text-[0.8125rem] font-semibold text-ink">
              pixelcraft CLI &amp; Claude slash commands
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {CLI_COMMANDS.map((c) => (
                <li
                  key={c.cmd}
                  className="rounded-ctl border border-line/70 bg-void/70 p-3"
                >
                  <code className="text-[0.8125rem] font-semibold text-action">
                    {c.cmd}
                  </code>
                  <p className="mt-1 text-[0.8125rem] text-ink-muted">
                    {c.does}
                  </p>
                </li>
              ))}
              {COMMANDS.slice(0, 2).map((c) => (
                <li
                  key={c.cmd}
                  className="rounded-ctl border border-line/70 bg-void/70 p-3"
                >
                  <code className="text-[0.8125rem] font-semibold text-ink">
                    {c.cmd}
                  </code>
                  <p className="mt-1 text-[0.8125rem] text-ink-muted">
                    {c.does}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
