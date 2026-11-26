#!/usr/bin/env node
/*
 * record-walkthrough.js
 *
 * Records a short, loopable "walkthrough" video of a live website with a
 * visible mouse pointer that moves and clicks like a visitor. The result
 * plays muted inside the browser-window mock-up on the portfolio prototypes.
 *
 * Output per site (slug):
 *   walk-<slug>.mp4   H.264, yuv420p, faststart, no audio
 *   walk-<slug>.webm  VP9, no audio
 *   walk-<slug>.webp  poster (first frame)
 *   <work>/walk.json  metadata + step list (times relative to the trimmed video)
 *   <work>/sheet-<slug>.png  contact sheet for a quick visual check
 *
 * Needs: Playwright with Chromium, and ffmpeg with libx264, libvpx-vp9, libwebp.
 * The visit is read-only: it only moves, scrolls and clicks links/tabs.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

// ───────────────────────────── Data: edit here ─────────────────────────────

const VIDEO = { width: 1280, height: 800, fps: 25 };
const FALLBACK = { width: 1120, height: 700 }; // used only if a size limit cannot be met
const LIMITS = { mp4: 1.2e6, webm: 1.0e6 }; // bytes
const FFMPEG = process.env.FFMPEG || 'ffmpeg';

/*
 * One entry per site. A step is { text, do }, where `text` is the label shown
 * next to the video (Swedish, present tense) and `do` is a list of actions:
 *   ['rest', ms]                         stand still so the viewer can read
 *   ['scroll', dy, ms]                   smooth wheel scroll by dy pixels
 *   ['click', selector, { url, rest }]   move to the element, pause, click;
 *                                        `url` = glob to wait for when the click
 *                                        changes page, `rest` = ms to wait after
 *   ['move', x, y]                       move the pointer to a viewport point
 * `start` is where the pointer rests at the beginning and the end. The last
 * step must bring the page back to the start state so the loop is seamless.
 * `prepare` (optional) lists selectors clicked before the take starts, for
 * example a cookie banner's "reject" button; it never appears in the video.
 */
const SITES = {
  'fcvaxjo-reborn': {
    url: 'https://fcvaxjo.se/',
    start: { x: 660, y: 610 },
    prepare: [],
    steps: [
      { text: 'Öppnar startsidan', do: [['rest', 1400]] },
      { text: 'Skrollar till kommande matcher', do: [['scroll', 700, 1500], ['rest', 1100]] },
      { text: 'Öppnar Matcher i menyn', do: [['click', 'header a[href="/matcher/"]', { url: '**/matcher/', rest: 1300 }]] },
      { text: 'Växlar till spelade matcher och resultat', do: [['click', 'role=tab[name=/spelade/i]', { rest: 1000 }]] },
      { text: 'Skrollar bland resultaten', do: [['scroll', 420, 1100], ['rest', 900]] },
      { text: 'Öppnar Träningstider', do: [['click', 'header a[href="/traningstider/"]', { url: '**/traningstider/', rest: 1500 }]] },
      { text: 'Går tillbaka till startsidan', do: [['click', 'header nav a[href="/"]', { url: 'https://fcvaxjo.se/', rest: 300 }], ['move', 660, 610], ['rest', 1100]] },
    ],
  },
};

// ───────────────────────── Pointer drawn in the page ─────────────────────────

/*
 * Headless Chromium draws no mouse pointer, so the page draws one itself.
 * Runs before every document (addInitScript), so it survives navigations; the
 * last position is kept in sessionStorage and restored on the next page.
 */
function pointerInitScript() {
  if (window.top !== window) return; // not inside iframes
  const KEY = '__walk_pointer';
  let pos = { x: -100, y: -100 };
  try { pos = JSON.parse(sessionStorage.getItem(KEY)) || pos; } catch (_) {}

  const el = document.createElement('div');
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText = 'position:fixed;left:0;top:0;width:22px;height:24px;z-index:2147483647;' +
    'pointer-events:none;will-change:transform;filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))';
  el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 22 24">' +
    '<path d="M3 2v17.2l4.6-4.3 3.1 6.9 2.9-1.3-3.1-6.8h6.3z" fill="#16161a" stroke="#fff" ' +
    'stroke-width="1.6" stroke-linejoin="round"/></svg>';
  // The arrow tip sits at (3, 2) inside the SVG.
  const place = () => { el.style.transform = `translate(${pos.x - 3}px, ${pos.y - 2}px)`; };
  place();

  const attach = () => {
    if (document.documentElement && el.parentNode !== document.documentElement) document.documentElement.appendChild(el);
  };
  attach();
  document.addEventListener('DOMContentLoaded', attach);
  // Frameworks may rebuild the DOM; put the pointer back if it is removed.
  new MutationObserver(attach).observe(document, { childList: true, subtree: false });
  if (document.documentElement) new MutationObserver(attach).observe(document.documentElement, { childList: true });

  window.addEventListener('mousemove', (e) => {
    pos = { x: e.clientX, y: e.clientY };
    place();
    try { sessionStorage.setItem(KEY, JSON.stringify(pos)); } catch (_) {}
  }, true);

  window.addEventListener('mousedown', (e) => {
    const ring = document.createElement('div');
    ring.style.cssText = 'position:fixed;left:' + (e.clientX - 18) + 'px;top:' + (e.clientY - 18) + 'px;' +
      'width:36px;height:36px;border-radius:50%;box-sizing:border-box;border:3px solid rgba(22,22,26,.75);' +
      'box-shadow:0 0 0 2px rgba(255,255,255,.8);z-index:2147483646;pointer-events:none';
    document.documentElement.appendChild(ring);
    ring.animate([{ transform: 'scale(.25)', opacity: 1 }, { transform: 'scale(1.25)', opacity: 0 }],
      { duration: 480, easing: 'ease-out' }).onfinish = () => ring.remove();
  }, true);
}

// ───────────────────────────── Human-like input ─────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const TICK = 16; // ms between input events

/** Eased pointer move along a slightly curved path (quadratic Bezier). */
async function moveTo(page, mouse, x, y) {
  const from = { ...mouse };
  const dist = Math.hypot(x - from.x, y - from.y);
  if (dist < 2) return;
  const ms = Math.min(900, Math.max(600, 500 + dist * 0.5));
  const bend = Math.min(60, dist * 0.12);
  const cx = (from.x + x) / 2 - ((y - from.y) / dist) * bend;
  const cy = (from.y + y) / 2 + ((x - from.x) / dist) * bend;
  const t0 = Date.now();
  for (;;) {
    const t = Math.min(1, (Date.now() - t0) / ms);
    const e = easeInOut(t);
    mouse.x = (1 - e) * (1 - e) * from.x + 2 * (1 - e) * e * cx + e * e * x;
    mouse.y = (1 - e) * (1 - e) * from.y + 2 * (1 - e) * e * cy + e * e * y;
    await page.mouse.move(mouse.x, mouse.y);
    if (t >= 1) break;
    await sleep(TICK);
  }
}

/** Smooth scroll: many small wheel steps following an ease-in-out curve. */
async function scrollBy(page, dy, ms) {
  const t0 = Date.now();
  let done = 0;
  for (;;) {
    const t = Math.min(1, (Date.now() - t0) / ms);
    const target = Math.round(dy * easeInOut(t));
    if (target !== done) { await page.mouse.wheel(0, target - done); done = target; }
    if (t >= 1) break;
    await sleep(TICK);
  }
}

/** Move to an element, wait like a person would, click, then wait for the page. */
async function clickOn(page, mouse, selector, opts = {}) {
  const target = page.locator(selector).first();
  await target.waitFor({ state: 'visible', timeout: 10000 });
  const box = await target.boundingBox();
  await moveTo(page, mouse, box.x + box.width / 2, box.y + box.height / 2);
  await sleep(550);
  await page.mouse.down();
  await sleep(70);
  await page.mouse.up();
  if (opts.url) {
    await page.waitForURL(opts.url, { timeout: 20000 });
    await page.waitForLoadState('load');
    await page.mouse.move(mouse.x, mouse.y); // re-place the pointer on the new page
  }
  await sleep(opts.rest ?? 1000);
}

// ─────────────────────────────── Recording ───────────────────────────────

async function record(slug, site, workDir) {
  const { chromium } = require('playwright');
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  const browser = await chromium.launch(proxy ? { proxy: { server: proxy } } : {});
  const context = await browser.newContext({
    viewport: { width: VIDEO.width, height: VIDEO.height },
    deviceScaleFactor: 1,
    recordVideo: { dir: workDir, size: { width: VIDEO.width, height: VIDEO.height } },
  });
  await context.addInitScript(pointerInitScript);
  const page = await context.newPage();
  const videoStart = Date.now(); // the screencast starts with the page

  // Requests that fail (for example hosts blocked by a proxy) are worth knowing about.
  const blocked = {};
  page.on('requestfailed', (r) => {
    try { const h = new URL(r.url()).host; blocked[h] = (blocked[h] || 0) + 1; } catch (_) {}
  });

  const mouse = { ...site.start };
  await page.goto(site.url, { waitUntil: 'load', timeout: 45000 });
  await page.evaluate(() => document.fonts.ready);
  await page.mouse.move(mouse.x, mouse.y);
  for (const selector of site.prepare || []) {
    await page.locator(selector).first().click({ timeout: 5000 }).catch(() => {});
  }
  await page.mouse.move(mouse.x, mouse.y);
  await sleep(900); // settle; this lead-in is trimmed away

  const takeStart = Date.now();
  const steps = [];
  for (const step of site.steps) {
    const t = (Date.now() - takeStart) / 1000;
    steps.push({ t: Math.round(t * 10) / 10, text: step.text });
    console.log(`  ${t.toFixed(1).padStart(5)} s  ${step.text}`);
    for (const [kind, a, b] of step.do) {
      if (kind === 'rest') await sleep(a);
      else if (kind === 'scroll') await scrollBy(page, a, b);
      else if (kind === 'click') await clickOn(page, mouse, a, b);
      else if (kind === 'move') await moveTo(page, mouse, a, b);
      else throw new Error(`Unknown action: ${kind}`);
    }
  }
  const takeEnd = Date.now();
  const endState = await page.evaluate(() => ({ url: location.href, scrollY: window.scrollY }));
  await sleep(300);

  const video = page.video();
  await context.close(); // finishes the WebM
  const raw = await video.path();
  await browser.close();

  return {
    raw,
    trimStart: (takeStart - videoStart) / 1000,
    duration: (takeEnd - takeStart) / 1000,
    steps, blocked, endState,
  };
}

// ─────────────────────────────── Encoding ───────────────────────────────

const ff = (args) => execFileSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: ['ignore', 'ignore', 'inherit'] });
const bytes = (file) => fs.statSync(file).size;

/** Encode with rising CRF until the file fits the limit; returns the CRF used or null. */
function encodeToFit(make, file, crfs, limit) {
  for (const crf of crfs) {
    make(crf);
    if (bytes(file) <= limit) return crf;
  }
  return null;
}

function encode(take, slug, outDir, workDir) {
  const out = (ext) => path.join(outDir, `walk-${slug}.${ext}`);
  const input = ['-i', take.raw, '-ss', take.trimStart.toFixed(3), '-t', take.duration.toFixed(3)];
  let size = { width: VIDEO.width, height: VIDEO.height };
  const used = {};

  for (const attempt of [VIDEO, FALLBACK]) {
    size = { width: attempt.width, height: attempt.height };
    const vf = `fps=${VIDEO.fps},scale=${size.width}:${size.height}:flags=lanczos,format=yuv420p`;
    used.mp4 = encodeToFit((crf) => ff([...input, '-vf', vf, '-an', '-c:v', 'libx264', '-preset', 'slow',
      '-crf', String(crf), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out('mp4')]),
      out('mp4'), [22, 24, 26, 28, 30, 32], LIMITS.mp4);
    used.webm = encodeToFit((crf) => ff([...input, '-vf', vf, '-an', '-c:v', 'libvpx-vp9', '-b:v', '0',
      '-crf', String(crf), '-deadline', 'good', '-cpu-used', '2', '-row-mt', '1', out('webm')]),
      out('webm'), [32, 36, 40, 44, 48], LIMITS.webm);
    if (used.mp4 !== null && used.webm !== null) break;
  }
  if (used.mp4 === null || used.webm === null) console.warn('  Warning: a size limit could not be met.');

  // Poster: first frame of the finished MP4, so it matches the video exactly.
  ff(['-i', out('mp4'), '-frames:v', '1', '-c:v', 'libwebp', '-quality', '80', out('webp')]);

  // Contact sheet: six frames spread over the video, 3 x 2, 1800 px wide.
  const sheet = path.join(workDir, `sheet-${slug}.png`);
  ff(['-i', out('mp4'), '-vf', `fps=6/${take.duration.toFixed(3)},scale=600:-1,tile=3x2`, '-frames:v', '1', sheet]);

  return { size, used, sheet, files: { mp4: out('mp4'), webm: out('webm'), poster: out('webp') } };
}

// ───────────────────────────────── Main ─────────────────────────────────

function usage() {
  console.log([
    'Usage: node prototypes/tools/record-walkthrough.js <slug> [--out <dir>] [--work <dir>]',
    '',
    `  <slug>   one of: ${Object.keys(SITES).join(', ')}`,
    '  --out    where the mp4, webm and poster go (default: prototypes/assets)',
    '  --work   where the raw recording, walk.json and the contact sheet go',
    '           (default: a "walkthrough" folder in the system temp directory)',
    '',
    'If Playwright is installed outside the project, point NODE_PATH at the',
    'node_modules folder that holds it. Behind a proxy, set HTTPS_PROXY.',
    'Sites, steps and limits are plain data at the top of this file.',
  ].join('\n'));
}

async function main() {
  const args = process.argv.slice(2);
  const flag = (name, fallback) => { const i = args.indexOf(name); return i >= 0 ? args.splice(i, 2)[1] : fallback; };
  const outDir = path.resolve(flag('--out', path.join(__dirname, '..', 'assets')));
  const workDir = path.resolve(flag('--work', path.join(os.tmpdir(), 'walkthrough')));
  const slug = args[0];
  const site = SITES[slug];
  if (!site) { usage(); process.exit(slug ? 1 : 0); }
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(workDir, { recursive: true });

  console.log(`Recording ${site.url} (${slug})`);
  const take = await record(slug, site, workDir);
  console.log(`Encoding ${take.duration.toFixed(1)} s (lead-in of ${take.trimStart.toFixed(1)} s trimmed)`);
  const enc = encode(take, slug, outDir, workDir);
  fs.rmSync(take.raw, { force: true });

  const entry = {
    slug,
    url: site.url,
    duration: Math.round(take.duration * 10) / 10,
    width: enc.size.width,
    height: enc.size.height,
    files: {
      mp4: enc.files.mp4, webm: enc.files.webm, poster: enc.files.poster,
      bytes: { mp4: bytes(enc.files.mp4), webm: bytes(enc.files.webm), poster: bytes(enc.files.poster) },
    },
    steps: take.steps,
    blockedHosts: take.blocked,
  };

  // walk.json holds one object per recorded site; replace this slug's entry.
  const jsonFile = path.join(workDir, 'walk.json');
  let all = [];
  try { all = JSON.parse(fs.readFileSync(jsonFile, 'utf8')); } catch (_) {}
  all = all.filter((e) => e.slug !== slug).concat(entry);
  fs.writeFileSync(jsonFile, JSON.stringify(all, null, 2) + '\n');

  console.log(`Done: ${entry.duration} s, ${entry.width}x${entry.height}, CRF mp4 ${enc.used.mp4} / webm ${enc.used.webm}`);
  for (const [k, v] of Object.entries(entry.files.bytes)) console.log(`  ${k.padEnd(6)} ${String(v).padStart(8)} bytes  ${entry.files[k]}`);
  console.log(`  steps  ${jsonFile}`);
  console.log(`  sheet  ${enc.sheet}`);
  console.log(`  end state: ${take.endState.url} at scrollY ${take.endState.scrollY}`);
  const hosts = Object.keys(take.blocked);
  if (hosts.length) console.log(`  failed requests to: ${hosts.join(', ')} (check the sheet for missing images or fonts)`);
}

main().catch((err) => { console.error(err); process.exit(1); });
