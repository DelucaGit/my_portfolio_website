import { expect, test, type Locator, type Page } from "@playwright/test";
import { ENDED_SITE, endedCast } from "./support/ended-site";
import {
  ARCHIVE_LIST,
  SPLIT_FROM,
  THEMES,
  WIDTHS,
  expectNoSidewaysScroll,
  expectPreviewing,
  featuredCard,
  previewWindow,
  projectLinks,
  returningVisitor,
  scrollSettled,
} from "./support/site";
import { expectReadableText } from "./support/readable";
import type { Project } from "@/lib/projects";

/**
 * "Kunden har avslutat projektet": the button to a customer's site when the
 * site is gone. These tests visit the copy of the site in which two projects
 * have ended (see support/ended-site.ts): one marked by hand in the data, one
 * found by the link check.
 */
test.use({ baseURL: ENDED_SITE });

const ENDED = "Kunden har avslutat projektet";
const { markedEnded, foundEnded, unreachable, untouched } = endedCast();

const endedButton = (scope: Locator | Page, project: Project) =>
  scope.getByRole("link", {
    name: `${ENDED}: ${project.name}`,
    exact: true,
    disabled: true,
  });

const visitLink = (scope: Locator | Page, project: Project) =>
  scope.getByRole("link", { name: `Besök sidan: ${project.name}`, exact: true });

/** The button is there and switched off, and nothing leads to the old site. */
async function expectEnded(scope: Locator | Page, project: Project) {
  const button = endedButton(scope, project);
  await expect(button).toBeVisible();
  await expect(button).toHaveText(ENDED);
  await expect(visitLink(scope, project)).toHaveCount(0);
  await expect(scope.locator(`a[href="${project.siteUrl}"]`)).toHaveCount(0);
}

/** The button to the site works as usual. */
async function expectVisitable(scope: Locator | Page, project: Project) {
  await expect(visitLink(scope, project)).toHaveAttribute("href", project.siteUrl);
  await expect(scope.getByText(ENDED)).toHaveCount(0);
}

/** The visitor points at a project in the split view's list. */
async function pointAtProject(page: Page, project: Project, listName?: string) {
  const link = projectLinks(page, listName)
    .filter({ hasText: project.name })
    .first();
  await link.scrollIntoViewIfNeeded();
  await scrollSettled(page);
  // The pointer only takes over once it has really moved after a scroll.
  const box = await link.boundingBox();
  if (!box) throw new Error(`pointAtProject: ${project.name} is not in the list`);
  await page.mouse.move(box.x + 10, box.y + 4);
  await page.mouse.move(box.x + 40, box.y + box.height / 2, { steps: 5 });
  await expectPreviewing(page, project, listName);
}

test.describe("Kunden har avslutat projektet", () => {
  test("startsidan: det utvalda kortet har knappen otillgänglig", async ({
    page,
  }) => {
    await page.goto("/");
    const card = featuredCard(page);
    await expectEnded(card, markedEnded);
    // The case itself is still there to read.
    await expect(card.getByRole("link", { name: /Läs caset/ })).toHaveAttribute(
      "href",
      `/projects/${markedEnded.slug}/`,
    );
  });

  test("startsidan: fönstret i den delade vyn har knappen otillgänglig", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const pane = previewWindow(page);

    await pointAtProject(page, foundEnded);
    await expectEnded(pane, foundEnded);

    // A site that could not be reached keeps its button, and so does the rest.
    await pointAtProject(page, unreachable);
    await expectVisitable(pane, unreachable);
    await pointAtProject(page, untouched);
    await expectVisitable(pane, untouched);
  });

  test("projektarkivet: båda avslutade projekt har knappen otillgänglig", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/projects/");
    const pane = previewWindow(page);

    for (const project of [markedEnded, foundEnded]) {
      await pointAtProject(page, project, ARCHIVE_LIST);
      await expectEnded(pane, project);
    }
    await pointAtProject(page, unreachable, ARCHIVE_LIST);
    await expectVisitable(pane, unreachable);
  });

  test("projektsidorna: avslutade projekt har knappen otillgänglig", async ({
    page,
  }) => {
    for (const project of [markedEnded, foundEnded]) {
      await page.goto(`/projects/${project.slug}/`);
      await expectEnded(page.getByRole("main"), project);
    }
    for (const project of [unreachable, untouched]) {
      await page.goto(`/projects/${project.slug}/`);
      await expectVisitable(page.getByRole("main"), project);
    }
  });

  test("knappen går inte att nå med Tab och leder ingenstans", async ({
    page,
    context,
  }) => {
    await page.goto("/");
    const card = featuredCard(page);
    const button = endedButton(card, markedEnded);

    // Tab goes from "Läs caset" past the button, out of the card.
    await card.getByRole("link", { name: /Läs caset/ }).focus();
    await page.keyboard.press("Tab");
    await expect(button).not.toBeFocused();
    await expect(card.locator(":focus")).toHaveCount(0);

    // A click does nothing: no new tab, and the page stays.
    const pages = context.pages().length;
    await button.click({ force: true });
    await page.waitForTimeout(300);
    expect(context.pages()).toHaveLength(pages);
    await expect(page).toHaveURL(`${ENDED_SITE}/`);
  });

  for (const theme of THEMES) {
    test(`knappen går att läsa i ${theme} tema`, async ({ page }) => {
      await returningVisitor(page, { chose: theme });
      await page.setViewportSize({ width: 1440, height: 900 });

      await page.goto("/");
      await expectReadableText(endedButton(featuredCard(page), markedEnded));

      await page.goto(`/projects/${markedEnded.slug}/`);
      await expectReadableText(endedButton(page.getByRole("main"), markedEnded));

      await page.goto("/projects/");
      await pointAtProject(page, foundEnded, ARCHIVE_LIST);
      await expectReadableText(endedButton(previewWindow(page), foundEnded));
    });
  }

  for (const width of WIDTHS) {
    test(`knappen får plats på ${width} px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });

      await page.goto("/");
      await expect(endedButton(featuredCard(page), markedEnded)).toBeVisible();
      await expectNoSidewaysScroll(page);

      await page.goto(`/projects/${markedEnded.slug}/`);
      await expect(
        endedButton(page.getByRole("main"), markedEnded),
      ).toBeVisible();
      await expectNoSidewaysScroll(page);

      if (width < SPLIT_FROM) return;
      // The window's buttons stand on one line, all of them inside the window.
      await page.goto("/projects/");
      await pointAtProject(page, foundEnded, ARCHIVE_LIST);
      const pane = previewWindow(page);
      const edges = await Promise.all(
        [pane, endedButton(pane, foundEnded), pane.getByRole("link").last()].map(
          async (part) => {
            const box = await part.boundingBox();
            if (!box) throw new Error("a part of the window is not on screen");
            return box.x + box.width;
          },
        ),
      );
      expect(edges[1]).toBeLessThanOrEqual(edges[0]);
      expect(edges[2]).toBeLessThanOrEqual(edges[0]);
      await expectNoSidewaysScroll(page);
    });
  }
});
