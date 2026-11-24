# Audio-reactive graphics

For player UIs, waveform scrubbers (`wavesurfer.js`), game SFX (`Howler.js`), and interactive synthesis (`Tone.js`), read [media-players.md](media-players.md).

## Audio pipeline

Use Web Audio when audio analysis genuinely improves a visual interaction. Separate media playback from analysis:
1. Obtain a user gesture (`click` / `keydown`) before starting or resuming an `AudioContext` (`await ctx.resume()`).
2. Connect the media source to an `AnalyserNode` or `AudioWorklet` **and** route playback to `ctx.destination`—creating a `MediaElementAudioSourceNode` detaches the element from default speakers, so terminating at the analyser silences audio.
3. **Single-call `createMediaElementSource` guard**: the Web Audio spec allows calling `ctx.createMediaElementSource(el)` **only once per `HTMLMediaElement` lifetime**. Calling it again (for example during React Strict Mode double-effects or re-mounts) throws `InvalidStateError`. Cache `{ ctx, source }` in a `WeakMap<HTMLMediaElement, ...>` and reconnect/disconnect the `AnalyserNode` on remount rather than re-creating the source node.
4. Smooth amplitude/frequency values, map a few bands to bounded visual parameters, and pause analysis when playback stops or `document.hidden` is true.
5. Disconnect analyser nodes and cancel `requestAnimationFrame` on teardown (only close a cached `AudioContext` when the `<audio>`/`<video>` element itself is permanently discarded).

```ts
// StrictMode-safe MediaElement analysis graph (never calls createMediaElementSource twice)
type Graph = { ctx: AudioContext; source: MediaElementAudioSourceNode; analyser: AnalyserNode };
const elementGraphs = new WeakMap<HTMLMediaElement, Graph>();

export function attachAudioAnalyser(mediaEl: HTMLMediaElement): { analyser: AnalyserNode; detach: () => void } {
  let graph = elementGraphs.get(mediaEl);
  if (!graph) {
    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(mediaEl);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.8;
    source.connect(analyser);
    analyser.connect(ctx.destination); // Required so audible playback is not silenced
    graph = { ctx, source, analyser };
    elementGraphs.set(mediaEl, graph);
  }
  if (graph.ctx.state === 'suspended') void graph.ctx.resume();

  return {
    analyser: graph.analyser,
    detach: () => {
      // Suspend analysis work without destroying the single-use MediaElementAudioSourceNode
      if (graph!.ctx.state === 'running' && mediaEl.paused) void graph!.ctx.suspend();
    },
  };
}
```

Do not ask for microphone permission when analysing an already playing media element. Treat microphone capture as a separate, explicit, purpose-limited permission.

## Mapping rules

- Smooth and normalize low/mid/high frequency values; avoid raw-bin jitter.
- Change a small number of meaningful visual properties rather than every particle independently.
- Clamp amplitude, hue, speed, scale, and displacement ranges.
- Never map audio peaks to high-contrast flashing or strobing (>3 flashes/second violates WCAG 2.3.1; see [accessibility-performance.md](accessibility-performance.md)).
- Support fixed seed/frozen time for visual regression tests and expose a reduced-motion / opt-out toggle.

## AudioWorklet

Use `AudioWorklet` only when custom DSP or low-latency audio processing needs a dedicated audio rendering thread. Verify browser support, module loading, sample-rate assumptions, and fallback.

Official docs:
- Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- AnalyserNode: https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
- AudioWorklet: https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet
