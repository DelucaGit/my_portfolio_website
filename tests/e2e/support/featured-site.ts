import { getProjectWalkthrough, type Project } from "@/lib/projects";
import { FEATURED_PORT } from "./ports";
import { allProjects, homeProjects } from "./site";

/**
 * A third copy of the site, built only for the tests, in which another
 * project is the featured one. It shows what happens when the one line
 * `featuredProject` in src/data/site.ts is changed.
 *
 * `build-test-sites.ts` builds it into out-featured/ before the tests start
 * and the suite serves it on its own port. It is the real site built by the
 * real `next build`; E2E_FEATURED_PROJECT stands in for the changed line (see
 * `featuredSlug` in src/lib/projects.ts).
 */
export const FEATURED_SITE = `http://127.0.0.1:${FEATURED_PORT}`;

/**
 * The project that is featured in that copy: the newest other project
 * without a recorded walkthrough, so the copy also shows what the card looks
 * like without a film.
 */
export function otherFeaturedProject(): Project {
  const other = homeProjects().find(
    (project) => !getProjectWalkthrough(project),
  );
  if (!other) throw new Error("featured-site: every project has a walkthrough");
  return other;
}

/**
 * The projects the start page of that copy lists under the featured one:
 * newest first, without the new featured project, nine of them. Worked out
 * here from the whole list, not by the site's own helper.
 */
export function homeProjectsWhenChanged(): Project[] {
  const other = otherFeaturedProject();
  return allProjects()
    .filter((project) => project.slug !== other.slug)
    .slice(0, 9);
}
