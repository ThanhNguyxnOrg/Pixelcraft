# Component development and frontend testing

Choose the testing layer by what must be proved: logic contracts in unit tests, real layout/focus/ARIA behavior in browser component tests, end-to-end user journeys in E2E tests, and visual/accessibility regressions in dedicated snapshot and axe checks. Do not claim `rendered` visual or layout verification from `jsdom`/`happy-dom` tests (`jsdom` does not compute real layout, fonts, media queries, or CSS cascade).

## Toolchain decision matrix

| Layer | Tools | Runs in real browser? | Best fit | Primary trap |
|---|---|---|---|---|
| **Component workshop** | **Storybook** (CSF 3 + `play` + Vitest addon + `addon-a11y`), **Histoire** (Vue/Svelte), **Ladle** (lightweight React/Vite) | Yes | Isolated component states, design system docs, interactive stories, visual baselines | Treating stories as static screenshots instead of executable state + interaction specs |
| **Unit & DOM tests** | **Vitest**, **Jest**, **Testing Library** (`@testing-library/*` + `user-event`) | No (unless Vitest Browser Mode) | Pure logic, reducers, formatters, schema validators, fast hook/DOM contracts | Asserting CSS layout, sticky positioning, or focus traps inside `jsdom` |
| **Real-browser component tests** | **Vitest Browser Mode** (`@vitest/browser-playwright`), **Storybook + Vitest**, **Playwright story gallery** (`@playwright/test`) | Yes | Component contracts that depend on real CSS, focus order, Shadow DOM, Popover/Dialog, or canvas | Relying on removed `@playwright/experimental-ct-*` packages (removed in Playwright 1.63+) |
| **E2E tests** | **Playwright**, **Cypress**, **WebdriverIO** | Yes | Critical multi-route flows, auth, network/SSR hydration, cross-browser checks | Sleeping (`waitForTimeout`) instead of auto-retrying web-first assertions |
| **Visual regression** | **Chromatic** (Storybook cloud), **Percy**, **Loki**, Playwright `toHaveScreenshot()` | Yes | Catching unintended spacing, typography, dark-mode, and responsive regressions | Unmasked dynamic dates/avatars/animations causing flaky diffs |
| **Accessibility regression** | **`@axe-core/playwright`**, **`@storybook/addon-a11y`**, **`vitest-axe` / `jest-axe`**, **pa11y** | Yes (Playwright/Storybook/pa11y); DOM-only (`jest-axe`) | Continuous WCAG 2.1/2.2 A/AA checks on every PR | Assuming zero axe violations equals full accessibility (axe catches ~30–50% of WCAG issues; keyboard/focus/screen-reader flows still need verification) |

## Component workshop & interaction testing (Storybook CSF 3 + `@storybook/addon-vitest`)

Write stories for every required state (default, loading, empty, error, disabled, overflow/long text, RTL/dark mode) and attach `play` functions for interactive contracts.

- In Storybook 9/10+, import `expect`, `fn`, and `waitFor` from `'storybook/test'` and destructure `{ args, canvas, step, userEvent }` directly in `play`.
- Wire **`@storybook/addon-vitest`** so every story (and its `play` + `addon-a11y` checks) executes directly in Vitest Browser Mode on CI, or reuse stories in standalone test files via **`composeStories(stories)`** from `@storybook/react` / `@storybook/vue3` / `@storybook/svelte` so decorators and args never drift.
- Pair Storybook and Vitest with **MSW v2** (`http.get`, `HttpResponse.json`) for deterministic network states rather than mocking `fetch` globally.

```ts
// Dialog.stories.ts (Storybook CSF 3)
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';
import { Dialog } from './Dialog';

const meta = {
  component: Dialog,
  args: { onConfirm: fn() },
} satisfies Meta<typeof Dialog>;
export default meta;

type Story = StoryObj<typeof meta>;

export const OpensAndConfirms: Story = {
  play: async ({ args, canvas, step, userEvent }) => {
    await step('Open dialog', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /delete item/i }));
      await expect(canvas.getByRole('dialog')).toBeInTheDocument();
    });

    await step('Confirm action', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /confirm/i }));
      await waitFor(() => expect(args.onConfirm).toHaveBeenCalledTimes(1));
    });
  },
};
```

```ts
// MSW v2 network handler (shared across Storybook, Vitest, and browser tests)
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/invoices', ({ request }) => {
    const q = new URL(request.url).searchParams.get('q') ?? '';
    return HttpResponse.json({ items: q ? [] : [{ id: '1', number: 'INV-101' }] });
  }),
];
```

## Real-browser component testing (Vitest Browser Mode)

Use **Vitest Browser Mode** when a component relies on real layout, CSS custom properties, `@container` queries, Shadow DOM, or native `<dialog>`/Popover behavior.

- In Vitest 4+, import `playwright` from `'@vitest/browser-playwright'` and pass `provider: playwright()` (not the legacy string `'playwright'`).
- Use `page.getByRole()` / `page.getByLabelText()` locators with `await expect.element(locator)` for built-in retryability.

```ts
// vitest.config.ts (Vitest 4+)
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
});
```

```ts
// AlertBanner.browser.test.ts
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';

test('announces error state accessibly', async () => {
  renderErrorBanner();
  const banner = page.getByRole('alert', { name: /error/i });
  await expect.element(banner).toHaveTextContent('Connection lost');
});
```

## Testing Library query & interaction contract

Follow Testing Library's accessibility-first query priority so tests validate the accessibility tree simultaneously:

1. `getByRole('button', { name: /submit/i })` — top preference; if an interactive control cannot be found by role + accessible name, fix the component's accessibility first.
2. `getByLabelText(/email/i)` — preferred for form inputs.
3. `getByPlaceholderText`, `getByText`, `getByDisplayValue` — for non-interactive copy or filled values.
4. `getByTestId` — last resort only when no user-visible role or text exists.

Always initialize `const user = userEvent.setup()` and `await user.click(...)` / `await user.type(...)` instead of low-level `fireEvent`, which bypasses focus, disabled, and visibility checks.

## Playwright E2E, Clock, ARIA snapshots, visual regression, and axe-core

- **Accessibility fixture**: share a pre-configured `AxeBuilder` fixture via `test.extend()` targeting `['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']` and assert `expect(results.violations).toEqual([])`.
- **Playwright Clock (`page.clock`)**: freeze dates and fast-forward debounces, polling intervals, session timeouts, or OTP resend timers deterministically (`await page.clock.install({ time: new Date('2026-03-01T09:00:00Z') })`, `await page.clock.fastForward('00:30')`) instead of sleeping with `waitForTimeout`.
- **Semantic ARIA snapshots**: use `await expect(locator).toMatchAriaSnapshot(...)` (inline YAML or `.aria.yml` file) to lock down roles, accessible names, heading levels, and checked/expanded states without breaking on benign CSS refactors.
- **Visual snapshots**: stabilize `toHaveScreenshot()` by disabling/reducing animations (`animations: 'disabled'`), waiting for `document.fonts.ready`, and masking dynamic timestamps or charts (`mask: [page.locator('[data-dynamic]')]`).
- **Component testing on Playwright 1.63+**: `@playwright/experimental-ct-*` packages were removed in Playwright 1.63; mount component stories through the app's dev server (or Storybook) using standard `@playwright/test` fixtures, or use Vitest Browser Mode.

```ts
// tests/fixtures/axe.ts
import { test as base, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export const test = base.extend<{ makeAxeBuilder: () => AxeBuilder }>({
  makeAxeBuilder: async ({ page }, use) => {
    await use(() =>
      new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']),
    );
  },
});

export { expect };
```

```ts
// Playwright Clock + ARIA snapshot example
test('OTP resend unlocks after 30 seconds and preserves accessible structure', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-03-01T09:00:00Z') });
  await page.goto('/verify');
  await expect(page.getByRole('button', { name: /resend code/i })).toBeDisabled();
  await page.clock.fastForward('00:30');
  await expect(page.getByRole('form', { name: /verify/i })).toMatchAriaSnapshot(`
    - form "Verify email":
      - textbox "Verification code"
      - button "Resend code"
      - button "Continue"
  `);
});
```

## Do/don't pairs

| Do | Don't |
|---|---|
| Query interactive elements with `getByRole` + accessible `name` | Scatter `data-testid` on every button and input while leaving labels broken |
| Use `const user = userEvent.setup()` for realistic interactions | Use `fireEvent.click` on disabled or hidden controls without noticing they are unreachable |
| Use MSW v2 (`http.get`, `HttpResponse.json`) and `page.clock` for deterministic async/timer tests | Monkey-patch `global.fetch` or sprinkle `waitForTimeout(5000)` in E2E suites |
| Run layout, focus-trap, and Shadow DOM tests in Vitest Browser Mode / `@storybook/addon-vitest` / Playwright | Assert visual layout or responsive breakpoints in `jsdom` and mark them `rendered` |
| Mask timestamps and set `animations: 'disabled'` in visual snapshots; lock structure with `toMatchAriaSnapshot` | Approve brittle full-page screenshots that flake on every CI run |
| Combine `AxeBuilder` (`wcag22aa`) scans with keyboard/focus-order assertions | Treat a passing `jest-axe` or `AxeBuilder` run as complete WCAG proof |
| Use `provider: playwright()` from `@vitest/browser-playwright` on Vitest 4+ | Copy legacy `provider: 'playwright'` string config or removed `@playwright/experimental-ct-*` on Playwright 1.63+ |

## Verification commands

```sh
npx vitest run
npx playwright test
```

Report `jsdom`/unit runs as `static` (or DOM-unit) evidence and real-browser Playwright / Vitest Browser Mode / Chromatic runs as `rendered` evidence.
