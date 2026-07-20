"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import styles from "./IntroVideo.module.css";

export default function IntroVideo() {
  const { intro } = site;
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);

    const onChange = () => setReduceMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setProgress(1);
      return;
    }

    const stage = stageRef.current;
    if (!stage) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = stage.getBoundingClientRect();
      const travel = Math.max(stage.offsetHeight - window.innerHeight, 1);
      const raw = (-rect.top) / travel;
      setProgress(Math.min(Math.max(raw, 0), 1));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  const scale = 0.84 + progress * 0.16;
  const radius = 1.25 + progress * 1.25; // 1.25rem → 2.5rem

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

        <div className={styles.stage} ref={stageRef}>
          <div className={styles.sticky}>
            <div
              className={styles.frame}
              style={{
                transform: `scale(${scale})`,
                borderRadius: `${radius}rem`,
              }}
            >
              <div className={styles.glow} aria-hidden="true" />

              <video
                ref={videoRef}
                className={styles.video}
                playsInline
                preload="metadata"
                poster={intro.poster}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
              >
                <source src={intro.video} type="video/mp4" />
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
