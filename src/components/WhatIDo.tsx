import type { ReactNode } from "react";
import { site } from "@/data/site";
import { asset } from "@/lib/asset";
import {
  getFeaturedProject,
  getProjectBySlug,
  getProjectHost,
  type Project,
} from "@/lib/projects";
import shared from "@/styles/shared.module.css";
import section from "@/styles/homeSection.module.css";
import SiteLink from "./SiteLink";
import { BrowserWindow } from "./ui/BrowserWindow";
import { PaintedScene, type PaintingPalette } from "./ui/Painting";
import styles from "./WhatIDo.module.css";

type CardProps = {
  id: string;
  heading: string;
  text: string;
  link: { name: string; href: string };
  palette: PaintingPalette;
  /** The windows that stand on the painting. */
  children: ReactNode;
};

function Card({ id, heading, text, link, palette, children }: CardProps) {
  return (
    <article className={styles.card} aria-labelledby={id}>
      <div className={styles.text}>
        <h3 id={id}>{heading}</h3>
        <p>{text}</p>
        <SiteLink href={link.href} className={`${shared.go} ${styles.go}`}>
          {link.name} <span aria-hidden="true">→</span>
        </SiteLink>
      </div>
      <PaintedScene palette={palette} className={styles.scene}>
        <div className={styles.stage}>{children}</div>
      </PaintedScene>
    </article>
  );
}

/** A project's screenshot in a small browser window. */
function ProjectWindow({
  project,
  className,
}: {
  project: Project;
  className: string;
}) {
  return (
    <div className={className}>
      <BrowserWindow title={getProjectHost(project)} size="compact">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.shot}
          src={asset(project.image)}
          alt={project.imageAlt}
          loading="lazy"
          decoding="async"
        />
      </BrowserWindow>
    </div>
  );
}

const caseLink = (template: string, project: Project) => ({
  name: template.replace("{project}", project.name),
  href: `/projects/${project.slug}`,
});

/** Colours for the Java example: annotations, strings and keywords. */
const JAVA = /(@\w+)|("[^"]*")|\b(public|class|return)\b/g;
/** Colours for the terminal: what was typed or asked for, and what went well. */
const TERMINAL = /(^\$|^POST \S+)|(✓|\b201\b)/gm;

/** The source with every match of `pattern` wrapped in the class of its group. */
function highlight(source: string, pattern: RegExp, classes: string[]) {
  const parts: ReactNode[] = [];
  let end = 0;
  for (const match of source.matchAll(pattern)) {
    const group = match.slice(1).findIndex((value) => value !== undefined);
    parts.push(source.slice(end, match.index));
    parts.push(
      <span key={match.index} className={classes[group]}>
        {match[0]}
      </span>,
    );
    end = match.index + match[0].length;
  }
  parts.push(source.slice(end));
  return parts;
}

/**
 * Vad jag gör: three cards, each with a text on one side and windows on a
 * painted landscape on the other. "Egna produkter" shows the featured project.
 */
export default function WhatIDo() {
  const { whatIDo } = site;
  const { clients, products, backend } = whatIDo;
  const featured = getFeaturedProject();
  const clientProject = getProjectBySlug(clients.project) as Project;
  const second = getProjectBySlug(products.second) as Project;

  const builtWith = featured.stack.slice(0, 2).join(` ${products.and} `);
  const featuredWithStack = builtWith
    ? `${featured.name} ${products.builtWith} ${builtWith}`
    : featured.name;

  return (
    <section
      className={`${shared.wrap} ${section.sec}`}
      aria-labelledby="vad-jag-gor-heading"
    >
      <div className={section.top}>
        <h2 id="vad-jag-gor-heading" className={section.heading}>
          {whatIDo.heading}
        </h2>
      </div>

      <div className={styles.cards}>
        <Card
          id="vad-jag-gor-kunder"
          heading={clients.heading}
          text={clients.text}
          link={caseLink(clients.link, clientProject)}
          palette="hav"
        >
          <ProjectWindow project={clientProject} className={styles.main} />
        </Card>

        <Card
          id="vad-jag-gor-produkter"
          heading={products.heading}
          text={products.text.replace("{featured}", featuredWithStack)}
          link={caseLink(products.link, featured)}
          palette="kvall"
        >
          <ProjectWindow
            project={featured}
            className={`${styles.main} ${styles.mainNarrow}`}
          />
          {second.slug !== featured.slug && (
            <ProjectWindow project={second} className={styles.over} />
          )}
        </Card>

        <Card
          id="vad-jag-gor-backend"
          heading={backend.heading}
          text={backend.text}
          link={backend.link}
          palette="skog"
        >
          <div
            className={`${styles.main} ${styles.mainCode}`}
            role="img"
            aria-label={backend.code.label}
          >
            <BrowserWindow title={backend.code.title} size="compact">
              <pre className={styles.code} aria-hidden="true">
                {highlight(backend.code.source, JAVA, [
                  styles.annotation,
                  styles.string,
                  styles.keyword,
                ])}
              </pre>
            </BrowserWindow>
          </div>
          <div className={styles.over} aria-hidden="true">
            <BrowserWindow title={backend.terminal.title} size="compact">
              <pre className={styles.terminal}>
                {highlight(backend.terminal.source, TERMINAL, [
                  styles.quiet,
                  styles.ok,
                ])}
              </pre>
            </BrowserWindow>
          </div>
        </Card>
      </div>
    </section>
  );
}
