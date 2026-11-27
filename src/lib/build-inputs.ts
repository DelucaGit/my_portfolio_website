import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { CheckedSite, SiteCheckResult } from "./site-check";

/**
 * Everything the build takes in from outside the code and src/data: the link
 * check's result file and the switches the Playwright suite sets for its own
 * copies of the site. This is the only place that reads them, so the rules in
 * src/lib/projects.ts read no files and no environment variables themselves.
 */
export type BuildInputs = {
  /**
   * E2E_ENDED_PROJECT: a slug that counts as ended, standing in for
   * `siteStatus: "ended"`. Only the tests' build to out-ended/ sets it
   * (next.config.ts); never set in a real build.
   */
  endedForTest?: string;
  /**
   * E2E_FEATURED_PROJECT: a slug that stands in for `featuredProject` in
   * src/data/site.ts. Only the tests' build to out-featured/ sets it
   * (next.config.ts); never set in a real build.
   */
  featuredForTest?: string;
  /** What the link check wrote, keyed by address. Empty without a file. */
  checkedSites: Record<string, CheckedSite>;
};

let inputs: BuildInputs | undefined;

/** The build's inputs, read once per build. */
export function getBuildInputs(): BuildInputs {
  inputs ??= {
    endedForTest: process.env.E2E_ENDED_PROJECT || undefined,
    featuredForTest: process.env.E2E_FEATURED_PROJECT || undefined,
    checkedSites: readCheckedSites(),
  };
  return inputs;
}

/**
 * The link check's result file. It is written before the build in the deploy
 * workflow and is not in git: without the file no site counts as ended.
 * SITE_CHECK_FILE points at another file (the tests use that).
 */
function readCheckedSites(): Record<string, CheckedSite> {
  const file =
    process.env.SITE_CHECK_FILE || join(process.cwd(), "site-check.json");
  try {
    const result = JSON.parse(
      readFileSync(file, "utf8"),
    ) as Partial<SiteCheckResult>;
    return result.sites ?? {};
  } catch {
    // No file, or a broken one: nothing is known, so every button stays.
    return {};
  }
}
