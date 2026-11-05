import { site } from "@/data/site";
import { StackIcon } from "@/components/StackIcons";
import styles from "./Stack.module.css";

export default function Stack() {
  const { stack } = site;

  return (
    <section className={styles.section} aria-labelledby="stack-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{stack.eyebrow}</p>
            <h2 id="stack-heading" className={styles.heading}>
              {stack.heading}
            </h2>
          </div>
          <p className={`${styles.note} ${styles.noteAccent}`}>{stack.note}</p>
        </header>

        <ul className={styles.grid}>
          {stack.items.map((item) => (
            <li key={item.name} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.iconWrap}>
                  <StackIcon name={item.icon} className={styles.icon} />
                </span>
                <p className={styles.label}>{item.label}</p>
              </div>
              <h3 className={styles.name}>{item.name}</h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
