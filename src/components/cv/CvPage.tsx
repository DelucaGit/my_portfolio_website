import SiteLink from "@/components/SiteLink";
import { site } from "@/data/site";
import { asset } from "@/lib/asset";
import shared from "@/styles/shared.module.css";
import styles from "./CvPage.module.css";

function IconGitHub() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.7 9.7 0 0 1 5 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.8v2.6c0 .3.2.6.7.5A10 10 0 0 0 12 2"
      />
    </svg>
  );
}

/** "https://www.linkedin.com/in/x" -> "linkedin.com/in/x", for the printed CV. */
function withoutProtocol(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "");
}

export default function CvPage() {
  const { cv, cvPage: text } = site;
  const mailHref = `mailto:${site.email}`;
  const phoneHref = `tel:${site.phone.replace(/\s/g, "")}`;

  return (
    <div className={`${shared.wrap} ${styles.page}`}>
      <p className={styles.back}>
        <SiteLink href="/">
          <span aria-hidden="true">←</span> {text.back}
        </SiteLink>
      </p>

      <header className={styles.top}>
        <div className={styles.intro}>
          <p className={styles.label}>{text.eyebrow}</p>
          <h1 className={styles.name}>{cv.fullName}</h1>
          <p className={styles.role}>{cv.roleLine}</p>
          <p className={styles.summary}>{cv.summary}</p>

          <div className={styles.actions}>
            {/* A file, not a page: a plain link, so Next.js does not try to open it */}
            <a
              href={asset(site.cvPdf)}
              className={`${shared.pill} ${shared.pillInk} ${styles.screenOnly}`}
              download={text.download.fileName}
            >
              {text.download.label}
            </a>
            <SiteLink
              href={site.github}
              external
              className={`${shared.pill} ${shared.pillSoft} ${styles.profile}`}
            >
              <IconGitHub />
              {text.github}
              <span className={styles.printOnly}>
                {withoutProtocol(site.github)}
              </span>
            </SiteLink>
            <SiteLink
              href={site.linkedin}
              external
              className={`${shared.pill} ${shared.pillSoft} ${styles.profile}`}
            >
              {text.linkedin}
              <span className={styles.printOnly}>
                {withoutProtocol(site.linkedin)}
              </span>
            </SiteLink>
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(cv.portrait)}
          alt={cv.portraitAlt}
          className={styles.portrait}
        />
      </header>

      <dl className={styles.facts}>
        <div>
          <dt className={styles.label}>{text.facts.email}</dt>
          <dd>
            <SiteLink href={mailHref}>{site.email}</SiteLink>
          </dd>
        </div>
        <div>
          <dt className={styles.label}>{text.facts.phone}</dt>
          <dd>
            <SiteLink href={phoneHref}>{site.phone}</SiteLink>
            <span className={styles.note}>{site.phoneNote}</span>
          </dd>
        </div>
        <div>
          <dt className={styles.label}>{text.facts.location}</dt>
          <dd>{cv.location}</dd>
        </div>
      </dl>

      <section className={styles.sec} aria-labelledby="cv-experience">
        <h2 id="cv-experience" className={styles.secHeading}>
          {text.experience}
        </h2>
        <ol className={styles.timeline}>
          {cv.experience.map((job) => (
            <li key={`${job.title}-${job.period}`} className={styles.entry}>
              <p className={styles.period}>{job.period}</p>
              <div className={styles.entryBody}>
                <h3 className={styles.entryTitle}>{job.title}</h3>
                <p className={styles.place}>{job.place}</p>
                <ul className={styles.bullets}>
                  {job.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.sec} aria-labelledby="cv-education">
        <h2 id="cv-education" className={styles.secHeading}>
          {text.education}
        </h2>
        <ol className={styles.timeline}>
          {cv.education.map((item) => (
            <li key={item.title} className={styles.entry}>
              <p className={styles.period}>{item.period}</p>
              <div className={styles.entryBody}>
                <h3 className={styles.entryTitle}>{item.title}</h3>
                <p className={styles.place}>{item.place}</p>
                {"learnings" in item && item.learnings && (
                  <details className={styles.learnings}>
                    <summary>{text.learnings}</summary>
                    <ul className={styles.bullets}>
                      {item.learnings.map((learning) => (
                        <li key={learning}>{learning}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.sec} aria-labelledby="cv-skills">
        <h2 id="cv-skills" className={styles.secHeading}>
          {text.skills}
        </h2>
        <ul className={styles.skills}>
          {cv.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </section>

      <section className={styles.sec} aria-labelledby="cv-languages">
        <h2 id="cv-languages" className={styles.secHeading}>
          {text.languages}
        </h2>
        <ul className={styles.languages}>
          {cv.languages.map((language) => (
            <li key={language.name}>
              <b>{language.name}</b>
              <span className={styles.label}>{language.level}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.panel} aria-labelledby="cv-contact">
        <h2 id="cv-contact">{text.contact.heading}</h2>
        <p>{text.contact.text}</p>
        <div className={styles.panelActions}>
          <SiteLink
            href={mailHref}
            className={`${shared.pill} ${styles.pillLight}`}
          >
            {site.email}
          </SiteLink>
          <SiteLink
            href={phoneHref}
            className={`${shared.pill} ${styles.pillGhost}`}
          >
            {site.phone}
          </SiteLink>
        </div>
        <p className={styles.panelNote}>{site.phoneNote}</p>
      </section>
    </div>
  );
}
