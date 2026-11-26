import { defineConfig, devices } from "@playwright/test";

/**
 * The one test seam: Playwright against the built static site.
 * `npm run test:e2e` builds `out/` with Webpack first, then a small static
 * server (tests/e2e/support/serve-out.mjs) serves it like a plain web host.
 *
 * Chromium runs everything. WebKit only runs tests tagged `@webkit`, so the
 * width and theme suites stay fast.
 */
const PORT = 4173;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      grep: /@webkit/,
    },
  ],
  webServer: {
    command: `node tests/e2e/support/serve-out.mjs ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
