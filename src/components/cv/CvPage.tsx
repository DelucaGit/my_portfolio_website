import Link from "next/link";
import { site } from "@/data/site";
import { asset } from "@/lib/asset";
import styles from "./CvPage.module.css";

function IconGitHub() {
  return (
    <svg className={styles.btnIcon} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.7 9.7 0 0 1 5 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.8v2.6c0 .3.2.6.7.5A10 10 0 0 0 12 2"
      />
    </svg>
  );
}

export default function CvPage() {
  const { cv } = site;

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.back}>
          <Link href="/">← Tillbaka</Link>
        </p>

        <section className={styles.heroCard}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>CV</p>
            <h1 className={styles.name}>{cv.fullName}</h1>
            <p className={styles.role}>{cv.roleLine}</p>
            <p className={styles.summary}>{cv.summary}</p>

            <dl className={styles.facts}>
              <div>
                <dt>Mejl</dt>
                <dd>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </dd>
              </div>
              <div>
                <dt>Telefon</dt>
                <dd>
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`}>
                    {site.phone}
                  </a>
                  <span className={styles.factNote}> · {site.phoneNote}</span>
                </dd>
              </div>
              <div>
                <dt>Plats</dt>
                <dd>{cv.location}</dd>
              </div>
            </dl>

            <div className={`${styles.actions} ${styles.heroActions}`}>
              <a
                href={asset(site.cvPdf)}
                className={`${styles.btn} ${styles.btnAccent}`}
                download="Marcel_Deluca_CV.pdf"
              >
                Ladda ner CV (PDF)
              </a>
              <a
                href={site.github}
                className={`${styles.btn} ${styles.btnDark}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconGitHub />
                GitHub
              </a>
              <a
                href={site.linkedin}
                className={`${styles.btn} ${styles.btnLinkedIn}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <figure className={styles.portrait}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(cv.portrait)}
              alt={cv.portraitAlt}
              className={styles.portraitImage}
            />
          </figure>
        </section>

        <section className={styles.block} aria-labelledby="cv-experience">
          <h2 id="cv-experience" className={styles.blockTitle}>
            Erfarenhet
          </h2>
          <ul className={styles.jobs}>
            {cv.experience.map((job) => (
              <li key={`${job.title}-${job.period}`} className={styles.job}>
                <div className={styles.jobTop}>
                  <div>
                    <h3 className={styles.jobTitle}>{job.title}</h3>
                    <p className={styles.jobPlace}>{job.place}</p>
                  </div>
                  <p className={styles.jobPeriod}>{job.period}</p>
                </div>
                <ul className={styles.bullets}>
                  {job.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <div className={styles.split}>
          <section className={styles.block} aria-labelledby="cv-education">
            <h2 id="cv-education" className={styles.blockTitle}>
              Utbildning
            </h2>
            <ul className={styles.eduList}>
              {cv.education.map((item) => (
                <li key={item.title} className={styles.eduItem}>
                  <p className={styles.jobTitle}>{item.title}</p>
                  <p className={styles.jobPlace}>{item.place}</p>
                  <p className={styles.jobPeriod}>{item.period}</p>
                  {"learnings" in item && item.learnings && (
                    <details className={styles.eduDetails}>
                      <summary className={styles.eduSummary}>
                        Vad har jag lärt mig?
                      </summary>
                      <ul className={styles.eduLearnings}>
                        {item.learnings.map((learning) => (
                          <li key={learning}>{learning}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.block} aria-labelledby="cv-skills">
            <h2 id="cv-skills" className={styles.blockTitle}>
              Kompetens
            </h2>
            <ul className={styles.tags}>
              {cv.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className={styles.block} aria-labelledby="cv-languages">
          <h2 id="cv-languages" className={styles.blockTitle}>
            Språk
          </h2>
          <ul className={styles.langList}>
            {cv.languages.map((lang) => (
              <li key={lang.name}>
                <span>{lang.name}</span>
                <span>{lang.level}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.cta}>
          <h2 className={styles.ctaHeading}>Vill du komma i kontakt?</h2>
          <p className={styles.ctaText}>
            Skicka ett mejl eller ring om du vill prata om jobb, projekt eller
            bara säga hej.
          </p>
          <div className={styles.actions}>
            <a
              href={`mailto:${site.email}`}
              className={`${styles.btn} ${styles.btnDark}`}
            >
              {site.email}
            </a>
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className={`${styles.btn} ${styles.btnAccent} ${styles.btnStack}`}
            >
              <span>{site.phone}</span>
              <span className={styles.btnNote}>{site.phoneNote}</span>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
