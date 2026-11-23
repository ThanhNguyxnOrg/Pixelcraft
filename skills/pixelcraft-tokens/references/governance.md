# Token governance and lifecycle

Tokens are a public contract. Once components consume them, renaming or redefining a token is a product migration, not a cosmetic edit. Governance can be lightweight, but ownership and rollback must be explicit before a system grows beyond one screen.

## Ownership model

Assign one accountable owner for each area:

| Area | Owner responsibility |
|---|---|
| primitives | scale generation, naming consistency, licensing/provenance of assets/fonts |
| semantic tokens | meaning, contrast pairs, mode behavior, accessibility floor |
| component tokens | necessity review, component API alignment, removal when no longer justified |
| exporters/build outputs | generation correctness, version compatibility, consumer notification |
| documentation | usage examples, deprecation notices, migration guides |

In a solo project the same person may hold every role; still record the role so future agents know who must approve breaking changes. “Everyone owns tokens” means no one does.

## Change classes

| Class | Examples | Required action |
|---|---|---|
| additive | new semantic token, new mode, new optional component token | document intent; no consumer migration |
| corrective | fix wrong contrast/value while preserving meaning | validate consumers; record bugfix scope |
| behavioral | dark elevation model changes, focus-ring posture changes | visual review across affected states/modes |
| breaking | rename, removal, type change, changed alias target, altered semantic meaning | deprecation window or explicit migration; version bump; rollback plan |
| emergency | security/legal/accessibility defect | expedite, but still record affected consumers and validation evidence |

Do not silently change the meaning of an existing name. If `color.action.primary` moves from brand-blue to warning-red in meaning, create a new semantic token and migrate intentionally.

## Version and release record

Keep a `TOKENS.md`, changelog section, or equivalent release note near the token source when the project supports it:

```markdown
## <version/date>
- Added: <tokens + intended consumers>
- Changed: <token + behavioral effect + evidence>
- Deprecated: <token + replacement + removal date/version>
- Removed: <token + migration completed>
- Validation: <contrast matrix/modes/platforms/exporter tests>
```

Semantic-version the token package when it is versioned as a package. Treat generated CSS/native artifacts as build output; never patch them manually because that hides source drift.

## Deprecation procedure

1. Mark the old token deprecated in `$description` or `$extensions` without changing its value.
2. Add the replacement and migration example.
3. Inventory consumers before removal; search generated artifacts and platform code, not only web CSS.
4. Announce the removal window in the project’s normal change channel.
5. Migrate or shim consumers; keep aliases temporary when they reduce risk.
6. Remove only after consumer inventory is clean or the break is explicitly approved.
7. Record rollback: restore old source token and regenerate artifacts rather than hand-editing outputs.

## Rollback and recovery

Rollback must be cheap enough to use. Preserve the prior token source/version, generated artifacts, exporter version, validation matrix, and consumer compatibility notes. If rollback requires manually reverse-engineering generated files, the release process is incomplete.

## Contribution gate

Before accepting a token change, require:

- semantic purpose in user terms, not only a value;
- consuming surface/component example;
- contrast and state validation where color is involved;
- behavior across supported modes/themes;
- text scaling/localization implication where size/spacing/type is involved;
- platform export implication;
- migration/deprecation note for existing consumers;
- reviewer or owner decision recorded when behavior changes.

## Anti-patterns

- publishing every primitive as equally semantic API;
- creating component tokens for every property “just in case”;
- changing generated artifacts without changing source;
- copying a theme object into each platform and letting values drift;
- deprecating by deletion with no inventory;
- treating a token rename as safe because search finds no usage in one framework folder.
