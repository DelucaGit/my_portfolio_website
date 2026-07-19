"use client";

import { useEffect, useRef, useState } from "react";
import type { Service } from "@/lib/services";
import { getAllServices } from "@/lib/services";
import styles from "./Services.module.css";

export default function Services() {
  const services = getAllServices();
  // Starts as null so no text shows until an image actually
  // reaches the center of the screen — the text should arrive
  // with its image, not before it.
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);

  // On desktop, the "active" service is whichever image track is
  // crossing the middle of the screen. Shrinking the observer's
  // root to a thin band around the vertical center (via rootMargin)
  // means an image only counts as "intersecting" once it's near
  // the middle, which is exactly when we want the text to switch.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveIndex(index);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    trackRefs.current.forEach((track) => {
      if (track) observer.observe(track);
    });

    return () => observer.disconnect();
  }, []);

  const activeService = activeIndex === null ? null : services[activeIndex];

  return (
    <section
      className={styles.section}
      style={
        {
          "--active-bg": activeService?.theme.bg ?? "var(--color-bg)",
        } as React.CSSProperties
      }
      data-dark={activeService?.theme.dark ? "true" : undefined}
      aria-labelledby="services-heading"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>What I do</p>
          <h2 id="services-heading" className={styles.heading}>
            Services
          </h2>
        </header>

        <div className={styles.layout}>
          {/* Desktop only: one fixed text panel whose content swaps
              as the images scroll past. Hidden on mobile, where each
              service keeps its own text next to its own image. */}
          <div className={styles.stickyText} aria-hidden="true">
            {activeService && (
              <div
                key={activeService.slug}
                className={styles.stickyTextInner}
              >
                <h3 className={styles.title}>{activeService.title}</h3>
                <p className={styles.description}>
                  {activeService.description}
                </p>
              </div>
            )}
          </div>

          <ul className={styles.list}>
            {services.map((service, index) => (
              <li key={service.slug}>
                <ServiceBlock
                  service={service}
                  onMediaRef={(el) => {
                    trackRefs.current[index] = el;
                  }}
                  mediaIndex={index}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ServiceBlock({
  service,
  onMediaRef,
  mediaIndex,
}: {
  service: Service;
  onMediaRef: (el: HTMLDivElement | null) => void;
  mediaIndex: number;
}) {
  return (
    <article
      className={styles.block}
      style={{ "--block-bg": service.theme.bg } as React.CSSProperties}
      data-dark={service.theme.dark ? "true" : undefined}
    >
      <div className={styles.itemText}>
        <h3 className={styles.title}>{service.title}</h3>
        <p className={styles.description}>{service.description}</p>
      </div>

      <div
        ref={onMediaRef}
        data-index={mediaIndex}
        className={styles.mediaTrack}
      >
        <div className={styles.panel}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={service.images[0]}
            alt={service.imagesAlt[0]}
            className={styles.screenshot}
          />
        </div>
      </div>
    </article>
  );
}
