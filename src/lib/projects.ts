import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  projects as projectData,
  type Project,
  type ProjectSlug,
} from "@/data/projects";
import { site } from "@/data/site";

export type { Project, ProjectSlug };

/*
 * The two test hooks below are set only by the Playwright suite's own builds
 * (tests/e2e/support/build-test-sites.ts). Hostinger runs its own build from
 * the repository, where neither variable is set, so they never change the
 * published site. next.config.ts also sends those test builds to their own
 * folders, so a local `out/` is never overwritten by one.
 */
/** One project's slug: that project gets `siteStatus: "ended"`. */
const ENDED_FOR_TEST = process.env.E2E_ENDED_PROJECT;
/** See `featuredSlug`. */
const FEATURED_FOR_TEST = process.env.E2E_FEATURED_PROJECT;

/**
 * The projects in src/data/projects.ts. In the tests' build with an ended
 * project, that project carries `siteStatus: "ended"`, as if the line had
 * been added to the data file, so the real field is what the test exercises.
 */
const projects: Project[] = ENDED_FOR_TEST
  ? projectData.map((project) =>
      project.slug === ENDED_FOR_TEST
        ? { ...project, siteStatus: "ended" }
        : project,
    )
  : projectData;

/**
 * The slug of the featured project: `featuredProject` in src/data/site.ts.
 * This is the only place that reads that line.
 */
function featuredSlug(): string {
  // Only in the tests' own build (see above): it stands in for a changed line.
  if (FEATURED_FOR_TEST) return FEATURED_FOR_TEST;
  const slug: ProjectSlug = site.featuredProject;
  return slug;
}

/** Newest year first; keep original order within the same year. */
function getProjectsNewestFirst(): Project[] {
  return [...projects].sort((a, b) => b.year - a.year);
}

export function getAllProjects(): Project[] {
  return getProjectsNewestFirst();
}

/**
 * The projects under the featured one on the start page: newest first,
 * without the featured project, so that the page shows `homeProjectCount`
 * projects in all.
 */
export function getHomeProjects(): Project[] {
  const featured = featuredSlug();
  return getProjectsNewestFirst()
    .filter((project) => project.slug !== featured)
    .slice(0, site.homeProjectCount - 1);
}

/** A project's screenshot in the preview format: 2:1, in two sizes. */
export type ProjectPreview = {
  /** 1280 x 640 */
  large: string;
  /** 640 x 320 */
  small: string;
};

/**
 * The project's 2:1 screenshot for the split view. The files are in
 * public/previews/, named by the slug: `<slug>.webp` and `<slug>-sm.webp`.
 * (`project.image` has another shape for every project.)
 */
export function getProjectPreview(project: Project): ProjectPreview {
  return {
    large: `/previews/${project.slug}.webp`,
    small: `/previews/${project.slug}-sm.webp`,
  };
}

/** The project `featuredProject` in src/data/site.ts points at. */
export function getFeaturedProject(): Project {
  const slug = featuredSlug();
  const project = projects.find((candidate) => candidate.slug === slug);
  // The type of `featuredProject` only allows slugs that exist, so the real
  // line always finds one. This stops a test build that names a wrong slug.
  if (!project) throw new Error(`No project has the slug "${slug}"`);
  return project;
}

/** A recorded walkthrough, ready to play: the files plus what happens when. */
export type Walkthrough = {
  webm: string;
  mp4: string;
  /** The still image shown before the film plays, and instead of it when motion is not wanted */
  poster: string;
  /** Seconds */
  duration: number;
  steps: WalkthroughStep[];
};

export type WalkthroughStep = {
  /** The second the step starts */
  at: number;
  text: string;
};

/**
 * The project's recorded walkthrough, or null when it has none (the caller
 * then shows the project's screenshot). The films are in public/walkthroughs/.
 */
export function getProjectWalkthrough(project: Project): Walkthrough | null {
  if (!project.walkthrough) return null;
  const base = `/walkthroughs/${project.slug}`;
  return {
    webm: `${base}.webm`,
    mp4: `${base}.mp4`,
    poster: `${base}.webp`,
    duration: project.walkthrough.duration,
    steps: project.walkthrough.steps.map(([at, text]) => ({ at, text })),
  };
}

/**
 * What stands in a browser window's address bar for the project:
 * "andaluscalendar.com", or the project's name when it has no live site.
 */
export function getProjectHost(project: Project): string {
  if (!project.siteUrl) return project.name;
  return project.siteUrl
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/\/.*$/, "");
}

/** What the link check (scripts/check-sites.mjs) wrote about one address. */
type CheckedSite = { status?: string };

let checkedSites: Record<string, CheckedSite> | undefined;

/**
 * The link check's result file, written by `npm run check:sites`. It is not
 * in git, so Hostinger's build never has it: there no site counts as ended
 * through the check, only through `siteStatus: "ended"`.
 * SITE_CHECK_FILE points at another file (the tests use that).
 */
function getCheckedSites(): Record<string, CheckedSite> {
  if (checkedSites) return checkedSites;
  const file =
    process.env.SITE_CHECK_FILE || join(process.cwd(), "site-check.json");
  try {
    const result = JSON.parse(readFileSync(file, "utf8")) as {
      sites?: Record<string, CheckedSite>;
    };
    checkedSites = result.sites ?? {};
  } catch {
    // No file, or a broken one: nothing is known, so every button stays.
    checkedSites = {};
  }
  return checkedSites;
}

/**
 * True when the customer has closed the project's site, so the button to it
 * must not be a link. This is the one answer for the whole site:
 *  1. `siteStatus: "ended"` on the project in src/data/projects.ts always wins.
 *  2. Otherwise the link check decides: ended only when the domain does not
 *     exist or answers 404 or 410. Unknown (timeout, 5xx …) is not ended.
 */
export function hasEndedSite(project: Project): boolean {
  if (project.siteStatus === "ended") return true;
  if (!project.siteUrl) return false;
  return getCheckedSites()[project.siteUrl]?.status === "ended";
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectSlugs(): string[] {
  return getProjectsNewestFirst().map((project) => project.slug);
}

export function getAdjacentProjects(slug: string): {
  prev: Project | null;
  next: Project | null;
} {
  const ordered = getProjectsNewestFirst();
  const index = ordered.findIndex((project) => project.slug === slug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? ordered[index - 1] : null,
    next: index < ordered.length - 1 ? ordered[index + 1] : null,
  };
}
