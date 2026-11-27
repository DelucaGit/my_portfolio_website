import { expect, test, type Page } from "@playwright/test";
import { getProjectView } from "@/lib/projects";
import {
  expectFilmPlaying,
  expectFilmStill,
  featuredCard,
  featuredFilm,
  featuredProject,
  scrollUntilShowing,
} from "./support/site";

const project = featuredProject();
const { walkthrough } = getProjectView(project);

/** "03/07 · Tittar på bönetiderna i vyn": the line under the film. */
const STEP_LINE = /^\d\d\/\d\d · \S/;

/** The film files the page has asked the server for. */
function filmDownloads(page: Page): string[] {
  const asked: string[] = [];
  page.on("request", (request) => {
    if (/\.(webm|mp4)(\?|$)/.test(request.url())) asked.push(request.url());
  });
  return asked;
}

test.describe("Utvalt projekt", () => {
  test("kortet visar projektet som datan pekar ut, med länkar till caset och sidan", async ({
    page,
  }) => {
    await page.goto("/");
    const card = featuredCard(page);

    await expect(
      card.getByRole("heading", { name: project.name }),
    ).toBeVisible();
    await expect(card.getByText(project.tagline)).toBeVisible();
    await expect(card.getByRole("link", { name: /Läs caset/ })).toHaveAttribute(
      "href",
      `/projects/${project.slug}/`,
    );
    await expect(
      card.getByRole("link", { name: /Besök sidan/ }),
    ).toHaveAttribute("href", project.siteUrl);
  });

  test("Läs caset öppnar projektets sida", async ({ page }) => {
    await page.goto("/");
    await featuredCard(page).getByRole("link", { name: /Läs caset/ }).click();
    await expect(page).toHaveURL(new RegExp(`/projects/${project.slug}/$`));
    await expect(
      page.getByRole("heading", { level: 1, name: project.name }),
    ).toBeVisible();
  });

  test("målningen bakom fönstret är målad när kortet syns", async ({ page }) => {
    await page.goto("/");
    const card = featuredCard(page);
    await card.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        card.locator("canvas").evaluate((canvas: HTMLCanvasElement) => {
          const pixel = canvas
            .getContext("2d")
            ?.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data;
          return pixel ? pixel[3] : 0;
        }),
      )
      .toBe(255);
  });
});

test.describe("Utvalt projekt med inspelad genomgång", () => {
  test.skip(!walkthrough, "det utvalda projektet har ingen genomgång");

  test("filmen spelas när den syns, med en rad som säger vad som händer", async ({
    page,
  }) => {
    await page.goto("/");
    const film = featuredFilm(page);
    await film.scrollIntoViewIfNeeded();

    await expectFilmPlaying(film);
    const steps = String(walkthrough!.steps.length).padStart(2, "0");
    await expect(featuredCard(page).getByText(STEP_LINE)).toHaveText(
      new RegExp(`^\\d\\d/${steps} · `),
    );
    await expect(featuredCard(page).getByText(STEP_LINE)).toBeVisible();
  });

  test("raden under filmen följer med till nästa steg", async ({ page }) => {
    const [first, second] = walkthrough!.steps;
    await page.goto("/");
    const film = featuredFilm(page);
    await film.scrollIntoViewIfNeeded();

    const line = featuredCard(page).getByText(STEP_LINE);
    await expect(line).toContainText(`01/`);
    await expect(line).toContainText(first.text);
    await expect(line).toContainText(second.text, {
      timeout: (second.at + 10) * 1000,
    });
    await expect(line).toContainText(`02/`);
  });

  test("filmen väntar tills en tredjedel syns och pausas utanför skärmen", async ({
    page,
  }) => {
    await page.goto("/");
    const film = featuredFilm(page);

    await scrollUntilShowing(page, film, 0.15);
    await expectFilmStill(film);

    await scrollUntilShowing(page, film, 0.5);
    await expectFilmPlaying(film);

    await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
    await expect(film).not.toBeInViewport();
    await expectFilmStill(film);

    await film.scrollIntoViewIfNeeded();
    await expectFilmPlaying(film);
  });

  test("filmen pausas när fliken är dold och fortsätter när den visas igen", async ({
    page,
  }) => {
    await page.goto("/");
    const film = featuredFilm(page);
    await film.scrollIntoViewIfNeeded();
    await expectFilmPlaying(film);

    // Playwright cannot put a tab in the background, so the page is told what
    // the browser tells it when the visitor switches tab.
    const showTab = (visible: boolean) =>
      page.evaluate((isVisible) => {
        Object.defineProperty(document, "hidden", {
          configurable: true,
          get: () => !isVisible,
        });
        Object.defineProperty(document, "visibilityState", {
          configurable: true,
          get: () => (isVisible ? "visible" : "hidden"),
        });
        document.dispatchEvent(new Event("visibilitychange"));
      }, visible);

    await showTab(false);
    await expectFilmStill(film);
    await showTab(true);
    await expectFilmPlaying(film);
  });

  test("filmen har inga kontroller och går inte att klicka på", async ({
    page,
  }) => {
    await page.goto("/");
    const film = featuredFilm(page);
    await film.scrollIntoViewIfNeeded();
    await expectFilmPlaying(film);

    await expect(film).not.toHaveAttribute("controls");
    const box = await film.boundingBox();
    if (!box) throw new Error("the film is not on the page");
    const centre = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    // The pointer never lands on the film: whatever is under it is something else.
    expect(
      await page.evaluate(
        ({ x, y }) => document.elementFromPoint(x, y)?.tagName,
        centre,
      ),
    ).not.toBe("VIDEO");
    await page.mouse.click(centre.x, centre.y);
    await page.mouse.click(centre.x, centre.y, { button: "right" });
    await expectFilmPlaying(film);
    await expect(page).toHaveURL(/\/$/);
  });

  test("med minskad rörelse visas bara stillbilden", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const downloads = filmDownloads(page);
    const poster = page.waitForResponse((response) =>
      response.url().includes(walkthrough!.poster),
    );
    await page.goto("/");
    const film = featuredFilm(page);
    await film.scrollIntoViewIfNeeded();

    expect((await poster).ok()).toBe(true);
    await expect(film).toBeVisible();
    await expectFilmStill(film);
    expect(await film.evaluate((v: HTMLVideoElement) => v.currentTime)).toBe(0);
    await expect(featuredCard(page).getByText(STEP_LINE)).toHaveCount(0);
    expect(downloads, "the film was fetched").toEqual([]);
  });

  test("när besökaren sparar data visas bara stillbilden", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(Navigator.prototype, "connection", {
        configurable: true,
        get: () => ({ saveData: true }),
      });
    });
    const downloads = filmDownloads(page);
    await page.goto("/");
    const film = featuredFilm(page);
    await film.scrollIntoViewIfNeeded();

    await expect(film).toBeVisible();
    await expectFilmStill(film);
    expect(await film.evaluate((v: HTMLVideoElement) => v.currentTime)).toBe(0);
    await expect(featuredCard(page).getByText(STEP_LINE)).toHaveCount(0);
    expect(downloads, "the film was fetched").toEqual([]);
  });

  test("filmen spelas också i Safari @webkit", async ({
    page,
    browserName,
  }) => {
    await page.goto("/");
    const film = featuredFilm(page);
    await film.scrollIntoViewIfNeeded();
    await expectFilmPlaying(film);
    if (browserName === "webkit") {
      // Safari gets the MP4 file.
      expect(
        await film.evaluate((video: HTMLVideoElement) => video.currentSrc),
      ).toContain(walkthrough!.mp4);
    }
    await expect(featuredCard(page).getByText(STEP_LINE)).toBeVisible();
  });
});

test.describe("Utvalt projekt utan genomgång", () => {
  test.skip(!!walkthrough, "det utvalda projektet har en genomgång");

  test("fönstret visar projektets skärmbild", async ({ page }) => {
    await page.goto("/");
    const card = featuredCard(page);
    await card.scrollIntoViewIfNeeded();

    const screenshot = card.getByRole("img", { name: project.imageAlt });
    await expect(screenshot).toBeVisible();
    expect(
      await screenshot.evaluate(
        (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
      ),
    ).toBe(true);
    await expect(card.locator("video")).toHaveCount(0);
  });
});
