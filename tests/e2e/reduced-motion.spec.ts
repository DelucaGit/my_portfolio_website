import { expect, test, type Page } from "@playwright/test";
import { pageContent } from "./support/content";
import {
  expectNoSidewaysScroll,
  expectPreviewing,
  homeProjects,
  keyRoutes,
  previewedProject,
} from "./support/site";

/**
 * A visitor who has asked for less motion gets the same pages, standing
 * still: nothing moves by itself and the page scrolls without gliding.
 * (The hero's ring, the film and Om mig have their own tests for this.)
 */
test.use({ viewport: { width: 1440, height: 900 } });

/** Two pictures of the window, a moment apart, are exactly the same. */
async function expectStandingStill(page: Page) {
  await expect
    .poll(
      async () => {
        const first = await page.screenshot({ animations: "allow" });
        await page.waitForTimeout(500);
        const second = await page.screenshot({ animations: "allow" });
        return first.equals(second);
      },
      { message: "the page keeps moving", timeout: 15_000 },
    )
    .toBe(true);
}

for (const route of keyRoutes()) {
  test(`med minskad rörelse har ${route} samma innehåll och står still`, async ({
    page,
  }) => {
    await page.goto(route);
    await expect(page.getByRole("contentinfo")).toBeVisible();
    const withMotion = await pageContent(page);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    await expect(page.getByRole("contentinfo")).toBeVisible();
    expect(await pageContent(page)).toEqual(withMotion);
    await expectNoSidewaysScroll(page);
    await expectStandingStill(page);

    // A turn of the wheel moves the page that far at once, and no further.
    await page.mouse.move(720, 450);
    await page.mouse.wheel(0, 600);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(600);
    await expectStandingStill(page);
    expect(await page.evaluate(() => window.scrollY)).toBe(600);
  });
}

test("med minskad rörelse byter skrollen fortfarande projekt i den delade vyn", async ({
  page,
}) => {
  const projects = homeProjects();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expectPreviewing(page, projects[0]);

  const seen = new Set<string>();
  await page.mouse.move(720, 450);
  for (let notch = 0; notch < 40 && seen.size < projects.length; notch++) {
    await page.mouse.wheel(0, 90);
    seen.add(await previewedProject(page));
  }
  expect([...seen]).toEqual(projects.map((project) => project.name));
});
