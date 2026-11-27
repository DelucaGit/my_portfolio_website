import { site } from "@/data/site";
import { mailHref, phoneHref } from "@/lib/contact";
import shared from "@/styles/shared.module.css";
import section from "@/styles/homeSection.module.css";
import CopyField from "./CopyField";
import SiteLink from "./SiteLink";
import styles from "./Contact.module.css";

/** Kontakt: mail, call, copy the address, and the profiles. */
export default function Contact() {
  const { contact } = site;
  const tel = phoneHref(site.phone);

  return (
    <section
      id="kontakt"
      className={`${shared.wrap} ${section.sec}`}
      aria-labelledby="kontakt-heading"
    >
      <div className={styles.panel}>
        <div className={styles.panelIn}>
          <h2 id="kontakt-heading">{contact.heading}</h2>
          <p>{contact.text}</p>
          <div className={styles.buttons}>
            <SiteLink
              href={mailHref(site.email)}
              className={`${shared.pill} ${styles.pillLight}`}
            >
              {contact.mailButton}
            </SiteLink>
            <SiteLink
              href={tel}
              className={`${shared.pill} ${styles.pillGhost}`}
            >
              {contact.callButton} {site.phone}
            </SiteLink>
          </div>
        </div>
      </div>

      <ul className={styles.reach}>
        <li>
          <span className={section.label}>{contact.emailLabel}</span>
          <CopyField value={site.email} text={contact.copy} />
        </li>
        <li>
          <span className={section.label}>{contact.phoneLabel}</span>
          <b className={styles.value}>{site.phone}</b>
          <span className={styles.note}>{site.phoneNote}</span>
        </li>
        {contact.profiles.map((profile) => (
          <li key={profile.label}>
            <span className={section.label}>{profile.label}</span>
            <SiteLink
              href={profile.href}
              external
              className={`${shared.go} ${styles.profile}`}
              aria-label={`${profile.label}: ${profile.handle}`}
            >
              {profile.handle} <span aria-hidden="true">↗</span>
            </SiteLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
