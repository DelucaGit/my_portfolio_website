import { site } from "@/data/site";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section
      id="contact"
      className={styles.section}
      aria-labelledby="contact-heading"
    >
      <div className={styles.card}>
        <h2 id="contact-heading" className={styles.heading}>
          Vill du komma i kontakt?
        </h2>
        <p className={styles.text}>
          Skicka ett mejl eller ring om du vill prata om jobb, projekt eller
          bara säga hej.
        </p>

        <div className={styles.actions}>
          <a href={`mailto:${site.email}`} className={styles.btn}>
            {site.email}
          </a>
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className={`${styles.btn} ${styles.btnAccent}`}
          >
            <span>{site.phone}</span>
            <span className={styles.btnNote}>{site.phoneNote}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
