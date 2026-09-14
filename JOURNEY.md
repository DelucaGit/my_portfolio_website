# Portfolio journey

A running log of what we built, what we chose, and why. Written so a later article can tell the story without reconstructing it from git.

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
