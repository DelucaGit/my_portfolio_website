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
import { endedCast } from "./ended-site";

/**
 * Playwright's global setup: makes sure out-ended/ holds the copy of the site
 * described in ended-site.ts. It is one extra `next build`, and it only runs
 * when out-ended/ is missing, older than out/ or built for another cast.
 *
 * The build cannot end up in production: setting E2E_ENDED_PROJECT makes
 * next.config.ts write to out-ended/ instead of out/, and the deploy only
 * uploads out/.
 */
const ROOT = process.cwd();
const OUT = join(ROOT, "out");
const OUT_ENDED = join(ROOT, "out-ended");
const STAMP = join(OUT_ENDED, "e2e-ended.json");

const builtAt = (dir: string) => statSync(join(dir, "index.html")).mtimeMs;

export default function buildEndedSite() {
  const { markedEnded, foundEnded, unreachable } = endedCast();
  const sites = {
    [foundEnded.siteUrl]: { status: "ended", detail: "HTTP 404" },
    [unreachable.siteUrl]: { status: "unknown", detail: "HTTP 503" },
  };
  const inputs = JSON.stringify({ markedEnded: markedEnded.slug, sites });

  if (existsSync(join(ROOT, "site-check.json"))) {
    console.warn(
      "\nsite-check.json exists. If it marks a site as ended, out/ shows that " +
        "and the tests that expect every site button to work fail. " +
        "Delete the file and build again.\n",
    );
  }

  const fresh =
    existsSync(STAMP) &&
    readFileSync(STAMP, "utf8") === inputs &&
    builtAt(OUT_ENDED) >= builtAt(OUT);
  if (fresh) return;

  console.log("\nBuilding out-ended/ (the site with ended projects) …");
  const dir = join(tmpdir(), "portfolio-e2e-ended");
  mkdirSync(dir, { recursive: true });
  const checkFile = join(dir, "site-check.json");
  writeFileSync(
    checkFile,
    JSON.stringify({ checkedAt: new Date().toISOString(), sites }),
  );

  const build = spawnSync(
    process.execPath,
    [
      join(ROOT, "node_modules", "next", "dist", "bin", "next"),
      "build",
      "--webpack",
    ],
    {
      cwd: ROOT,
      env: {
        ...process.env,
        E2E_ENDED_PROJECT: markedEnded.slug,
        SITE_CHECK_FILE: checkFile,
      },
      encoding: "utf8",
    },
  );
  if (build.status !== 0) {
    throw new Error(
      `The build of out-ended/ failed:\n${build.stdout}\n${build.stderr}`,
    );
  }
  writeFileSync(STAMP, inputs);
}
