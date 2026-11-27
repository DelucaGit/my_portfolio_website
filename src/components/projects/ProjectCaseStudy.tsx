import Link from "next/link";
import { site } from "@/data/site";
import type { Project } from "@/lib/projects";
import type {
  MediaSection,
  MediaSectionCopy,
  ProjectImage,
} from "@/data/projects";
import { projectCatalog } from "@/lib/projects";
import { asset } from "@/lib/asset";
import styles from "./ProjectCaseStudy.module.css";

type ProjectCaseStudyProps = {
  project: Project;
};

export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const { detail } = project;
  const { media } = detail;
  const { next } = projectCatalog.adjacent(project.slug);

  const metaBits = [
    detail.client,
    detail.role,
    String(project.year),
  ].filter(Boolean);

  return (
    <article className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.back}>
          <Link href={projectCatalog.indexHref}>← Tillbaka till projekt</Link>
        </p>

        {/* 1. Header */}
        <header className={styles.header}>
          <div className={styles.headerMain}>
            <div className={styles.tags}>
              {project.stack.map((item) => (
                <span key={item} className={styles.tagAccent}>
                  {item}
                </span>
              ))}
              {metaBits.map((bit) => (
                <span key={bit} className={styles.tagMuted}>
                  {bit}
                </span>
              ))}
            </div>

            <h1 className={styles.title}>{project.name}</h1>
            <p className={styles.lead}>{project.tagline}</p>
            {detail.overview[0] && (
              <p className={styles.summary}>{detail.overview[0]}</p>
            )}
          </div>

          <div className={styles.headerActions}>
            {project.siteUrl && (
              <a
                href={project.siteUrl}
                className={`${styles.btn} ${styles.btnPrimary}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Live-sida ↗
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                className={`${styles.btn} ${styles.btnSecondary}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            )}
          </div>
        </header>

        {/* 2. Hero image */}
        <section className={styles.heroBlock}>
          <div className={styles.heroFrame}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(media.hero.src)}
              alt={media.hero.alt}
              className={styles.heroImage}
            />
          </div>
          <p className={styles.heroCaption}>{media.hero.alt}</p>
        </section>

        {/* 3. Tech stack */}
        <section className={styles.stackBar} aria-labelledby="stack-heading">
          <div>
            <p className={styles.stackEyebrow}>Teknik</p>
            <h2 id="stack-heading" className={styles.stackHeading}>
              Det här använde jag
            </h2>
          </div>
          <ul className={styles.stackPills}>
            {project.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* 4. Challenge + Solution */}
        {(detail.challenge || detail.solution) && (
          <section
            className={styles.duoSection}
            aria-labelledby="duo-heading"
          >
            <div className={styles.duoIntro}>
              <p className={styles.eyebrow}>Problemet och svaret</p>
              <h2 id="duo-heading" className={styles.sectionHeading}>
                Utmaning & lösning
              </h2>
            </div>

            <div className={styles.duoGrid}>
              {detail.challenge && (
                <div className={`${styles.duoCard} ${styles.duoChallenge}`}>
                  <h3 className={styles.duoTitle}>Utmaningen</h3>
                  <ul className={styles.duoList}>
                    {detail.challenge.map((paragraph) => (
                      <li key={paragraph}>{paragraph}</li>
                    ))}
                  </ul>
                </div>
              )}

              {detail.solution && (
                <div className={`${styles.duoCard} ${styles.duoSolution}`}>
                  <h3 className={styles.duoTitle}>Lösningen</h3>
                  <ul className={styles.duoList}>
                    {detail.solution.map((paragraph) => (
                      <li key={paragraph}>{paragraph}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Results */}
        {detail.results && (
          <section className={styles.results} aria-labelledby="results-heading">
            <p className={styles.eyebrow}>Resultat</p>
            <h2 id="results-heading" className={styles.sectionHeading}>
              Vad det ledde till
            </h2>
            <div className={styles.resultsBody}>
              {detail.results.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        )}

        {/* 5. Media sections, in the order the project lists them */}
        {media.sections.map((section, index) => (
          <MediaSectionBlock
            key={`${section.kind}-${index}`}
            section={section}
            headingId={`media-${index}-heading`}
          />
        ))}

        {/* 6. Next project */}
        <nav className={styles.nextNav} aria-label="Nästa projekt">
          {next ? (
            <Link href={projectCatalog.href(next)} className={styles.nextLink}>
              <span className={styles.nextLabel}>Nästa projekt</span>
              <span className={styles.nextName}>
                {next.name} <span aria-hidden="true">→</span>
              </span>
            </Link>
          ) : (
            <Link href={projectCatalog.indexHref} className={styles.nextLink}>
              <span className={styles.nextLabel}>Portfolio</span>
              <span className={styles.nextName}>
                Se alla projekt <span aria-hidden="true">→</span>
              </span>
            </Link>
          )}

          <Link href="/cv" className={styles.nextCv}>
            Läs CV
          </Link>
        </nav>
      </div>

      <section className={styles.cta} aria-labelledby="project-cta-heading">
        <div className={styles.ctaInner}>
          <p className={styles.ctaBadge}>{site.status}</p>
          <h2 id="project-cta-heading" className={styles.ctaHeading}>
            Vill du prata mer?
          </h2>
          <p className={styles.ctaText}>
            Mejla mig om du har frågor om projektet eller om ett jobb.
          </p>
          <a href={`mailto:${site.email}`} className={styles.ctaBtn}>
            {site.email}
          </a>
        </div>
      </section>
    </article>
  );
}

function MediaSectionBlock({
  section,
  headingId,
}: {
  section: MediaSection;
  headingId: string;
}) {
  const { copy } = section;

  switch (section.kind) {
    case "split":
      return (
        <section
          className={`${styles.featureRow} ${
            section.imageSide === "right" ? styles.featureRowFlip : ""
          }`}
          aria-labelledby={headingId}
        >
          {section.imageSide === "left" && <SplitFigure image={section.image} />}
          <div className={styles.featureCopy}>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h2 id={headingId} className={styles.featureHeading}>
              {copy.heading}
            </h2>
            {copy.support && (
              <p className={styles.featureText}>{copy.support}</p>
            )}
          </div>
          {section.imageSide === "right" && (
            <SplitFigure image={section.image} />
          )}
        </section>
      );

    case "phones":
      return (
        <section className={styles.mediaSection} aria-labelledby={headingId}>
          <SectionIntro copy={copy} headingId={headingId} wide={false} />
          <div className={styles.mobileScroll} tabIndex={0}>
            <ul className={styles.mobileList}>
              {section.images.map((image) => (
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
      );

    case "scrollFrame":
      return (
        <section className={styles.mediaSection} aria-labelledby={headingId}>
          <SectionIntro copy={copy} headingId={headingId} wide />
          <div className={styles.fullPageFrame} tabIndex={0}>
            <div className={styles.fullPageChrome} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className={styles.fullPageScroll}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(section.image.src)} alt={section.image.alt} />
            </div>
          </div>
        </section>
      );

    case "gallery":
      return (
        <section className={styles.mediaSection} aria-labelledby={headingId}>
          <SectionIntro copy={copy} headingId={headingId} wide />
          <ul className={styles.gallery}>
            {section.images.map((image) => (
              <li key={image.src}>
                <figure className={styles.galleryItem}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(image.src)} alt={image.alt} />
                </figure>
              </li>
            ))}
          </ul>
        </section>
      );
  }
}

function SectionIntro({
  copy,
  headingId,
  wide,
}: {
  copy: MediaSectionCopy;
  headingId: string;
  wide: boolean;
}) {
  return (
    <div className={wide ? styles.mediaIntroWide : styles.mediaIntro}>
      <p className={styles.eyebrow}>{copy.eyebrow}</p>
      <h2 id={headingId} className={styles.sectionHeading}>
        {copy.heading}
      </h2>
      {copy.support && <p className={styles.mediaSupport}>{copy.support}</p>}
    </div>
  );
}

function SplitFigure({ image }: { image: ProjectImage }) {
  return (
    <figure className={styles.featureMedia}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(image.src)} alt={image.alt} />
    </figure>
  );
}
