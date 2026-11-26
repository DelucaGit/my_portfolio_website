import { expect, test, type Page } from "@playwright/test";
import {
  SPLIT_FROM,
  expectPreviewing,
  featuredProject,
  homeProjects,
  previewWindow,
  previewedProject,
  projectLinks,
  projectList,
  scrollSettled,
  wheelToProject,
  wheelToProjectList,
  wheelUntil,
} from "./support/site";

const projects = homeProjects();
const featured = featuredProject();

const escaped = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** A project's row or name in the list reads "<name> <year> <tagline>". */
const listed = projects.map(
  (project) => new RegExp(`${escaped(project.name)}\\s*${project.year}`),
);

const byName = (name: string) => {
  const project = projects.find((candidate) => candidate.name === name);
  if (!project) throw new Error(`"${name}" is not one of the listed projects`);
  return project;
};

/** The project the scroll has picked, once the page has stopped. */
const previewed = async (page: Page) => byName(await previewedProject(page));

/** Where the pointer has to be to point at a project's name. */
async function nameSpot(page: Page, index: number) {
  const box = await projectLinks(page).nth(index).boundingBox();
  if (!box) throw new Error(`project ${index} is not on the page`);
  return { x: box.x + 60, y: box.y + box.height / 2 };
}

/** The projects whose names are wholly inside the window right now. */
async function namesInWindow(page: Page): Promise<number[]> {
  const height = page.viewportSize()!.height;
  const inside: number[] = [];
  for (let index = 0; index < projects.length; index++) {
    const box = await projectLinks(page).nth(index).boundingBox();
    if (box && box.y > 80 && box.y + box.height < height) inside.push(index);
  }
  return inside;
}

/** The project whose name lies under a point in the window. */
async function projectUnder(page: Page, spot: { x: number; y: number }) {
  for (let index = 0; index < projects.length; index++) {
    const box = await projectLinks(page).nth(index).boundingBox();
    if (box && spot.y >= box.y && spot.y < box.y + box.height) {
      return projects[index];
    }
  }
  throw new Error("no project name under the pointer");
}

/** The visitor presses Tab until the focus is in the project list. */
async function tabIntoList(page: Page) {
  const focused = projectList(page).locator(":focus");
  for (let presses = 0; presses < 40; presses++) {
    if (await focused.count()) return;
    await page.keyboard.press("Tab");
  }
  throw new Error("Tab never reached the project list");
}

test.describe("Fler projekt på startsidan", () => {
  test("listar nio projekt till, nyast först och utan det utvalda", async ({
    page,
  }) => {
    await page.goto("/");
    const links = projectLinks(page);

    await expect(links).toHaveCount(9);
    await expect(links).toHaveText(listed);
    await expect(
      projectList(page).getByText(featured.name, { exact: true }),
    ).toHaveCount(0);

    const years = projects.map((project) => project.year);
    expect(years).toEqual([...years].sort((a, b) => b - a));

    for (const [index, project] of projects.entries()) {
      await expect(links.nth(index)).toHaveAttribute(
        "href",
        `/projects/${project.slug}/`,
      );
    }
  });

  test("har en rubrik för sig och slutar med en länk till alla projekt", async ({
    page,
  }) => {
    await page.goto("/");
    const section = page.locator("#projekt");

    await expect(
      section.getByRole("heading", { name: "Fler projekt" }),
    ).toBeVisible();

    const all = section.getByRole("link", { name: "Alla projekt" });
    await expect(all).toHaveAttribute("href", "/projects/");
    const lastProject = await projectLinks(page).last().boundingBox();
    const allBox = await all.boundingBox();
    expect(allBox!.y).toBeGreaterThan(lastProject!.y + lastProject!.height - 1);

    await all.click();
    await expect(page).toHaveURL(/\/projects\/$/);
  });

  for (const width of [390, 1440]) {
    test(`utan JavaScript finns alla namn som länkar (${width} px)`, async ({
      browser,
    }) => {
      const context = await browser.newContext({
        javaScriptEnabled: false,
        viewport: { width, height: 900 },
      });
      const page = await context.newPage();
      await page.goto("/");
      const links = projectLinks(page);

      await expect(links).toHaveCount(9);
      for (const [index, project] of projects.entries()) {
        await expect(links.nth(index)).toBeVisible();
        await expect(links.nth(index)).toContainText(project.name);
        await expect(links.nth(index)).toHaveAttribute(
          "href",
          `/projects/${project.slug}/`,
        );
      }
      await expect(
        page.locator("#projekt").getByRole("link", { name: "Alla projekt" }),
      ).toBeVisible();
      await context.close();
    });
  }
});

test.describe("Delad vy: skroll", () => {
  test("fönstret ligger kvar under menyn medan skrollen byter projekt @webkit", async ({
    page,
  }) => {
    await page.goto("/");
    const pane = previewWindow(page);

    await wheelToProject(page, projects[4]);
    const first = await previewed(page);
    await expectPreviewing(page, first);
    const before = await pane.boundingBox();

    // All the way to the last project: the window has not moved.
    await wheelToProject(page, projects.at(-2)!);
    await wheelToProject(page, projects.at(-1)!, { gently: true });
    const second = await previewed(page);
    expect(second.name).not.toBe(first.name);
    await expectPreviewing(page, second);
    const after = await pane.boundingBox();

    const menu = await page.getByRole("banner").boundingBox();
    expect(before!.y).toBeGreaterThanOrEqual(menu!.y + menu!.height);
    expect(Math.abs(after!.y - before!.y)).toBeLessThan(1);
    await expect(pane).toBeInViewport({ ratio: 1 });
  });

  test("varje projekt går att nå med skrollen, det första och det sista också", async ({
    page,
  }) => {
    await page.goto("/");
    const seen: string[] = [];
    const note = async () => {
      const name = await previewedProject(page);
      if (seen.at(-1) !== name) seen.push(name);
    };
    const atTheEnd = () =>
      page.evaluate(
        () =>
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 2,
      );

    // Down to the list, slowly past every name, and on to the end of the page.
    await note();
    await wheelToProjectList(page);
    await wheelUntil(page, async () => {
      await note();
      return seen.at(-1) === projects.at(-1)!.name;
    });
    await wheelUntil(
      page,
      async () => {
        await note();
        return atTheEnd();
      },
      { step: 400 },
    );
    expect(seen).toEqual(projects.map((project) => project.name));
    await expectPreviewing(page, projects.at(-1)!);

    await wheelUntil(page, () => page.evaluate(() => window.scrollY === 0), {
      step: -600,
    });
    await expectPreviewing(page, projects[0]);
  });

  test("efter en omladdning längre ner visas projektet där man är", async ({
    page,
  }) => {
    await page.goto("/");
    await wheelToProject(page, projects[5]);
    const here = await previewed(page);

    await page.reload();
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(0);
    await expectPreviewing(page, here);
  });

  test("skärmbilderna för de närmaste projekten hämtas i förväg", async ({
    page,
  }) => {
    const fetched = new Set<string>();
    page.on("request", (request) => {
      const match = /\/previews\/(.+?)(-sm)?\.webp/.exec(request.url());
      if (match) fetched.add(match[1]);
    });
    await page.goto("/");
    await wheelToProject(page, projects[4]);
    const here = projects.indexOf(await previewed(page));

    for (const near of [here - 2, here - 1, here + 1, here + 2]) {
      await expect
        .poll(() => fetched.has(projects[near].slug), {
          message: `skärmbilden för ${projects[near].name}`,
        })
        .toBe(true);
    }
    expect(fetched.has(projects.at(-1)!.slug)).toBe(false);
  });
});

test.describe("Delad vy: peka", () => {
  test("pekaren tar över, och skrollen tar tillbaka först efter en bit", async ({
    page,
  }) => {
    await page.goto("/");
    await wheelToProject(page, projects[3]);
    const scrolledTo = await previewed(page);

    // Point at the highest name in the window: the scroll has left it behind
    // and will not pick it again further down.
    const pointed = (await namesInWindow(page))[0];
    expect(pointed).toBeLessThan(projects.indexOf(scrolledTo));
    const spot = await nameSpot(page, pointed);
    await page.mouse.move(spot.x, spot.y, { steps: 8 });
    await expectPreviewing(page, projects[pointed]);

    // A short scroll changes nothing: the pointer still decides.
    await page.mouse.wheel(0, 30);
    await scrollSettled(page);
    await expectPreviewing(page, projects[pointed]);

    // A longer one hands the choice back to the scroll.
    await page.mouse.wheel(0, 200);
    await scrollSettled(page);
    const backWithScroll = await previewed(page);
    expect(backWithScroll.name).not.toBe(projects[pointed].name);
    await expectPreviewing(page, backWithScroll);
  });

  test("ett projekt som skrollas in under en stilla pekare räknas inte som utpekat", async ({
    page,
  }) => {
    await page.goto("/");
    await wheelToProject(page, projects[1]);

    // The pointer comes to rest over a name further down and then stays put.
    const resting = (await namesInWindow(page)).at(-1)!;
    const spot = await nameSpot(page, resting);
    await page.mouse.move(spot.x, spot.y);

    // Other names pass under it while the page scrolls.
    await wheelToProject(page, projects[4]);
    const scrolledTo = await previewed(page);
    const underPointer = await projectUnder(page, spot);
    expect(underPointer.name).not.toBe(projects[resting].name);
    expect(underPointer.name).not.toBe(scrolledTo.name);
    await expectPreviewing(page, scrolledTo);

    // A twitch of the mouse is not pointing either.
    await page.mouse.move(spot.x + 2, spot.y + 1);
    await page.mouse.move(spot.x + 3, spot.y + 1);
    await expectPreviewing(page, scrolledTo);

    // Moving it for real is.
    await page.mouse.move(spot.x + 60, spot.y, { steps: 6 });
    await expectPreviewing(page, underPointer);
  });
});

test.describe("Delad vy: tangentbord", () => {
  test("listan är ett tabbstopp: pilar, Home och End byter projekt, Tab går till knapparna, Enter öppnar caset", async ({
    page,
  }) => {
    await page.goto("/");
    const links = projectLinks(page);
    const help = previewWindow(page).getByText("Enter öppnar caset");

    await expect(help).toBeHidden();
    await tabIntoList(page);
    await expect(help).toBeVisible();

    await page.keyboard.press("Home");
    await expect(links.nth(0)).toBeFocused();
    await expectPreviewing(page, projects[0]);

    await page.keyboard.press("ArrowDown");
    await expect(links.nth(1)).toBeFocused();
    await expectPreviewing(page, projects[1]);

    await page.keyboard.press("End");
    await expect(links.nth(8)).toBeFocused();
    await expectPreviewing(page, projects[8]);

    await page.keyboard.press("ArrowDown");
    await expect(links.nth(8)).toBeFocused();

    await page.keyboard.press("ArrowUp");
    await expect(links.nth(7)).toBeFocused();
    await expectPreviewing(page, projects[7]);

    await page.keyboard.press("Home");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await expect(links.nth(2)).toBeFocused();
    await expectPreviewing(page, projects[2]);

    // One Tab leaves the list for the window's buttons, and Shift+Tab comes
    // back to the same project.
    await page.keyboard.press("Tab");
    await expect(
      previewWindow(page).getByRole("link", {
        name: `Läs caset: ${projects[2].name}`,
      }),
    ).toBeFocused();
    await expect(help).toBeHidden();
    await page.keyboard.press("Shift+Tab");
    await expect(links.nth(2)).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`/projects/${projects[2].slug}/$`));
    await expect(
      page.getByRole("heading", { level: 1, name: projects[2].name }),
    ).toBeVisible();
  });
});

test.describe("Delad vy: fönstret", () => {
  test("visar år, typ, byggt med och bara de knappar projektet har, i ett fönster som alltid är lika högt", async ({
    page,
  }) => {
    // The list has to hold both kinds, or the test says nothing.
    expect(projects.some((project) => !project.siteUrl)).toBe(true);
    expect(projects.some((project) => project.siteUrl)).toBe(true);
    expect(projects.some((project) => !project.githubUrl)).toBe(true);
    expect(projects.some((project) => project.githubUrl)).toBe(true);

    await page.goto("/");
    const pane = previewWindow(page);
    await tabIntoList(page);
    await page.keyboard.press("Home");

    const heights: number[] = [];
    for (const [index, project] of projects.entries()) {
      if (index) await page.keyboard.press("ArrowDown");
      await expectPreviewing(page, project);

      await expect(pane.getByText(String(project.year), { exact: true })).toBeVisible();
      await expect(
        pane.getByText(project.tags.join(" · "), { exact: true }),
      ).toBeVisible();
      await expect(
        pane.getByText(project.stack.join(" · "), { exact: true }),
      ).toBeVisible();

      const visit = pane.getByRole("link", { name: /^Besök sidan/ });
      const code = pane.getByRole("link", { name: /^Kod på GitHub/ });
      if (project.siteUrl) {
        await expect(visit).toHaveAccessibleName(`Besök sidan: ${project.name}`);
        await expect(visit).toHaveAttribute("href", project.siteUrl);
      } else {
        await expect(visit).toHaveCount(0);
      }
      if (project.githubUrl) {
        await expect(code).toHaveAccessibleName(`Kod på GitHub: ${project.name}`);
        await expect(code).toHaveAttribute("href", project.githubUrl);
      } else {
        await expect(code).toHaveCount(0);
      }

      heights.push((await pane.boundingBox())!.height);
    }
    expect(new Set(heights).size, `höjder: ${heights.join(", ")}`).toBe(1);
  });

  test("krymper på en låg skärm så att fakta och knappar får plats", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 560 });
    await page.goto("/");
    await wheelToProject(page, projects[4]);
    const here = await previewed(page);
    const pane = previewWindow(page);

    const menu = await page.getByRole("banner").boundingBox();
    const box = await pane.boundingBox();
    expect(box!.y).toBeGreaterThanOrEqual(menu!.y + menu!.height);
    expect(box!.y + box!.height).toBeLessThanOrEqual(560);
    await expect(pane.getByText("Byggt med")).toBeInViewport({ ratio: 1 });
    await expect(
      pane.getByRole("link", { name: `Läs caset: ${here.name}` }),
    ).toBeInViewport({ ratio: 1 });
  });
});

test.describe("Delad vy: smal skärm", () => {
  test("under 1024 px är projekten rader med skärmbild, namn, år och tagline, och hela raden är en länk", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 800, height: 900 });
    await page.goto("/");
    const links = projectLinks(page);

    await expect(previewWindow(page)).toBeHidden();
    await expect(links).toHaveCount(9);
    for (const [index, project] of projects.entries()) {
      const row = links.nth(index);
      await row.scrollIntoViewIfNeeded();
      await expect(row.getByText(project.name, { exact: true })).toBeVisible();
      await expect(row.getByText(String(project.year), { exact: true })).toBeVisible();
      await expect(row.getByText(project.tagline)).toBeVisible();
      await expect(row.locator("img")).toBeVisible();
      await expect
        .poll(() =>
          row
            .locator("img")
            .evaluate((image: HTMLImageElement) => image.naturalWidth),
        )
        .toBeGreaterThan(0);
    }

    // From 700 px the rows stand in two columns, below that in one.
    const [first, second] = [
      await links.nth(0).boundingBox(),
      await links.nth(1).boundingBox(),
    ];
    expect(second!.y).toBe(first!.y);
    expect(second!.x).toBeGreaterThan(first!.x + first!.width);

    await page.setViewportSize({ width: 600, height: 900 });
    await expect
      .poll(async () => (await links.nth(1).boundingBox())!.y)
      .toBeGreaterThan((await links.nth(0).boundingBox())!.y);

    // A row is a link like any other: it opens the case.
    await links.nth(1).click();
    await expect(page).toHaveURL(new RegExp(`/projects/${projects[1].slug}/$`));
  });

  test("läget byts direkt när fönstrets bredd ändras", async ({ page }) => {
    await page.setViewportSize({ width: SPLIT_FROM, height: 800 });
    await page.goto("/");
    const pane = previewWindow(page);
    const links = projectLinks(page);
    await links.first().scrollIntoViewIfNeeded();

    await expect(pane).toBeVisible();
    await expect(links.first().locator("img")).toBeHidden();

    await page.setViewportSize({ width: SPLIT_FROM - 1, height: 800 });
    await expect(pane).toBeHidden();
    await expect(links.first().locator("img")).toBeVisible();
    await expect(projectList(page).locator("[aria-current]")).toHaveCount(0);

    // In rows every project is its own tab stop again.
    await links.nth(0).focus();
    await page.keyboard.press("Tab");
    await expect(links.nth(1)).toBeFocused();

    await page.setViewportSize({ width: SPLIT_FROM, height: 800 });
    await expect(pane).toBeVisible();
    await expect(links.first().locator("img")).toBeHidden();
    await expect(projectList(page).locator("[aria-current]")).toHaveCount(1);
  });
});
