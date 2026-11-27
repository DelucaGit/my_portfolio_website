import { execFile } from "node:child_process";
import { resolve4 } from "node:dns/promises";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { expect, test } from "@playwright/test";
import type { SiteCheckResult } from "@/lib/site-check";

/**
 * The link check (scripts/check-sites.mjs), run the way the deploy runs it:
 * as a command that writes a result file. The sites it asks are a small
 * server started here, which answers the way customers' sites can answer.
 */

const run = promisify(execFile);

let server: Server;
let origin: string;
let dir: string;

test.beforeAll(async () => {
  server = createServer((req, res) => {
    const path = req.url ?? "/";
    const status = Number(path.slice(1));
    if (path === "/slow") return; // never answers
    if (path === "/moved-to-200") {
      res.writeHead(301, { Location: "/200" }).end();
    } else if (path === "/moved-to-410") {
      res.writeHead(302, { Location: "/410" }).end();
    } else {
      res.writeHead(status || 200, { "Content-Type": "text/html" });
      res.end("<h1>Hej</h1>");
    }
  });
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  dir = await mkdtemp(join(tmpdir(), "site-check-"));
});

test.afterAll(async () => {
  server.closeAllConnections();
  await new Promise((done) => server.close(done));
  await rm(dir, { recursive: true, force: true });
});

/** Runs the check on these addresses and returns the file it wrote. */
async function check(name: string, urls: string[]): Promise<SiteCheckResult> {
  const out = join(dir, `${name}.json`);
  await run(process.execPath, [
    "scripts/check-sites.mjs",
    "--out",
    out,
    "--timeout",
    "1500",
    ...urls,
  ]);
  return JSON.parse(await readFile(out, "utf8")) as SiteCheckResult;
}

test("only a site that answers 404 or 410 counts as ended", async () => {
  const urls = ["200", "404", "410", "500", "503", "403", "slow"].map(
    (path) => `${origin}/${path}`,
  );
  const result = await check("answers", urls);

  const status = Object.fromEntries(
    urls.map((url) => [url.slice(origin.length), result.sites[url]?.status]),
  );
  expect(status).toEqual({
    "/200": "ok",
    "/404": "ended",
    "/410": "ended",
    "/500": "unknown",
    "/503": "unknown",
    "/403": "unknown",
    "/slow": "unknown",
  });
  expect(Number.isNaN(Date.parse(result.checkedAt))).toBe(false);
});

test("the check follows a redirect and judges where it ends up", async () => {
  const fine = `${origin}/moved-to-200`;
  const gone = `${origin}/moved-to-410`;
  const result = await check("redirects", [fine, gone]);

  expect(result.sites[fine].status).toBe("ok");
  expect(result.sites[gone].status).toBe("ended");
});

test("a site nobody is listening on is unknown, not ended", async () => {
  // A port that was just freed: the connection is refused.
  const closed = createServer();
  await new Promise<void>((done) => closed.listen(0, "127.0.0.1", done));
  const url = `http://127.0.0.1:${(closed.address() as AddressInfo).port}/`;
  await new Promise((done) => closed.close(done));

  const result = await check("refused", [url]);

  expect(result.sites[url].status).toBe("unknown");
});

test("a domain that does not exist counts as ended", async () => {
  // Needs a name server to say "no such domain"; without a network nobody can.
  const online = await resolve4("example.com").then(
    () => true,
    () => false,
  );
  test.skip(!online, "no name server to ask");

  const url = "https://kunden-har-avslutat-projektet.invalid/";
  const result = await check("no-domain", [url]);

  expect(result.sites[url].status).toBe("ended");
});

test("the check never stops the deploy, whatever happens", async () => {
  // A result file that cannot be written (package.json is not a folder):
  // the command still ends without error.
  const { stderr } = await run(process.execPath, [
    "scripts/check-sites.mjs",
    "--out",
    join("package.json", "result.json"),
    `${origin}/200`,
  ]);
  expect(stderr).toContain("check-sites");
});
