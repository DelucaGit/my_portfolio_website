"use client";

import { useRef, useState } from "react";
import { site } from "@/data/site";
import { asset } from "@/lib/asset";
import styles from "./IntroVideo.module.css";

export default function IntroVideo() {
  const { intro } = site;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  async function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
      return;
    }

    video.pause();
    setPlaying(false);
  }

  return (
    <section
      id="intro"
      className={styles.section}
      aria-labelledby="intro-heading"
    >
      <div className={styles.intro}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{intro.eyebrow}</p>
          <h2 id="intro-heading" className={styles.heading}>
            {intro.heading}
          </h2>
          <p className={styles.support}>{intro.description}</p>
        </header>

        <div className={styles.stage}>
          <div className={styles.sticky}>
            <div className={styles.frame}>
              <div className={styles.glow} aria-hidden="true" />

              <video
                ref={videoRef}
                className={styles.video}
                playsInline
                preload="metadata"
                poster={asset(intro.poster)}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
              >
                <source src={asset(intro.video)} type="video/mp4" />
              </video>

              <button
                type="button"
                className={styles.play}
                onClick={togglePlay}
                aria-label={playing ? "Pausa introfilmen" : "Spela introfilmen"}
              >
                {playing ? <PauseIcon /> : <PlayIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="currentColor" d="M8 5.5v13l11-6.5L8 5.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path fill="currentColor" d="M7 5h3.5v14H7V5zm6.5 0H17v14h-3.5V5z" />
    </svg>
  );
}
