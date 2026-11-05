import Link from "next/link";
import { site } from "@/data/site";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div>
            <p className={styles.eyebrow}>Kontakt</p>
            <p className={styles.tagline}>
              Enkel kod. Tydliga hemsidor. Redo för nästa jobb.
            </p>
            <p className={styles.meta}>{site.status}</p>
          </div>

          <div className={styles.links}>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <Link href="/cv">CV</Link>
            <a href={`mailto:${site.email}`}>Mejl</a>
          </div>
        </div>

        <p className={styles.copy}>
          © {year} {site.name}. Byggd med omsorg.
        </p>
      </div>
    </footer>
  );
}
