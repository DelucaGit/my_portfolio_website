import Link from "next/link";
import { site } from "@/data/site";
import type { Project } from "@/lib/projects";
import { getAdjacentProjects } from "@/lib/projects";
import styles from "./ProjectCaseStudy.module.css";

type ProjectCaseStudyProps = {
  project: Project;
};

export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const { detail } = project;
  const { media } = detail;
  const { prev, next } = getAdjacentProjects(project.slug);

  return (
    <article className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.back}>
          <Link href="/#projects">← Tillbaka till projekten</Link>
        </p>

        <figure className={styles.hero}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media.hero.src} alt={media.hero.alt} />
        </figure>

        <header className={styles.overview}>
          <h1 className={styles.title}>{project.name}</h1>

          <div className={styles.overviewGrid}>
            <div className={styles.copy}>
              {detail.challenge && (
                <section className={styles.block}>
                  <h2 className={styles.blockHeading}>Utmaningen</h2>
                  {detail.challenge.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              )}

              {detail.solution && (
                <section className={styles.block}>
                  <h2 className={styles.blockHeading}>Lösningen</h2>
                  {detail.solution.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              )}

              {detail.overview.map((paragraph) => (
                <p key={paragraph} className={styles.overviewText}>
                  {paragraph}
                </p>
              ))}

              {detail.results && (
                <section className={styles.block}>
                  <h2 className={styles.blockHeading}>Resultatet</h2>
                  {detail.results.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              )}
            </div>

            <aside className={styles.meta} aria-label="Projektdetaljer">
              <dl className={styles.metaList}>
                {detail.client && (
                  <div>
                    <dt>Kund</dt>
                    <dd>{detail.client}</dd>
                  </div>
                )}
                {detail.industry && (
                  <div>
                    <dt>Bransch</dt>
                    <dd>{detail.industry}</dd>
                  </div>
                )}
                {detail.role && (
                  <div>
                    <dt>Roll</dt>
                    <dd>{detail.role}</dd>
                  </div>
                )}
                <div>
                  <dt>År</dt>
                  <dd>{project.year}</dd>
                </div>
                <div>
                  <dt>Taggar</dt>
                  <dd>{project.tags.join(", ")}</dd>
                </div>
                <div>
                  <dt>Teknik</dt>
                  <dd>{project.stack.join(", ")}</dd>
                </div>
                {project.siteUrl && (
                  <div>
                    <dt>Webbplats</dt>
                    <dd>
                      <a
                        href={project.siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Besök live-sajten
                      </a>
                    </dd>
                  </div>
                )}
                {project.githubUrl && (
                  <div>
                    <dt>Källkod</dt>
                    <dd>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visa på GitHub
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </aside>
          </div>
        </header>

        {media.feature && (
          <figure className={styles.feature}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={media.feature.src} alt={media.feature.alt} />
          </figure>
        )}

        {media.mobile.length > 0 && (
          <section className={styles.mediaSection} aria-labelledby="mobile-heading">
            <div className={styles.mediaIntro}>
              <p className={styles.eyebrow}>Mobil</p>
              <h2 id="mobile-heading" className={styles.mediaHeading}>
                Så här ser det ut i fickan.
              </h2>
              <p className={styles.mediaSupport}>
                Riktiga skärmdumpar från mobilläget. Scrolla i sidled för att se
                fler vyer.
              </p>
            </div>

            <div className={styles.mobileScroll} tabIndex={0}>
              <ul className={styles.mobileList}>
                {media.mobile.map((image) => (
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
        )}

        {media.fullPage && (
          <section
            className={styles.mediaSection}
            aria-labelledby="fullpage-heading"
          >
            <div className={styles.mediaIntro}>
              <p className={styles.eyebrow}>
                {media.fullPageCopy?.eyebrow ?? "Hela sidan"}
              </p>
              <h2 id="fullpage-heading" className={styles.mediaHeading}>
                {media.fullPageCopy?.heading ?? "Scrolla igenom hela flödet."}
              </h2>
              <p className={styles.mediaSupport}>
                {media.fullPageCopy?.support ??
                  "Dra eller scrolla inne i ramen för att se layouten från topp till botten."}
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
                <img src={media.fullPage.src} alt={media.fullPage.alt} />
              </div>
            </div>
          </section>
        )}

        {media.desktop && (
          <section
            className={styles.mediaSection}
            aria-labelledby="desktop-heading"
          >
            <div className={styles.mediaIntro}>
              <p className={styles.eyebrow}>
                {media.desktopCopy?.eyebrow ?? "Desktop"}
              </p>
              <h2 id="desktop-heading" className={styles.mediaHeading}>
                {media.desktopCopy?.heading ?? "Där det tunga arbetet händer."}
              </h2>
              <p className={styles.mediaSupport}>
                {media.desktopCopy?.support ??
                  "Tabeller, grafer och kontroller — arbetsytan när fokus behövs."}
              </p>
            </div>

            <figure className={styles.desktop}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={media.desktop.src} alt={media.desktop.alt} />
            </figure>
          </section>
        )}

        {(prev || next) && (
          <nav className={styles.adjacent} aria-label="Andra projekt">
            {prev ? (
              <Link href={`/projects/${prev.slug}`} className={styles.adjacentLink}>
                <span className={styles.adjacentLabel}>Föregående projekt</span>
                <span className={styles.adjacentRow}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prev.image}
                    alt=""
                    className={styles.adjacentThumb}
                  />
                  <span className={styles.adjacentName}>{prev.name}</span>
                </span>
              </Link>
            ) : (
              <span />
            )}

            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className={`${styles.adjacentLink} ${styles.adjacentNext}`}
              >
                <span className={styles.adjacentLabel}>Nästa projekt</span>
                <span className={styles.adjacentRow}>
                  <span className={styles.adjacentName}>{next.name}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={next.image}
                    alt=""
                    className={styles.adjacentThumb}
                  />
                </span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </div>

      <section className={styles.cta} aria-labelledby="project-cta-heading">
        <div className={styles.ctaInner}>
          <p className={styles.ctaBadge}>Öppen för nya uppdrag</p>
          <h2 id="project-cta-heading" className={styles.ctaHeading}>
            <span className={styles.ctaLead}>Gillar du det du ser?</span>
            <span className={styles.ctaBold}>
              Låt oss få er mjukvara att arbeta hårdare.
            </span>
          </h2>
          <a href={`mailto:${site.email}`} className={styles.ctaBtn}>
            Mejla mig
          </a>
        </div>
      </section>
    </article>
  );
}
