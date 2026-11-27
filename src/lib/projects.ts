import {
  projects,
  type Project,
  type ProjectSlug,
} from "@/data/projects";
import { site } from "@/data/site";
import { asset } from "@/lib/asset";
import { getAdjacent } from "./adjacent";
import { getBuildInputs } from "./build-inputs";
import { withoutProtocol } from "./contact";

export type { Project, ProjectSlug };

/**
 * The slug of the featured project: `featuredProject` in src/data/site.ts.
 * This is the only place that reads that line.
 */
function featuredSlug(): string {
  // Only for the tests' own build, which next.config.ts sends to
  // out-featured/ and never to out/: it stands in for a changed line.
  const { featuredForTest } = getBuildInputs();
  if (featuredForTest) return featuredForTest;
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
function getProjectPreview(project: Project): ProjectPreview {
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
function getProjectWalkthrough(project: Project): Walkthrough | null {
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
function getProjectHost(project: Project): string {
  if (!project.siteUrl) return project.name;
  return withoutProtocol(project.siteUrl).replace(/\/.*$/, "");
}

/**
 * True when the customer has closed the project's site, so the button to it
 * must not be a link. This is the one answer for the whole site:
 *  1. `siteStatus: "ended"` on the project in src/data/projects.ts always wins.
 *  2. Otherwise, in the tests' own build only, E2E_ENDED_PROJECT.
 *  3. Otherwise the link check decides: ended only when the domain does not
 *     exist or answers 404 or 410. Unknown (timeout, 5xx …) is not ended.
 * Both come in through getBuildInputs (src/lib/build-inputs.ts).
 */
function hasEndedSite(project: Project): boolean {
  if (project.siteStatus === "ended") return true;
  const { endedForTest, checkedSites } = getBuildInputs();
  // Only for the tests' own build, which next.config.ts sends to out-ended/
  // and never to out/: it stands in for `siteStatus: "ended"` on one project.
  if (endedForTest && project.slug === endedForTest) return true;
  if (!project.siteUrl) return false;
  return checkedSites[project.siteUrl]?.status === "ended";
}

/**
 * The project a slug in src/data names. The type only lets through slugs
 * that are in src/data/projects.ts, so there is always a project.
 */
export function getProject(slug: ProjectSlug): Project {
  const project = getProjectBySlug(slug);
  if (!project) throw new Error(`No project with the slug "${slug}"`);
  return project;
}

/** The project for a slug from outside the code, such as a page address. */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectSlugs(): string[] {
  return getProjectsNewestFirst().map((project) => project.slug);
}

/** The projects before and after one in the archive's order, as views. */
export function getAdjacentProjects(slug: string): {
  prev: ProjectView | null;
  next: ProjectView | null;
} {
  const { prev, next } = getAdjacent(getProjectsNewestFirst(), slug);
  return {
    prev: prev && getProjectView(prev),
    next: next && getProjectView(next),
  };
}

/**
 * Where a project's live site stands, as one value: live at an address, ended
 * by the customer, or no site at all. Asking for this instead of reading
 * `siteUrl` means no caller can forget to ask whether the site has ended.
 */
export type ProjectSite =
  | { state: "live"; url: string }
  | { state: "ended" }
  | { state: "none" };

/** The state of the project's live site. See `hasEndedSite` for "ended". */
function getProjectSite(project: Project): ProjectSite {
  if (!project.siteUrl) return { state: "none" };
  if (hasEndedSite(project)) return { state: "ended" };
  return { state: "live", url: project.siteUrl };
}

/**
 * A project as a visitor sees it, put together in one place: where its case
 * page is, what stands in the address bar, its site, its code, its pictures
 * and its facts. Every file path is already versioned with `asset()`, so the
 * value can go straight into the HTML or to a client component.
 */
export type ProjectView = {
  slug: string;
  name: string;
  year: number;
  tagline: string;
  /** The project's case page */
  caseHref: string;
  /** The text in a browser window's address bar, see `getProjectHost` */
  host: string;
  site: ProjectSite;
  /** Empty when the project has no public code */
  githubUrl: string;
  /** The 2:1 screenshot, versioned */
  preview: ProjectPreview;
  /**
   * The project's main picture, versioned: shown where it has no film, and
   * the picture a share preview uses
   */
  image: { src: string; alt: string };
  /** The recorded walkthrough with versioned files, or null without one */
  walkthrough: Walkthrough | null;
  facts: {
    /** The project's tags: "Next.js · Tailwind · Lokalt" */
    type: string;
    /** The project's stack: "Next.js · TypeScript · Tailwind CSS" */
    builtWith: string;
  };
};

/** The one place a project is put together for a page. */
export function getProjectView(project: Project): ProjectView {
  const preview = getProjectPreview(project);
  const walkthrough = getProjectWalkthrough(project);
  return {
    slug: project.slug,
    name: project.name,
    year: project.year,
    tagline: project.tagline,
    caseHref: `/projects/${project.slug}`,
    host: getProjectHost(project),
    site: getProjectSite(project),
    githubUrl: project.githubUrl,
    preview: { large: asset(preview.large), small: asset(preview.small) },
    image: { src: asset(project.image), alt: project.imageAlt },
    walkthrough: walkthrough && {
      ...walkthrough,
      webm: asset(walkthrough.webm),
      mp4: asset(walkthrough.mp4),
      poster: asset(walkthrough.poster),
    },
    facts: {
      type: project.tags.join(" · "),
      builtWith: project.stack.join(" · "),
    },
  };
}
