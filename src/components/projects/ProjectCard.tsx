import Link from "next/link";
import type { Project } from "@/lib/projects";
import { asset } from "@/lib/asset";
import styles from "./ProjectCard.module.css";

type ProjectCardProps = {
  project: Project;
  featured?: boolean;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      className={`${styles.card} ${project.theme.dark ? styles.cardDark : ""}`}
      style={{ background: project.theme.bg }}
    >
      <div className={styles.copy}>
        <h3 className={styles.name}>{project.name}</h3>
        <p className={styles.tagline}>{project.tagline}</p>
      </div>

      <div className={styles.media}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(project.image)}
          alt={project.imageAlt}
          className={styles.image}
        />
      </div>

      <span className={styles.cta}>
        Läs mer <span aria-hidden="true">→</span>
      </span>

      <Link
        href={`/projects/${project.slug}`}
        className={styles.link}
        aria-label={`${project.name}. Läs mer`}
      />
    </article>
  );
}
