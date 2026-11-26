import { expect, test, type Page } from "@playwright/test";
import { expectReadableText } from "./support/readable";
import {
  expectNoSidewaysScroll,
  expectTheme,
  returningVisitor,
  THEMES,
  WIDTHS,
} from "./support/site";

/** Teknik, Vägen hit and Kontakt on the start page (#60). */

const tech = (page: Page) =>
  page.getByRole("region", { name: "Vilka språk jag kan" });

test.describe("Teknik", () => {
  test("visar språk och verktyg grupperade efter vad de används till", async ({
    page,
  }) => {
    await page.goto("/");

    const groups: [string, string[]][] = [
      ["Frontend", ["React / Next.js", "Tailwind CSS", "HTML & CSS"]],
      ["Backend och data", ["Java", "REST API", "PostgreSQL", "Firebase"]],
      ["Cloud och drift", ["Docker", "AWS", "Azure"]],
      ["Samarbete och verktyg", ["Git", "Jira", "Cursor", "Claude Code"]],
    ];
    for (const [group, names] of groups) {
      await expect(
        tech(page).getByRole("heading", { name: group, exact: true }),
      ).toBeVisible();
      const list = tech(page).getByRole("list", { name: group, exact: true });
      for (const name of names) {
        await expect(
          list.getByRole("listitem").filter({ hasText: name }).first(),
        ).toBeVisible();
      }
    }
    // Every technology is listed exactly once
    await expect(tech(page).getByRole("listitem")).toHaveCount(16);
  });

  test("ligger på #teknik", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#teknik")).toHaveAccessibleName(
      "Vilka språk jag kan",
    );
  });
});

const road = (page: Page) => page.getByRole("region", { name: "Vägen hit" });

test.describe("Vägen hit", () => {
  test("visar utbildning och arbete på en tidslinje, senaste först", async ({
    page,
  }) => {
    await page.goto("/");
    const steps = road(page).getByRole("listitem");
    await expect(steps).toHaveCount(4);

    const expected = [
      [
        "2025 – 2027",
        "Utbildning",
        "Systemutveckling i Java med cloud-inriktning",
        "JENSEN yrkeshögskola",
      ],
      ["2022 – nu", "Arbete", "Webbutvecklare", "Egna projekt och kunduppdrag"],
      ["2022 – 2024", "Utbildning", "Webmaster", "Högskolan Väst (distans)"],
      [
        "2017 – 2020",
        "Utbildning",
        "Samhällsvetenskap / IB",
        "Katedralskolan Växjö",
      ],
    ];
    for (const [index, texts] of expected.entries()) {
      for (const text of texts) {
        await expect(steps.nth(index)).toContainText(text);
      }
    }
  });

  test("länkar till hela CV:t", async ({ page }) => {
    await page.goto("/");
    const link = road(page).getByRole("link", { name: "Läs hela CV:t" });
    await expect(link).toHaveAttribute("href", /\/cv\/$/);
    await link.click();
    await expect(page).toHaveURL(/\/cv\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

const TOUCH_TARGET = 44;

for (const theme of THEMES) {
  test.describe(`Teknik, Vägen hit och Kontakt i ${theme === "light" ? "ljust" : "mörkt"} tema`, () => {
    test("håller i alla bredder", async ({ page }) => {
      await returningVisitor(page, { chose: theme });
      await page.setViewportSize({ width: WIDTHS[0], height: 900 });
      await page.goto("/");
      await expectTheme(page, theme);

      for (const width of WIDTHS) {
        await test.step(`${width} px`, async () => {
          await page.setViewportSize({ width, height: 900 });
          await expectNoSidewaysScroll(page);

          // The three parts come in this order, each with its heading
          const tops: number[] = [];
          for (const section of [tech(page), road(page), contact(page)]) {
            await section.scrollIntoViewIfNeeded();
            await expect(section.getByRole("heading").first()).toBeVisible();
            const box = await section.boundingBox();
            expect(box, "the section is on the page").not.toBeNull();
            tops.push(box!.y + (await page.evaluate(() => window.scrollY)));
            // Nothing in the section sticks out of the window
            expect(box!.x).toBeGreaterThanOrEqual(0);
            expect(box!.x + box!.width).toBeLessThanOrEqual(width);
          }
          expect(tops[0]).toBeLessThan(tops[1]);
          expect(tops[1]).toBeLessThan(tops[2]);

          // Everything a visitor can press is fully inside the window
          const controls = [
            road(page).getByRole("link", { name: "Läs hela CV:t" }),
            contact(page).getByRole("link", { name: "Mejla mig" }),
            contact(page).getByRole("link", { name: /^Ring\b/ }),
            contact(page).getByRole("button", {
              name: "Kopiera e-postadressen",
            }),
            contact(page).getByRole("link", { name: "LinkedIn" }),
            contact(page).getByRole("link", { name: "GitHub" }),
          ];
          for (const control of controls) {
            await expect(control).toBeVisible();
            const box = await control.boundingBox();
            expect(box!.x).toBeGreaterThanOrEqual(0);
            expect(box!.x + box!.width).toBeLessThanOrEqual(width);
            expect(box!.height).toBeGreaterThanOrEqual(TOUCH_TARGET);
          }

          // All sixteen technologies and all four steps are readable
          for (const item of await tech(page).getByRole("listitem").all()) {
            await expect(item).toBeVisible();
          }
          await expect(road(page).getByRole("listitem")).toHaveCount(4);
          await expect(
            contact(page).getByText("Ring efter 12.00"),
          ).toBeVisible();
        });
      }
    });

    test("texten syns mot bakgrunden", async ({ page }) => {
      await returningVisitor(page, { chose: theme });
      await page.goto("/");
      await expectTheme(page, theme);

      for (const section of [tech(page), road(page), contact(page)]) {
        await expectReadableText(section);
      }
    });
  });
}

const EMAIL = "malakdeluca@gmail.com";

const contact = (page: Page) =>
  page.getByRole("region", { name: "Ska vi höras?" });

test.describe("Kontakt", () => {
  test("har knappar för att mejla och ringa", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#kontakt")).toHaveAccessibleName(
      "Ska vi höras?",
    );
    await expect(
      contact(page).getByRole("link", { name: "Mejla mig" }),
    ).toHaveAttribute("href", `mailto:${EMAIL}`);
    await expect(
      contact(page).getByRole("link", { name: /^Ring\b/ }),
    ).toHaveAttribute("href", "tel:0738796601");
  });

  test("visar adressen, numret och när det är bäst att ringa", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(contact(page).getByText(EMAIL, { exact: true })).toBeVisible();
    await expect(
      contact(page).getByText("073 879 66 01", { exact: true }),
    ).toBeVisible();
    await expect(contact(page).getByText("Ring efter 12.00")).toBeVisible();
  });

  test("länkar till LinkedIn och GitHub i en ny flik", async ({ page }) => {
    await page.goto("/");
    const links: [string, string][] = [
      ["LinkedIn", "https://www.linkedin.com/in/marcel-deluca"],
      ["GitHub", "https://github.com/DelucaGit"],
    ];
    for (const [name, href] of links) {
      const link = contact(page).getByRole("link", { name });
      await expect(link).toHaveAttribute("href", href);
      await expect(link).toHaveAttribute("target", "_blank");
    }
  });

  test("kopieringsknappen kopierar adressen och säger till", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");

    const copy = contact(page).getByRole("button", {
      name: "Kopiera e-postadressen",
    });
    await expect(copy).toBeVisible();
    // Nothing is announced before the visitor has pressed the button
    await expect(contact(page).getByRole("status")).toBeEmpty();

    await copy.click();

    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(EMAIL);
    // Seen on the button, and announced to screen readers
    await expect(
      contact(page).getByRole("button", { name: "Kopierad" }),
    ).toBeVisible();
    await expect(contact(page).getByRole("status")).toHaveText(
      "E-postadressen är kopierad",
    );

    // After a moment the button is ready to be used again
    await expect(copy).toBeVisible();
    await expect(contact(page).getByRole("status")).toBeEmpty();
  });

  test("kopieringsknappen går att använda med tangentbordet", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");

    await contact(page)
      .getByRole("button", { name: "Kopiera e-postadressen" })
      .focus();
    await page.keyboard.press("Enter");

    await expect(contact(page).getByRole("status")).toHaveText(
      "E-postadressen är kopierad",
    );
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(EMAIL);
  });
});
