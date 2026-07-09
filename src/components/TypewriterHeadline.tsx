"use client";

import { useEffect, useState, ElementType } from "react";
import styles from "./hero.module.css";

const TYPING_DELAY_MS = 36;
const START_DELAY_MS = 400;

// Default hero headline kept as a constant so Hero usage stays unchanged
const DEFAULT_HEADLINE =
  "Crafting digital experiences that feel weightless and intentional.";

interface TypewriterHeadlineProps {
  /** Text to type out. Defaults to the hero headline. */
  text?: string;
  /** Class applied to the outer heading element. */
  className?: string;
  /** Extra class applied to the blinking cursor element. */
  cursorClassName?: string;
  /** HTML tag to render. Defaults to "h1". */
  as?: ElementType;
  /** Delay in ms before typing starts. */
  startDelay?: number;
}

export default function TypewriterHeadline({
  text = DEFAULT_HEADLINE,
  className,
  cursorClassName,
  as: Tag = "h1",
  startDelay = START_DELAY_MS,
}: TypewriterHeadlineProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    let charIndex = 0;
    let typingTimer: ReturnType<typeof setTimeout> | undefined;
    let interval: ReturnType<typeof setInterval> | undefined;

    const startTyping = () => {
      interval = setInterval(() => {
        charIndex += 1;
        setDisplayedText(text.slice(0, charIndex));

        if (charIndex >= text.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, TYPING_DELAY_MS);
    };

    typingTimer = setTimeout(startTyping, startDelay);

    return () => {
      clearTimeout(typingTimer);
      clearInterval(interval);
    };
  }, [text, startDelay]);

  return (
    <Tag className={className ?? styles.headline}>
      <span className={styles.typewriter} aria-hidden="true">
        {displayedText}
        <span
          className={`${styles.cursor} ${cursorClassName ?? ""} ${!isTyping ? styles.cursorIdle : ""}`}
        />
      </span>
      <span className={styles.srOnly}>{text}</span>
    </Tag>
  );
}
