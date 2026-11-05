import { site } from "@/data/site";
import styles from "./About.module.css";

export default function About() {
  const { about } = site;

  return (
    <section
      id="about"
      className={styles.section}
      aria-labelledby="about-heading"
    >
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{about.eyebrow}</p>
        <h2 id="about-heading" className={styles.heading}>
          {about.heading}
        </h2>

        <div className={styles.body}>
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph} className={styles.text}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
