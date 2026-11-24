# pixelcraft-web evaluation cases

## Case 1 — compact campaign shell with a costly hero

**Prompt**

> Keep our cinematic showcase on wide pages. On a phone the compact navigation should not hide booking; on shallow windows or with reduced motion a static hero is enough.

**Expected behaviors**

- Keeps the real booking destination reachable with the menu closed; checks menu dismissal and focus at portrait and short height.
- Keeps semantic content independent of the hero, and uses a fresh load in reduced motion and a trace to test that the unneeded scene does not initialize.
- Distinguishes a DOM geometry estimate from visual negative space inside the hero asset.

**Failure signals**

- Shrinks wide navigation without testing a touch action; classifies a hidden but eagerly loaded scene as a lightweight fallback; reports reduced-motion support from a media query alone.

## Case 2 — react app

**Prompt**

> Build a server-rendered React catalog page with filters.

**Expected behaviors**

- Selects or applies `pixelcraft-web` behavior when the prompt matches its trigger.
- uses real HTML semantics/render strategy/hydration discipline/state restoration.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- hydrates everything.
- breaks back/scroll restoration.
- generic responsive shrink.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 3 — pwa request

**Prompt**

> Make a documentation app installable and offline-capable.

**Expected behaviors**

- Selects or applies `pixelcraft-web` behavior when the prompt matches its trigger.
- routes to PWA manifest/service-worker/install/update/iOS guidance.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- manifest-only PWA.
- no offline states.
- ignores update flow.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 4 — combine a timeline, product scene, and GPU effect in a brownfield app

**Prompt**

> Add a choreographed scroll chapter, a 3D product preview, and a subtle particle layer to an existing Next.js app.

**Expected behaviors**

- Inspects the installed stack/runtime and routes motion, 3D, and graphics to the existing web references.
- Uses a narrow client boundary and keeps content, product data, navigation, and purchase actions in semantic DOM.
- Chooses GSAP only for the complex timeline, R3F/Three.js only for the product scene, and Canvas/Pixi/WebGL only if the particle workload warrants it.
- Defines poster/loading/error/context-loss, reduced-motion, touch, and static fallbacks.
- Checks package versions, plugin access, asset compression, lazy loading, and measured device budgets before changing dependencies.

**Failure signals**

- Hydrates the whole route, installs every library, hides product semantics in canvas, assumes WebGPU, or uses smooth scrolling to hijack input.
