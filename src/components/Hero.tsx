import Link from "next/link";
import { site } from "@/data/site";
import SprinkleField from "@/components/SprinkleField";
import styles from "./Hero.module.css";

export default function Hero() {
  const contact = site.nav.find((item) => item.name === "Contact");
  const about = site.nav.find((item) => item.name === "About");

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
    </section>
  );
}
