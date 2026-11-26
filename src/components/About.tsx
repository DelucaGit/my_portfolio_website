import { Fragment } from "react";
import { site } from "@/data/site";
import { asset } from "@/lib/asset";
import { getFeaturedProject } from "@/lib/projects";
import shared from "@/styles/shared.module.css";
import section from "@/styles/homeSection.module.css";
import SiteLink from "./SiteLink";
import WordFill, { Words } from "./WordFill";
import styles from "./About.module.css";

/** Where the featured project's name goes in a text from the data. */
const FEATURED = "{featured}";

/**
 * Om mig: a portrait and a short text that fills in word by word on scroll.
 * "Bland annat …" names the featured project and links to its case.
 */
export default function About() {
  const { about } = site;
  const featured = getFeaturedProject();

  return (
    <section
      id="om"
      className={`${shared.wrap} ${section.sec}`}
      aria-labelledby="om-heading"
    >
      <div className={styles.about}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.portrait}
          src={asset(about.portrait.src)}
          alt={about.portrait.alt}
          width={640}
          height={800}
          loading="lazy"
          decoding="async"
        />
        <WordFill className={styles.say}>
          <h2 id="om-heading" className={shared.vh}>
            {about.heading}
          </h2>
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>
              {paragraph.split(FEATURED).map((text, index) => (
                <Fragment key={index}>
                  {index > 0 && (
                    <SiteLink
                      href={`/projects/${featured.slug}`}
                      className={styles.link}
                    >
                      <Words text={featured.name} />
                    </SiteLink>
                  )}
                  <Words text={text} />
                </Fragment>
              ))}
            </p>
          ))}
        </WordFill>
      </div>
    </section>
  );
}
