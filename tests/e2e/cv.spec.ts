import { expect, test } from "@playwright/test";
import { expectReadableText } from "./support/readable";
import {
  expectNoSidewaysScroll,
  expectTheme,
  returningVisitor,
  THEMES,
  WIDTHS,
} from "./support/site";

const CV = "/cv/";
const SECTIONS = ["Erfarenhet", "Utbildning", "Kompetens", "Språk"];
/** The ink and paper of the light theme. A printed CV always uses these. */
const LIGHT_INK = "rgb(32, 31, 26)";
const WHITE = "rgb(255, 255, 255)";

test.describe("CV-sidan", () => {
  for (const theme of THEMES) {
    test(`innehållet syns och går att läsa i ${theme === "light" ? "ljust" : "mörkt"} tema, alla bredder`, async ({
      page,
    }) => {
      await returningVisitor(page, { chose: theme });
      await page.setViewportSize({ width: WIDTHS[0], height: 900 });
      await page.goto(CV);
      await expectTheme(page, theme);

      const main = page.getByRole("main");
      for (const width of WIDTHS) {
        await test.step(`${width} px`, async () => {
          await page.setViewportSize({ width, height: 900 });

          await expect(page.getByRole("banner")).toBeVisible();
          await expect(page.getByRole("contentinfo")).toBeVisible();
          await expect(
            main.getByRole("heading", { level: 1, name: "Marcel Deluca Nygren" }),
          ).toBeVisible();
          await expect(main.getByText("Fullstack Webbutvecklare")).toBeVisible();
          await expect(
            main.getByRole("img", { name: "Marcel Deluca Nygren i kavaj och polotröja" }),
          ).toBeVisible();
          for (const name of SECTIONS) {
            await expect(main.getByRole("heading", { name, exact: true })).toBeVisible();
          }
          await expect(
            main.getByRole("heading", { name: "Webbutvecklare", exact: true }),
          ).toBeVisible();
          await expect(main.getByText("JENSEN yrkeshögskola")).toBeVisible();
          await expect(main.getByText("TypeScript", { exact: true })).toBeVisible();
          await expect(main.getByText("Arabiska")).toBeVisible();
          await expect(
            main.getByRole("heading", { name: "Vill du komma i kontakt?" }),
          ).toBeVisible();

          await expectNoSidewaysScroll(page);
          await expectReadableText(main);
        });
      }
    });
  }

  test("har länkar för att ladda ner, mejla, ringa och hitta Marcel på nätet", async ({
    page,
  }) => {
    await page.goto(CV);
    const main = page.getByRole("main");
    const links: [string, RegExp][] = [
      ["Ladda ner CV (PDF)", /^\/cv\.pdf/],
      ["GitHub", /^https:\/\/github\.com\/DelucaGit$/],
      ["LinkedIn", /^https:\/\/www\.linkedin\.com\/in\/marcel-deluca$/],
    ];
    for (const [name, href] of links) {
      await expect(main.getByRole("link", { name })).toHaveAttribute("href", href);
    }
    await expect(
      main.getByRole("link", { name: "malakdeluca@gmail.com" }).first(),
    ).toHaveAttribute("href", "mailto:malakdeluca@gmail.com");
    await expect(
      main.getByRole("link", { name: "073 879 66 01" }).first(),
    ).toHaveAttribute("href", "tel:0738796601");
    await expect(main.getByText("Ring efter 12.00").first()).toBeVisible();
  });

  test("det man har lärt sig på en utbildning går att fälla ut", async ({
    page,
  }) => {
    await page.goto(CV);
    const main = page.getByRole("main");
    await expect(main.getByText("Java och Spring Boot")).toBeHidden();
    await main.getByText("Vad har jag lärt mig?").first().click();
    await expect(main.getByText("Java och Spring Boot")).toBeVisible();
  });

  test("länken tillbaka går till startsidan", async ({ page }) => {
    await page.goto(CV);
    await page.getByRole("main").getByRole("link", { name: "Tillbaka" }).click();
    await expect(page).toHaveURL(/^[^#]*\/$/);
    await expect(page).not.toHaveURL(/cv/);
  });
});

test.describe("CV-sidan på papper", () => {
  for (const theme of THEMES) {
    test(`skrivs ut utan meny och sidfot, i ljusa färger, från ${theme === "light" ? "ljust" : "mörkt"} tema @webkit`, async ({
      page,
    }) => {
      await returningVisitor(page, { chose: theme });
      await page.goto(CV);
      await expectTheme(page, theme);
      await page.emulateMedia({ media: "print" });

      await expect(page.getByRole("banner")).toBeHidden();
      await expect(page.getByRole("contentinfo")).toBeHidden();
      await expect(page.getByRole("button", { name: "Mörkt" })).toHaveCount(0);
      await expect(
        page.getByRole("link", { name: "Hoppa till innehållet" }),
      ).toBeHidden();

      const main = page.getByRole("main");
      const name = main.getByRole("heading", { level: 1, name: "Marcel Deluca Nygren" });
      await expect(name).toBeVisible();
      for (const section of SECTIONS) {
        await expect(main.getByRole("heading", { name: section, exact: true })).toBeVisible();
      }
      await expect(main.getByText("JENSEN yrkeshögskola")).toBeVisible();
      await expect(main.getByText("malakdeluca@gmail.com").first()).toBeVisible();
      await expect(main.getByText("073 879 66 01").first()).toBeVisible();

      // Paper cannot be clicked: what was folded away on screen is printed,
      // and the web addresses are written out.
      await expect(main.getByText("Java och Spring Boot")).toBeVisible();
      await expect(main.getByText("github.com/DelucaGit")).toBeVisible();
      await expect(main.getByText("linkedin.com/in/marcel-deluca")).toBeVisible();
      // Buttons that only work on a screen are left out
      await expect(main.getByRole("link", { name: "Ladda ner CV (PDF)" })).toBeHidden();
      await expect(main.getByRole("link", { name: "Tillbaka" })).toBeHidden();

      // Dark ink on white paper, whatever theme the screen has
      await expect(page.locator("body")).toHaveCSS("background-color", WHITE);
      await expect(name).toHaveCSS("color", LIGHT_INK);
      await expectReadableText(main);
    });
  }
});
