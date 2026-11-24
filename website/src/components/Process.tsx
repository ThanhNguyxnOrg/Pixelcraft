import {
  AUTHORITY,
  EVIDENCE,
  FLOOR,
  PHASES,
  THIS_PAGE_DIRECTIONS,
} from "../data";
import { EvidenceStamp, PixelIcon, SectionHead } from "./pixel";

const MAX_SCORE = 28;

export function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="border-b border-line bg-void"
    >
      <div className="mx-auto max-w-[84rem] px-5 py-20 sm:px-8 lg:py-28">
        <SectionHead
          id="process-title"
          meta="The Pixelcraft loop · 7 phases"
          title="A disciplined loop, not a one-line prompt slogan."
        >
          <p>
            Every phase carries a concrete artifact and exit gate — from
            codebase-first Grill-Me discovery and pre-code design approval to
            cross-platform verification.
          </p>
        </SectionHead>

        <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PHASES.map((p, i) => (
            <li
              key={p.id}
              className={`surface flex flex-col rounded-card p-6 ${
                i === 0 ? "md:col-span-2" : ""
              }`}
            >
              <p className="font-mono text-[0.75rem] text-action tabular">
                PHASE {String(i).padStart(2, "0")}
              </p>
              <h3 className="mt-2 display-wide text-[1.5rem] leading-tight text-ink">
                {p.name}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                {p.does}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.skills.map((s) => (
                  <code
                    key={s}
                    className="rounded-full border border-line/80 bg-void/70 px-2.5 py-0.5 text-[0.75rem] text-ink"
                  >
                    {s}
                  </code>
                ))}
              </div>
              <div className="mt-auto pt-5">
                <p className="border-t border-line/70 pt-3 font-mono text-[0.75rem] text-ink-faint">
                  Gate: <span className="text-ink-muted">{p.gate}</span>
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-20 grid gap-12 border-t border-line pt-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-[0.8125rem] text-action">
              Authority order
            </p>
            <h3 className="mt-2 display-wide text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.04]">
              A guest in your project.
            </h3>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-muted">
              Pixelcraft applies five constraints in strict order and stops at
              the first conflict. If you already have an approved design,{" "}
              <code className="text-ink">pixelcraft-handoff</code> preserves it
              instead of diverging.
            </p>
            <ol className="mt-6 grid gap-2.5">
              {AUTHORITY.map((a) => (
                <li
                  key={a.rank}
                  className="surface flex items-start gap-3.5 rounded-tile p-4"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-action font-mono text-[0.75rem] font-bold text-on-action tabular">
                    {a.rank}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{a.name}</p>
                    <p className="mt-0.5 text-[0.875rem] leading-snug text-ink-muted">
                      {a.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-[0.8125rem] text-action">
                Direction divergence · applied to this site
              </p>
              <EvidenceStamp label="model-judgment" />
            </div>
            <h3 className="mt-2 display-wide text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.04]">
              Four candidates scored before code.
            </h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
              Illustrative editorial scorecard showing how conventional
              high-probability layouts are penalized against brief fit and brand
              continuity.
            </p>
            <ol className="mt-6 grid gap-3 sm:grid-cols-2">
              {THIS_PAGE_DIRECTIONS.map((d) => (
                <li
                  key={d.id}
                  className={`flex flex-col rounded-tile p-5 ${
                    d.won ? "surface-lit" : "surface"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[0.75rem]">
                    <span className={d.won ? "text-action" : "text-ink-faint"}>
                      Direction {d.id} · {d.won ? "Selected" : "Rejected"}
                    </span>
                    <span className="text-ink tabular">
                      {d.score}/{MAX_SCORE}
                    </span>
                  </div>
                  <p className="mt-2 text-[1.0625rem] font-bold text-ink">
                    {d.name}
                  </p>
                  <p className="mt-1 font-mono text-[0.75rem] text-ink-faint tabular">
                    p(conventional) = {d.p.toFixed(2)}
                  </p>
                  <p className="mt-3 border-t border-line/70 pt-3 text-[0.875rem] leading-relaxed text-ink-muted">
                    {d.verdict}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div id="floor" className="mt-20 border-t border-line pt-16">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-mono text-[0.8125rem] text-action">
                Mandatory floor · 10 non-negotiable rules
              </p>
              <h3 className="mt-2 display-wide text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.04]">
                Constrains quality, never appearance.
              </h3>
              <ol className="mt-6 grid gap-3 sm:grid-cols-2">
                {FLOOR.map((f, i) => (
                  <li key={f.name} className="surface rounded-tile p-4">
                    <p className="flex items-center gap-2 font-mono text-[0.75rem] text-action tabular">
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <span className="font-sans text-[0.9375rem] font-bold text-ink">
                        {f.name}
                      </span>
                    </p>
                    <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-muted">
                      {f.rule}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <div id="evidence" className="lg:col-span-5">
              <p className="font-mono text-[0.8125rem] text-action">
                Evidence labels
              </p>
              <h3 className="mt-2 display-wide text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.04]">
                No unlabeled claims.
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                Compiling is not visual proof. Every claim in a Pixelcraft
                report carries one of five labels, each paired with a distinct
                glyph.
              </p>
              <dl className="mt-6 grid gap-3">
                {EVIDENCE.map((e) => (
                  <div
                    key={e.id}
                    className="surface flex flex-col gap-2 rounded-tile p-4"
                  >
                    <dt>
                      <EvidenceStamp label={e.id} />
                    </dt>
                    <dd className="text-[0.875rem] leading-relaxed text-ink-muted">
                      {e.meaning}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 flex items-center gap-2 font-mono text-[0.75rem] text-ink-faint">
                <PixelIcon name="check" size={11} className="text-action" />
                Anti-laziness iron laws ban stubs, TODOs, and dead handlers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
