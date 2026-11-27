import SiteLink from "@/components/SiteLink";
import { ArrowOut } from "@/components/ui/ArrowOut";
import { BrowserWindow } from "@/components/ui/BrowserWindow";
import { PaintedScene, type PaintingPalette } from "@/components/ui/Painting";
import { site } from "@/data/site";
import { asset } from "@/lib/asset";
import {
  getAdjacentProjects,
  getAllProjects,
  getProjectHost,
  getProjectSite,
  type Project,
} from "@/lib/projects";
import shared from "@/styles/shared.module.css";
import styles from "./ProjectCaseStudy.module.css";
import VisitSiteLink from "./VisitSiteLink";

type ProjectCaseStudyProps = {
  project: Project;
};

type Picture = { src: string; alt: string };

const PALETTES: PaintingPalette[] = ["morgon", "hav", "kvall", "skog"];

/** Neighbouring projects get different landscapes behind their first picture. */
function paletteFor(project: Project): PaintingPalette {
  const position = getAllProjects().findIndex(
    (candidate) => candidate.slug === project.slug,
  );
  return PALETTES[Math.max(position, 0) % PALETTES.length];
}

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

/** A picture next to a short text. `flip` puts the text first on wide screens. */
function PictureRow({
  picture,
  label,
  heading,
  text,
  flip = false,
}: {
  picture: Picture;
  label: string;
  heading: string;
  text: string;
  flip?: boolean;
}) {
  return (
    <section className={`${styles.row} ${flip ? styles.rowFlip : ""}`}>
      <div className={styles.rowText}>
        <p className={styles.label}>{label}</p>
        <h2 className={styles.rowHeading}>{heading}</h2>
        <p className={styles.support}>{text}</p>
      </div>
      <figure className={styles.frame}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(picture.src)} alt={picture.alt} />
      </figure>
    </section>
  );
}

/**
 * A project's own page (/projects/<slug>): what it is, a first picture in a
 * browser window on a painted landscape, what it is built with, the problem
 * and the answer, the pictures, and the way on to the neighbouring projects.
 */
export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const { detail } = project;
  const { media } = detail;
  const { prev, next } = getAdjacentProjects(project.slug);
  const text = site.projectPage;
  const buttons = site.projects.buttons;
  const host = getProjectHost(project);

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

        {(project.siteUrl || project.githubUrl) && (
          <p className={styles.actions}>
            <VisitSiteLink
              name={project.name}
              site={getProjectSite(project)}
            />
            {project.githubUrl && (
              <SiteLink
                href={project.githubUrl}
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
          palette={paletteFor(project)}
          rounded
          className={styles.stage}
        >
          <BrowserWindow title={host}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(media.hero.src)}
              alt={media.hero.alt}
              className={styles.heroImage}
            />
          </BrowserWindow>
        </PaintedScene>
        <figcaption className={styles.caption} aria-hidden="true">
          {media.hero.alt}
        </figcaption>
      </figure>

      <section className={styles.stack} aria-labelledby="stack-heading">
        <div>
          <p className={styles.label}>{text.stack.label}</p>
          <h2 id="stack-heading" className={styles.stackHeading}>
            {text.stack.heading}
          </h2>
        </div>
        <ul className={styles.pills}>
          {project.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {(detail.challenge || detail.solution) && (
        <section className={styles.part} aria-labelledby="duo-heading">
          <PartHeading
            id="duo-heading"
            label={text.duo.label}
            heading={text.duo.heading}
          />
          <div className={styles.duo}>
            {detail.challenge && (
              <div className={styles.duoCard}>
                <h3 className={styles.duoTitle}>{text.duo.challenge}</h3>
                <ul className={styles.bullets}>
                  {detail.challenge.map((paragraph) => (
                    <li key={paragraph}>{paragraph}</li>
                  ))}
                </ul>
              </div>
            )}
            {detail.solution && (
              <div className={`${styles.duoCard} ${styles.duoSolution}`}>
                <h3 className={styles.duoTitle}>{text.duo.solution}</h3>
                <ul className={styles.bullets}>
                  {detail.solution.map((paragraph) => (
                    <li key={paragraph}>{paragraph}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {detail.results && (
        <section className={styles.part} aria-labelledby="results-heading">
          <PartHeading
            id="results-heading"
            label={text.results.label}
            heading={text.results.heading}
          />
          <div className={styles.results}>
            {detail.results.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      )}

      {media.video && (
        <section className={styles.part} aria-labelledby="video-heading">
          <PartHeading
            id="video-heading"
            label={media.videoCopy?.eyebrow ?? text.video.eyebrow}
            heading={media.videoCopy?.heading ?? text.video.heading}
            support={media.videoCopy?.support}
          />
          <BrowserWindow title={host}>
            <video
              className={styles.video}
              src={asset(media.video.src)}
              poster={asset(media.video.poster)}
              aria-label={media.video.alt}
              controls
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </BrowserWindow>
        </section>
      )}

      {media.feature && (
        <PictureRow
          picture={media.feature}
          label={text.feature.eyebrow}
          heading={text.feature.heading}
          text={media.feature.alt}
        />
      )}

      {media.mobile.length > 0 && (
        <section className={styles.part} aria-labelledby="mobile-heading">
          <PartHeading
            id="mobile-heading"
            label={text.mobile.eyebrow}
            heading={text.mobile.heading}
            support={text.mobile.support}
          />
          <div className={styles.phones} tabIndex={0}>
            <ul className={styles.phoneList}>
              {media.mobile.map((image) => (
                <li key={image.src} className={styles.phone}>
                  <div className={styles.phoneNotch} aria-hidden="true" />
                  <div className={styles.phoneScreen}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset(image.src)} alt={image.alt} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {media.desktop && (
        <PictureRow
          flip
          picture={media.desktop}
          label={media.desktopCopy?.eyebrow ?? text.desktop.eyebrow}
          heading={media.desktopCopy?.heading ?? text.desktop.heading}
          text={media.desktopCopy?.support ?? media.desktop.alt}
        />
      )}

      {media.fullPage && (
        <section className={styles.part} aria-labelledby="fullpage-heading">
          <PartHeading
            id="fullpage-heading"
            label={media.fullPageCopy?.eyebrow ?? text.fullPage.eyebrow}
            heading={media.fullPageCopy?.heading ?? text.fullPage.heading}
            support={media.fullPageCopy?.support ?? text.fullPage.support}
          />
          <BrowserWindow title={host}>
            {/* data-lenis-prevent: the wheel scrolls the picture, not the page */}
            <div className={styles.fullPage} tabIndex={0} data-lenis-prevent>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(media.fullPage.src)} alt={media.fullPage.alt} />
            </div>
          </BrowserWindow>
        </section>
      )}

      {media.gallery && media.gallery.length > 0 && (
        <section className={styles.part} aria-labelledby="gallery-heading">
          <PartHeading
            id="gallery-heading"
            label={media.galleryCopy?.eyebrow ?? text.gallery.eyebrow}
            heading={media.galleryCopy?.heading ?? text.gallery.heading}
            support={media.galleryCopy?.support}
          />
          <ul className={styles.gallery}>
            {media.gallery.map((image) => (
              <li key={image.src}>
                <figure className={styles.frame}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(image.src)} alt={image.alt} />
                </figure>
              </li>
            ))}
          </ul>
        </section>
      )}

      {media.closing && (
        <PictureRow
          picture={media.closing}
          label={media.closingCopy?.eyebrow ?? text.feature.eyebrow}
          heading={media.closingCopy?.heading ?? text.feature.heading}
          text={media.closingCopy?.support ?? media.closing.alt}
        />
      )}

      <nav className={styles.adjacent} aria-label={text.adjacent.label}>
        {prev && (
          <SiteLink href={`/projects/${prev.slug}`} className={styles.neighbour}>
            <span className={styles.label}>
              <span aria-hidden="true">← </span>
              {text.adjacent.previous}
            </span>{" "}
            <span className={styles.neighbourName}>{prev.name}</span>
          </SiteLink>
        )}
        {next ? (
          <SiteLink
            href={`/projects/${next.slug}`}
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
            href={`mailto:${site.email}`}
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
