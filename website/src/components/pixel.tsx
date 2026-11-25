import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { EvidenceLabel } from "../data";

/** Page-wide autonomous-motion switch, owned by the top pause control. */
export const MotionPause = createContext<{
  paused: boolean;
  setPaused: (v: boolean) => void;
}>({
  paused: false,
  setPaused: () => {},
});
export const useMotionPause = () => useContext(MotionPause);

// 8×8 bitmaps. '#' is a lit pixel. One grid, one stroke logic, one metaphor system.
const BITMAPS = {
  copy: [
    "#####...",
    "#...#...",
    "#..#####",
    "#..#...#",
    "####...#",
    "...#...#",
    "...#####",
    "........",
  ],
  check: [
    "........",
    ".......#",
    "......##",
    "#....##.",
    "##..##..",
    ".####...",
    "..##....",
    "........",
  ],
  arrow: [
    "........",
    "....#...",
    "....##..",
    "#######.",
    "#######.",
    "....##..",
    "....#...",
    "........",
  ],
  chevronLeft: [
    "....##..",
    "...##...",
    "..##....",
    ".##.....",
    ".##.....",
    "..##....",
    "...##...",
    "....##..",
  ],
  chevronRight: [
    "..##....",
    "...##...",
    "....##..",
    ".....##.",
    ".....##.",
    "....##..",
    "...##...",
    "..##....",
  ],
  external: [
    "..######",
    "......##",
    ".....###",
    "....##.#",
    "...##..#",
    "..##....",
    ".##.....",
    "##......",
  ],
  search: [
    ".####...",
    "#....#..",
    "#....#..",
    "#....#..",
    ".####...",
    ".....##.",
    "......##",
    "........",
  ],
  menu: [
    "........",
    "########",
    "........",
    "########",
    "........",
    "########",
    "........",
    "........",
  ],
  grid: [
    "###..###",
    "###..###",
    "###..###",
    "........",
    "........",
    "###..###",
    "###..###",
    "###..###",
  ],
  loop: [
    ".######.",
    "#......#",
    "#....###",
    "........",
    "###....#",
    "#......#",
    ".######.",
    "........",
  ],
  terminal: [
    "########",
    "#......#",
    "#.#....#",
    "#..#...#",
    "#.#..###",
    "#......#",
    "########",
    "........",
  ],
  phone: [
    "..####..",
    ".#....#.",
    ".#....#.",
    ".#....#.",
    ".#....#.",
    ".#.##.#.",
    "..####..",
    "........",
  ],
  monitor: [
    "########",
    "#......#",
    "#......#",
    "#......#",
    "########",
    "...##...",
    ".######.",
    "........",
  ],
  plus: [
    "...##...",
    "...##...",
    "...##...",
    "########",
    "########",
    "...##...",
    "...##...",
    "...##...",
  ],
  minus: [
    "........",
    "........",
    "........",
    "########",
    "########",
    "........",
    "........",
    "........",
  ],
  close: [
    "##....##",
    ".##..##.",
    "..####..",
    "...##...",
    "..####..",
    ".##..##.",
    "##....##",
    "........",
  ],
  scan: [
    "###..###",
    "#......#",
    "#......#",
    "########",
    "........",
    "#......#",
    "#......#",
    "###..###",
  ],
  reset: [
    "..####..",
    ".#....#.",
    "#......#",
    "#.......",
    "#....###",
    "#.....##",
    ".#...#.#",
    "..###...",
  ],
  play: [
    ".#......",
    ".##.....",
    ".###....",
    ".####...",
    ".####...",
    ".###....",
    ".##.....",
    ".#......",
  ],
  pause: [
    "........",
    ".##..##.",
    ".##..##.",
    ".##..##.",
    ".##..##.",
    ".##..##.",
    ".##..##.",
    "........",
  ],
  drag: [
    "........",
    "..#..#..",
    ".##..##.",
    "###..###",
    "###..###",
    ".##..##.",
    "..#..#..",
    "........",
  ],
  chevron: [
    "........",
    "........",
    "##....##",
    ".##..##.",
    "..####..",
    "...##...",
    "........",
    "........",
  ],
  spark: [
    "...##...",
    "...##...",
    "..####..",
    "########",
    "########",
    "..####..",
    "...##...",
    "...##...",
  ],
  star: [
    "...##...",
    "...##...",
    "########",
    ".######.",
    "..####..",
    ".##..##.",
    ".#....#.",
    "........",
  ],
  code: [
    "........",
    "..#..#..",
    ".#....#.",
    "#......#",
    "#......#",
    ".#....#.",
    "..#..#..",
    "........",
  ],
  pin: [
    "..####..",
    ".#....#.",
    ".#.##.#.",
    ".#....#.",
    "..####..",
    "...##...",
    "...##...",
    "........",
  ],
  // Evidence glyphs: distinct shapes so meaning never depends on color alone.
  rendered: [
    "........",
    ".######.",
    ".######.",
    ".######.",
    ".######.",
    ".######.",
    ".######.",
    "........",
  ],
  static: [
    "########",
    "#......#",
    "#......#",
    "#......#",
    "#......#",
    "#......#",
    "#......#",
    "########",
  ],
  "model-judgment": [
    "...##...",
    "..####..",
    ".######.",
    "########",
    "########",
    ".######.",
    "..####..",
    "...##...",
  ],
  "not-checked": [
    "##.##.##",
    "#......#",
    "........",
    "#......#",
    "#......#",
    "........",
    "#......#",
    "##.##.##",
  ],
  waived: [
    "########",
    "#.....##",
    "#....#.#",
    "#...#..#",
    "#..#...#",
    "#.#....#",
    "##.....#",
    "########",
  ],
} as const;

export type IconName = keyof typeof BITMAPS;

export function PixelIcon({
  name,
  size = 16,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const rows = BITMAPS[name];
  return (
    <svg
      viewBox="0 0 8 8"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 fill-current ${className}`}
    >
      {rows.flatMap((row, y) =>
        [...row].map((c, x) =>
          c === "#" ? (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />
          ) : null,
        ),
      )}
    </svg>
  );
}

const EVIDENCE_TEXT: Record<EvidenceLabel, string> = {
  rendered: "text-rendered",
  static: "text-static",
  "model-judgment": "text-judgment",
  "not-checked": "text-unchecked",
  waived: "text-waived",
};

const EVIDENCE_PAPER: Record<EvidenceLabel, string> = {
  rendered: "text-[#005a57]",
  static: "text-[#124b94]",
  "model-judgment": "text-[#512eb0]",
  "not-checked": "text-[#7d3b00]",
  waived: "text-[#7d007a]",
};

export function EvidenceStamp({
  label,
  className = "",
  tone = "dark",
}: {
  label: EvidenceLabel;
  className?: string;
  tone?: "dark" | "paper";
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-current/70 px-2.5 py-1 font-mono text-[0.75rem] font-medium leading-none whitespace-nowrap ${tone === "paper" ? `${EVIDENCE_PAPER[label]} bg-paper-card` : EVIDENCE_TEXT[label]} ${className}`}
    >
      <PixelIcon name={label} size={10} />
      {label}
    </span>
  );
}

type CopyState = "idle" | "copied" | "failed";

export function CopyCommand({
  lines,
  variant = "default",
  wrap = true,
}: {
  lines: string[];
  variant?: "default" | "featured";
  wrap?: boolean;
}) {
  const [state, setState] = useState<CopyState>("idle");
  const codeRef = useRef<HTMLElement>(null);
  const text = lines.join("\n");

  useEffect(() => {
    if (state === "idle") return;
    const t = window.setTimeout(() => setState("idle"), 2200);
    return () => window.clearTimeout(t);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      const node = codeRef.current;
      if (node) {
        const range = document.createRange();
        range.selectNodeContents(node);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      setState("failed");
    }
  }

  const featured = variant === "featured";

  return (
    <div
      className={`gborder flex min-w-0 flex-col items-stretch gap-2 rounded-tile p-1.5 sm:flex-row sm:items-center ${featured ? "surface-lit" : "surface"}`}
    >
      <pre className="min-w-0 flex-1 overflow-x-auto px-3.5 py-2.5 text-[0.875rem] leading-relaxed">
        <code ref={codeRef}>
          {lines.map((l) => (
            <span
              key={l}
              className={`block ${wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre"}`}
            >
              <span
                aria-hidden="true"
                className="me-3 text-ink-faint select-none"
              >
                $
              </span>
              {l}
            </span>
          ))}
        </code>
      </pre>
      <button
        type="button"
        onClick={copy}
        data-magnetic
        className={`flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-ctl px-5 py-2.5 font-mono text-[0.8125rem] font-semibold transition-[background-color,transform,box-shadow] duration-150 active:scale-[0.97] sm:min-w-[6.75rem] sm:rounded-full motion-reduce:transition-none ${
          featured
            ? "bg-action text-on-action shadow-glow-action hover:bg-ink"
            : "bg-white/10 text-ink hover:bg-white/16"
        }`}
      >
        <PixelIcon name={state === "copied" ? "check" : "copy"} size={12} />
        {state === "copied"
          ? "Copied"
          : state === "failed"
            ? "Selected"
            : "Copy"}
        <span className="sr-only" aria-live="polite">
          {state === "copied"
            ? "Command copied to clipboard"
            : state === "failed"
              ? "Clipboard unavailable. Command text selected; copy it manually."
              : ""}
        </span>
      </button>
    </div>
  );
}

export function PixelLabel({
  children,
  tone = "action",
}: {
  children: ReactNode;
  tone?: "action" | "faint";
}) {
  return (
    <p
      className={`flex items-center gap-2.5 font-pixel text-[0.75rem] tracking-[0.06em] uppercase ${tone === "action" ? "text-action" : "text-ink-faint"}`}
    >
      <span
        aria-hidden="true"
        className="size-2 rounded-[3px] bg-current shadow-[0_0_14px_currentColor]"
      />
      <span data-scramble>{children}</span>
    </p>
  );
}

/** Block reveal. The motion itself lives in useGlobalMotion (GSAP batch); this only marks the element. */
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div data-reveal className={className}>
      {children}
    </div>
  );
}

export function SectionHead({
  id,
  kicker,
  meta,
  title,
  children,
  align = "split",
}: {
  id: string;
  kicker?: string;
  meta?: string;
  title: string;
  children?: ReactNode;
  align?: "split" | "stack";
}) {
  return (
    <div
      className={
        align === "split"
          ? "grid min-w-0 gap-6 lg:grid-cols-12 lg:items-end lg:gap-8"
          : "grid min-w-0 gap-6"
      }
    >
      <div className={align === "split" ? "min-w-0 lg:col-span-8" : "min-w-0"}>
        <PixelLabel>{kicker ?? meta}</PixelLabel>
        <h2
          id={id}
          data-split
          className="mt-5 max-w-[19ch] display-wide text-[clamp(2rem,4.4vw,4rem)] leading-[1.0] text-balance"
        >
          {title}
        </h2>
      </div>
      {children ? (
        <Reveal
          className={
            align === "split" ? "min-w-0 lg:col-span-4 lg:pb-2" : "min-w-0"
          }
        >
          <div className="max-w-[46ch] text-[1rem] leading-relaxed text-ink-muted sm:text-[1.0625rem]">
            {children}
          </div>
        </Reveal>
      ) : null}
    </div>
  );
}

/** A rounded panel with a gradient hairline. `lit` tints it with the action color. */
export function PixelFrame({
  children,
  className = "",
  innerClassName = "",
  lit = false,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  lit?: boolean;
}) {
  return (
    <div
      className={`gborder rounded-card ${lit ? "surface-lit" : "surface"} ${className}`}
    >
      <div className={`h-full overflow-hidden rounded-card ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
}

/** A tile whose highlight follows the pointer. Decorative only: nothing depends on hover. */
export function SpotTile({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <Tag
      data-reveal
      onPointerMove={onMove}
      className={`group/spot surface relative min-w-0 overflow-hidden ${className}`}
      style={{ ["--mx" as string]: "50%", ["--my" as string]: "0%" }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100 motion-reduce:transition-none"
        style={{
          background:
            "radial-gradient(360px circle at var(--mx) var(--my), color-mix(in oklab, var(--color-action) 16%, transparent), transparent 60%)",
        }}
      />
      <div className="relative h-full min-w-0">{children}</div>
    </Tag>
  );
}
