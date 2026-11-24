import { useDeferredValue, useMemo, useState } from "react";
import {
  CATEGORIES,
  LANGUAGE_FILTERS,
  REPO_URL,
  SKILLS,
  type Category,
} from "../data";
import { PixelIcon, SectionHead } from "./pixel";

type Filter = Category | "All";

export function SkillIndex() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [lang, setLang] = useState<string>("All");
  const [open, setOpen] = useState<string | null>(null);
  const q = useDeferredValue(query.trim().toLowerCase());

  const activeLangTerms = useMemo(
    () =>
      LANGUAGE_FILTERS.find((item) => item.id === lang)?.terms.map((t) =>
        t.toLowerCase(),
      ) ?? [],
    [lang],
  );

  const rows = useMemo(
    () =>
      SKILLS.filter((s) => {
        if (filter !== "All" && s.category !== filter) return false;
        const haystack =
          `${s.name} ${s.purpose} ${s.references.join(" ")} ${(s.scripts ?? []).join(" ")}`.toLowerCase();
        if (
          activeLangTerms.length > 0 &&
          !activeLangTerms.some((term) => haystack.includes(term))
        ) {
          return false;
        }
        if (!q) return true;
        return haystack.includes(q);
      }),
    [q, filter, activeLangTerms],
  );

  const countFor = (c: Filter) =>
    c === "All" ? SKILLS.length : SKILLS.filter((s) => s.category === c).length;

  const clear = () => {
    setQuery("");
    setFilter("All");
    setLang("All");
  };

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="border-b border-line bg-void"
    >
      <div className="mx-auto max-w-[84rem] px-5 py-20 sm:px-8 lg:py-28">
        <SectionHead
          id="skills-title"
          meta={`${SKILLS.length} skills · self-contained folders`}
          title="One pack. Every surface and language an agent ships to."
        >
          <p>
            Filter by layer or programming language, or search any framework,
            library, or script name. Every skill installs independently and
            routes by exact name.
          </p>
        </SectionHead>

        <div className="mt-12 grid gap-5 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <label
              htmlFor="skill-search"
              className="font-mono text-[0.8125rem] text-ink-muted"
            >
              Search skills, frameworks, or scripts
            </label>
            <div className="surface mt-2 flex items-center rounded-full">
              <PixelIcon
                name="search"
                size={14}
                className="ms-3.5 text-ink-faint"
              />
              <input
                id="skill-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. ratatui, swiftui, filament, typst, wcag"
                autoComplete="off"
                spellCheck={false}
                className="min-h-11 w-full rounded-full bg-transparent px-3 font-mono text-[0.9375rem] text-ink placeholder:text-ink-faint focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-action"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="me-1.5 grid size-9 shrink-0 place-items-center rounded-full text-ink-muted hover:bg-raised hover:text-ink"
                >
                  <PixelIcon name="close" size={12} />
                </button>
              ) : null}
            </div>
          </div>

          <fieldset className="border-0 p-0 lg:col-span-7">
            <legend className="mb-2 font-mono text-[0.75rem] text-ink-faint">
              Filter by layer
            </legend>
            <div className="flex flex-wrap gap-2">
              {(["All", ...CATEGORIES.map((c) => c.id)] as Filter[]).map(
                (c) => {
                  const selected = filter === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setFilter(c)}
                      className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 font-mono text-[0.8125rem] transition-colors duration-150 motion-reduce:transition-none ${
                        selected
                          ? "border-action bg-action text-on-action"
                          : "border-line text-ink hover:border-action hover:bg-panel"
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

        <fieldset className="mt-5 border-0 p-0">
          <legend className="mb-2 font-mono text-[0.75rem] text-ink-faint">
            Filter by language ecosystem
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {LANGUAGE_FILTERS.map((item) => {
              const selected = lang === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setLang(item.id)}
                  className={`min-h-9 rounded-full border px-3 font-mono text-[0.75rem] transition-colors duration-150 motion-reduce:transition-none ${
                    selected
                      ? "border-action bg-raised text-action"
                      : "border-line/80 text-ink-muted hover:border-action hover:text-ink"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <p
          className="mt-8 font-mono text-[0.8125rem] text-ink-faint tabular"
          aria-live="polite"
        >
          {rows.length === SKILLS.length
            ? `Showing all ${rows.length} skills`
            : `${rows.length} of ${SKILLS.length} skills match`}
          {filter !== "All"
            ? ` · ${CATEGORIES.find((c) => c.id === filter)?.blurb}`
            : ""}
        </p>

        <ul className="mt-3 border-t border-line-strong">
          {rows.map((s) => {
            const expanded = open === s.name;
            const panelId = `refs-${s.name}`;
            return (
              <li key={s.name} className="border-b border-line">
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => setOpen(expanded ? null : s.name)}
                  className="group grid w-full grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-2 rounded-tile py-4 text-start transition-colors hover:bg-panel/60 aria-expanded:bg-panel/70 sm:px-4 lg:grid-cols-[15rem_1fr_8rem_auto] motion-reduce:transition-none"
                >
                  <code className="text-[0.9375rem] font-medium text-ink group-hover:text-action">
                    {s.name}
                  </code>
                  <span className="row-start-2 text-[0.9375rem] leading-relaxed text-ink-muted lg:row-start-auto">
                    {s.purpose}
                  </span>
                  <span className="hidden font-mono text-[0.75rem] text-ink-faint tabular lg:block">
                    {s.references.length} refs
                    {s.scripts ? ` · ${s.scripts.length} scripts` : ""}
                  </span>
                  <span className="col-start-2 row-start-1 flex items-center gap-2.5 font-mono text-[0.75rem] text-ink-faint lg:col-start-auto lg:row-start-auto">
                    <span className="hidden uppercase xl:inline">
                      {s.category}
                    </span>
                    <PixelIcon
                      name={expanded ? "minus" : "plus"}
                      size={12}
                      className="text-ink-muted"
                    />
                  </span>
                </button>
                {expanded ? (
                  <div
                    id={panelId}
                    className="grid gap-4 px-2 pb-5 sm:px-4 lg:grid-cols-[15rem_1fr]"
                  >
                    <p className="font-mono text-[0.75rem] text-ink-faint">
                      skills/{s.name}/
                    </p>
                    <div>
                      <ul className="flex flex-wrap gap-1.5">
                        {s.references.map((r) => (
                          <li key={r}>
                            <code
                              className={`inline-block rounded-full border px-2.5 py-0.5 text-[0.75rem] ${
                                q && r.toLowerCase().includes(q)
                                  ? "border-action text-action"
                                  : "border-line text-ink-muted"
                              }`}
                            >
                              {r}.md
                            </code>
                          </li>
                        ))}
                        {s.scripts?.map((r) => (
                          <li key={r}>
                            <code className="inline-block rounded-full border border-static px-2.5 py-0.5 text-[0.75rem] text-static">
                              scripts/{r}
                            </code>
                          </li>
                        ))}
                      </ul>
                      <a
                        href={`${REPO_URL}/tree/main/skills/${s.name}`}
                        className="mt-4 inline-flex items-center gap-1.5 font-mono text-[0.8125rem] text-ink underline decoration-line-strong underline-offset-4 hover:decoration-action"
                      >
                        Open SKILL.md for {s.name}
                        <PixelIcon name="external" size={10} />
                      </a>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>

        {rows.length === 0 ? (
          <div className="border-b border-line py-10">
            <p className="text-[1rem] text-ink">
              No skill matches <code className="text-action">“{query}”</code>
              {lang !== "All" ? ` in ${lang}` : ""}
              {filter !== "All" ? ` (${filter})` : ""}.
            </p>
            <p className="mt-2 max-w-[54ch] text-[0.9375rem] text-ink-muted">
              Try clearing a filter or searching by surface type (mobile,
              desktop, tui, document, email, game, data).
            </p>
            <button
              type="button"
              onClick={clear}
              className="surface mt-4 inline-flex min-h-11 items-center gap-2 rounded-full px-5 font-mono text-[0.8125rem] text-ink hover:border-action hover:text-action"
            >
              <PixelIcon name="reset" size={12} />
              Clear search and filters
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
