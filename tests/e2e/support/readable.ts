import { expect, type Locator } from "@playwright/test";

/** WCAG AA for body text. */
const MIN_CONTRAST = 4.5;

/**
 * Every piece of text inside `area` can be read against the colour behind it.
 *
 * Looks at what is painted: the text colour and the background colours of the
 * element and everything it sits in, blended the way the browser blends them.
 * Pictures and gradients behind text are not looked at.
 */
export async function expectReadableText(area: Locator) {
  const hardToRead = await area.evaluate((root, minContrast) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

    /** Paint the colours on top of each other and read the result. */
    const blend = (colours: string[]) => {
      ctx.globalCompositeOperation = "source-over";
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

    const problems: string[] = [];
    for (const element of [root, ...root.querySelectorAll("*")]) {
      const text = [...element.childNodes]
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent?.trim() ?? "")
        .join(" ")
        .trim();
      if (!text) continue;
      if (!(element as HTMLElement).checkVisibility?.()) continue;
      const box = element.getBoundingClientRect();
      if (box.width < 2 || box.height < 2) continue;

      const behind: string[] = [];
      for (let el: Element | null = element; el; el = el.parentElement) {
        behind.unshift(getComputedStyle(el).backgroundColor);
      }
      const background = blend(behind);
      const colour = blend([...behind, getComputedStyle(element).color]);

      const [light, dark] = [luminance(background), luminance(colour)].sort(
        (a, b) => b - a,
      );
      const contrast = (light + 0.05) / (dark + 0.05);
      if (contrast < minContrast) {
        problems.push(
          `"${text.slice(0, 40)}" has contrast ${contrast.toFixed(2)}`,
        );
      }
    }
    return problems;
  }, MIN_CONTRAST);

  expect(hardToRead, "text that is hard to read").toEqual([]);
}
