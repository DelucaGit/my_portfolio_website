import Script from "next/script";
import { site } from "@/data/site";
import SprinkleField from "@/components/SprinkleField";
import CalendlyBookButton from "@/components/CalendlyBookButton";
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
          <span className={styles.lead}>Kontakt</span>
          <span className={styles.bold}>
            Skicka ett mejl till mig eller boka ett digitalt möte
          </span>
        </h2>

        <p className={styles.bookText}>
          Det tar bara 30 sekunder att boka tid med mig.
        </p>

        <div className={styles.actions}>
          <CalendlyBookButton
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            Boka möte
          </CalendlyBookButton>
          <a
            href={`mailto:${site.email}`}
            className={`${styles.btn} ${styles.btnSecondary}`}
          >
            Mejla mig
          </a>
        </div>
      </div>

      <link
        href="https://assets.calendly.com/assets/external/widget.css"
        rel="stylesheet"
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
    </section>
  );
}
