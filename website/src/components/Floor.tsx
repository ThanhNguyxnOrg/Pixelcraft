import { EVIDENCE, FLOOR } from "../data";
import {
  EvidenceStamp,
  PixelLabel,
  Reveal,
  SectionHead,
  SpotTile,
} from "./pixel";

export function Floor() {
  return (
    <section id="floor" aria-labelledby="floor-title" className="relative">
      <div className="mx-auto max-w-[88rem] px-5 py-24 sm:px-8 lg:py-36">
        <SectionHead
          id="floor-title"
          kicker="pixelcraft · floor.md"
          title="The floor is not a style. It is the minimum."
        >
          <p>
            Ten constraints apply on every surface unless the user waives a
            scoped item. The floor never mandates a hero, a card, a palette, a
            typeface, or a radius. It constrains quality, not appearance.
          </p>
        </SectionHead>

        <ol className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {FLOOR.map((f, i) => (
            <SpotTile
              as="li"
              key={f.name}
              className={`rounded-card p-7 ${i < 2 || i > 7 ? "lg:col-span-3" : "lg:col-span-2"}`}
            >
              <div className="flex h-full min-h-40 flex-col">
                <span className="grid size-9 place-items-center rounded-full bg-white/8 font-pixel text-[0.75rem] text-ink-faint tabular transition-colors group-hover/spot:bg-action group-hover/spot:text-on-action motion-reduce:transition-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-auto pt-10 display-wide text-[1.375rem] leading-tight">
                  {f.name}
                </h3>
                <p className="mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink-muted">
                  {f.rule}
                </p>
              </div>
            </SpotTile>
          ))}
        </ol>

        <div id="evidence" className="mt-32 grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <PixelLabel>Evidence labels</PixelLabel>
            <h3
              data-split
              className="mt-6 max-w-[14ch] display-wide text-[clamp(2rem,4vw,3.25rem)] leading-[0.98]"
            >
              Five labels. No unlabeled claims.
            </h3>
            <p className="mt-6 max-w-[42ch] text-[1.0625rem] leading-relaxed text-ink-muted">
              A successful build, DOM presence, or page load is not evidence
              that visual or UX quality was inspected. Every finding in a
              Pixelcraft report carries exactly one of these. Each has its own
              glyph, so meaning never depends on color alone.
            </p>
          </Reveal>
          <dl className="grid gap-3 self-start lg:col-span-7">
            {EVIDENCE.map((e) => (
              <div
                key={e.id}
                data-reveal
                className="surface grid gap-3 rounded-tile px-6 py-5 sm:grid-cols-[11rem_1fr] sm:items-center"
              >
                <dt>
                  <EvidenceStamp
                    label={e.id}
                    className="px-3 py-1.5 text-[0.875rem]"
                  />
                </dt>
                <dd className="text-[1rem] leading-relaxed text-ink-muted">
                  {e.meaning}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
