import { site } from "@/data/site";
import { getTimeline } from "@/lib/cv";
import shared from "@/styles/shared.module.css";
import section from "@/styles/homeSection.module.css";
import SiteLink from "./SiteLink";
import styles from "./Timeline.module.css";

/** Vägen hit: education and work on one timeline, with a link to the full CV. */
export default function Timeline() {
  const { timeline } = site;

  return (
    <section
      className={`${shared.wrap} ${section.sec}`}
      aria-labelledby="vagen-hit-heading"
    >
      <div className={section.top}>
        <h2 id="vagen-hit-heading" className={section.heading}>
          {timeline.heading}
        </h2>
      </div>

      <ol className={styles.road}>
        {getTimeline().map((step) => (
          <li key={`${step.period} ${step.title}`} className={styles.step}>
            <p className={styles.when}>
              <span className={styles.period}>{step.period}</span>
              <span className={section.label}>{timeline.kinds[step.kind]}</span>
            </p>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.place}>{step.place}</p>
          </li>
        ))}
      </ol>

      <p className={styles.more}>
        <SiteLink href={timeline.cvLink.href} className={shared.go}>
          {timeline.cvLink.name} <span aria-hidden="true">→</span>
        </SiteLink>
      </p>
    </section>
  );
}
