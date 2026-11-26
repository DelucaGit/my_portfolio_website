/**
 * The visitor's theme: follow the system, light or dark.
 *
 * The choice lives in localStorage under the same key as the prototype.
 * "light" and "dark" are put on <html data-theme="…">; "system" means no
 * attribute, and the CSS in theme.css then follows the device.
 */
export const THEME_STORAGE_KEY = "tyngdlos-tema";

export type ThemeChoice = "system" | "light" | "dark";

/**
 * Runs in <head> before the first paint (see the root layout), so a saved
 * theme is on the page before anything is drawn. Keep it tiny and dependency-free.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

const listeners = new Set<() => void>();

function apply(choice: ThemeChoice) {
  const root = document.documentElement;
  if (choice === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", choice);
  listeners.forEach((listener) => listener());
}

function toChoice(value: string | null): ThemeChoice {
  return value === "light" || value === "dark" ? value : "system";
}

/** The theme that is on the page right now. Browser only. */
export function getThemeChoice(): ThemeChoice {
  return toChoice(document.documentElement.getAttribute("data-theme"));
}

/** Switch theme and remember it on this device. */
export function setThemeChoice(choice: ThemeChoice) {
  apply(choice);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, choice);
  } catch {
    // Storage can be blocked (private mode). The theme still applies to this page.
  }
}

/** Subscribe to theme changes, including changes made in another tab. */
export function subscribeToTheme(listener: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) apply(toChoice(event.newValue));
  };
  listeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
