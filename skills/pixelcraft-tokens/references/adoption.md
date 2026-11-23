# Design-token adoption and migration

Token systems fail when teams cannot discover, trust, or migrate them. Adoption work is part of the design system, not optional documentation polish.

## Consumer inventory

Before changing or promoting tokens, inventory:

- applications/packages/screens using token source or generated artifacts;
- direct primitive usage that should be semantic;
- local copies or hardcoded values duplicating token meaning;
- platform-specific generated outputs and their generation date/version;
- exceptions/waivers and why they exist;
- documentation/examples that teach obsolete names.

A narrow search in one frontend folder is not an inventory. Include server-rendered templates, mobile/native code, data-app Python, email/document generation, tests, snapshots, and story/example files where relevant.

## Adoption path

Use a staged path rather than a big-bang rewrite:

1. **Name the contract.** Document semantic tiers and forbidden direct-primitive cases.
2. **Generate once.** Ensure every platform artifact comes from the same source/version.
3. **Start with high-leverage surfaces.** Migrate shared shell/components before leaf screens.
4. **Bridge, then remove.** Temporary aliases reduce breakage but need an owner and removal condition.
5. **Measure exception density.** Count hardcoded values/direct primitive use in representative surfaces; do not claim adoption from file existence.
6. **Validate behavior.** Run state/theme/contrast/export tests and inspect rendered critical screens.
7. **Record migration state.** `not started / bridging / migrated / waived` with scope and consequence.

## Documentation minimum

Every maintained token system needs enough documentation for a new contributor/agent to answer:

- which file is source and which files are generated;
- how to choose semantic vs component vs primitive;
- how themes/modes are represented;
- how to regenerate platform artifacts;
- which validation commands/tests exist;
- how to deprecate or request a token;
- who owns breaking changes;
- which exceptions are deliberate.

Keep examples close to usage. A long conceptual document without copyable correct examples increases misuse.

## Migration warning signs

- same semantic meaning exists under multiple names;
- generated artifacts disagree across platforms with no version note;
- consumers bypass semantic tokens because required states are missing;
- component tokens replicate entire semantic sets;
- no one can explain whether a change is breaking;
- visual regressions are discovered only after broad rollout;
- teams fork tokens because review latency is too high.

Treat these as system design problems. Do not solve them by adding more constants or stricter lectures.
