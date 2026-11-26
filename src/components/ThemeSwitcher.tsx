"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { site } from "@/data/site";
import {
  getThemeChoice,
  setThemeChoice,
  subscribeToTheme,
  type ThemeChoice,
} from "@/lib/theme";
import styles from "./ThemeSwitcher.module.css";

const icons: Record<ThemeChoice, ReactNode> = {
  system: (
    <>
      <rect x="2" y="3" width="12" height="8" rx="1.5" />
      <path d="M6 13.5h4" />
    </>
  ),
  light: (
    <>
      <circle cx="8" cy="8" r="2.8" />
      <path d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" />
    </>
  ),
  dark: <path d="M13 9.6A5.5 5.5 0 0 1 6.4 3 5.5 5.5 0 1 0 13 9.6Z" />,
};

type ThemeSwitcherProps = {
  /** "large" gives 44px buttons for the mobile menu. */
  size?: "default" | "large";
};

/**
 * Three buttons: follow the system, light, dark. Any number of switchers can
 * be on a page; they all read the same theme (src/lib/theme.ts).
 */
export default function ThemeSwitcher({ size = "default" }: ThemeSwitcherProps) {
  // The server cannot know the choice, so it renders "system" and React
  // corrects the pressed button right after hydration. The colours themselves
  // are already right: the inline script in <head> ran before the first paint.
  const current = useSyncExternalStore(
    subscribeToTheme,
    getThemeChoice,
    (): ThemeChoice => "system",
  );
  const { label, options } = site.ui.theme;

  return (
    <div
      className={`${styles.themes} ${size === "large" ? styles.large : ""}`}
      role="group"
      aria-label={label}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={current === option.value}
          aria-label={option.label}
          title={option.label}
          onClick={() => setThemeChoice(option.value)}
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            aria-hidden="true"
          >
            {icons[option.value]}
          </svg>
        </button>
      ))}
    </div>
  );
}
