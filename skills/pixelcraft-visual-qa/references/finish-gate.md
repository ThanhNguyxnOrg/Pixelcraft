# Finish gate for UI flows

Use this gate before reporting a new or materially changed UI flow as complete. For a small visual change outside such a flow, verify the affected surface and report the narrower scope. Do not turn a scoped review into a pass for the application.

1. **Define scope before verification.** Record route/window, target revision or build, fixture, primary task, expected success and relevant states. Use a disposable/sandboxed fixture for external or destructive effects as described in [task verification](task-verification.md).
2. **Collect evidence.** For responsive web, inspect pixels at 390, 768 and 1440 CSS px; add 320 for reflow-sensitive work (e.g. navigation, forms, dense text or a supported 320 px viewport). Execute the task with a real keyboard and inspect focus visibility and order. For other surfaces use representative sizes and actual input/focus conventions. Capture error, empty, loading, theme and reduced-motion cases when applicable. Use the actual app or a labeled emulation.
3. **Assert an outcome.** A checked end state must prove a task-specific change (e.g. saved row survives reload or invalid input remains while the error is announced), not just page load, a clean console or a screenshot. Use an executed assertion with test output/trace, or an observed live interaction recorded with its result and artifact. `shoot.mjs` is layout evidence, not an outcome test.
4. **Record defects and repair.** Put confirmed deterministic findings under `checks` with stable IDs (e.g. `checkout-submit-clipped`). Inspect the rendered lead before claiming failure. Normally use one round; for reproducible, measurable defects use up to three total rounds, preserving before/after artifacts and rerun results. Never shrink coverage, hide content/overflow, weaken assertions, change the fixture, or update a baseline just to go green. A taste observation belongs in critique, not the gate. Do not restart the round count for the same scoped flow.
5. **Report.** Run `node scripts/finish-gate.mjs path/to/evidence.json`. Report `PASS`, `FAIL`, `OPEN` (confirmed failure remains after round three), or `NOT CHECKED` with remaining failures, unchecked scope, non-applicability reasons and supporting artifacts. Missing required evidence remains visible even when a confirmed failure sets the status. A waiver cannot satisfy a required check; if the user chooses to ship anyway, report the same unresolved status and their decision.

## Evidence manifest

Store the manifest beside redacted evidence files. The command validates scope and record completeness, not the truth or contents of artifacts; a reviewer must inspect them. Use one manifest per primary flow; keep the required coverage fixed across rounds.

`schemaVersion` is `1`. Set `surface` to `responsive-web` or `other`. Supply nonempty `target`, `revision`, `task`, and `fixture` (include runtime, locale, and data/emulation context as appropriate). Set `applicability` with `error`, `empty`, `loading`, `theme`, `reduced-motion`, and (web only) `reflow-320`. Each is `true` or `{"applies":false,"reason":"specific product reason"}`. Tool unavailability is not a reason to mark a state inapplicable.

In `checks`, include `outcome`, `input`, and `width-390`, `width-768`, `width-1440` (web) or `layout` (other), plus every applicable ID above. Use objects like:

```json
{
  "result": "pass",
  "label": "rendered",
  "method": "Playwright, invite with test mailbox, reload list",
  "expected": "Pending invite persists after reload",
  "observed": "test@example.test shown once with Pending state after reload",
  "artifact": "invite-trace.zip",
  "assertion": "expect(inviteRow).toHaveCount(1) after reload"
}
```

- `outcome` also requires `assertion`; `input` requires `focus` (what visibly focused; order/restoration) and web `modality: "keyboard"`. Width checks, including `reflow-320`, require numeric `width` matching the ID. For a state or theme, record the states/modes actually exercised in `method` and expected/observed results.
- Use `result: "fail"` for confirmed failures. For a blocked or unrun check use `result: "not-checked"` and a `reason`; never label static evidence rendered.
- `artifact` is a nonempty local file path relative to the manifest directory (screenshot, trace or result log as appropriate). Do not paste secrets or rely on externally mutable debug output.
- `rounds` starts as `[]`. Append one object per actual repair-and-retest cycle with `failure`, `reproduction`, `change`, `rerun`, and distinct `before`/`after` evidence paths. Keep failure evidence even after the corresponding current check passes.
