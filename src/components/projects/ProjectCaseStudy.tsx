import Link from "next/link";
import { site } from "@/data/site";
import type { Project } from "@/lib/projects";
import { getAdjacentProjects } from "@/lib/projects";
import { asset } from "@/lib/asset";
import styles from "./ProjectCaseStudy.module.css";

type ProjectCaseStudyProps = {
  project: Project;
};

export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const { detail } = project;
  const { media } = detail;
  const { next } = getAdjacentProjects(project.slug);

  const metaBits = [
    detail.client,
    detail.role,
    String(project.year),
  ].filter(Boolean);

  return (
    <article className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.back}>
          <Link href="/projects">← Tillbaka till projekt</Link>
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

        {/* 5. Feature / media blocks */}
        {media.feature && (
          <section className={styles.featureRow}>
            <figure className={styles.featureMedia}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(media.feature.src)} alt={media.feature.alt} />
            </figure>
            <div className={styles.featureCopy}>
              <p className={styles.eyebrow}>Detalj</p>
              <h2 className={styles.featureHeading}>En viktig del av UI:t</h2>
              <p className={styles.featureText}>{media.feature.alt}</p>
            </div>
          </section>
        )}

        {media.mobile.length > 0 && (
          <section
            className={styles.mediaSection}
            aria-labelledby="mobile-heading"
          >
            <div className={styles.mediaIntro}>
              <p className={styles.eyebrow}>Mobil</p>
              <h2 id="mobile-heading" className={styles.sectionHeading}>
                Så ser det ut i telefonen
              </h2>
              <p className={styles.mediaSupport}>
                Scrolla i sidled för att se fler vyer.
              </p>
            </div>

            <div className={styles.mobileScroll} tabIndex={0}>
              <ul className={styles.mobileList}>
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
          <section
            className={`${styles.featureRow} ${styles.featureRowFlip}`}
          >
            <div className={styles.featureCopy}>
              <p className={styles.eyebrow}>
                {media.desktopCopy?.eyebrow ?? "Desktop"}
              </p>
              <h2 className={styles.featureHeading}>
                {media.desktopCopy?.heading ?? "Desktop-vyn"}
              </h2>
              <p className={styles.featureText}>
                {media.desktopCopy?.support ?? media.desktop.alt}
              </p>
            </div>
            <figure className={styles.featureMedia}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(media.desktop.src)} alt={media.desktop.alt} />
            </figure>
          </section>
        )}

        {media.fullPage && (
          <section
            className={styles.mediaSection}
            aria-labelledby="fullpage-heading"
          >
            <div className={styles.mediaIntroWide}>
              <p className={styles.eyebrow}>
                {media.fullPageCopy?.eyebrow ?? "Hela sidan"}
              </p>
              <h2 id="fullpage-heading" className={styles.sectionHeading}>
                {media.fullPageCopy?.heading ?? "Scrolla igenom hela flödet"}
              </h2>
              <p className={styles.mediaSupport}>
                {media.fullPageCopy?.support ??
                  "Scrolla inne i ramen för att se layouten från topp till botten."}
              </p>
            </div>

            <div className={styles.fullPageFrame} tabIndex={0}>
              <div className={styles.fullPageChrome} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className={styles.fullPageScroll}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(media.fullPage.src)} alt={media.fullPage.alt} />
              </div>
            </div>
          </section>
        )}

        {media.gallery && media.gallery.length > 0 && (
          <section
            className={styles.mediaSection}
            aria-labelledby="gallery-heading"
          >
            <div className={styles.mediaIntroWide}>
              <p className={styles.eyebrow}>
                {media.galleryCopy?.eyebrow ?? "Fler bilder"}
              </p>
              <h2 id="gallery-heading" className={styles.sectionHeading}>
                {media.galleryCopy?.heading ?? "Fler vyer från projektet"}
              </h2>
              {media.galleryCopy?.support && (
                <p className={styles.mediaSupport}>{media.galleryCopy.support}</p>
              )}
            </div>

            <ul className={styles.gallery}>
              {media.gallery.map((image) => (
                <li key={image.src}>
                  <figure className={styles.galleryItem}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset(image.src)} alt={image.alt} />
                  </figure>
                </li>
              ))}
            </ul>
          </section>
        )}

        {media.closing && (
          <section className={styles.featureRow}>
            <figure className={styles.featureMedia}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(media.closing.src)} alt={media.closing.alt} />
            </figure>
            <div className={styles.featureCopy}>
              <p className={styles.eyebrow}>
                {media.closingCopy?.eyebrow ?? "Detalj"}
              </p>
              <h2 className={styles.featureHeading}>
                {media.closingCopy?.heading ?? "En viktig del av UI:t"}
              </h2>
              <p className={styles.featureText}>
                {media.closingCopy?.support ?? media.closing.alt}
              </p>
            </div>
          </section>
        )}

        {/* 6. Next project */}
        <nav className={styles.nextNav} aria-label="Nästa projekt">
          {next ? (
            <Link href={`/projects/${next.slug}`} className={styles.nextLink}>
              <span className={styles.nextLabel}>Nästa projekt</span>
              <span className={styles.nextName}>
                {next.name} <span aria-hidden="true">→</span>
              </span>
            </Link>
          ) : (
            <Link href="/projects" className={styles.nextLink}>
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
