import {
  projects,
  type Project,
  type ProjectSlug,
} from "@/data/projects";
import { site } from "@/data/site";

export type { Project, ProjectSlug };

/** Newest year first; keep original order within the same year. */
function getProjectsNewestFirst(): Project[] {
  return [...projects].sort((a, b) => b.year - a.year);
}

export function getAllProjects(): Project[] {
  return getProjectsNewestFirst();
}

export function getFeaturedProjects(count = 3): Project[] {
  return getProjectsNewestFirst().slice(0, count);
}

/** The project `featuredProject` in src/data/site.ts points at. */
export function getFeaturedProject(): Project {
  const slug: ProjectSlug = site.featuredProject;
  // The type of `featuredProject` only allows slugs that exist, so this always finds one.
  return projects.find((project) => project.slug === slug) as Project;
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
