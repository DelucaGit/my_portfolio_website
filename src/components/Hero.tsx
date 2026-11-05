import Link from "next/link";
import { site } from "@/data/site";
import { asset } from "@/lib/asset";
import styles from "./Hero.module.css";

function IconCv() {
  return (
    <svg className={styles.btnIcon} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm0 2 4 4h-4zM8 13h8v2H8zm0 4h8v2H8zm0-8h5v2H8z"
      />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg className={styles.btnIcon} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1z"
      />
    </svg>
  );
}

function IconMail() {
  return (
    <svg className={styles.btnIcon} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 4-8 5L4 8V6l8 5 8-5z"
      />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg className={styles.btnIcon} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.9 8.5H3.7V20h3.2zm.2-3.3a1.85 1.85 0 1 1-3.7 0 1.85 1.85 0 0 1 3.7 0M20.3 20h-3.2v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20H10v-11h3.1v1.5h.1c.4-.8 1.5-1.7 3.1-1.7 3.3 0 3.9 2.2 3.9 5z"
      />
    </svg>
  );
}

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

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.grid}>
        <div className={styles.copy}>
          <p className={styles.status}>{site.status}</p>

          <h1 className={styles.heading}>
            Jag heter Marcel, en{" "}
            <span className={styles.accent}>webbutvecklare</span>. Jag bygger
            webbappar med Java och React.
          </h1>

          <p className={styles.promise}>{site.description}</p>

          <div className={styles.actions}>
            <div className={styles.actionRow}>
              <Link href="/cv" className={`${styles.btn} ${styles.btnPrimary}`}>
                <IconCv />
                Läs CV
              </Link>
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className={`${styles.btn} ${styles.btnAccent} ${styles.btnStack}`}
              >
                <span className={styles.btnMain}>
                  <IconPhone />
                  {site.phone}
                </span>
                <span className={styles.btnNote}>{site.phoneNote}</span>
              </a>
            </div>

            <div className={styles.actionRow}>
              <a
                href={`mailto:${site.email}`}
                className={`${styles.btn} ${styles.btnSecondary}`}
              >
                <IconMail />
                Mejl
              </a>
              <a
                href={site.linkedin}
                className={`${styles.btn} ${styles.btnSecondary}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconLinkedIn />
                LinkedIn
              </a>
              <a
                href={site.github}
                className={`${styles.btn} ${styles.btnSecondary}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconGitHub />
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.visualGlow} aria-hidden="true" />
          <div className={styles.visualFrame}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(site.heroImage)}
              alt={site.heroImageAlt}
              className={styles.visualImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
