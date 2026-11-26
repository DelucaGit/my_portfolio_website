# Marcel Deluca: portfolio

The portfolio at [marceldeluca.se](https://marceldeluca.se). It is written for recruiters: who Marcel is, what he has built and how to reach him. The site is in Swedish. The design is called **Tyngdlös**: a paper-coloured page, a light and a dark theme, and painted landscapes behind browser windows that show the projects.

Built with Next.js 16 (App Router) as a static export and published to Hostinger over FTP by GitHub Actions.

`JOURNEY.md` is the log of what was built and why.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server on http://localhost:3000 |
| `npm run build` | Builds the static site into `out/` |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Builds the site, then runs the whole Playwright suite |
| `npm run test:e2e:run` | Runs the suite against the `out/` that is already built |
| `npm run check:sites` | Asks every project's live site if it is still there |
| `npm run record:walkthrough -- <slug>` | Records a walkthrough film of a project's live site |

Node 22.18 or newer is needed (`check:sites` imports a TypeScript file directly). The deploy uses Node 24.

### Why `--webpack`

`dev` and `build` run with `--webpack`. Turbopack is the default in Next.js 16, but the site that Turbopack builds does not work once it is published on Hostinger. Do not remove the flag.

The build is a static export (`output: "export"` and `trailingSlash: true` in `next.config.ts`): plain files in `out/`, one `index.html` per page. There is no server.

> Next.js 16 differs from older versions. Read the guide in `node_modules/next/dist/docs/` before changing app code (see `AGENTS.md`).

## The site

| Page | What is there |
| --- | --- |
| `/` | The start page, seven parts (below) |
| `/cv/` | The CV, with a print style and a PDF to download |
| `/projects/` | The project archive: every project in the split view |
| `/projects/<slug>/` | One project's case |
| `/services/<slug>/` | Four service pages. They are not linked from the start page; they only share the menu, the footer and the colours |

The start page, in order:

1. **Hero**: a ring of strokes in WebGL that follows the pointer, one sentence and the buttons "Läs CV" and "Se projekten". It stands still with reduced motion and has a drawn fallback without WebGL or JavaScript.
2. **Projekt** (`#projekt`): the featured project in a browser window that plays a recorded walkthrough, then "Fler projekt": the **split view** with the nine next projects (names on the left, a preview window on the right that stays in place and follows the scroll, the pointer and the keyboard) and a link to all projects. Below 1024 px the projects are rows.
3. **Om mig** (`#om`): a short text that fills in word by word while you scroll.
4. **Vad jag gör**: three cards, "Hemsidor åt kunder", "Egna produkter" and "Backend och cloud".
5. **Teknik** (`#teknik`): languages and tools, grouped by use.
6. **Vägen hit**: education and work on a timeline, read from the CV data.
7. **Kontakt** (`#kontakt`): mail, phone, a button that copies the e-mail address, LinkedIn and GitHub.

Every page has the sticky menu with a theme switcher (system, light, dark; remembered on the device), a "Hoppa till innehållet" link and the footer with the name as a large wordmark.

### Where things are

| Path | What |
| --- | --- |
| `src/data/site.ts` | All texts and settings for the site, the CV included |
| `src/data/projects.ts` | Every project |
| `src/data/services.ts` | The service pages |
| `src/lib/` | The layer between data and components. Components ask `src/lib/projects.ts`; they never read the project data themselves |
| `src/components/` | The parts of the pages. `projects/ProjectSplitView*` is the split view, used by the start page and the archive |
| `src/theme.css` | The colour tokens for both themes |
| `public/previews/` | The 2:1 screenshots for the split view: `<slug>.webp` (1280x640) and `<slug>-sm.webp` (640x320) |
| `public/walkthroughs/` | The walkthrough films: `<slug>.mp4`, `.webm` and `.webp` |
| `scripts/` | The link check and the recording script |
| `tests/e2e/` | The Playwright suite |

A new project needs an entry in `src/data/projects.ts` and its two files in `public/previews/`. Nothing checks that the preview files exist.

## Change the featured project

One line in `src/data/site.ts`:

```ts
featuredProject: "andalus-calendar" satisfies ProjectSlug,
```

Put another project's slug there. What follows by itself:

- the card with the walkthrough at the top of the project section,
- "bland annat …" in Om mig, with its link,
- the card "Egna produkter" under Vad jag gör (name, the first two things it is built with, screenshot and link),
- the list under the card: the new featured project leaves it and the old one takes its place by year.

A slug that no project has stops the build (TypeScript refuses it).

What does **not** follow:

- **The card "Hemsidor åt kunder".** Its project is its own line, `whatIDo.clients.project`. The link, the address bar and the screenshot follow that line, but the sentence in `whatIDo.clients.text` names FC Växjö Reborn in plain words. Change both.
- **The text on the card "Egna produkter".** `whatIDo.products.text` also mentions Sabaah Al-Wuruud, and `whatIDo.products.second` is the project in the small window on top. If the new featured project is that same project, the small window is hidden.
- **The CV.** `cv.experience` mentions projects by name.
- **The film.** A project without a recorded walkthrough shows its screenshot (`image`) in the card instead. Films exist for `andalus-calendar` and `fcvaxjo-reborn`.

`homeProjectCount` in the same file is how many projects the start page shows: the featured one plus the newest of the others.

## Record a new walkthrough

The film in the featured card is a recording of the real site, made by a script that moves a drawn pointer around like a visitor.

1. Install [ffmpeg](https://ffmpeg.org/) with libx264, libvpx-vp9 and libwebp, on the `PATH` (or set `FFMPEG=<path>`). Playwright's Chromium must be installed: `npx playwright install chromium`.
2. Describe the visit in `scripts/record-walkthrough.mjs`: add an entry for the project's slug to `SITES` at the top of the file (the address, where the pointer rests, and the steps: rest, scroll, click, move, hover). Each step has the Swedish text that is shown under the film. The last step must bring the page back to where it started, so the film loops without a jump. The visit must be read-only.
3. Run `npm run record:walkthrough -- <slug>`. It writes `public/walkthroughs/<slug>.mp4`, `.webm` and `.webp` (the still image). The step times land in `walk.json` in a `walkthrough` folder in the system's temp directory, next to a contact sheet for a quick look. The script prints both paths.
4. Copy the length and the steps from `walk.json` into the project in `src/data/projects.ts`:

   ```ts
   walkthrough: {
     duration: 19.7,
     steps: [
       [0, "Öppnar startsidan"],
       [2.5, "Läser om dubbla kalendrar"],
     ],
   },
   ```

   Each step is `[the second it starts, the text]`. The file names come from the slug, so the data holds no paths.
5. Run `npm run test:e2e`. It checks that each film is there in both formats, that the steps fit the film's length, and that no film is left on the server for a project without a `walkthrough`.

The film is only shown for the featured project. It plays muted and without controls while at least a third of it is on screen. Visitors who ask for reduced motion or save data see the still image.

## Mark a project as ended

When a customer closes their site, the button "Besök sidan" must not lead to a broken page. It is then shown switched off with the text "Kunden har avslutat projektet": on the start page, in the archive and on the project's page.

**It happens by itself.** `npm run check:sites` asks every project's `siteUrl` and writes the answers to `site-check.json` (not in git), which the build reads. A site counts as ended only when its domain no longer exists or it answers 404 or 410. A timeout, a server error or anything else unclear counts as unknown, and the button stays. The check can never stop a deploy.

**The deploy runs it** (`.github/workflows/deploy.yml`): on every push to `main`, when started by hand, and at 05:17 UTC on the 1st of every month, so the buttons stay right when nothing is published. Every run checks the sites, builds and uploads `out/`. GitHub switches scheduled workflows off after 60 days without activity in the repository and sends a mail first.

**By hand,** when the check cannot know. For example when someone else has taken over the old domain, so the address still answers:

```ts
siteUrl: "https://example.se",
siteStatus: "ended",
```

Add the line to the project in `src/data/projects.ts`. It always wins over the check. Keep `siteUrl`: a project with an empty `siteUrl` has no button at all. Remove the line to undo.

If you run `npm run check:sites` on your own machine, `site-check.json` stays in the folder and the next local build uses it. Delete the file afterwards, or the tests that expect a working button for every project can fail.

## Tests

One seam: Playwright against the built static site. The tests do what a visitor does (scroll, point, press keys, read) and never look at internals.

```bash
npm run test:e2e                      # build, then run everything
npm run test:e2e:run                  # run against the out/ that exists
npx playwright test split-view        # one file
```

The first time: `npx playwright install chromium webkit`.

- Chromium runs everything. WebKit (Safari's engine) runs the tests tagged `@webkit`: a small set that checks each part of the site once.
- The suite builds two more copies of the site before it starts (about a minute each, and only when `out/` is newer): `out-ended/`, in which two projects have ended, and `out-featured/`, in which another project is the featured one. They are built by the real `next build` with one environment variable each, and that same variable sends the build to its own folder. Only `out/` is deployed.
- Three small static servers are started on port 4173 and the two after it. `E2E_PORT=<port>` moves them, for example when two checkouts run the suite at the same time. A server left over from an earlier run on the same port is reused; if the tests see an old page, look for a stale `node` process there.
- The copies do not notice changes in the source. Run `npm run build` (or `npm run test:e2e`) after a change and they follow.

## Deploy

A push to `main` runs `.github/workflows/deploy.yml`: `npm ci`, the link check, `npm run build`, then `out/` is uploaded to Hostinger over FTP (the secrets `FTP_SERVER`, `FTP_USERNAME` and `FTP_PASSWORD`). The upload replaces everything on the server.

Every piece of work starts as a GitHub issue and is built on a branch (see `AGENTS.md`).
