import { site } from "@/data/site";
import SprinkleField from "@/components/SprinkleField";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section
      id="contact"
      className={styles.section}
      aria-labelledby="contact-heading"
    >
      <SprinkleField className={styles.bg} />

      <div className={styles.inner}>
        <p className={styles.badge}>Öppen för nya uppdrag</p>

        <h2 id="contact-heading" className={styles.heading}>
          <span className={styles.lead}>För företag</span>
          <span className={styles.bold}>
            Låt oss få er mjukvara att arbeta hårdare.
          </span>
        </h2>

        <a href={`mailto:${site.email}`} className={styles.btn}>
          Mejla mig
        </a>
      </div>
    </section>
  );
}
