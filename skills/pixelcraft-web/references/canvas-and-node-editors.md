# Canvas, diagram, node-based editors, and drag-and-drop

Choose between infinite whiteboard SDKs, 2D canvas scene graphs, DOM/SVG node-graph engines, and drag-and-drop toolchains by interaction model, object count, and accessibility requirements. For 3D scenes (`Three.js`, `R3F`, `WebGL`/`WebGPU`), see `pixelcraft-spatial`; for data charts, see `pixelcraft-dataviz`.

## Engine decision matrix

| Product type | Tools | Rendering model | Best fit | Primary trade-off |
|---|---|---|---|---|
| **Infinite whiteboard** | **tldraw** (v4), **Excalidraw** | HTML/SVG hybrid (tldraw) or rough Canvas 2D (Excalidraw) | Collaborative whiteboards, spatial canvases, diagramming apps | tldraw requires commercial license to remove watermark in production; Excalidraw's hand-drawn style is opinionated |
| **2D Canvas scene graph** | **Konva** (`react-konva` / `vue-konva`), **Fabric.js**, **Paper.js** | HTML5 Canvas 2D (multi-layer in Konva; single canvas in Fabric/Paper) | Design/annotation editors, floor plans, image/vector manipulation, 1k–10k shapes | Canvas pixels are invisible to screen readers unless paired with a parallel DOM/ARIA model |
| **Workflow / node graph** | **React Flow / XYFlow** (`@xyflow/react`, `@xyflow/svelte`), **Rete.js** | DOM nodes + SVG edges (XYFlow) | Visual automation builders, AI agent pipelines, low-code workflows, dataflow graphs | DOM node count above ~500–1,000 visible nodes needs virtualization or simplified LOD |
| **Network & enterprise diagrams** | **Cytoscape.js**, **JointJS**, **GoJS** | Canvas/WebGL (Cytoscape), SVG (JointJS), Canvas (GoJS) | Graph analytics / topology (Cytoscape); UML/BPMN/CAD enterprise diagrams (JointJS, GoJS) | GoJS and JointJS+ are commercial; Cytoscape is graph-layout focused rather than arbitrary React UI inside nodes |
| **Drag-and-drop** | **dnd-kit** (`@dnd-kit/react`, `@dnd-kit/dom`), **Pragmatic Drag and Drop** (`@atlaskit/pragmatic-drag-and-drop`) | Pointer/Keyboard sensors (dnd-kit) or native HTML5 DnD (Pragmatic) | **dnd-kit**: accessible sortable lists, kanban, trees with built-in keyboard sensor; **Pragmatic DnD**: tiny, framework-agnostic, cross-window/file drops, huge tables | Pragmatic DnD relies on native HTML5 DnD—must pair with explicit keyboard reorder actions + ARIA live announcements |

## Node-based editors (React Flow / XYFlow)

- Always import `'@xyflow/react/style.css'` and give the `<ReactFlow>` parent container an explicit non-zero height and width.
- **Memoization rule**: define `nodeTypes` and `edgeTypes` **outside** the component or inside `useMemo(() => (...), [])`. Wrap custom node/edge components in `React.memo` and callbacks (`onNodesChange`, `onEdgesChange`, `onConnect`) in `useCallback`. Passing a fresh inline `nodeTypes={{ custom: MyNode }}` object on every render forces React Flow to unmount and remount nodes on every drag tick.

```tsx
import { useMemo, useCallback } from 'react';
import { ReactFlow, useNodesState, useEdgesState, addEdge, type Connection } from '@xyflow/react';
import '@xyflow/react/style.css';
import { TriggerNode } from './TriggerNode';

export function WorkflowCanvas() {
  const [nodes, , onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const nodeTypes = useMemo(() => ({ trigger: TriggerNode }), []);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: '100%', height: '640px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
}
```

## Infinite whiteboards (tldraw / Excalidraw)

- **tldraw**: import `'tldraw/tldraw.css'` and pass `persistenceKey="board-id"` for automatic IndexedDB persistence and cross-tab sync. When building custom shapes with `BaseBoxShapeUtil`, validate props via `T.*` (`RecordProps`), render interactive UI inside `<HTMLContainer>`, and call `onPointerDown={(e) => e.stopPropagation()}` on inner buttons/inputs so canvas pan/select gestures do not hijack clicks.
- **Excalidraw**: lazy-load `@excalidraw/excalidraw` on the client only (no SSR) and treat `excalidrawAPI` ref calls as imperative mutations rather than re-passing the entire scene array on every keystroke.

## 2D Canvas performance (Konva / Fabric.js)

Every Konva `<Layer>` creates a separate `<canvas>` element. Keep layer count minimal (typically 2–4: static background, main scene, active drag layer):

- Set `listening={false}` on background/decorative layers and non-interactive shapes to skip hit-graph rendering.
- Set `perfectDrawEnabled={false}` on filled+stroked shapes where sub-pixel alpha overlap is unnecessary, and call `node.cache()` on complex static shapes/groups.
- Move the active shape onto a dedicated drag layer during `dragstart` and return it on `dragend` (via `shape.moveTo(dragLayer)` or `react-konva-utils` `<Portal>`) so dragging does not repaint the entire main layer on every frame.

```ts
// Konva 3-layer drag optimization
const backgroundLayer = new Konva.Layer({ listening: false });
const mainLayer = new Konva.Layer();
const dragLayer = new Konva.Layer();

star.cache();
star.on('dragstart', () => star.moveTo(dragLayer));
star.on('dragend', () => star.moveTo(mainLayer));
```

## Drag-and-drop toolchains & accessibility

### dnd-kit

- When customizing sensors on `DragDropProvider`, **extend** the default sensor list (`sensors={(defaults) => [...]}`) instead of replacing it with `[PointerSensor]` alone—omitting `KeyboardSensor` removes keyboard drag-and-drop support.
- Provide visible focus indicators on drag handles and screen-reader announcements for pickup, move, drop, and cancel.

```tsx
import { DragDropProvider } from '@dnd-kit/react';
import { PointerSensor } from '@dnd-kit/dom';

<DragDropProvider
  sensors={(defaults) => [
    ...defaults.filter((s) => s !== PointerSensor),
    PointerSensor.configure({ /* activation constraints */ }),
  ]}
>
  {/* sortable items */}
</DragDropProvider>
```

### Pragmatic Drag and Drop (`@atlaskit/pragmatic-drag-and-drop`)

- Always merge cleanup functions returned by `draggable()`, `dropTargetForElements()`, and `monitorForElements()` using `combine(...)` inside `useEffect` (or framework unmount) so global listeners never leak.
- Because native HTML5 DnD has no built-in keyboard mode, pair every Pragmatic DnD reorderable list/board with an explicit keyboard control (e.g., "Move up / Move down / Move to column" action menu) and announce the new position in an `aria-live="polite"` region.

```ts
import { useEffect } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

useEffect(() => {
  const el = cardRef.current;
  if (!el) return;
  return combine(
    draggable({ element: el }),
    dropTargetForElements({ element: el }),
  );
}, []);
```

## Canvas & diagram accessibility rules

- Any canvas or node-graph product that users must operate—not just view—needs keyboard navigation (pan/zoom shortcuts, focusable nodes/handles, delete/undo shortcuts) and an accessible structural view (outline list or inspector panel) for screen-reader users.
- Honor `prefers-reduced-motion` on auto-layout transitions, `fitView` animations, and zoom springs.

## Do/don't pairs

| Do | Don't |
|---|---|
| Memoize `nodeTypes` and `edgeTypes` outside render or in `useMemo` | Pass inline `nodeTypes={{ custom: CustomNode }}` literals into `<ReactFlow>` |
| Use `listening={false}`, `perfectDrawEnabled={false}`, and a drag layer in Konva | Redraw 500 uncached shapes on a single Konva layer every `pointermove` |
| Call `e.stopPropagation()` on `onPointerDown` for controls inside tldraw `HTMLContainer` | Let canvas drag gestures swallow button clicks inside custom shapes |
| Keep `KeyboardSensor` in dnd-kit or pair Pragmatic DnD with keyboard reorder actions | Ship pointer-only drag-and-drop with no keyboard alternative (WCAG 2.1.1 / 2.5.7) |
| Return `combine(draggable(...), dropTargetForElements(...))` from `useEffect` | Leak Pragmatic DnD listeners across route or list re-renders |

## Verification commands

```sh
npm run build
npx playwright test
```

Verify 60fps drag/pan frame pacing, zoom-to-cursor accuracy, keyboard reordering, and pointer-vs-control event isolation in a real browser (`rendered`).
