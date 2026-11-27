# Glossary

The domain language of this portfolio. Code, issues and PRs use these words.

**Project**:
One piece of work shown in the portfolio, with its own case study page at `/projects/<slug>/`. Defined in `src/data/projects.ts`.
_Avoid_: case, work item

**Service**:
Something Marcel offers to clients (a tjänst), with its own page at `/services/<slug>/`. Defined in `src/data/services.ts`.
_Avoid_: offering, product

**Case study**:
The detail page for a Project: header, hero image, stack, challenge and solution, results, then its media sections.

**Media section**:
One block of screenshots on a case study, with its own copy (eyebrow, heading, optional support text). Kinds: `phones`, `split`, `scrollFrame`, `gallery`. A case study shows only the media sections its Project lists, in that order; nothing is filled in by default.
_Avoid_: slot, media block
