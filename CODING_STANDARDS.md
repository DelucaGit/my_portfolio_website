# Coding standards

Judgement calls for review. Rules a tool can check live in `eslint.config.mjs`, TypeScript and the Playwright suite instead.

## Content lives in the data layer

- Every text a visitor reads lives in `src/data/`. Components render it; they hold no copy of their own.
- Keys are in English, the site text is in Swedish.
- A project that the data points to by slug (`featuredProject`, a card's `project`) is named through that slug only. Running text that also spells out the project's name drifts from the slug the day someone changes it.

## Components ask the project layer

- Components and pages get projects from `src/lib/projects.ts` (lint enforces the import). Derived facts belong there too: a project's address, whether its site has ended, its walkthrough. When the same derivation shows up in two components, it moves into the project layer.

## One test seam

- Tests are Playwright against the built static site, and they do what a visitor does: scroll, point, press keys, read what is on screen and what a screen reader gets.
- A good test names a behaviour ("when I scroll past TakKoll the window shows TakKoll") and breaks only when that behaviour breaks.
- Tests leave internal functions, component state and CSS class names alone.
- Test-only switches (`E2E_*` variables) build into their own output folder and never change the build Hostinger publishes.

## Style

- CSS modules, using the colour variables in `src/theme.css` (`--bg`, `--card`, `--ink`, `--mut`, `--accent` and the rest). New code uses these names directly.
- New code matches the surrounding file: naming, structure, how it reaches shared pieces in `src/components/ui/` and `src/styles/shared.module.css`.
