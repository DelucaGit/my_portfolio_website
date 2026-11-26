import { site } from "@/data/site";
import styles from "./SkipLink.module.css";

/** The id of <main> in the root layout. The skip link jumps here. */
export const MAIN_ID = "main";

/** First tab stop on every page: jump past the menu to the content. */
export default function SkipLink() {
  return (
    <a className={styles.skip} href={`#${MAIN_ID}`}>
      {site.ui.skipLink}
    </a>
  );
}
