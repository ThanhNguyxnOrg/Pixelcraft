# XR platform idioms

## visionOS (visionOS 2 & visionOS 26)

Core surface model:

| Surface | Use |
|---|---|
| `WindowGroup` | 2D / shallow-depth UI in Shared Space; resizing and multitasking adaptation are mandatory |
| `WindowGroup` (volumetric / `Volume`) | bounded 3D content viewed from multiple angles without taking over the user's room |
| `ImmersiveSpace` | Full Space world or mixed-reality scene when spatial presence or room-scale interaction is the task |

Key visionOS 2 & visionOS 26 capabilities:

- **visionOS 2**: react to viewing angle around volumes via `VolumeViewpoint` (`onVolumeViewpointChange`), build shared tabletop experiences with **`TabletopKit`** (table surface, seats, pawns, physics), and handle unified indirect/direct 3D input via `SpatialTapGesture` and `SpatialEventCollection`.
- **visionOS 26**: author 3D SwiftUI hierarchies directly with **`SpatialLayout`**, **`depthAlignment`**, and **`ViewAttachmentComponent`** (attaching SwiftUI views straight onto RealityKit entities without boilerplate `attachments:` closures); anchor persistent **wall and table spatial widgets** (`WidgetKit` spatial mounting styles); coordinate shared spatial seating and **Spatial Personas / SharePlay** via `SystemCoordinator`; apply **Liquid Glass** spatial material updates thoughtfully (preserve text contrast over bright/cluttered passthrough); and embed stereo 3D on the spatial web via Safari's **`<model>`** element.
- **Privacy & ornaments**: gaze-and-pinch is private by design—rely on system `.hoverEffect()` rather than logging gaze; place supplemental content in adjacent windows rather than bloated ornaments; request ARKit world/hand/scene permissions only inside a Full Space with clear user explanation.

```swift
import SwiftUI
import RealityKit

struct InspectionVolume: View {
    var body: some View {
        RealityView { content in
            let root = Entity()
            // visionOS 26: attach SwiftUI directly as an entity component
            let label = Entity()
            label.components.set(ViewAttachmentComponent(rootView: Text("Turbine Core").padding(8).glassBackgroundEffect()))
            label.position = [0, 0.25, 0]
            root.addChild(label)
            content.add(root)
        }
        .gesture(SpatialTapGesture().targetedToAnyEntity().onEnded { value in
            // Unified gaze+pinch or direct touch hit handling
            handleInspect(entity: value.entity)
        })
    }
}
```

## Android XR (Jetpack XR SDK / Jetpack Compose for XR / SceneCore)

Android XR distinguishes **Home Space** (multitasking shared space where existing 2D Android/Compose apps spatialize automatically alongside other apps) from **Full Space** (single focused app with unbounded 3D environment, passthrough control, spatial panels, and 3D glTF entities via **SceneCore**).

Use **Jetpack Compose for XR** (`androidx.xr.compose.spatial`) and **Material Design for XR** idioms:

- `Subspace`: hosts spatial composables inside a 3D coordinate container when in Full Space;
- `SpatialPanel`: positions interactive Compose UI panels in 3D space with resize/move policies;
- `Orbiter`: attaches floating contextual navigation rails, toolbars, or controls offset from a panel edge (Android XR equivalent of visionOS ornaments);
- `SpatialRow` / `SpatialColumn` and `SpatialElevation` (`SpatialElevationLevel`): arrange multi-panel workspaces and depth hierarchy without manual matrix math;
- **SceneCore (`Session`, `GltfModelEntity`)**: load 3D glTF/GLB assets, spatial audio, and environment skyboxes alongside Compose panels.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import androidx.xr.compose.spatial.ContentEdge
import androidx.xr.compose.spatial.Orbiter
import androidx.xr.compose.spatial.Subspace
import androidx.xr.compose.subspace.SpatialPanel
import androidx.xr.compose.subspace.SpatialRow
import androidx.xr.compose.subspace.layout.SubspaceModifier
import androidx.xr.compose.subspace.layout.height
import androidx.xr.compose.subspace.layout.width

@Composable
fun SpatialWorkspace() {
    Subspace {
        SpatialRow {
            SpatialPanel(SubspaceModifier.width(900.dp).height(640.dp)) {
                MainDocumentView()
                Orbiter(position = ContentEdge.Start, offset = 24.dp) {
                    WorkspaceNavRail()
                }
            }
        }
    }
}
```

Verify both Home Space fallback (2D window resizing without `Subspace`) and Full Space transition (`Session.scene.spatialEnvironment`) so apps degrade gracefully when users switch spaces.

## Meta Horizon OS and Meta Spatial SDK

Meta Quest runs **Meta Horizon OS** with two primary native paths:

- **Meta Spatial SDK (native Android / Kotlin)**: build lightweight Quest spatial apps directly in Kotlin + Jetpack Compose panels + Spatial SDK ECS without a Unity/Unreal runtime—ideal for productivity, media, and mixed-reality utilities needing small APK size and crisp 2D/3D text.
- **Meta XR Interaction SDK (Unity / Unreal)** + **Horizon OS UI Set**: use platform-idiomatic spatial UI controls, ray/distance interactors for far panels, poke/direct touch for near panels, grab interactors for physical objects, and controller + hand-tracking parity with hover/acquire/release visual, audio, and haptic feedback.
- **Mixed Reality & Passthrough**: use **MRUK (Mixed Reality Utility Kit)** and OpenXR scene understanding for room mesh, walls, tables, raycast occlusion, and persistent spatial anchors; when using the **Passthrough Camera API** for computer vision, disclose camera usage explicitly and minimize retained frame data.
- **Comfort**: follow Meta's angular locomotion tunneling vignette model—define comfort occlusion in visual degrees, never fixed screen UVs.

## WebXR (2025–2026)

Feature-detect `navigator.xr` and `await navigator.xr.isSessionSupported('immersive-vr' | 'immersive-ar')` with explicit session features (`local-floor`, `bounded-floor`, `hand-tracking`, `layers`) and always ship a non-XR desktop/mobile fallback.

### `@react-three/xr` v6 + `@pmndrs/uikit`

Use the v6 store API (`createXRStore()`, `<XR store={store}>`, `<XROrigin>`) rather than deprecated v5 `<VRButton>`/`<Controllers>`/`<Hands>` wrappers. Pair with **`@pmndrs/uikit`** for crisp MSDF/SDF Flexbox spatial UI inside Three.js/R3F instead of blurry HTML-to-canvas textures:

```tsx
import { Canvas } from '@react-three/fiber';
import { createXRStore, XR, XROrigin } from '@react-three/xr';
import { Root, Container, Text } from '@react-three/uikit';

const store = createXRStore();

export function SpatialApp() {
  return (
    <>
      <button onClick={() => store.enterVR()}>Enter VR</button>
      <Canvas>
        <XR store={store}>
          <XROrigin position={[0, 0, 1.5]} />
          <group position={[0, 1.4, 0]}>
            <Root sizeX={1.2} sizeY={0.7} flexDirection="column" padding={24} backgroundColor="#111827">
              <Container>
                <Text fontSize={32} color="#f8fafc">Spatial Control Panel</Text>
              </Container>
            </Root>
          </group>
        </XR>
      </Canvas>
    </>
  );
}
```

### Dedicated WebXR engines, layers, and WebGPU caveats

- **Wonderland Engine**: WebAssembly + WebGL2 engine engineered specifically for standalone headset WebXR frame-rate budgets, tiny download payloads, and instanced rendering.
- **Needle Engine**: exports Unity/Blender scenes to WebXR/Three.js + USDZ Quick Look (visionOS/iOS) from one authoring pipeline.
- **Babylon.js & PlayCanvas WebXR**: use `scene.createDefaultXRExperienceAsync(...)` (Babylon) or `app.xr.start(camera, pc.XRTYPE_VR, pc.XRSPACE_LOCALFLOOR)` (PlayCanvas). **WebGPU + WebXR (`XRGPUBinding`) remains experimental/flag-gated across headset browsers—always provide a WebGL2 fallback path.**
- **WebXR Layers (`XRProjectionLayer`, `XRQuadLayer`, `XRCylinderLayer`)**: submit spatial UI panels and video directly to the XR compositor via quad/cylinder layers so text renders at native headset resolution without double-sampling through the eye buffer.
- **Three.js / A-Frame baseline**: always drive XR frames with `renderer.setAnimationLoop(render)` (never `requestAnimationFrame`), move an XR rig rather than fighting tracked camera transforms, and measure stereo frame time on standalone headsets rather than desktop GPUs.

## Unity XR Interaction Toolkit (XRI)

- Move the player via `XROrigin` + locomotion mediator/providers (teleport, snap turn, smooth turn, angular tunneling vignette).
- Use `XRBaseInteractor` / `XRBaseInteractable` (Near-Far Interactor, Poke Interactor, Ray Interactor) with Input System Action Maps across OpenXR controller and hand profiles.
- Profile on target standalone hardware (Quest / Android XR / visionOS via PolySpatial) using Unity Profiler + OVR Metrics Tool / RenderDoc—desktop editor frame rates hide mobile tile-GPU overdraw, thermal throttling, and GC spikes.

## Unreal Engine OpenXR

- Target the official **OpenXR** plugin (`OpenXR`, `OpenXRHandTracking`, `XRBase`) with **Enhanced Input** action mappings so motion controllers and hand-tracking profiles stay portable across Quest, PCVR, and Android XR.
- Interact with 3D `UWidgetComponent` menus using **`UWidgetInteractionComponent`** attached to controller/hand aim poses (set explicit interaction distance, debug visualization off in shipping builds, and ensure hover/focus states respond cleanly).
- Render critical HUD text, subtitles, and menus with **Stereo Layers (`UStereoLayerComponent`, Quad/Cylinder/Equirect)** so the XR compositor samples them directly at native sharpness instead of blurring text through temporal anti-aliasing / eye-buffer distortion.
- Budget draw calls, instanced stereo rendering, forward shading vs mobile deferred, and Vulkan mobile MSAA explicitly in Unreal Insights on device (`rendered`).
