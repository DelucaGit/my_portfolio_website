import { defineConfig, devices } from "@playwright/test";
import { ENDED_PORT, PORT } from "./tests/e2e/support/ports";

/**
 * The one test seam: Playwright against the built static site.
 * `npm run test:e2e` builds `out/` with Webpack first, then a small static
 * server (tests/e2e/support/serve-out.mjs) serves it like a plain web host.
 *
 * A second copy of the site, in which two projects have ended, is built into
 * out-ended/ by the global setup and served on the next port (see
 * tests/e2e/support/ended-site.ts).
 *
 * Chromium runs everything. WebKit only runs tests tagged `@webkit`, so the
 * width and theme suites stay fast.
 */
const serve = "node tests/e2e/support/serve-out.mjs";

export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/support/build-ended-site.ts",
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
  webServer: [
    {
      command: `${serve} ${PORT}`,
      url: `http://127.0.0.1:${PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      // Starts before out-ended/ is built, so wait for the port, not a page.
      command: `${serve} ${ENDED_PORT} out-ended`,
      port: ENDED_PORT,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
  ],
});
