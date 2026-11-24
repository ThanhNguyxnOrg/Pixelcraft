import { useEffect, useRef, useState, type ReactNode } from "react";
import type { EvidenceLabel } from "../data";

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
  rendered: "text-[#006865]",
  static: "text-[#1655a4]",
  "model-judgment": "text-[#5f3bc2]",
  "not-checked": "text-[#8e4400]",
  waived: "text-[#8e008b]",
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
      className={`inline-flex items-center gap-1.5 rounded-full border border-current/70 px-2.5 py-1 font-mono text-[0.75rem] leading-none whitespace-nowrap ${tone === "paper" ? EVIDENCE_PAPER[label] : EVIDENCE_TEXT[label]} ${className}`}
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
      className={`flex flex-wrap items-stretch gap-2 rounded-tile p-1.5 ${featured ? "surface-lit" : "surface"}`}
    >
      <pre className="min-w-0 flex-[1_1_16rem] overflow-x-auto px-4 py-3 text-[0.875rem] leading-relaxed">
        <code ref={codeRef}>
          {lines.map((l) => (
            <span
              key={l}
              className={`block ${wrap ? "whitespace-pre-wrap [overflow-wrap:anywhere]" : "whitespace-pre"}`}
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
        className={`ms-auto flex min-h-11 min-w-[6.5rem] shrink-0 items-center justify-center gap-2 self-center rounded-full px-5 py-2.5 font-mono text-[0.8125rem] font-medium transition-colors duration-150 motion-reduce:transition-none ${
          featured
            ? "bg-action text-on-action hover:bg-ink"
            : "border border-line bg-raised text-ink hover:border-action hover:text-action"
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

export function SectionHead({
  id,
  meta,
  title,
  children,
}: {
  id: string;
  meta: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-8">
        <p className="font-mono text-[0.8125rem] text-action">{meta}</p>
        <h2
          id={id}
          className="mt-3 max-w-[20ch] display-wide text-[clamp(2rem,4vw,3.5rem)] leading-[1.02] text-balance"
        >
          {title}
        </h2>
      </div>
      {children ? (
        <div className="max-w-[46ch] text-[1.0625rem] leading-relaxed text-ink-muted lg:col-span-4 lg:pb-1">
          {children}
        </div>
      ) : null}
    </div>
  );
}
