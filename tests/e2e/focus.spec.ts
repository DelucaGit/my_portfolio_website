import { expect, test, type Page } from "@playwright/test";
import {
  expectTheme,
  keyRoutes,
  returningVisitor,
  THEMES,
} from "./support/site";

/**
 * Every button and link shows where the keyboard focus is, in both themes:
 * the visitor presses Tab through the whole page and each stop has a ring
 * that stands out from what is behind it.
 */

/** WCAG 1.4.11: things you need to see to use the page, against their surroundings. */
const MIN_RING_CONTRAST = 3;

type Stop = {
  name: string;
  /** Width of the ring in px. 0: there is none. */
  ring: number;
  /** Contrast between the ring and the colour behind the element. */
  contrast: number;
};

/** What the focus looks like on the element that has it now. */
async function focusedStop(page: Page): Promise<Stop | null> {
  return page.evaluate(async () => {
    const element = document.activeElement;
    if (!element || element === document.body) return null;
    // Look at what has been painted: let the browser draw the ring first.
    // (With reduced motion every change still runs as a 0.01 ms transition,
    // and a reading in that instant sees the ring half way.)
    await new Promise((painted) =>
      requestAnimationFrame(() => requestAnimationFrame(painted)),
    );

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    const blend = (colours: string[]) => {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, 1, 1);
      for (const colour of colours) {
        ctx.fillStyle = colour;
        ctx.fillRect(0, 0, 1, 1);
      }
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return [r, g, b];
    };
    const luminance = ([r, g, b]: number[]) => {
      const channel = (value: number) => {
        const v = value / 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    };

    const style = getComputedStyle(element);
    // The ring is drawn outside the element (or just inside its edge), so it
    // is seen against what the element sits in.
    const behind: string[] = [];
    for (let el = element.parentElement; el; el = el.parentElement) {
      behind.unshift(getComputedStyle(el).backgroundColor);
    }
    const background = blend(behind);
    const ring = blend([...behind, style.outlineColor]);
    const [light, dark] = [luminance(background), luminance(ring)].sort(
      (a, b) => b - a,
    );
    return {
      name: (
        element.getAttribute("aria-label") ??
        element.textContent ??
        element.tagName
      )
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 50),
      ring: style.outlineStyle === "none" ? 0 : parseFloat(style.outlineWidth),
      contrast: (light + 0.05) / (dark + 0.05),
    };
  });
}

for (const theme of THEMES) {
  test.describe(`Fokusmarkering i ${theme === "light" ? "ljust" : "mörkt"} tema`, () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    for (const route of keyRoutes()) {
      test(`varje tabbstopp på ${route} har en synlig ring`, async ({ page }) => {
        // With less motion the page jumps to each stop instead of gliding.
        await page.emulateMedia({ reducedMotion: "reduce" });
        await returningVisitor(page, { chose: theme });
        await page.goto(route);
        await expectTheme(page, theme);

        const stops: Stop[] = [];
        for (let presses = 0; presses < 150; presses++) {
          await page.keyboard.press("Tab");
          const stop = await focusedStop(page);
          if (!stop) break;
          stops.push(stop);
        }
        // Menu, content and footer: a page has at least this many stops.
        expect(stops.length).toBeGreaterThan(15);
        expect(stops.length, "Tab never came round").toBeLessThan(150);

        expect(
          stops.filter((stop) => stop.ring < 2).map((stop) => stop.name),
          "stops without a ring",
        ).toEqual([]);
        expect(
          stops
            .filter((stop) => stop.contrast < MIN_RING_CONTRAST)
            .map((stop) => `${stop.name} (${stop.contrast.toFixed(2)})`),
          "rings that are hard to see",
        ).toEqual([]);
      });
    }
  });
}
