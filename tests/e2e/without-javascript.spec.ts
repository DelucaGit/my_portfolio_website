import { expect, test } from "@playwright/test";
import { pageContent } from "./support/content";
import { expectNoSidewaysScroll, keyRoutes } from "./support/site";

/**
 * Without JavaScript all content and all links are there: the same headings
 * and the same links as a visitor with JavaScript sees, on one page of each
 * kind, on a phone and on a wide screen.
 */
const SIZES = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
];

for (const route of keyRoutes()) {
  for (const viewport of SIZES) {
    // The start page is also checked in Safari's engine.
    const tag = route === "/" && viewport.width === 1440 ? " @webkit" : "";

    test(`utan JavaScript har ${route} samma rubriker och länkar (${viewport.width} px)${tag}`, async ({
      browser,
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(route);
      await expect(page.getByRole("contentinfo")).toBeVisible();
      const withScripts = await pageContent(page);
      // The comparison says nothing if the page is empty.
      expect(withScripts.headings.length).toBeGreaterThan(0);
      expect(withScripts.links.length).toBeGreaterThan(10);

      const context = await browser.newContext({
        javaScriptEnabled: false,
        viewport,
      });
      try {
        const plain = await context.newPage();
        await plain.goto(page.url());
        await expect(plain.getByRole("banner")).toBeVisible();
        await expect(plain.getByRole("main")).toBeVisible();
        await expect(plain.getByRole("contentinfo")).toBeVisible();

        const withoutScripts = await pageContent(plain);
        expect(withoutScripts.headings).toEqual(withScripts.headings);
        expect(withoutScripts.links).toEqual(
          expect.arrayContaining(withScripts.links),
        );
        await expectNoSidewaysScroll(plain);
      } finally {
        await context.close();
      }
    });
  }
}

test("utan JavaScript leder länkarna vidare: från startsidan till ett case och till CV:t", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");

  await page.getByRole("list", { name: "Fler projekt" }).getByRole("link").first().click();
  await expect(page).toHaveURL(/\/projects\/[^/]+\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "CV", exact: true })
    .click();
  await expect(page).toHaveURL(/\/cv\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await context.close();
});
