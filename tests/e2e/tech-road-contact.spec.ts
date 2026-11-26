import { expect, test, type Page } from "@playwright/test";

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
