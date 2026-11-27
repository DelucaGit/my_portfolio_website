/**
 * A catalog is the one place that knows how a list of entries (Projects,
 * Services) is ordered, looked up and linked to. Pages, cards, SEO and the
 * sitemap all ask the catalog instead of rebuilding those rules.
 */
export type Catalog<T extends { slug: string }> = {
  /** Every entry, in catalog order. */
  all(): T[];
  bySlug(slug: string): T | undefined;
  /** Slugs in catalog order. */
  slugs(): string[];
  /** Neighbours in catalog order; null at either end or for an unknown slug. */
  adjacent(slug: string): { prev: T | null; next: T | null };
  /** Site path of an entry's page, with the trailing slash the static export uses. */
  href(entry: T | string): string;
  /** Site path of the catalog's index, e.g. "/projects/". */
  indexHref: string;
};

export function createCatalog<T extends { slug: string }>({
  entries,
  basePath,
  order,
}: {
  entries: readonly T[];
  /** Path the entry pages live under, e.g. "/projects". */
  basePath: string;
  /** Sort for catalog order. Stable: ties keep the data order. Omit for data order. */
  order?: (a: T, b: T) => number;
}): Catalog<T> {
  const ordered = order ? [...entries].sort(order) : [...entries];
  const base = basePath.replace(/\/+$/, "");

  return {
    all: () => [...ordered],
    bySlug: (slug) => ordered.find((entry) => entry.slug === slug),
    slugs: () => ordered.map((entry) => entry.slug),
    adjacent(slug) {
      const index = ordered.findIndex((entry) => entry.slug === slug);
      if (index === -1) return { prev: null, next: null };
      return {
        prev: ordered[index - 1] ?? null,
        next: ordered[index + 1] ?? null,
      };
    },
    href: (entry) =>
      `${base}/${typeof entry === "string" ? entry : entry.slug}/`,
    indexHref: `${base}/`,
  };
}
