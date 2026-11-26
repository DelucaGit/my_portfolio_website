// Serves a static export for Playwright. No dependencies.
//   node serve-out.mjs [port] [folder]   (folder: out, or out-ended)
// Works like a plain web host: /cv/ serves /cv/index.html, unknown paths get 404.html.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const port = Number(process.argv[2] ?? 4173);
const folder = process.argv[3] ?? "out";
const root = resolve(
  fileURLToPath(new URL(`../../../${folder}`, import.meta.url)),
);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
};

async function resolveFile(pathname) {
  const safe = normalize(decodeURIComponent(pathname)).replace(/^([/\\])+/, "");
  let file = join(root, safe);
  if (file !== root && !file.startsWith(root + sep)) return null;
  try {
    const info = await stat(file);
    if (info.isDirectory()) file = join(file, "index.html");
    await stat(file);
    return file;
  } catch {
    return null;
  }
}

function send(res, status, file, body, range) {
  const headers = {
    "Content-Type":
      types[extname(file).toLowerCase()] ?? "application/octet-stream",
    "Cache-Control": "no-store",
    "Accept-Ranges": "bytes",
  };
  // Safari only plays video from servers that answer range requests.
  const match = range && /^bytes=(\d*)-(\d*)$/.exec(range);
  if (status === 200 && match) {
    const start = match[1] ? Number(match[1]) : 0;
    const end = match[2]
      ? Math.min(Number(match[2]), body.length - 1)
      : body.length - 1;
    res.writeHead(206, {
      ...headers,
      "Content-Range": `bytes ${start}-${end}/${body.length}`,
      "Content-Length": end - start + 1,
    });
    res.end(body.subarray(start, end + 1));
    return;
  }
  res.writeHead(status, { ...headers, "Content-Length": body.length });
  res.end(body);
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");
  const file = await resolveFile(pathname);
  if (file) {
    send(res, 200, file, await readFile(file), req.headers.range);
    return;
  }
  const notFound = join(root, "404.html");
  try {
    send(res, 404, notFound, await readFile(notFound));
  } catch {
    res.writeHead(404).end("Not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Serving ${root} on http://127.0.0.1:${port}`);
});
