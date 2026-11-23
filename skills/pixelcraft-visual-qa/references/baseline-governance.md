# Screenshot baseline governance

Use this reference when keeping visual baselines, screenshots, snapshots, or capture artifacts across iterations. Baselines are evidence with provenance and expiry, not immutable truth.

## Baseline metadata

Every baseline set needs adjacent metadata or a manifest containing:

- product/build commit or version;
- runtime/platform/browser/device/emulator and OS version where relevant;
- viewport/orientation/density/theme/mode/locale/direction;
- fixture/data seed/time freeze/network state;
- capture tool/version and scale factor;
- capture date and owning surface/test;
- known nondeterministic regions or exemptions;
- evidence scope: full page, crop, interaction frame, static snapshot, or device capture.

A PNG filename alone is not enough provenance for a durable baseline.

## Approval and update rules

1. A baseline may be updated only after the visible difference is classified as intentional product change, approved design change, platform/runtime rendering drift, fixture correction, or defect fix.
2. Never update baselines merely to make CI pass.
3. Review meaningful diffs as images/crops, not only aggregate mismatch percentage.
4. Keep the old baseline until the replacement has been validated in the same normalized context.
5. Record who/what approved the update and the reason in the project’s normal review path.
6. Dynamic regions must be frozen, masked narrowly, or excluded with explicit scope—not broadly ignored.
7. Failed interaction/task evidence must not be overwritten by a later successful run before the failure artifact is preserved.

## Determinism controls

Prefer deterministic inputs:

- fixed fixture data and ordering;
- frozen clock/relative time formatting;
- deterministic random seed or disabled animation;
- real or bundled fonts/assets;
- controlled network responses;
- stable feature flags/permissions;
- normalized viewport/scale/scroll;
- reduced-motion/static capture where motion rasterization is noisy.

When determinism is impossible, isolate the unstable region and label the baseline partial. Do not loosen global tolerance until meaningful regressions pass.

## Artifact lifecycle

Keep artifacts according to value:

| Artifact | Retention posture |
|---|---|
| release/acceptance baseline | durable, versioned with release/build |
| regression capture for active defect | retained until defect closure plus normal review retention |
| exploratory capture | temporary; do not commit private/noisy artifacts by default |
| user/private data capture | redact or delete; never commit secrets/personal data |
| failure trace | preserve enough frames/log/context to diagnose before retrying |

Do not fill the repository with unreviewed screenshots. Use the project's artifact storage/CI retention policy when available.

## Baseline failure triage

When a diff fails, classify before changing code or baseline:

1. intentional product/design change → obtain/confirm approval, update baseline with reason;
2. implementation regression → fix implementation and recapture;
3. environment/tooling drift → verify on reference runtime; update metadata/tolerance narrowly if justified;
4. nondeterministic fixture → freeze/fix fixture before trusting result;
5. platform rendering difference → record platform-specific baseline rather than forcing pixel identity;
6. missing provenance → treat baseline as untrusted and regenerate or retire it.

Report the classification. “Updated snapshots” is not a sufficient explanation.
