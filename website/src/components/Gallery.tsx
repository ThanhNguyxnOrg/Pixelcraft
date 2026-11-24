import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  GALLERY,
  REPO_URL,
  type Ecosystem,
  type GalleryItem,
  type ScanFinding,
} from "../data";
import galleryMeta from "../generated/gallery.json";
import { EvidenceStamp, PixelIcon } from "./pixel";
import { Tabs } from "./Tabs";

type ViewMode = "compare" | "before" | "after" | "live";
type WorkbenchTab = "visual" | "code" | "notes";
type EcosystemFilter = "All" | Ecosystem;
type ModeFilter = "All" | GalleryItem["mode"];

const ECOSYSTEMS: EcosystemFilter[] = [
  "All",
  "Mobile",
  "Desktop & TUI",
  "AI & Data",
  "Web & SSR",
  "Channels & HUD",
];

const MODES: ModeFilter[] = ["All", "Persuade", "Operate", "Communicate"];

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
  const [liveSide, setLiveSide] = useState<"after" | "before">("after");
  const [split, setSplit] = useState(50);
  const [showPins, setShowPins] = useState(true);
  const [activeRule, setActiveRule] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [scale, setScale] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);

  const w = galleryMeta.viewport.w;
  const h = galleryMeta.viewport.h;

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => {
      const width = el.clientWidth;
      if (width > 0) setScale(width / w);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, view, item.id, workbench]);

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

  const clipRight =
    view === "before" ? "0%" : `${Math.max(0, Math.min(100, 100 - split))}%`;
  const showBeforeLayer = view === "compare" || view === "before";

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(item.prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

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
                ["code", `Prompt & code · ${item.stackShort}`],
                ["notes", `Audit (${grouped.length})`],
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

          <div className="flex flex-wrap items-center gap-2.5">
            {workbench === "visual" ? (
              <>
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
                      ["live", "Live"],
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
                {view === "live" ? (
                  <div
                    role="group"
                    aria-label="Live frame source"
                    className="inline-flex rounded-full border border-paper-line bg-paper-2 p-1 font-mono text-[0.75rem]"
                  >
                    {(
                      [
                        ["after", "Crafted"],
                        ["before", "Default"],
                      ] as const
                    ).map(([side, label]) => (
                      <button
                        key={side}
                        type="button"
                        aria-pressed={liveSide === side}
                        onClick={() => setLiveSide(side)}
                        className={`min-h-8 rounded-full px-2.5 transition-colors duration-150 motion-reduce:transition-none ${
                          liveSide === side
                            ? "bg-paper-ink text-paper"
                            : "text-paper-ink-2 hover:text-paper-ink"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                ) : view !== "after" && pinned.length > 0 ? (
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
              </>
            ) : null}
            <a
              href={item.liveAfter}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-paper-ink px-3.5 font-mono text-[0.75rem] font-medium text-paper transition-opacity duration-150 hover:opacity-90 motion-reduce:transition-none"
            >
              Open demo <PixelIcon name="external" size={10} />
            </a>
          </div>
        </div>

        {workbench === "visual" ? (
          <div>
            <div className="relative overflow-hidden rounded-card border border-paper-line bg-paper-ink">
              <div
                ref={stageRef}
                className="relative overflow-hidden select-none"
                style={{ aspectRatio: `${w} / ${h}` } as CSSProperties}
              >
                {view === "live" ? (
                  <div className="absolute inset-0 overflow-hidden bg-void">
                    <iframe
                      key={`${item.id}-${liveSide}`}
                      src={
                        liveSide === "after" ? item.liveAfter : item.liveBefore
                      }
                      title={`${item.title} (${liveSide === "after" ? "with Pixelcraft" : "default agent"})`}
                      sandbox="allow-scripts"
                      style={{
                        width: `${w}px`,
                        height: `${h}px`,
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                      }}
                      className="block border-0"
                    />
                  </div>
                ) : (
                  <>
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
                                isSelected
                                  ? "scale-125 ring-2 ring-paper-ink"
                                  : ""
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
                  </>
                )}
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
                <EvidenceStamp label="rendered" tone="paper" />{" "}
                {view === "live"
                  ? `Interactive HTML scaled from ${w} × ${h}`
                  : `Captured in Chromium at ${w} × ${h}`}
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
          <div className="grid min-w-0 gap-4">
            <div className="surface-paper rounded-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-[0.75rem] font-semibold text-paper-ink uppercase">
                  Shared user prompt
                </p>
                <button
                  type="button"
                  onClick={copyPrompt}
                  className="inline-flex items-center gap-1.5 rounded-full border border-paper-line bg-paper px-3 py-1 font-mono text-[0.75rem] text-paper-ink transition-colors duration-150 hover:border-paper-ink motion-reduce:transition-none"
                >
                  <PixelIcon name={copied ? "check" : "copy"} size={10} />
                  {copied ? "Copied" : "Copy prompt"}
                </button>
              </div>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-paper-ink">
                “{item.prompt}”
              </p>
            </div>

            <div className="grid min-w-0 gap-4 md:grid-cols-2">
              <div className="min-w-0 overflow-hidden rounded-card border border-paper-line bg-void text-ink">
                <div className="flex items-center justify-between border-b border-line px-4 py-2.5 font-mono text-[0.75rem]">
                  <span className="text-p0">Default agent pattern</span>
                  <span className="text-ink-faint">
                    {item.codeDiff.language}
                  </span>
                </div>
                <pre className="overflow-x-auto p-4 text-[0.8125rem] leading-relaxed text-ink-muted">
                  <code>{item.codeDiff.before}</code>
                </pre>
              </div>
              <div className="min-w-0 overflow-hidden rounded-card border border-paper-ink bg-void text-ink">
                <div className="flex items-center justify-between border-b border-line px-4 py-2.5 font-mono text-[0.75rem]">
                  <span className="text-action">Idiomatic Pixelcraft</span>
                  <span className="text-ink-faint">
                    {item.codeDiff.language}
                  </span>
                </div>
                <pre className="overflow-x-auto p-4 text-[0.8125rem] leading-relaxed text-ink">
                  <code>{item.codeDiff.after}</code>
                </pre>
              </div>
              <p className="font-mono text-[0.75rem] text-paper-ink-2 md:col-span-2">
                {item.codeDiff.note}
              </p>
            </div>
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

      <aside className="surface-paper grid min-w-0 gap-5 rounded-card p-6 lg:col-span-4">
        <div>
          <p className="font-mono text-[0.75rem] font-medium text-paper-ink-2">
            {item.ecosystem} · {item.stackLabel} · {item.mode}
          </p>
          <h3 className="mt-1.5 display-wide text-[1.625rem] leading-[1.06] text-paper-ink">
            {item.title}
          </h3>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-paper-ink-2">
            {item.brief}
          </p>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 border-y border-paper-line py-4">
          <dl className="flex items-end gap-6">
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
            <p className="font-mono text-[0.6875rem] text-paper-ink-2 uppercase text-end">
              Palette
            </p>
            <div
              aria-label="Crafted palette tokens"
              className="mt-1.5 flex items-center gap-1.5"
            >
              {item.palette.map((hex) => (
                <span
                  key={hex}
                  title={hex}
                  style={{ backgroundColor: hex }}
                  className="size-6 rounded-full border border-paper-line"
                />
              ))}
            </div>
          </div>
        </div>

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
                  className="mt-1.5 shrink-0 text-paper-ink"
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
              <li key={s}>
                <a
                  href={`${REPO_URL}/tree/main/skills/${s}`}
                  className="inline-block rounded-full border border-paper-line bg-paper px-2.5 py-1 font-mono text-[0.75rem] text-paper-ink transition-colors duration-150 hover:border-paper-ink hover:bg-paper-ink hover:text-paper motion-reduce:transition-none"
                >
                  {s}
                </a>
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
  const [ecoFilter, setEcoFilter] = useState<EcosystemFilter>("All");
  const [modeFilter, setModeFilter] = useState<ModeFilter>("All");
  const [active, setActive] = useState(GALLERY[0].id);
  const workbenchAnchor = useRef<HTMLDivElement>(null);

  const visibleItems = useMemo(
    () =>
      GALLERY.filter(
        (g) =>
          (ecoFilter === "All" || g.ecosystem === ecoFilter) &&
          (modeFilter === "All" || g.mode === modeFilter),
      ),
    [ecoFilter, modeFilter],
  );

  const items = visibleItems.length > 0 ? visibleItems : GALLERY;
  const activeId = items.some((g) => g.id === active) ? active : items[0].id;

  const ecoCount = (eco: EcosystemFilter) =>
    eco === "All"
      ? GALLERY.length
      : GALLERY.filter((g) => g.ecosystem === eco).length;

  const selectCard = (nextId: string) => {
    setActive(nextId);
    workbenchAnchor.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

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
              Multi-stack proof workbench · {GALLERY.length} surfaces · 5
              ecosystems
            </p>
            <h2
              id="gallery-title"
              className="mt-2 max-w-[18ch] display-wide text-[clamp(2rem,4vw,3.5rem)] leading-[1.02] text-paper-ink"
            >
              Not just React landing pages. {GALLERY.length} real surface diffs.
            </h2>
          </div>
          <p className="max-w-[46ch] text-[1rem] leading-relaxed text-paper-ink-2 lg:col-span-5">
            Compare default agent output against Pixelcraft across SwiftUI,
            Jetpack Compose, Flutter, Rust Ratatui, Tauri v2, Python marimo,
            Elixir LiveView, MJML email, Typst PDF, Godot 4.5 HUD, and modern
            web frameworks — with live interactive stages, scan pins, and direct
            demo links.
          </p>
        </div>

        <div
          ref={workbenchAnchor}
          className="mt-10 flex flex-wrap items-center justify-between gap-3 border-b border-paper-line pb-4"
        >
          <div
            role="group"
            aria-label="Filter exhibits by ecosystem"
            className="flex flex-wrap gap-1 rounded-full border border-paper-line bg-paper-2 p-1"
          >
            {ECOSYSTEMS.map((eco) => {
              const on = ecoFilter === eco;
              return (
                <button
                  key={eco}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setEcoFilter(eco);
                    const next = GALLERY.filter(
                      (g) =>
                        (eco === "All" || g.ecosystem === eco) &&
                        (modeFilter === "All" || g.mode === modeFilter),
                    );
                    if (next.length && !next.some((g) => g.id === active)) {
                      setActive(next[0].id);
                    } else if (!next.length) {
                      setModeFilter("All");
                    }
                  }}
                  className={`min-h-9 rounded-full px-3.5 font-mono text-[0.75rem] transition-colors duration-150 motion-reduce:transition-none ${
                    on
                      ? "bg-paper-ink font-medium text-paper"
                      : "text-paper-ink-2 hover:bg-paper hover:text-paper-ink"
                  }`}
                >
                  {eco}{" "}
                  <span className="opacity-65 tabular">{ecoCount(eco)}</span>
                </button>
              );
            })}
          </div>

          <div
            role="group"
            aria-label="Filter exhibits by surface mode"
            className="inline-flex flex-wrap gap-1 rounded-full border border-paper-line bg-paper-2 p-1"
          >
            {MODES.map((m) => {
              const on = modeFilter === m;
              return (
                <button
                  key={m}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setModeFilter(m);
                    const next = GALLERY.filter(
                      (g) =>
                        (ecoFilter === "All" || g.ecosystem === ecoFilter) &&
                        (m === "All" || g.mode === m),
                    );
                    if (next.length && !next.some((g) => g.id === active)) {
                      setActive(next[0].id);
                    }
                  }}
                  className={`min-h-8 rounded-full px-3 font-mono text-[0.75rem] transition-colors duration-150 motion-reduce:transition-none ${
                    on
                      ? "bg-paper-ink font-medium text-paper"
                      : "text-paper-ink-2 hover:bg-paper hover:text-paper-ink"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <Tabs
            items={items}
            value={activeId}
            onChange={setActive}
            label="Multi-stack gallery exhibits"
            listClassName="mb-8 flex gap-2 overflow-x-auto pb-2"
            tabClassName={(selected) =>
              `inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-full border px-4 py-2 text-start whitespace-nowrap transition-colors duration-150 motion-reduce:transition-none ${
                selected
                  ? "border-paper-ink bg-paper-ink text-paper"
                  : "border-paper-line bg-paper-2 text-paper-ink hover:bg-paper"
              }`
            }
            renderTab={(item, idx, selected) => (
              <>
                <span className="font-mono text-[0.6875rem] opacity-60 tabular">
                  {String(idx + 1).padStart(2, "0")}
                </span>
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

        <div className="mt-14 border-t border-paper-line pt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[0.75rem] text-paper-ink-2 uppercase">
                Contact sheet · {items.length} of {GALLERY.length} surfaces
              </p>
              <h3 className="mt-1.5 display-wide text-[1.5rem] leading-tight text-paper-ink">
                Browse every stack &amp; open standalone demos
              </h3>
            </div>
            <p className="font-mono text-[0.75rem] text-paper-ink-2">
              Select a card to compare in the workbench above, or open the full
              standalone page directly
            </p>
          </div>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((g) => {
              const selected = g.id === activeId;
              return (
                <li
                  key={g.id}
                  className={`flex h-full flex-col overflow-hidden rounded-card border transition-colors duration-150 motion-reduce:transition-none ${
                    selected
                      ? "border-paper-ink bg-paper-ink text-paper ring-2 ring-paper-ink"
                      : "border-paper-line bg-paper-2 text-paper-ink hover:border-paper-ink hover:bg-paper"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => selectCard(g.id)}
                    aria-pressed={selected}
                    className="flex flex-1 flex-col text-start"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-paper-ink">
                      <img
                        src={g.after}
                        alt=""
                        width={480}
                        height={300}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute start-2.5 top-2.5 rounded-full bg-paper-ink px-2.5 py-1 font-mono text-[0.6875rem] font-medium text-paper">
                        {g.stackShort}
                      </span>
                      <span className="absolute end-2.5 top-2.5 rounded-full bg-paper px-2 py-0.5 font-mono text-[0.6875rem] font-semibold text-paper-ink tabular">
                        {g.scanBefore.score} → {g.scanAfter.score}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-2.5 p-4 pb-3">
                      <div>
                        <p
                          className={`font-mono text-[0.6875rem] uppercase ${
                            selected ? "text-paper/75" : "text-paper-ink-2"
                          }`}
                        >
                          {g.ecosystem} · {g.mode}
                        </p>
                        <p className="mt-1 font-semibold tracking-tight text-[0.98rem] leading-snug">
                          {g.title}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-1">
                          {g.palette.map((hex) => (
                            <span
                              key={hex}
                              style={{ backgroundColor: hex }}
                              className="size-3.5 rounded-full border border-paper-line"
                            />
                          ))}
                        </div>
                        <span
                          className={`font-mono text-[0.6875rem] ${
                            selected
                              ? "text-action font-medium"
                              : "text-paper-ink-2"
                          }`}
                        >
                          {selected ? "● In stage" : "Compare ↑"}
                        </span>
                      </div>
                    </div>
                  </button>

                  <div
                    className={`flex items-center justify-between gap-2 border-t px-4 py-2.5 font-mono text-[0.75rem] ${
                      selected
                        ? "border-paper/15 bg-paper/8"
                        : "border-paper-line bg-paper"
                    }`}
                  >
                    <a
                      href={g.liveAfter}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline ${
                        selected ? "text-action" : "text-paper-ink"
                      }`}
                    >
                      Open demo <PixelIcon name="external" size={9} />
                    </a>
                    <a
                      href={g.liveBefore}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1 underline-offset-4 hover:underline ${
                        selected ? "text-paper/75" : "text-paper-ink-2"
                      }`}
                    >
                      Default <PixelIcon name="external" size={9} />
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
