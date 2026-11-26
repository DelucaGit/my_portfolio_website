import HeroRing from "@/components/HeroRing";
import SiteLink from "@/components/SiteLink";
import { site } from "@/data/site";
import shared from "@/styles/shared.module.css";
import styles from "./Hero.module.css";

const HEADING_ID = "hero-heading";

/**
 * The start page's hero. Text and buttons are rendered on the server, so they
 * are there without JavaScript.
 */
export default function Hero() {
  const { hero } = site;

  return (
    <section className={styles.hero} aria-labelledby={HEADING_ID}>
      <HeroRing />
      <div className={`${shared.wrap} ${styles.inner}`}>
        <p className={styles.status}>
          <i aria-hidden="true" />
          {hero.status} · {hero.place}
        </p>
        <h1 id={HEADING_ID} className={styles.heading}>
          {hero.heading}
        </h1>
        <p className={styles.lede}>{hero.lede}</p>
        <div className={styles.buttons}>
          <SiteLink
            href={hero.cv.href}
            className={`${shared.pill} ${shared.pillSoft} ${styles.button}`}
          >
            {hero.cv.name}
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M5 11 11 5M6 5h5v5" />
            </svg>
          </SiteLink>
          <SiteLink
            href={hero.projects.href}
            className={`${shared.pill} ${shared.pillInk} ${styles.button}`}
          >
            {hero.projects.name}
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M8 3v10M4 9l4 4 4-4" />
            </svg>
          </SiteLink>
        </div>
      </div>
    </section>
  );
}
