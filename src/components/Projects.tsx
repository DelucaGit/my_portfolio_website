import Link from "next/link";
import type { Project } from "@/lib/projects";
import { getAllProjects } from "@/lib/projects";
import styles from "./Projects.module.css";

export default function Projects() {
  const projects = getAllProjects();

  return (
    <section className={styles.section} aria-labelledby="projects-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Selected work</p>
          <h2 id="projects-heading" className={styles.heading}>
            Projects
          </h2>
        </header>

        <ul className={styles.list}>
          {projects.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={styles.card}>
      <div className={styles.media} style={{ background: project.theme.bg }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image}
          alt={project.imageAlt}
          className={styles.image}
        />
      </div>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.year}>{project.year}</span>
          <ul className={styles.tags}>
            {project.tags.map((tag) => (
              <li key={tag} className={styles.tag}>
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <h3 className={styles.name}>{project.name}</h3>
        <p className={styles.tagline}>{project.tagline}</p>

        <ul className={styles.stack}>
          {project.stack.map((item) => (
            <li key={item} className={styles.stackItem}>
              {item}
            </li>
          ))}
        </ul>

        <Link href={`/projects/${project.slug}`} className={styles.viewLink}>
          View project <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
