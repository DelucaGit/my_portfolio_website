import SiteLink from "@/components/SiteLink";
import { ArrowOut } from "@/components/ui/ArrowOut";
import { BrowserWindow } from "@/components/ui/BrowserWindow";
import { PaintedScene } from "@/components/ui/Painting";
import { site } from "@/data/site";
import { getFeaturedProject, getProjectView } from "@/lib/projects";
import shared from "@/styles/shared.module.css";
import styles from "./FeaturedProject.module.css";
import VisitSiteLink from "./VisitSiteLink";
import WalkthroughFilm from "./WalkthroughFilm";

/**
 * The featured project: a browser window on a painted landscape, playing a
 * recorded walkthrough of the real site, next to a short text and two buttons.
 * Which project it is comes from `featuredProject` in src/data/site.ts.
 */
export default function FeaturedProject() {
  const project = getFeaturedProject();
  const view = getProjectView(project);
  const { walkthrough } = view;
  const copy = site.projects.featured;
  const buttons = site.projects.buttons;
  const titleId = `utvalt-${project.slug}`;

  return (
    <article className={styles.card} aria-labelledby={titleId}>
      <PaintedScene palette="morgon" className={styles.stage}>
        <BrowserWindow title={view.host} size="compact">
          {walkthrough ? (
            <WalkthroughFilm
              webm={walkthrough.webm}
              mp4={walkthrough.mp4}
              poster={walkthrough.poster}
              label={`${copy.filmLabel} ${project.name}`}
              steps={walkthrough.steps}
              narrator={copy.filmNarrator}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={`${styles.shot} ${styles.still}`}
              src={view.image.src}
              alt={view.image.alt}
              decoding="async"
            />
          )}
        </BrowserWindow>
      </PaintedScene>

      <div className={styles.text}>
        <p className={`${styles.facts} ${shared.mono}`}>
          <span className={styles.label}>
            <svg className={styles.pin} viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 1.5a3.5 3.5 0 0 1 .75 6.92V14L8 15.2 7.25 14V8.42A3.5 3.5 0 0 1 8 1.5z" />
            </svg>
            {copy.label}
          </span>
          <span>{[project.year, ...project.tags].join(" · ")}</span>
        </p>
        <h3 id={titleId} className={styles.name}>
          {project.name}
        </h3>
        <p className={styles.tagline}>{project.tagline}</p>
        <p className={styles.links}>
          <SiteLink
            href={view.caseHref}
            className={`${shared.pill} ${shared.pillInk}`}
            aria-label={`${buttons.readCase}: ${project.name}`}
          >
            {buttons.readCase}
            <ArrowOut />
          </SiteLink>
          <VisitSiteLink name={project.name} siteState={view.site} />
        </p>
      </div>
    </article>
  );
}
