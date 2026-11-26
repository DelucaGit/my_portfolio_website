import { site } from "@/data/site";
import shared from "@/styles/shared.module.css";
import SiteLink from "./SiteLink";
import ThemeSwitcher from "./ThemeSwitcher";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();
  const { footer } = site;

  return (
    <footer className={styles.foot}>
      <div className={`${shared.wrap} ${styles.inner}`}>
        <div className={styles.cols}>
          <p className={styles.lead}>{footer.lead}</p>
          {footer.columns.map((column, index) => (
            <nav key={column.heading} aria-labelledby={`footer-col-${index}`}>
              <h2 id={`footer-col-${index}`}>{column.heading}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <SiteLink href={link.href} external={link.external}>
                      {link.name}
                    </SiteLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className={styles.base}>
          <span>
            © {year} {site.name} · {site.location}
          </span>
          <ThemeSwitcher />
        </div>

        {/* The name as a wordmark. Decorative: the name is already in the line above. */}
        <p className={styles.word} aria-hidden="true">
          {site.name}
        </p>
      </div>
    </footer>
  );
}
