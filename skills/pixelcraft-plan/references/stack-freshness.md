# Stack freshness and repeatable installs

## Choose and verify

- **Brownfield:** Read the manifest, lockfile, runtime pins and deployment configuration. Consult docs for the installed version or major; do not introduce a dependency, change package managers, or upgrade an unrelated stack by default. For an authorized upgrade, check the migration guide, target runtime, peer dependencies, integrations, build/tests and an affected UI task.
- **Greenfield:** Choose a supported stable release or LTS that fits deployment, dependency peers and the brief. Treat registry `latest` as a lookup, not a compatibility or support guarantee. For npm, check `npm view <package> dist-tags --json` and `npm view <package>@<version> engines peerDependencies --json`, then confirm the API and config in the provider's versioned official docs and release notes. Use the corresponding official registry for other ecosystems.
- **Evidence:** Record package/runtime and resolved versions, source URL or command, date, why compatible, and verification command in `.pixelcraft/plan.md`. If a source is unavailable, use repository evidence where available and label any unverified choice `assumption` / `not-checked`; do not guess the latest release.
- **Context7 is optional.** If available and allowed, resolve the exact library and request docs for the target version and API. Cross-check gaps, stale indexes and new releases against official docs and registry. Do not send secrets or proprietary source in lookup queries. Do not require installation, credentials, or network access to use Pixelcraft.
- **Reproducibility:** Resolve dependencies at intentional setup or upgrade time; commit lockfiles and declare the supported runtime/package-manager version. Use frozen installs in CI/deploy; never invoke floating `@latest` in automation. Semver ranges in manifests are acceptable when the lockfile controls the build. Keep tool and test versions reproducible and review lockfile changes.

Before choosing or changing dependencies or implementing a version-sensitive API, establish the exact package/runtime version from the project or registry, then check the API in official docs for that version. A release tag alone is not API evidence. If a documentation MCP is available, query the exact library/API/version and verify mismatches against its official sources; if the MCP is unavailable or rate-limited, go directly to official docs and the registry. If no verified source is available, record the assumption and the affected API as `not-checked`; prefer an established project API or defer an incompatible/irreversible change. Do not call an assumed selection current. Reuse matching evidence from the task plan while the version, API and compatibility constraints are unchanged.

## Registry lookups and frozen installs by ecosystem

| Ecosystem | Registry version lookup | Frozen / locked CI install |
|---|---|---|
| JS/TS (npm / pnpm / yarn / bun) | `npm view <pkg> dist-tags --json` and `npm view <pkg>@<ver> engines peerDependencies --json` | `npm ci`, `pnpm install --frozen-lockfile`, `yarn install --immutable`, `bun install --frozen-lockfile` |
| Python (pip / uv) | `pip index versions <pkg>` or `uv pip compile --dry-run` (against `pyproject.toml`) | `uv sync --frozen` or `pip install --require-hashes -r requirements.lock` |
| Rust (Cargo) | `cargo info <crate>` (Cargo ≥ 1.82) | `cargo build --locked` / `cargo test --locked` |
| Go | `go list -m -versions <module>` | `go mod download` + `go build -mod=readonly` + `go mod verify` |
| Dart / Flutter | `dart pub outdated` / `flutter pub outdated` | `dart pub get --enforce-lockfile` / `flutter pub get --enforce-lockfile` |
| .NET (NuGet) | `dotnet package search <pkg> --exact-match` | `dotnet restore --locked-mode` |
| Ruby (Bundler) | `gem info <gem> --remote` | `bundle install --frozen` |
| PHP (Composer) | `composer show --all <vendor/pkg>` | `composer install --no-interaction --prefer-dist` (with committed `composer.lock`) |

## Opt-in updates and supply-chain cooldown

Offer an update bot for maintained applications with manifests and passing build/test coverage, not for design-only output or disposable prototypes. Do not enable outside repository policy or install both bots for the same dependency. Group routine updates, apply a release cooldown (for example 3–7 days) to reduce supply-chain compromise exposure on non-security updates, review majors separately against official migration notes, and verify build/tests plus a representative UI smoke flow. Keep auto-merge off by default.

**Dependabot** is the simplest choice for a GitHub repository. Adapt the example to the actual package ecosystem and lockfile directory; enable Dependabot alerts/security updates separately per repo policy (security updates bypass cooldown):

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    cooldown:
      default-days: 7
      semver-patch-days: 3
    groups:
      routine:
        patterns: ["*"]
        update-types: [minor, patch]
```

**Renovate** is an alternative for multi-ecosystem workspaces or projects needing package rules, a dependency dashboard, and lockfile maintenance. Use the organization's approved app/runner and preset; configure `minimumReleaseAge` so newly published packages mature before automated PRs open:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended"],
  "dependencyDashboard": true,
  "schedule": ["* 0-3 * * 1"],
  "minimumReleaseAge": "7 days",
  "automerge": false,
  "lockFileMaintenance": { "enabled": true },
  "packageRules": [
    {
      "matchUpdateTypes": ["minor", "patch"],
      "groupName": "routine dependency updates"
    }
  ]
}
```
