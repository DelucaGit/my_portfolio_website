import HeroBurst from "./HeroBurst";
import styles from "./hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Introduction">
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.burst}>
        <HeroBurst />
      </div>

      <div className={styles.content}>
        <p className={styles.brand}>
          <svg
            className={styles.brandIcon}
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M11 2L18 18H14.5L13 14.5H9L7.5 18H4L11 2Z" fill="#4285F4" />
            <path d="M9.2 12.5H12.8L11 8.5L9.2 12.5Z" fill="#FFFFFF" />
            <path d="M4 18L7 12" stroke="#EA4335" strokeWidth="1.5" />
            <path d="M18 18L15 12" stroke="#FBBC04" strokeWidth="1.5" />
          </svg>
          Malak Portfolio
        </p>

        <h1 className={styles.headline}>
          Crafting digital experiences that feel weightless and intentional.
        </h1>

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
