import { expect, test } from "@playwright/test";
import { expectReadableText } from "./support/readable";
import {
  ARCHIVE_LIST,
  SPLIT_FROM,
  THEMES,
  WIDTHS,
  allProjects,
  expectNoSidewaysScroll,
  expectPreviewing,
  expectTheme,
  featuredProject,
  previewWindow,
  previewedProject,
  projectLinks,
  returningVisitor,
  scrollSettled,
  wheelUntil,
} from "./support/site";

const ARCHIVE = "/projects/";
const projects = allProjects();

const escaped = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const twoDigits = (value: number) => String(value).padStart(2, "0");

test.describe("Projektarkivet", () => {
  test("listar alla projekt, nyast först, med det utvalda", async ({ page }) => {
    await page.goto(ARCHIVE);
    await expect(
      page.getByRole("main").getByRole("heading", { level: 1, name: "Alla projekt" }),
    ).toBeVisible();

    const links = projectLinks(page, ARCHIVE_LIST);
    // The archive has more than the start page shows: at this writing 17.
    expect(projects.length).toBeGreaterThan(10);
    await expect(links).toHaveCount(projects.length);
    await expect(links).toHaveText(
      projects.map(
        (project) => new RegExp(`${escaped(project.name)}\\s*${project.year}`),
      ),
    );

    const years = projects.map((project) => project.year);
    expect(years).toEqual([...years].sort((a, b) => b - a));
    expect(projects.map((project) => project.slug)).toContain(
      featuredProject().slug,
    );

    for (const [index, project] of projects.entries()) {
      await expect(links.nth(index)).toHaveAttribute(
        "href",
        `/projects/${project.slug}/`,
      );
    }
  });

  test("visar projekten i den delade vyn: fönstret följer pekaren och skrollen", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(ARCHIVE);

    const pane = previewWindow(page);
    await expect(pane).toBeVisible();
    await expectPreviewing(page, projects[0], ARCHIVE_LIST);
    // The counter counts every project
    await expect(
      pane.getByText(`01 / ${twoDigits(projects.length)}`, { exact: true }),
    ).toBeVisible();

    // The visitor moves the pointer onto the third name
    const third = await projectLinks(page, ARCHIVE_LIST).nth(2).boundingBox();
    expect(third!.y + third!.height).toBeLessThan(900);
    await page.mouse.move(third!.x + 20, third!.y - 40);
    await page.mouse.move(third!.x + 60, third!.y + third!.height / 2, {
      steps: 8,
    });
    await expectPreviewing(page, projects[2], ARCHIVE_LIST);
    await expect(
      pane.getByText(`03 / ${twoDigits(projects.length)}`, { exact: true }),
    ).toBeVisible();

    // Scrolling on takes over from the pointer and reaches the last project
    const last = projects[projects.length - 1];
    await wheelUntil(
      page,
      async () => (await previewedProject(page)) === last.name,
      { step: 250, pause: 120 },
    );
    await scrollSettled(page);
    await expectPreviewing(page, last, ARCHIVE_LIST);
    await expect(pane).toBeInViewport();

    await pane.getByRole("link", { name: `Läs caset: ${last.name}` }).click();
    await expect(page).toHaveURL(new RegExp(`/projects/${last.slug}/$`));
  });

  test("under delningsbredden är varje projekt en rad som leder till caset", async ({
    page,
  }) => {
    await page.setViewportSize({ width: SPLIT_FROM - 1, height: 900 });
    await page.goto(ARCHIVE);

    await expect(previewWindow(page)).toBeHidden();
    const links = projectLinks(page, ARCHIVE_LIST);
    await expect(links).toHaveCount(projects.length);

    const third = projects[2];
    await links.nth(2).click();
    await expect(page).toHaveURL(new RegExp(`/projects/${third.slug}/$`));
    await expect(
      page.getByRole("heading", { level: 1, name: third.name, exact: true }),
    ).toBeVisible();
  });

  test("länken tillbaka går till startsidan", async ({ page }) => {
    await page.goto(ARCHIVE);
    await page.getByRole("main").getByRole("link", { name: "Tillbaka" }).click();
    await expect(page).toHaveURL(/^[^#]*\/$/);
    await expect(page).not.toHaveURL(/projects/);
  });

  for (const theme of THEMES) {
    test(`går att läsa i ${theme === "light" ? "ljust" : "mörkt"} tema, alla bredder`, async ({
      page,
    }) => {
      await returningVisitor(page, { chose: theme });
      await page.setViewportSize({ width: WIDTHS[0], height: 900 });
      await page.goto(ARCHIVE);
      await expectTheme(page, theme);

      const main = page.getByRole("main");
      for (const width of WIDTHS) {
        await test.step(`${width} px`, async () => {
          await page.setViewportSize({ width, height: 900 });
          await expect(page.getByRole("banner")).toBeVisible();
          await expect(page.getByRole("contentinfo")).toBeVisible();
          await expect(
            main.getByRole("heading", { level: 1, name: "Alla projekt" }),
          ).toBeVisible();
          await expect(projectLinks(page, ARCHIVE_LIST).first()).toBeVisible();
          if (width >= SPLIT_FROM) {
            await expect(previewWindow(page)).toBeVisible();
          } else {
            await expect(previewWindow(page)).toBeHidden();
          }
          await expectNoSidewaysScroll(page);
          await expectReadableText(main);
        });
      }
    });
  }
});
