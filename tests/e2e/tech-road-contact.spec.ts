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
