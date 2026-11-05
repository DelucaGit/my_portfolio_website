import Link from "next/link";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getFeaturedProjects } from "@/lib/projects";
import styles from "./Projects.module.css";

export default function Projects() {
  const projects = getFeaturedProjects(4);

  return (
    <section
      id="projects"
      className={styles.section}
      aria-labelledby="projects-heading"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 id="projects-heading" className={styles.heading}>
            Projekt
          </h2>
          <p className={styles.support}>
            Några saker jag har byggt, egna produkter och uppdrag.
          </p>
        </header>

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
