import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  GALLERY,
  REPO_URL,
  type Ecosystem,
  type GalleryItem,
  type ScanFinding,
} from "../data";
import galleryMeta from "../generated/gallery.json";
import { onJump, readUrlParam, writeUrlParams } from "../lib/urlState";
import { EvidenceStamp, PixelIcon, PixelLabel, Reveal } from "./pixel";
import { Tabs } from "./Tabs";

type StageTab = "compare" | "after" | "before" | "live" | "code" | "notes";
type LiveViewport = "desktop" | "mobile";
type EcosystemFilter = "All" | Ecosystem;
type ModeFilter = "All" | GalleryItem["mode"];

const VALID_STAGE_TABS = new Set<StageTab>([
  "compare",
  "after",
  "before",
  "live",
  "code",
  "notes",
]);

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
  const [tab, setTab] = useState<StageTab>(() => {
    const raw = readUrlParam("view") as StageTab | null;
    return raw && VALID_STAGE_TABS.has(raw) ? raw : "compare";
  });
  const [liveSide, setLiveSide] = useState<"after" | "before">("after");
  const [liveViewport, setLiveViewport] = useState<LiveViewport>(() =>
    typeof window !== "undefined" && window.innerWidth < 640
      ? "mobile"
      : "desktop",
  );
  const [split, setSplit] = useState(50);
  const [showPins, setShowPins] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 640 : true,
  );
  const [activeRule, setActiveRule] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [sharedLink, setSharedLink] = useState(false);
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
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
  }, [w, tab, item.id, liveViewport]);

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

  const isVisualStage =
    tab === "compare" || tab === "after" || tab === "before" || tab === "live";
  const clipRight =
    tab === "before" ? "0%" : `${Math.max(0, Math.min(100, 100 - split))}%`;
  const showBeforeLayer = tab === "compare" || tab === "before";

  const updateSplitFromPointer = (clientX: number) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const pct = Math.round(
      Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)),
    );
    setSplit(pct);
  };

  const onStagePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (tab !== "compare") return;
    if ((e.target as HTMLElement).closest("button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    updateSplitFromPointer(e.clientX);
  };

  const onStagePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging || tab !== "compare") return;
    updateSplitFromPointer(e.clientX);
  };

  const stopDragging = () => {
    if (dragging) setDragging(false);
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(item.prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  const selectStageTab = (next: StageTab) => {
    setTab(next);
    writeUrlParams({
      exhibit: item.id,
      view: next === "compare" ? null : next,
    });
  };

  const shareDeepLink = async () => {
    writeUrlParams(
      { exhibit: item.id, view: tab === "compare" ? null : tab },
      "#gallery",
    );
    try {
      await navigator.clipboard.writeText(window.location.href);
      setSharedLink(true);
      window.setTimeout(() => setSharedLink(false), 1600);
    } catch {}
  };

  const stageTabs: [StageTab, string, string][] = [
    ["compare", "Split", "Split"],
    ["after", "Crafted", "Crafted"],
    ["before", "Default", "Default"],
    ["live", "Live UI", "Live UI"],
    ["code", "Code", "Prompt & Code"],
    ["notes", `Audit (${grouped.length})`, `Audit (${grouped.length})`],
  ];

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
      <div className="min-w-0 lg:col-span-8">
        {/* Single unified mode toolbar — rounded-tile on container so multi-row mobile grids never warp into ovals */}
        <div className="mb-3 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div
            role="group"
            aria-label="Workbench view"
            className="grid grid-cols-3 gap-1 rounded-tile border border-paper-line bg-paper-2 p-1 sm:inline-flex sm:flex-wrap"
          >
            {stageTabs.map(([id, mobileLabel, desktopLabel]) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => selectStageTab(id)}
                  className={`min-h-10 rounded-ctl px-2.5 font-mono text-[0.75rem] font-medium transition-colors duration-150 sm:px-3.5 sm:text-[0.8125rem] motion-reduce:transition-none ${
                    active
                      ? "bg-paper-ink text-paper"
                      : "text-paper-ink hover:bg-paper-card"
                  }`}
                >
                  <span className="sm:hidden">{mobileLabel}</span>
                  <span className="hidden sm:inline">{desktopLabel}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
            {tab === "live" ? (
              <>
                <div
                  role="group"
                  aria-label="Live preview viewport"
                  className="inline-flex rounded-ctl border border-paper-line bg-paper-2 p-1 font-mono text-[0.75rem]"
                >
                  {(
                    [
                      ["mobile", "Mobile 390", "phone"],
                      ["desktop", "Desktop 1440", "monitor"],
                    ] as const
                  ).map(([vp, label, icon]) => (
                    <button
                      key={vp}
                      type="button"
                      aria-pressed={liveViewport === vp}
                      onClick={() => setLiveViewport(vp)}
                      className={`inline-flex min-h-9 items-center gap-1.5 rounded-ctl px-2.5 font-medium transition-colors duration-150 motion-reduce:transition-none ${
                        liveViewport === vp
                          ? "bg-paper-ink text-paper"
                          : "text-paper-ink-2 hover:text-paper-ink"
                      }`}
                    >
                      <PixelIcon name={icon} size={11} />
                      {label}
                    </button>
                  ))}
                </div>
                <div
                  role="group"
                  aria-label="Live frame source"
                  className="inline-flex rounded-ctl border border-paper-line bg-paper-2 p-1 font-mono text-[0.75rem]"
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
                      className={`min-h-9 rounded-ctl px-2.5 font-medium transition-colors duration-150 motion-reduce:transition-none ${
                        liveSide === side
                          ? "bg-paper-ink text-paper"
                          : "text-paper-ink-2 hover:text-paper-ink"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            ) : showBeforeLayer && pinned.length > 0 ? (
              <button
                type="button"
                aria-pressed={showPins}
                onClick={() => setShowPins(!showPins)}
                className={`inline-flex min-h-10 items-center gap-2 rounded-ctl border px-3 font-mono text-[0.75rem] font-medium transition-colors duration-150 motion-reduce:transition-none ${
                  showPins
                    ? "border-paper-ink bg-paper-ink text-paper"
                    : "border-paper-line bg-paper-card text-paper-ink hover:border-paper-ink"
                }`}
              >
                <PixelIcon name="pin" size={11} />
                {showPins
                  ? `Hide pins (${pinned.length})`
                  : `Show pins (${pinned.length})`}
              </button>
            ) : null}
          </div>
        </div>

        {isVisualStage ? (
          <div>
            <div className="overflow-hidden rounded-card border border-paper-line bg-paper-ink">
              {/* Dedicated non-overlapping score & standalone launch bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-void px-3 py-2 text-ink sm:px-4 sm:py-2.5">
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-[0.6875rem] sm:gap-2 sm:text-[0.75rem]">
                  <span
                    data-comparison-label
                    className="inline-flex items-center gap-1 rounded-full border border-line bg-panel px-2 py-0.5 text-p0 tabular sm:px-2.5 sm:py-1"
                  >
                    Default: <strong>{item.scanBefore.score}</strong>
                  </span>
                  <span aria-hidden="true" className="text-ink-faint">
                    →
                  </span>
                  <span
                    data-comparison-label
                    className="inline-flex items-center gap-1 rounded-full bg-action px-2 py-0.5 font-semibold text-on-action tabular sm:px-2.5 sm:py-1"
                  >
                    Crafted: {item.scanAfter.score}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={shareDeepLink}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line bg-panel px-3 font-mono text-[0.75rem] text-ink-muted transition-colors hover:border-action hover:text-action motion-reduce:transition-none"
                  >
                    <PixelIcon name={sharedLink ? "check" : "copy"} size={11} />
                    <span>{sharedLink ? "Link copied" : "Share"}</span>
                  </button>
                  <a
                    href={item.liveAfter}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-action bg-raised px-3 font-mono text-[0.75rem] font-semibold text-action transition-colors duration-150 hover:bg-action hover:text-on-action sm:px-3.5 motion-reduce:transition-none"
                  >
                    Open demo <PixelIcon name="external" size={10} />
                  </a>
                </div>
              </div>

              {tab === "live" && liveViewport === "mobile" ? (
                <div className="flex flex-col items-center justify-center bg-deep p-2 sm:p-5">
                  <div className="w-full max-w-[390px] overflow-hidden rounded-[1.5rem] border-2 border-line-strong bg-void shadow-lift">
                    <div className="flex items-center justify-between border-b border-line bg-panel px-3.5 py-2 font-mono text-[0.6875rem] text-ink-muted">
                      <span>390 × 680 mobile viewport</span>
                      <span className="text-action">
                        {liveSide === "after" ? "Pixelcraft UI" : "Default UI"}
                      </span>
                    </div>
                    <iframe
                      key={`${item.id}-${liveSide}-mobile`}
                      src={
                        liveSide === "after" ? item.liveAfter : item.liveBefore
                      }
                      title={`${item.title} mobile view (${liveSide === "after" ? "with Pixelcraft" : "default agent"})`}
                      sandbox="allow-scripts"
                      className="block h-[34rem] w-full border-0 bg-void sm:h-[40rem]"
                    />
                  </div>
                </div>
              ) : (
                <div
                  ref={stageRef}
                  onPointerDown={onStagePointerDown}
                  onPointerMove={onStagePointerMove}
                  onPointerUp={stopDragging}
                  onPointerCancel={stopDragging}
                  className={`relative overflow-hidden select-none ${
                    tab === "compare" ? "cursor-ew-resize touch-pan-y" : ""
                  }`}
                  style={{ aspectRatio: `${w} / ${h}` } as CSSProperties}
                >
                  {tab === "live" ? (
                    <div className="absolute inset-0 overflow-hidden bg-void">
                      <iframe
                        key={`${item.id}-${liveSide}-desktop`}
                        src={
                          liveSide === "after"
                            ? item.liveAfter
                            : item.liveBefore
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
                        draggable={false}
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
                            draggable={false}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        </div>
                      ) : null}

                      {tab === "compare" ? (
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-y-0 w-0.5 bg-action shadow-[0_0_0_1px_var(--color-paper-ink)]"
                          style={{ left: `${split}%` }}
                        >
                          <span className="absolute top-1/2 left-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-paper-ink bg-action text-on-action sm:size-10">
                            <PixelIcon name="drag" size={14} />
                          </span>
                        </div>
                      ) : null}

                      {showPins && showBeforeLayer
                        ? pinned.map(({ f }, idx) => {
                            if (!f.pin) return null;
                            const visibleInSplit =
                              tab === "before" || f.pin.x <= split - 2;
                            if (!visibleInSplit) return null;
                            const isSelected =
                              selectedFinding?.f.rule === f.rule;
                            return (
                              <button
                                key={f.rule}
                                type="button"
                                onClick={() => setActiveRule(f.rule)}
                                aria-label={`Inspect finding ${idx + 1}: ${f.severity} ${f.rule}`}
                                aria-pressed={isSelected}
                                style={{
                                  left: `${Math.min(93, Math.max(7, f.pin.x))}%`,
                                  top: `${Math.min(90, Math.max(10, f.pin.y))}%`,
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
                    </>
                  )}
                </div>
              )}
            </div>

            {tab === "compare" ? (
              <div className="mt-3 flex flex-wrap items-center gap-3 rounded-tile border border-paper-line bg-paper-2 px-3.5 py-2 sm:px-4">
                <label
                  htmlFor={`split-${item.id}`}
                  className="font-mono text-[0.75rem] font-medium whitespace-nowrap text-paper-ink"
                >
                  Drag or slide
                </label>
                <input
                  id={`split-${item.id}`}
                  type="range"
                  min={0}
                  max={100}
                  value={split}
                  onChange={(e) => setSplit(Number(e.target.value))}
                  aria-valuetext={`${split}% default agent, ${100 - split}% Pixelcraft`}
                  className="min-h-8 min-w-[8rem] flex-1 cursor-ew-resize accent-[var(--color-paper-ink)]"
                />
                <div
                  role="group"
                  aria-label="Split presets"
                  className="flex items-center gap-1 font-mono text-[0.75rem]"
                >
                  {[
                    [0, "Crafted"],
                    [50, "50/50"],
                    [100, "Default"],
                  ].map(([val, text]) => (
                    <button
                      key={text}
                      type="button"
                      onClick={() => setSplit(Number(val))}
                      className={`min-h-8 rounded-ctl px-2.5 font-medium transition-colors motion-reduce:transition-none ${
                        split === val
                          ? "bg-paper-ink text-paper"
                          : "bg-paper-card text-paper-ink hover:border-paper-ink"
                      }`}
                    >
                      {text}
                    </button>
                  ))}
                </div>
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
                <p className="mt-2 text-[0.875rem] leading-relaxed text-paper-ink">
                  <strong>Fix:</strong> {selectedFinding.f.fix}
                </p>
                {selectedFinding.f.snippet ? (
                  <code className="mt-2 block overflow-x-auto rounded-ctl bg-paper-2 px-3 py-2 text-[0.75rem] text-paper-ink">
                    {selectedFinding.f.snippet}
                  </code>
                ) : null}
              </div>
            ) : null}

            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 font-mono text-[0.75rem] text-paper-ink-2">
              <span className="flex items-center gap-2">
                <EvidenceStamp label="rendered" tone="paper" />{" "}
                {tab === "live"
                  ? liveViewport === "mobile"
                    ? "Interactive HTML at 390px mobile width"
                    : `Interactive HTML scaled from ${w} × ${h}`
                  : `Captured in Chromium at ${w} × ${h}`}
              </span>
              <span className="flex flex-wrap gap-2">
                <a
                  href={item.liveBefore}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-ctl border border-paper-line bg-paper-card px-3 text-paper-ink hover:border-paper-ink"
                >
                  Default HTML <PixelIcon name="external" size={10} />
                </a>
                <a
                  href={item.liveAfter}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-ctl border border-paper-ink bg-paper-ink px-3 font-semibold text-paper hover:opacity-90"
                >
                  Pixelcraft HTML <PixelIcon name="external" size={10} />
                </a>
              </span>
            </div>
          </div>
        ) : null}

        {tab === "code" ? (
          <div className="grid min-w-0 gap-4">
            <div className="surface-paper rounded-card p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-[0.75rem] font-semibold text-paper-ink uppercase">
                  Shared user prompt
                </p>
                <button
                  type="button"
                  onClick={copyPrompt}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-paper-line bg-paper px-3.5 font-mono text-[0.75rem] font-medium text-paper-ink transition-colors duration-150 hover:border-paper-ink motion-reduce:transition-none"
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
                  <span className="font-semibold text-p0">
                    Default agent pattern
                  </span>
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
                  <span className="font-semibold text-action">
                    Idiomatic Pixelcraft
                  </span>
                  <span className="text-ink-faint">
                    {item.codeDiff.language}
                  </span>
                </div>
                <pre className="overflow-x-auto p-4 text-[0.8125rem] leading-relaxed text-ink">
                  <code>{item.codeDiff.after}</code>
                </pre>
              </div>
              <p className="font-mono text-[0.75rem] leading-relaxed text-paper-ink-2 md:col-span-2">
                {item.codeDiff.note}
              </p>
            </div>
          </div>
        ) : null}

        {tab === "notes" ? (
          <div className="grid min-w-0 gap-4">
            <div className="surface-paper rounded-card p-4 sm:p-5">
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
                        className={`rounded-full border px-2 py-0.5 text-[0.75rem] font-semibold ${SEV[f.severity]}`}
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
                    <p className="mt-1.5 leading-relaxed text-paper-ink-2">
                      {f.fix}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface-paper rounded-card p-4 sm:p-5">
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

      <aside className="surface-paper grid min-w-0 gap-5 rounded-card p-5 sm:p-6 lg:col-span-4">
        <div>
          <p className="font-mono text-[0.75rem] font-semibold text-paper-ink-2">
            {item.ecosystem} · {item.stackLabel} · {item.mode}
          </p>
          <h3 className="mt-1.5 display-wide text-[1.5rem] leading-[1.08] text-paper-ink sm:text-[1.625rem]">
            {item.title}
          </h3>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-paper-ink-2">
            {item.brief}
          </p>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 border-y border-paper-line py-4">
          <dl className="flex items-end gap-6">
            <div>
              <dt className="font-mono text-[0.75rem] font-medium text-paper-ink-2 uppercase">
                Default scan
              </dt>
              <dd className="mt-1 display-wide text-[1.875rem] leading-none text-paper-p0 tabular sm:text-[2rem]">
                {item.scanBefore.score}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[0.75rem] font-medium text-paper-ink-2 uppercase">
                Pixelcraft
              </dt>
              <dd className="mt-1 display-wide text-[1.875rem] leading-none text-paper-ink tabular sm:text-[2rem]">
                {item.scanAfter.score}
              </dd>
            </div>
          </dl>

          <div>
            <p className="text-end font-mono text-[0.75rem] font-medium text-paper-ink-2 uppercase">
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
          <h4 className="font-mono text-[0.8125rem] font-semibold text-paper-ink">
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
          <p className="font-mono text-[0.75rem] font-medium text-paper-ink-2">
            Skills routed
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {item.skills.map((s) => (
              <li key={s}>
                <a
                  href={`${REPO_URL}/tree/main/skills/${s}`}
                  className="inline-flex min-h-9 items-center rounded-full border border-paper-line bg-paper px-3 font-mono text-[0.75rem] font-medium text-paper-ink transition-colors duration-150 hover:border-paper-ink hover:bg-paper-ink hover:text-paper motion-reduce:transition-none"
                >
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-paper-line pt-4">
          <p className="flex items-center gap-2 font-mono text-[0.75rem] font-medium text-paper-ink-2">
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
  const [active, setActive] = useState(() => {
    const initial = readUrlParam("exhibit");
    return initial && GALLERY.some((g) => g.id === initial)
      ? initial
      : GALLERY[0].id;
  });
  const [showAllSheet, setShowAllSheet] = useState(false);
  const workbenchAnchor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return onJump((detail) => {
      if (
        detail.kind === "exhibit" &&
        GALLERY.some((g) => g.id === detail.id)
      ) {
        setEcoFilter("All");
        setModeFilter("All");
        setActive(detail.id);
        writeUrlParams({
          exhibit: detail.id,
          view: detail.view === "compare" ? null : detail.view,
        });
      }
    });
  }, []);

  const pickActive = (nextId: string) => {
    setActive(nextId);
    writeUrlParams({ exhibit: nextId });
  };

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
  const activeIndex = Math.max(
    0,
    items.findIndex((g) => g.id === active),
  );
  const activeItem = items[activeIndex] ?? items[0];
  const activeId = activeItem.id;

  const ecoCount = (eco: EcosystemFilter) =>
    eco === "All"
      ? GALLERY.length
      : GALLERY.filter((g) => g.ecosystem === eco).length;

  const stepExhibit = (delta: number) => {
    const nextIdx = (activeIndex + delta + items.length) % items.length;
    pickActive(items[nextIdx].id);
  };

  const selectCard = (nextId: string) => {
    pickActive(nextId);
    workbenchAnchor.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

  const isFiltered = ecoFilter !== "All" || modeFilter !== "All";

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-title"
      className="mx-2 my-5 rounded-sheet bg-paper text-paper-ink sm:mx-4 sm:my-6"
    >
      <div className="mx-auto max-w-[84rem] px-4 py-12 sm:px-8 sm:py-16 lg:py-24">
        <div className="grid min-w-0 gap-4 lg:grid-cols-12 lg:items-end lg:gap-6">
          <div className="min-w-0 lg:col-span-7">
            <p className="font-mono text-[0.8125rem] font-semibold text-paper-ink-2">
              Multi-stack proof workbench · {GALLERY.length} surfaces · 5
              ecosystems
            </p>
            <h2
              id="gallery-title"
              className="mt-2 max-w-[18ch] display-wide text-[clamp(1.85rem,4vw,3.4rem)] leading-[1.03] text-balance text-paper-ink"
            >
              Not just React landing pages. {GALLERY.length} real surface diffs.
            </h2>
          </div>
          <p className="max-w-[48ch] text-[0.98rem] leading-relaxed text-paper-ink-2 sm:text-[1rem] lg:col-span-5">
            Compare default agent output against Pixelcraft across SwiftUI,
            Jetpack Compose, Flutter, Rust Ratatui, Tauri v2, Python marimo,
            Elixir LiveView, MJML email, Typst PDF, Godot 4.5 HUD, and modern
            web frameworks — with live mobile/desktop stages and direct demos.
          </p>
        </div>

        {/* Clean single-line scrollable filter rail on mobile; individual pill buttons on desktop */}
        <div
          ref={workbenchAnchor}
          className="mt-8 flex flex-col gap-3 border-b border-paper-line pb-4 lg:mt-10 lg:flex-row lg:items-center lg:justify-between"
        >
          <div
            role="group"
            aria-label="Filter exhibits by ecosystem"
            className="rail-scroll flex items-center gap-1.5 pb-1 lg:flex-wrap lg:pb-0"
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
                  className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border px-3.5 font-mono text-[0.75rem] font-medium transition-colors duration-150 motion-reduce:transition-none ${
                    on
                      ? "border-paper-ink bg-paper-ink text-paper"
                      : "border-paper-line bg-paper-card text-paper-ink hover:border-paper-ink"
                  }`}
                >
                  <span>{eco}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[0.6875rem] font-semibold tabular ${
                      on
                        ? "bg-action text-on-action"
                        : "bg-paper-2 text-paper-ink-2"
                    }`}
                  >
                    {ecoCount(eco)}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="group"
            aria-label="Filter exhibits by surface mode"
            className="rail-scroll flex items-center gap-1.5 pb-1 lg:pb-0"
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
                  className={`min-h-9 shrink-0 rounded-ctl border px-3 font-mono text-[0.75rem] font-medium transition-colors duration-150 motion-reduce:transition-none ${
                    on
                      ? "border-paper-ink bg-paper-ink text-paper"
                      : "border-paper-line bg-paper-2 text-paper-ink-2 hover:bg-paper-card hover:text-paper-ink"
                  }`}
                >
                  {m === "All" ? "All modes" : m}
                </button>
              );
            })}
          </div>
        </div>

        {/* Native picker + prev/next stepper for instant 1-tap exhibit switching on mobile & tablet */}
        <div className="mt-4 flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => stepExhibit(-1)}
            aria-label="Previous exhibit"
            className="grid size-11 shrink-0 place-items-center rounded-ctl border border-paper-line bg-paper-card text-paper-ink hover:border-paper-ink"
          >
            <PixelIcon name="chevronLeft" size={13} />
          </button>
          <div className="min-w-0 flex-1">
            <label htmlFor="mobile-exhibit-picker" className="sr-only">
              Jump to exhibit ({activeIndex + 1} of {items.length})
            </label>
            <select
              id="mobile-exhibit-picker"
              value={activeId}
              onChange={(e) => pickActive(e.target.value)}
              className="min-h-11 w-full rounded-ctl border border-paper-ink bg-paper-card px-3 font-mono text-[0.8125rem] font-semibold text-paper-ink"
            >
              {items.map((g, idx) => (
                <option key={g.id} value={g.id}>
                  {String(idx + 1).padStart(2, "0")}/{items.length} · {g.title}{" "}
                  ({g.stackShort})
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => stepExhibit(1)}
            aria-label="Next exhibit"
            className="grid size-11 shrink-0 place-items-center rounded-ctl border border-paper-line bg-paper-card text-paper-ink hover:border-paper-ink"
          >
            <PixelIcon name="chevronRight" size={13} />
          </button>
        </div>

        <div className="mt-4 md:mt-6">
          <div className="mb-3 hidden items-center justify-between gap-3 md:flex">
            <p className="font-mono text-[0.75rem] font-medium text-paper-ink-2 tabular">
              Surface {String(activeIndex + 1).padStart(2, "0")} of{" "}
              {String(items.length).padStart(2, "0")} · {activeItem.stackLabel}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => stepExhibit(-1)}
                aria-label="Previous exhibit"
                className="inline-flex min-h-9 items-center gap-1.5 rounded-ctl border border-paper-line bg-paper-card px-3 font-mono text-[0.75rem] font-medium text-paper-ink hover:border-paper-ink"
              >
                <PixelIcon name="chevronLeft" size={10} /> Prev
              </button>
              <button
                type="button"
                onClick={() => stepExhibit(1)}
                aria-label="Next exhibit"
                className="inline-flex min-h-9 items-center gap-1.5 rounded-ctl border border-paper-line bg-paper-card px-3 font-mono text-[0.75rem] font-medium text-paper-ink hover:border-paper-ink"
              >
                Next <PixelIcon name="chevronRight" size={10} />
              </button>
            </div>
          </div>

          <Tabs
            items={items}
            value={activeId}
            onChange={pickActive}
            label="Multi-stack gallery exhibits"
            listClassName="rail-scroll mb-6 hidden gap-2 pb-2 md:flex"
            tabClassName={(selected) =>
              `inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-start whitespace-nowrap transition-colors duration-150 motion-reduce:transition-none ${
                selected
                  ? "border-paper-ink bg-paper-ink text-paper"
                  : "border-paper-line bg-paper-card text-paper-ink hover:border-paper-ink"
              }`
            }
            renderTab={(item, idx, selected) => (
              <>
                <span
                  className={`font-mono text-[0.75rem] font-semibold tabular ${
                    selected ? "text-action" : "text-paper-ink-2"
                  }`}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="text-[0.875rem] font-semibold">
                  {item.title}
                </span>
                <span
                  className={`font-mono text-[0.75rem] ${
                    selected ? "text-paper" : "text-paper-ink-2"
                  }`}
                >
                  · {item.stackShort}
                </span>
              </>
            )}
            renderPanel={(item) => <ExhibitWorkbench item={item} />}
          />
        </div>

        <div className="mt-12 border-t border-paper-line pt-8 sm:mt-14 sm:pt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[0.75rem] font-semibold text-paper-ink-2 uppercase">
                Contact sheet · {items.length} of {GALLERY.length} surfaces
              </p>
              <h3 className="mt-1 display-wide text-[1.375rem] leading-tight text-paper-ink sm:text-[1.5rem]">
                Browse every stack &amp; open standalone demos
              </h3>
            </div>
            <p className="font-mono text-[0.75rem] text-paper-ink-2">
              Tap any card to load in workbench ↑ or open full standalone page
              ↗
            </p>
          </div>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((g, idx) => {
              const selected = g.id === activeId;
              const hiddenOnMobile =
                !isFiltered && !showAllSheet && idx >= 6 && !selected;
              return (
                <li
                  key={g.id}
                  className={`${
                    hiddenOnMobile ? "hidden sm:flex" : "flex"
                  } h-full min-w-0 flex-col overflow-hidden rounded-card border transition-colors duration-150 motion-reduce:transition-none ${
                    selected
                      ? "border-paper-ink bg-paper-ink text-paper ring-2 ring-paper-ink"
                      : "border-paper-line bg-paper-card text-paper-ink hover:border-paper-ink"
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
                        loading={idx < 8 ? "eager" : "lazy"}
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute start-2.5 top-2.5 rounded-full bg-paper-ink px-2.5 py-1 font-mono text-[0.6875rem] font-semibold text-paper">
                        {g.stackShort}
                      </span>
                      <span className="absolute end-2.5 top-2.5 rounded-full bg-paper-card px-2.5 py-0.5 font-mono text-[0.6875rem] font-bold text-paper-ink tabular">
                        {g.scanBefore.score} → {g.scanAfter.score}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-2.5 p-4 pb-3">
                      <div>
                        <p
                          className={`font-mono text-[0.75rem] font-medium uppercase ${
                            selected ? "text-action" : "text-paper-ink-2"
                          }`}
                        >
                          {g.ecosystem} · {g.mode}
                        </p>
                        <p className="mt-1 text-[1rem] leading-snug font-bold tracking-tight">
                          {g.title}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-1.5">
                          {g.palette.map((hex) => (
                            <span
                              key={hex}
                              style={{ backgroundColor: hex }}
                              className="size-4 rounded-full border border-paper-line"
                            />
                          ))}
                        </div>
                        <span
                          className={`font-mono text-[0.75rem] font-semibold ${
                            selected ? "text-action" : "text-paper-ink-2"
                          }`}
                        >
                          {selected ? "● Active" : "Compare ↑"}
                        </span>
                      </div>
                    </div>
                  </button>

                  <div
                    className={`flex items-center justify-between gap-2 border-t px-3.5 py-1.5 font-mono text-[0.75rem] ${
                      selected
                        ? "border-line bg-void text-ink"
                        : "border-paper-line bg-paper-2"
                    }`}
                  >
                    <a
                      href={g.liveAfter}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex min-h-10 items-center gap-1.5 px-1 font-semibold underline-offset-4 hover:underline ${
                        selected ? "text-action" : "text-paper-ink"
                      }`}
                    >
                      Open demo <PixelIcon name="external" size={10} />
                    </a>
                    <a
                      href={g.liveBefore}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex min-h-10 items-center gap-1.5 px-1 underline-offset-4 hover:underline ${
                        selected ? "text-ink-muted" : "text-paper-ink-2"
                      }`}
                    >
                      Default <PixelIcon name="external" size={10} />
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>

          {!isFiltered && items.length > 6 ? (
            <div className="mt-5 sm:hidden">
              <button
                type="button"
                onClick={() => setShowAllSheet(!showAllSheet)}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-ctl border border-paper-ink bg-paper-card px-4 font-mono text-[0.8125rem] font-semibold text-paper-ink"
              >
                <PixelIcon name={showAllSheet ? "minus" : "plus"} size={12} />
                {showAllSheet
                  ? "Collapse contact sheet"
                  : `Show all ${items.length} surfaces (+${items.length - 6} more)`}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
