import Link from "next/link";
import type { Project } from "@/lib/projects";
import { asset } from "@/lib/asset";
import styles from "./ProjectCard.module.css";

type ProjectCardProps = {
  project: Project;
  /** Kept for call-site compatibility; layout is the same for all cards. */
  featured?: boolean;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className={styles.card}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(project.image)}
        alt={project.imageAlt}
        className={styles.image}
      />

      <div className={styles.overlay}>
        <div className={styles.copy}>
          <p className={styles.year}>{project.year}</p>
          <h3 className={styles.name}>{project.name}</h3>
          <p className={styles.tagline}>{project.tagline}</p>
          <span className={styles.cta} aria-hidden="true">
            Läs berättelsen →
          </span>
        </div>
      </div>

      <Link
        href={`/projects/${project.slug}`}
        className={styles.link}
        aria-label={`${project.name} — läs berättelsen`}
      />
    </article>
  );
}
