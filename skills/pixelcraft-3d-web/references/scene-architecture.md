# 3D scene architecture

## Renderer decision

Use Three.js for direct control of scene, renderer, camera, asset loading, and lifecycle. Use React Three Fiber when the application is React and declarative component composition is useful. Use Drei selectively for helpers, controls, loaders, and abstractions; do not treat every helper as required. Use Spline when a designer-authored scene and hosted/exported runtime are the right trade-off. Use WebGPU only after verifying browser and library support.

## Scene contract

Record:
- world units and object scale;
- coordinate orientation and origin;
- camera type, FOV/frustum, near/far planes, and reset behavior;
- user controls, damping, limits, and input mapping;
- lighting/environment and color-management assumptions;
- materials, transparency, tone mapping, and shadow ownership;
- asset loading, missing asset, context loss, resize, and reduced-motion behavior.

Keep high-value text and controls in the DOM. Treat canvas as a visual/manipulation surface, not a replacement for product semantics.

## Composition

- Establish silhouette and camera framing before adding detail.
- Use one main light strategy; avoid several expensive real-time shadow-casting lights without evidence.
- Use environment maps for reflections where practical.
- Keep postprocessing selective: a single restrained effect can be meaningful; multiple full-screen effects compound fill-rate and memory cost.
- Make object manipulation bounded, resettable, and understandable.
- Avoid involuntary camera movement. User-controlled orbit is not a license for spinning on idle.

## Official references

- Three.js docs: https://threejs.org/docs/
- Three.js manual: https://threejs.org/manual/
- React Three Fiber docs: https://r3f.docs.pmnd.rs/
- Drei repository/docs: https://github.com/pmndrs/drei
- Spline docs: https://docs.spline.design/
- WebGPU API: https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
