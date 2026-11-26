import { existsSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { expect, type Locator, type Page } from "@playwright/test";
import {
  getAllProjects,
  getFeaturedProject,
  getHomeProjects,
  type Project,
} from "@/lib/projects";

/**
 * Shared helpers for every Playwright suite. Later tickets extend this file:
 * add widths, routes or visitor actions here instead of in each spec.
 */

/** The widths the design must hold at (PRD #52). */
export const WIDTHS = [390, 768, 1024, 1440, 1920] as const;

export type Theme = "light" | "dark";
export type ThemeChoice = Theme | "system";
export const THEMES: readonly Theme[] = ["light", "dark"];

/** The page colour a visitor sees in each theme (`--bg` in the design). */
export const PAGE_COLOUR: Record<Theme, string> = {
  light: "rgb(247, 246, 242)",
  dark: "rgb(20, 19, 16)",
};

/** The switcher's button names, as a visitor reads them. */
export const THEME_BUTTON: Record<ThemeChoice, string> = {
  system: "Följ systemet",
  light: "Ljust",
  dark: "Mörkt",
};

/** Where the visitor's theme choice is remembered on the device. */
const THEME_STORAGE_KEY = "tyngdlos-tema";

const OUT_DIR = join(process.cwd(), "out");

/**
 * Every page in the built site, read from `out/` ("/", "/cv/", "/projects/x/" …).
 * New pages are picked up without touching the tests.
 */
export function allRoutes(): string[] {
  if (!existsSync(OUT_DIR)) {
    throw new Error(
      "out/ is missing. Run `npm run build` (or `npm run test:e2e`) first.",
    );
  }
  const routes: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith("_")) continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name === "index.html") {
        const rel = relative(OUT_DIR, dir).split(sep).join("/");
        routes.push(rel ? `/${rel}/` : "/");
      }
    }
  };
  walk(OUT_DIR);
  return routes.filter((route) => route !== "/404/").sort();
}

/** One page of each kind: home, CV, project archive, a project and a service. */
export function keyRoutes(): string[] {
  const routes = allRoutes();
  const firstUnder = (prefix: string) =>
    routes.find((route) => route.startsWith(prefix) && route !== prefix);
  return [
    "/",
    "/cv/",
    "/projects/",
    firstUnder("/projects/"),
    firstUnder("/services/"),
  ].filter((route): route is string => Boolean(route));
}

/**
 * The featured project, read from the data layer the same way the site reads
 * it. Change `featuredProject` in src/data/site.ts and the tests follow.
 */
export function featuredProject(): Project {
  return getFeaturedProject();
}

/** The card for the featured project at the top of the project section. */
export function featuredCard(page: Page): Locator {
  return page
    .locator("#projekt")
    .getByRole("article", { name: featuredProject().name })
    .filter({ hasText: "Utvalt" });
}

/** The recorded walkthrough in the featured card's browser window. */
export function featuredFilm(page: Page): Locator {
  return featuredCard(page).getByRole("img", { name: /^Inspelad genomgång/ });
}

const filmTime = (film: Locator) =>
  film.evaluate((video: HTMLVideoElement) => video.currentTime);

/** The film is moving: its picture is further along a moment later. */
export async function expectFilmPlaying(film: Locator) {
  const before = await filmTime(film);
  await expect
    .poll(() => filmTime(film), { timeout: 15_000 })
    .toBeGreaterThan(before);
}

/** The film stands still: it has stopped and stays where it is. */
export async function expectFilmStill(film: Locator) {
  await expect
    .poll(() => film.evaluate((video: HTMLVideoElement) => video.paused))
    .toBe(true);
  const before = await filmTime(film);
  await film.page().waitForTimeout(600);
  expect(await filmTime(film)).toBe(before);
}

/**
 * The visitor scrolls until `share` (0 to 1) of the element's height has come
 * up over the bottom edge of the window.
 */
export async function scrollUntilShowing(
  page: Page,
  target: Locator,
  share: number,
) {
  await target.evaluate((element, wanted) => {
    const box = element.getBoundingClientRect();
    const top = box.top + window.scrollY;
    window.scrollTo(0, top - window.innerHeight + box.height * wanted);
  }, share);
  const viewport = page.viewportSize();
  if (!viewport) throw new Error("scrollUntilShowing: no viewport");
  await expect
    .poll(async () => {
      const box = await target.boundingBox();
      return box ? Math.round((viewport.height - box.y) / box.height / 0.05) : -1;
    })
    .toBe(Math.round(share / 0.05));
}

// ── The split view (project names + preview window) ──

/** The width the split view starts at; below it the projects are rows. */
export const SPLIT_FROM = 1024;

/**
 * The projects under the featured one on the start page, read from the data
 * layer the same way the site reads them.
 */
export function homeProjects(): Project[] {
  return getHomeProjects();
}

/** The name of the split view's list in the project archive (/projects/). */
export const ARCHIVE_LIST = "Alla projekt";

/**
 * Every project, in the order the archive lists them, read from the data
 * layer the same way the site reads them.
 */
export function allProjects(): Project[] {
  return getAllProjects();
}

/** A split view's list of projects. On the start page it is called "Fler projekt". */
export function projectList(page: Page, name = "Fler projekt"): Locator {
  return page.getByRole("list", { name, exact: true });
}

/** The links in a split view's list, one per project, in order. */
export function projectLinks(page: Page, name?: string): Locator {
  return projectList(page, name).getByRole("link");
}

/** The split view's preview window (only there from SPLIT_FROM). */
export function previewWindow(page: Page): Locator {
  return page.getByRole("complementary", {
    name: "Förhandsvisning av valt projekt",
  });
}

const READ_CASE = "Läs caset: ";

/**
 * The name of the project the preview window shows right now, read from its
 * "Läs caset: …" button.
 */
export async function previewedProject(page: Page): Promise<string> {
  const name = await previewWindow(page)
    .getByRole("link", { name: new RegExp(`^${READ_CASE}`) })
    .getAttribute("aria-label");
  return (name ?? "").slice(READ_CASE.length);
}

/**
 * The preview window shows this project: its buttons are about it, its
 * screenshot is on screen and its name is the marked one in the list.
 */
export async function expectPreviewing(
  page: Page,
  project: Project,
  listName?: string,
) {
  const pane = previewWindow(page);
  await expect(
    pane.getByRole("link", { name: READ_CASE + project.name, exact: true }),
  ).toBeVisible();
  await expect(
    pane.getByRole("img", { name: `Skärmbild av ${project.name}`, exact: true }),
  ).toBeVisible();
  await expect(
    projectList(page, listName).locator('[aria-current="true"]'),
  ).toContainText(project.name);
}

/** The page has stopped moving (the smooth scroll has caught up). */
export async function scrollSettled(page: Page) {
  let last = -1;
  await expect
    .poll(
      async () => {
        const now = await page.evaluate(() => window.scrollY);
        const still = now === last;
        last = now;
        return still;
      },
      { intervals: [150] },
    )
    .toBe(true);
}

/**
 * The visitor turns the mouse wheel, a notch at a time, until `done` says
 * stop. A negative `step` scrolls up.
 */
export async function wheelUntil(
  page: Page,
  done: () => Promise<boolean>,
  { step = 70, pause = 100, notches = 400 } = {},
) {
  for (let n = 0; n < notches; n++) {
    if (await done()) return;
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(pause);
  }
  throw new Error("wheelUntil: turned the wheel to the end without getting there");
}

/**
 * The visitor scrolls down with quick turns of the wheel until the split
 * view's list has come up into the window.
 */
export async function wheelToProjectList(page: Page, listName?: string) {
  const first = projectLinks(page, listName).first();
  const height = page.viewportSize()?.height ?? 0;
  await wheelUntil(
    page,
    async () => ((await first.boundingBox())?.y ?? Infinity) < height * 0.9,
    { step: 250, pause: 120 },
  );
  await scrollSettled(page);
}

/** The visitor scrolls with the wheel until the preview window shows the project. */
export async function wheelToProject(
  page: Page,
  project: Project,
  { gently = false } = {},
) {
  if ((await previewedProject(page)) !== project.name) {
    await wheelToProjectList(page);
  }
  // The page glides on a little after the wheel stops; `gently` keeps that short.
  await wheelUntil(
    page,
    async () => (await previewedProject(page)) === project.name,
    gently ? { step: 30 } : undefined,
  );
  await scrollSettled(page);
}

/** The visitor picks a theme with the switcher in the footer. */
export async function chooseTheme(page: Page, choice: ThemeChoice) {
  const button = page
    .getByRole("contentinfo")
    .getByRole("group", { name: "Tema" })
    .getByRole("button", { name: THEME_BUTTON[choice] });
  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "true");
}

/**
 * A returning visitor: the theme was chosen on an earlier visit, and the
 * device itself is set to `system`. Call before `page.goto`.
 */
export async function returningVisitor(
  page: Page,
  { chose, system = chose }: { chose: Theme; system?: Theme },
) {
  await page.emulateMedia({ colorScheme: system });
  await page.addInitScript(
    ([key, value]) => {
      try {
        window.localStorage.setItem(key, value);
      } catch {}
    },
    [THEME_STORAGE_KEY, chose] as const,
  );
}

/** The colour behind the page content, as painted right now. */
export async function pageColour(page: Page): Promise<string> {
  return page.evaluate(() => getComputedStyle(document.body).backgroundColor);
}

export async function expectTheme(page: Page, theme: Theme) {
  await expect.poll(() => pageColour(page)).toBe(PAGE_COLOUR[theme]);
}

/** Nothing sticks out sideways and the page cannot be scrolled sideways. */
export async function expectNoSidewaysScroll(page: Page) {
  const result = await page.evaluate(() => {
    const root = document.documentElement;
    window.scrollTo(200, window.scrollY);
    const moved = window.scrollX;
    window.scrollTo(0, window.scrollY);
    return {
      contentWidth: root.scrollWidth,
      windowWidth: root.clientWidth,
      moved,
    };
  });
  expect(
    result.contentWidth,
    "content is wider than the window",
  ).toBeLessThanOrEqual(result.windowWidth);
  expect(result.moved, "the page scrolled sideways").toBe(0);
}

/**
 * Click the way a visitor does: move the pointer to the element and press.
 * Use this for anything inside the sticky menu (or other sticky parts) when
 * the page is scrolled. `locator.click()` first asks the browser to scroll
 * the element into view, which moves the page under a sticky element and
 * makes the smooth scroll start from the wrong place.
 */
export async function pointAndClick(page: Page, target: Locator) {
  const box = await target.boundingBox();
  if (!box) throw new Error("pointAndClick: the element is not on the page");
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}
