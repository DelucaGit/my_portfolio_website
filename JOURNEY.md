# Portfolio journey

A running log of what we built, what we chose, and why. Written so a later article can tell the story without reconstructing it from git.

## 26 Nov 2026 — The whole site in the Tyngdlös design (#52–#62)

**Goal:** Rebuild the portfolio in the design from the prototype rounds (#47–#51): a paper-coloured page, a light and a dark theme, painted landscapes behind browser windows, and a project list you can browse without clicking into every case. The PRD is #52. It was built as ten issues (#53–#62) on the branch `feat/tyngdlos`, one branch per issue.

**What we built**
- **#53 Shell:** `dev` and `build` run with `--webpack`. Colour tokens for both themes in `theme.css`, the fonts Google Sans Flex and Geist Mono, a theme switcher (system, light, dark) that is set by a small script before the first paint, the sticky menu, the footer with the name as a wordmark and the skip link. Playwright was set up here: the repo had no automated tests before
- **#54 Hero:** a ring of strokes in WebGL that follows the pointer. It stands still with reduced motion and has a drawn fallback without WebGL or JavaScript
- **#55 Featured project:** a card with a recorded walkthrough of the real site and a line under the film that says what happens. The recording script from the prototype moved in as `scripts/record-walkthrough.mjs`
- **#56 Split view:** the nine next projects as names on the left and a preview window on the right that stays in place. Scroll, pointer and keyboard pick the project. Rows below 1024 px
- **#57 Archive and project pages:** `/projects/` is the same split view with every project. The case pages got the new style and links to the project before and after
- **#58 Link check:** `scripts/check-sites.mjs` asks every customer site before the build. A site that is gone gets the button "Kunden har avslutat projektet". The deploy also runs once a month
- **#59 Om mig and Vad jag gör:** a text that fills in word by word, and three cards
- **#60 Teknik, Vägen hit and Kontakt:** tools grouped by use, a timeline read from the CV data, and a button that copies the e-mail address
- **#61 CV and service pages:** the CV in the new style with a print version. The service pages only got the new menu, footer and colours
- **#62 Final check:** the gaps in the test suite, the loose ends below and the README

**The start page now:** Hero → Projekt (featured card, then "Fler projekt") → Om mig → Vad jag gör → Teknik → Vägen hit → Kontakt.

**Gone:** the grid of project cards (`ProjectCard`), the stack cards with brand logos (`Stack`, `StackIcons`, `public/icons/`), the old pastel theme tokens (`--color-*`, `--project-theme-*` and the rest) and the `theme` field on a project. Older entries in this log describe those parts as they were.

**Decisions**
- **Webpack, not Turbopack.** Turbopack is the default in Next.js 16, but the site it builds does not work once it is on Hostinger. Still a static export, still uploaded with FTP
- **One line picks the featured project.** `featuredProject` in `site.ts` is a slug, and its type is the list of slugs that exist, so a wrong slug stops the build. The card, Om mig and the card "Egna produkter" all ask the project layer, which is the only place that reads the line. `homeProjectCount` is the other line: how many projects the start page shows
- **What the line does not change:** the card "Hemsidor åt kunder" has its own project (`whatIDo.clients.project`) and its text names FC Växjö Reborn in plain words. The CV names projects too
- **Components never read the project data.** They ask `src/lib/projects.ts`. That is what made the link check and the featured project possible to change in one place
- **A site is "ended" only on a clear answer:** the domain does not exist, or the site answers 404 or 410. A timeout or a server error is "unknown" and the button stays. The site must never say a customer has left when their site is only down for a moment. `siteStatus: "ended"` on a project wins over the check, for a domain someone else has taken over
- **The link check cannot stop a deploy.** It always exits with 0, and without a result file nothing counts as ended
- **The split view has two rules that never alternate.** Scroll: the name that crosses a line at 45 % of the window is active. Point: a pointer that really moves over a name, or keyboard focus, takes over until the page has scrolled 48 px. A name that scrolls in under a resting pointer is not pointed at
- **One media query in JavaScript decides between split view and rows.** The CSS only reads `data-mode`, so layout and behaviour cannot disagree. Without JavaScript the projects are rows, and every name is a link
- **Lenis is in use again,** and everything that sticks or follows the scroll works with it. With reduced motion Lenis is off and the page scrolls natively
- **The film is MP4 first, WebM second,** and its sources are only added when the card is near the screen. Playwright's WebKit on Windows otherwise held back the page's load event
- **Tests at one seam:** Playwright against the built `out/`, doing only what a visitor does. Chromium runs everything, WebKit a small tagged set

**Tests for things a normal build cannot show.** No project has ended, and the featured project is always the same one. So the suite builds two more copies of the site with the real `next build`: `out-ended/` (two projects ended) and `out-featured/` (another featured project). One environment variable each changes the input and sends the build to its own folder, so neither can end up in `out/`, the only folder that is deployed.

**Found in the final check (#62)**
- The films for FC Växjö Reborn were in `public/walkthroughs/` but the project had no `walkthrough` in the data, so they could never play. Added the steps from the prototype (17.8 s, 7 steps). A test now fails when a film has no data or data has no film
- Two scroll tests ran into the 30 second limit when the whole suite ran. Alone they passed. The helper waited 100 ms after every notch of the wheel on top of the 100 ms a notch already takes, and the test that scrolls the whole page did it in small steps all the way. Shorter pause, big steps where nothing is being looked at, three times the time limit for the two long journeys, and at most two WebKit browsers at a time
- `site.stack.eyebrow` was no longer read by anything. Removed
- The archive has an empty stretch under the list on a wide screen. It is the room that keeps the preview window in place until the last project is active. Left as it is: the window is beside it the whole time, and a shorter one lets the window scroll away before the last project shows

**Found by the link check on its first real run:** `brandsakerhetskoll.se` does not exist any more. Nothing is committed about it; the first deploy with the check will show "Kunden har avslutat projektet" for BrandsäkerhetsKoll. If the address is a typo, fix `siteUrl`.

**How to:** the README explains how to change the featured project, record a new walkthrough and mark a project as ended.

**Left open**
- The copy button does nothing without JavaScript (the address can still be selected and the mail link works). The menu button on a phone needs JavaScript too; the same links are in the footer
- `public/logo.png` and nine old screenshots under `public/projects/` are not used by any page
- The preview files in `public/previews/` are not checked: a new project without them shows an empty window

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
