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

## Content-script Shadow DOM isolation, the `rem` trap, and host shortcut shielding

Host pages frequently override root `html { font-size: 62.5%; }` (`10px`) AND attach global window/document `keydown` listeners for single-key shortcuts (GitHub `s` / `/`, YouTube `k` / `f` / `m`, Gmail `c` / `#`, Linear `c`). Because CSS **`rem` inside a Shadow DOM resolves against the host's `<html>`**, and **composed keyboard events bubble out of the Shadow DOM to `document`**, unshielded overlays both shrink by 37% and trigger chaos on the underlying page while the user types!

- Fix the `rem` trap by compiling Shadow DOM CSS to `px` (`postcss-rem-to-pixel`) and setting `:host { all: initial; color-scheme: light dark; font-family: system-ui, sans-serif; font-size: 14px; }`.
- **Stop keyboard propagation at the Shadow Root boundary**: call `e.stopPropagation()` on `keydown`, `keyup`, and `keypress` inside extension inputs/overlays (handling `Escape` locally to close and restore focus):

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
        // Shield host-page single-key shortcuts (GitHub '/', YouTube 'k'/'f') when typing inside CSUI
        for (const type of ['keydown', 'keyup', 'keypress'] as const) {
          root.addEventListener(type, (e) => {
            if (type === 'keydown' && (e as KeyboardEvent).key === 'Escape') {
              root.remove();
            }
            e.stopPropagation();
          });
        }
        const input = document.createElement('input');
        input.placeholder = 'Filter elements…';
        root.append(input);
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

## Chrome Web Store MV3 #1 Rejection Gate: Zero Remotely Hosted Code (`RHC`)

Chrome Web Store automated + human review immediately rejects any Manifest V3 submission that loads or executes code not present inside the signed `.zip` bundle:

- **Strictly banned**: `<script src="https://...">` (including Google Tag Manager, external Stripe/Firebase/Sentry CDN scripts, or remote UI bundles), dynamic `import("https://...")`, `eval()`, `new Function()`, string `setTimeout("...")`, or fetching JS/WASM payloads from an API to pass into `chrome.scripting.executeScript({ func })`.
- **Allowed**: bundling all SDKs locally at build time (`vite`/`wxt` Rollup bundle with `content_security_policy.extension_pages = "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';"`), and fetching strictly declarative **JSON configuration / feature flags** validated against a local schema.

## MV3 runtime, storage, PKCE OAuth, and Safari Web Extensions

- **Service-worker lifecycle**: MV3 service workers terminate after ~30 s idle. Register all top-level listeners synchronously on boot, replace `setTimeout`/`setInterval` with **`chrome.alarms`**, and keep ephemeral tokens in **`chrome.storage.session`**, durable device state in **`chrome.storage.local`**, and tiny synced prefs in **`chrome.storage.sync`** (`100 KB` total / `8 KB` per key).
- **OAuth 2.0 Authorization Code + PKCE (`S256`)**: extension bundles are inspectable public clients—**never embed a `client_secret`**. Generate a 32-byte cryptographic `code_verifier` + SHA-256 base64url `code_challenge`, launch `chrome.identity.launchWebAuthFlow({ url, interactive: true })`, exchange the authorization code with `code_verifier`, and hold short-lived access tokens in `chrome.storage.session`.
- **Offscreen documents (`chrome.offscreen`)**: create a single-purpose offscreen doc (`DOM_PARSER`, `CLIPBOARD`, `AUDIO_PLAYBACK`) only when needed and close it when idle.
- **`chrome.scripting` worlds (`ISOLATED` vs `MAIN`)**: keep UI and `chrome.*` calls in `ISOLATED`; inject into `MAIN` only for minimal read-only inspection via schema-validated `postMessage`.
- **Safari Web Extensions**: test both macOS and **iOS Safari** (`>= 44 pt` touch targets, bottom-sheet popups) and feature-detect `sidePanel` / `offscreen`.

## Permissions UX

Prefer `activeTab` and `optional_host_permissions` over blanket `<all_urls>`. Request optional permissions via `chrome.permissions.request()` synchronously inside the user gesture that needs them, explain why in plain language, and render a calm degraded state if denied.

## Do/don't pairs

| Do | Don't |
|---|---|
| Bundle 100% of JS locally (`script-src 'self'`) and fetch only validated JSON | Load `<script src="https://cdn...">`, `eval()`, `new Function()`, or remote JS strings (CWS #1 rejection) |
| Convert `rem` to `px` and call `e.stopPropagation()` on `keydown`/`keyup`/`keypress` in Shadow DOM | Let typing inside an extension input trigger YouTube `k`/`f` or GitHub `/` shortcuts, or shrink on `font-size: 62.5%` |
| Authenticate via **OAuth 2.0 + PKCE (`S256`)** + `chrome.storage.session` with zero `client_secret` | Ship hardcoded OAuth `client_secret` or API keys inside extension source bundles |
| Use `chrome.alarms` + `chrome.storage.{session,local}` and synchronous `chrome.sidePanel.open()` | Store state in global service-worker RAM or `await` before `chrome.sidePanel.open()` |
| Scope `activeTab` + `optional_host_permissions` and handle denial gracefully | Request `<all_urls>` on install for a single-domain utility |

## Verification commands

```sh
npx wxt build
npx wxt build -b firefox
npx playwright test
```

Inspect the built `.zip` / `manifest.json` for zero remote script URLs, `eval`, or `<all_urls>` (`static`), then load the unpacked extension in Chrome, Firefox, and Safari to verify Shadow DOM `rem` + `keydown` shortcut isolation on GitHub/YouTube, PKCE sign-in, service-worker sleep/wake, and denied permissions (`rendered`).
