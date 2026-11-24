# Audio-reactive graphics

## Audio pipeline

Use Web Audio when audio analysis genuinely improves a visual interaction. Separate media playback from analysis:
1. obtain a user gesture before starting an AudioContext when browser policy requires it;
2. connect the media source or permitted input to an AnalyserNode or AudioWorklet;
3. smooth amplitude/frequency values and map a few bands to bounded visual parameters;
4. synchronize rendering to media state and pause when playback/visibility stops;
5. close/disconnect nodes and release audio resources on teardown.

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
