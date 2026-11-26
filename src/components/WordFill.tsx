"use client";

import { Fragment, useEffect, useRef, type ReactNode } from "react";
import styles from "./WordFill.module.css";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Text as words that can be filled in one by one. Put the result inside a
 * <WordFill>. Spaces stay plain text, so the text reads and wraps as usual.
 */
export function Words({ text }: { text: string }) {
  return text.split(/(\s+)/).map((part, index) =>
    part.trim() ? (
      <span key={index} data-word="">
        {part}
      </span>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}

type WordFillProps = {
  className?: string;
  /** Server-rendered text, with its words wrapped by <Words>. */
  children: ReactNode;
};

/**
 * Fills its text in word by word as it scrolls through the screen.
 *
 * The complete text is in the HTML in full colour. Only when the script runs
 * and motion is welcome are the words dimmed and then filled in from the
 * scroll position, so without JavaScript or with reduced motion everything
 * is readable at once. It reads the real scroll position, which is the one
 * Lenis moves.
 */
export default function WordFill({ className, children }: WordFillProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    const media = window.matchMedia(REDUCED_MOTION);
    const words = Array.from(box.querySelectorAll<HTMLElement>("[data-word]"));
    let filled = -1;
    let frame = 0;

    const fill = (count: number) => {
      if (count === filled) return;
      words.forEach((word, index) => {
        word.toggleAttribute("data-filled", index < count);
      });
      filled = count;
    };

    const update = () => {
      frame = 0;
      const rect = box.getBoundingClientRect();
      const screen = window.innerHeight;
      // 0 when the text comes up from the bottom edge, 1 well before it leaves at the top
      const progress =
        (screen * 0.88 - rect.top) / (rect.height + screen * 0.3);
      fill(Math.round(Math.min(Math.max(progress, 0), 1) * words.length));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const start = () => {
      box.setAttribute("data-filling", "");
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", update);
      update();
    };

    const stop = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      filled = -1;
      box.removeAttribute("data-filling");
      words.forEach((word) => word.removeAttribute("data-filled"));
    };

    const onMotionChange = () => {
      stop();
      if (!media.matches) start();
    };

    if (!media.matches) start();
    media.addEventListener("change", onMotionChange);
    return () => {
      media.removeEventListener("change", onMotionChange);
      stop();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={[styles.fill, className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}
