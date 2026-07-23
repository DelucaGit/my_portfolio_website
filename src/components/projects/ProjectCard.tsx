import Link from "next/link";
import type { CSSProperties } from "react";
import type { Project } from "@/lib/projects";
import styles from "./ProjectCard.module.css";

type ProjectCardProps = {
  project: Project;
  /** Side-by-side layout on desktop (homepage featured list) */
  featured?: boolean;
};

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  return (
    <article
      className={[
        styles.card,
        featured ? styles.cardFeatured : "",
        project.theme.dark ? styles.cardDark : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          "--project-card-bg": project.theme.bg,
        } as CSSProperties
      }
    >
      <div className={styles.media}>
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
          Läs berättelsen <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
