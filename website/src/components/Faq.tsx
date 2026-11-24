import { FAQ } from "../data";
import { PixelIcon, SectionHead } from "./pixel";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-void">
      <div className="mx-auto max-w-[84rem] px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead
              id="faq-title"
              meta="Questions"
              title="What you should ask before installing."
            />
          </div>
          <div className="border-t border-line-strong lg:col-span-7">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="gallery-notes group border-b border-line"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-[1.0625rem] font-medium text-ink transition-colors hover:text-action motion-reduce:transition-none">
                  <span>{item.q}</span>
                  <PixelIcon
                    name="plus"
                    size={14}
                    className="text-ink-faint transition-transform duration-200 motion-reduce:transition-none"
                  />
                </summary>
                <p className="max-w-[58ch] pb-6 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
