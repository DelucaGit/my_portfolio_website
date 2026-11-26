import { expect, test } from "@playwright/test";
import { expectReadableText } from "./support/readable";
import {
  expectNoSidewaysScroll,
  expectTheme,
  returningVisitor,
  THEMES,
  WIDTHS,
} from "./support/site";

const SERVICE = "/services/web-development/";

test.describe("Tjänstesida", () => {
  for (const theme of THEMES) {
    test(`innehållet syns och går att läsa i ${theme === "light" ? "ljust" : "mörkt"} tema, alla bredder`, async ({
      page,
    }) => {
      await returningVisitor(page, { chose: theme });
      await page.setViewportSize({ width: WIDTHS[0], height: 900 });
      await page.goto(SERVICE);
      await expectTheme(page, theme);

      const main = page.getByRole("main");
      for (const width of WIDTHS) {
        await test.step(`${width} px`, async () => {
          await page.setViewportSize({ width, height: 900 });

          await expect(page.getByRole("banner")).toBeVisible();
          await expect(page.getByRole("contentinfo")).toBeVisible();
          await expect(main.getByRole("heading", { level: 1 })).toBeVisible();
          for (const name of ["Det här får ni", "Så här går det till"]) {
            await expect(main.getByRole("heading", { name })).toBeVisible();
          }
          await expect(main.getByRole("link", { name: "Hör av dig" })).toBeVisible();
          await expect(main.getByRole("link", { name: "Mejla mig" })).toBeVisible();

          await expectNoSidewaysScroll(page);
          await expectReadableText(main);
        });
      }
    });
  }

  test("länken tillbaka går till startsidan", async ({ page }) => {
    await page.goto(SERVICE);
    await page
      .getByRole("main")
      .getByRole("link", { name: "Till startsidan" })
      .click();
    await expect(page).toHaveURL(/^[^#]*\/$/);
    await expect(page).not.toHaveURL(/services/);
  });

  test("länken till nästa tjänst öppnar den", async ({ page }) => {
    await page.goto(SERVICE);
    await page
      .getByRole("navigation", { name: "Andra tjänster" })
      .getByRole("link")
      .first()
      .click();
    await expect(page).toHaveURL(/\/services\/(?!web-development)[a-z-]+\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
