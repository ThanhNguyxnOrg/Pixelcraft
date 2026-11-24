import { AnimatePresence, motion } from "motion/react";
import { useDeferredValue, useMemo, useState } from "react";
import { CATEGORIES, REPO_URL, SKILLS, type Category } from "../data";
import { PixelIcon, SectionHead } from "./pixel";

type Filter = Category | "All";

export function SkillIndex() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [open, setOpen] = useState<string | null>(null);
  const q = useDeferredValue(query.trim().toLowerCase());

  const rows = useMemo(
    () =>
      SKILLS.filter((s) => {
        if (filter !== "All" && s.category !== filter) return false;
        if (!q) return true;
        return (
          s.name.includes(q) ||
          s.purpose.toLowerCase().includes(q) ||
          s.references.some((r) => r.includes(q))
        );
      }),
    [q, filter],
  );

  const countFor = (c: Filter) =>
    c === "All" ? SKILLS.length : SKILLS.filter((s) => s.category === c).length;
  const clear = () => {
    setQuery("");
    setFilter("All");
  };

  return (
    <section id="skills" aria-labelledby="skills-title" className="relative">
      <div className="mx-auto max-w-[88rem] px-5 py-20 sm:px-8 lg:py-28">
        <SectionHead
          id="skills-title"
          kicker={`${SKILLS.length} skills · self-contained folders`}
          title="One pack. Every surface an agent ships to."
        >
          <p>
            Each skill installs independently and is routed by name from the
            orchestrator. Search a framework you use: the index matches skill
            names, purposes, and reference files.
          </p>
        </SectionHead>

        <div className="mt-14 grid gap-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <label
              htmlFor="skill-search"
              className="font-mono text-[0.8125rem] text-ink-muted"
            >
              Search skills and references
            </label>
            <div className="surface mt-2 flex items-center rounded-full ring-action/0 transition-shadow focus-within:ring-2 focus-within:ring-action motion-reduce:transition-none">
              <PixelIcon
                name="search"
                size={14}
                className="ms-3 text-ink-faint"
              />
              <input
                id="skill-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. flutter, tokens, wcag"
                autoComplete="off"
                spellCheck={false}
                className="min-h-11 w-full bg-transparent px-3 font-mono text-[0.9375rem] text-ink placeholder:text-ink-faint focus:outline-none"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="me-1.5 grid size-9 place-items-center rounded-full text-ink-muted hover:bg-white/10 hover:text-ink"
                >
                  <PixelIcon name="close" size={12} />
                </button>
              ) : null}
            </div>
          </div>

          <fieldset className="lg:col-span-7">
            <legend className="sr-only">Filter by group</legend>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {(["All", ...CATEGORIES.map((c) => c.id)] as Filter[]).map(
                (c) => {
                  const selected = filter === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setFilter(c)}
                      className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 font-mono text-[0.8125rem] transition-colors duration-150 motion-reduce:transition-none ${
                        selected
                          ? "border-action bg-action text-on-action"
                          : "border-white/12 text-ink hover:border-white/30 hover:bg-white/6"
                      }`}
                    >
                      {c}
                      <span
                        className={`tabular ${selected ? "text-on-action" : "text-ink-faint"}`}
                      >
                        {countFor(c)}
                      </span>
                    </button>
                  );
                },
              )}
            </div>
          </fieldset>
        </div>

        <p
          className="mt-8 font-mono text-[0.8125rem] text-ink-faint tabular"
          aria-live="polite"
        >
          {rows.length === SKILLS.length
            ? `Showing all ${rows.length}`
            : `${rows.length} of ${SKILLS.length} skills match`}
          {filter !== "All"
            ? ` · ${CATEGORIES.find((c) => c.id === filter)?.blurb}`
            : ""}
        </p>

        <ul className="mt-3 border-t border-line-strong">
          <AnimatePresence initial={false}>
            {rows.map((s) => {
              const expanded = open === s.name;
              const panelId = `refs-${s.name}`;
              return (
                <motion.li
                  key={s.name}
                  layout="position"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16 }}
                  className="border-b border-line"
                >
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setOpen(expanded ? null : s.name)}
                    className="group relative grid w-full grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-2 py-5 text-start before:absolute before:inset-y-4 before:start-1.5 before:w-[3px] before:rounded-full before:bg-action before:opacity-0 hover:bg-white/5 hover:before:opacity-100 aria-expanded:bg-white/5 aria-expanded:before:opacity-100 rounded-tile sm:px-5 md:grid-cols-[18rem_1fr_7rem_auto]"
                  >
                    <code className="text-[1rem] font-medium text-ink group-hover:text-action">
                      {s.name}
                    </code>
                    <span className="row-start-2 text-[0.9375rem] leading-relaxed text-ink-muted md:row-start-auto">
                      {s.purpose}
                    </span>
                    <span className="hidden font-mono text-[0.8125rem] text-ink-faint tabular md:block">
                      {s.references.length} refs
                      {s.scripts ? ` · ${s.scripts.length} js` : ""}
                    </span>
                    <span className="col-start-2 row-start-1 flex items-center gap-2 font-mono text-[0.75rem] text-ink-faint md:col-start-auto md:row-start-auto">
                      <span className="hidden font-pixel text-[0.6875rem] uppercase lg:inline">
                        {s.category}
                      </span>
                      <PixelIcon
                        name={expanded ? "minus" : "plus"}
                        size={12}
                        className="text-ink-muted"
                      />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {expanded ? (
                      <motion.div
                        id={panelId}
                        key="refs"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-4 pb-6 sm:px-3 md:grid-cols-[18rem_1fr]">
                          <p className="font-mono text-[0.75rem] text-ink-faint">
                            skills/{s.name}/references/
                          </p>
                          <div>
                            <ul className="flex flex-wrap gap-2">
                              {s.references.map((r) => (
                                <li key={r}>
                                  <code
                                    className={`inline-block rounded-full border px-3 py-1 text-[0.8125rem] ${
                                      q && r.includes(q)
                                        ? "border-action text-action"
                                        : "border-white/12 text-ink-muted"
                                    }`}
                                  >
                                    {r}.md
                                  </code>
                                </li>
                              ))}
                              {s.scripts?.map((r) => (
                                <li key={r}>
                                  <code className="inline-block rounded-full border border-static px-3 py-1 text-[0.8125rem] text-static">
                                    {r}
                                  </code>
                                </li>
                              ))}
                            </ul>
                            <a
                              href={`${REPO_URL}/tree/main/skills/${s.name}`}
                              className="mt-4 inline-flex items-center gap-2 text-[0.875rem] text-ink underline decoration-line-strong underline-offset-4 hover:decoration-action"
                            >
                              Open SKILL.md for {s.name}
                              <PixelIcon name="external" size={10} />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>

        {rows.length === 0 ? (
          <div className="border-b border-line py-12">
            <p className="text-[1.0625rem] text-ink">
              No skill matches <code className="text-action">“{query}”</code>
              {filter !== "All" ? ` in ${filter}` : ""}.
            </p>
            <p className="mt-2 max-w-[56ch] text-ink-muted">
              Pixelcraft may still cover it through a neighbouring reference.
              For an unlisted stack, the planning skill records it as a manual
              translation.
            </p>
            <button
              type="button"
              onClick={clear}
              className="surface mt-5 inline-flex min-h-11 items-center gap-2 rounded-full px-5 font-mono text-[0.8125rem] hover:bg-white/10"
            >
              <PixelIcon name="reset" size={12} />
              Clear search and filter
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
