import type { ReactNode } from "react";
import styles from "./BrowserWindow.module.css";

type BrowserWindowProps = {
  /** The text in the address bar, for example "andaluscalendar.com". */
  title: string;
  /** `compact` has a lower bar, for windows that stand on a painting in a card. */
  size?: "regular" | "compact";
  className?: string;
  /** What the window shows: a film, a screenshot, and anything under it. */
  children: ReactNode;
};

/**
 * A browser window: frame, address bar and the three traffic lights. The bar
 * is decoration and hidden from screen readers; the content is not.
 */
export function BrowserWindow({
  title,
  size = "regular",
  className,
  children,
}: BrowserWindowProps) {
  return (
    <div
      className={[
        styles.window,
        size === "compact" && styles.compact,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.bar} aria-hidden="true">
        <span className={styles.lights}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.title}>{title}</span>
        <span />
      </div>
      {children}
    </div>
  );
}
