import { expect, test } from "@playwright/test";
import {
  chooseTheme,
  expectTheme,
  keyRoutes,
  returningVisitor,
  THEME_BUTTON,
} from "./support/site";

test.describe("Tema", () => {
  test("följer systemet tills besökaren väljer själv", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expectTheme(page, "dark");

    await page.emulateMedia({ colorScheme: "light" });
    await expectTheme(page, "light");
  });

  test("mörkt tema som väljs sparas och gäller på alla sidor @webkit", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expectTheme(page, "light");

    await chooseTheme(page, "dark");
    await expectTheme(page, "dark");

    for (const route of keyRoutes()) {
      await page.goto(route);
      await expectTheme(page, "dark");
      await expect(
        page
          .getByRole("contentinfo")
          .getByRole("button", { name: THEME_BUTTON.dark }),
      ).toHaveAttribute("aria-pressed", "true");
    }

    await page.reload();
    await expectTheme(page, "dark");
  });

  test("valet följer med när besökaren klickar sig vidare", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await chooseTheme(page, "light");

    await page
      .getByRole("contentinfo")
      .getByRole("link", { name: "CV", exact: true })
      .click();
    await expect(page).toHaveURL(/\/cv\/$/);
    await expectTheme(page, "light");
  });

  test("besökaren kan gå tillbaka till att följa systemet", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await chooseTheme(page, "light");
    await expectTheme(page, "light");

    await chooseTheme(page, "system");
    await expectTheme(page, "dark");

    await page.reload();
    await expectTheme(page, "dark");
  });

  test("temaväljaren finns också i menyn", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await page
      .getByRole("banner")
      .getByRole("group", { name: "Tema" })
      .getByRole("button", { name: THEME_BUTTON.dark })
      .click();
    await expectTheme(page, "dark");
  });

  for (const route of keyRoutes()) {
    test(`ingen blinkning i fel tema vid laddning: ${route}`, async ({
      page,
    }) => {
      // The saved theme must be on the page before the app's own scripts have
      // loaded. Hold those scripts back and look at what is painted.
      await page.route("**/_next/static/**/*.js", (request) => request.abort());
      await returningVisitor(page, { chose: "dark", system: "light" });
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expectTheme(page, "dark");
    });
  }
});
