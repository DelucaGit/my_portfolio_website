import Link from "next/link";
import { site } from "@/data/site";
import type { Service } from "@/lib/services";
import { getAdjacentServices } from "@/lib/services";
import { asset } from "@/lib/asset";
import styles from "./ServiceCaseStudy.module.css";

type ServiceCaseStudyProps = {
  service: Service;
};

export function ServiceCaseStudy({ service }: ServiceCaseStudyProps) {
  const { detail } = service;
  const { media } = detail;
  const { prev, next } = getAdjacentServices(service.slug);
  const processPreview = detail.process.slice(0, 3);

  return (
    <article className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.back}>
          <Link href="/#services">← Tillbaka till tjänsterna</Link>
        </p>

        <header className={styles.hero}>
          <h1 className={styles.title}>{service.title}</h1>
          <p className={styles.subtitle}>{service.description}</p>
          <a href={`mailto:${site.email}`} className={styles.heroCta}>
            Hör av dig
          </a>

          <div className={styles.heroStage}>
            <div className={styles.heroGlow} aria-hidden="true" />
            <figure className={styles.heroFrame}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(media.hero.src)} alt={media.hero.alt} />
            </figure>
          </div>
        </header>

        <section className={styles.section} aria-labelledby="features-heading">
          <h2 id="features-heading" className={styles.sectionHeading}>
            Det här får ni
          </h2>

          <div className={styles.highlightGrid}>
            {detail.highlights.map((highlight) => (
              <article key={highlight.title} className={styles.highlightCard}>
                <div
                  className={`${styles.highlightVisual} ${
                    highlight.tone === "blue"
                      ? styles.highlightBlue
                      : styles.highlightNeutral
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(highlight.image.src)}
                    alt={highlight.image.alt}
                  />
                </div>
                <h3 className={styles.highlightTitle}>{highlight.title}</h3>
                <p className={styles.highlightText}>{highlight.description}</p>
              </article>
            ))}
          </div>

          <ul className={styles.pointGrid}>
            {detail.points.map((point, index) => (
              <li key={point.title} className={styles.point}>
                <span className={styles.pointIcon} aria-hidden="true">
                  <PointIcon index={index} />
                </span>
                <h3 className={styles.pointTitle}>{point.title}</h3>
                <p className={styles.pointText}>{point.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="process-heading">
          <h2 id="process-heading" className={styles.sectionHeading}>
            Så här går det till
          </h2>

          {media.feature && (
            <figure className={styles.processVisual}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(media.feature.src)} alt={media.feature.alt} />
            </figure>
          )}

          <ol className={styles.processGrid}>
            {processPreview.map((step) => (
              <li key={step.title} className={styles.processItem}>
                <h3 className={styles.processTitle}>{step.title}</h3>
                <p className={styles.processText}>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        {(detail.idealFor || detail.delivery || detail.timeline) && (
          <dl className={styles.metaRow} aria-label="Tjänstedetaljer">
            {detail.idealFor && (
              <div>
                <dt>Passar för</dt>
                <dd>{detail.idealFor}</dd>
              </div>
            )}
            {detail.delivery && (
              <div>
                <dt>Leverans</dt>
                <dd>{detail.delivery}</dd>
              </div>
            )}
            {detail.timeline && (
              <div>
                <dt>Tidsram</dt>
                <dd>{detail.timeline}</dd>
              </div>
            )}
          </dl>
        )}

        {(prev || next) && (
          <nav className={styles.adjacent} aria-label="Andra tjänster">
            {prev ? (
              <Link
                href={`/services/${prev.slug}`}
                className={styles.adjacentLink}
              >
                <span className={styles.adjacentLabel}>Föregående</span>
                <span className={styles.adjacentName}>{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/services/${next.slug}`}
                className={`${styles.adjacentLink} ${styles.adjacentNext}`}
              >
                <span className={styles.adjacentLabel}>Nästa</span>
                <span className={styles.adjacentName}>{next.title}</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </div>

      <section className={styles.cta} aria-labelledby="service-cta-heading">
        <div className={styles.ctaGlow} aria-hidden="true" />
        <div className={styles.ctaInner}>
          <h2 id="service-cta-heading" className={styles.ctaHeading}>
            Redo att komma igång med {service.title.toLowerCase()}?
          </h2>
          <a href={`mailto:${site.email}`} className={styles.ctaBtn}>
            Mejla mig
          </a>
        </div>
      </section>
    </article>
  );
}

function PointIcon({ index }: { index: number }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    width: 22,
    height: 22,
    "aria-hidden": true as const,
  };

  switch (index % 3) {
    case 0:
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );
    case 1:
      return (
        <svg {...props}>
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M3 9h18" />
        </svg>
      );
  }
}
