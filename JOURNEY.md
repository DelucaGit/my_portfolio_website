# Portfolio journey

A running log of what we built, what we chose, and why. Written so a later article can tell the story without reconstructing it from git.

## 26 Nov 2026 — Tyngdlös: walkthrough on top, split view below (#51)

**Goal:** Of the five variants in #50, Marcel liked Genomgång and Delad vy. He asked for the featured project on top with the walkthrough video, the split view below for more projects, about ten projects on the home page with the rest on the projects page, and a visit button that becomes unavailable when a customer's site no longer answers.

**What we did**
- Replaced the app window in `prototypes/tyngdlos.html` (now 82 KB) with the featured card from Genomgång, the split view from Delad vy for the next nine projects, and a row "Se alla 17 projekt"
- Three lines steer it: `FEATURED`, `HOME_COUNT = 10` and `ENDED = []`. A slug in `ENDED` swaps the visit link for an unavailable button and the text "Kunden har avslutat projektet"
- New overview thumbnail, and the decisions written into the build plan (#49)

**Decisions**
- **The link check belongs to the build, not the prototype.** It will run in GitHub Actions on every push to `main` and once a month (Marcel's choice), and republish the site.
- **Only certain failures count as ended:** the domain is gone, or the site answers 404 or 410. Timeouts and server errors leave the button alone, so a short outage at a customer cannot make the site claim the customer has left. A manual `siteStatus` field overrides the check.
- **Build and test in separate subagents.** The build task still used 178k tokens and the test task 166k, both over the 150k limit, because each had to read an 80 KB single-file page. In Next.js the units are components, which are far smaller.

**Tested**
- 177 Playwright checks at 390 to 1920 px by the test subagent: video rules, reduced motion, data saver, JavaScript off, other featured slugs, ended sites, keyboard, contrast in both themes, touch targets
- It found and fixed three defects: the pane fetched images at page load, keyboard focus and the shown project drifted apart during smooth scrolling, and the last project became active after the pane had slid under the nav
- Known: later items in the list activate a little lower than 45% of the viewport, and the card and the pane use different link styles for the same action

## 26 Nov 2026 — Five ways to show the projects (#50)

**Goal:** Marcel loves Tyngdlös but was still not happy with how the project section feels to use. He asked for several different proposals for just that part. While they were being built he sent a screenshot of a feature card on cursor.com and added his own idea: a recorded walkthrough of a project, where an agent plays a visitor clicking around the site.

**What we did**
- Five standalone pages that hold only the project section, all with the 17 projects, the same `FEATURED` line and the Tyngdlös look:
  - `tyngdlos-projekt-scen.html`: one project at a time in a large window on the painted stage, with arrows, swipe and a film strip of all 17
  - `tyngdlos-projekt-index.html`: the featured project as a large card, the other 16 as rows per year that open in place
  - `tyngdlos-projekt-galleri.html`: image tiles with the featured one largest, filter chips computed from the data, and a detail panel built on `<dialog>`
  - `tyngdlos-projekt-delad.html`: big names on the left and a sticky window on the right that follows scroll and pointer
  - `tyngdlos-projekt-genomgang.html`: Cursor-style cards where the window plays a recording of the real site, with a one-line "Agenten · 03/07 · …" caption that follows the video
- `prototypes/tools/record-walkthrough.js`: drives a live site in Playwright with an injected pointer (headless Chromium draws none), eased moves and click ripples, then encodes MP4, WebM and a poster with ffmpeg. Sites and steps are data at the top
- Two recordings in `prototypes/assets/`: fcvaxjo.se (a real click-through, 17.8 s) and andaluscalendar.com (a read-through of the landing page, 19.7 s), each about 1 MB

**Decisions**
- **Video, not GIF.** A muted looping video is a fraction of a GIF's size and keeps full colour.
- **No pause button.** Marcel wants a moving picture that cannot be interacted with, so the video has no controls and ignores clicks. It still stops off screen, and it stays on its poster with reduced motion or data saver.
- **The whole frame, uncropped.** Cursor crops its windows at the card edge. A walkthrough needs the pointer visible wherever it goes, so the window shows the full 16:10 frame.
- **The Andalus Calendar is only scrolled.** Every button on its public page leads to sign-in, and the recorder does not sign in or submit anything. Showing the app itself needs a demo account.
- **One variant per subagent.** Each built and tested one file in the same tree, and the main session committed. Marcel's limit is 150k tokens per task; the variant tasks used 162k to 202k, mostly on test-and-fix rounds, so the tasks for the real build need to be cut smaller.

**Tested**
- Each variant from 390 to 1920 px, light and dark, keyboard, reduced motion, JavaScript off, another featured slug and an unknown slug (Playwright, by the subagent that built it). The main session looked at desktop and phone screenshots of each.
- Genomgång: the video plays in view, pauses out of view, and a click changes nothing. Only Chromium was tested, so the MP4 path for Safari is unverified.
- Recording first failed on blocked third-party hosts (the club crest and Tailwind's CDN). The hosts were allowed in the cloud environment and both sites were recorded again.

## 25 Nov 2026 — Tyngdlös: between Cursor's site and Antigravity's (#48)

**Goal:** After Festaffisch, Marcel wanted to try something new. He likes the websites of Cursor and Google Antigravity and asked for something in between.

**What we did**
- `prototypes/tyngdlos.html` (62 KB, one file, no JavaScript libraries), with a light and a dark theme
- **From Cursor:** warm paper, small calm type, app windows that sit on a painted landscape, grey cards with text on one side and a window on the other, a row of small dated cards, and a footer with a theme switch
- **From Antigravity:** a big centred headline inside a ring of coloured dashes that follows the pointer, a statement that fills in word by word as it scrolls, a dark rounded panel where the ring comes back, and the name as a giant clipped wordmark in the footer
- **The project window** holds all 17 projects. A list on the left, the case in the middle, and an "agent" column that replays each choice as a short log. Its buttons do real things: "Något i Next.js" jumps to the next project built in Next.js
- **A featured project.** One constant at the top of the project window's script, `FEATURED`, names the project to show first. It stands in for a `featuredProject` key in the site data of the later Next.js build. The project is pinned as the first row of the list under "Utvalt" and has its own pinned tab, which opens a larger view: the tagline as a lead line, the cover, three facts and two buttons. Any other project opens in a second tab next to it. The first time the window scrolls into view, the agent presents the featured project once. The "Egna produkter" card and the sentence in "Om mig" read the same constant, so changing one slug updates the whole page. The file is now 68 KB
- **The paintings are drawn in code.** Each landscape is about 6,400 short brush strokes from a seeded random generator, painted once on a small canvas when it comes near the screen. No image files
- **The ring** is about 700 dashes in WebGL (300 on phones). Every position is worked out in the vertex shader, so JavaScript only moves two points per frame

**Decisions**
- **Look at the sites before building.** Both hosts were blocked from the cloud container. The first plan was to work from memory, and Marcel stopped that. A new environment for this repository now allows `cursor.com` and `antigravity.google`, and the design is based on screenshots of both
- **Borrow the ideas, not the assets.** No logos, texts or images from either site. The paintings and the ring are our own code, and the ring's colours run blue, violet, red and amber
- **Two corner sizes on purpose.** Cards and windows have small corners like Cursor. The two stages (the painting under the hero, the dark contact panel) have big corners like Antigravity
- **One typeface plus a mono.** Google Sans Flex for everything and Geist Mono for file names and labels
- **The Java window is an example.** The card about backend and cloud shows a Spring Boot controller written for this page. It is labelled "exempel" and should be swapped for real code from the Reddit clone

**Tested:** Playwright at 390, 768, 1024, 1440 and 1920 px wide: no console errors, all images load, no sideways scroll. The project list, arrow keys, the agent buttons, the theme switch and the copy button work. Reduced motion shows a still ring and full-colour text. About 61 fps in headless Chromium (software WebGL), not measured on a real phone.

## 25 Nov 2026 — Festaffisch: Konfetti and Affisch in one page (#47)

**Goal:** Marcel liked two of the three prototypes, Konfetti and Affisch. A fourth prototype shows what they look like as one design, before anything is built in Next.js.

**What we did**
- `prototypes/festaffisch.html` (74 KB, one file, no JavaScript libraries). Kontrollrum is not taken further
- **From Affisch:** the 12-column poster grid with thick rules, Archivo as the only typeface, the name edge to edge with letters that change width and weight near the pointer, the 3D drum of the eight projects from 2026, the index with a cover that follows the cursor, and the tech band
- **From Konfetti:** the cream paper, warm ink and magenta instead of white, black and cobalt, and the WebGL confetti that spells the greeting in five languages. The greeting sits above the name, so the top of the page reads "Hej / Marcel Deluca"
- The ten confetti colours return in small places: the backs of the cards on the drum, the marks between the words in the tech band, and a yellow block behind the portrait, which is in colour again

**Decisions**
- **Affisch is the skeleton, Konfetti is the colour and the life.** Two layouts cannot be averaged, but a layout and a palette can be combined. Rounded pastel cards next to hard rules looked like two sites
- **The language buttons became a poster list** (SV, EN, ES, AR, FR) in the label column, with the full names from 1200 px. On phones they are a row of six square buttons
- **The name only reacts when the pointer is near it.** Both effects live in the hero, and without this the name went thin whenever the pointer played with the confetti
- **Long greetings use the condensed cut.** "Bonjour" was too soft on phones in Konfetti because it had to be drawn small. Set in condensed letters it can be about 28 % taller in the same width

**Tested:** Playwright at 390, 768, 1024, 1440 and 1920 px wide: no console errors, all images load, no sideways scroll. Reduced motion shows a still greeting and hides the pause button. Frame rate was only measured in headless Chromium (software WebGL), not on a real phone.

## 25 Nov 2026 — Three prototypes for the next design (#47)

**Goal:** Marcel wants a new direction for the portfolio: simple, but with something advanced in it. He likes animation and 3D, and the page must stay light. Three prototypes that look clearly different, so he can pick one.

**What we did**
- Three standalone pages in `prototypes/`, one HTML file each, no JavaScript libraries and no build step. They sit outside the Next.js app and outside `public/`, so nothing here is deployed to marceldeluca.se
- `prototypes/index.html` is an overview that links to all three
- `prototypes/assets/`: WebP copies of the 17 project covers in two sizes (1280 and 640 px wide, cropped to 2:1) and the portrait. About 1 MB in total, against 72 MB in `public/`
- **Konfetti** (65 KB): the current brand, light and warm. The sprinkles from the old hero are now about 7 000 WebGL particles (2 600 on phones) that form a greeting in Marcel's five languages. The morph runs in the vertex shader, so the CPU only sets a few values per frame
- **Kontrollrum** (68 KB): dark ink blue, mono readouts, amber for live things. A dotted 3D globe drawn in Canvas 2D shows where the work has landed. Hovering a row in the project log turns the globe to that place
- **Affisch** (51 KB): white, black and one cobalt blue, Archivo as a variable font. The name runs edge to edge and each letter changes width and weight near the pointer. The eight projects from 2026 sit on a 3D drum built with CSS transforms only

**Decisions**
- **Same content in all three:** hero, projects, tech, about, contact. No services, reviews or booking, because those left the homepage earlier when the audience became recruiters
- **Native scrolling.** Lenis was removed on 5 Nov because it felt slow, so no prototype takes over the scroll
- **Readable without the effect.** All text is in the HTML and visible in the first frame. Each centerpiece pauses when it is off-screen or the tab is hidden, and shows one static frame with `prefers-reduced-motion`, without WebGL and without JavaScript
- **Only real places on the globe.** Markers exist for the places `projects.ts` states: Växjö, Gävle, Norge, Finland, Irak and Gambia. That covers 8 of 17 projects. The other 9 show a dash
- **Prototypes, not the final build.** The chosen one gets rebuilt in Next.js in its own issue

**Tested:** Playwright at 1440×900 and 390×844 for all three: no console errors, all images load, no sideways scroll. Frame rate was only measured in headless Chromium, not on a real phone.

## 25 Nov 2026 — UniClean Partners case study (#43)

**Goal:** Add a case for the new uniclean.nu, the Next.js site that replaces the WordPress site Marcel built earlier.

**What we did**
- New project at `/projects/uniclean-partners/`, first in `projects.ts` so it leads the homepage
- The old `uniclean` case (WordPress) stays. The new case says in its first paragraph that Marcel built the previous site in WordPress
- Five studio images and five phone screenshots in `public/projects/uniclean-partners/`. The studio images are compositions: real screenshots placed in a browser window and phone frame on a backdrop in UniClean's colours
- A 30 second screen recording with a visible mouse pointer. New optional `video` field on project media, rendered in the same browser frame as the full-page block

**Decisions**
- **Not technical.** Marcel asked for tech stack, problem and solution only. Test counts, security work and the build problem at Hostinger are left out
- **Role:** developer of the website. The app is built by someone else, and the case says so
- **No numbers.** There are no measurements of bookings or traffic, so the results only say what is true: the site is live and the quote flow is gone
- **Screenshots come from the local copy of the UniClean repo** (branch `partnerlank`), because uniclean.nu stops automated browsers with a bot check
- **The story, corrected by Marcel:** the old site was for quote requests. The new site exists because the new app arrived, an Uber for cleaning that connects private customers with cleaners nearby. The site guides both groups to it
- **Stack lists Next.js, not React as well.** Next.js is built on React, so one name is enough
- **About Marcel's work, not the app.** The block about the price screen is gone, because that screen belongs to the app. The texts now say what Marcel built, in first person
- **No reviews in the images.** The reviews section shows real people's names, so it is not featured

## 13 Nov 2026 — Sabaah Al-Wuruud: what the name means (#26)

**Goal:** Tell readers who don't know Arabic what the app's name means.

**What we did**
- The first overview paragraph now says the name is Arabic for "rosornas morgon" (Morning of Roses)

## 12 Nov 2026 — Sabaah Al-Wuruud: her reaction as the closing review (#24)

**Goal:** End the case with the one review the app can get.

**What we did**
- Added the chat screenshot of her reaction as `media.closing`, the existing two-column block (image and text) that renders last in the case
- Copy: eyebrow "Recension", heading "Den enda recensionen som räknas." No name is visible in the screenshot

## 12 Nov 2026 — Sabaah Al-Wuruud: adhkar explained, GitHub button (#22)

**Goal:** Make the case readable for non-Muslims and link it to the app repo.

**What we did**
- The first overview paragraph (the only one the case page renders) now explains what adhkar are: short prayers and remembrances Muslims read every morning and evening, asking the Creator for protection during the day and night
- `githubUrl` now points at `DelucaGit/sabaah-al-wuruud`, so the existing GitHub button in the case header shows. This reverses the earlier choice to keep the case unlinked from the app repo; Marcel asked for the link
- `AGENTS.md` now says every piece of work starts as a GitHub issue, so the repo keeps a full history

## 13 Nov 2026 — Sabaah Al-Wuruud case study

**Goal:** Show the adhkar app Marcel built for his wife as a portfolio case. First case that is an Android app, not a website.

**What we did**
- Ran the app on localhost (Vite) at 390×844, 2× pixel density, clock fixed to a morning so the timeline shows a normal day
- Pressed "I memorized page 1" so Today shows the verse and tafsir card
- Screenshots of every tab (Today, Adhkar, morning reader, Qur'an, Istikhara, Me) plus Today in dark mode, in `public/projects/sabaah-al-wuruud/`
- Composed a wide `hero.png` (1600×1000) from three phone screenshots with Pillow, since the hero frame expects a landscape image
- New slug `sabaah-al-wuruud`, year 2026, first in `projects.ts`. Theme `--project-theme-lilac` to match the app
- Copy covers the why (her favourite adhkar app filled up with ads), the process (issues first, small PRs, Claude Code, Capacitor, Android Studio SDK, debug APK then signed release APK) and the stack

**Privacy:** His wife's name must not appear. The screenshots were taken with a neutral name set in the app instead of blurring afterwards, the copy says "min fru", and `siteUrl`/`githubUrl` are empty so the case does not link to the app repo.

## 5 Nov 2026 — Zenith Kampsport case study

**Goal:** Add a portfolio case for a site Marcel maintains but did not originally build.

**What we did**
- Captured zenithkampsport.se at 1440×900 (hero, schema, om-oss, kontakt, medlemskap) plus schema at 1280×800 for the laptop-layout story
- New slug `zenith-kampsport`, year 2026, placed first in `projects.ts` so it leads the homepage featured four
- Stack: Next.js, TypeScript, Tailwind, Vercel; GitHub points at `esam95/usc-nextjs` (existing public repo)
- Copy is honest: role is "Underhåll och vidareutveckling", not "I built this from scratch". Focus on taking over after the previous developer, schedule work, and smaller laptop screens

**Why honesty matters:** Claiming authorship of someone else's build would be easy to spot from the GitHub history. Maintenance of a live club site is still strong recruiter signal.

**Note:** Nav "Priser" resolves to `/medlemskap`; `/priser` is 404. We screenshot medlemskap for the closing section.

## 5 Nov 2026 — Mobil UX-pass (390 px)

**Goal:** Make the site comfortable to read and tap on a phone, without touching desktop, colours or copy.

**What we measured first (iPhone-size, 390×844):** The homepage was ~6 100 px tall (7 screens). The Teknik section alone was 2 219 px because 15 cards sat in one column. Hero secondary buttons were 36 px tall (below the 44 px tap minimum). CV portrait came after all text. `body`, not `html`, was the scroll container.

**What we did (all CSS, mobile-first, desktop values restored in media queries)**
- `globals.css`: `height: 100%` → `min-height: 100%` on `html, body`. Now `html` scrolls (Safari hides its address bar, anchor links behave).
- `Stack.module.css`: 2-column grid on mobile with icon above label, smaller padding. Section went 2 219 px → 1 201 px.
- `Hero.module.css`: Läs CV + phone stack full width (48 px tall); Mejl/LinkedIn/GitHub stay 3-up at 44 px. Photo moved first with `order: -1` and cropped to ~13–16 rem; `object-position: 40% 35%` keeps the face in the short frame. Desktop gets `order: 0` and the old crop back at 900 px.
- `ProjectCard.module.css`: tighter padding, 16:9 media on mobile. Projects section 1 796 px → 1 644 px.
- `CvPage`: portrait first with `order: -1`, buttons as 1 + 2 grid (`.heroActions`), more tap padding on fact links.
- `ProjectCaseStudy.module.css`: client/role/year pills hidden under 640 px, Live-sida + GitHub as two equal buttons.
- `theme.css`: mobile override `--text-body: 17px`, `--space-section: 3.75rem`.
- Footer links became 44 px pill buttons, dot separators removed (desktop too, it reads cleaner).

**Result:** Homepage 6 128 px → 4 936 px, all tap targets ≥ 44 px, `scrollingElement` is `HTML`. Desktop checked at 1 440 px: unchanged.

**Follow-up (same morning):** Kompetens column on `/cv` is now `position: sticky` on desktop (`.split > .block:last-child`, `top: nav-height + 1.5rem`, `align-self: start`). It sticks until the education column ends because sticky is limited to its parent grid. While testing we found that `overflow-x: hidden` on `body` broke every sticky element (navbar included) once `html` became the scroller. Fix: keep `overflow-x: hidden` only on `html`. Lesson: an ancestor with any non-visible overflow becomes the box sticky fastens to.

**Hero photo on mobile, second try:** The first mobile crop (full width, ~14 rem tall) showed mostly hair because the portrait photo has the head spanning half its height and a wide/short frame only shows 30 %. Switched to a 12 rem square "avatar" (`aspect-ratio: 1 / 1`, `object-position: 50% 45%`) left-aligned above the status pill. A square shows 56 % of the photo, enough for the whole head, and keeps heading + buttons on the first screen. I first suggested keeping text left-aligned, but Marcel preferred a centered hero on mobile (avatar, pill, heading, text, buttons all centered). Done with `align-items: center; text-align: center` on `.copy` and `justify-self: center` on `.visual`, reset at 900 px so desktop stays left-aligned.

**New CV PDF:** Replaced `public/cv.pdf` with Marcel's updated `Marcel_Deluca_CV.pdf` (121 kB). Bumped `ASSET_VERSION` to `20261105g` so cached copies of the old PDF are skipped, and set `download="Marcel_Deluca_CV.pdf"` on the button so the saved file gets a proper name instead of `cv.pdf`.

**TakKoll images were broken:** `projects.ts` pointed at `takkoll/hero.jpg` and `takkoll/services.jpg`, but the files have always been `hero-viewport.jpg` and `services-viewport.jpg` (the short names slipped in when the entry was rewritten in commit `64721e7`). Checked all 80 asset paths in `src/data/*.ts` against `public/`, case-sensitive since Hostinger runs Linux; only these two were wrong. Fixed the three references.

Side lesson, and a mistake: I first edited with `Get-Content | Set-Content` in Windows PowerShell 5.1, which writes ANSI (cp1252) by default and silently broke every å/ä/ö in the file. Caught it when the diff showed `�`. Re-encoded from cp1252 back to UTF-8 and confirmed nothing was lost (HEAD had no characters outside cp1252). Rule from now on: edit source files with the editor tools, not PowerShell string pipelines.

**Why `order` instead of moving JSX:** The HTML order stays "text first" for screen readers and search engines; only the visual order changes on small screens. One CSS line per breakpoint, no duplicate markup.

## 5 Nov 2026 — FC Växjö Reborn case study

**Goal:** Add a new project for the rebuilt club site without removing the old FC Växjö case.

**What we did**
- Visited https://fcvaxjo.se, captured hero / news / training screenshots into `public/projects/fcvaxjo-reborn/`
- New slug `fcvaxjo-reborn` (year 2026), kept old `fcvaxjo` (2023)
- Stack story: Next.js, GitHub (`DelucaGit/FC-Vaxjo-Website`), Hostinger CI; future mobile schedule updates called out in the copy

**Why keep both:** Recruiters can see the redesign journey — old site vs reborn — instead of erasing history.

**Later same night:** Added custom HTML email screenshot (`email-layout.png`) — what the club receives when someone submits the sponsor form — into the Reborn case study feature + gallery, with short Swedish copy.

**Screenshot fix (same night):** Case-study images looked cut off on the right. Cause was bad captures (page not framed correctly), not CSS on the portfolio. Recaptured hero / news / training with Playwright at full 1440×900 viewport and bumped `ASSET_VERSION` to `20261105d` so the browser does not keep old PNGs.

## 5 Nov 2026 — Nav, hero knappar, Reborn-sektioner

**Navbar:** CV bort från mittlänkarna. Högerknappen (och mobil-CTA) är nu **Läs CV** → `/cv`. Kontakt finns kvar som vanlig nav-länk.

**Hero:** Ikoner (inline SVG + `currentColor`) på CV / telefon / mejl / LinkedIn / GitHub. `Ring efter 12.00` ligger inne i telefonknappen som liten notis — inte under knappraden.

**FC Växjö Reborn:**
- Stack: `Next.js`, `GitHub`, `Hostinger` (React bort — Next.js räcker)
- Mejl och app är två sektioner: galleri = schema/app, ny `closing` + `closingCopy` = mejl sist
- Tidig `feature` med mejl borttagen så detaljen inte kommer först
- Case copy: flytt One.com → Hostinger (hemsida + mejl, gamla mejl bevarade) och resultat ca 2 500 kr/år sparat
- Språkregel för Reborn: skriv **hemsida** (inte sajt), undvik tankstreck, mer vardaglig ton så det inte låter AI-genererat

## 5 Nov 2026 — Riktigt CV på /cv

Fyllde CV-sidan från Marcels PDF + ny porträttbild (`public/cv-portrait.jpg`, `public/cv.pdf`).
- Namn på CV-sidan: **Marcel Deluca Nygren** (övriga sidan behåller Marcel Deluca)
- Telefon **073 879 66 01**, plats **Växjö**, ingen gatuadress på sidan
- Utbildning: JENSEN + Webmaster Högskolan Väst (+ kort gymnasium)
- Erfarenhet: bara webbprojekt på CV-listan. Loomis/Avarn nämns kort i introt (intresse för säkerhet)
- Hero-bilden på startsidan orörd. Porträttet syns bara på CV
- Språk på CV: svenska/spanska/engelska/arabiska flytande, franska förstår
- CV-porträtt: `object-fit: contain` + luft i ramen så huvudet inte klipps
- Utbildning (JENSEN + Webmaster): rosa “Vad har jag lärt mig?” som öppnas med `<details>` (gymnasiet utan dropdown)

## 5 Nov 2026 — Case study header visar stack

Rosa taggar högst upp kom från `tags` (t.ex. Förening, CI/CD) och sa lite. De visar nu `stack` i stället (t.ex. Next.js, GitHub, Hostinger). Klient / roll / år ligger kvar som grå etiketter.

## 5 Nov 2026 — Språkpass hela portfolion

Samma röst över datan och synliga komponenttexter:
- **hemsida** i stället för sajt/webbplats (där det syns för besökare)
- tankstreck (`—`) bort, ersatta med punkt eller komma
- mål: låta mer som Marcel, mindre som genererad copy

## 5 Nov 2026 — Remove Lenis smooth scroll

Took `SmoothScroll` (Lenis) out of `layout.tsx` so the site uses normal browser scrolling. Feels snappier and less “fancy” for a recruiter portfolio.

## 5 Nov 2026 — Real brand logos on stack cards

Replaced hand-drawn SVG icons with official Simple Icons / Devicon files in `public/icons/`. Descriptions under names were removed; cards show logo + name only.

**Stack expanded (what Marcel confirmed):** WordPress/Elementor, Tailwind, PostgreSQL, Docker, REST API (built with Java), plus existing React/Next, Java, PHP, Firebase, AWS, Azure, HTML/CSS, Git, Cursor.

## 4 Nov 2026 — Project detail = Stitch case study

**Goal:** Restyle `/projects/[slug]` to match the Stitch AURA project-detail layout.

**Structure now**
1. Back to projects  
2. Tags + title + short text + Live / GitHub  
3. Hero image in soft frame  
4. Tech stack pill bar  
5. Challenge & solution side-by-side cards  
6. Results + feature/mobile/desktop/gallery blocks  
7. Next project + CV link  
8. Contact CTA (“öppen för jobb”)

**Decisions:** Keep Marcel’s real Swedish project copy and screenshots. Do not import AURA placeholder content. Labels stay simple Swedish.

## 4 Nov 2026 — Contact email + GitHub

- Email → `malakdeluca@gmail.com`
- GitHub → `https://github.com/DelucaGit`

## 4 Nov 2026 (late) — Hero portrait + balanced CTAs

**Goal:** Use Marcel’s beach portrait in the hero, and tidy the button row.

**What we changed**
- Hero image → `public/hero-portrait.jpg`
- “Hämta CV” → **Läs CV** (links to `/cv`)
- Phone became a **magenta/pink primary button** next to Läs CV
- Second row: Mejl / LinkedIn / GitHub as equal-width secondary buttons
- Hero grid closer to 50/50 so text and photo feel balanced

**Why:** Recruiters should see Marcel’s face first. Two clear primary actions (CV + call), then quieter links underneath.

## 4 Nov 2026 (evening) — Stitch warm editorial + Swedish CV page

**Goal:** Match the Stitch “warm editorial” look (cream + magenta, Plus Jakarta Sans, soft pastel project cards), keep Swedish + simple words, and add a CV page with a PDF download button.

**What we changed**
- Theme tokens rewritten from Stitch `DESIGN.md` / home HTML (`#fff8f5`, primary `#b30564`)
- Font switched from Inter → **Plus Jakarta Sans**
- Homepage rebuilt in Stitch rhythm: Hero (split + plant still) → Projects (4 pastel cards) → Stack → About → Contact → Footer
- New `/cv` page that mimics a CV layout (experience, education, skills, languages) with **Ladda ner CV (PDF)** → `/cv.pdf`
- Nav: Hem, Projekt, CV, Om, Kontakt + “Kontakta mig”
- Copy kept short and Swedish; fake Stitch companies/projects were **not** copied — real Marcel projects stay

**Decisions**
- **Style from Stitch, truth from Marcel.** AURA / OmniFlow / “principal advisory” stayed out — recruiters should see real work.
- **CV page is a living template** until Marcel sends the real CV. A visible note explains putting the PDF at `public/cv.pdf`.
- **Hero image** copied from the Stitch export plant still into `public/hero-still.png`.
- **GitHub URL** set to `https://github.com/marceldeluca` as a guess — confirm or fix later.
- Phone + “Ring efter 12:00” taken from the Stitch home mock.

**Next for Marcel**
- Drop real `cv.pdf` into `public/`
- Send real CV text so we replace the placeholder blocks
- Confirm GitHub URL and phone number
- Hard-refresh localhost and check mobile

## 4 Nov 2026 — Recruiter-first redesign

**Goal:** Turn the site from a freelance/agency pitch into a portfolio that helps Marcel get a real job.

**Inspiration**
- Pratibha Joshi — light calm layout, soft project cards, clear contact
- Sheldon Codling — simple section order (who → work → contact)
- Jhey.dev — keep it simple; cut noise
- Plus the “40 portfolios” article: purpose first, projects early, easy contact, no skill bars

**What we changed**
- Homepage order: Hero → Projects → About → Contact
- Removed IntroVideo, Reviews, and Services from the homepage (files stay in the repo; `/services/...` still works if linked)
- Hero copy: “Webbutvecklare”, “Öppen för jobb”, CTAs = Projekt / LinkedIn / Kontakt
- New About section with short bio + skill tags (years/tools, not percentages)
- Contact: email + LinkedIn only (Calendly booking removed from this section)
- Navbar: LinkedIn as the main CTA; Om + Projekt as in-page anchors
- Project cards restyled to soft pastel cards (uses each project’s `theme.bg`) on a light background instead of the dark image-overlay band

**Decisions**
- **Audience = recruiters**, not freelance clients. That is why Services and “boka möte” left the main flow.
- **Swedish copy stayed.** Recruiters in Sweden still scan Swedish first; LinkedIn is English-friendly enough as the outbound link.
- **No CV PDF yet.** There was no file in `/public`. LinkedIn + email cover the “easy contact” tip until a PDF is added.
- **Keep case-study pages and old components.** Less risk; we can delete later if they are unused.
- **Show 6 featured projects** on the home page so skills show up faster than a long about section.

**Next for Marcel**
- Hard-refresh the homepage and check mobile
- Add a CV PDF under `/public` and link it from Hero/Contact when ready
- Tweak About skills list if the stack should match the CV exactly
- Commit and push when it feels right

## 14 Sep 2026 — The Andalus Calendar

**Goal:** Add a personal product (not a client site) to the case-study list.

**What we added**

- New project at `/projects/andalus-calendar/`
- Eight screenshots in `public/projects/andalus-calendar/`
- An optional `gallery` field on project media, so landing-page shots can sit under the in-app views without inventing a new page type

**Decisions**

- **Year 2026**, and the entry sits first in `projects.ts`. Same-year projects keep array order after the “newest year first” sort. First in the file → first on the homepage. The live badge is already “Version 2026.1”.
- **Card image = logged-in month view**, not the marketing hero. The story is “prayer times in the calendar”. The month view shows Maghrib countdown, hijri dates, and tasks in one screenshot.
- **Feature = day overlay** (Dhuhr / Asr / Maghrib / Isha as lines in the grid). That is the unique UI.
- **Desktop = settings** (Hijri/Gregorian, prayer calculation, light/dark).
- **Landing shots in a gallery**, not as the hero. They still belong on the page because they show how the product is explained before login.
- **No mobile strip.** We did not have phone screenshots. Empty `mobile: []` hides that section (same pattern as ALKAMA).
- **Client = “Eget projekt”.** Homepage heading updated to: “Projekt som jag har byggt för mig själv och företag” — so Andalus and client work can sit together without pretending everything is a client job.
- **Stack = React, Firebase, Hostinger.** Google AI Studio is in the solution text (how it was built), not in the stack list (that list is what the app runs on).
- **Theme `--project-theme-andalus`** (`#e4f3ee`), `dark: false`, because the card is a light calendar UI.
- **Tags = React, Firebase, Kalender.** “Produkt” felt off next to the other projects (those tags are tech or industry, not “this is my own product”).

**Later the same day — sharper screenshots**

Chat-compressed images were 1024px and looked blurry. Marcel replaced all eight PNGs on disk (~1890–1920px). Landing shots are now light mode (same as the in-app views), so gallery copy no longer says “mörkt läge”.

**Cost:** $0 extra. Only files in this repo; Hostinger deploy is already paid.

**Next for Marcel:** Hard-refresh `/projects/andalus-calendar/`. Then commit and push when it feels right.
