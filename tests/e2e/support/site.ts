import { existsSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { expect, type Locator, type Page } from "@playwright/test";
import { getFeaturedProject, type Project } from "@/lib/projects";

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
