# Task-driven visual QA

Use this reference when judging whether the interface actually works. A screenshot is evidence about appearance at one instant; it is not proof that users can complete the task. Execute realistic tasks and capture the resulting evidence.

## Task selection

Choose tasks from the design brief/plan rather than generic inspection:

| Task type | Examples | Required evidence |
|---|---|---|
| primary success | create, search, checkout, publish, configure, navigate to detail | initial state → key intermediate feedback → final end state |
| recovery | invalid input, offline retry, permission denied, conflict, cancellation | preserved input/context, truthful error, recovery path completion |
| orientation | deep link, back/forward/escape, refresh/relaunch, interruption | understandable restored state |
| adaptation | small viewport/window, text scaling, RTL/locale, input modality change | task remains possible and legible |
| destructive/high-cost | delete, reset, payment, irreversible publish, sending messages to real users | consequence communication, confirmation/undo/cancel behavior |

Define the expected end state before execution. “No console errors” or “page loads” is not a task outcome.

## Destructive/high-cost execution boundary

Never execute destructive or high-cost tasks against live/production data, real customer accounts, real payment instruments, production publish targets, or real message recipients. These tasks may run only inside a sandbox, disposable fixture, mocked backend, local/test environment, or provider-approved test mode using test credentials.

Before execution, verify and record which boundary applies. If no safe boundary exists:

1. exercise the flow only up to the final confirmation/commit step;
2. verify consequence copy, friction, focus/keyboard behavior, cancellation, input preservation, and recovery affordances that do not commit the action;
3. mark the irreversible submission/payment/deletion/publish/send step `not run` in the execution record;
4. ask the user for a sandbox/test fixture/mock/test-mode credential or explicit direction before attempting completion.

A user interface being locally hosted does not make downstream effects safe: payment APIs, email delivery, production databases, publish endpoints, and shared remote state remain live side effects unless explicitly isolated.

## Execution record

```markdown
| Task | Fixture/context | Steps executed | Expected end state | Actual result | Evidence artifact | Label |
|---|---|---|---|---|---|---|
| invite teammate | empty project, keyboard only, 390px, en-LTR |  |  | pass/fail/blocked/not run | path/timestamp | rendered/not-checked |
```

Record runtime/build/version, platform/emulation status, viewport/device, locale/direction, network state, input modality, and exact fixture. Redact secrets/private data.

## Agent execution rules

1. Drive the real surface using the most faithful available mechanism: browser interaction, device/simulator control, native test harness, terminal interaction, snapshot interaction runner, or manual capture.
2. Do not only inspect static markup and infer behavior. Static evidence may supplement but not replace execution.
3. Verify intermediate feedback: pending/disabled state, validation timing, focus movement, announcements/status where inspectable, progress, cancellation, and retry.
4. Verify the end state in data/UI terms, not only visual similarity: object created, navigation location correct, input preserved, error shown, undo available, permission enforced.
5. Capture failure traces at the moment of failure. Do not retry until evidence disappears.
6. Fix one deterministic defect at a time and rerun the affected task only.
7. Stop after the agreed repair round; report remaining behavioral uncertainty instead of looping by taste.

## Failure classification

Classify failures before repairing:

- **task blocker:** correct action impossible/missing/inaccessible;
- **navigation failure:** state lost, wrong back/escape/deep-link behavior;
- **feedback failure:** action occurred but status/result is invisible or misleading;
- **input failure:** keyboard/touch/controller/IME/paste/autofill path broken;
- **layout failure:** action/content clipped, obscured, unreachable, or unstable;
- **data/state failure:** stale response, duplication, lost input, wrong permission/conflict behavior;
- **visual fidelity issue:** implementation diverges visually without blocking behavior;
- **test fixture failure:** harness/data/environment invalid rather than product broken.

Do not repair a fixture failure by changing product behavior unless the product defect is independently proven.

## Evidence precedence

Strongest evidence for behavior:

1. real device/platform runtime (`rendered`);
2. simulator/emulator/browser interaction (`rendered`, labeled emulation);
3. deterministic interactive test harness/snapshot backend (`rendered` only for the behavior it truly exercises);
4. static event/state analysis (`static`);
5. model screenshot interpretation (`model-judgment`).

Never escalate a screenshot reading into task-completion evidence.

## Lightweight two-width evidence floor

Even when the full device matrix is out of scope, capture at least one desktop width and one narrow mobile width such as 390 px for web-responsive work. Compare hierarchy, measure, navigation availability, clipping, touch target spacing, and whether the signature composition survives or intentionally degrades. If only one width is captured, mark responsive behavior `not-checked` rather than inferring it.
