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

/** Extracts the concise lead capability sentence so collapsed rows scan cleanly instead of dumping raw YAML trigger lists. */
function leadSummary(purpose: string): string {
  const idx = purpose.search(/\s+(?:Use when|Use for|Triggers on)\b/i);
  const head = idx > 0 ? purpose.slice(0, idx) : purpose;
  if (head.length <= 160) return head;
  const dot = head.indexOf(". ");
  if (dot > 24 && dot <= 170) return head.slice(0, dot + 1);
  const comma = head.lastIndexOf(",", 155);
  if (comma > 60) return `${head.slice(0, comma)}.`;
  const space = head.lastIndexOf(" ", 155);
  return `${head.slice(0, space > 40 ? space : 152)}…`;
}

export function SkillIndex() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [lang, setLang] = useState<string>("All");
  const [open, setOpen] = useState<string | null>(null);
  const [showAllMobile, setShowAllMobile] = useState(false);
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

  const isFiltered = Boolean(q) || filter !== "All" || lang !== "All";

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="border-b border-line bg-void"
    >
      <div className="mx-auto max-w-[84rem] px-4 py-16 sm:px-8 sm:py-20 lg:py-28">
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

        <div className="mt-10 grid min-w-0 gap-5 sm:mt-12 lg:grid-cols-12 lg:items-end">
          <div className="min-w-0 lg:col-span-5">
            <label
              htmlFor="skill-search"
              className="font-mono text-[0.8125rem] font-medium text-ink-muted"
            >
              Search skills, frameworks, or scripts
            </label>
            <div className="surface mt-2 flex items-center rounded-full">
              <PixelIcon
                name="search"
                size={14}
                className="ms-4 text-ink-faint"
              />
              <input
                id="skill-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. ratatui, swiftui, compose, typst, wcag"
                autoComplete="off"
                spellCheck={false}
                className="min-h-11 w-full min-w-0 rounded-full bg-transparent px-3 font-mono text-[0.9375rem] text-ink placeholder:text-ink-faint focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-action"
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

          <fieldset className="min-w-0 border-0 p-0 lg:col-span-7">
            <legend className="mb-2 font-mono text-[0.75rem] font-medium text-ink-faint">
              Filter by layer
            </legend>
            <div className="rail-scroll flex items-center gap-2 pb-1 sm:flex-wrap sm:pb-0">
              {(["All", ...CATEGORIES.map((c) => c.id)] as Filter[]).map(
                (c) => {
                  const selected = filter === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setFilter(c)}
                      className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-3.5 font-mono text-[0.8125rem] font-medium transition-colors duration-150 motion-reduce:transition-none ${
                        selected
                          ? "border-action bg-action text-on-action"
                          : "border-line bg-panel text-ink hover:border-action"
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

        <fieldset className="mt-4 min-w-0 border-0 p-0 sm:mt-5">
          <legend className="mb-2 font-mono text-[0.75rem] font-medium text-ink-faint">
            Filter by language ecosystem
          </legend>
          <div className="rail-scroll flex items-center gap-1.5 pb-1 sm:flex-wrap sm:pb-0">
            {LANGUAGE_FILTERS.map((item) => {
              const selected = lang === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setLang(item.id)}
                  className={`min-h-9 shrink-0 rounded-full border px-3 font-mono text-[0.75rem] font-medium transition-colors duration-150 motion-reduce:transition-none ${
                    selected
                      ? "border-action bg-raised text-action"
                      : "border-line bg-deep text-ink-muted hover:border-action hover:text-ink"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <p
          className="mt-7 font-mono text-[0.8125rem] text-ink-faint tabular"
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
          {rows.map((s, idx) => {
            const expanded = open === s.name;
            const panelId = `refs-${s.name}`;
            const hiddenOnMobile =
              !isFiltered && !showAllMobile && idx >= 8 && !expanded;
            return (
              <li
                key={s.name}
                className={`${hiddenOnMobile ? "hidden sm:block" : "block"} border-b border-line`}
              >
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => setOpen(expanded ? null : s.name)}
                  className="group grid w-full min-w-0 grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 rounded-tile px-2 py-3.5 text-start transition-colors hover:bg-panel aria-expanded:bg-panel sm:px-4 sm:py-4 lg:grid-cols-[15.5rem_1fr_9rem_auto] lg:items-baseline lg:gap-x-6 motion-reduce:transition-none"
                >
                  <code className="min-w-0 text-[0.9375rem] font-semibold break-words text-ink group-hover:text-action">
                    {s.name}
                  </code>
                  <span className="col-span-2 row-start-2 text-[0.9375rem] leading-relaxed text-ink-muted lg:col-span-1 lg:row-start-auto">
                    {leadSummary(s.purpose)}
                  </span>
                  <span className="hidden font-mono text-[0.75rem] text-ink-faint tabular lg:block">
                    {s.references.length} refs
                    {s.scripts ? ` · ${s.scripts.length} scripts` : ""}
                  </span>
                  <span className="col-start-2 row-start-1 flex items-center gap-2 font-mono text-[0.75rem] text-ink-faint lg:col-start-auto lg:row-start-auto">
                    <span className="rounded-full border border-line bg-void px-2 py-0.5 text-[0.6875rem] uppercase">
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
                    className="grid min-w-0 gap-4 px-2 pt-1 pb-5 sm:px-4 lg:grid-cols-[15.5rem_1fr] lg:gap-6"
                  >
                    <div>
                      <p className="font-mono text-[0.75rem] text-action">
                        skills/{s.name}/
                      </p>
                      <p className="mt-1 font-mono text-[0.75rem] text-ink-faint tabular">
                        {s.references.length} references
                        {s.scripts ? ` · ${s.scripts.length} CLI scripts` : ""}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="mb-3 text-[0.875rem] leading-relaxed text-ink-muted">
                        {s.purpose}
                      </p>
                      <ul className="flex flex-wrap gap-1.5">
                        {s.references.map((r) => (
                          <li key={r}>
                            <code
                              className={`inline-block rounded-full border bg-void px-2.5 py-0.5 text-[0.75rem] ${
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
                            <code className="inline-block rounded-full border border-static bg-void px-2.5 py-0.5 text-[0.75rem] text-static">
                              scripts/{r}
                            </code>
                          </li>
                        ))}
                      </ul>
                      <a
                        href={`${REPO_URL}/tree/main/skills/${s.name}`}
                        className="mt-4 inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line-strong bg-panel px-4 font-mono text-[0.8125rem] font-medium text-ink transition-colors hover:border-action hover:text-action motion-reduce:transition-none"
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

        {!isFiltered && rows.length > 8 ? (
          <div className="mt-4 sm:hidden">
            <button
              type="button"
              onClick={() => setShowAllMobile(!showAllMobile)}
              className="surface flex min-h-12 w-full items-center justify-center gap-2 rounded-ctl px-4 font-mono text-[0.8125rem] font-semibold text-ink hover:border-action hover:text-action"
            >
              <PixelIcon name={showAllMobile ? "minus" : "plus"} size={12} />
              {showAllMobile
                ? "Show fewer skills"
                : `Show all ${rows.length} skills (+${rows.length - 8} more)`}
            </button>
          </div>
        ) : null}

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
              className="surface mt-4 inline-flex min-h-11 items-center gap-2 rounded-full px-5 font-mono text-[0.8125rem] font-medium text-ink hover:border-action hover:text-action"
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
