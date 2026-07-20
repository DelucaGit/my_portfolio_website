import Link from "next/link";
import { site } from "@/data/site";
import SprinkleField from "@/components/SprinkleField";
import styles from "./Hero.module.css";

export default function Hero() {
  const contact = site.nav.find((item) => item.href.includes("contact"));
  const about = site.nav.find((item) => item.href.includes("about"));

  return (
    <section className={styles.hero}>
      <SprinkleField className={styles.bg} />

      <div className={styles.inner}>
        <p className={styles.concept}>{site.title}</p>

        <h1 className={styles.name}>{site.name}</h1>

        <p className={styles.promise}>{site.description}</p>

        <div className={styles.actions}>
          {contact && (
            <Link
              href={contact.href}
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              {contact.name}
            </Link>
          )}
          {about && (
            <Link
              href={about.href}
              className={`${styles.btn} ${styles.btnSecondary}`}
            >
              {about.name}
            </Link>
          )}
        </div>
      </div>

      <a href="#intro" className={styles.scrollCue}>
        <span className={styles.scrollCueLabel}>Se mitt ansikte</span>
        <span className={styles.scrollCueArrow} aria-hidden="true">
          ↓
        </span>
      </a>
    </section>
  );
}
