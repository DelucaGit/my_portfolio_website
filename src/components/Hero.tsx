import TypewriterHeadline from "./TypewriterHeadline";
import ParticleBackground from "./ParticleBackground";
import styles from "./hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Introduction">
      <ParticleBackground />
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.content}>

        <TypewriterHeadline />

        <div className={styles.actions}>
          <a href="#work" className={styles.btnPrimary}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M8 2v8M8 10v4M5 13h6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <rect
                x="3"
                y="2"
                width="10"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            View my work
          </a>
          <a href="#about" className={styles.btnSecondary}>
            Explore projects
          </a>
        </div>
      </div>
    </section>
  );
}
