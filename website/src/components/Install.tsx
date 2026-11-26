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
import { CopyCommand, PixelFrame, PixelIcon, SectionHead } from "./pixel";
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
      <legend className="mb-4 flex items-center gap-3 font-pixel text-[0.75rem] tracking-[0.06em] text-ink-faint uppercase">
        <span className="grid size-7 place-items-center rounded-full bg-action/12 text-action tabular">
          {n}
        </span>
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

const chip = (on: boolean) =>
  `inline-flex min-h-10 items-center gap-2 rounded-full border px-4 font-mono text-[0.8125rem] whitespace-nowrap transition-[background-color,border-color,transform] duration-150 active:scale-[0.97] motion-reduce:transition-none ${
    on
      ? "border-action bg-action text-on-action shadow-[0_8px_24px_-10px_var(--color-action)]"
      : "border-white/12 text-ink hover:border-white/30 hover:bg-white/6"
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

  const toggle = (list: string[], v: string) =>
    list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

  const names = SKILLS.map((s) => s.name);
  const effective =
    mode === "all"
      ? names
      : names.filter((n) => picked.includes(n) || REQUIRED_SKILLS.includes(n));
  const ready = agents.length > 0;
  // Leave core skills implicit for optional subsets so --force preserves the
  // installer's auto-added-core protection. Core-only installs must name them.
  const target =
    mode === "all"
      ? "all"
      : (picked.length ? picked : REQUIRED_SKILLS).join(" ");
  const command = `pixelcraft add ${target} --agent ${agents.join(",")}${scope === "global" ? " --global" : ""}${dry ? " --dry-run" : ""}${force ? " --force" : ""}`;

  const targets = AGENT_TARGETS.filter((t) => agents.includes(t.id));

  return (
    <PixelFrame lit innerClassName="bg-void">
      <div className="grid lg:grid-cols-12">
        <div className="grid gap-10 p-6 sm:p-9 lg:col-span-7">
          <Step n={1} title="Which agents">
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

          <Step n={2} title="Where">
            <div
              role="group"
              aria-label="Scope"
              className="inline-flex rounded-full bg-white/6 p-1"
            >
              {(
                [
                  ["project", "This project"],
                  ["global", "My user account"],
                ] as const
              ).map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={scope === v}
                  onClick={() => setScope(v)}
                  className={`min-h-10 rounded-full px-5 font-mono text-[0.8125rem] transition-colors motion-reduce:transition-none ${scope === v ? "bg-action text-on-action" : "text-ink hover:bg-white/8"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </Step>

          <Step n={3} title="Which skills">
            <div
              role="group"
              aria-label="Skill selection"
              className="inline-flex rounded-full bg-white/6 p-1"
            >
              {(
                [
                  ["all", `All ${SKILLS.length}`],
                  ["pick", "Pick skills"],
                ] as const
              ).map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={mode === v}
                  onClick={() => setMode(v)}
                  className={`min-h-10 rounded-full px-5 font-mono text-[0.8125rem] transition-colors motion-reduce:transition-none ${mode === v ? "bg-action text-on-action" : "text-ink hover:bg-white/8"}`}
                >
                  {l}
                </button>
              ))}
            </div>
            {mode === "pick" ? (
              <div className="mt-6 grid gap-5">
                {CATEGORIES.map((c) => (
                  <div key={c.id}>
                    <p className="mb-2.5 font-mono text-[0.75rem] text-ink-faint">
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
                                ? "border-white/10 bg-white/8 text-ink-muted"
                                : on
                                  ? "border-action bg-action text-on-action"
                                  : "border-white/12 text-ink hover:border-white/30 hover:bg-white/6"
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
                <p className="font-mono text-[0.75rem] leading-relaxed text-ink-faint">
                  The installer always adds {REQUIRED_SKILLS.join(" and ")} when
                  you pick a subset.
                </p>
              </div>
            ) : null}
          </Step>

          <Step n={4} title="Options">
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {(
                [
                  [
                    dry,
                    setDry,
                    "--dry-run",
                    "Print what would be copied. Writes nothing.",
                  ],
                  [
                    force,
                    setForce,
                    "--force",
                    "Overwrite existing skill folders and agent integration files, including custom slash commands.",
                  ],
                ] as const
              ).map(([v, set, flag, hint]) => (
                <label
                  key={flag}
                  className="flex max-w-[20rem] cursor-pointer items-start gap-3"
                >
                  <input
                    type="checkbox"
                    checked={v}
                    onChange={(e) => set(e.target.checked)}
                    className="mt-0.5 size-6 shrink-0 cursor-pointer accent-[var(--color-action)]"
                  />
                  <span>
                    <code className="text-[0.875rem] text-ink">{flag}</code>
                    <span className="mt-0.5 block text-[0.8125rem] leading-snug text-ink-faint">
                      {hint}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </Step>
        </div>

        <div className="m-2 rounded-[calc(var(--radius-card)-0.5rem)] bg-void/70 p-6 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.06)] sm:p-9 lg:col-span-5">
          <p className="font-pixel text-[0.75rem] tracking-[0.06em] text-action uppercase">
            Your command
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
            className="mt-4 font-mono text-[0.8125rem] text-ink-muted"
          >
            {ready
              ? `${effective.length} skills into ${agents.length} ${agents.length === 1 ? "agent" : "agents"}${dry ? ", dry run" : ""}.`
              : "Choose at least one agent to generate a command."}
          </p>

          <p className="mt-8 font-mono text-[0.75rem] text-ink-faint">
            writes to
          </p>
          <ul className="mt-3 grid gap-3">
            {targets.length === 0 ? (
              <li className="text-[0.9375rem] text-ink-faint">
                Nothing selected.
              </li>
            ) : null}
            {targets.map((t) => (
              <li key={t.id} className="surface rounded-tile px-4 py-3">
                <p className="text-[0.9375rem] text-ink">{t.label}</p>
                <code className="mt-1 block text-[0.8125rem] break-all text-action">
                  {(scope === "project" ? t.project : t.global) + "/<skill>"}
                </code>
                {t.also ? (
                  <p className="mt-1 text-[0.8125rem] text-ink-faint">
                    plus {t.also}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
          <p className="mt-8 border-t border-line pt-5 text-[0.8125rem] leading-relaxed text-ink-faint">
            Never uses sudo. Refuses symlinked target folders. Existing skill
            folders are skipped unless you pass --force.
          </p>
        </div>
      </div>
    </PixelFrame>
  );
}

export function Install() {
  const [method, setMethod] = useState(INSTALL[0].id);

  return (
    <section
      id="install"
      aria-labelledby="install-title"
      className="relative overflow-hidden border-b border-line"
    >
      <div className="mx-auto max-w-[88rem] px-5 py-24 sm:px-8 lg:py-36">
        <SectionHead
          id="install-title"
          kicker="Install"
          title="Build your install command."
        >
          <p>
            The installer is the <code className="text-ink">pixelcraft</code>{" "}
            CLI from <code className="text-ink">{NPM_PKG}</code>. Every option
            below is one of its real flags, and the paths come from its own{" "}
            <code className="text-ink">--help</code>.
          </p>
        </SectionHead>

        <div className="mt-16">
          <Builder />
        </div>

        <div className="mt-24 grid gap-12 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <h3 className="mb-5 font-pixel text-[0.75rem] tracking-[0.06em] text-ink-faint uppercase">
              Other ways to install
            </h3>
            <Tabs
              items={INSTALL}
              value={method}
              onChange={setMethod}
              label="Install method"
              listClassName="flex flex-wrap gap-1"
              tabClassName={(selected) =>
                `min-h-10 rounded-full border px-4 font-mono text-[0.8125rem] transition-colors duration-150 motion-reduce:transition-none ${
                  selected
                    ? "border-action bg-action text-on-action"
                    : "border-white/12 text-ink-muted hover:border-white/30 hover:text-ink"
                }`
              }
              renderTab={(m) => m.label}
              renderPanel={(m) => (
                <div className="pt-6">
                  <CopyCommand lines={m.lines} />
                  <p className="mt-4 text-[0.9375rem] text-ink-muted">
                    {m.note}
                  </p>
                </div>
              )}
            />
          </div>
          <div className="lg:col-span-4">
            <h3 className="font-pixel text-[0.75rem] tracking-[0.06em] text-ink-faint uppercase">
              Documented hosts · {AGENTS.length}
            </h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {AGENTS.map((a) => (
                <li
                  key={a}
                  className="surface rounded-full px-3.5 py-1.5 text-[0.875rem] text-ink-muted"
                >
                  {a}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[0.875rem] leading-relaxed text-ink-faint">
              The README labels install status per host. Some client discoveries
              are marked not-checked there.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
