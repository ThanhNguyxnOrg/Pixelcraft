import { useEffect, useRef, useState } from "react";
import logoUrl from "../assets/pixelcraft-logo-512.png";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "../lib/gsap";
import { useMotionPause } from "./pixel";

const G = 44; // bounded sampling grid for the real logo

type Cell = {
  gx: number;
  gy: number;
  r: number;
  g: number;
  b: number;
  sx: number; // scattered start, in grid units relative to the logo box
  sy: number;
  delay: number; // 0 core … 1 edge
  ox: number; // pointer offset (px), smoothed
  oy: number;
  dim: number;
};

function sample(img: HTMLImageElement): {
  cells: Cell[];
  avg: [number, number, number];
} {
  const c = document.createElement("canvas");
  c.width = G;
  c.height = G;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, G, G);
  const data = ctx.getImageData(0, 0, G, G).data;
  const cells: Cell[] = [];
  let sr = 0,
    sg = 0,
    sb = 0;
  // Seeded so every visit scatters the same way.
  let seed = 214;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  for (let y = 0; y < G; y++)
    for (let x = 0; x < G; x++) {
      const i = (y * G + x) * 4;
      const a = data[i + 3] / 255;
      if (a < 0.45) continue;
      const r = Math.min(255, data[i] / a);
      const g = Math.min(255, data[i + 1] / a);
      const b = Math.min(255, data[i + 2] / a);
      sr += r;
      sg += g;
      sb += b;
      const dx = x - G / 2;
      const dy = y - G / 2;
      cells.push({
        gx: x,
        gy: y,
        r,
        g,
        b,
        sx: (rand() * 3.6 - 1.3) * G,
        sy: (rand() * 2.2 - 0.6) * G,
        delay:
          Math.min(1, Math.hypot(dx, dy) / (G * 0.62)) * 0.8 + rand() * 0.2,
        ox: 0,
        oy: 0,
        dim: 0.35 + rand() * 0.3,
      });
    }
  const n = cells.length || 1;
  // "The average": the logo's mean color, pulled toward muted navy-grey.
  const mix = (v: number, t: number) => v + (t - v) * 0.55;
  return { cells, avg: [mix(sr / n, 66), mix(sg / n, 74), mix(sb / n, 117)] };
}

/**
 * The hero signature. The real Pixelcraft mark, sampled into cells that start scattered in the
 * logo's average color, resolve core-outward, step aside for the pointer, and morph across the
 * four THESIS resolution steps (1px average -> 4px structure -> 16px divergence -> 512 detail).
 */
export function PixelLogo({
  className = "",
  resolution = 512,
}: {
  className?: string;
  resolution?: number;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<ReturnType<typeof sample> | null>(null);
  const { paused } = useMotionPause();
  const [ready, setReady] = useState(false);
  const drawRef = useRef<(() => void) | null>(null);
  const resState = useRef({
    chroma: 1,
    coarse: 1,
  });

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      try {
        setModel(sample(img));
      } catch {
        /* The source image remains visible if Canvas is unavailable. */
      }
    };
    img.src = logoUrl;
    return () => {
      img.onload = null;
    };
  }, []);

  // Morph between 1px average, 4x4 structure, 16x16 divergence, and full 44x44 craft.
  useEffect(() => {
    const target =
      resolution <= 1
        ? { chroma: 0, coarse: 11 }
        : resolution <= 4
          ? { chroma: 0.28, coarse: 6 }
          : resolution <= 16
            ? { chroma: 0.82, coarse: 2.5 }
            : { chroma: 1, coarse: 1 };
    const reduce = paused || !window.matchMedia(MOTION_OK).matches;
    if (reduce) {
      resState.current.chroma = target.chroma;
      resState.current.coarse = target.coarse;
      drawRef.current?.();
      return;
    }
    const tween = gsap.to(resState.current, {
      chroma: target.chroma,
      coarse: target.coarse,
      duration: 0.65,
      ease: "expo.out",
      onUpdate: () => drawRef.current?.(),
    });
    return () => {
      tween.kill();
    };
  }, [resolution, paused]);

  useGSAP(
    () => {
      if (!model) return;
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      if (!ctx) return;
      const { cells, avg } = model;
      const state = { assemble: 0, scatter: 0, time: 0 };
      const pointer = { x: -9999, y: -9999, on: false };
      const easeCell = gsap.parseEase("expo.out");
      let W = 0,
        H = 0,
        dpr = 1,
        step = 10,
        ox = 0,
        oy = 0;

      const layout = () => {
        const r = wrap.current!.getBoundingClientRect();
        dpr = Math.min(2, window.devicePixelRatio || 1);
        W = r.width;
        H = r.height;
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        const wide = W >= 1024;
        const vh = Math.min(H, window.innerHeight);
        const size = wide
          ? Math.min(W * 0.4, vh * 0.72)
          : Math.min(W * 0.68, vh * 0.3);
        step = size / G;
        ox = (wide ? W * 0.735 : W * 0.5) - size / 2;
        oy = (wide ? Math.min(H, vh) * 0.49 : vh * 0.21) - size / 2;
      };

      const draw = () => {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        const coarse = resState.current.coarse;
        const chroma = resState.current.chroma;
        const s = step * (0.84 + (coarse - 1) * 0.08);
        const t = state.time;
        for (const c of cells) {
          const p = easeCell(
            gsap.utils.clamp(0, 1, (state.assemble * 1.5 - c.delay) / 0.5),
          );
          const k = p * (1 - state.scatter * 0.9);
          // Quantize cell coordinates toward coarser structural blocks when resolution < 512.
          const qx =
            coarse > 1.05
              ? Math.floor(c.gx / coarse) * coarse + (coarse - 1) * 0.5
              : c.gx;
          const qy =
            coarse > 1.05
              ? Math.floor(c.gy / coarse) * coarse + (coarse - 1) * 0.5
              : c.gy;
          const blendQ = gsap.utils.clamp(0, 1, (coarse - 1) / 5);
          const gx = c.gx + (qx - c.gx) * blendQ * 0.88;
          const gy = c.gy + (qy - c.gy) * blendQ * 0.88;

          const tx = ox + gx * step;
          const ty = oy + gy * step;
          let x = ox + c.sx * step + (tx - (ox + c.sx * step)) * k;
          let y = oy + c.sy * step + (ty - (oy + c.sy * step)) * k;
          // Pointer repel, smoothed per cell so it feels like a field, not a jump.
          let px = 0,
            py = 0;
          if (pointer.on && k > 0.6) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const d = Math.hypot(dx, dy);
            const R = step * 9;
            if (d < R && d > 0.01) {
              const f = (1 - d / R) ** 2 * step * 4.5;
              px = (dx / d) * f;
              py = (dy / d) * f;
            }
          }
          c.ox += (px - c.ox) * 0.16;
          c.oy += (py - c.oy) * 0.16;
          x += c.ox;
          y += c.oy;
          // A slow diagonal light sweep across the resolved mark.
          const sweep =
            Math.max(0, Math.sin(t * 0.9 - (c.gx + c.gy) * 0.09)) ** 14 *
            0.55 *
            k *
            chroma;
          const light = (c.dim + (1 - c.dim) * k) * (1 + sweep);
          const ck = k * chroma;
          const r = (avg[0] + (c.r - avg[0]) * ck) * light;
          const g = (avg[1] + (c.g - avg[1]) * ck) * light;
          const b = (avg[2] + (c.b - avg[2]) * ck) * light;
          ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
          ctx.fillRect(x, y, s, s);
        }
      };
      drawRef.current = draw;

      const ro = new ResizeObserver(() => {
        layout();
        draw();
      });
      ro.observe(wrap.current!);
      layout();
      state.assemble = 1;
      draw();
      setReady(true);

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (paused) return;
        state.assemble = 0;
        gsap.to(state, {
          assemble: 1,
          duration: 1.5,
          ease: "power2.out",
          delay: 0.05,
        });
        gsap.to(state, {
          scatter: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
        let lastFrame = -1;
        const tick = (time: number, delta: number) => {
          state.time += delta / 1000;
          const frame = Math.floor(time * 30);
          if (frame === lastFrame) return;
          lastFrame = frame;
          draw();
        };
        let running = false;
        const run = (on: boolean) => {
          if (on && !running) gsap.ticker.add(tick);
          if (!on && running) gsap.ticker.remove(tick);
          running = on;
        };
        const sync = () => run(st.isActive && !document.hidden);
        const st = ScrollTrigger.create({
          trigger: wrap.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => run(self.isActive && !document.hidden),
        });
        document.addEventListener("visibilitychange", sync);
        sync();
        const fine = window.matchMedia("(pointer: fine)").matches;
        const move = (e: PointerEvent) => {
          const r = canvas.getBoundingClientRect();
          pointer.x = e.clientX - r.left;
          pointer.y = e.clientY - r.top;
          pointer.on = true;
        };
        const leave = () => (pointer.on = false);
        const surface = wrap.current!.parentElement!;
        if (fine) {
          surface.addEventListener("pointermove", move, { passive: true });
          surface.addEventListener("pointerleave", leave);
        }
        return () => {
          run(false);
          document.removeEventListener("visibilitychange", sync);
          st.kill();
          surface.removeEventListener("pointermove", move);
          surface.removeEventListener("pointerleave", leave);
        };
      });
      mm.add(
        "(prefers-reduced-motion: reduce), (forced-colors: active)",
        () => {
          state.assemble = 1;
          state.scatter = 0;
          draw();
        },
      );
      return () => {
        drawRef.current = null;
        ro.disconnect();
        mm.revert();
      };
    },
    { dependencies: [model, paused], revertOnUpdate: true, scope: wrap },
  );

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
    >
      {!ready && (
        <img
          src={logoUrl}
          alt=""
          width={512}
          height={512}
          className="pixel-logo-fallback absolute"
        />
      )}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
