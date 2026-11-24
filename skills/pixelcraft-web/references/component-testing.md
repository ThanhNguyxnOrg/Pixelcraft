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

## Component workshop & interaction testing (Storybook CSF 3)

Write stories for every required state (default, loading, empty, error, disabled, overflow/long text, RTL/dark mode) and attach `play` functions for interactive contracts.

- In Storybook 9/10+, import `expect`, `fn`, and `waitFor` from `'storybook/test'` and destructure `{ args, canvas, step, userEvent }` directly in `play`.
- Pair Storybook with **MSW (`msw-storybook-addon`)** for deterministic network states rather than mocking `fetch` globally.

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

## Playwright E2E, ARIA snapshots, visual regression, and axe-core

- **Accessibility fixture**: share a pre-configured `AxeBuilder` fixture via `test.extend()` targeting `['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']` (add `wcag22aa` where required) and assert `expect(results.violations).toEqual([])`.
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
      new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']),
    );
  },
});

export { expect };
```

## Do/don't pairs

| Do | Don't |
|---|---|
| Query interactive elements with `getByRole` + accessible `name` | Scatter `data-testid` on every button and input while leaving labels broken |
| Use `const user = userEvent.setup()` for realistic interactions | Use `fireEvent.click` on disabled or hidden controls without noticing they are unreachable |
| Run layout, focus-trap, and Shadow DOM tests in Vitest Browser Mode or Playwright | Assert visual layout or responsive breakpoints in `jsdom` and mark them `rendered` |
| Mask timestamps and set `animations: 'disabled'` in visual snapshots | Approve brittle full-page screenshots that flake on every CI run |
| Combine automated `axe-core` scans with keyboard/focus-order assertions | Treat a passing `jest-axe` or `AxeBuilder` run as complete WCAG proof |
| Use `provider: playwright()` from `@vitest/browser-playwright` on Vitest 4+ | Copy legacy `provider: 'playwright'` string config or removed `@playwright/experimental-ct-*` on Playwright 1.63+ |

## Verification commands

```sh
npx vitest run
npx playwright test
```

Report `jsdom`/unit runs as `static` (or DOM-unit) evidence and real-browser Playwright / Vitest Browser Mode / Chromatic runs as `rendered` evidence.
