import { expect, test, type Locator, type Page } from "@playwright/test";
import { keyRoutes, pointAndClick } from "./support/site";

const MENU_LINKS = ["Projekt", "Om mig", "Teknik", "Kontakt"];
const TOUCH_TARGET = 44;

const menu = (page: Page) =>
  page.getByRole("banner").getByRole("navigation", { name: "Huvudmeny" });

/** The section has been scrolled to: it starts right under the sticky menu. */
async function expectJustBelowMenu(page: Page, section: Locator) {
  await expect
    .poll(async () => {
      const bar = await page.getByRole("banner").boundingBox();
      const box = await section.boundingBox();
      if (!bar || !box) return "not on the page";
      const gap = box.y - (bar.y + bar.height);
      return gap >= -1 && gap <= 120 ? "just below the menu" : `gap ${gap}px`;
    })
    .toBe("just below the menu");
}

test.describe("Ramen runt varje sida", () => {
  for (const route of keyRoutes()) {
    test(`meny, innehåll och sidfot finns på ${route}`, async ({ page }) => {
      await page.goto(route);
      await expect(page.getByRole("banner")).toBeVisible();
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.getByRole("contentinfo")).toBeVisible();
    });
  }

  test("första tabbsteget hoppar till innehållet", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Hoppa till innehållet" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();

    await page.keyboard.press("Enter");
    await expect(page.getByRole("main")).toBeFocused();
  });
});

test.describe("Menyn på bred skärm", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("har länkar till projekt, om mig, teknik och kontakt", async ({
    page,
  }) => {
    await page.goto("/");
    for (const name of MENU_LINKS) {
      await expect(menu(page).getByRole("link", { name })).toBeVisible();
    }
  });

  test("ligger kvar överst när sidan skrollas", async ({ page }) => {
    await page.goto("/");
    await page.mouse.move(700, 450);
    for (let i = 0; i < 6; i++) await page.mouse.wheel(0, 400);

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1500);
    const bar = await page.getByRole("banner").boundingBox();
    expect(bar?.y).toBe(0);
    await expect(menu(page).getByRole("link", { name: "Kontakt" })).toBeInViewport();
  });

  test("en länk i menyn skrollar till sin del, under menyn", async ({
    page,
  }) => {
    await page.goto("/");
    await menu(page).getByRole("link", { name: "Kontakt" }).click();
    await expect(page).toHaveURL(/#kontakt$/);
    await expectJustBelowMenu(page, page.locator("#kontakt"));

    await pointAndClick(page, menu(page).getByRole("link", { name: "Projekt" }));
    await expect(page).toHaveURL(/#projekt$/);
    await expectJustBelowMenu(page, page.locator("#projekt"));
  });

  test("med minskad rörelse hoppar länken direkt till sin del", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await menu(page).getByRole("link", { name: "Kontakt" }).click();
    await expectJustBelowMenu(page, page.locator("#kontakt"));

    await pointAndClick(page, menu(page).getByRole("link", { name: "Om mig" }));
    await expectJustBelowMenu(page, page.locator("#om"));
  });

  test("en länk i menyn på en annan sida går till delen på startsidan", async ({
    page,
  }) => {
    await page.goto("/cv/");
    await menu(page).getByRole("link", { name: "Teknik" }).click();
    await expect(page).toHaveURL(/\/#teknik$/);
    await expectJustBelowMenu(page, page.locator("#teknik"));
  });

  test("en länk direkt till en del hamnar under menyn", async ({ page }) => {
    await page.goto("/#om");
    await expectJustBelowMenu(page, page.locator("#om"));
  });
});

test.describe("Menyn i mobil", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("öppnas med en knapp och har stora tryckytor", async ({ page }) => {
    await page.goto("/");
    await expect(menu(page)).toBeHidden();

    const open = page.getByRole("button", { name: "Öppna menyn" });
    const button = await open.boundingBox();
    expect(button?.width).toBeGreaterThanOrEqual(TOUCH_TARGET);
    expect(button?.height).toBeGreaterThanOrEqual(TOUCH_TARGET);
    await open.tap();

    for (const name of MENU_LINKS) {
      const link = menu(page).getByRole("link", { name });
      await expect(link).toBeVisible();
      const box = await link.boundingBox();
      expect(box?.height, name).toBeGreaterThanOrEqual(TOUCH_TARGET);
      expect(box?.width, name).toBeGreaterThanOrEqual(200);
    }

    const contact = page
      .getByRole("banner")
      .getByRole("link", { name: "Hör av dig" });
    expect((await contact.boundingBox())?.height).toBeGreaterThanOrEqual(
      TOUCH_TARGET,
    );
  });

  test("stängs när besökaren väljer en länk och skrollar dit", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Öppna menyn" }).tap();
    await menu(page).getByRole("link", { name: "Om mig" }).tap();

    await expect(menu(page)).toBeHidden();
    await expectJustBelowMenu(page, page.locator("#om"));
  });

  test("stängs med Escape och med knappen", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Öppna menyn" }).tap();
    await expect(menu(page)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu(page)).toBeHidden();

    await page.getByRole("button", { name: "Öppna menyn" }).tap();
    await page.getByRole("button", { name: "Stäng menyn" }).tap();
    await expect(menu(page)).toBeHidden();
  });

  test("temat går att byta i menyn", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await page.getByRole("button", { name: "Öppna menyn" }).tap();
    const dark = page.getByRole("banner").getByRole("button", { name: "Mörkt" });
    expect((await dark.boundingBox())?.height).toBeGreaterThanOrEqual(
      TOUCH_TARGET,
    );
    await dark.tap();
    await expect(dark).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("Sidfoten", () => {
  test("länkar till sidans delar, CV, alla case, LinkedIn, GitHub och e-post", async ({
    page,
  }) => {
    await page.goto("/cv/");
    const footer = page.getByRole("contentinfo");
    const links: [string, RegExp][] = [
      ["Projekt", /\/#projekt$/],
      ["Om mig", /\/#om$/],
      ["Teknik", /\/#teknik$/],
      ["Kontakt", /\/#kontakt$/],
      ["CV", /\/cv\/$/],
      ["Alla case", /\/projects\/$/],
      ["LinkedIn", /^https:\/\/www\.linkedin\.com\/in\/marcel-deluca$/],
      ["GitHub", /^https:\/\/github\.com\/DelucaGit$/],
      ["E-post", /^mailto:malakdeluca@gmail\.com$/],
    ];
    for (const [name, href] of links) {
      await expect(
        footer.getByRole("link", { name, exact: true }),
      ).toHaveAttribute("href", href);
    }
  });

  test("Alla case öppnar projektarkivet", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Alla case" })
      .click();
    await expect(page).toHaveURL(/\/projects\/$/);
  });

  for (const width of [390, 1440]) {
    test(`visar namnet som stor ordbild vid ${width} px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const word = page
        .getByRole("contentinfo")
        .getByText("Marcel Deluca", { exact: true });
      await word.scrollIntoViewIfNeeded();
      await expect(word).toBeVisible();
      const box = await word.boundingBox();
      // The name spans most of the page width
      expect(box?.width).toBeGreaterThan(width * 0.7);
    });
  }
});
