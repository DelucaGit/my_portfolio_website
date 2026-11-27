import type { ReactNode } from "react";
import { getProjectView, type Project } from "@/lib/projects";
import ProjectSplitViewClient from "./ProjectSplitViewClient";

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
 * works without JavaScript. Each project reaches the browser as the project
 * layer's view of it (`getProjectView`), never as the whole project.
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
      projects={projects.map(getProjectView)}
      label={label}
      header={header}
      footer={footer}
    />
  );
}
