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

Common types include `color`, `dimension`, `fontFamily`, `fontWeight`, `duration`, `number`, `strokeStyle`, `border`, `transition`, `shadow`, `gradient`, and `typography`. Use exact spec definitions before adding complex composite types.

## References

Use curly references such as `{color.brand}` to preserve relationships. Pixelcraft's bundled exporter resolves this common form. Some secondary guides describe additional reference syntax in 2025.10; verify the primary specification before implementing advanced `$ref`/JSON Pointer behavior.

## Modes and themes

The format does not force one universal theme architecture. Use one explicit approach:

1. separate files per mode (`tokens.base.json`, `tokens.dark.json`) with identical semantic paths;
2. `$extensions` metadata declaring mode-specific values for a compiler you control;
3. parallel groups such as `theme.light` and `theme.dark` when tooling is simple.

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

Minimum checks: JSON parses; groups/tokens do not conflict; `$type` known/inherited; `$value` shape valid; references resolve; no cycles; units explicit for dimensions; alpha in range; required semantic roles exist. The bundled exporter performs a practical subset and intentionally fails unknown malformed tokens rather than guessing.
