import { defineConfig, devices } from '@playwright/test'

const PORT = 6007

/**
 * Visual regression over the static Storybook build (apps/docs/storybook-static).
 * Baselines are Linux renders: create or update them with `npm run test:visual:update`,
 * which runs inside the same Playwright Docker image as CI.
 */
export default defineConfig({
  testDir: '.',
  outputDir: '../../test-results/visual',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [['github'], ['html', { outputFolder: '../../playwright-report', open: 'never' }]]
    : [['list'], ['html', { outputFolder: '../../playwright-report', open: 'never' }]],
  expect: {
    toHaveScreenshot: { animations: 'disabled', caret: 'hide', scale: 'css' },
  },
  use: {
    ...devices['Desktop Chrome'],
    baseURL: `http://127.0.0.1:${PORT}`,
    viewport: { width: 960, height: 640 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
    reducedMotion: 'reduce',
  },
  webServer: {
    command: `node serve.ts ${PORT}`,
    url: `http://127.0.0.1:${PORT}/index.json`,
    reuseExistingServer: !process.env.CI,
  },
})
