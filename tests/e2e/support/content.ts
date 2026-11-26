import type { Page } from "@playwright/test";

/**
 * What a page offers a visitor: the headings they can see and the links they
 * can follow. Used to compare the same page under two conditions (with and
 * without JavaScript, with and without motion).
 */
export type PageContent = {
  /** The visible headings, in order. */
  headings: string[];
  /** The visible links, as "name -> address", sorted. */
  links: string[];
};

/**
 * Reads the visible headings and links.
 *
 * The split view's preview window is left out. It only exists with
 * JavaScript on a wide screen, and what it holds belongs to the project that
 * is active at the moment; the list beside it has a link to every case.
 */
export async function pageContent(page: Page): Promise<PageContent> {
  return page.evaluate(() => {
    const clean = (text: string | null | undefined) =>
      (text ?? "").replace(/\s+/g, " ").trim();
    const seen = (element: Element) => {
      if (element.closest('aside[aria-label="Förhandsvisning av valt projekt"]')) {
        return false;
      }
      const box = element.getBoundingClientRect();
      return (
        box.width > 0 &&
        box.height > 0 &&
        (element as HTMLElement).checkVisibility({
          visibilityProperty: true,
          opacityProperty: true,
        })
      );
    };
    const headings = [...document.querySelectorAll("h1, h2, h3, h4")]
      .filter(seen)
      .map((heading) => clean(heading.textContent));
    const links = [...document.querySelectorAll<HTMLAnchorElement>("a[href]")]
      .filter(seen)
      .map(
        (link) =>
          `${clean(link.getAttribute("aria-label") ?? link.textContent)} -> ${link.getAttribute("href")}`,
      );
    return { headings, links: [...new Set(links)].sort() };
  });
}
