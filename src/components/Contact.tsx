import { site } from "@/data/site";
import SprinkleField from "@/components/SprinkleField";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section className={styles.section} aria-labelledby="contact-heading">
      <SprinkleField className={styles.bg} />

      <div className={styles.inner}>
        <p className={styles.badge}>Open to new projects</p>

        <h2 id="contact-heading" className={styles.heading}>
          <span className={styles.lead}>For businesses</span>
          <span className={styles.bold}>
            Let&apos;s make your software work harder.
          </span>
        </h2>

        <a href={`mailto:${site.email}`} className={styles.btn}>
          Email me
        </a>
      </div>
    </section>
  );
}
