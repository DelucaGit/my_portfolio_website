import { expect, test, type Browser, type Page } from "@playwright/test";
import { readColour } from "./support/pixels";

const SENTENCE = "Jag bygger webbappar och hemsidor med React och Java.";

/** The hero is the part of the start page that carries the big sentence. */
const hero = (page: Page) => page.getByRole("region", { name: SENTENCE });

/**
 * The strip of the hero above its text. Only the ring is drawn there, so any
 * colour in it is the ring.
 */
async function aboveTheText(page: Page) {
  const box = await hero(page).boundingBox();
  if (!box) throw new Error("the hero is not on the page");
  return { x: box.x, y: box.y, width: box.width, height: box.height * 0.15 };
}

const ring = async (page: Page, browser: Browser) =>
  readColour(browser, page, await aboveTheText(page));

/** Coloured pixels above the text when the ring is clearly there. */
const RING_IS_THERE = 150;
const RING_IS_THERE_ON_A_PHONE = 40;

async function expectRingInTheMiddle(page: Page, browser: Browser) {
  const seen = await ring(page, browser);
  expect(seen.count, "coloured pixels above the text").toBeGreaterThan(
    RING_IS_THERE,
  );
  expect(seen.x).toBeGreaterThan(0.42);
  expect(seen.x).toBeLessThan(0.58);
}

async function expectHeroTextAndButtons(page: Page) {
  await expect(
    page.getByRole("heading", { level: 1, name: SENTENCE }),
  ).toBeVisible();
  await expect(hero(page).getByText("Öppen för jobb · Växjö")).toBeVisible();
  await expect(
    hero(page).getByText(
      "Jag söker en fast anställning där jag får växa i ett team.",
    ),
  ).toBeVisible();
  await expect(hero(page).getByRole("link", { name: "Läs CV" })).toBeVisible();
  await expect(
    hero(page).getByRole("link", { name: "Se projekten" }),
  ).toBeVisible();
}

/** A browser that cannot give the page a WebGL context. */
async function withoutWebGL(page: Page) {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...rest: unknown[]
    ) {
      if (type.includes("webgl")) return null;
      return (original as (...args: unknown[]) => unknown).call(
        this,
        type,
        ...rest,
      );
    } as typeof original;
  });
}

/** Two pictures of the hero, a moment apart, are exactly the same. */
async function expectHeroToStandStill(page: Page) {
  await page.waitForTimeout(1200);
  const first = await hero(page).screenshot({ animations: "allow" });
  await page.waitForTimeout(700);
  const second = await hero(page).screenshot({ animations: "allow" });
  expect(first.equals(second), "the hero changed between two pictures").toBe(
    true,
  );
}

async function pointAt(page: Page, across: number) {
  const box = await hero(page).boundingBox();
  if (!box) throw new Error("the hero is not on the page");
  await page.mouse.move(box.x + box.width * across, box.y + box.height * 0.5, {
    steps: 8,
  });
}

test.describe("Heron på startsidan", () => {
  test("säger vem Marcel är och har knapparna Läs CV och Se projekten @webkit", async ({
    page,
  }) => {
    await page.goto("/");
    await expectHeroTextAndButtons(page);
  });

  test("Läs CV går till CV-sidan", async ({ page }) => {
    await page.goto("/");
    await hero(page).getByRole("link", { name: "Läs CV" }).click();
    await expect(page).toHaveURL(/\/cv\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("Se projekten skrollar ner till projekten", async ({ page }) => {
    await page.goto("/");
    await hero(page).getByRole("link", { name: "Se projekten" }).click();
    await expect(page).toHaveURL(/#projekt$/);
    await expect
      .poll(async () => {
        const box = await page.locator("#projekt").boundingBox();
        return box ? Math.round(box.y) : Infinity;
      })
      .toBeLessThan(200);
  });

  test("har inga block för tjänster, omdömen eller bokning", async ({
    page,
  }) => {
    await page.goto("/");
    const main = page.getByRole("main");
    await expect(main.getByRole("link", { name: /boka/i })).toHaveCount(0);
    await expect(main.getByRole("heading", { name: /tjänster/i })).toHaveCount(
      0,
    );
    await expect(main.getByRole("heading", { name: /omdömen/i })).toHaveCount(
      0,
    );
  });
});

test.describe("Heron utan JavaScript", () => {
  test.use({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });

  test("visar texten, knapparna och en stilla ring", async ({
    page,
    browser,
  }) => {
    await page.goto("/");
    await expectHeroTextAndButtons(page);
    await expectRingInTheMiddle(page, browser);
  });

  test("knapparna är vanliga länkar som fungerar", async ({ page }) => {
    await page.goto("/");
    await expect(
      hero(page).getByRole("link", { name: "Se projekten" }),
    ).toHaveAttribute("href", "/#projekt");
    await hero(page).getByRole("link", { name: "Läs CV" }).click();
    await expect(page).toHaveURL(/\/cv\/$/);
  });
});

test.describe("Ringen i heron", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("följer pekaren", async ({ page, browser }) => {
    await page.goto("/");

    await pointAt(page, 0.2);
    await expect
      .poll(async () => (await ring(page, browser)).x, { timeout: 15_000 })
      .toBeLessThan(0.44);

    await pointAt(page, 0.8);
    await expect
      .poll(async () => (await ring(page, browser)).x, { timeout: 15_000 })
      .toBeGreaterThan(0.6);
  });

  test("står still med minskad rörelse och följer inte pekaren", async ({
    page,
    browser,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expectHeroTextAndButtons(page);
    await expectRingInTheMiddle(page, browser);

    await pointAt(page, 0.2);
    await expectHeroToStandStill(page);
    await expectRingInTheMiddle(page, browser);
  });

  test("utan WebGL visas en hel hero med en stilla ring @webkit", async ({
    page,
    browser,
  }) => {
    await withoutWebGL(page);
    await page.goto("/");
    await expectHeroTextAndButtons(page);
    await pointAt(page, 0.2);
    await expectHeroToStandStill(page);
    await expectRingInTheMiddle(page, browser);
  });

  test("utan WebGL och med minskad rörelse visas samma hela hero", async ({
    page,
    browser,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await withoutWebGL(page);
    await page.goto("/");
    await expectHeroTextAndButtons(page);
    await expectHeroToStandStill(page);
    await expectRingInTheMiddle(page, browser);
  });
});

test.describe("Ringen i mobil", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("syns och rör sig av sig själv utan pekare", async ({
    page,
    browser,
  }) => {
    await page.goto("/");
    await expectHeroTextAndButtons(page);
    await expect
      .poll(async () => (await ring(page, browser)).count)
      .toBeGreaterThan(RING_IS_THERE_ON_A_PHONE);

    const first = await hero(page).screenshot({ animations: "allow" });
    await expect
      .poll(async () =>
        first.equals(await hero(page).screenshot({ animations: "allow" })),
      )
      .toBe(false);
  });

  test("utan WebGL visas en stilla ring", async ({ page, browser }) => {
    await withoutWebGL(page);
    await page.goto("/");
    await expectHeroTextAndButtons(page);
    await expectHeroToStandStill(page);
    expect((await ring(page, browser)).count).toBeGreaterThan(
      RING_IS_THERE_ON_A_PHONE,
    );
  });
});
