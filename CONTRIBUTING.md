# Contributing to Pixelcraft

Pixelcraft is a portable Agent Skills pack for distinctive UI and rigorous UX across frontend stacks. Read `docs/ARCHITECTURE.md` before editing; it is the controlling design document.

## Ground rules

- English content; concise, imperative, concrete, and evidence-backed.
- Each skill must be independently installable and self-contained.
- Depth belongs in `references/`; `SKILL.md` is routing plus operational rules.
- No runtime dependencies. Utility scripts use Node.js >= 18 built-ins only.
- Do not make web/React assumptions in core skills. Platform translation belongs in platform skills.
- Respect the authority order: explicit user brief, existing project system/tokens, platform/legal/accessibility constraints, Pixelcraft guidance, then model taste.

## Supported frontmatter subset

The validator intentionally implements a narrow, fail-closed YAML subset rather than full YAML:

- top-level mapping entries start at column zero and use unquoted ASCII letters, digits, underscores, or hyphens;
- scalar values are single-line plain scalars, single-line single- or double-quoted scalars, or literal/folded block scalars (`|`/`>` with optional chomping and indentation indicators);
- unquoted plain scalars must not contain `: ` or begin with a YAML indicator character;
- only `metadata` may use a mapping value: either a one-level block mapping with scalar values or a single-line flat flow mapping containing simple `key: value` pairs with scalar values; an empty `{}` flow mapping is also accepted;
- flow-mapping keys are unquoted simple ASCII keys; nested collections, duplicate keys, empty entries, and trailing commas are rejected;
- blank lines and comments are allowed; any other line the parser cannot consume is an error;
- an empty value is treated as null for optional keys when no indented child follows;
- sequences, anchors, aliases, tags, deeper nesting, nested flow collections, and multi-line plain/quoted scalars are outside the subset and are rejected;
- `name` and `description` must be scalar strings.

Do not add YAML features here unless the Agent Skills spec requires them; quote or simplify frontmatter instead.

## Editing checklist

1. Keep frontmatter valid and descriptions within the Agent Skills limits.
2. Link every reference from `SKILL.md` with a one-line “read when” trigger.
3. Before changing a rule, read [`docs/DESIGN-RATIONALE.md`](docs/DESIGN-RATIONALE.md) and update the rationale when the trade-off changes.
4. Add or update fixtures/examples when behavior changes.
5. Run:
   ```sh
   npm run validate
   node bin/pixelcraft.mjs add all --agent all --dry-run
   ```
6. Commit in focused logical commits. Do not commit generated install copies or `.pixelcraft/` project state.

## Design content standard

A rule is useful only if it changes an agent decision. Prefer “Use a 65–75ch measure for long-form Latin text” over “use readable typography.” Include transferability notes when a rule depends on platform, script, input modality, locale, or rendering surface.
