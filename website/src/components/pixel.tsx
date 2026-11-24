import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { EvidenceLabel } from "../data";

/** Page-wide autonomous-motion switch, owned by the hero's pause control. */
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

// Darker hues for the light table; each still has its own glyph, so meaning never rests on color alone.
const EVIDENCE_PAPER: Record<EvidenceLabel, string> = {
  rendered: "text-[#00706e]",
  static: "text-[#1b5fb3]",
  "model-judgment": "text-[#6a45cf]",
  "not-checked": "text-[#a04e00]",
  waived: "text-[#a2009f]",
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
      className={`inline-flex items-center gap-1.5 rounded-full border border-current/60 px-2.5 py-1 font-mono text-[0.75rem] leading-none whitespace-nowrap ${tone === "paper" ? EVIDENCE_PAPER[label] : EVIDENCE_TEXT[label]} ${className}`}
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
  variant?: "default" | "hero";
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
      // Clipboard can be denied (permissions, iframes). Select the text so the user can copy manually.
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

  const hero = variant === "hero";

  return (
    <div
      className={`gborder flex items-stretch gap-2 rounded-tile p-1.5 ${hero ? "surface-lit" : "surface"}`}
    >
      <pre className="min-w-0 flex-1 overflow-x-auto px-4 py-3 text-[0.875rem] leading-relaxed">
        <code ref={codeRef}>
          {lines.map((l) => (
            <span
              key={l}
              className={`block ${wrap ? "break-all whitespace-pre-wrap" : "whitespace-pre"}`}
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
        className={`flex min-w-[6.75rem] shrink-0 items-center justify-center gap-2 self-center rounded-full px-5 py-3 font-mono text-[0.8125rem] font-medium transition-[background-color,transform,box-shadow] duration-150 active:scale-[0.97] motion-reduce:transition-none ${
          hero
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
  title,
  children,
  align = "split",
}: {
  id: string;
  kicker: string;
  title: string;
  children?: ReactNode;
  align?: "split" | "stack";
}) {
  return (
    <div
      className={
        align === "split"
          ? "grid gap-8 lg:grid-cols-12 lg:items-end"
          : "grid gap-8"
      }
    >
      <div className={align === "split" ? "lg:col-span-8" : ""}>
        <PixelLabel>{kicker}</PixelLabel>
        <h2
          id={id}
          data-split
          className="mt-6 max-w-[19ch] display-wide text-[clamp(2.25rem,4.4vw,4rem)] leading-[0.98] text-balance"
        >
          {title}
        </h2>
      </div>
      {children ? (
        <Reveal className={align === "split" ? "lg:col-span-4 lg:pb-2" : ""}>
          <div className="max-w-[46ch] text-[1.0625rem] leading-relaxed text-ink-muted">
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
      className={`group/spot surface relative overflow-hidden ${className}`}
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
      <div className="relative h-full">{children}</div>
    </Tag>
  );
}
