import { AnimatePresence, motion } from "motion/react";
import { useMemo, useRef, useState, type CSSProperties } from "react";
import {
  GALLERY,
  GALLERY_QUEUE,
  REPO_URL,
  type GalleryItem,
  type ScanFinding,
} from "../data";
import galleryMeta from "../generated/gallery.json";
import { gsap, MOTION_OK, useGSAP } from "../lib/gsap";
import { EvidenceStamp, PixelIcon, Reveal, useMotionPause } from "./pixel";
import { Tabs } from "./Tabs";

type View = "compare" | "before" | "after";

const SEV: Record<ScanFinding["severity"], string> = {
  P0: "border-paper-p0 text-paper-p0",
  P1: "border-paper-p1 text-paper-p1",
  P2: "border-paper-p2 text-paper-p2",
  P3: "border-paper-ink-2 text-paper-ink-2",
};

// Group repeated findings: eight placeholder labels are one finding with a count.
function grouped(findings: ScanFinding[]) {
  const map = new Map<string, { f: ScanFinding; n: number }>();
  findings.forEach((f) => {
    const hit = map.get(f.rule);
    if (hit) hit.n += 1;
    else map.set(f.rule, { f, n: 1 });
  });
  return [...map.values()].sort(
    (a, b) => a.f.severity.localeCompare(b.f.severity) || b.n - a.n,
  );
}

function Stage({ item }: { item: GalleryItem }) {
  const [view, setView] = useState<View>("compare");
  const pos = useRef(50);
  const [pins, setPins] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const sweep = useRef<gsap.core.Timeline | null>(null);
  const { paused } = useMotionPause();

  // Paint the comparison directly: an automatic sweep must not re-render the
  // entire exhibit (images, findings and controls) on every animation frame.
  const paintDivider = (value: number) => {
    pos.current = value;
    stage.current?.style.setProperty("--comparison-position", `${value}%`);
    const input = stage.current?.querySelector("input");
    if (input) {
      input.value = String(value);
      input.setAttribute(
        "aria-valuetext",
        `${Math.round(value)}% default agent`,
      );
    }
  };
  const stopSweep = () => {
    touched.current = true;
    sweep.current?.kill();
  };

  // Once per exhibit: the divider sweeps from the default page to the crafted one, then rests at the middle.
  // It stops the moment the visitor takes the handle.
  useGSAP(
    () => {
      if (paused) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (touched.current || view !== "compare") return;
        const o = { v: 50 };
        sweep.current = gsap
          .timeline({
            scrollTrigger: {
              trigger: stage.current,
              start: "top 75%",
              once: true,
            },
          })
          .to(o, {
            v: 92,
            duration: 0.65,
            ease: "power2.inOut",
            onUpdate: () => {
              if (!touched.current) paintDivider(Math.round(o.v));
            },
          })
          .to(o, {
            v: 6,
            duration: 1.25,
            ease: "power3.inOut",
            onUpdate: () => {
              if (!touched.current) paintDivider(Math.round(o.v));
            },
          })
          .to(
            o,
            {
              v: 50,
              duration: 0.8,
              ease: "expo.out",
              onUpdate: () => {
                if (!touched.current) paintDivider(Math.round(o.v));
              },
            },
            "+=0.15",
          );
      });
      return () => mm.revert();
    },
    {
      dependencies: [item.id, paused, view],
      revertOnUpdate: true,
      scope: stage,
    },
  );
  const findings = useMemo(() => grouped(item.scanBefore.findings), [item]);
  const w = galleryMeta.viewport.w;
  const h = galleryMeta.viewport.h;

  const showBefore = view !== "after";
  const clip =
    view === "before" ? "0%" : "calc(100% - var(--comparison-position))";

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
        <div
          role="group"
          aria-label="View"
          className="flex max-w-full rounded-full bg-paper-2 p-1"
        >
          {(
            [
              ["compare", "Compare"],
              ["before", "Default agent"],
              ["after", "With Pixelcraft"],
            ] as [View, string][]
          ).map(([v, label]) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={`min-h-10 rounded-full px-2 font-mono text-[0.8125rem] transition-[background-color,color] duration-150 sm:px-4 motion-reduce:transition-none ${
                view === v
                  ? "bg-paper-ink text-paper shadow-[0_6px_18px_-6px_rgba(11,18,64,0.6)]"
                  : "text-paper-ink hover:bg-white/70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <label className="flex min-h-10 cursor-pointer items-center gap-2.5 font-mono text-[0.8125rem] text-paper-ink">
            <input
              type="checkbox"
              checked={pins}
              onChange={(e) => setPins(e.target.checked)}
              className="size-4 accent-[var(--color-paper-ink)]"
            />
            Show scan findings
          </label>
        </div>
      </div>

      <div className="comparison-stage relative overflow-hidden rounded-card bg-paper-ink p-px shadow-[0_40px_90px_-36px_rgba(11,18,64,0.6)]">
        <div
          ref={stage}
          className="relative overflow-hidden rounded-[calc(var(--radius-card)-1px)] select-none"
          style={
            {
              aspectRatio: `${w} / ${h}`,
              "--comparison-position": `${pos.current}%`,
            } as CSSProperties
          }
        >
          <img
            src={item.after}
            alt={`${item.title}, built with Pixelcraft`}
            width={w}
            height={h}
            className="absolute inset-0 h-full w-full"
          />
          {showBefore ? (
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${clip} 0 0)` }}
            >
              <img
                src={item.before}
                alt={`${item.title}, default agent output`}
                width={w}
                height={h}
                className="absolute inset-0 h-full w-full"
              />
            </div>
          ) : null}

          {view === "compare" ? (
            <>
              <input
                type="range"
                min={0}
                max={100}
                defaultValue={pos.current}
                onPointerDown={stopSweep}
                onFocus={stopSweep}
                onChange={(e) => {
                  stopSweep();
                  paintDivider(Number(e.target.value));
                }}
                aria-label="Comparison divider. Left shows the default agent, right shows Pixelcraft."
                aria-valuetext={`${pos.current}% default agent`}
                className="peer absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
              />
              <div
                className="pointer-events-none absolute inset-y-0 w-0.5 bg-action shadow-[0_0_0_1px_var(--color-paper-ink)]"
                style={{ left: "var(--comparison-position)" }}
              >
                <span className="absolute top-1/2 left-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-paper-ink bg-action text-on-action shadow-[0_10px_30px_-8px_rgba(11,18,64,0.7)]">
                  <PixelIcon name="drag" size={16} />
                </span>
              </div>
            </>
          ) : null}

          <span className="pointer-events-none absolute start-4 top-4 rounded-full bg-paper-ink px-3 py-1.5 font-pixel text-[0.6875rem] text-paper uppercase">
            Default agent
          </span>
          <span className="pointer-events-none absolute end-4 top-4 rounded-full bg-action px-3 py-1.5 font-pixel text-[0.6875rem] text-on-action uppercase">
            With Pixelcraft
          </span>
        </div>
      </div>

      <AnimatePresence>
        {pins ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4"
          >
            <p className="text-[0.8125rem] text-paper-ink-2">
              Source findings across the full default page, including content
              outside this captured frame.
            </p>
            <ul
              aria-label="Default page scan findings"
              className="mt-3 flex flex-wrap gap-2"
            >
              {findings.map(({ f, n }) => (
                <li
                  key={f.rule}
                  className={`max-w-full rounded-tile border bg-paper px-3 py-2 font-mono text-[0.6875rem] break-words ${SEV[f.severity]}`}
                >
                  {f.severity} {f.rule}
                  {n > 1 ? ` × ${n}` : ""}
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[0.75rem] text-paper-ink-2">
        <span className="flex items-center gap-2.5">
          <EvidenceStamp label="rendered" tone="paper" /> Captured in Chromium
          at {w} × {h}
        </span>
        <span className="flex max-w-full flex-wrap gap-x-5 gap-y-3">
          <a
            href={item.liveBefore}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-paper-ink underline underline-offset-4"
          >
            Open default page <PixelIcon name="external" size={10} />
          </a>
          <a
            href={item.liveAfter}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-paper-ink underline underline-offset-4"
          >
            Open Pixelcraft page <PixelIcon name="external" size={10} />
          </a>
        </span>
      </div>
    </div>
  );
}

function Dossier({ item }: { item: GalleryItem }) {
  const before = grouped(item.scanBefore.findings);
  return (
    <div className="surface-paper grid gap-5 rounded-card p-5 text-paper-ink sm:p-6">
      <div>
        <p className="font-pixel text-[0.6875rem] text-paper-ink-2 uppercase">
          {item.kind} · {item.mode} mode
        </p>
        <h3 className="mt-3 display-wide text-[1.5rem] leading-[1.05]">
          {item.title}
        </h3>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-paper-ink-2">
          {item.brief}
        </p>
      </div>

      <div>
        <p className="font-pixel text-[0.6875rem] text-paper-ink-2 uppercase">
          Same brief. Fewer fingerprints.
        </p>
        <div className="mt-3 flex items-end gap-5">
          <div>
            <p className="font-mono text-[0.75rem] text-paper-ink-2">default</p>
            <p
              data-count={item.scanBefore.score}
              className="display-wide text-[3.5rem] leading-none text-paper-p0 tabular"
            >
              {item.scanBefore.score}
            </p>
          </div>
          <PixelIcon name="arrow" size={22} className="mb-3 text-paper-ink" />
          <div>
            <p className="font-mono text-[0.75rem] text-paper-ink-2">
              pixelcraft
            </p>
            <p className="display-wide text-[3.5rem] leading-none tabular">
              {item.scanAfter.score}
            </p>
          </div>
        </div>
        <p className="mt-4 flex items-start gap-2.5 text-[0.8125rem] leading-snug text-paper-ink-2">
          <EvidenceStamp label="static" tone="paper" className="mt-px" />
          <span>
            Source scan, not a design-quality score. {before.length} fingerprint
            types removed.
          </span>
        </p>
      </div>

      <div className="border-t border-paper-line pt-5">
        <p className="font-pixel text-[0.6875rem] text-paper-ink-2 uppercase">
          {item.direction}
        </p>
        <p className="mt-3 text-[0.9375rem] leading-relaxed">
          {item.decisions[0]}
        </p>
      </div>

      <details className="gallery-notes border-t border-paper-line pt-2">
        <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 font-mono text-[0.8125rem] font-medium">
          Process & evidence <PixelIcon name="plus" size={12} />
        </summary>
        <div className="grid gap-6 pt-3">
          <div>
            <p className="font-pixel text-[0.6875rem] text-paper-ink-2 uppercase">
              Scanner findings
            </p>
            <ul className="mt-3 border-t border-paper-line">
              {before.map(({ f, n }) => (
                <li
                  key={f.rule}
                  className="flex items-baseline gap-3 border-b border-paper-line py-2.5"
                >
                  <span
                    className={`border px-1.5 py-0.5 font-mono text-[0.6875rem] leading-none ${SEV[f.severity]}`}
                  >
                    {f.severity}
                  </span>
                  <code className="min-w-0 break-all text-[0.75rem]">
                    {f.rule}
                  </code>
                  {n > 1 ? (
                    <span className="font-mono text-[0.75rem] text-paper-ink-2 tabular">
                      × {n}
                    </span>
                  ) : null}
                  <span className="ms-auto shrink-0 font-mono text-[0.6875rem] text-paper-ink-2 tabular">
                    L{f.line}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 flex items-start gap-2.5 text-[0.8125rem] leading-snug text-paper-ink-2">
              <EvidenceStamp label="static" tone="paper" className="mt-px" />
              <span>
                Output of <code className="text-paper-ink">slop-scan.mjs</code>{" "}
                on each page’s source. Zero means no known fingerprints, not
                good design.
              </span>
            </p>
          </div>

          <div>
            <p className="font-pixel text-[0.6875rem] text-paper-ink-2 uppercase">
              Design decisions
            </p>
            <ul className="mt-3 grid gap-2.5">
              {item.decisions.slice(1).map((d) => (
                <li
                  key={d}
                  className="flex gap-3 text-[0.9375rem] leading-snug"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.45em] size-2 shrink-0 bg-paper-ink"
                  />
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-pixel text-[0.6875rem] text-paper-ink-2 uppercase">
              What the scanner cannot see
            </p>
            <ul className="mt-3 grid gap-2 text-[0.875rem] leading-snug text-paper-ink-2">
              {item.judgment.map((j) => (
                <li key={j}>{j}</li>
              ))}
            </ul>
            <p className="mt-3">
              <EvidenceStamp label="model-judgment" tone="paper" />
            </p>
          </div>

          <div>
            <p className="font-pixel text-[0.6875rem] text-paper-ink-2 uppercase">
              Skills used
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {item.skills.map((s) => (
                <li key={s}>
                  <a
                    href={`${REPO_URL}/tree/main/skills/${s}`}
                    className="inline-block rounded-full border border-paper-ink/40 px-3 py-1.5 font-mono text-[0.75rem] transition-colors hover:border-paper-ink hover:bg-paper-ink hover:text-paper motion-reduce:transition-none"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <p className="flex items-start gap-2.5 border-t border-paper-line pt-5 text-[0.8125rem] leading-snug text-paper-ink-2">
            <EvidenceStamp label="not-checked" tone="paper" className="mt-px" />
            <span>{item.limits.join(" ")}</span>
          </p>
        </div>
      </details>
    </div>
  );
}

export function Gallery() {
  const [id, setId] = useState(GALLERY[0].id);
  const sheet = useRef<HTMLElement>(null);
  const { paused } = useMotionPause();
  useGSAP(
    () => {
      if (paused) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          sheet.current,
          { scale: 0.975, borderRadius: 56 },
          {
            scale: 1,
            borderRadius: 32,
            ease: "none",
            scrollTrigger: {
              trigger: sheet.current,
              start: "top bottom",
              end: "top 38%",
              scrub: 0.5,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: sheet, dependencies: [paused], revertOnUpdate: true },
  );

  return (
    <section
      ref={sheet}
      id="gallery"
      aria-labelledby="gallery-title"
      className="relative z-10 mx-2 rounded-sheet will-change-transform bg-paper text-paper-ink shadow-[0_-30px_80px_-30px_rgba(3,240,237,0.25)] sm:mx-4"
    >
      <div className="mx-auto max-w-[88rem] px-5 py-24 sm:px-8 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="min-w-0 lg:col-span-8">
            <p className="flex items-center gap-2.5 font-pixel text-[0.75rem] tracking-[0.06em] text-paper-ink-2 uppercase">
              <span
                aria-hidden="true"
                className="size-2 rounded-[3px] bg-paper-ink"
              />
              <span data-scramble>Gallery · same brief, two agents</span>
            </p>
            <h2
              id="gallery-title"
              data-split
              className="mt-6 max-w-[16ch] display-wide text-[clamp(2.25rem,5.4vw,4.75rem)] leading-[0.95] text-balance"
            >
              Same brief. A different instinct.
            </h2>
          </div>
          <Reveal className="lg:col-span-4 lg:pb-2">
            <p className="max-w-[44ch] text-[1.0625rem] leading-relaxed text-paper-ink-2">
              Watch the comparison unfold, or drag the divider. Fictional
              briefs, real pages, source-backed scanner results.
            </p>
          </Reveal>
        </div>

        <div className="mt-14">
          <Tabs
            items={GALLERY}
            value={id}
            onChange={setId}
            label="Gallery exhibits"
            listClassName="flex flex-wrap gap-2 pb-8"
            tabClassName={(selected) =>
              `min-h-12 rounded-full border px-5 text-start transition-colors duration-150 motion-reduce:transition-none ${
                selected
                  ? "border-paper-ink bg-paper-ink text-paper shadow-[0_14px_30px_-14px_rgba(11,18,64,0.7)]"
                  : "border-paper-line text-paper-ink hover:border-paper-ink hover:bg-white/60"
              }`
            }
            renderTab={(g) => (
              <span className="flex items-baseline gap-3">
                <span className="display-wide text-[1rem] leading-none">
                  {g.title}
                </span>
                <span className="font-mono text-[0.6875rem] opacity-70">
                  {g.kind}
                </span>
              </span>
            )}
            renderPanel={(g) => (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                  className="grid items-start gap-6 lg:grid-cols-12"
                >
                  <div className="min-w-0 lg:col-span-8">
                    <Stage item={g} />
                  </div>
                  <div className="lg:col-span-4">
                    <Dossier item={g} />
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          />
        </div>

        <details className="mt-10 border-t border-paper-line pt-3">
          <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-3 font-mono text-[0.8125rem] text-paper-ink-2">
            More surfaces · {GALLERY_QUEUE.length} planned, not yet captured{" "}
            <PixelIcon name="plus" size={12} />
          </summary>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-pixel text-[0.6875rem] text-paper-ink-2 uppercase">
                Queued · {GALLERY_QUEUE.length} slots
              </p>
              <p className="mt-2 max-w-[56ch] text-[0.9375rem] leading-relaxed text-paper-ink-2">
                The gallery is ready for more surfaces. A slot stays empty until
                a real, scanned pair exists for it.
              </p>
            </div>
            <p className="font-mono text-[0.75rem] text-paper-ink-2">
              add a pair:{" "}
              <code className="text-paper-ink">
                public/gallery/&lt;id&gt;/before.html + after.html
              </code>
              , then{" "}
              <code className="text-paper-ink">
                node scripts/capture-gallery.mjs
              </code>
            </p>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {GALLERY_QUEUE.map((q) => (
              <li
                key={q.id}
                className="flex min-h-36 flex-col justify-between rounded-tile border border-dashed border-paper-ink-2/50 p-6"
              >
                <span className="font-pixel text-[0.6875rem] text-paper-ink-2 uppercase">
                  Queued
                </span>
                <div>
                  <p className="display-wide text-[1.125rem] leading-tight">
                    {q.title}
                  </p>
                  <p className="mt-1.5 font-mono text-[0.75rem] text-paper-ink-2">
                    {q.skill}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}
