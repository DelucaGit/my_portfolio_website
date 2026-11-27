import { getProjectView, type Project } from "@/lib/projects";
import { ENDED_PORT } from "./ports";
import { featuredProject, homeProjects } from "./site";

/**
 * A second copy of the site, built only for the tests, in which two
 * customers have closed their sites. No real project has ended, so the
 * normal build cannot show that state.
 *
 * `build-test-sites.ts` builds it into out-ended/ before the tests start and
 * the suite serves it on its own port. It is the real site built by the real
 * `next build`, with two inputs changed:
 *  - one project is marked as ended by hand (E2E_ENDED_PROJECT stands in for
 *    `siteStatus: "ended"` in src/data/projects.ts), and
 *  - the link check's result file says another project's site is gone and
 *    that a third could not be reached.
 */
export const ENDED_SITE = `http://127.0.0.1:${ENDED_PORT}`;

function pick(projects: Project[], part: string): Project {
  const project = projects[0];
  if (!project) throw new Error(`ended-site: no project to play "${part}"`);
  return project;
}

/**
 * The cast: which project plays which part. Read from the data layer, so the
 * tests follow when the featured project or the order changes.
 */
export function endedCast() {
  const featured = featuredProject();
  const others = homeProjects().filter(
    (project) =>
      getProjectView(project).site.state === "live" &&
      project.siteUrl !== featured.siteUrl,
  );
  return {
    /** Marked as ended by hand. The featured project, so the card shows it. */
    markedEnded: pick(
      getProjectView(featured).site.state === "live" ? [featured] : [],
      "marked as ended",
    ),
    /** The link check found its site gone. In the start page's split view. */
    foundEnded: pick(others, "found ended"),
    /** The link check could not reach its site: the button must stay. */
    unreachable: pick(others.slice(1), "unreachable"),
    /** Nothing has happened to its site. */
    untouched: pick(others.slice(2), "untouched"),
  };
}
