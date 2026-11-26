"use client";

import { useEffect, useRef, useState } from "react";
import shared from "@/styles/shared.module.css";
import styles from "./Contact.module.css";

/** How long the confirmation stays before the button is ready again. */
const CONFIRM_MS = 1800;

export type CopyFieldText = {
  /** On the button, for example "Kopiera". */
  button: string;
  /** Read out after the button text, so the button says what it copies. */
  buttonHint: string;
  /** On the button once the value is on the clipboard. */
  done: string;
  /** Read out by screen readers once the value is on the clipboard. */
  doneAnnouncement: string;
  /** On the button when the browser refused: the value is selected instead. */
  selected: string;
  selectedAnnouncement: string;
};

type CopyFieldProps = {
  value: string;
  text: CopyFieldText;
};

type State = "idle" | "done" | "selected";

/**
 * A value with a button that puts it on the clipboard. The result is shown on
 * the button and announced through a live region. If the browser refuses the
 * clipboard, the value is selected so the visitor can copy it by hand.
 */
export default function CopyField({ value, text }: CopyFieldProps) {
  const [state, setState] = useState<State>("idle");
  const valueRef = useRef<HTMLElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const show = (next: State) => {
    setState(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), CONFIRM_MS);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      show("done");
    } catch {
      const node = valueRef.current;
      const selection = window.getSelection();
      if (node && selection) {
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      show("selected");
    }
  };

  const announcement = {
    idle: "",
    done: text.doneAnnouncement,
    selected: text.selectedAnnouncement,
  }[state];

  return (
    <div className={styles.row}>
      <b ref={valueRef} className={styles.value}>
        {value}
      </b>
      <button
        type="button"
        className={`${styles.copy} ${state === "done" ? styles.copied : ""}`}
        onClick={copy}
      >
        {state === "idle" ? (
          <>
            {text.button}
            <span className={shared.vh}> {text.buttonHint}</span>
          </>
        ) : state === "done" ? (
          text.done
        ) : (
          text.selected
        )}
      </button>
      {/* Always in the page, so screen readers pick up the change */}
      <span role="status" className={shared.vh}>
        {announcement}
      </span>
    </div>
  );
}
