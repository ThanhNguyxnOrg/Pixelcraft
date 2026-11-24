# Maps and geospatial UI

Choose a mapping engine by **tile format (vector vs raster), coordinate system (Web Mercator vs custom GIS CRS vs 3D WGS84 globe), feature count, and licensing**—not by defaulting to one library for every map.

## Geospatial engine decision matrix

| Engine | Rendering | Best fit | Licensing / cost | Primary trade-off |
|---|---|---|---|---|
| **MapLibre GL JS (v5+)** | WebGL vector tiles + native globe projection | Open-source 2D/3D vector maps, custom basemap styles, self-hosted PMTiles/Protomaps | BSD-3 (open source; bring your own tile host) | Requires tile/style hosting or PMTiles setup |
| **Mapbox GL JS** | WebGL vector tiles + 3D terrain/globe | Commercial turnkey maps, geocoding, directions, Studio styling | Proprietary / metered map loads | Vendor lock-in & per-load billing |
| **Leaflet** | DOM/SVG or Canvas (`preferCanvas: true`) raster tiles | Lightweight store locators, simple markers/choropleths (< 5k features), minimal bundle | BSD-2 (open source) | Raster tiles blur on fractional zoom/rotation; DOM markers lag past ~1,000 points |
| **OpenLayers** | Canvas 2D / WebGL | Specialized GIS: custom projections (`proj4`), OGC WMS/WFS/WMTS/WCS, CAD/cadastral editing | BSD-2 (open source) | Steeper API surface than Leaflet/MapLibre for simple consumer maps |
| **deck.gl (v9+)** | WebGL2 / WebGPU GPU layers | 100k–10M+ points, trips, arcs, hexbin/heatmap aggregations overlaid on MapLibre/Mapbox/Google Maps | MIT (open source) | Needs a basemap provider for geographic context |
| **kepler.gl** | Turnkey geospatial analytics app built on deck.gl | Exploratory data-science map workbenches with built-in filters, time-sliders, and layer controls | MIT (open source) | Heavy Redux-coupled app shell; too heavy for a simple embedded map |
| **CesiumJS** | WebGL 3D WGS84 globe + 3D Tiles | Aerospace, defense, urban digital twins, terrain draping, satellite orbits, BIM/photogrammetry | Apache-2.0 (Cesium ion assets metered) | Large bundle (~3–5 MB + workers) and high GPU/battery draw on mobile |

## MapLibre GL JS + deck.gl interleaved idiom

- Always wait for `style.load` / `load` before calling `map.setProjection({ type: 'globe' })`, `map.addSource()`, or `map.addLayer()`, and call `map.remove()` on unmount to release the WebGL context.
- When overlaying **deck.gl v9+** on **MapLibre**, use `MapLibreOverlay` from `@deck.gl/maplibre` with `interleaved: true` and `beforeId` so dense data layers render **beneath** city/road labels instead of obscuring map legibility.
- For 100k+ animated or streaming points in deck.gl, pass binary `Float32Array` attribute buffers (`{ length, attributes: { getPosition: { value, size, offset, stride } } }`) instead of allocating millions of JS objects per frame.

```ts
import { MapLibreOverlay } from '@deck.gl/maplibre';
import { ScatterplotLayer } from '@deck.gl/layers';
import { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const map = new Map({
  container: 'map',
  style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  center: [-122.4, 37.78],
  zoom: 11,
});

await map.once('load');

map.addControl(
  new MapLibreOverlay({
    interleaved: true,
    layers: [
      new ScatterplotLayer({
        id: 'sites',
        data: sites,
        getPosition: (d) => d.coords,
        getFillColor: [15, 76, 129, 180],
        getRadius: 200,
        beforeId: 'watername_ocean', // keep basemap labels readable above data
      }),
    ],
  }),
);
```

## CesiumJS 3D Tiles & lifecycle

- Load 3D Tiles asynchronously via `await Cesium.Cesium3DTileset.fromUrl(url, { skipLevelOfDetail: true, ... })` (not deprecated synchronous constructors) and call `viewer.destroy()` on component unmount.

## Cartographic truthfulness & accessibility

- **Projection & normalization**: never plot raw population totals as choropleth colors without normalizing per capita or per area; avoid Web Mercator area distortion for global statistical comparisons (use equal-area projections in D3/Observable Plot or globe projection).
- **Attribution**: always display required tile/data attributions (OpenStreetMap, tile vendor, government GIS) legibly.
- **Accessible alternative**: interactive WebGL/Canvas maps are opaque to screen readers and difficult for tremor/keyboard users—pair every data map with a searchable/sortable location list or summary table, keyboard pan/zoom controls, and visible focus rings on controls (WCAG 2.1.1 & 2.5.7).

## Do/don't pairs

| Do | Don't |
|---|---|
| Call `map.remove()` / `viewer.destroy()` on unmount | Leak WebGL contexts across route transitions (browsers cap active contexts ~8–16) |
| Use `MapLibreOverlay({ interleaved: true, beforeId })` for deck.gl over MapLibre | Paint opaque GPU layers on top of every street and city label |
| Pass binary `Float32Array` attributes to deck.gl for 100k+ points | Allocate 500k JS objects per animation tick |
| Enable `preferCanvas: true` in Leaflet or switch to MapLibre/deck.gl above 1k points | Mount 5,000 individual DOM `<div>` pins in Leaflet |
| Pair every interactive data map with a keyboard-accessible list/table alternative | Trap critical location or metric data inside hover-only map pins |

## Verification commands

```sh
npm run build
npx playwright test
```

Verify map bundle lazy-loading (`static`), and check WebGL context cleanup across route navigation, label contrast, mobile touch pan/zoom (`touch-action`), and keyboard/table fallback in a real browser (`rendered`).
