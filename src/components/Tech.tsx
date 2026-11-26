import { site } from "@/data/site";
import shared from "@/styles/shared.module.css";
import section from "@/styles/homeSection.module.css";
import styles from "./Tech.module.css";

/** Teknik: languages and tools, grouped by what they are used for. */
export default function Tech() {
  const { stack } = site;

  return (
    <section
      id="teknik"
      className={`${shared.wrap} ${section.sec}`}
      aria-labelledby="teknik-heading"
    >
      <div className={section.top}>
        <h2 id="teknik-heading" className={section.heading}>
          {stack.heading}
        </h2>
        <p>{stack.note}</p>
      </div>

      <div className={styles.groups}>
        {stack.groups.map((group) => {
          const headingId = `teknik-${group.id}`;
          return (
            <div key={group.id} className={styles.group}>
              <h3 id={headingId} className={styles.groupName}>
                {group.name}
              </h3>
              <ul aria-labelledby={headingId} className={styles.items}>
                {stack.items
                  .filter((item) => item.group === group.id)
                  .map((item) => (
                    <li key={item.name} className={styles.item}>
                      <b>{item.name}</b>
                      <small className={section.label}>{item.label}</small>
                    </li>
                  ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
