import ProjectSplitView from "@/components/projects/ProjectSplitView";
import SiteLink from "@/components/SiteLink";
import { site } from "@/data/site";
import { getAllProjects } from "@/lib/projects";
import shared from "@/styles/shared.module.css";
import styles from "./ProjectsArchive.module.css";

/**
 * The project archive (/projects): every project, the featured one too,
 * newest first, in the same split view as the start page.
 */
export default function ProjectsArchive() {
  const text = site.projectsPage;

  return (
    <div className={`${shared.wrap} ${styles.page}`}>
      <p className={styles.back}>
        <SiteLink href="/">
          <span aria-hidden="true">←</span> {text.back}
        </SiteLink>
      </p>

      <ProjectSplitView
        projects={getAllProjects()}
        label={text.heading}
        header={
          <header className={styles.header}>
            <p className={styles.label}>
              {text.eyebrow} <span aria-hidden="true">·</span> {text.note}
            </p>
            <h1 className={styles.heading}>{text.heading}</h1>
            <p className={styles.text}>{text.text}</p>
          </header>
        }
      />
    </div>
  );
}
