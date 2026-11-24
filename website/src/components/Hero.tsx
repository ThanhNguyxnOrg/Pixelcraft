import logoUrl from "../assets/pixelcraft-logo-256.png";
import {
  AGENT_TARGET_COUNT,
  GALLERY,
  LANGUAGE_PILLS,
  SKILLS,
  TOTAL_REFERENCES,
  TOTAL_SCRIPTS,
  VERSION,
} from "../data";
import { CopyCommand, PixelIcon } from "./pixel";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate border-b border-line bg-void"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-45 pixel-field [mask-image:radial-gradient(ellipse_at_75%_30%,black,transparent_72%)]"
      />

      <div className="mx-auto max-w-[84rem] px-5 pt-24 pb-16 sm:px-8 sm:pt-28 lg:pt-36 lg:pb-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="min-w-0 lg:col-span-8">
            <p className="font-mono text-[0.8125rem] text-action">
              Open-source Agent Skills · MIT · v{VERSION}
            </p>

            <h1
              id="hero-title"
              className="mt-4 max-w-[16ch] display-wide text-[clamp(2.35rem,5vw,4.5rem)] leading-[0.98] text-ink"
            >
              Agents build the average. Pixelcraft makes them diverge.
            </h1>

            <p className="mt-6 max-w-[52ch] text-[1.125rem] leading-relaxed text-ink-muted">
              A portable skill pack for coding agents across web, native mobile,
              desktop, terminal, document, email, data, spatial, and game
              stacks. It runs Socratic discovery before code, blocks lazy
              tech-stack defaults, enforces an accessibility floor, and verifies
              outcomes with runnable scripts.
            </p>

            <div className="mt-8 max-w-[38rem]">
              <CopyCommand
                variant="featured"
                lines={["npx skills add ThanhNguyxnOrg/Pixelcraft"]}
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <a
                href="#gallery"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 font-mono text-[0.8125rem] font-medium text-void transition-colors duration-150 hover:bg-action motion-reduce:transition-none"
              >
                Inspect {GALLERY.length} multi-stack proofs
                <PixelIcon name="arrow" size={12} />
              </a>
              <span className="font-mono text-[0.8125rem] text-ink-faint">
                Works across {AGENT_TARGET_COUNT} coding-agent hosts · Zero
                runtime deps
              </span>
            </div>
          </div>

          <aside
            aria-label="Pack specification summary"
            className="surface rounded-card p-6 lg:col-span-4"
          >
            <div className="flex items-center gap-4 border-b border-line pb-5">
              <img
                src={logoUrl}
                alt="Pixelcraft geometric pixel emblem"
                width={72}
                height={72}
                className="size-[72px] shrink-0"
              />
              <div className="min-w-0">
                <p className="font-pixel text-[0.8125rem] text-ink">
                  PIXELCRAFT PACK
                </p>
                <p className="mt-1 font-mono text-[0.75rem] text-ink-muted">
                  Zero runtime dependencies · Node &gt;= 18 · Self-contained
                  skills
                </p>
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3">
              {[
                [SKILLS.length, "self-contained skills"],
                [TOTAL_REFERENCES, "framework references"],
                [TOTAL_SCRIPTS, "runnable QA scripts"],
                [AGENT_TARGET_COUNT, "installer targets"],
              ].map(([n, label]) => (
                <div
                  key={label}
                  className="rounded-tile border border-line/70 bg-void/70 p-3.5"
                >
                  <dd className="display-wide text-[1.75rem] leading-none text-ink tabular">
                    {n}
                  </dd>
                  <dt className="mt-1.5 font-mono text-[0.75rem] text-ink-faint">
                    {label}
                  </dt>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        <div className="mt-12 border-t border-line pt-6">
          <ul
            aria-label="Supported language ecosystems"
            className="flex flex-wrap items-center gap-2"
          >
            <li className="me-2 font-mono text-[0.75rem] text-ink-faint">
              Multi-language surfaces:
            </li>
            {LANGUAGE_PILLS.map((lang) => (
              <li
                key={lang.label}
                className="rounded-full border border-line/80 bg-panel/70 px-3 py-1 font-mono text-[0.75rem] text-ink-muted"
              >
                {lang.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
