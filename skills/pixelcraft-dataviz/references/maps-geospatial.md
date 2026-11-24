# Maps and geospatial UI

Choose a mapping engine only when spatial location is essential—tables, ranked lists, or tile-grid cartograms often communicate regional comparisons better. When a map is justified, pick the engine by **tile format (vector vs raster), coordinate system (Web Mercator vs custom GIS CRS vs 3D WGS84 globe), feature count, and licensing**.

## Geospatial engine decision matrix

| Engine | Rendering | Best fit | Licensing / cost | Primary trade-off |
|---|---|---|---|---|
| **MapLibre GL JS (v5+)** | WebGL2 vector tiles + native globe projection | Open-source 2D/3D vector maps, custom basemap styles, self-hosted PMTiles/Protomaps | BSD-3 (bring your own tiles/styles) | Requires tile/style hosting or PMTiles setup |
| **Mapbox GL JS** | WebGL vector tiles + 3D terrain/globe | Commercial turnkey maps, geocoding, directions, Studio styling | Proprietary / metered map loads | Vendor lock-in and per-load billing |
| **Leaflet** | DOM/SVG or Canvas (`preferCanvas: true`) raster tiles | Lightweight store locators, simple markers/choropleths (< 5k features) | BSD-2 (open source) | Raster tiles blur on fractional zoom/rotation; DOM markers lag past ~1k points |
| **OpenLayers** | Canvas 2D / WebGL | Specialized GIS: custom projections (`proj4`), OGC WMS/WFS/WMTS/WCS, cadastral editing | BSD-2 (open source) | Steeper API surface for simple consumer maps |
| **deck.gl (v9+)** | WebGL2 / WebGPU GPU layers | 100k–10M+ points, trips, arcs, hexbin/heatmap aggregations overlaid on a basemap | MIT (open source) | Needs a basemap provider for geographic context |
| **kepler.gl** | Turnkey geospatial analytics workbench over deck.gl | Exploratory data-science map apps with built-in filters and time sliders | MIT (open source) | Heavy Redux-coupled app shell; oversized for simple embeds |
| **CesiumJS** | WebGL 3D WGS84 globe + 3D Tiles | Aerospace, urban digital twins, terrain draping, satellite orbits, photogrammetry | Apache-2.0 (Cesium ion assets metered) | Large bundle (~3–5 MB + workers) and high GPU/battery draw on mobile |

## Protomaps / PMTiles self-hosted vector tiles

Use **Protomaps / PMTiles** when you need zero-tile-server, cost-predictable vector maps served as a single static `.pmtiles` archive via HTTP Range requests (S3, Cloudflare R2, CDN). Always verify **glyph** (`.pbf` font stacks) and **sprite** URLs in style JSON—missing glyph endpoints cause every street and city label to vanish silently.

```ts
import maplibregl from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import 'maplibre-gl/dist/maplibre-gl.css';

const protocol = new Protocol();
maplibregl.addProtocol('pmtiles', protocol.tile);

const map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    glyphs: 'https://cdn.example.com/fonts/{fontstack}/{range}.pbf',
    sprite: 'https://cdn.example.com/sprites/v4/light',
    sources: {
      protomaps: {
        type: 'vector',
        url: 'pmtiles://https://cdn.example.com/tiles/region.pmtiles',
        attribution: '© OpenStreetMap contributors',
      },
    },
    layers: [/* basemap fill, road, and symbol layers */],
  },
  center: [-122.4, 37.78],
  zoom: 11,
});
```

## MapLibre GL JS + deck.gl interleaved idiom & WebGL2 constraint

- Wait for `style.load` / `load` before calling `map.setProjection({ type: 'globe' })`, `map.addSource()`, or `map.addLayer()`, and always call `map.remove()` on unmount to release the WebGL context.
- **WebGL2 vs WebGPU constraint**: `MapLibreOverlay({ interleaved: true })` shares MapLibre GL JS's **WebGL2** context so deck.gl layers can render *beneath* basemap labels via `beforeId`. Interleaved mode **does not work with WebGPU**—if using deck.gl v9+'s WebGPU backend, run `interleaved: false` (separate overlay canvas) or keep deck.gl on WebGL2 when label interleaving matters.
- For 100k+ animated or streaming points in deck.gl, pass binary `Float32Array` attribute buffers (`{ length, attributes: { getPosition: { value, size, offset, stride } } }`) instead of allocating JS objects per frame.

```ts
import { MapLibreOverlay } from '@deck.gl/maplibre';
import { ScatterplotLayer } from '@deck.gl/layers';

await map.once('load');

map.addControl(
  new MapLibreOverlay({
    interleaved: true, // requires sharing MapLibre's WebGL2 context (not WebGPU)
    layers: [
      new ScatterplotLayer({
        id: 'sites',
        data: sites,
        getPosition: (d) => d.coords,
        getFillColor: [15, 76, 129, 180],
        getRadius: 200,
        beforeId: 'places_locality', // keep city labels readable above data
      }),
    ],
  }),
);
```

## Client-side spatial operations (`Turf.js`)

Use modular **Turf.js** packages (`@turf/bbox`, `@turf/boolean-point-in-polygon`, `@turf/buffer`, `@turf/distance`) for client-side viewport bounds, polygon filtering, geofence checks, and spatial joins on small-to-medium GeoJSON without round-tripping to PostGIS:

```ts
import bbox from '@turf/bbox';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

const visibleSites = sitesGeoJson.features.filter((pt) => booleanPointInPolygon(pt, activeRegionPolygon));
const [minX, minY, maxX, maxY] = bbox({ type: 'FeatureCollection', features: visibleSites });
map.fitBounds([[minX, minY], [maxX, maxY]], { padding: 32 });
```

Import individual `@turf/*` modules instead of the full `@turf/turf` umbrella package to avoid bloating bundles. For >50k complex polygons, offload spatial indexing to PostGIS, DuckDB Spatial, or a Web Worker.

## Leaflet & Mapbox GL JS idioms and traps

### Leaflet (`preferCanvas: true`, clustering, & StrictMode cleanup)

- **Vector & marker scale**: pass **`preferCanvas: true`** to `L.map(...)` whenever rendering hundreds of `L.circleMarker` / GeoJSON polygons so Leaflet renders on Canvas 2D instead of saturating the DOM with thousands of SVG nodes; use **`leaflet.markercluster`** (or `supercluster`) once pin counts exceed ~200 so overlapping pins remain tappable and readable.
- **Lifecycle & accessibility**: ensure the map container has an explicit CSS height (zero height renders a blank tile grid), call **`map.remove()`** on unmount (prevents React StrictMode `Map container is already initialized` crashes), provide explicit keyboard pan/zoom controls, and pair markers with a synchronized searchable/sortable location list so keyboard and screen-reader users can inspect every site.

```ts
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function mountLeafletMap(el: HTMLElement, sites: { name: string; lat: number; lng: number }[]) {
  const map = L.map(el, { preferCanvas: true }).setView([37.78, -122.4], 11);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);

  for (const site of sites) {
    L.circleMarker([site.lat, site.lng], { radius: 6, color: '#0f4c81' })
      .bindPopup(site.name)
      .addTo(map);
  }
  return () => map.remove();
}
```

### Mapbox GL JS (scoped public tokens, contrast, & MapLibre parity)

- **Scoped public token only**: restrict browser access tokens (`pk.*`) by HTTP referrer / allowed URLs and public read scopes only—**never** bundle secret `sk.*` tokens into frontend code. Call `map.remove()` on unmount to avoid leaking WebGL contexts and triggering redundant metered map loads.
- **Projection & style contrast**: test data-overlay contrast across both light and dark Studio styles, `globe` vs `mercator` projections, and 3D terrain/fog settings—low-contrast basemap roads or atmospheric fog easily wash out thematic data layers.
- **MapLibre GL JS parity**: Mapbox GL JS and MapLibre GL JS share Style Spec roots (`addSource`, `addLayer`, expressions), but diverge on Mapbox v3 proprietary features (Standard Style `import` slots, Mapbox-hosted 3D lighting/config APIs, and commercial telemetry/billing). Keep custom data layers in standard GeoJSON/vector Style Spec expressions whenever preserving a future migration path to open-source MapLibre matters.

## CesiumJS 3D Tiles & lifecycle

Load 3D Tiles asynchronously via `await Cesium.Cesium3DTileset.fromUrl(url, { skipLevelOfDetail: true })` (never deprecated synchronous constructors) and call `viewer.destroy()` on unmount.

## Choropleth pitfalls, cartographic truthfulness & accessibility

- **Normalization**: Normalize counts by population, households, or area when comparing unequal regions; if mapping raw counts intentionally, label them explicitly as counts and consider proportional symbols instead.
- **Classification breaks**: Quantile, equal-interval, natural breaks (Jenks), and manual thresholds tell different stories—publish the classification method and break values in the legend.
- **Area distortion**: Large sparse regions visually overwhelm dense cities in Web Mercator or raw choropleths; use equal-area projections (D3/Observable Plot), globe projection, cartograms, or tile-grid maps when fair regional weight matters.
- **Missing vs zero data**: Give missing/no-data regions a distinct neutral fill or hatch pattern—never reuse the zero/minimum value color.
- **Boundaries & attribution**: Territory borders can be politically sensitive; select boundary datasets consciously for the product's legal/user context and display required attributions (OpenStreetMap, tile host, GIS agency) legibly.
- **Accessible alternative**: WebGL and Canvas maps are opaque to screen readers and hard for keyboard/tremor users—pair every data map with a searchable/sortable location list or ranking table, direct labels for key regions, keyboard pan/zoom controls, and visible focus rings (WCAG 2.1.1 & 2.5.7).

## Do/don't pairs

| Do | Don't |
|---|---|
| Call `map.remove()` / `viewer.destroy()` on unmount | Leak WebGL contexts (browsers cap ~8–16), double-init Leaflet, or inflate metered Mapbox loads |
| Set `preferCanvas: true` + marker clustering in Leaflet for >200 features | Mount 2,000 DOM/SVG markers in Leaflet without clustering or a list fallback |
| Restrict Mapbox GL JS `pk.*` tokens by referrer and verify style/projection contrast | Ship unrestricted/secret `sk.*` tokens or assume dark basemap labels stay legible under 3D fog |
| Keep deck.gl on WebGL2 when using `MapLibreOverlay({ interleaved: true })` | Assume WebGPU deck.gl layers can interleave into MapLibre's WebGL2 context |
| Self-host PMTiles with explicit `glyphs` and `sprite` URLs | Omit `glyphs` in style JSON and ship a map with missing labels |
| Give missing choropleth regions a distinct neutral/hatched treatment | Color missing regions identically to `0` |
| Import modular `@turf/bbox` / `@turf/boolean-point-in-polygon` | Pull the entire `@turf/turf` monolith for one distance check |
| Pair every interactive map with a keyboard-accessible ranking table/list | Trap critical location metrics inside hover-only pins |

## Verification commands

```sh
npm run build
npx playwright test
```

Verify lazy bundle splitting and modular `@turf/*` imports (`static`), and inspect WebGL context cleanup across route transitions, glyph/label rendering, mobile touch pan/zoom (`touch-action`), missing-data styling, and keyboard/table fallback in a browser (`rendered`).
