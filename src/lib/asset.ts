/**
 * Append a version query so browsers/CDN skip sticky 301 caches
 * left over from earlier Hostinger .htaccess redirect bugs.
 */
export const ASSET_VERSION = "20260726";

export function asset(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}v=${ASSET_VERSION}`;
}
