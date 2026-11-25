# Installing Pixelcraft

Pixelcraft uses one canonical `skills/` tree across every supported coding-agent host, plugin manifest, archive, and installer. No duplicate copies of skill bodies are maintained.

For the fast path, see the [Quick Start](../README.md#quick-start) in the root README. This guide documents every installer flag, all 20 host targets, offline release archives, per-skill uploads, and maintainer release packaging.

## Guided and direct Node.js installer

Clone the repository once, then run the bundled zero-dependency installer from the project that should receive the skills:

```bash
git clone https://github.com/ThanhNguyxnOrg/Pixelcraft.git "$HOME/Pixelcraft"
node "$HOME/Pixelcraft/bin/pixelcraft.mjs"
```

The interactive wizard asks for one or more agents, all skills or a numbered subset, project or user-level scope, and whether to display optional Context7 documentation MCP setup guidance. It uses Node.js built-ins only (`>=18` floor; current Node.js LTS recommended).

### CLI commands and flags

```bash
# Install all 26 skills for one agent in the current project
node "$HOME/Pixelcraft/bin/pixelcraft.mjs" add all --agent claude

# Install a subset for multiple agents (comma-separated or repeated --agent)
node "$HOME/Pixelcraft/bin/pixelcraft.mjs" add pixelcraft-web pixelcraft-review --agent claude,cursor

# User-level installation
node "$HOME/Pixelcraft/bin/pixelcraft.mjs" add all --agent claude --global

# Preview changes without writing files, or overwrite explicitly requested skills
node "$HOME/Pixelcraft/bin/pixelcraft.mjs" add all --agent all --dry-run
node "$HOME/Pixelcraft/bin/pixelcraft.mjs" add all --agent claude --force

# List skills, verify installed skills, remove skills, generate router block, or run checks
node "$HOME/Pixelcraft/bin/pixelcraft.mjs" list
node "$HOME/Pixelcraft/bin/pixelcraft.mjs" doctor
node "$HOME/Pixelcraft/bin/pixelcraft.mjs" remove pixelcraft-game-ui --agent claude
node "$HOME/Pixelcraft/bin/pixelcraft.mjs" init-router --dir . --write AGENTS.md
node "$HOME/Pixelcraft/bin/pixelcraft.mjs" check src --fail-on p0
```

**Safety guarantees:**

- Requesting any subset automatically adds `pixelcraft` (orchestrator) and `pixelcraft-plan` (step-zero skill) when missing and prints a note.
- `--force` applies only to explicitly requested skills; auto-added core skills are never silently overwritten.
- Existing skill directories are skipped unless `--force` is passed so local edits are preserved.
- Symlinked target directories are refused rather than followed outside the project.

### Bundled agent targets

Canonical `--agent` names: `claude`, `codex`, `agents`, `devin`, `cursor`, `gemini`, `copilot`, `windsurf`, `opencode`, `kiro`, `cline`, `roo`, `droid`, `antigravity`, and `all`.

Aliases: `amp`, `zed`, and `goose` route to the shared `agents` directory; `claude-code`, `gemini-cli`, `github-copilot`, `open-code`, `roo-code`, and `factory` map to their canonical targets. `--agent all` deduplicates shared `.agents/skills` destinations.

| Agent | Project path | User path | What Pixelcraft installs |
|---|---|---|---|
| Claude Code | `.claude/skills` | `~/.claude/skills` | Native skills + `.claude/commands` adapter files |
| Codex / generic agents / Devin | `.agents/skills` | `~/.agents/skills` | Native skills only |
| Cursor | `.cursor/skills` | `~/.cursor/skills` | Native skills + `.cursor/rules/pixelcraft.mdc` |
| Gemini CLI | `.gemini/skills` | `~/.gemini/skills` | Native skills only |
| GitHub Copilot | `.github/skills` | `~/.copilot/skills` | Native skills + instruction/prompt adapter files |
| OpenCode | `.opencode/skills` | `~/.config/opencode/skills` | Native skills only |
| Windsurf | `.windsurf` | `~/.codeium/windsurf` | Native skills under `skills/` + rules/memory and workflow routers |
| Kiro | `.kiro/skills` | `~/.kiro/skills` | Native skills + steering adapter |
| Cline | `.cline/skills` | `~/.cline/skills` | Native skills |
| Roo Code | `.roo/skills` | `~/.roo/skills` | Native skills |
| Factory Droid | `.factory/skills` | `~/.factory/skills` | Native skills |
| Google Antigravity | `.agents/skills` | `~/.gemini/config/skills` | Native skills; project path works with both app and CLI |

### Optional version-freshness docs lookup (`--docs-mcp`)

For version-sensitive API work, Pixelcraft instructs the agent to check resolved dependency versions against official docs and package registries. [Context7](https://github.com/upstash/context7#readme) can assist when a host supports MCP. Pass `--docs-mcp` (Node or Bash) or `-DocsMcp` (PowerShell) to print setup guidance, including with `--dry-run`. This never installs tools, modifies MCP configuration, or requests API keys. Never send secrets or proprietary code in lookup queries.

## Vercel `skills` CLI

Requires Node.js 22.20+:

```bash
# Interactive cross-agent install
npx skills add ThanhNguyxnOrg/Pixelcraft

# Non-interactive subset install
npx skills add ThanhNguyxnOrg/Pixelcraft --skill pixelcraft --skill pixelcraft-plan --skill pixelcraft-web -a claude-code

# List available skills (telemetry-free smoke check)
DISABLE_TELEMETRY=1 npx skills add ThanhNguyxnOrg/Pixelcraft --list
```

Pass `-g` for user-level installation. The external `skills` CLI manages its own agent detection and [skills.sh](https://www.skills.sh/docs/faq) listing telemetry.

## Claude Code plugin marketplace

Both the marketplace and plugin are named `pixelcraft` in [`.claude-plugin/marketplace.json`](../.claude-plugin/marketplace.json):

```text
/plugin marketplace add ThanhNguyxnOrg/Pixelcraft
/plugin install pixelcraft@pixelcraft
```

Equivalent shell commands:

```bash
claude plugin marketplace add ThanhNguyxnOrg/Pixelcraft
claude plugin install pixelcraft@pixelcraft
```

In Claude Desktop/Cowork, enter `ThanhNguyxnOrg/Pixelcraft` under **Plugins → Add marketplace**. Claude Code CLI marketplace validation and install were verified locally (`static` / local CLI); Desktop/Cowork sync is `not-checked`.

## Claude web/Desktop and ChatGPT sessions

- **Claude web/Desktop per-skill ZIP upload:** Clone this repository and run `npm run build:skill-zips` (zero dependencies). In **Customize → Skills → + → Upload a skill**, select an archive such as `skill-zips/pixelcraft.zip`, then upload `pixelcraft-plan` and the skills for your target stack. Requires an [eligible Claude plan with code execution enabled](https://support.claude.com/en/articles/12512180-use-skills-in-claude). Each ZIP contains exactly one skill folder; do not upload the full release archive as a single skill. Use `npm run build:skill-zips -- --out <directory>` to write to a custom empty directory.
- **ChatGPT Agent Plugins:** Pixelcraft is a skills-only [OpenAI Agent Plugin](https://developers.openai.com/plugins/build/plugins) (not a legacy ChatGPT plugin or server-backed Apps SDK integration). In the ChatGPT desktop app, open this repository as a project and select Pixelcraft from the project marketplace. For managed workspaces, an eligible admin can [import and sync the GitHub marketplace](https://developers.openai.com/codex/enterprise/plugin-management) using `ThanhNguyxnOrg/Pixelcraft` with **Path** left empty.
- **ChatGPT personal skills:** Where enabled, use **Plugins → Skills → Create → Upload from your computer** or **Create with editor**. The [ChatGPT help page](https://help.openai.com/en/articles/20001066-skills-in-chatgpt) does not specify the exact accepted archive layout; Pixelcraft's per-skill ZIPs follow Claude's documented layout, and ChatGPT ZIP upload acceptance is `not-checked`.

## Native host installation paths

"Not checked" means the host path is documented and manifest-validated (`static`), but was not exercised inside its client UI. No entry below implies listing in a vendor's curated catalog until submitted and approved.

| Host | Installation | Verification status |
|---|---|---|
| [Claude Code](https://code.claude.com/docs/en/plugins/marketplace-reference) | `/plugin marketplace add ThanhNguyxnOrg/Pixelcraft` then `/plugin install pixelcraft@pixelcraft`; loads `.claude-plugin/plugin.json` and discovers `skills/`. | CLI install checked. |
| [Claude Desktop / Cowork / web](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills) | Marketplace or per-skill ZIP upload above. | ZIP contents checked; client sync `not-checked`. |
| [Google Antigravity](https://antigravity.google/docs/plugins/) | `agy plugin install https://github.com/ThanhNguyxnOrg/Pixelcraft` (reads `.antigravity-plugin/plugin.json` with logo & starter prompts), or `pixelcraft add all --agent antigravity` into `.agents/skills`. | Manifest schema checked (`static`); client install `not-checked`. |
| [Cursor](https://cursor.com/docs/reference/plugins) | Bundled Cursor installer (`--agent cursor`), Cursor marketplace import via `.cursor-plugin/marketplace.json`, or copy `.cursor-plugin/plugin.json` + `skills/` into `~/.cursor/plugins/local/pixelcraft/`. | Manifest schema & installer checked (`static`); IDE plugin loading `not-checked`. |
| [Codex CLI and App](https://developers.openai.com/plugins/build/plugins#package-and-distribute-plugins) | CLI: `codex plugin marketplace add ThanhNguyxnOrg/Pixelcraft`, then `codex plugin add pixelcraft@pixelcraft` (reads `.codex-plugin/plugin.json` & `.agents/plugins/marketplace.json`). IDE: `pixelcraft add all --agent codex`. | Local CLI plugin & manifest checked; IDE `not-checked`. |
| [ChatGPT](https://learn.chatgpt.com/docs/plugins) | Portable `plugin.json` + `.codex-plugin/plugin.json` + `.agents/plugins/marketplace.json`, or Skills editor. | Manifest checked (`static`); client/workspace `not-checked`. |
| [GitHub Copilot CLI & VS Code](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing) | CLI: `copilot plugin marketplace add ThanhNguyxnOrg/Pixelcraft` then `copilot plugin install pixelcraft@pixelcraft` (reads `.github/plugin/marketplace.json` & Agent Plugins 1.0 `plugin.json`). VS Code: `pixelcraft add all --agent copilot`. | Local catalog & installer placement checked; IDE discovery `not-checked`. |
| [Gemini CLI](https://geminicli.com/docs/extensions/reference/) | `gemini extensions install https://github.com/ThanhNguyxnOrg/Pixelcraft` and restart (loads `gemini-extension.json` + `GEMINI.md` context bootstrap). | Local extension install checked. |
| [Devin CLI](https://docs.devin.ai/) | `devin plugins install ThanhNguyxnOrg/Pixelcraft` (reads `.devin-plugin/plugin.json`), or `pixelcraft add all --agent devin`. | Manifest & installer checked (`static`); Devin CLI client `not-checked`. |
| [Qwen Code](https://github.com/QwenLM/qwen-code) | `qwen extensions install ThanhNguyxnOrg/Pixelcraft` (consumes `.claude-plugin/marketplace.json`). | Manifest checked (`static`); client `not-checked`. |
| [OpenCode](https://opencode.ai/docs/skills/) | Bundled installer `--agent opencode`, or add checkout's `skills/` path to OpenCode `skills` config. | Local CLI discovered 26 skills. |
| [Pi](https://docs.pi.dev/latest/packages) | `pi install npm:@thanhnguyxn/pixelcraft` or `pi install git:github.com/ThanhNguyxnOrg/Pixelcraft`. | Local package install checked. |
| [Factory Droid](https://docs.factory.com/harness/plugins) | `droid plugin marketplace add ThanhNguyxnOrg/Pixelcraft` then `droid plugin install pixelcraft@Pixelcraft`, or `--agent droid` into `.factory/skills`. | Local marketplace plugin install checked. |
| [Windsurf Cascade](https://docs.windsurf.com/windsurf/cascade/skills) | Bundled installer `--agent windsurf` or copy into the client's skills directory. | Installer placement checked; client discovery `not-checked`. |
| [Kiro](https://kiro.dev/docs/skills/) | `pixelcraft add all --agent kiro` into `.kiro/skills` (or `--global`). Native Agent Skills, not a Kiro Power. | Installer placement checked; client discovery `not-checked`. |
| [Amp](https://ampcode.com/docs/customize/skills) | `amp skill add https://github.com/ThanhNguyxnOrg/Pixelcraft` or `--agent amp` into `.agents/skills`. | Client discovery `not-checked`. |
| [Cline](https://docs.cline.bot/customization/skills) | `pixelcraft add all --agent cline` into `.cline/skills`. | Installer placement checked; client discovery `not-checked`. |
| [Roo Code](https://roocodeinc.github.io/Roo-Code/features/skills/) | `pixelcraft add all --agent roo` into `.roo/skills`. | Installer placement checked; client discovery `not-checked`. |
| [Zed](https://zed.dev/docs/ai/skills) | `pixelcraft add all --agent zed` into `.agents/skills`; inspect via Skills in Zed Settings Editor. | Installer placement checked; client discovery `not-checked`. |
| [Goose](https://github.com/block/goose/blob/main/documentation/docs/guides/context-engineering/using-skills.md) | `pixelcraft add all --agent goose` into `.agents/skills`, then `goose skills list`. | Local CLI discovered 26 skills. |
| [skills.sh](https://www.skills.sh/docs/cli) | `npx skills add ThanhNguyxnOrg/Pixelcraft`; no npm package required. | Local pack discovery checked. |

## Shell installers without Node.js

### Linux / macOS (`install.sh`)

```bash
curl -fsSL https://raw.githubusercontent.com/ThanhNguyxnOrg/Pixelcraft/main/install.sh | bash -s -- --agent claude --skills all
```

Supported flags:

```text
--agent claude,cursor   target agent(s); default agents
--skills all            comma-separated skills or all; default all
--global                user-level scope; project scope is the default
--force                 replace explicitly requested existing skills
--dry-run               print copies without writing files
--docs-mcp              print optional Context7 documentation MCP setup guidance
--ref <tag|sha>         branch, tag, or commit archive; default main
--repo owner/name       override GitHub repository source
--archive path.tar.gz   use a local tarball instead of downloading
```

Requires only `curl` or `wget` plus `tar`. Never runs `sudo`, refuses symlinked target folders, skips existing folders unless `--force` is passed for explicitly requested skills, and writes the same lightweight router adapters as the Node installer.

### Windows (`install.ps1`)

Default project-level installation into `.agents/skills`:

```powershell
irm https://raw.githubusercontent.com/ThanhNguyxnOrg/Pixelcraft/main/install.ps1 | iex
```

Pass parameters via script block invocation:

```powershell
iex "& { $(irm https://raw.githubusercontent.com/ThanhNguyxnOrg/Pixelcraft/main/install.ps1) } -Agent claude -Skill pixelcraft-web"
```

Parameters mirror `install.sh`: `-Agent`, `-Skill`, `-Global`, `-Force`, `-DryRun`, `-DocsMcp`, `-Ref`, `-Repo`, and `-Archive` (expects a local `.zip`). Never elevates privileges, refuses reparse-point targets, and preserves existing folders unless `-Force` is passed for explicitly selected skills.

## Offline release archives and manual git copy

### GitHub Release archive

Download `pixelcraft-skills.zip` or `pixelcraft-skills.tar.gz` from [Releases](https://github.com/ThanhNguyxnOrg/Pixelcraft/releases):

```bash
gh release download <tag> --repo ThanhNguyxnOrg/Pixelcraft --pattern pixelcraft-skills.zip
```

Each archive contains canonical `skills/` and generated `adapters/<agent>/` project-root fragments.

### Manual `git clone` and copy

```bash
git clone --depth 1 https://github.com/ThanhNguyxnOrg/Pixelcraft.git
mkdir -p .agents/skills
cp -R Pixelcraft/skills/pixelcraft-web .agents/skills/
```

Do not construct cross-skill relative links after copying; every skill folder is self-contained.

## npm package and maintainer release flow

Install the published CLI globally from npm (zero runtime dependencies, Node.js `>=18`):

```bash
npm i -g @thanhnguyxn/pixelcraft
pixelcraft add all --agent cursor
```

Pi users can install directly from npm as well:

```bash
pi install npm:@thanhnguyxn/pixelcraft
```

**Maintainers:** Run `npm run test:distribution`, `npm run sync:docs:check`, and `npm run test:release-archives` to inspect packaging without publishing. The [organization Release Controller](https://github.com/ThanhNguyxnOrg/.github/blob/main/docs/agent-automation.md#release-safety) opens a release PR with synchronized version bumps across all manifests (`release-policy.json` in `ThanhNguyxnOrg/.github`) and changelog updates; merging it approves tag creation, GitHub Release archive publishing, and npm provenance publishing (requires an `NPM_TOKEN` authorized for `@thanhnguyxn/pixelcraft`).

