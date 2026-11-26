import { defineConfig, devices } from "@playwright/test";
import { ENDED_PORT, FEATURED_PORT, PORT } from "./tests/e2e/support/ports";

/**
 * The one test seam: Playwright against the built static site.
 * `npm run test:e2e` builds `out/` with Webpack first, then a small static
 * server (tests/e2e/support/serve-out.mjs) serves it like a plain web host.
 *
 * Two more copies of the site are built by the global setup and served on
 * the next two ports:
 *  - out-ended/, in which two projects have ended
 *    (tests/e2e/support/ended-site.ts), and
 *  - out-featured/, in which another project is the featured one
 *    (tests/e2e/support/featured-site.ts).
 *
 * Chromium runs everything. WebKit only runs tests tagged `@webkit`: a small
 * set that checks each part of the site once in Safari's engine, so the
 * suite stays fast.
 */
const serve = "node tests/e2e/support/serve-out.mjs";

export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/support/build-test-sites.ts",
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
      // Playwright's WebKit is heavy on Windows: more than two at a time and
      // the scroll tests take several times as long.
      workers: 2,
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
    {
      command: `${serve} ${FEATURED_PORT} out-featured`,
      port: FEATURED_PORT,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
  ],
});
