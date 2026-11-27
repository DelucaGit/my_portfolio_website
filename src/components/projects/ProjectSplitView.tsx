import type { ReactNode } from "react";
import {
  getProjectView,
  type Project,
  type ProjectView,
} from "@/lib/projects";
import ProjectSplitViewClient from "./ProjectSplitViewClient";

/**
 * What the split view shows of a project, and so all of it that reaches the
 * browser: no walkthrough, no main picture.
 */
export type SplitViewProject = Pick<
  ProjectView,
  | "slug"
  | "name"
  | "year"
  | "tagline"
  | "caseHref"
  | "host"
  | "site"
  | "githubUrl"
  | "preview"
  | "facts"
>;

function toSplitViewProject(project: Project): SplitViewProject {
  const view = getProjectView(project);
  return {
    slug: view.slug,
    name: view.name,
    year: view.year,
    tagline: view.tagline,
    caseHref: view.caseHref,
    host: view.host,
    site: view.site,
    githubUrl: view.githubUrl,
    preview: view.preview,
    facts: view.facts,
  };
}

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
 * works without JavaScript. Each project reaches the browser as only the
 * part of the project layer's view (`getProjectView`) the split view shows,
 * never as the whole project.
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
