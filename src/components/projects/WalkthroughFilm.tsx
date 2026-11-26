"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./FeaturedProject.module.css";

type WalkthroughFilmProps = {
  /** File paths, already passed through `asset()`. */
  webm: string;
  mp4: string;
  poster: string;
  /** What a screen reader says the film is. */
  label: string;
  /** What happens in the film, in order. */
  steps: { at: number; text: string }[];
  /** Who is clicking around, shown before the step ("Agenten"). */
  narrator: string;
};

/** The film starts when this much of it is on screen. */
const VISIBLE_SHARE = 1 / 3;
/** The film starts loading when it is this close to the screen. */
const NEAR = "500px 0px";
/* With the codec named, a browser without H.264 skips the MP4 and takes the WebM. */
const MP4_TYPE = 'video/mp4; codecs="avc1.640020"';
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** Motion is welcome and the visitor is not saving data. Otherwise the still image stays. */
function motionWelcome(): boolean {
  const connection = (navigator as Navigator & {
    connection?: { saveData?: boolean };
  }).connection;
  return !window.matchMedia(REDUCED_MOTION).matches && !connection?.saveData;
}

function subscribeToMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const two = (n: number) => String(n).padStart(2, "0");

/**
 * A recorded walkthrough that plays by itself. It has no controls and takes no
 * pointer events. It plays while at least a third of it is on screen and the
 * tab is showing, and pauses otherwise. With reduced motion or data saving
 * only the still image shows and the film is never fetched.
 */
export default function WalkthroughFilm({
  webm,
  mp4,
  poster,
  label,
  steps,
  narrator,
}: WalkthroughFilmProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canPlay = useSyncExternalStore(
    subscribeToMotion,
    motionWelcome,
    () => true,
  );
  /* The film files are only named once the film is near the screen, so nothing is fetched before. */
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;

    /* Still image only: stop, and go back to the poster if the film had started. */
    if (!canPlay) {
      if (!video.paused) video.pause();
      if (video.currentTime) video.load();
      return;
    }
    if (!("IntersectionObserver" in window)) return;

    let wanted = false;
    const sync = () => {
      if (wanted && !document.hidden) {
        video.play().catch(() => {});
      } else if (!video.paused) {
        video.pause();
      }
    };
    /* A film that was asked to play before it had loaded starts as soon as it can. */
    const onCanPlay = () => {
      if (video.paused) sync();
    };
    const showStep = () => {
      const time = video.currentTime;
      let current = 0;
      steps.forEach((entry, index) => {
        if (entry.at <= time) current = index;
      });
      setStep(current);
    };
    const onPlaying = () => {
      showStep();
      setPlaying(true);
    };
    const onPause = () => setPlaying(false);

    const nearObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        nearObserver.disconnect();
        video.preload = "auto";
        setNear(true);
      },
      { rootMargin: NEAR },
    );
    const playObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio >= VISIBLE_SHARE) wanted = true;
          else if (!entry.isIntersecting) wanted = false;
        }
        sync();
      },
      { threshold: [0, VISIBLE_SHARE] },
    );

    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("timeupdate", showStep);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("pause", onPause);
    document.addEventListener("visibilitychange", sync);
    nearObserver.observe(video);
    playObserver.observe(video);

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("timeupdate", showStep);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", sync);
      nearObserver.disconnect();
      playObserver.disconnect();
    };
  }, [canPlay, steps]);

  return (
    <>
      <video
        ref={videoRef}
        className={styles.shot}
        poster={poster}
        width={1280}
        height={800}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
        role="img"
        aria-label={label}
      >
        {/* MP4 first: every browser that can play it does, Safari among them. WebM is for the rest. */}
        {near && canPlay && (
          <>
            <source src={mp4} type={MP4_TYPE} />
            <source src={webm} type="video/webm" />
          </>
        )}
      </video>
      {canPlay && (
        <p
          className={`${styles.caption} ${playing ? styles.captionOn : ""}`}
          aria-hidden="true"
        >
          <span className={styles.captionLine}>
            <i className={styles.captionDot} />
            <span className={styles.captionWho}>{narrator} ·</span>
            <span className={styles.captionStep}>
              {step >= 0 &&
                `${two(step + 1)}/${two(steps.length)} · ${steps[step].text}`}
            </span>
          </span>
        </p>
      )}
    </>
  );
}
