/**
 * The items before and after one slug in an ordered list, for the
 * "föregående/nästa" links at the foot of a case page. Both ends, and a slug
 * that is not in the list, give null.
 */
export function getAdjacent<T extends { slug: string }>(
  ordered: readonly T[],
  slug: string,
): { prev: T | null; next: T | null } {
  const index = ordered.findIndex((item) => item.slug === slug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? ordered[index - 1] : null,
    next: index < ordered.length - 1 ? ordered[index + 1] : null,
  };
}
