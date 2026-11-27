import { Fragment } from "react";
import { site } from "@/data/site";
import { asset } from "@/lib/asset";
import { fillPlaceholders } from "@/lib/placeholders";
import { getFeaturedProject, getProjectView } from "@/lib/projects";
import shared from "@/styles/shared.module.css";
import section from "@/styles/homeSection.module.css";
import SiteLink from "./SiteLink";
import WordFill, { Words } from "./WordFill";
import styles from "./About.module.css";

/**
 * Om mig: a portrait and a short text that fills in word by word on scroll.
 * "Bland annat …" names the featured project and links to its case.
 */
export default function About() {
  const { about } = site;
  const featured = getProjectView(getFeaturedProject());

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
              {fillPlaceholders(paragraph, {
                featured: { text: featured.name, href: featured.caseHref },
              }).map((part, index) =>
                part.kind === "link" ? (
                  <SiteLink key={index} href={part.href} className={styles.link}>
                    <Words text={part.text} />
                  </SiteLink>
                ) : (
                  <Fragment key={index}>
                    <Words text={part.text} />
                  </Fragment>
                ),
              )}
            </p>
          ))}
        </WordFill>
      </div>
    </section>
  );
}
