# Feedback, response time, and perceived performance

Evidence: response-time limits, feedback principles, and state-hardening practice.

## Time budget

| Elapsed time | UX requirement |
|---|---|
| ~0.1s | direct manipulation feels instantaneous; press/drag feedback must appear here |
| ~1s | user flow remains uninterrupted; avoid blocking chrome or unnecessary progress UI |
| ~10s | outer attention boundary; before this show explicit progress, scope, cancellation, or background completion |

Doherty: when feedback plus meaningful work stays near or under ~400ms, perceived momentum rises. Do not add artificial animation delay that breaks this rhythm.

## Feedback design

- Acknowledge input immediately with pressed/pending/selection state independent of network completion.
- Distinguish queued, processing, uploaded, verified, indexed, synced, and failed when users care about lifecycle.
- Use determinate progress when real progress exists. Use sparse indeterminate feedback otherwise; never fake precision.
- For long work, explain what can safely be done meanwhile and whether leaving/navigating away cancels it.
- Use undo instead of confirmation when reversal is cheap and reliable. Reserve confirmation for irreversible, high-cost, ambiguous, or externally visible destruction.
- Destructive copy names the object/consequence: “Delete 14 invoices” not “Are you sure?” Double protection must be proportionate, not habitual friction.

## Perceived performance

- Prioritize primary content/action over decorative media and below-fold assets.
- Reserve media/layout dimensions to prevent layout shift. Skeletons should preserve structure without pretending content exists.
- Make repeated interactions cheaper through caching, optimistic UI with rollback, prefetching only high-probability next steps, and stable navigation.
- Do not block input during animation/hydration/network activity unless operation truly is modal.
- Measure or inspect the actual path: startup, route transition, input latency, scroll/jank, image decode, database/API wait. A fast Lighthouse score alone does not prove interaction quality.
