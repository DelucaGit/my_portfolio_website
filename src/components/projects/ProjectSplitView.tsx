import type { ReactNode } from "react";
import { asset } from "@/lib/asset";
import {
  getProjectHost,
  getProjectPreview,
  hasEndedSite,
  type Project,
} from "@/lib/projects";
import ProjectSplitViewClient, {
  type SplitViewProject,
} from "./ProjectSplitViewClient";

type ProjectSplitViewProps = {
  /** The projects, in the order they are listed. */
  projects: Project[];
  /** The name of the list for screen readers, for example "Fler projekt". */
  label: string;
  /** Shown above the list, in the list's column: usually a heading. */
  header?: ReactNode;
  /** Shown under the list, in the list's column: usually a link onwards. */
  footer?: ReactNode;
};

/** Only what the view shows of a project, so the rest stays out of the browser. */
function toSplitViewProject(project: Project): SplitViewProject {
  const preview = getProjectPreview(project);
  return {
    slug: project.slug,
    name: project.name,
    year: project.year,
    tagline: project.tagline,
    host: getProjectHost(project),
    type: project.tags.join(" · "),
    builtWith: project.stack.join(" · "),
    caseHref: `/projects/${project.slug}`,
    siteUrl: project.siteUrl,
    siteEnded: hasEndedSite(project),
    githubUrl: project.githubUrl,
    image: asset(preview.large),
    imageSmall: asset(preview.small),
  };
}

/**
 * The split view: a list of projects and a preview window.
 *
 * From 1024 px the names stand large on the left and one window on the right
 * stays under the menu and shows the active project: screenshot, facts and
 * buttons. The active project follows the scroll, the pointer and the
 * keyboard. Below 1024 px every project is a row with a small screenshot.
 *
 * It knows nothing about the page it is on: give it any ordered list of
 * projects. The names and links are in the HTML from the start, so the list
 * works without JavaScript.
 */
export default function ProjectSplitView({
  projects,
  label,
  header,
  footer,
}: ProjectSplitViewProps) {
  if (projects.length === 0) return null;
  return (
    <ProjectSplitViewClient
      projects={projects.map(toSplitViewProject)}
      label={label}
      header={header}
      footer={footer}
    />
  );
}
