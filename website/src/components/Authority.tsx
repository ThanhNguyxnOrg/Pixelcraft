import { AUTHORITY } from "../data";
import { PixelIcon, PixelLabel, Reveal } from "./pixel";

// One hue per rank, taken from the brand palette. Rank 5 is deliberately the quietest.
const HUE = [
  "var(--color-glow-cyan)",
  "var(--color-glow-blue)",
  "var(--color-glow-orchid)",
  "var(--color-glow-magenta)",
  "var(--color-glow-orange)",
];

export function Authority() {
  return (
    <section
      id="authority"
      aria-labelledby="authority-title"
      className="relative"
    >
      <div className="mx-auto max-w-[88rem] px-5 py-24 sm:px-8 lg:py-36">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <PixelLabel>Authority order</PixelLabel>
            <h2
              id="authority-title"
              data-split
              className="mt-6 max-w-[14ch] display-wide text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.96]"
            >
              A guest in your project.
            </h2>
            <p className="mt-6 max-w-[44ch] text-[1.0625rem] leading-relaxed text-ink-muted">
              Pixelcraft applies five constraints in order and stops at the
              first conflict. It never overrides your decision because it
              resembles a common pattern. It flags the conflict instead.
            </p>
            <p className="surface mt-8 inline-flex max-w-[44ch] items-start gap-3 rounded-tile p-5 text-[0.9375rem] leading-relaxed text-ink-muted">
              <PixelIcon name="check" size={16} className="mt-1 text-action" />
              <span>
                <span className="text-ink">
                  Already have an approved design?
                </span>{" "}
                Then it does not diverge. The handoff skill keeps your layout,
                hierarchy, and tokens, and only fills what is undecided.
              </span>
            </p>
          </Reveal>

          <ol className="grid gap-3 lg:col-span-7">
            {AUTHORITY.map((a, i) => (
              <li
                key={a.rank}
                data-reveal
                className="surface relative flex items-center gap-5 overflow-hidden rounded-card p-5 pe-7 sm:p-6 lg:ms-[var(--ms)]"
                style={{ ["--ms" as string]: `${i * 2.25}%` }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 start-0 w-1.5"
                  style={{ background: HUE[i], opacity: 1 - i * 0.14 }}
                />
                <span
                  className="grid size-12 shrink-0 place-items-center rounded-full font-pixel text-[1rem] text-void"
                  style={{ background: HUE[i], opacity: 1 - i * 0.12 }}
                >
                  {a.rank}
                </span>
                <div className="min-w-0">
                  <p className="display-wide text-[1.375rem] leading-tight">
                    {a.name}
                  </p>
                  <p className="mt-1 text-[0.9375rem] leading-snug text-ink-muted">
                    {a.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
