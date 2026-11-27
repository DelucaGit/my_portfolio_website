import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { SiteCheckResult } from "@/lib/site-check";
import { endedCast } from "./ended-site";
import { otherFeaturedProject } from "./featured-site";

/**
 * Playwright's global setup: makes sure the two extra copies of the site
 * that some tests visit are built.
 *  - out-ended/: two projects have ended (ended-site.ts).
 *  - out-featured/: another project is the featured one (featured-site.ts).
 * Each is one extra `next build`, about a minute, and it only runs when the
 * folder is missing, older than out/ or built from other inputs.
 *
 * Neither build can end up in production: Hostinger runs its own build from
 * the repository, where these variables are not set. The variable that
 * changes the site also makes next.config.ts write to the copy's own folder,
 * so the copies never overwrite out/.
 */
const ROOT = process.cwd();
const OUT = join(ROOT, "out");

const builtAt = (dir: string) => statSync(join(dir, "index.html")).mtimeMs;

/** Builds one copy of the site into `folder`, unless it is already up to date. */
function buildCopy(
  folder: string,
  what: string,
  env: Record<string, string>,
  /** Everything the copy is built from; a change means a new build. */
  inputs: string,
) {
  const dir = join(ROOT, folder);
  const stamp = join(dir, "e2e-inputs.json");
  const fresh =
    existsSync(stamp) &&
    readFileSync(stamp, "utf8") === inputs &&
    builtAt(dir) >= builtAt(OUT);
  if (fresh) return;

  console.log(`\nBuilding ${folder}/ (${what}) …`);
  const build = spawnSync(
    process.execPath,
    [
      join(ROOT, "node_modules", "next", "dist", "bin", "next"),
      "build",
      "--webpack",
    ],
    { cwd: ROOT, env: { ...process.env, ...env }, encoding: "utf8" },
  );
  if (build.status !== 0) {
    throw new Error(
      `The build of ${folder}/ failed:\n${build.stdout}\n${build.stderr}`,
    );
  }
  writeFileSync(stamp, inputs);
}

export default function buildTestSites() {
  if (existsSync(join(ROOT, "site-check.json"))) {
    console.warn(
      "\nsite-check.json exists. If it marks a site as ended, out/ shows that " +
        "and the tests that expect every site button to work fail. " +
        "Delete the file and build again.\n",
    );
  }

  // The site with ended projects.
  const { markedEnded, foundEnded, unreachable } = endedCast();
  const sites: SiteCheckResult["sites"] = {
    [foundEnded.siteUrl]: { status: "ended", detail: "HTTP 404" },
    [unreachable.siteUrl]: { status: "unknown", detail: "HTTP 503" },
  };
  const tmp = join(tmpdir(), "portfolio-e2e-ended");
  mkdirSync(tmp, { recursive: true });
  const checkFile = join(tmp, "site-check.json");
  writeFileSync(
    checkFile,
    JSON.stringify({
      checkedAt: new Date().toISOString(),
      sites,
    } satisfies SiteCheckResult),
  );
  buildCopy(
    "out-ended",
    "the site with ended projects",
    { E2E_ENDED_PROJECT: markedEnded.slug, SITE_CHECK_FILE: checkFile },
    JSON.stringify({ markedEnded: markedEnded.slug, sites }),
  );

  // The site with another featured project.
  const featured = otherFeaturedProject().slug;
  buildCopy(
    "out-featured",
    "the site with another featured project",
    // An empty SITE_CHECK_FILE means the default file, and the warning above
    // covers that one.
    { E2E_FEATURED_PROJECT: featured },
    JSON.stringify({ featured }),
  );
}
