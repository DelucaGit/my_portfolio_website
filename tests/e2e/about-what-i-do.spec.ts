import { expect, test, type Locator, type Page } from "@playwright/test";
import { expectReadableText } from "./support/readable";
import {
  chooseTheme,
  expectNoSidewaysScroll,
  expectTheme,
  featuredProject,
  returningVisitor,
  scrollUntilShowing,
  THEMES,
  WIDTHS,
} from "./support/site";

/** Om mig and Vad jag gör on the start page (#59). */

const project = featuredProject();

const about = (page: Page) => page.getByRole("region", { name: "Om mig" });

/** The two paragraphs, as a visitor reads them. */
const ABOUT_TEXT = [
  `Hej, jag är Marcel. Jag bygger hemsidor, webbappar och egna produkter, bland annat ${project.name}.`,
  "Just nu studerar jag Java med cloud på JENSEN yrkeshögskola. Jag vill jobba i ett team där jag får koda, lära mig mer och ta ansvar.",
];

const firstWord = (page: Page) => about(page).getByText("Hej,", { exact: true });
const lastWord = (page: Page) =>
  about(page).getByText("ansvar.", { exact: true });

/** The colour the text is painted in right now. */
const colourOf = (word: Locator) =>
  word.evaluate((element) => getComputedStyle(element).color);

/** The colour of text that is filled in: the page's own text colour. */
const inkColour = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.body).color);

async function expectWholeTextFilledIn(page: Page) {
  for (const paragraph of ABOUT_TEXT) {
    await expect(about(page).getByText(paragraph)).toBeVisible();
  }
  const ink = await inkColour(page);
  expect(await colourOf(firstWord(page))).toBe(ink);
  expect(await colourOf(lastWord(page))).toBe(ink);
}

test.describe("Om mig", () => {
  test("ligger på #om och nämner och länkar till det utvalda projektet", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("#om")).toHaveAccessibleName("Om mig");
    for (const paragraph of ABOUT_TEXT) {
      await expect(about(page).getByText(paragraph)).toBeVisible();
    }

    const link = about(page).getByRole("link", { name: project.name });
    await expect(link).toHaveAttribute("href", `/projects/${project.slug}/`);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`/projects/${project.slug}/$`));
    await expect(
      page.getByRole("heading", { level: 1, name: project.name }),
    ).toBeVisible();
  });

  test("hela texten syns direkt utan JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");

    await expectWholeTextFilledIn(page);
    await expect(
      about(page).getByRole("link", { name: project.name }),
    ).toHaveAttribute("href", `/projects/${project.slug}/`);
    await context.close();
  });

  test("hela texten syns direkt med minskad rörelse", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    // The page has come alive: the theme buttons only answer once it has
    await chooseTheme(page, "light");

    await expectWholeTextFilledIn(page);
    // Also while the text is only just coming up from the bottom edge
    await scrollUntilShowing(page, about(page), 0.1);
    await page.waitForTimeout(500);
    await expectWholeTextFilledIn(page);
  });

  test("texten fylls i ord för ord när man skrollar", async ({ page }) => {
    await page.goto("/");
    const ink = await inkColour(page);
    const text = about(page).getByText(ABOUT_TEXT[0]);

    // The text is only just coming up: nothing is filled in yet
    await scrollUntilShowing(page, text, 0.05);
    await expect.poll(() => colourOf(firstWord(page))).not.toBe(ink);
    expect(await colourOf(lastWord(page))).not.toBe(ink);

    // The visitor scrolls on with the wheel: the beginning fills in first
    await expect(async () => {
      await page.mouse.wheel(0, 60);
      expect(await colourOf(firstWord(page))).toBe(ink);
    }).toPass({ intervals: [100] });
    expect(await colourOf(lastWord(page))).not.toBe(ink);

    // … and further on the whole text is filled in, while it is still on screen
    await expect(async () => {
      await page.mouse.wheel(0, 60);
      expect(await colourOf(lastWord(page))).toBe(ink);
    }).toPass({ intervals: [100] });
    expect(await colourOf(firstWord(page))).toBe(ink);
    await expect(firstWord(page)).toBeInViewport();
    await expect(lastWord(page)).toBeInViewport();

    // Scrolling back empties it again
    await expect(async () => {
      await page.mouse.wheel(0, -60);
      expect(await colourOf(lastWord(page))).not.toBe(ink);
    }).toPass({ intervals: [100] });
    expect(await colourOf(firstWord(page))).toBe(ink);
    await expect(async () => {
      await page.mouse.wheel(0, -60);
      expect(await colourOf(firstWord(page))).not.toBe(ink);
    }).toPass({ intervals: [100] });
  });
});

const whatIDo = (page: Page) =>
  page.getByRole("region", { name: "Vad jag gör" });
const card = (page: Page, name: string) =>
  whatIDo(page).getByRole("article", { name });

test.describe("Vad jag gör", () => {
  test("har tre kort: hemsidor åt kunder, egna produkter, backend och cloud", async ({
    page,
  }) => {
    await page.goto("/");
    const cards = whatIDo(page).getByRole("article");
    await expect(cards).toHaveCount(3);
    await expect(cards.nth(0)).toHaveAccessibleName("Hemsidor åt kunder");
    await expect(cards.nth(1)).toHaveAccessibleName("Egna produkter");
    await expect(cards.nth(2)).toHaveAccessibleName("Backend och cloud");

    await expect(
      card(page, "Hemsidor åt kunder").getByRole("link", {
        name: "Se FC Växjö Reborn",
      }),
    ).toHaveAttribute("href", "/projects/fcvaxjo-reborn/");
    await expect(
      card(page, "Backend och cloud").getByRole("link", {
        name: "Läs hela CV:t",
      }),
    ).toHaveAttribute("href", "/cv/");
    await expect(
      card(page, "Backend och cloud").getByRole("img", {
        name: /Spring Boot-kontroller/,
      }),
    ).toBeVisible();
  });

  test("kortet Egna produkter visar och länkar till det utvalda projektet", async ({
    page,
  }) => {
    await page.goto("/");
    const products = card(page, "Egna produkter");
    await products.scrollIntoViewIfNeeded();

    await expect(
      products.getByText(`till exempel ${project.name}`),
    ).toBeVisible();
    const screenshot = products.getByRole("img", { name: project.imageAlt });
    await expect(screenshot).toBeVisible();
    await expect
      .poll(() =>
        screenshot.evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
        ),
      )
      .toBe(true);

    const link = products.getByRole("link", { name: `Se ${project.name}` });
    await expect(link).toHaveAttribute("href", `/projects/${project.slug}/`);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`/projects/${project.slug}/$`));
    await expect(
      page.getByRole("heading", { level: 1, name: project.name }),
    ).toBeVisible();
  });
});

test("startsidans delar kommer i rätt ordning", async ({ page }) => {
  await page.goto("/");
  const top = async (section: Locator) =>
    (await section.evaluate(
      (element) => element.getBoundingClientRect().top + window.scrollY,
    )) as number;
  const order = [
    page.locator("#projekt"),
    about(page),
    whatIDo(page),
    page.getByRole("region", { name: "Vilka språk jag kan" }),
    page.getByRole("region", { name: "Vägen hit" }),
    page.getByRole("region", { name: "Ska vi höras?" }),
  ];
  const tops = await Promise.all(order.map(top));
  expect(tops).toEqual([...tops].sort((a, b) => a - b));
  expect(new Set(tops).size).toBe(tops.length);
});

for (const theme of THEMES) {
  test(`Om mig och Vad jag gör håller i alla bredder, ${theme === "light" ? "ljust" : "mörkt"} tema`, async ({
    page,
  }) => {
    await returningVisitor(page, { chose: theme });
    await page.setViewportSize({ width: WIDTHS[0], height: 900 });
    await page.goto("/");
    await expectTheme(page, theme);

    for (const width of WIDTHS) {
      await test.step(`${width} px`, async () => {
        await page.setViewportSize({ width, height: 900 });
        await expectNoSidewaysScroll(page);

        for (const section of [about(page), whatIDo(page)]) {
          const box = await section.boundingBox();
          expect(box!.x).toBeGreaterThanOrEqual(0);
          expect(box!.x + box!.width).toBeLessThanOrEqual(width);
        }
        for (const link of await whatIDo(page).getByRole("link").all()) {
          await link.scrollIntoViewIfNeeded();
          await expect(link).toBeVisible();
          const box = await link.boundingBox();
          expect(box!.x).toBeGreaterThanOrEqual(0);
          expect(box!.x + box!.width).toBeLessThanOrEqual(width);
          expect(box!.height).toBeGreaterThanOrEqual(44);
        }
      });
    }

    // The card texts can be read against the cards
    for (const text of await whatIDo(page).getByRole("paragraph").all()) {
      await expectReadableText(text);
    }
  });
}
