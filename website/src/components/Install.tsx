import { useState } from "react";
import {
  AGENTS,
  AGENT_TARGETS,
  CATEGORIES,
  INSTALL,
  NPM_PKG,
  REQUIRED_SKILLS,
  SKILLS,
} from "../data";
import { CopyCommand, PixelIcon, SectionHead } from "./pixel";
import { Tabs } from "./Tabs";

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className="mb-3.5 flex items-center gap-2.5 font-mono text-[0.8125rem] text-ink">
        <span className="grid size-6 place-items-center rounded-full bg-action font-bold text-on-action tabular">
          {n}
        </span>
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

const chip = (on: boolean) =>
  `inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 font-mono text-[0.8125rem] whitespace-nowrap transition-colors duration-150 motion-reduce:transition-none ${
    on
      ? "border-action bg-action text-on-action"
      : "border-line text-ink hover:border-action hover:bg-panel"
  }`;

function Builder() {
  const [agents, setAgents] = useState<string[]>(["claude"]);
  const [scope, setScope] = useState<"project" | "global">("project");
  const [mode, setMode] = useState<"all" | "pick">("all");
  const [picked, setPicked] = useState<string[]>([
    "pixelcraft-web",
    "pixelcraft-review",
  ]);
  const [dry, setDry] = useState(false);
  const [force, setForce] = useState(false);
  const [docsMcp, setDocsMcp] = useState(false);

  const toggle = (list: string[], v: string) =>
    list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

  const names = SKILLS.map((s) => s.name);
  const effective =
    mode === "all"
      ? names
      : names.filter((n) => picked.includes(n) || REQUIRED_SKILLS.includes(n));
  const ready = agents.length > 0;
  const target =
    mode === "all"
      ? "all"
      : (picked.length ? picked : REQUIRED_SKILLS).join(" ");
  const command = `pixelcraft add ${target} --agent ${agents.join(",")}${
    scope === "global" ? " --global" : ""
  }${dry ? " --dry-run" : ""}${force ? " --force" : ""}${
    docsMcp ? " --docs-mcp" : ""
  }`;

  const targets = AGENT_TARGETS.filter((t) => agents.includes(t.id));

  return (
    <div className="surface-lit overflow-hidden rounded-card">
      <div className="grid lg:grid-cols-12">
        <div className="grid gap-8 p-6 sm:p-8 lg:col-span-7">
          <Step n={1} title="Target agent hosts">
            <div className="flex flex-wrap gap-2">
              {AGENT_TARGETS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={agents.includes(t.id)}
                  onClick={() => setAgents(toggle(agents, t.id))}
                  className={chip(agents.includes(t.id))}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </Step>

          <Step n={2} title="Install scope">
            <div
              role="group"
              aria-label="Scope"
              className="inline-flex rounded-full border border-line bg-void/70 p-1"
            >
              {(
                [
                  ["project", "This project"],
                  ["global", "User account (--global)"],
                ] as const
              ).map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={scope === v}
                  onClick={() => setScope(v)}
                  className={`min-h-10 rounded-full px-4 font-mono text-[0.8125rem] transition-colors motion-reduce:transition-none ${
                    scope === v
                      ? "bg-action text-on-action"
                      : "text-ink hover:bg-panel"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </Step>

          <Step n={3} title="Skills to install">
            <div
              role="group"
              aria-label="Skill selection"
              className="inline-flex rounded-full border border-line bg-void/70 p-1"
            >
              {(
                [
                  ["all", `All ${SKILLS.length}`],
                  ["pick", "Pick subset"],
                ] as const
              ).map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={mode === v}
                  onClick={() => setMode(v)}
                  className={`min-h-10 rounded-full px-4 font-mono text-[0.8125rem] transition-colors motion-reduce:transition-none ${
                    mode === v
                      ? "bg-action text-on-action"
                      : "text-ink hover:bg-panel"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            {mode === "pick" ? (
              <div className="mt-5 grid gap-4">
                {CATEGORIES.map((c) => (
                  <div key={c.id}>
                    <p className="mb-2 font-mono text-[0.75rem] text-ink-faint">
                      {c.id}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {SKILLS.filter((s) => s.category === c.id).map((s) => {
                        const locked = REQUIRED_SKILLS.includes(s.name);
                        const on = locked || picked.includes(s.name);
                        return (
                          <button
                            key={s.name}
                            type="button"
                            aria-pressed={on}
                            disabled={locked}
                            onClick={() => setPicked(toggle(picked, s.name))}
                            className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 font-mono text-[0.75rem] transition-colors disabled:cursor-default motion-reduce:transition-none ${
                              locked
                                ? "border-line bg-raised text-ink-muted"
                                : on
                                  ? "border-action bg-action text-on-action"
                                  : "border-line text-ink hover:border-action hover:bg-panel"
                            }`}
                          >
                            {on ? <PixelIcon name="check" size={10} /> : null}
                            {s.name.replace("pixelcraft-", "")}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <p className="font-mono text-[0.75rem] text-ink-faint">
                  Subsets automatically include {REQUIRED_SKILLS.join(" and ")}{" "}
                  when missing.
                </p>
              </div>
            ) : null}
          </Step>

          <Step n={4} title="CLI flags">
            <div className="grid gap-3 sm:grid-cols-3">
              {(
                [
                  [
                    dry,
                    setDry,
                    "--dry-run",
                    "Print destination copies without writing files.",
                  ],
                  [
                    force,
                    setForce,
                    "--force",
                    "Replace explicitly requested existing skill folders (auto-added core skills stay protected).",
                  ],
                  [
                    docsMcp,
                    setDocsMcp,
                    "--docs-mcp",
                    "Print optional Context7 setup guidance without editing host configs.",
                  ],
                ] as const
              ).map(([v, set, flag, hint]) => (
                <label
                  key={flag}
                  className="surface flex cursor-pointer items-start gap-2.5 rounded-tile p-3"
                >
                  <input
                    type="checkbox"
                    checked={v}
                    onChange={(e) => set(e.target.checked)}
                    className="mt-1 size-4 accent-[var(--color-action)]"
                  />
                  <span>
                    <code className="text-[0.8125rem] text-ink">{flag}</code>
                    <span className="mt-0.5 block text-[0.75rem] leading-snug text-ink-faint">
                      {hint}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </Step>
        </div>

        <div className="border-t border-line bg-void/85 p-6 sm:p-8 lg:col-span-5 lg:border-t-0 lg:border-s">
          <p className="font-mono text-[0.8125rem] font-semibold text-action">
            Generated command
          </p>
          {ready ? (
            <div className="mt-4">
              <CopyCommand
                lines={[`npm i -g ${NPM_PKG}`, command]}
                variant="featured"
                wrap
              />
            </div>
          ) : null}
          <p
            role="status"
            className="mt-3 font-mono text-[0.8125rem] text-ink-muted"
          >
            {ready
              ? `${effective.length} skills into ${agents.length} ${agents.length === 1 ? "agent" : "agents"}${dry ? ", dry run" : ""}.`
              : "Choose at least one agent to generate a command."}
          </p>

          <p className="mt-7 font-mono text-[0.75rem] text-ink-faint">
            Destination paths
          </p>
          <ul className="mt-3 grid gap-2.5">
            {targets.length === 0 ? (
              <li className="text-[0.875rem] text-ink-faint">
                Nothing selected.
              </li>
            ) : null}
            {targets.map((t) => (
              <li key={t.id} className="surface rounded-tile px-4 py-3">
                <p className="text-[0.875rem] font-medium text-ink">
                  {t.label}
                </p>
                <code className="mt-1 block text-[0.75rem] break-all text-action">
                  {(scope === "project" ? t.project : t.global) + "/<skill>"}
                </code>
                {t.also ? (
                  <p className="mt-1 text-[0.75rem] text-ink-faint">
                    plus {t.also}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-line pt-4 text-[0.8125rem] leading-relaxed text-ink-faint">
            Never uses sudo. Refuses symlinked target directories. Also includes{" "}
            <code className="text-ink">pixelcraft doctor</code>,{" "}
            <code className="text-ink">init-router</code>,{" "}
            <code className="text-ink">remove</code>, and{" "}
            <code className="text-ink">check</code>.
          </p>
        </div>
      </div>
    </div>
  );
}

export function Install() {
  const [method, setMethod] = useState(INSTALL[0].id);

  return (
    <section
      id="install"
      aria-labelledby="install-title"
      className="border-b border-line bg-void"
    >
      <div className="mx-auto max-w-[84rem] px-5 py-20 sm:px-8 lg:py-28">
        <SectionHead
          id="install-title"
          meta="Zero-dependency installers"
          title="Install in 30 seconds on any coding agent."
        >
          <p>
            Every flag and destination below mirrors{" "}
            <code className="text-ink">pixelcraft --help</code>,{" "}
            <code className="text-ink">install.sh</code>, and{" "}
            <code className="text-ink">install.ps1</code>.
          </p>
        </SectionHead>

        <div className="mt-12">
          <Builder />
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <h3 className="mb-4 font-mono text-[0.8125rem] font-semibold text-ink">
              Other install methods
            </h3>
            <Tabs
              items={INSTALL}
              value={method}
              onChange={setMethod}
              label="Install method"
              listClassName="flex flex-wrap gap-1.5"
              tabClassName={(selected) =>
                `min-h-10 rounded-full border px-3.5 font-mono text-[0.8125rem] transition-colors duration-150 motion-reduce:transition-none ${
                  selected
                    ? "border-action bg-action text-on-action"
                    : "border-line text-ink-muted hover:border-action hover:text-ink"
                }`
              }
              renderTab={(m) => m.label}
              renderPanel={(m) => (
                <div className="pt-5">
                  <CopyCommand lines={m.lines} />
                  <p className="mt-3 text-[0.9375rem] text-ink-muted">
                    {m.note}
                  </p>
                </div>
              )}
            />
          </div>
          <div className="lg:col-span-4">
            <h3 className="font-mono text-[0.8125rem] font-semibold text-ink">
              Documented agent hosts · {AGENTS.length}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {AGENTS.map((a) => (
                <li
                  key={a}
                  className="surface rounded-full px-3 py-1 font-mono text-[0.75rem] text-ink-muted"
                >
                  {a}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-faint">
              See <code className="text-ink">docs/INSTALL.md</code> in the repo
              for per-host verification status, per-skill ZIP uploads, and
              offline release archives.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
