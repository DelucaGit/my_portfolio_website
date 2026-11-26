import Link from "next/link";
import FeaturedProject from "@/components/projects/FeaturedProject";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { site } from "@/data/site";
import { getFeaturedProjects } from "@/lib/projects";
import shared from "@/styles/shared.module.css";
import styles from "./Projects.module.css";

export default function Projects() {
  const projects = getFeaturedProjects(4);

  return (
    <section
      id="projekt"
      className={styles.section}
      aria-labelledby="projects-heading"
    >
      <div className={shared.wrap}>
        <h2 id="projects-heading" className={shared.vh}>
          {site.projects.heading}
        </h2>
        <FeaturedProject />
      </div>

      {/* The old grid stays until the split view (#56) replaces it. */}
      <div className={`${styles.inner} ${styles.more}`}>
        <ul className={styles.list}>
          {projects.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} featured />
            </li>
          ))}
        </ul>

        <div className={styles.footer}>
          <Link href="/projects" className={styles.allLink}>
            Se alla projekt <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
