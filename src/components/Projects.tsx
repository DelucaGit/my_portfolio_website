import Link from "next/link";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getFeaturedProjects } from "@/lib/projects";
import styles from "./Projects.module.css";

export default function Projects() {
  const projects = getFeaturedProjects(3);

  return (
    <section
      id="projects"
      className={styles.section}
      aria-labelledby="projects-heading"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Projekt</p>
          <h2 id="projects-heading" className={styles.heading}>
            Ett urval av det jag byggt åt riktiga företag.
          </h2>
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
