import FeaturedProject from "@/components/projects/FeaturedProject";
import ProjectSplitView from "@/components/projects/ProjectSplitView";
import SiteLink from "@/components/SiteLink";
import { site } from "@/data/site";
import { getHomeProjects } from "@/lib/projects";
import home from "@/styles/homeSection.module.css";
import shared from "@/styles/shared.module.css";
import styles from "./Projects.module.css";

/**
 * The project section on the start page: the featured project as a card,
 * then the next projects in the split view, then the way to all of them.
 */
export default function Projects() {
  const more = site.projects.more;

  return (
    <section
      id="projekt"
      className={home.sec}
      aria-labelledby="projects-heading"
    >
      <div className={shared.wrap}>
        <h2 id="projects-heading" className={shared.vh}>
          {site.projects.heading}
        </h2>
        <FeaturedProject />

        <div className={styles.more}>
          <ProjectSplitView
            projects={getHomeProjects()}
            label={more.heading}
            header={
              <div className={home.top}>
                <h3 className={home.heading}>{more.heading}</h3>
                <p>{more.note}</p>
              </div>
            }
            footer={
              <p className={styles.all}>
                <SiteLink
                  href={more.all.href}
                  className={`${shared.pill} ${shared.pillLine}`}
                >
                  {more.all.name} <span aria-hidden="true">→</span>
                </SiteLink>
              </p>
            }
          />
        </div>
      </div>
    </section>
  );
}
