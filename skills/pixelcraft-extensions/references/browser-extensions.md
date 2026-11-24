# Browser extensions (Manifest V3)

Choose the smallest Manifest V3 surface and build toolkit that matches your target browsers (**Chrome/Edge, Firefox, Safari**) rather than shipping ad hoc raw scripts with broken CSS or flaky service workers.

## Build toolkits and cross-browser matrix

| Toolkit | Best fit | Key trade-off |
|---|---|---|
| **WXT** | Modern Vite-based default for Chrome, Firefox, and Safari MV3 with auto-generated manifest, HMR, and `createShadowRootUi` | Opinionated `entrypoints/` directory layout |
| **Plasmo** | React/TypeScript extensions wanting built-in CSUI anchoring and storage hooks | Tighter React coupling; slower adoption of newer browser-specific APIs |
| **CRXJS** | Existing Vite + React/Vue/Svelte apps adding a Chrome MV3 build | Primarily Chromium-focused; Firefox/Safari need extra manifest config |
| **`webextension-polyfill`** | Vanilla/custom builds normalizing `browser.*` Promise APIs across Chrome, Firefox, and Safari | Manual manifest and Shadow DOM packaging |

## Surface selection and browser divergence

| Surface | Use for | Cross-browser & UX constraints |
|---|---|---|
| **Popup** (`action.default_popup`) | Quick status or single-step action | Ephemeral, narrow (300–420 px), closes on blur; never rely on popup lifetime for durable writes |
| **Side Panel / Sidebar** | Persistent companion workflow | **Divergence**: Chrome/Edge use `side_panel.default_path` + `chrome.sidePanel.open()` (**must be called synchronously inside a user gesture**); Firefox uses `sidebar_action` (`browser.sidebarAction.open()`) |
| **Content-script UI** | Contextual on-page overlay | Host CSS is hostile; always isolate in **Shadow DOM** and never duplicate mounts on SPA navigations |
| **Options page** (`options_ui`) | Deep configuration | Full document; use explicit Save/Reset semantics and explain permission grants clearly |
| **DevTools Panel** (`devtools_page`) | Network/DOM/framework inspectors | Register via `chrome.devtools.panels.create(...)`, match `chrome.devtools.panels.themeName` (`'default' \| 'dark'`), and guard `inspectedWindow.eval` |

## Content-script Shadow DOM isolation and the `rem` trap

Host pages frequently override root `html { font-size: 62.5%; }` (`10px`) or `20px`. Because CSS **`rem` inside a Shadow DOM still resolves against the host page's `<html>` root**, Tailwind or `rem`-based extension styles will randomly shrink by 37% on real websites.

- Fix the `rem` trap by compiling Shadow DOM CSS with `px` (e.g., PostCSS `rem-to-px` plugin) or using explicit `px` / custom properties scoped to `:host` alongside `:host { all: initial; color-scheme: light dark; font-family: system-ui, sans-serif; font-size: 14px; }`.
- In WXT, use `createShadowRootUi` with `cssInjectionMode: 'ui'` so stylesheets inject cleanly into the shadow root:

```ts
// entrypoints/overlay.content.ts (WXT)
export default defineContentScript({
  matches: ['https://*.example.com/*'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'pixelcraft-inspector',
      position: 'inline',
      anchor: 'body',
      onMount(container) {
        const root = document.createElement('section');
        root.setAttribute('aria-label', 'Page inspector');
        root.textContent = 'Inspector ready';
        container.append(root);
        return root;
      },
      onRemove(root) {
        root?.remove();
      },
    });
    ui.mount();
  },
});
```

## MV3 runtime, storage, scripting worlds, and Safari Web Extensions

- **Service-worker lifecycle**: MV3 service workers terminate after ~30 s idle. Register all top-level event listeners synchronously on boot, replace `setTimeout`/`setInterval` with **`chrome.alarms`**, and keep ephemeral tokens in **`chrome.storage.session`** (survives worker restarts, clears on browser exit), durable device state in **`chrome.storage.local`**, and tiny synced prefs in **`chrome.storage.sync`** (100 KB total / 8 KB per key).
- **Offscreen documents (`chrome.offscreen`)**: When MV3 background logic requires DOM parsing, audio playback, or clipboard APIs, create a single-purpose offscreen doc (`chrome.offscreen.createDocument({ reasons: ['DOM_PARSER'], ... })`) and close it when idle—browsers allow only one active offscreen document per profile.
- **`chrome.scripting` worlds (`ISOLATED` vs `MAIN`)**: Keep UI and `chrome.*` API calls in the default `ISOLATED` world. Inject into `MAIN` only for minimal read-only page-JS inspection, passing strictly validated messages back across `window.postMessage`.
- **Safari Web Extensions**: Package via Xcode (`xcrun safari-web-extension-converter`), test both macOS Safari and **iOS Safari** (compact bottom-sheet popups, touch targets >= 44 pt, stricter per-site permission prompts), and feature-detect APIs such as `sidePanel` / `offscreen` that Safari does not expose identically.

## Permissions UX

Prefer `activeTab` and `optional_host_permissions` over blanket `<all_urls>`. Request optional permissions right when the user clicks the feature that needs them, explain why in plain language, and render a calm degraded state if denied.

## Do/don't pairs

| Do | Don't |
|---|---|
| Convert `rem` to `px` or use explicit `px` inside Shadow DOM CSUI | Ship Tailwind `rem` classes into Shadow DOM and shrink on `html { font-size: 10px }` sites |
| Use `chrome.alarms` + `chrome.storage.{session,local}` in MV3 | Store state in global service-worker variables or long `setInterval` timers |
| Call `chrome.sidePanel.open()` synchronously inside a user click handler | `await` async storage before calling `chrome.sidePanel.open()` (breaks user gesture) |
| Scope `optional_host_permissions` and handle denial gracefully | Request `<all_urls>` on install for a single-domain utility |
| Feature-detect Chrome `sidePanel` vs Firefox `sidebar_action` vs Safari | Claim cross-browser parity while only testing unpacked Chrome |

## Verification commands

```sh
npx wxt build
npx wxt build -b firefox
npx playwright test
```

Build outputs and manifest validation are `static` evidence. Load the unpacked extension in target browsers (Chrome, Firefox, Safari) to verify Shadow DOM isolation on `font-size: 62.5%` / dark / RTL pages, service-worker sleep/wake, side-panel resize, DevTools dark/light themes, and denied permissions (`rendered` evidence).
