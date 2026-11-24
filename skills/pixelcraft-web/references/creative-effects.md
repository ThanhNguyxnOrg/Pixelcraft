# Creative effects cookbook

| Effect | Useful implementation | Avoid |
|---|---|---|
| Particle field | Bounded particle pool, spatial field, seeded initialization, pointer force with capped radius | Unbounded arrays/allocations in each frame |
| Image displacement | One displacement map and shader pass, responsive texture, static original image | Hiding essential image detail behind an inaccessible effect |
| Noise field | Deterministic seeded noise, slow evolution, bounded amplitude | Rapid random flicker or high-contrast strobe |
| Liquid-like transition | Mask/displacement between two meaningful states, short duration, interruptible | Uncontrolled full-screen distortion on every navigation |
| SDF typography/shape | Distance-field rendering when crisp scalable GPU text/shape is needed | Putting actual UI copy only in a shader |
| Generative grid | Rule-based cell layout, limited palette, deterministic seed | Decorative patterns without a relationship to content |
| Audio-reactive field | Map smoothed frequency bands to a few visual parameters | Mapping raw audio noise directly to flashing brightness |
| Pointer response | Normalized pointer vector, low-pass smoothing, capped strength | Following pointer without a touch/focus equivalent |

## Interaction contract

Every effect states what pointer/keyboard/touch input changes, how it can be stopped/reset, whether it continues while hidden, and what a static user sees. Prefer subtle reaction over large movement. On touch, use an explicit control rather than pretending hover exists.

## Deterministic seed & reduced-motion runtime pattern

Avoid `Math.random()` inside particle pools or generative grids—it breaks screenshot baselines and visual regression. Seed a tiny deterministic PRNG (such as Mulberry32), honor optional QA query overrides (`?seed=42&t=0`), and listen to `prefers-reduced-motion` dynamically so toggling the OS preference pauses live evolution immediately:

```ts
// Deterministic Mulberry32 PRNG + live prefers-reduced-motion gate
export function createSeededRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createEffectRuntime(renderStatic: (t: number) => void, startLoop: () => () => void) {
  const params = new URLSearchParams(window.location.search);
  const frozenTime = params.has('t') ? Number(params.get('t')) : null;
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  let stopLoop: (() => void) | null = null;

  const sync = () => {
    stopLoop?.();
    stopLoop = null;
    if (frozenTime !== null || mql.matches) {
      renderStatic(frozenTime ?? 0);
    } else {
      stopLoop = startLoop();
    }
  };

  sync();
  mql.addEventListener('change', sync);
  return () => {
    stopLoop?.();
    mql.removeEventListener('change', sync);
  };
}
```

Record asset provenance and never bundle third-party example textures/models without license verification.
