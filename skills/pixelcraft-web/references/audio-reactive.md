# Audio-reactive graphics

## Audio pipeline

Use Web Audio when audio analysis genuinely improves a visual interaction. Separate media playback from analysis:
1. obtain a user gesture before starting or resuming an `AudioContext` when browser policy requires it;
2. connect the media source or permitted input to an `AnalyserNode` or `AudioWorklet` **and** route playback to `ctx.destination` when using `MediaElementAudioSourceNode` (creating a media-element source reroutes audio off the default output; terminating at the analyser silences playback);
3. smooth amplitude/frequency values and map a few bands to bounded visual parameters;
4. synchronize rendering to media state and pause when playback or document visibility stops;
5. disconnect nodes, cancel `requestAnimationFrame`, and close the `AudioContext` on teardown.

```ts
// Safe media-element analysis graph: keeps audible output connected
const ctx = new AudioContext();
const source = ctx.createMediaElementSource(audioEl);
const analyser = ctx.createAnalyser();
analyser.fftSize = 2048;
analyser.smoothingTimeConstant = 0.8;

source.connect(analyser);
analyser.connect(ctx.destination); // Required so playback is not silenced

// On teardown:
// source.disconnect(); analyser.disconnect(); void ctx.close();
```

Do not ask for microphone permission when analysing an already playing media element. Treat microphone capture as a separate, explicit, purpose-limited permission.

## Mapping rules

- Smooth and normalize low/mid/high frequency values; avoid raw-bin jitter.
- Change a small number of meaningful visual properties rather than every particle independently.
- Clamp amplitude, hue, speed, scale, and displacement ranges.
- Do not map peaks to high-contrast flashing or strobing.
- Support fixed seed/frozen time for visual regression tests.

## AudioWorklet

Use AudioWorklet only when custom DSP or low-latency audio processing needs a separate audio rendering thread. Verify browser support, module loading, sample-rate assumptions, and fallback. Avoid putting ordinary amplitude visualization into a worklet without a measured need.

Official docs:
- Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- AnalyserNode: https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
- AudioWorklet: https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet
