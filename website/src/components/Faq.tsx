import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { FAQ } from "../data";
import { PixelIcon, PixelLabel, Reveal } from "./pixel";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative">
      <div className="mx-auto max-w-[88rem] px-5 py-24 sm:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <PixelLabel>Questions</PixelLabel>
            <h2
              id="faq-title"
              data-split
              className="mt-6 max-w-[10ch] display-wide text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[0.96]"
            >
              What people ask first.
            </h2>
            <p className="mt-6 max-w-[34ch] text-[1rem] leading-relaxed text-ink-muted">
              Answers come from the repo’s own README and skill files.
            </p>
          </Reveal>
          <ul className="grid gap-3 self-start lg:col-span-8">
            {FAQ.map((f, i) => {
              const expanded = open === i;
              return (
                <li
                  key={f.q}
                  className={`rounded-tile transition-colors duration-200 motion-reduce:transition-none ${expanded ? "surface-lit" : "surface"}`}
                >
                  <h3>
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={`faq-${i}`}
                      onClick={() => setOpen(expanded ? null : i)}
                      className="flex min-h-16 w-full items-center justify-between gap-6 rounded-tile px-6 py-4 text-start"
                    >
                      <span className="display-wide text-[1.0625rem] leading-snug sm:text-[1.1875rem]">
                        {f.q}
                      </span>
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-full transition-[transform,background-color] duration-200 motion-reduce:transition-none ${expanded ? "rotate-180 bg-action text-on-action" : "bg-white/8"}`}
                      >
                        <PixelIcon name="chevron" size={14} />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {expanded ? (
                      <motion.div
                        id={`faq-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[62ch] px-6 pb-6 text-[1rem] leading-relaxed text-ink-muted">
                          {f.a}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
