"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
type Skill = {
  name: string;
  slug: string;
  category: string;
  summary: string;
  tags: string[];
};
const categories = ["All skills", "Core", "Surfaces", "Patterns", "Quality"];
export default function Library({ skills }: { skills: Skill[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All skills");
  const [ready, setReady] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    function restore() {
      const params = new URLSearchParams(location.search);
      setQuery(params.get("q") ?? "");
      setCategory(
        categories.includes(params.get("category") ?? "")
          ? params.get("category")!
          : "All skills",
      );
    }
    restore();
    setReady(true);
    window.addEventListener("popstate", restore);
    function focus(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (
        e.key === "/" &&
        !target.closest('input,textarea,select,[contenteditable="true"]') &&
        !document.querySelector("dialog[open]")
      ) {
        e.preventDefault();
        input.current?.focus();
      }
    }
    document.addEventListener("keydown", focus);
    return () => {
      window.removeEventListener("popstate", restore);
      document.removeEventListener("keydown", focus);
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    const url = new URL(location.href);
    query ? url.searchParams.set("q", query) : url.searchParams.delete("q");
    category !== "All skills"
      ? url.searchParams.set("category", category)
      : url.searchParams.delete("category");
    history.replaceState(history.state, "", url);
  }, [query, category, ready]);
  const filtered = skills.filter(
    (skill) =>
      (category === "All skills" || skill.category === category) &&
      `${skill.name} ${skill.summary} ${skill.tags.join(" ")}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <section
      className="library-section shell"
      id="skills"
      aria-labelledby="library-heading"
    >
      <div className="section-heading">
        <div>
          <span className="section-kicker">The skill library</span>
          <h2 id="library-heading">
            A whole toolkit.
            <br />
            Not a single aesthetic.
          </h2>
        </div>
        <p>
          {skills.length} focused skills. Use the full loop, or bring
          <br className="desktop-break" /> the right skill to the task in front
          of you.
        </p>
      </div>
      <div className="library-controls">
        <div
          className="category-switch"
          role="group"
          aria-label="Filter skills by category"
        >
          {categories.map((c) => (
            <button
              key={c}
              data-category={c}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
              {c === "All skills" && <span>{skills.length}</span>}
            </button>
          ))}
        </div>
        <div className="search-wrap">
          <svg
            viewBox="0 0 20 20"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <circle cx="8.5" cy="8.5" r="5.5" />
            <path d="m13 13 4 4" />
          </svg>
          <label className="sr-only" htmlFor="skill-search">
            Search skills
          </label>
          <input
            ref={input}
            id="skill-search"
            type="search"
            placeholder="Find your skill…"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span aria-hidden="true">/</span>
        </div>
      </div>
      <p
        id="skill-count"
        className="skill-result-count"
        role="status"
        aria-live="polite"
      >
        {filtered.length === skills.length
          ? `Showing all ${skills.length} skills`
          : `${filtered.length} ${filtered.length === 1 ? "skill" : "skills"} found`}
      </p>
      <motion.div layout={!reduce} className="skill-grid">
        {filtered.map((skill) => (
          <motion.a
            layout={!reduce}
            transition={{ duration: 0.2 }}
            key={skill.slug}
            href={`/skills/${skill.slug}/`}
            className="skill-item"
            data-skill-category={skill.category}
          >
            <div className="skill-item-top">
              <span className="skill-number">
                {String(skills.indexOf(skill) + 1).padStart(2, "0")}
              </span>
              <span
                className={`category-label category-${skill.category.toLowerCase()}`}
              >
                {skill.category}
              </span>
              <span className="skill-arrow" aria-hidden="true">
                ↗
              </span>
            </div>
            <h3>{skill.name}</h3>
            <p>{skill.summary}</p>
            <div className="skill-tags">
              {skill.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </motion.a>
        ))}
      </motion.div>
      <div className="search-empty" hidden={filtered.length > 0}>
        <span aria-hidden="true">[ 0 ]</span>
        <h3>No matching skills.</h3>
        <p>Try a surface like “mobile”, or a task like “tokens”.</p>
        <button
          className="text-link"
          onClick={() => {
            setQuery("");
            setCategory("All skills");
            input.current?.focus();
          }}
        >
          Clear filters ↗
        </button>
      </div>
      <div className="library-footnote">
        <span>
          Portable SKILL.md files. Yours to inspect, adapt, and combine.
        </span>
        <a href="https://github.com/ThanhNguyxnOrg/Pixelcraft/tree/main/skills">
          Browse the source ↗
        </a>
      </div>
    </section>
  );
}
