// The link check: asks every project's live site if it is still there and
// writes the answers to a file that the build reads (src/lib/projects.ts).
//
//   npm run check:sites
//   node scripts/check-sites.mjs [--out <file>] [--timeout <ms>] [url ...]
//
// Without addresses it checks the `siteUrl` of every project in
// src/data/projects.ts. The deploy workflow runs it before `next build`.
//
// A site counts as ended ONLY when
//   - its domain does not exist (the name servers say so), or
//   - it answers 404 or 410 (after redirects).
// Everything else that is not a normal answer (a timeout, 5xx, 403, a refused
// connection, a broken certificate, no network) is "unknown", and the button
// to the site stays. The site must never claim a customer has left when the
// customer's site is only down for a moment.
//
// The script never fails: whatever goes wrong, it says so and exits with 0,
// so a failed check cannot stop a deploy. No result file = nothing ended.
//
// Needs Node 22.18 or newer (it imports the TypeScript data file directly).
import { Resolver } from "node:dns/promises";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
/** Where the build looks for the result (see src/lib/projects.ts). */
const DEFAULT_OUT = resolve(ROOT, "site-check.json");
const DEFAULT_TIMEOUT = 15_000;
/** A generic name: it tells the site what is asking, nothing about who. */
const USER_AGENT = "site-link-check/1.0 (automated check of outgoing links)";
const ENDED_ANSWERS = [404, 410];

function readArgs(argv) {
  const args = { out: DEFAULT_OUT, timeout: DEFAULT_TIMEOUT, urls: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--out") args.out = resolve(argv[++i]);
    else if (argv[i] === "--timeout") args.timeout = Number(argv[++i]);
    else args.urls.push(argv[i]);
  }
  if (!Number.isFinite(args.timeout) || args.timeout <= 0) {
    args.timeout = DEFAULT_TIMEOUT;
  }
  return args;
}

/** The live sites of all projects, each address once. */
async function projectSites() {
  const { projects } = await import("../src/data/projects.ts");
  return [...new Set(projects.map((project) => project.siteUrl).filter(Boolean))];
}

/** The error code at the bottom of a failed fetch ("ENOTFOUND", "ECONNREFUSED" …). */
function errorCode(error) {
  for (let e = error; e; e = e.cause) {
    if (typeof e.code === "string") return e.code;
  }
  return error?.name ?? "error";
}

/**
 * True only when the name servers answer "no such domain" for the host.
 * A lookup that fails for any other reason (no network, a slow name server)
 * is not an answer, and then the domain is not counted as gone.
 */
async function domainIsGone(hostname, timeout) {
  const resolver = new Resolver({ timeout, tries: 2 });
  const answers = await Promise.allSettled([
    resolver.resolve4(hostname),
    resolver.resolve6(hostname),
  ]);
  return answers.every(
    (answer) =>
      answer.status === "rejected" && answer.reason?.code === "ENOTFOUND",
  );
}

async function checkSite(url, timeout) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(timeout),
      headers: { "User-Agent": USER_AGENT, Accept: "text/html,*/*;q=0.8" },
    });
    // Only the status is needed; do not download the page.
    await response.body?.cancel().catch(() => {});
    const detail = `HTTP ${response.status}`;
    if (ENDED_ANSWERS.includes(response.status)) return { status: "ended", detail };
    if (response.ok) return { status: "ok", detail };
    return { status: "unknown", detail };
  } catch (error) {
    const code = errorCode(error);
    if (code === "ENOTFOUND") {
      const gone = await domainIsGone(new URL(url).hostname, timeout).catch(
        () => false,
      );
      if (gone) return { status: "ended", detail: "the domain does not exist" };
      return { status: "unknown", detail: "the domain could not be looked up" };
    }
    if (code === "TimeoutError" || code === "AbortError") {
      return { status: "unknown", detail: `no answer within ${timeout} ms` };
    }
    return { status: "unknown", detail: code };
  }
}

async function main() {
  const args = readArgs(process.argv.slice(2));
  const urls = args.urls.length > 0 ? args.urls : await projectSites();

  const answers = await Promise.all(
    urls.map((url) => checkSite(url, args.timeout)),
  );
  const sites = Object.fromEntries(urls.map((url, i) => [url, answers[i]]));

  for (const [url, { status, detail }] of Object.entries(sites)) {
    console.log(`${status.padEnd(7)} ${url}  (${detail})`);
  }

  await mkdir(dirname(args.out), { recursive: true });
  await writeFile(
    args.out,
    JSON.stringify({ checkedAt: new Date().toISOString(), sites }, null, 2) + "\n",
  );
  console.log(`Wrote ${args.out}`);
}

try {
  await main();
} catch (error) {
  // Never stop the deploy: without a result file every button stays.
  console.error(`check-sites: the check did not finish (${error?.message ?? error}).`);
  console.error("check-sites: no result was written, so no site is marked as ended.");
}
// No process.exit() here: on Windows it can crash Node while fetch is closing
// its connections. Every request has a time limit, so the script always ends.
process.exitCode = 0;
