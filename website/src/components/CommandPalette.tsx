import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AGENT_TARGETS, GALLERY, REPO_URL, SKILLS } from "../data";
import { publicUrl } from "../lib/publicUrl";
import { dispatchJump, onJump } from "../lib/urlState";
import { PixelIcon, useMotionPause } from "./pixel";

type CommandAction = {
  id: string;
  group: "Exhibits" | "Skills" | "Agent Installers" | "Navigation & Specs";
  title: string;
  subtitle: string;
  keywords: string;
  badge?: string;
  run: () => void;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const { paused, setPaused } = useMotionPause();
  const reducedMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const showNotice = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const closePalette = () => {
    setOpen(false);
    setQuery("");
    window.setTimeout(() => lastFocused.current?.focus(), 0);
  };

  useEffect(() => {
    const unsub = onJump((detail) => {
      if (detail.kind === "palette") {
        lastFocused.current = document.activeElement as HTMLElement | null;
        setOpen(true);
      }
    });
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) {
          closePalette();
        } else {
          lastFocused.current = document.activeElement as HTMLElement | null;
          setOpen(true);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      unsub();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setActiveIdx(0);
      window.setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  const actions = useMemo<CommandAction[]>(() => {
    const navItems: CommandAction[] = [
      {
        id: "nav-gallery",
        group: "Navigation & Specs",
        title: "Jump to Multi-Stack Proof Gallery",
        subtitle: `Compare all ${GALLERY.length} before/after exhibits & live demos`,
        keywords: "gallery proofs showcase demos compare",
        badge: "#gallery",
        run: () => {
          closePalette();
          document
            .getElementById("gallery")
            ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
        },
      },
      {
        id: "nav-blueprint",
        group: "Navigation & Specs",
        title: "Jump to Production Engineering Blueprint",
        subtitle:
          "Strategy, design system, CWV, SEO schema, WCAG 2.2 AA & security audit",
        keywords: "blueprint standards seo security performance wcag 20k",
        badge: "#blueprint",
        run: () => {
          closePalette();
          document
            .getElementById("blueprint")
            ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
        },
      },
      {
        id: "nav-motion-toggle",
        group: "Navigation & Specs",
        title: paused ? "Resume autonomous motion" : "Pause autonomous motion",
        subtitle: "WCAG 2.2.2 global page motion control",
        keywords: "pause resume animation motion gsap accessibility",
        badge: paused ? "Paused" : "Active",
        run: () => {
          setPaused(!paused);
          showNotice(paused ? "Motion resumed" : "Motion paused");
          closePalette();
        },
      },
      {
        id: "spec-llms",
        group: "Navigation & Specs",
        title: "Open llms.txt machine-readable index",
        subtitle: "Structured skill & exhibit manifest for coding agents",
        keywords: "llms ai manifest seo context",
        badge: "llms.txt ↗",
        run: () => {
          window.open(publicUrl("llms.txt"), "_blank", "noopener,noreferrer");
          closePalette();
        },
      },
      {
        id: "spec-sitemap",
        group: "Navigation & Specs",
        title: "Open XML Sitemap",
        subtitle: `Canonical URL index covering main site + ${GALLERY.length} standalone demos`,
        keywords: "sitemap xml seo crawl",
        badge: "sitemap.xml ↗",
        run: () => {
          window.open(
            publicUrl("sitemap.xml"),
            "_blank",
            "noopener,noreferrer",
          );
          closePalette();
        },
      },
      {
        id: "spec-repo",
        group: "Navigation & Specs",
        title: "Open GitHub Repository",
        subtitle: REPO_URL,
        keywords: "github source code mit license",
        badge: "GitHub ↗",
        run: () => {
          window.open(REPO_URL, "_blank", "noopener,noreferrer");
          closePalette();
        },
      },
    ];

    const exhibitItems: CommandAction[] = GALLERY.flatMap((g) => [
      {
        id: `exhibit-stage-${g.id}`,
        group: "Exhibits" as const,
        title: `${g.title} — Inspect in Workbench`,
        subtitle: `${g.ecosystem} · ${g.stackLabel} · slop ${g.scanBefore.score} → ${g.scanAfter.score}`,
        keywords: `${g.id} ${g.title} ${g.stackLabel} ${g.ecosystem} ${g.mode}`,
        badge: g.stackShort,
        run: () => {
          closePalette();
          dispatchJump({ kind: "exhibit", id: g.id, view: "compare" });
          document
            .getElementById("gallery")
            ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
        },
      },
      {
        id: `exhibit-open-${g.id}`,
        group: "Exhibits" as const,
        title: `${g.title} — Open Standalone Demo`,
        subtitle: `Launch full responsive ${g.stackShort} application in new tab`,
        keywords: `open demo live ${g.id} ${g.title} ${g.stackLabel}`,
        badge: "Open ↗",
        run: () => {
          window.open(g.liveAfter, "_blank", "noopener,noreferrer");
          closePalette();
        },
      },
    ]);

    const skillItems: CommandAction[] = SKILLS.map((s) => ({
      id: `skill-${s.name}`,
      group: "Skills" as const,
      title: s.name,
      subtitle: `${s.category} · ${s.references.length} refs${s.scripts ? ` · ${s.scripts.length} scripts` : ""}`,
      keywords: `${s.name} ${s.category} ${s.purpose} ${s.references.join(" ")}`,
      badge: s.category,
      run: () => {
        closePalette();
        dispatchJump({ kind: "skill", query: s.name });
        document
          .getElementById("skills")
          ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      },
    }));

    const agentItems: CommandAction[] = AGENT_TARGETS.map((t) => {
      const cmd = `npx @thanhnguyxn/pixelcraft add all --agent ${t.id}`;
      return {
        id: `agent-${t.id}`,
        group: "Agent Installers" as const,
        title: `Install for ${t.label}`,
        subtitle: cmd,
        keywords: `install agent ${t.id} ${t.label} cli copy`,
        badge: "Copy cmd",
        run: () => {
          navigator.clipboard?.writeText(cmd);
          dispatchJump({ kind: "agent", id: t.id });
          showNotice(`Copied install command for ${t.label}`);
          closePalette();
        },
      };
    });

    return [...navItems, ...exhibitItems, ...skillItems, ...agentItems];
  }, [paused, reducedMotion, setPaused]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return [
        ...actions.filter((a) => a.group === "Navigation & Specs").slice(0, 4),
        ...actions
          .filter(
            (a) => a.group === "Exhibits" && a.id.startsWith("exhibit-stage-"),
          )
          .slice(0, 6),
        ...actions.filter((a) => a.group === "Skills").slice(0, 4),
        ...actions.filter((a) => a.group === "Agent Installers").slice(0, 4),
      ];
    }
    const tokens = q.split(/\s+/);
    return actions
      .filter((a) => {
        const hay = `${a.title} ${a.subtitle} ${a.keywords}`.toLowerCase();
        return tokens.every((tok) => hay.includes(tok));
      })
      .slice(0, 24);
  }, [actions, query]);

  const safeIdx = Math.min(activeIdx, Math.max(0, filtered.length - 1));

  const onDialogKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closePalette();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (filtered.length ? (i + 1) % filtered.length : 0));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) =>
        filtered.length ? (i - 1 + filtered.length) % filtered.length : 0,
      );
      return;
    }
    if (e.key === "Enter" && filtered[safeIdx]) {
      e.preventDefault();
      filtered[safeIdx].run();
      return;
    }
    if (e.key === "Tab" && dialogRef.current) {
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'input, button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <>
      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed end-4 bottom-20 z-50 rounded-full border border-action bg-void px-4 py-2 font-mono text-[0.75rem] font-medium text-action shadow-lift xl:bottom-6"
        >
          {toast}
        </div>
      ) : null}

      <AnimatePresence>
        {open ? (
          <div
            className="fixed inset-0 z-50 px-3 pt-16 sm:px-6 sm:pt-24"
            onKeyDown={onDialogKeyDown}
          >
            <motion.div
              aria-hidden="true"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.14 }}
              onClick={closePalette}
              className="fixed inset-0 bg-void/80 backdrop-blur-md"
            />
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cmdk-title"
              initial={
                reducedMotion ? false : { opacity: 0, scale: 0.98, y: -8 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                reducedMotion ? undefined : { opacity: 0, scale: 0.98, y: -6 }
              }
              transition={{ duration: reducedMotion ? 0 : 0.16 }}
              className="gborder relative z-10 mx-auto flex max-h-[min(36rem,80dvh)] w-full max-w-[42rem] flex-col overflow-hidden rounded-card bg-deep text-ink shadow-lift"
            >
              <h2 id="cmdk-title" className="sr-only">
                Search exhibits, skills, agent installers, and navigation
              </h2>
              <div className="flex items-center gap-3 border-b border-line px-4 py-3">
                <PixelIcon
                  name="search"
                  size={15}
                  className="shrink-0 text-action"
                />
                <label htmlFor="cmdk-input" className="sr-only">
                  Filter exhibits, skills, or agent commands
                </label>
                <input
                  ref={inputRef}
                  id="cmdk-input"
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIdx(0);
                  }}
                  placeholder={`Search ${GALLERY.length} exhibits, ${SKILLS.length} skills, or ${AGENT_TARGETS.length} agent hosts…`}
                  className="min-h-10 min-w-0 flex-1 bg-transparent text-[0.9375rem] text-ink placeholder:text-ink-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
                />
                <button
                  type="button"
                  onClick={closePalette}
                  className="inline-flex min-h-8 items-center rounded-ctl border border-line bg-panel px-2.5 font-mono text-[0.6875rem] text-ink-muted hover:text-ink"
                >
                  Esc
                </button>
              </div>

              <div className="overflow-y-auto overscroll-contain p-2">
                {filtered.length === 0 ? (
                  <p className="px-4 py-10 text-start font-mono text-[0.8125rem] text-ink-muted">
                    No matching exhibits, skills, or agent commands for “{query}
                    ”.
                  </p>
                ) : (
                  <ul role="listbox" aria-label="Matching actions">
                    {filtered.map((item, idx) => {
                      const active = idx === safeIdx;
                      return (
                        <li
                          key={item.id}
                          role="option"
                          aria-selected={active}
                          className="min-w-0"
                        >
                          <button
                            type="button"
                            onMouseEnter={() => setActiveIdx(idx)}
                            onClick={item.run}
                            className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-tile px-3.5 py-2.5 text-start transition-colors motion-reduce:transition-none ${
                              active
                                ? "bg-raised text-ink ring-1 ring-action/45"
                                : "text-ink-muted hover:bg-white/5 hover:text-ink"
                            }`}
                          >
                            <span className="min-w-0 flex-1">
                              <span className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-[0.6875rem] text-action uppercase">
                                  {item.group}
                                </span>
                                <span className="truncate text-[0.9375rem] font-semibold text-ink">
                                  {item.title}
                                </span>
                              </span>
                              <span className="mt-0.5 block truncate font-mono text-[0.75rem] text-ink-faint">
                                {item.subtitle}
                              </span>
                            </span>
                            {item.badge ? (
                              <span className="shrink-0 rounded-full border border-line bg-void px-2.5 py-1 font-mono text-[0.6875rem] whitespace-nowrap text-ink-muted">
                                {item.badge}
                              </span>
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-void/70 px-4 py-2 font-mono text-[0.6875rem] text-ink-faint">
                <span>↑↓ navigate · Enter run · Esc close</span>
                <span>Ctrl/⌘ + K anywhere</span>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
