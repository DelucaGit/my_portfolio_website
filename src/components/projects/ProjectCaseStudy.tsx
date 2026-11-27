import SiteLink from "@/components/SiteLink";
import { ArrowOut } from "@/components/ui/ArrowOut";
import { BrowserWindow } from "@/components/ui/BrowserWindow";
import { PaintedScene } from "@/components/ui/Painting";
import { site } from "@/data/site";
import { getCasePage, type CaseSection } from "@/lib/case-page";
import { mailHref } from "@/lib/contact";
import {
  getAdjacentProjects,
  getProjectView,
  type Project,
} from "@/lib/projects";
import shared from "@/styles/shared.module.css";
import styles from "./ProjectCaseStudy.module.css";
import VisitSiteLink from "./VisitSiteLink";

type ProjectCaseStudyProps = {
  project: Project;
};

/** Small mono label and a heading: the start of every part of the page. */
function PartHeading({
  label,
  heading,
  support,
  id,
}: {
  label: string;
  heading: string;
  support?: string;
  id?: string;
}) {
  return (
    <div className={styles.partTop}>
      <p className={styles.label}>{label}</p>
      <h2 id={id} className={styles.heading}>
        {heading}
      </h2>
      {support && <p className={styles.support}>{support}</p>}
    </div>
  );
}

/** One part of the page, drawn by its kind. */
function Section({ section, host }: { section: CaseSection; host: string }) {
  switch (section.kind) {
    case "stack":
      return (
        <section className={styles.stack} aria-labelledby="stack-heading">
          <div>
            <p className={styles.label}>{section.label}</p>
            <h2 id="stack-heading" className={styles.stackHeading}>
              {section.heading}
            </h2>
          </div>
          <ul className={styles.pills}>
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      );

    case "duo":
      return (
        <section className={styles.part} aria-labelledby="duo-heading">
          <PartHeading
            id="duo-heading"
            label={section.label}
            heading={section.heading}
          />
          <div className={styles.duo}>
            {section.challenge && (
              <div className={styles.duoCard}>
                <h3 className={styles.duoTitle}>{section.challenge.title}</h3>
                <ul className={styles.bullets}>
                  {section.challenge.points.map((paragraph) => (
                    <li key={paragraph}>{paragraph}</li>
                  ))}
                </ul>
              </div>
            )}
            {section.solution && (
              <div className={`${styles.duoCard} ${styles.duoSolution}`}>
                <h3 className={styles.duoTitle}>{section.solution.title}</h3>
                <ul className={styles.bullets}>
                  {section.solution.points.map((paragraph) => (
                    <li key={paragraph}>{paragraph}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      );

    case "results":
      return (
        <section className={styles.part} aria-labelledby="results-heading">
          <PartHeading
            id="results-heading"
            label={section.label}
            heading={section.heading}
          />
          <div className={styles.results}>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      );

    case "video":
      return (
        <section className={styles.part} aria-labelledby="video-heading">
          <PartHeading
            id="video-heading"
            label={section.label}
            heading={section.heading}
            support={section.support}
          />
          <BrowserWindow title={host}>
            <video
              className={styles.video}
              src={section.video.src}
              poster={section.video.poster}
              aria-label={section.video.alt}
              controls
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </BrowserWindow>
        </section>
      );

    // A picture next to a short text. `flip` puts the text first on wide screens.
    case "row":
      return (
        <section
          className={`${styles.row} ${section.flip ? styles.rowFlip : ""}`}
        >
          <div className={styles.rowText}>
            <p className={styles.label}>{section.label}</p>
            <h2 className={styles.rowHeading}>{section.heading}</h2>
            <p className={styles.support}>{section.support}</p>
          </div>
          <figure className={styles.frame}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={section.picture.src} alt={section.picture.alt} />
          </figure>
        </section>
      );

    case "phones":
      return (
        <section className={styles.part} aria-labelledby="mobile-heading">
          <PartHeading
            id="mobile-heading"
            label={section.label}
            heading={section.heading}
            support={section.support}
          />
          <div className={styles.phones} tabIndex={0}>
            <ul className={styles.phoneList}>
              {section.pictures.map((image) => (
                <li key={image.src} className={styles.phone}>
                  <div className={styles.phoneNotch} aria-hidden="true" />
                  <div className={styles.phoneScreen}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.src} alt={image.alt} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      );

    case "fullPage":
      return (
        <section className={styles.part} aria-labelledby="fullpage-heading">
          <PartHeading
            id="fullpage-heading"
            label={section.label}
            heading={section.heading}
            support={section.support}
          />
          <BrowserWindow title={host}>
            {/* data-lenis-prevent: the wheel scrolls the picture, not the page */}
            <div className={styles.fullPage} tabIndex={0} data-lenis-prevent>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={section.picture.src} alt={section.picture.alt} />
            </div>
          </BrowserWindow>
        </section>
      );

    case "gallery":
      return (
        <section className={styles.part} aria-labelledby="gallery-heading">
          <PartHeading
            id="gallery-heading"
            label={section.label}
            heading={section.heading}
            support={section.support}
          />
          <ul className={styles.gallery}>
            {section.pictures.map((image) => (
              <li key={image.src}>
                <figure className={styles.frame}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.src} alt={image.alt} />
                </figure>
              </li>
            ))}
          </ul>
        </section>
      );
  }
}

/**
 * A project's own page (/projects/<slug>): what it is, a first picture in a
 * browser window on a painted landscape, then the parts the project layer
 * gives (see `getCasePage`), and the way on to the neighbouring projects.
 */
export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const { detail } = project;
  const casePage = getCasePage(project);
  const { prev, next } = getAdjacentProjects(project.slug);
  const text = site.projectPage;
  const buttons = site.projects.buttons;
  const view = getProjectView(project);
  const { host } = view;

  const facts = [detail.client, detail.role, String(project.year)].filter(
    Boolean,
  );

  return (
    <article className={`${shared.wrap} ${styles.page}`}>
      <p className={styles.back}>
        <SiteLink href={text.back.href}>
          <span aria-hidden="true">←</span> {text.back.name}
        </SiteLink>
      </p>

      <header className={styles.top}>
        <div className={styles.intro}>
          <p className={styles.label}>{facts.join(" · ")}</p>
          <h1 className={styles.name}>{project.name}</h1>
          <p className={styles.tagline}>{project.tagline}</p>
          {detail.overview[0] && (
            <p className={styles.summary}>{detail.overview[0]}</p>
          )}
        </div>

        {(view.site.state !== "none" || view.githubUrl) && (
          <p className={styles.actions}>
            <VisitSiteLink name={view.name} site={view.site} />
            {view.githubUrl && (
              <SiteLink
                href={view.githubUrl}
                external
                className={`${shared.pill} ${shared.pillLine}`}
                aria-label={`${buttons.code}: ${project.name}`}
              >
                {buttons.code}
                <ArrowOut />
              </SiteLink>
            )}
          </p>
        )}
      </header>

      <figure className={styles.hero}>
        <PaintedScene
          palette={casePage.palette}
          rounded
          className={styles.stage}
        >
          <BrowserWindow title={host}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={casePage.hero.src}
              alt={casePage.hero.alt}
              className={styles.heroImage}
            />
          </BrowserWindow>
        </PaintedScene>
        <figcaption className={styles.caption} aria-hidden="true">
          {casePage.hero.alt}
        </figcaption>
      </figure>

      {casePage.sections.map((section, index) => (
        <Section key={index} section={section} host={host} />
      ))}

      <nav className={styles.adjacent} aria-label={text.adjacent.label}>
        {prev && (
          <SiteLink href={prev.caseHref} className={styles.neighbour}>
            <span className={styles.label}>
              <span aria-hidden="true">← </span>
              {text.adjacent.previous}
            </span>{" "}
            <span className={styles.neighbourName}>{prev.name}</span>
          </SiteLink>
        )}
        {next ? (
          <SiteLink
            href={next.caseHref}
            className={`${styles.neighbour} ${styles.neighbourNext}`}
          >
            <span className={styles.label}>
              {text.adjacent.next}
              <span aria-hidden="true"> →</span>
            </span>{" "}
            <span className={styles.neighbourName}>{next.name}</span>
          </SiteLink>
        ) : (
          <SiteLink
            href={text.adjacent.all.href}
            className={`${styles.neighbour} ${styles.neighbourNext}`}
          >
            <span className={styles.label}>
              {text.adjacent.all.label}
              <span aria-hidden="true"> →</span>
            </span>{" "}
            <span className={styles.neighbourName}>
              {text.adjacent.all.name}
            </span>
          </SiteLink>
        )}
      </nav>

      <section className={styles.panel} aria-labelledby="project-contact">
        <p className={styles.status}>
          <i aria-hidden="true" />
          {site.status}
        </p>
        <h2 id="project-contact">{text.contact.heading}</h2>
        <p>{text.contact.text}</p>
        <div className={styles.panelActions}>
          <SiteLink
            href={mailHref(site.email)}
            className={`${shared.pill} ${styles.pillLight}`}
          >
            {site.email}
          </SiteLink>
          <SiteLink
            href={text.contact.cv.href}
            className={`${shared.pill} ${styles.pillGhost}`}
          >
            {text.contact.cv.name}
          </SiteLink>
        </div>
      </section>
    </article>
  );
}
