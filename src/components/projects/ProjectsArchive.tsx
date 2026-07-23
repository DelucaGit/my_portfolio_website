import Link from "next/link";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getAllProjects } from "@/lib/projects";
import styles from "./ProjectsArchive.module.css";

export function ProjectsArchive() {
  const projects = getAllProjects();

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.back}>
          <Link href="/">← Tillbaka till startsidan</Link>
        </p>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Portfolio</p>
          <h1 className={styles.heading}>Alla projekt</h1>
          <p className={styles.support}>
            Hemsidor, butiker och system — från första samtalet till något som
            faktiskt hjälper affären.
          </p>
        </header>

        <ul className={styles.grid}>
          {projects.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
