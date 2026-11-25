# IDE and SaaS platform plugins (JetBrains, Obsidian, Shopify, Atlassian Forge, Notion, Linear)

Use this reference when building embedded UI inside **JetBrains IDEs**, **Obsidian**, **Shopify Admin**, **Atlassian Jira/Confluence (Forge)**, **Notion**, or **Linear**. Each host enforces distinct threading, theming, sandboxing, and auth boundaries.

## Host platform matrix

| Host | Primary UI layer | Escape hatch | Critical runtime constraint |
|---|---|---|---|
| **JetBrains Platform** | **Kotlin UI DSL v2** (Swing) or **Jewel** (Compose Desktop matching IntelliJ New UI) | **JCEF** (`JBCefBrowser` embedded Chromium) | **Never block the EDT** (Event Dispatch Thread); run I/O & PSI reads in coroutines/background actions |
| **Obsidian** | `ItemView`, `Modal`, `SuggestModal`, `PluginSettingTab`, **CodeMirror 6** extensions | Custom DOM inside view/leaf | **Mobile parity** (iOS/Android)—no Node `fs`/`child_process`; style strictly with Obsidian CSS vars |
| **Shopify Admin** | **App Bridge v4** + **Polaris Web Components** (`<ui-nav-menu>`, `<ui-save-bar>`, `<s-page>`) | Sandboxed embedded iframe | **Session Tokens (JWT)** via `shopify.idToken()`—never rely on third-party cookies |
| **Atlassian Forge** | **UI Kit 2 (`@forge/react`)** rendered natively in Jira/Confluence | **Custom UI** (sandboxed iframe + `@forge/bridge`) | Strict `manifest.yml` scopes & outbound egress allowlist; zero unapproved network calls |
| **Notion / Linear** | Native Link Previews / Attachments / OAuth workflows + external companion apps | Deep-linked web UI | Rate limits, explicit OAuth resource sharing, and idempotent webhook sync |

## JetBrains Platform plugins (IntelliJ, PyCharm, WebStorm, Android Studio)

- Prefer **Kotlin UI DSL v2** (`com.intellij.ui.dsl.builder.panel`) for settings (`Configurable`) and dialogs, or **Jewel** (`org.jetbrains.jewel`) when building rich modern Compose-based tool windows that natively match IntelliJ's New UI light/dark/high-contrast themes. Reserve **JCEF (`JBCefBrowser`)** strictly for rich web content that native components cannot express (verify JCEF availability via `JBCefApp.isSupported()`).
- **EDT vs Coroutine threading**: Running disk I/O, HTTP calls, or heavy PSI/VFS scans on the Event Dispatch Thread freezes the entire IDE and triggers IntelliJ freeze reports. Run compute/network on coroutine dispatchers and switch back to `Dispatchers.EDT` solely to update UI models.

```kotlin
// Kotlin UI DSL v2 settings panel (never perform blocking I/O on EDT)
import com.intellij.openapi.options.BoundConfigurable
import com.intellij.ui.dsl.builder.bindSelected
import com.intellij.ui.dsl.builder.bindText
import com.intellij.ui.dsl.builder.panel

class OpsPluginConfigurable(private val state: OpsPluginState) : BoundConfigurable("Ops Monitor") {
  override fun createPanel() = panel {
    group("Connection") {
      row("Endpoint URL:") {
        textField()
          .bindText(state::endpointUrl)
          .validationOnApply { if (!it.text.startsWith("https://")) error("Use an HTTPS endpoint.") else null }
      }
      row {
        checkBox("Sync alerts automatically").bindSelected(state::autoSync)
      }
    }
  }
}
```

## Obsidian plugins

- Use native Obsidian classes: **`ItemView`** (dockable sidebar/tab panes), **`Modal`** and **`SuggestModal<T>`** (keyboard-driven command pickers matching Quick Switcher), **`PluginSettingTab`** (`new Setting(containerEl)`), and **`registerEditorExtension(...)`** for live **CodeMirror 6** editor decorations/widgets.
- Always consume Obsidian CSS custom properties (`--background-primary`, `--background-secondary`, `--background-modifier-border`, `--text-normal`, `--text-muted`, `--interactive-accent`, `--text-on-accent`) so community themes and light/dark switching work without visual breakage.
- **Mobile parity**: Unless strictly desktop-only (`"isDesktopOnly": true` in `manifest.json`), avoid Node `fs`, `path`, `child_process`, or Electron APIs—use `this.app.vault`, `this.app.vault.adapter`, and Obsidian's built-in `requestUrl()` (which bypasses browser CORS safely on desktop and mobile).

```ts
import { App, SuggestModal } from 'obsidian';

export class QuickNotePicker extends SuggestModal<{ path: string; title: string }> {
  constructor(app: App, private readonly items: { path: string; title: string }[], private readonly onPick: (path: string) => void) {
    super(app);
    this.setPlaceholder('Jump to project note…');
  }
  getSuggestions(query: string) {
    const q = query.toLowerCase();
    return this.items.filter((i) => i.title.toLowerCase().includes(q));
  }
  renderSuggestion(item: { path: string; title: string }, el: HTMLElement) {
    el.createEl('div', { text: item.title });
    el.createEl('small', { text: item.path, cls: 'u-muted' });
  }
  onChooseSuggestion(item: { path: string; title: string }) {
    this.onPick(item.path);
  }
}
```

## Shopify Embedded Apps (App Bridge v4 + Polaris)

- Load **App Bridge v4** via `<meta name="shopify-api-key" content="..." />` and `<script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>` first in `<head>`.
- Adopt **Polaris Web Components** (`<s-page>`, `<s-section>`, `<s-button>`) alongside App Bridge native chrome elements (**`<ui-nav-menu>`**, **`<ui-save-bar>`**, **`<ui-title-bar>`**, **`<ui-modal>`**) so navigation, dirty-form save bars, and modals render seamlessly in Shopify Admin chrome across desktop and mobile.
- Authenticate every backend API call with **Session Tokens** (`const token = await shopify.idToken()` sent in `Authorization: Bearer <token>`)—never depend on third-party cookies inside the Admin iframe.

```html
<ui-nav-menu>
  <a href="/" rel="home">Overview</a>
  <a href="/rules">Discount Rules</a>
</ui-nav-menu>

<ui-save-bar id="rule-save-bar">
  <button variant="primary" id="save-btn">Save</button>
  <button id="discard-btn">Discard</button>
</ui-save-bar>
```

## Atlassian Forge (Jira & Confluence)

- **Choose UI Kit 2 (`@forge/react`) first**: Components render directly in Atlassian's host React tree using the official Atlassian Design System (zero iframe loading flash, automatic dark/light theme parity, strict security).
- Drop to **Custom UI** (sandboxed static iframe + `@forge/bridge` `invoke()` / `view.theme.enable()`) only when you require custom canvas/SVG visuals or rich third-party editors; explicitly declare every external API domain in `manifest.yml` `permissions.external.fetch.backend` / `client` and keep resolvers idempotent.

## Notion and Linear integrations

- **Notion**: Design around Link Previews (unfurl API), OAuth public integrations, and block/database sync. Handle the common empty state where a user installed the integration without sharing any pages/databases to it, respect API rate limits (~3 req/s average with `Retry-After` backoff), and surface sync errors clearly without overwriting user-edited blocks.
- **Linear**: Use Linear's GraphQL API, OAuth2 (`PKCE S256` for public desktop/IDE clients), Webhooks, and **Issue Attachments** (rich status cards linked to external PRs/incidents/deployments) rather than posting noisy duplicate comments on every webhook event. Handle workspace-scoped permissions and expired webhook/token states cleanly.
- **Credential storage across IDEs**: never ship an OAuth `client_secret` inside distributed JetBrains `.zip` or Obsidian community plugin bundles, and never write tokens to plaintext XML/JSON config files—store tokens in JetBrains **`PasswordSafe.instance`** or Obsidian `SecretStorage` / OS Keychain.

## Do/don't pairs

| Do | Don't |
|---|---|
| Run JetBrains I/O & PSI reads in coroutines off the EDT and store tokens in `PasswordSafe` | Block the Swing/EDT thread or write OAuth tokens/client secrets into plaintext IDE XML |
| Style Obsidian views with `--background-primary` / `--interactive-accent` and `requestUrl()` | Hardcode hex colors or import Node `fs` in a mobile-enabled Obsidian plugin |
| Use Shopify App Bridge v4 `<ui-save-bar>` + `shopify.idToken()` Bearer JWTs | Rely on third-party session cookies inside the Shopify Admin iframe |
| Default to Atlassian Forge UI Kit 2 (`@forge/react`) before Custom UI | Spin up heavy Custom UI iframes for simple Jira issue panels |
| Authenticate IDE/desktop plugins via **OAuth 2.0 + PKCE (`S256`)** and surface Notion/Linear scopes cleanly | Embed `client_secret` in client bundles or spam Linear issue comment feeds on every poll |

## Verification commands

```sh
# JetBrains Plugin (Gradle)
./gradlew verifyPlugin
./gradlew runIde

# Obsidian Plugin
npm run build

# Atlassian Forge
forge lint
forge tunnel
```

`verifyPlugin`, `forge lint`, and `npm run build` provide `static` evidence. Inspect live host rendering across light/dark/high-contrast themes, narrow tool windows or mobile panes, offline/permission-denied states, and real host sandboxes for `rendered` evidence.
