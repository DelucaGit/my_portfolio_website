/**
 * The names of the painted landscapes' colour schemes: morgon (morning), hav
 * (sea), kvall (evening) and skog (forest). The names live here, outside the
 * components, so the project layer can pick one for a page; the colours
 * themselves are in src/components/ui/paintLandscape.ts.
 */
export const PAINTING_PALETTE_NAMES = ["morgon", "hav", "kvall", "skog"] as const;

export type PaintingPalette = (typeof PAINTING_PALETTE_NAMES)[number];
