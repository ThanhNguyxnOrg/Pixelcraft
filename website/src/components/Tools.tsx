import {
  COMMANDS,
  GALLERY,
  GATE_EXITS,
  SCAN_RULES,
  SHOOT_BREAKPOINTS,
  TOKEN_FORMATS,
  TOOLS,
} from "../data";
import { PixelIcon, SectionHead, SpotTile } from "./pixel";

const SEV: Record<string, string> = {
  P0: "text-p0",
  P1: "text-p1",
  P2: "text-p2",
  P3: "text-p3",
};
const scan = GALLERY[0].scanBefore;

// Output of `export-tokens.mjs ... --format css` on assets/tokens.example.json (first lines).
const TOKEN_SAMPLE = [
  ":root {",
  "  --color-brand: oklch(0.55 0.16 250);",
  "  --color-ink: oklch(0.22 0.02 265);",
  "  --space-base: 4px;",
  "  --radius-medium: 10px;",
  "  --motion-duration-fast: 120ms;",
  "}",
];

function Head({ i }: { i: number }) {
  const t = TOOLS[i];
  return (
    <div>
      <p className="font-pixel text-[0.6875rem] tracking-[0.06em] text-action uppercase">
        {t.file}
      </p>
      <p className="mt-3 max-w-[48ch] text-[0.9375rem] leading-relaxed text-ink-muted">
        {t.blurb}
      </p>
      <code className="mt-4 block w-fit max-w-full overflow-x-auto rounded-full bg-void/60 px-4 py-2 text-[0.75rem] whitespace-nowrap text-ink-muted">
        $ {t.command}
      </code>
    </div>
  );
}

export function Tools() {
  const device = (w: number, h: number) => {
    const k = 120 / 1440;
    return {
      width: Math.round(w * k * (w > 1000 ? 1 : 1.9)),
      height: Math.round(h * k * (w > 1000 ? 1 : 1.9)),
    };
  };
  return (
    <section id="tools" aria-labelledby="tools-title" className="relative">
      <div className="mx-auto max-w-[88rem] px-5 py-24 sm:px-8 lg:py-36">
        <SectionHead
          id="tools-title"
          kicker="Scripts that actually run"
          title="Not just prose. Five tools you can execute."
        >
          <p>
            Skills are instructions, but five of them ship zero-dependency
            scripts. They are what turns “looks fine” into a number, a
            screenshot, or an exit code.
          </p>
        </SectionHead>

        <div className="mt-16 grid gap-3 lg:grid-cols-6">
          <SpotTile className="rounded-card p-7 sm:p-8 lg:col-span-4 lg:row-span-2">
            <div className="flex h-full flex-col gap-7">
              <Head i={0} />
              <div>
                <p className="font-mono text-[0.75rem] text-ink-faint">
                  real output on the default coffee page
                </p>
                <ul className="mt-3 grid gap-1.5">
                  {scan.findings.slice(0, 6).map((f, i) => (
                    <li
                      key={f.rule + i}
                      className="flex items-baseline gap-3 rounded-full bg-void/50 px-4 py-2 font-mono text-[0.8125rem]"
                    >
                      <span className={`${SEV[f.severity]} w-6`}>
                        {f.severity}
                      </span>
                      <span className="text-ink">{f.rule}</span>
                      <span className="ms-auto text-ink-faint tabular">
                        before.html:{f.line}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto">
                <p className="font-mono text-[0.75rem] text-ink-faint">
                  {SCAN_RULES.length} rule IDs
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {SCAN_RULES.map((r) => (
                    <li
                      key={r}
                      className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[0.6875rem] text-ink-muted"
                    >
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SpotTile>

          <SpotTile className="rounded-card p-7 lg:col-span-2">
            <Head i={1} />
            <div className="mt-6 flex items-end gap-4">
              {SHOOT_BREAKPOINTS.map((b) => {
                const d = device(b.w, b.h);
                return (
                  <figure
                    key={b.label}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      style={d}
                      className="rounded-[10px] border-2 border-action/70 bg-action/8"
                    />
                    <figcaption className="text-center font-mono text-[0.6875rem] leading-tight text-ink-faint">
                      {b.label}
                      <span className="block tabular">
                        {b.w}×{b.h}
                      </span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </SpotTile>

          <SpotTile className="rounded-card p-7 lg:col-span-2">
            <Head i={3} />
            <ul className="mt-6 grid gap-2">
              {GATE_EXITS.map((g) => (
                <li
                  key={g.code}
                  className="flex items-center gap-3 rounded-full bg-void/50 px-4 py-2.5 font-mono text-[0.8125rem]"
                >
                  <span className="grid size-6 place-items-center rounded-full bg-white/10 text-[0.75rem] tabular">
                    {g.code}
                  </span>
                  <span className="text-ink">{g.label}</span>
                </li>
              ))}
            </ul>
          </SpotTile>

          <SpotTile className="rounded-card p-7 sm:p-8 lg:col-span-3">
            <Head i={4} />
            <pre className="mt-6 overflow-x-auto rounded-tile bg-void/60 p-5 text-[0.8125rem] leading-relaxed text-ink-muted">
              <code>{TOKEN_SAMPLE.join("\n")}</code>
            </pre>
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {TOKEN_FORMATS.map((f) => (
                <li
                  key={f}
                  className="rounded-full bg-action/10 px-3 py-1 font-mono text-[0.75rem] text-action"
                >
                  {f}
                </li>
              ))}
            </ul>
          </SpotTile>

          <SpotTile className="rounded-card p-7 sm:p-8 lg:col-span-3">
            <Head i={2} />
            <ul className="mt-6 grid grid-cols-2 gap-2">
              {[
                "Type sizes and families",
                "Color groups",
                "Estimated geometry",
                "Motion signals",
                "Payload",
                "Two breakpoints",
              ].map((m) => (
                <li
                  key={m}
                  className="flex items-center gap-2.5 rounded-full bg-void/50 px-4 py-2.5 text-[0.8125rem] text-ink-muted"
                >
                  <PixelIcon name="check" size={11} className="text-action" />
                  {m}
                </li>
              ))}
            </ul>
          </SpotTile>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-12 lg:items-center">
          <div className="min-w-0 lg:col-span-4">
            <p className="font-pixel text-[0.75rem] tracking-[0.06em] text-ink-faint uppercase">
              Installed for Claude Code
            </p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
              The installer adds four slash commands next to the skills.
            </p>
          </div>
          <ul className="grid min-w-0 gap-3 sm:grid-cols-2 lg:col-span-8">
            {COMMANDS.map((c) => (
              <li
                key={c.cmd}
                className="surface flex min-w-0 flex-col items-start gap-3 rounded-tile p-4 xl:flex-row xl:items-center xl:gap-4 xl:rounded-full"
              >
                <code className="rounded-full bg-action px-4 py-2 text-[0.8125rem] font-medium whitespace-nowrap text-on-action">
                  {c.cmd}
                </code>
                <span className="text-[0.875rem] leading-snug text-ink-muted">
                  {c.does}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
