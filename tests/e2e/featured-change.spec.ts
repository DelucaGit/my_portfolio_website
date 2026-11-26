import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test, type Page } from "@playwright/test";
import {
  FEATURED_SITE,
  homeProjectsWhenChanged,
  otherFeaturedProject,
} from "./support/featured-site";
import { featuredProject, projectLinks } from "./support/site";

/**
 * Changing the one line `featuredProject` in src/data/site.ts. The first
 * tests visit the copy of the site in which another project is featured (see
 * support/featured-site.ts); the last one checks that a slug that does not
 * exist stops the build.
 */
const usual = featuredProject();
const other = otherFeaturedProject();

const featuredCardFor = (page: Page, name: string) =>
  page
    .locator("#projekt")
    .getByRole("article", { name, exact: true })
    .filter({ hasText: "Utvalt" });

test.describe("Byte av utvalt projekt", () => {
  test.use({ baseURL: FEATURED_SITE });

  test("slår igenom på genomgångskortet, i Om mig och på kortet Egna produkter @webkit", async ({
    page,
  }) => {
    expect(other.slug).not.toBe(usual.slug);
    await page.goto("/");

    // 1. The card at the top of the project section.
    const card = featuredCardFor(page, other.name);
    await expect(card.getByRole("heading", { name: other.name })).toBeVisible();
    await expect(card.getByText(other.tagline)).toBeVisible();
    await expect(
      card.getByRole("link", { name: `Läs caset: ${other.name}` }),
    ).toHaveAttribute("href", `/projects/${other.slug}/`);
    await expect(featuredCardFor(page, usual.name)).toHaveCount(0);
    await expect(
      page.locator("#projekt").getByText("Utvalt", { exact: true }),
    ).toHaveCount(1);

    // 2. Om mig: "bland annat …" names and links to it.
    const about = page.getByRole("region", { name: "Om mig" });
    await expect(about.getByText(`bland annat ${other.name}.`)).toBeVisible();
    await expect(
      about.getByRole("link", { name: other.name, exact: true }),
    ).toHaveAttribute("href", `/projects/${other.slug}/`);
    await expect(about.getByText(usual.name)).toHaveCount(0);

    // 3. The card "Egna produkter" under Vad jag gör.
    const products = page
      .getByRole("region", { name: "Vad jag gör" })
      .getByRole("article", { name: "Egna produkter" });
    await products.scrollIntoViewIfNeeded();
    await expect(
      products.getByText(`till exempel ${other.name}`),
    ).toBeVisible();
    await expect(
      products.getByRole("img", { name: other.imageAlt }),
    ).toBeVisible();
    await expect(
      products.getByRole("link", { name: `Se ${other.name}` }),
    ).toHaveAttribute("href", `/projects/${other.slug}/`);
    await expect(products.getByText(usual.name)).toHaveCount(0);
  });

  test("det nya utvalda projektet står inte i listan under, och det förra gör det", async ({
    page,
  }) => {
    const listed = homeProjectsWhenChanged();
    expect(listed.map((project) => project.slug)).toContain(usual.slug);

    await page.goto("/");
    const links = projectLinks(page);
    await expect(links).toHaveCount(9);
    for (const [index, project] of listed.entries()) {
      await expect(links.nth(index)).toContainText(project.name);
      await expect(links.nth(index)).toHaveAttribute(
        "href",
        `/projects/${project.slug}/`,
      );
    }
  });

  test("ett utvalt projekt utan inspelad genomgång visar sin skärmbild i fönstret", async ({
    page,
  }) => {
    await page.goto("/");
    const card = featuredCardFor(page, other.name);
    await card.scrollIntoViewIfNeeded();

    const screenshot = card.getByRole("img", { name: other.imageAlt });
    await expect(screenshot).toBeVisible();
    await expect
      .poll(() =>
        screenshot.evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
        ),
      )
      .toBe(true);
    await expect(card.locator("video")).toHaveCount(0);
    await expect(card.getByText(/^\d\d\/\d\d · /)).toHaveCount(0);
  });
});

test.describe("En slug som inte finns", () => {
  /**
   * `next build` checks the types and stops on the first error. This runs
   * the same check (tsc, with the project's own settings) on a copy of
   * src/data/site.ts: once as it is, once with a slug that no project has.
   * The copy lives outside the repo, so a real build never sees it.
   */
  test("stoppar bygget", () => {
    test.slow(); // Two runs of the type checker.
    const root = process.cwd();
    const source = readFileSync(join(root, "src/data/site.ts"), "utf8");
    const line = `featuredProject: "${usual.slug}" satisfies ProjectSlug`;
    expect(source, "the one line in src/data/site.ts").toContain(line);

    const dir = mkdtempSync(join(tmpdir(), "portfolio-e2e-slug-"));
    const typeCheck = (text: string) => {
      writeFileSync(
        join(dir, "site.ts"),
        text.replace('from "./projects"', 'from "@/data/projects"'),
      );
      writeFileSync(
        join(dir, "tsconfig.json"),
        JSON.stringify({
          extends: join(root, "tsconfig.json"),
          compilerOptions: { incremental: false, types: [], plugins: [] },
          include: ["site.ts"],
        }),
      );
      const run = spawnSync(
        process.execPath,
        [join(root, "node_modules/typescript/bin/tsc"), "-p", dir],
        { cwd: root, encoding: "utf8" },
      );
      return { failed: run.status !== 0, output: run.stdout + run.stderr };
    };

    try {
      const asItIs = typeCheck(source);
      expect(asItIs.output).toBe("");
      expect(asItIs.failed).toBe(false);

      const wrongSlug = typeCheck(
        source.replace(
          line,
          'featuredProject: "finns-inte" satisfies ProjectSlug',
        ),
      );
      expect(wrongSlug.failed).toBe(true);
      expect(wrongSlug.output).toContain('"finns-inte"');
      expect(wrongSlug.output).toContain("site.ts");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
