"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { projects, type Project } from "@/data/projects";
import styles from "./projectsShowcase.module.css";

function getActiveIndex(frames: HTMLDivElement[]) {
  const centerY = window.innerHeight / 2;
  let nextIndex = 0;

  for (let i = 0; i < frames.length; i++) {
    const { bottom } = frames[i].getBoundingClientRect();
    if (bottom < centerY) {
      nextIndex = i + 1;
    }
  }

  return Math.min(nextIndex, frames.length - 1);
}

export default function ProjectsShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const updateActiveIndex = () => {
      const frames = frameRefs.current.filter(Boolean) as HTMLDivElement[];
      if (frames.length === 0) return;

      const nextIndex = getActiveIndex(frames);
      setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
    };

    updateActiveIndex();
    window.addEventListener("scroll", updateActiveIndex, { passive: true });
    window.addEventListener("resize", updateActiveIndex);

    const section = sectionRef.current;
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateActiveIndex)
        : null;

    if (section && resizeObserver) {
      resizeObserver.observe(section);
    }

    return () => {
      window.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
      resizeObserver?.disconnect();
    };
  }, []);

  const activeTheme = projects[activeIndex].theme;

  return (
    <section
      ref={sectionRef}
      id="work"
      className={styles.section}
      aria-label="Selected work"
      style={
        {
          "--project-bg": activeTheme.bg,
          "--project-text": activeTheme.dark ? "#ffffff" : "#000000",
          "--project-text-muted": activeTheme.dark
            ? "rgba(255,255,255,0.6)"
            : "#3c4043",
          "--project-dot": activeTheme.dark
            ? "rgba(255,255,255,0.25)"
            : "var(--color-btn-secondary)",
          "--project-dot-active": activeTheme.dark ? "#ffffff" : "#000000",
          "--project-eyebrow": activeTheme.dark
            ? "rgba(255,255,255,0.45)"
            : "var(--color-text-muted)",
        } as React.CSSProperties
      }
    >
      <div className={styles.showcase}>
        <div className={styles.leftColumn}>
          <div className={styles.stickyPanel}>
            <p className={styles.eyebrow}>Selected work</p>

            <div className={styles.copyArea}>
              {projects.map((project, index) => (
                <ProjectCopy
                  key={project.id}
                  project={project}
                  isActive={index === activeIndex}
                />
              ))}
            </div>

            <div className={styles.progress} aria-hidden="true">
              {projects.map((project, index) => (
                <span
                  key={project.id}
                  className={`${styles.progressDot} ${
                    index === activeIndex ? styles.progressDotActive : ""
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          {projects.map((project, index) => (
            <div key={project.id} className={styles.imagePanel}>
              <div
                ref={(node) => {
                  frameRefs.current[index] = node;
                }}
                className={styles.imageFrame}
              >
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  sizes="(max-width: 900px) 100vw, 55vw"
                  className={styles.image}
                  priority={index === 0}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCopy({
  project,
  isActive,
}: {
  project: Project;
  isActive: boolean;
}) {
  return (
    <article
      className={`${styles.projectCopy} ${isActive ? styles.projectCopyActive : ""}`}
      aria-hidden={!isActive}
    >
      <h2 className={styles.projectTitle}>{project.title}</h2>
      <p className={styles.projectDescription}>{project.description}</p>
    </article>
  );
}
