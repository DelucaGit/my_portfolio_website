# Glossary

The words this site is built with. The visitor reads them in Swedish; code, comments and issues use the English name.

## The site

| Swedish | English (in code) | Meaning | Where |
|---|---|---|---|
| Tyngdlös | Tyngdlös | The site's design: theme, fonts, menu, footer, hero ring | `src/theme.css`, `src/components/` |
| Utvalt projekt | featured project | The one project at the top of the project section, with its walkthrough. Chosen by one line in the data | `featuredProject` in `src/data/site.ts`, `getFeaturedProject()` |
| Delad vy | split view | Project names on one side, a preview window on the other that follows the scroll. On the start page and in the archive | `ProjectSplitView`, `ProjectSplitViewClient` |
| Förhandsvisning | preview window | The split view's window that shows the active project | `previewWindow()` in the tests |
| Projektarkivet | project archive | `/projects`: every project in the split view, newest first | `ProjectsArchive` |
| Case, projektsida | case page | `/projects/<slug>`: one project told in sections | `ProjectCaseStudy`, `getCasePage()` |
| Inspelad genomgång | walkthrough | A recorded film of a project's live site, with timed steps | `walkthrough` in the data, `public/walkthroughs/`, `npm run record:walkthrough` |
| Om mig | about | The about section on the start page, filled in word by word on scroll | `About` |
| Vad jag gör | what I do | The three cards under Om mig | `WhatIDo` |
| Vägen hit | timeline | Education and work, from the CV data | `Timeline`, `getTimeline()` |
| Tjänster | services | The service pages under `/services` | `src/data/services.ts`, `ServiceCaseStudy` |

## A project

| Swedish | English (in code) | Meaning | Where |
|---|---|---|---|
| Projektlagret | project layer | Where components get projects and every fact derived from one. Components import it only through `@/lib/projects` (lint enforces it) | `src/lib/projects.ts` and the modules it re-exports |
| Projektvyn | project view | What a visitor sees of one project: case link, address, site state, code link, picture, previews, walkthrough, facts | `getProjectView()`, `ProjectView` |
| Projektets filer | project files | Where a project's files live, by slug: previews, picture, case media, films | `src/lib/project-files.ts`, `public/projects/<slug>/`, `public/previews/` |
| Sidans läge | site state | live (with its address), ended, or none (the project has no live site) | `ProjectSite` |
| Kunden har avslutat projektet | ended | The customer has closed the site: the "Besök sidan" button stands switched off | `siteStatus: "ended"` in the data, or the link check |
| Länkkontrollen | link check | Asks every live site if it is still there, before the build | `scripts/check-sites.mjs`, `site-check.json`, `src/lib/site-check.ts` |
| Sektioner | case sections | The case page's parts, in order, with their fallback texts already chosen | `CaseSection` in `src/lib/case-page.ts` |
| Slug | slug | A project's id: its address, its folder and its file names | `ProjectSlug` |
