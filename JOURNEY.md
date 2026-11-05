# Portfolio journey

A running log of what we built, what we chose, and why. Written so a later article can tell the story without reconstructing it from git.

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
