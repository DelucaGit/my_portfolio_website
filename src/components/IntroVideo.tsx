"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./introVideo.module.css";

// Swap this URL with your own intro video when ready.
const PLACEHOLDER_VIDEO_SRC =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

export default function IntroVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className={styles.section}
      aria-label="Introduction video"
    >
      <div className={styles.inner}>
        <p className={styles.eyebrow}>About me</p>
        <h2 className={styles.title}>A quick hello</h2>
        <p className={styles.description}>
          A short introduction — swap in your own recording when you&apos;re
          ready.
        </p>

        <div
          className={`${styles.videoCard} ${isVisible ? styles.videoCardVisible : ""}`}
        >
          <video
            className={styles.video}
            controls
            playsInline
            preload="metadata"
            poster="/video-placeholder-poster.svg"
          >
            <source src={PLACEHOLDER_VIDEO_SRC} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}
