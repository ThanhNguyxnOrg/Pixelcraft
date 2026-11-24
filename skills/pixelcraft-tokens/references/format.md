# DTCG 2025.10 token format

Evidence base: DTCG format/color specifications; stable Community Group status caveat; exporter ecosystem caveats.

DTCG 2025.10 is a stable Final Community Group Report, not a W3C Standard. Treat it as a versioned interchange format and validate implementation support before relying on advanced behavior.

## Shape

Token files are JSON. Groups are nested objects; token leaves contain `$value`. `$type` may be declared on a token or inherited from a containing group.

```json
{
  "color": {
    "$type": "color",
    "brand": {
      "$value": { "colorSpace": "oklch", "components": [0.55, 0.16, 250], "alpha": 1 },
      "$description": "Primary brand accent"
    }
  }
}
```

Common types include `color`, `dimension`, `fontFamily`, `fontWeight`, `duration`, `cubicBezier`, `number`, `strokeStyle`, `border`, `transition`, `shadow`, `gradient`, and `typography`. Use exact spec definitions before adding complex composite types.

## References, `$extends`, `$root`, and `$deprecated`

- **Curly alias references:** use `{color.brand}` for token-to-token aliases (supported by Pixelcraft's zero-dependency exporter and all DTCG compilers). JSON Pointer `$ref` inside composite values or resolver documents requires a full DTCG 2025.10 compiler such as Terrazzo or Style Dictionary v4.
- **`$root`:** define a group's default token value (`"accent": { "$root": { "$value": ... }, "hover": { "$value": ... } }`) so a group can hold both a base value and nested child tokens without inventing ad-hoc `.default` names.
- **`$extends`:** inherit and override an entire group (for example, a compact or brand variant group inheriting from a base group) without duplicating unchanged child tokens.
- **`$deprecated`:** mark obsolete tokens or groups using `"$deprecated": true` or a replacement string (`"$deprecated": "Use color.action.primary instead; scheduled for removal in v3."`) so compilers emit build warnings automatically.

## Modes and themes (DTCG 2025.10 Resolver)

The **W3C DTCG 2025.10 Resolver Specification** (`*.resolver.json`) is the standard multi-theme / multi-brand composition format. A resolver document declares `sets` (base and shared token files), `modifiers` with named `contexts` (such as `theme: light | dark | high-contrast` or `density: default | compact`), and an explicit `resolutionOrder`:

```json
{
  "version": "2025.10",
  "sets": {
    "primitives": { "sources": [{ "$ref": "./primitives.tokens.json" }] },
    "semantic": { "sources": [{ "$ref": "./semantic.tokens.json" }] }
  },
  "modifiers": {
    "theme": {
      "default": "light",
      "contexts": {
        "light": [{ "$ref": "./themes/light.tokens.json" }],
        "dark": [{ "$ref": "./themes/dark.tokens.json" }],
        "high-contrast": [{ "$ref": "./themes/high-contrast.tokens.json" }]
      }
    }
  },
  "resolutionOrder": [
    { "$ref": "#/sets/primitives" },
    { "$ref": "#/sets/semantic" },
    { "$ref": "#/modifiers/theme" }
  ]
}
```

Choose the lightest theme architecture that matches your compiler:

1. **DTCG Resolver (`*.resolver.json`)** — preferred for production multi-theme/multi-brand systems using Terrazzo or Resolver-aware Style Dictionary pipelines;
2. **Token-level `$extensions.pixelcraft.modes`** — compact single-file subset supported directly by Pixelcraft's zero-dependency `scripts/export-tokens.mjs` exporter;
3. **Separate files per mode (`tokens.base.json`, `tokens.dark.json`)** — simple fallback when a legacy pipeline expects flat file merges with identical semantic paths.

Rules:

- keep primitive scales mostly stable across modes;
- change semantic roles deliberately;
- verify contrast and state visibility per mode;
- never implement dark mode as automatic inversion;
- record whether high contrast is a theme, accessibility mode, or platform-mediated behavior.

## Naming

- lowercase dot paths in documentation and camel/kebab conversion only at export time;
- use intent before appearance for semantic names (`surface-warning`, not `yellow-100`);
- reserve component tier for true overrides;
- avoid encoding platform names in universal semantic tokens.

## Validation

Minimum checks: JSON parses; groups/tokens do not conflict; `$type` known/inherited; `$value` shape valid; references and `$extends` resolve; no cycles; units explicit for dimensions; alpha in range; `$deprecated` replacements point to live tokens; required semantic roles exist. The bundled exporter validates its supported subset and fails malformed tokens rather than guessing.
