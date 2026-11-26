import { expect, test, type Page } from "@playwright/test";
import { expectReadableText } from "./support/readable";
import {
  THEMES,
  WIDTHS,
  allProjects,
  expectNoSidewaysScroll,
  expectTheme,
  returningVisitor,
} from "./support/site";

const SITE = "https://marceldeluca.se";
const projects = allProjects();
const pageOf = (slug: string) => `/projects/${slug}/`;

const escaped = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The links to the projects before and after, at the foot of a project page. */
const adjacent = (page: Page) =>
  page.getByRole("navigation", { name: "Fler projekt" });

/** What a crawler or a share preview reads in the page's head. */
const head = (page: Page) => ({
  description: page.locator('head meta[name="description"]'),
  canonical: page.locator('head link[rel="canonical"]'),
  og: (name: string) => page.locator(`head meta[property="og:${name}"]`),
  twitter: (name: string) => page.locator(`head meta[name="twitter:${name}"]`),
});

test.describe("Projektsidorna", () => {
  for (const theme of THEMES) {
    test.describe(`${theme === "light" ? "ljust" : "mörkt"} tema`, () => {
      for (const project of projects) {
        test(`${project.name}: innehållet syns och går att läsa, alla bredder`, async ({
          page,
        }) => {
          const { detail } = project;
          await returningVisitor(page, { chose: theme });
          await page.setViewportSize({ width: WIDTHS[0], height: 900 });
          await page.goto(pageOf(project.slug));
          await expectTheme(page, theme);

          const main = page.getByRole("main");
          for (const width of WIDTHS) {
            await test.step(`${width} px`, async () => {
              await page.setViewportSize({ width, height: 900 });

              await expect(page.getByRole("banner")).toBeVisible();
              await expect(page.getByRole("contentinfo")).toBeVisible();
              await expect(
                main.getByRole("heading", {
                  level: 1,
                  name: project.name,
                  exact: true,
                }),
              ).toBeVisible();
              await expect(
                main.getByText(project.tagline, { exact: true }).first(),
              ).toBeVisible();
              await expect(
                main.getByText(detail.overview[0], { exact: true }).first(),
              ).toBeVisible();
              await expect(
                main.getByRole("img", { name: detail.media.hero.alt, exact: true }).first(),
              ).toBeVisible();

              const stack = main.getByRole("region", {
                name: "Det här använde jag",
              });
              for (const item of project.stack) {
                await expect(
                  stack.getByText(item, { exact: true }),
                ).toBeVisible();
              }

              const texts = [
                ...(detail.challenge ?? []),
                ...(detail.solution ?? []),
                ...(detail.results ?? []),
              ];
              for (const text of texts) {
                await expect(
                  main.getByText(text, { exact: true }).first(),
                ).toBeVisible();
              }
              for (const image of [
                ...detail.media.mobile,
                ...(detail.media.gallery ?? []),
              ]) {
                await expect(
                  main.getByRole("img", { name: image.alt, exact: true }).first(),
                ).toBeVisible();
              }

              await expect(adjacent(page)).toBeVisible();
              await expect(
                main.getByRole("heading", { name: "Vill du prata mer?" }),
              ).toBeVisible();

              await expectNoSidewaysScroll(page);
              await expectReadableText(main);
            });
          }
        });
      }
    });
  }

  test("ett case har sina delar: rubriker, texter och teknik (UniClean Partners)", async ({
    page,
  }) => {
    await page.goto(pageOf("uniclean-partners"));
    const main = page.getByRole("main");

    await expect(
      main.getByRole("heading", { level: 1, name: "UniClean Partners" }),
    ).toBeVisible();
    await expect(
      main.getByText(
        "Ny hemsida för UniClean som vägleder kunder och städare till den nya appen.",
      ),
    ).toBeVisible();
    for (const name of [
      "Det här använde jag",
      "Utmaning & lösning",
      "Utmaningen",
      "Lösningen",
      "Vad det ledde till",
    ]) {
      await expect(main.getByRole("heading", { name, exact: true })).toBeVisible();
    }
    await expect(
      main.getByText("UniCleans förra hemsida var byggd för att ta emot offertförfrågningar."),
    ).toBeVisible();
    await expect(
      main.getByText("Kunder och städare går från hemsidan direkt till appen."),
    ).toBeVisible();
    const stack = main.getByRole("region", { name: "Det här använde jag" });
    await expect(stack.getByRole("listitem")).toHaveText([
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Hostinger",
    ]);
    await expect(
      main.getByRole("link", { name: "malakdeluca@gmail.com" }),
    ).toHaveAttribute("href", "mailto:malakdeluca@gmail.com");
    await expect(main.getByRole("link", { name: "Läs CV" })).toHaveAttribute(
      "href",
      "/cv/",
    );
  });

  test("knapparna till hemsidan och koden finns bara när projektet har dem", async ({
    page,
  }) => {
    const main = page.getByRole("main");

    // Live site and code
    await page.goto(pageOf("uniclean-partners"));
    const visit = main.getByRole("link", { name: "Besök sidan: UniClean Partners" });
    await expect(visit).toHaveAttribute("href", "https://uniclean.nu");
    await expect(visit).toHaveAttribute("target", "_blank");
    const code = main.getByRole("link", { name: "Kod på GitHub: UniClean Partners" });
    await expect(code).toHaveAttribute(
      "href",
      "https://github.com/DelucaGit/UniClean-Website",
    );
    await expect(code).toHaveAttribute("target", "_blank");

    // Code but no live site
    await page.goto(pageOf("sabaah-al-wuruud"));
    await expect(main.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(main.getByRole("link", { name: /^Besök sidan/ })).toHaveCount(0);
    await expect(main.getByRole("link", { name: /^Kod på GitHub/ })).toHaveCount(1);

    // Neither
    await page.goto(pageOf("alkama"));
    await expect(main.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(main.getByRole("link", { name: /^Besök sidan/ })).toHaveCount(0);
    await expect(main.getByRole("link", { name: /^Kod på GitHub/ })).toHaveCount(0);
  });

  test("varje projekt med hemsida har knappen dit, och inget annat projekt har den", async ({
    page,
  }) => {
    for (const project of projects) {
      await page.goto(pageOf(project.slug));
      const visit = page
        .getByRole("main")
        .getByRole("link", { name: `Besök sidan: ${project.name}`, exact: true });
      if (project.siteUrl) {
        await expect(visit).toHaveAttribute("href", project.siteUrl);
      } else {
        await expect(
          page.getByRole("main").getByRole("heading", { level: 1 }),
        ).toBeVisible();
        await expect(visit).toHaveCount(0);
      }
    }
  });

  test("bilden av hela sidan går att skrolla inne i sitt fönster (TakKoll)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(pageOf("takkoll"));
    const main = page.getByRole("main");
    await expect(
      main.getByRole("heading", { name: "Scrolla igenom hela berättelsen." }),
    ).toBeVisible();

    const picture = main.getByRole("img", {
      name: projects.find((project) => project.slug === "takkoll")!.detail.media
        .fullPage!.alt,
      exact: true,
    });
    await picture.scrollIntoViewIfNeeded();
    const before = await picture.boundingBox();
    const pageBefore = await page.evaluate(() => window.scrollY);

    // The pointer is over the picture and the visitor turns the wheel
    await page.mouse.move(before!.x + 200, Math.max(before!.y, 0) + 150);
    for (let notch = 0; notch < 5; notch++) {
      await page.mouse.wheel(0, 100);
      await page.waitForTimeout(100);
    }

    await expect
      .poll(async () => (await picture.boundingBox())!.y)
      .toBeLessThan(before!.y - 300);
    expect(await page.evaluate(() => window.scrollY)).toBe(pageBefore);
  });

  test("länken tillbaka går till projektarkivet", async ({ page }) => {
    await page.goto(pageOf(projects[3].slug));
    await page
      .getByRole("main")
      .getByRole("link", { name: "Alla projekt", exact: true })
      .click();
    await expect(page).toHaveURL(/\/projects\/$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Alla projekt" }),
    ).toBeVisible();
  });
});

test.describe("Föregående och nästa projekt", () => {
  test("ordningen är arkivets: nyast först", () => {
    const years = projects.map((project) => project.year);
    expect(years).toEqual([...years].sort((a, b) => b - a));
  });

  test("varje projektsida länkar till projektet före och efter", async ({
    page,
  }) => {
    for (const [index, project] of projects.entries()) {
      await page.goto(pageOf(project.slug));
      const nav = adjacent(page);
      const previous = nav.getByRole("link", { name: /^Föregående projekt/ });
      const next = nav.getByRole("link", { name: /^Nästa projekt/ });

      if (index === 0) {
        await expect(nav).toBeVisible();
        await expect(previous).toHaveCount(0);
      } else {
        const before = projects[index - 1];
        await expect(previous).toHaveAccessibleName(
          new RegExp(`^Föregående projekt:?\\s+${escaped(before.name)}`),
        );
        await expect(previous).toHaveAttribute("href", pageOf(before.slug));
      }

      if (index === projects.length - 1) {
        await expect(next).toHaveCount(0);
        await expect(
          nav.getByRole("link", { name: /Se alla projekt/ }),
        ).toHaveAttribute("href", "/projects/");
      } else {
        const after = projects[index + 1];
        await expect(next).toHaveAccessibleName(
          new RegExp(`^Nästa projekt:?\\s+${escaped(after.name)}`),
        );
        await expect(next).toHaveAttribute("href", pageOf(after.slug));
      }
    }
  });

  test("nästa och föregående leder fram och tillbaka mellan två projekt", async ({
    page,
  }) => {
    const [first, second] = projects;
    await page.goto(pageOf(first.slug));

    await adjacent(page).getByRole("link", { name: /^Nästa projekt/ }).click();
    await expect(page).toHaveURL(new RegExp(`${pageOf(second.slug)}$`));
    await expect(
      page.getByRole("heading", { level: 1, name: second.name, exact: true }),
    ).toBeVisible();

    await adjacent(page)
      .getByRole("link", { name: /^Föregående projekt/ })
      .click();
    await expect(page).toHaveURL(new RegExp(`${pageOf(first.slug)}$`));
    await expect(
      page.getByRole("heading", { level: 1, name: first.name, exact: true }),
    ).toBeVisible();
  });
});

test.describe("Projektsidornas metadata", () => {
  test("ett case har titel, beskrivning, kanonisk adress och delningsbild (UniClean Partners)", async ({
    page,
  }) => {
    await page.goto(pageOf("uniclean-partners"));
    const meta = head(page);
    const title = "UniClean Partners. Ny hemsida i Next.js";
    const description =
      "Case: UniClean Partners. Ny hemsida i Next.js som vägleder kunder och städare till UniCleans nya app.";
    const address = `${SITE}/projects/uniclean-partners/`;
    const image = `${SITE}/projects/uniclean-partners/studio-hero.webp`;

    await expect(page).toHaveTitle(`${title} | Marcel Deluca`);
    await expect(meta.description).toHaveAttribute("content", description);
    await expect(meta.canonical).toHaveAttribute("href", address);
    await expect(meta.og("title")).toHaveAttribute("content", title);
    await expect(meta.og("description")).toHaveAttribute("content", description);
    await expect(meta.og("url")).toHaveAttribute("content", address);
    await expect(meta.og("type")).toHaveAttribute("content", "article");
    await expect(meta.og("image")).toHaveAttribute("content", image);
    await expect(meta.og("image:alt")).toHaveAttribute(
      "content",
      "UniCleans nya startsida i ett webbläsarfönster och i en telefon",
    );
    await expect(meta.twitter("card")).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    await expect(meta.twitter("title")).toHaveAttribute("content", title);
    await expect(meta.twitter("image")).toHaveAttribute("content", image);
  });

  test("varje projektsida har sin egen titel, beskrivning, adress och bild", async ({
    page,
  }) => {
    const titles = new Set<string>();
    for (const project of projects) {
      await page.goto(pageOf(project.slug));
      const meta = head(page);
      const title = project.detail.seo.title ?? project.name;
      const address = `${SITE}${pageOf(project.slug)}`;

      await expect(page).toHaveTitle(`${title} | Marcel Deluca`);
      await expect(meta.description).toHaveAttribute(
        "content",
        project.detail.seo.description,
      );
      await expect(meta.canonical).toHaveAttribute("href", address);
      await expect(meta.og("title")).toHaveAttribute("content", title);
      await expect(meta.og("url")).toHaveAttribute("content", address);
      await expect(meta.og("type")).toHaveAttribute("content", "article");
      await expect(meta.og("image")).toHaveAttribute(
        "content",
        `${SITE}${project.image}`,
      );
      // The share picture is a file the site really serves
      const picture = await page.request.get(project.image);
      expect(picture.ok(), `${project.image} is served`).toBe(true);
      titles.add(await page.title());
    }
    expect(titles.size).toBe(projects.length);
  });

  test("projektarkivet har titel, beskrivning och kanonisk adress", async ({
    page,
  }) => {
    await page.goto("/projects/");
    const meta = head(page);
    const description =
      "Alla projekt, webbappar, hemsidor och system som Marcel Deluca har byggt.";
    await expect(page).toHaveTitle("Projekt | Marcel Deluca");
    await expect(meta.description).toHaveAttribute("content", description);
    await expect(meta.canonical).toHaveAttribute("href", `${SITE}/projects/`);
    await expect(meta.og("title")).toHaveAttribute("content", "Projekt");
    await expect(meta.og("url")).toHaveAttribute("content", `${SITE}/projects/`);
    await expect(meta.og("type")).toHaveAttribute("content", "website");
  });

  test("sitemap.xml har arkivet och varje projektsida", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBe(true);
    const xml = await response.text();
    const addresses = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => match[1],
    );

    expect(addresses).toContain(`${SITE}/projects/`);
    expect(addresses).toContain(`${SITE}/projects/uniclean-partners/`);
    expect(addresses).toContain(`${SITE}/projects/fcvaxjo/`);
    const projectPages = addresses.filter((address) =>
      /\/projects\/[^/]+\/$/.test(address),
    );
    expect(projectPages).toEqual(
      projects.map((project) => `${SITE}${pageOf(project.slug)}`),
    );
  });
});
