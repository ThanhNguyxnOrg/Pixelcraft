# Progressive web apps

A PWA is not merely “a website with a manifest.” Installation, offline behavior, push, storage, updates, platform integration, and browser UI each have separate support matrices. Feature-detect every capability; never infer it from a user-agent string.

## Manifest contract

Link the same manifest from every installable page:

```html
<link rel="manifest" href="/manifest.webmanifest" />
```

Common members:

| Member | Meaning / UX rule |
|---|---|
| `name` / `short_name` | full and constrained-space app names; Chromium installability requires at least one |
| `id` | stable app identity; changing it can create a distinct installed app in supporting browsers |
| `start_url` | URL opened on launch; keep it inside `scope`, stable, authenticated-state aware, and useful when offline |
| `scope` | URL space treated as in-app; navigation outside it may expose browser context UI |
| `display` | preferred presentation: `browser`, `minimal-ui`, `standalone`, or `fullscreen`; actual fallback/support varies |
| `display_override` | ordered advanced fallback such as `window-controls-overlay` before `standalone`; verify browser support |
| `icons` | install/home/task switcher icons; Chromium requires both 192px and 512px entries |
| `background_color` | launch/placeholder background before CSS loads; match real first paint to avoid flash |
| `theme_color` | surrounding OS/browser chrome color; also coordinate meta theme-color behavior |
| `description` / `screenshots` | richer install UI metadata in supporting browsers |
| `orientation` | only lock when the experience truly requires it; orientation locks are often hostile UX |
| `categories` / `lang` / `dir` | metadata/localization hints; implementation is incomplete or platform-dependent |
| `shortcuts` | launcher shortcuts to deep actions; URLs must stay in scope and handle auth/offline states |
| `share_target` | receive shares in supporting browsers; validate method/params and security/privacy behavior |
| `file_handlers` | register file-type handling where supported; browser/OS support is limited |
| `protocol_handlers` | register custom/web-safe protocol handling where supported; validate navigation/security |
| `launch_handler` | influence whether launch focuses an existing client or opens a new one; support varies |
| `prefer_related_applications` / `related_applications` | native-app preference can suppress web install promotion; for Chromium installability the preference must be absent or false |

Example:

```json
{
  "id": "/",
  "name": "Example Workspace",
  "short_name": "Workspace",
  "start_url": "/?source=pwa",
  "scope": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#102033",
  "description": "Offline-capable project workspace.",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

Maskable icons need content inside the platform's safe zone; verify adaptive masks rather than padding everything blindly.

## Installability criteria

Current Chromium criteria for firing `beforeinstallprompt`/showing browser install promotion include:

- app not already installed;
- user engagement heuristic: the user has clicked/tapped the page at least once and spent at least 30 seconds viewing it across visits;
- HTTPS or localhost/loopback in development;
- manifest with `name` or `short_name`;
- icons including 192px and 512px;
- `start_url`;
- `display` one of `fullscreen`, `standalone`, `minimal-ui`, or `window-controls-overlay` (or an appropriate `display_override` result);
- `prefer_related_applications` absent or false.

Other browsers differ. Some let users create shortcuts/install even when promotion criteria are not met. Service workers are central to offline UX, but current Chromium promotion criteria do not simply mean “register any service worker”; verify target-browser requirements instead of copying old checklist versions.

## Install prompt UX

`beforeinstallprompt` is a browser-owned opportunity, not permission to interrupt:

```js
let deferredInstallPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  showInstallAction.hidden = false;
});

showInstallAction.addEventListener('click', async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  const { outcome } = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  reportOutcomeHonestly(outcome);
});
```

UX rules:

- do not ask on first paint; wait until the user has experienced enough value to understand why installation matters;
- use an explicit, dismissible in-product action (“Install workspace”) rather than a modal ambush;
- explain the concrete benefit: offline access, launch behavior, file handling, shortcuts—not vague “better experience”;
- respect dismissal and do not reprompt aggressively;
- detect/display state using `appinstalled`, display-mode media queries, and navigator/standalone clues where applicable;
- handle unsupported browsers with an honest manual path, not a disabled fake button;
- never obstruct core use behind installation.

On iOS/iPadOS there is no `beforeinstallprompt` event for arbitrary Safari pages. If installation is truly useful, expose instructions only at a user-initiated/help moment (for example, Share → Add to Home Screen). Do not fake a native permission sheet.

## Offline-first UX states

Offline is a product state, not a failed page. Model these separately:

| State | Required UX |
|---|---|
| fast online | ordinary behavior; do not show false freshness confidence if data is cached |
| slow/degraded network | progressive loading, cancellation/timeouts, preserve input, avoid dead skeleton loops |
| offline with fresh cache | clear connectivity/status affordance only when relevant; full core functionality where designed |
| offline with stale cache | explicit “last updated”/staleness treatment and non-destructive refresh action |
| offline uncached route/action | useful fallback explaining what is unavailable and what remains possible |
| queued mutation | visible pending state, retry/inspect/cancel path, conflict behavior, durable ordering semantics |
| sync in progress | progress/failure state without blocking unrelated work |
| server failure while online | do not mislabel as user connectivity failure; expose status/retry/support appropriately |
| permission/login expiry | preserve unsent data where safe and explain auth recovery clearly |

Rules:

- preserve form input and locally created drafts across refresh/offline transitions;
- never silently drop or duplicate queued mutations;
- do not cache sensitive authenticated data merely because it is convenient; threat-model storage;
- expose content age/provenance where decisions depend on freshness;
- make retry idempotent and backoff deliberate;
- the browser `online` event/`navigator.onLine` is a hint, not proof that the service/API is reachable.

## Service worker caching strategies

Service workers are programmable network proxies. Registration and installation are separate lifecycle events, and the worker controlling future loads may not control the page that registered it until navigation/reload depending on lifecycle handling.

| Strategy | Best use | Risk |
|---|---|---|
| cache-first | versioned static assets/fonts/images that rarely change | stale forever if URL is not versioned; storage growth |
| network-first fallback-cache | timely API/page data where freshness matters but stale fallback is acceptable | slow timeout hurts UX; stale financial/medical/legal data can mislead |
| stale-while-revalidate | UI assets/data where instant response matters and eventual freshness is acceptable | user may see older state; mutation-sensitive data needs clear labeling |
| network-only | payments/auth/balances/high-integrity actions | no offline behavior |
| cache-only | deliberately precached immutable app shell/assets | fails when asset missing; wrong for dynamic truth |
| cache-then-network UI pattern | show cached content while validating freshness | visible state must say when refresh is in progress/completed/failed |

Implementation rules:

- precache only the minimum app shell; huge upfront caches harm install/storage;
- version cache names and delete obsolete caches during `activate`;
- do not cache opaque/cross-origin/authenticated responses without understanding scope and leakage;
- combine with correct HTTP caching; service-worker cache and HTTP cache are distinct layers;
- route requests by URL/method/headers deliberately; POST/mutations are not ordinary cacheable GETs;
- keep fallback pages/assets small and meaningful;
- test first visit before activation, repeat visit, update, offline reload, cache eviction, and multiple tabs.

## Push permission UX

Push is high-interruption capability. Permission must be earned in context:

1. explain what notifications will contain and why they matter before invoking permission;
2. trigger the permission request only from a clear user action such as subscribing to a specific topic;
3. offer topic/frequency/channel controls where possible rather than one binary all-or-nothing request;
4. handle `default`, `granted`, and `denied` states accurately; if denied, instruct users how to change browser/OS settings without nagging;
5. confirm subscription state in-product and provide unsubscribe/disable controls;
6. validate endpoint expiration, server VAPID keys, payload size/encryption, and retry behavior separately from visual permission;
7. do not use notification permission as a proxy for install permission—they are independent decisions.

On iOS/iPadOS 16.4+, standards-based Web Push is available to Home Screen web apps, and the permission request must be in response to direct user interaction. It is not generally equivalent to desktop-browser push support. Feature-detect Push API/Notification/service worker/installed-app context and treat unsupported paths as honest product states.

## Update-available flow

Service-worker updates occur when the browser detects a byte-different worker file. Keep the worker filename stable; changing its filename can prevent normal update detection. Typical lifecycle:

1. browser registers/checks worker;
2. new worker installs;
3. worker waits while old worker controls existing clients;
4. activation occurs after old clients release control or explicit lifecycle coordination;
5. page receives `controllerchange` if activation takes control.

UX-safe flow:

```js
navigator.serviceWorker.addEventListener('controllerchange', () => {
  if (!reloadingForUpdate) window.location.reload();
});

newWorker.addEventListener('statechange', () => {
  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
    showUpdateToast({ action: () => newWorker.postMessage({ type: 'SKIP_WAITING' }) });
  }
});
```

Rules:

- show an update action when a new version is waiting, but never force reload mid-form or during a critical transaction;
- make copy concrete (“Restart to use version …”), not generic alarm;
- coordinate multiple tabs/worker versions when data schemas change;
- consider cache/schema migration and incompatible client-server versions;
- expose offline/update failure and retry rather than an infinite spinner;
- test first install, byte-identical reload, byte-different update, user deferral, multi-tab behavior, and low-network interruption.

## iOS/iPadOS caveats

Apple platform behavior changes frequently. Verify the exact target version; do not treat Android/Desktop PWA behavior as portable.

- installation historically happens through Share → Add to Home Screen rather than Chromium-style programmatic prompts;
- web.dev installation documentation notes that only the standalone display mode is available on iOS/iPadOS;
- Apple devices can install the same PWA multiple times, and each installation has isolated storage/is treated as a separate app;
- web push requires Home Screen web apps on iOS/iPadOS 16.4+ and direct user interaction; browser tabs are not equivalent;
- background execution, lifecycle, storage persistence, cache eviction, badges, vibration, media, Bluetooth/USB, file handling, and advanced platform integrations have narrower/different support;
- viewport safe areas, home indicator, status-bar appearance, keyboard resizing, scrolling momentum, and fullscreen behavior must be physically tested;
- storage is not guaranteed permanent. Request persistence with `navigator.storage.persist()` where supported, but still design for eviction/loss;
- feature-detect APIs; Safari/WebKit version and installed-app context matter more than “iOS” as a label.

## Verification matrix

- Lighthouse/browser installability audit is a clue, not proof;
- inspect manifest JSON/network response, icon decoding, scope/start URL, screenshots, and maskable cropping;
- test Chromium desktop/mobile install prompt and at least one non-Chromium target;
- throttle network, go offline after first load/update, reload deep links, mutate/queue data, and recover;
- inspect Cache Storage/IndexedDB/quota/persistence;
- test push permission lifecycle and payload rendering;
- test update deferral/activation in multiple tabs;
- test real iPhone/iPad installed-home-screen behavior or mark it `not-checked`.
