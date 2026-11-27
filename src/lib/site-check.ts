/**
 * The format of the link check's result file, site-check.json. This is the
 * one definition: scripts/check-sites.mjs writes it (it refers to these
 * types in JSDoc), src/lib/build-inputs.ts reads it for the build, and the
 * tests write and read it too.
 *
 * Only types live here, so that Node can load the file from the plain .mjs
 * script as well as from the build.
 */

/**
 * What the check found out about one address:
 *  - "ok": the site answered normally.
 *  - "ended": the domain does not exist, or the site answers 404 or 410.
 *  - "unknown": anything else (a timeout, 5xx, 403, no network …). The
 *    button to the site stays.
 */
export type SiteStatus = "ok" | "ended" | "unknown";

/** The answer for one address. */
export type CheckedSite = {
  status: SiteStatus;
  /** For people reading the file: "HTTP 404", "the domain does not exist" … */
  detail: string;
};

/** The whole file. */
export type SiteCheckResult = {
  /** When the check ran, as an ISO date */
  checkedAt: string;
  /** Keyed by the address exactly as `siteUrl` gives it */
  sites: Record<string, CheckedSite>;
};
