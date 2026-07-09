"use client";

import { useEffect, useState } from "react";
import styles from "./hero.module.css";

const HEADLINE =
  "Crafting digital experiences that feel weightless and intentional.";
const TYPING_DELAY_MS = 36;
const START_DELAY_MS = 400;

export default function TypewriterHeadline() {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setDisplayedText(HEADLINE);
      setIsTyping(false);
      return;
    }

    let charIndex = 0;
    let typingTimer: ReturnType<typeof setTimeout> | undefined;
    let interval: ReturnType<typeof setInterval> | undefined;

    const startTyping = () => {
      interval = setInterval(() => {
        charIndex += 1;
        setDisplayedText(HEADLINE.slice(0, charIndex));

        if (charIndex >= HEADLINE.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, TYPING_DELAY_MS);
    };

    typingTimer = setTimeout(startTyping, START_DELAY_MS);

    return () => {
      clearTimeout(typingTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <h1 className={styles.headline}>
      <span className={styles.typewriter} aria-hidden="true">
        {displayedText}
        <span
          className={`${styles.cursor} ${!isTyping ? styles.cursorIdle : ""}`}
        />
      </span>
      <span className={styles.srOnly}>{HEADLINE}</span>
    </h1>
  );
}
