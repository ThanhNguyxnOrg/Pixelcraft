import { useMemo, useState, type CSSProperties } from "react";
import { GALLERY, type GalleryItem, type ScanFinding } from "../data";
import galleryMeta from "../generated/gallery.json";
import { EvidenceStamp, PixelIcon } from "./pixel";
import { Tabs } from "./Tabs";

type ViewMode = "compare" | "before" | "after";
type WorkbenchTab = "visual" | "code" | "notes";

const SEV: Record<ScanFinding["severity"], string> = {
  P0: "border-paper-p0 bg-paper text-paper-p0",
  P1: "border-paper-p1 bg-paper text-paper-p1",
  P2: "border-paper-p2 bg-paper text-paper-p2",
  P3: "border-paper-ink-2 bg-paper text-paper-ink-2",
};

const PIN_BG: Record<ScanFinding["severity"], string> = {
  P0: "bg-paper-p0 text-paper",
  P1: "bg-paper-p1 text-paper",
  P2: "bg-paper-p2 text-paper",
  P3: "bg-paper-ink text-paper",
};

function groupedFindings(findings: ScanFinding[]) {
  const map = new Map<string, { f: ScanFinding; n: number }>();
  for (const f of findings) {
    const hit = map.get(f.rule);
    if (hit) {
      hit.n += 1;
      if (!hit.f.pin && f.pin) hit.f = f;
    } else {
      map.set(f.rule, { f, n: 1 });
    }
  }
  return [...map.values()].sort(
    (a, b) => a.f.severity.localeCompare(b.f.severity) || b.n - a.n,
  );
}

function ExhibitWorkbench({ item }: { item: GalleryItem }) {
  const [workbench, setWorkbench] = useState<WorkbenchTab>("visual");
  const [view, setView] = useState<ViewMode>("compare");
  const [split, setSplit] = useState(50);
  const [showPins, setShowPins] = useState(true);
  const [activeRule, setActiveRule] = useState<string | null>(null);

  const grouped = useMemo(
    () => groupedFindings(item.scanBefore.findings),
    [item],
  );
  const pinned = useMemo(
    () => grouped.filter(({ f }) => Boolean(f.pin)),
    [grouped],
  );
  const selectedFinding = useMemo(() => {
    if (!activeRule) return pinned[0] ?? grouped[0] ?? null;
    return (
      grouped.find(({ f }) => f.rule === activeRule) ??
      pinned[0] ??
      grouped[0] ??
      null
    );
  }, [activeRule, grouped, pinned]);

  const w = galleryMeta.viewport.w;
  const h = galleryMeta.viewport.h;
  const clipRight =
    view === "before" ? "0%" : `${Math.max(0, Math.min(100, 100 - split))}%`;
  const showBeforeLayer = view !== "after";

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
      <div className="min-w-0 lg:col-span-8">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
          <div
            role="group"
            aria-label="Workbench mode"
            className="inline-flex flex-wrap rounded-full border border-paper-line bg-paper-2 p-1"
          >
            {(
              [
                ["visual", "Visual diff"],
                ["code", `Code diff · ${item.stackLabel}`],
                ["notes", "Findings & process"],
              ] as [WorkbenchTab, string][]
            ).map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                aria-pressed={workbench === tab}
                onClick={() => setWorkbench(tab)}
                className={`min-h-10 rounded-full px-3.5 font-mono text-[0.8125rem] transition-colors duration-150 motion-reduce:transition-none ${
                  workbench === tab
                    ? "bg-paper-ink text-paper"
                    : "text-paper-ink hover:bg-paper"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {workbench === "visual" ? (
            <div className="flex flex-wrap items-center gap-3">
              <div
                role="group"
                aria-label="Image view"
                className="inline-flex rounded-full border border-paper-line bg-paper-2 p-1"
              >
                {(
                  [
                    ["compare", "Split"],
                    ["before", "Default"],
                    ["after", "Pixelcraft"],
                  ] as [ViewMode, string][]
                ).map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={view === mode}
                    onClick={() => setView(mode)}
                    className={`min-h-9 rounded-full px-3 font-mono text-[0.75rem] transition-colors duration-150 motion-reduce:transition-none ${
                      view === mode
                        ? "bg-paper-ink text-paper"
                        : "text-paper-ink hover:bg-paper"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {view !== "after" && pinned.length > 0 ? (
                <label className="flex min-h-9 cursor-pointer items-center gap-2 font-mono text-[0.75rem] text-paper-ink">
                  <input
                    type="checkbox"
                    checked={showPins}
                    onChange={(e) => setShowPins(e.target.checked)}
                    className="size-4 accent-[var(--color-paper-ink)]"
                  />
                  Pins ({pinned.length})
                </label>
              ) : null}
            </div>
          ) : null}
        </div>

        {workbench === "visual" ? (
          <div>
            <div className="relative overflow-hidden rounded-card border border-paper-line bg-paper-ink">
              <div
                className="relative overflow-hidden select-none"
                style={{ aspectRatio: `${w} / ${h}` } as CSSProperties}
              >
                <img
                  src={item.after}
                  alt={`${item.title}, built with Pixelcraft (${item.stackLabel})`}
                  width={w}
                  height={h}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {showBeforeLayer ? (
                  <div
                    className="absolute inset-0"
                    style={{ clipPath: `inset(0 ${clipRight} 0 0)` }}
                  >
                    <img
                      src={item.before}
                      alt={`${item.title}, default agent output`}
                      width={w}
                      height={h}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                ) : null}

                {view === "compare" ? (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 w-0.5 bg-action shadow-[0_0_0_1px_var(--color-paper-ink)]"
                    style={{ left: `${split}%` }}
                  >
                    <span className="absolute top-1/2 left-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-paper-ink bg-action text-on-action">
                      <PixelIcon name="drag" size={14} />
                    </span>
                  </div>
                ) : null}

                {showPins && showBeforeLayer
                  ? pinned.map(({ f }, idx) => {
                      if (!f.pin) return null;
                      const visibleInSplit =
                        view === "before" || f.pin.x <= split - 2;
                      if (!visibleInSplit) return null;
                      const isSelected = selectedFinding?.f.rule === f.rule;
                      return (
                        <button
                          key={f.rule}
                          type="button"
                          onClick={() => setActiveRule(f.rule)}
                          aria-label={`Inspect finding ${idx + 1}: ${f.severity} ${f.rule}`}
                          aria-pressed={isSelected}
                          style={{
                            left: `${Math.min(94, Math.max(6, f.pin.x))}%`,
                            top: `${Math.min(92, Math.max(8, f.pin.y))}%`,
                          }}
                          className={`absolute z-10 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-paper font-mono text-[0.75rem] font-bold transition-transform duration-150 motion-reduce:transition-none ${PIN_BG[f.severity]} ${
                            isSelected ? "scale-125 ring-2 ring-paper-ink" : ""
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })
                  : null}

                {view !== "after" ? (
                  <span
                    data-comparison-label
                    className="pointer-events-none absolute start-3 top-3 rounded-full bg-paper-ink px-3 py-1 font-pixel text-[0.6875rem] text-paper uppercase"
                  >
                    Default agent · score {item.scanBefore.score}
                  </span>
                ) : null}
                {view !== "before" ? (
                  <span
                    data-comparison-label
                    className="pointer-events-none absolute end-3 top-3 rounded-full bg-action px-3 py-1 font-pixel text-[0.6875rem] text-on-action uppercase"
                  >
                    With Pixelcraft · score {item.scanAfter.score}
                  </span>
                ) : null}
              </div>
            </div>

            {view === "compare" ? (
              <div className="mt-3 flex items-center gap-4 rounded-tile border border-paper-line bg-paper-2 px-4 py-2.5">
                <label
                  htmlFor={`split-${item.id}`}
                  className="font-mono text-[0.75rem] whitespace-nowrap text-paper-ink"
                >
                  Split divider
                </label>
                <input
                  id={`split-${item.id}`}
                  type="range"
                  min={0}
                  max={100}
                  value={split}
                  onChange={(e) => setSplit(Number(e.target.value))}
                  aria-valuetext={`${split}% default agent, ${100 - split}% Pixelcraft`}
                  className="h-2 w-full cursor-ew-resize accent-[var(--color-paper-ink)]"
                />
                <span className="w-10 text-end font-mono text-[0.75rem] text-paper-ink-2 tabular">
                  {split}%
                </span>
              </div>
            ) : null}

            {showPins && showBeforeLayer && selectedFinding ? (
              <div className="surface-paper mt-3 rounded-tile p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.75rem] font-semibold ${SEV[selectedFinding.f.severity]}`}
                  >
                    {selectedFinding.f.severity} · {selectedFinding.f.rule}
                    {selectedFinding.n > 1 ? ` × ${selectedFinding.n}` : ""}
                  </span>
                  <span className="font-mono text-[0.75rem] text-paper-ink-2 tabular">
                    before.html:{selectedFinding.f.line}
                  </span>
                </div>
                <p className="mt-2 text-[0.875rem] text-paper-ink">
                  <strong>Fix:</strong> {selectedFinding.f.fix}
                </p>
                {selectedFinding.f.snippet ? (
                  <code className="mt-2 block overflow-x-auto rounded-ctl bg-paper-2 px-3 py-1.5 text-[0.75rem] text-paper-ink">
                    {selectedFinding.f.snippet}
                  </code>
                ) : null}
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[0.75rem] text-paper-ink-2">
              <span className="flex items-center gap-2">
                <EvidenceStamp label="rendered" tone="paper" /> Captured in
                Chromium at {w} × {h}
              </span>
              <span className="flex flex-wrap gap-4">
                <a
                  href={item.liveBefore}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-paper-ink underline decoration-paper-line underline-offset-4 hover:decoration-paper-ink"
                >
                  Open default HTML <PixelIcon name="external" size={10} />
                </a>
                <a
                  href={item.liveAfter}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-paper-ink underline decoration-paper-ink underline-offset-4"
                >
                  Open Pixelcraft HTML <PixelIcon name="external" size={10} />
                </a>
              </span>
            </div>
          </div>
        ) : null}

        {workbench === "code" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="overflow-hidden rounded-card border border-paper-line bg-void text-ink">
              <div className="flex items-center justify-between border-b border-line px-4 py-2.5 font-mono text-[0.75rem]">
                <span className="text-p0">Default agent pattern</span>
                <span className="text-ink-faint">{item.codeDiff.language}</span>
              </div>
              <pre className="overflow-x-auto p-4 text-[0.8125rem] leading-relaxed text-ink-muted">
                <code>{item.codeDiff.before}</code>
              </pre>
            </div>
            <div className="overflow-hidden rounded-card border border-paper-ink bg-void text-ink">
              <div className="flex items-center justify-between border-b border-line px-4 py-2.5 font-mono text-[0.75rem]">
                <span className="text-action">Idiomatic Pixelcraft</span>
                <span className="text-ink-faint">{item.codeDiff.language}</span>
              </div>
              <pre className="overflow-x-auto p-4 text-[0.8125rem] leading-relaxed text-ink">
                <code>{item.codeDiff.after}</code>
              </pre>
            </div>
            <p className="font-mono text-[0.75rem] text-paper-ink-2 md:col-span-2">
              {item.codeDiff.note}
            </p>
          </div>
        ) : null}

        {workbench === "notes" ? (
          <div className="grid gap-4">
            <div className="surface-paper rounded-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-mono text-[0.8125rem] font-semibold text-paper-ink">
                  slop-scan.mjs findings on default output
                </h4>
                <EvidenceStamp label="static" tone="paper" />
              </div>
              <ul className="mt-4 grid gap-2">
                {grouped.map(({ f, n }) => (
                  <li
                    key={f.rule}
                    className="rounded-tile border border-paper-line bg-paper p-3 text-[0.8125rem]"
                  >
                    <div className="flex flex-wrap items-center gap-2 font-mono">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold ${SEV[f.severity]}`}
                      >
                        {f.severity}
                      </span>
                      <span className="font-semibold text-paper-ink">
                        {f.rule}
                        {n > 1 ? ` × ${n}` : ""}
                      </span>
                      <span className="ms-auto text-paper-ink-2 tabular">
                        line {f.line}
                      </span>
                    </div>
                    <p className="mt-1.5 text-paper-ink-2">{f.fix}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface-paper rounded-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-mono text-[0.8125rem] font-semibold text-paper-ink">
                  Critique beyond static scanning
                </h4>
                <EvidenceStamp label="model-judgment" tone="paper" />
              </div>
              <ul className="mt-3 grid gap-2 text-[0.9375rem] leading-relaxed text-paper-ink-2">
                {item.judgment.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <span aria-hidden="true" className="text-paper-ink">
                      —
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>

      <aside className="surface-paper grid gap-5 rounded-card p-6 lg:col-span-4">
        <div>
          <p className="font-mono text-[0.75rem] font-medium text-paper-ink-2">
            {item.stackLabel} · {item.mode}
          </p>
          <h3 className="mt-1.5 display-wide text-[1.625rem] leading-[1.06] text-paper-ink">
            {item.title}
          </h3>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-paper-ink-2">
            {item.brief}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-3 border-y border-paper-line py-4">
          <div>
            <dt className="font-mono text-[0.6875rem] text-paper-ink-2 uppercase">
              Default scan
            </dt>
            <dd className="mt-1 display-wide text-[2rem] leading-none text-paper-p0 tabular">
              {item.scanBefore.score}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[0.6875rem] text-paper-ink-2 uppercase">
              Pixelcraft scan
            </dt>
            <dd className="mt-1 display-wide text-[2rem] leading-none text-paper-ink tabular">
              {item.scanAfter.score}
            </dd>
          </div>
        </dl>

        <div>
          <h4 className="font-mono text-[0.75rem] font-semibold text-paper-ink">
            Committed direction: {item.direction}
          </h4>
          <ul className="mt-3 grid gap-2 text-[0.875rem] leading-relaxed text-paper-ink-2">
            {item.decisions.map((d) => (
              <li key={d} className="flex gap-2">
                <PixelIcon
                  name="check"
                  size={11}
                  className="mt-1.5 text-paper-ink"
                />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-paper-line pt-4">
          <p className="font-mono text-[0.75rem] text-paper-ink-2">
            Skills routed
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {item.skills.map((s) => (
              <li
                key={s}
                className="rounded-full border border-paper-line bg-paper px-2.5 py-1 font-mono text-[0.75rem] text-paper-ink"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-paper-line pt-4">
          <p className="flex items-center gap-2 font-mono text-[0.75rem] text-paper-ink-2">
            <EvidenceStamp label="not-checked" tone="paper" /> Scope limits
          </p>
          <ul className="mt-2 grid gap-1 text-[0.8125rem] leading-relaxed text-paper-ink-2">
            {item.limits.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

export function Gallery() {
  const [active, setActive] = useState(GALLERY[0].id);

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-title"
      className="mx-2 my-6 rounded-sheet bg-paper text-paper-ink sm:mx-4"
    >
      <div className="mx-auto max-w-[84rem] px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="font-mono text-[0.8125rem] font-medium text-paper-ink-2">
              Multi-stack proof workbench · {GALLERY.length} surfaces
            </p>
            <h2
              id="gallery-title"
              className="mt-2 max-w-[18ch] display-wide text-[clamp(2rem,4vw,3.5rem)] leading-[1.02] text-paper-ink"
            >
              Not just React landing pages. Six real surface diffs.
            </h2>
          </div>
          <p className="max-w-[44ch] text-[1rem] leading-relaxed text-paper-ink-2 lg:col-span-5">
            Compare default agent output against Pixelcraft across web commerce,
            WCAG forms, linear-scale dataviz, Rust Ratatui TUI, SwiftUI Dynamic
            Type mobile, and Typst PDF + MJML email — with interactive scan pins
            and target-language code diffs.
          </p>
        </div>

        <div className="mt-10">
          <Tabs
            items={GALLERY}
            value={active}
            onChange={setActive}
            label="Multi-stack gallery exhibits"
            listClassName="mb-8 flex flex-wrap gap-2"
            tabClassName={(selected) =>
              `inline-flex min-h-11 items-center gap-2.5 rounded-full border px-4 py-2 text-start transition-colors duration-150 motion-reduce:transition-none ${
                selected
                  ? "border-paper-ink bg-paper-ink text-paper"
                  : "border-paper-line bg-paper-2 text-paper-ink hover:bg-paper"
              }`
            }
            renderTab={(item, _, selected) => (
              <>
                <span className="font-medium text-[0.875rem]">
                  {item.title}
                </span>
                <span
                  className={`font-mono text-[0.75rem] ${
                    selected ? "text-action" : "text-paper-ink-2"
                  }`}
                >
                  {item.stackShort}
                </span>
              </>
            )}
            renderPanel={(item) => <ExhibitWorkbench item={item} />}
          />
        </div>
      </div>
    </section>
  );
}
