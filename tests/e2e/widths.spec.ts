import { test } from "@playwright/test";
import {
  allRoutes,
  keyRoutes,
  expectNoSidewaysScroll,
  expectTheme,
  returningVisitor,
  THEMES,
  WIDTHS,
} from "./support/site";

/**
 * Every page, in both themes, at every width the design must hold at.
 * One page load per route and theme; the window is then resized, the way a
 * visitor drags it, so the suite stays fast.
 *
 * Safari's engine gets one page of each kind, in the light theme.
 */
const inSafariToo = new Set(keyRoutes());

for (const theme of THEMES) {
  test.describe(`Ingen vågrät skroll, ${theme === "light" ? "ljust" : "mörkt"} tema`, () => {
    for (const route of allRoutes()) {
      const tag = theme === "light" && inSafariToo.has(route) ? " @webkit" : "";
      test(`${route}${tag}`, async ({ page }) => {
        await returningVisitor(page, { chose: theme });
        await page.setViewportSize({ width: WIDTHS[0], height: 900 });
        await page.goto(route);
        await expectTheme(page, theme);

        for (const width of WIDTHS) {
          await test.step(`${width} px`, async () => {
            await page.setViewportSize({ width, height: 900 });
            await expectNoSidewaysScroll(page);
          });
        }
      });
    }
  });
}
