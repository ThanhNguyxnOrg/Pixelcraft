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

For screenshots and visual regression, support a deterministic seed and frozen time. Record asset provenance and do not bundle third-party example assets without license review.
