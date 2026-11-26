import type { Browser, Page } from "@playwright/test";

/**
 * What a visitor sees of something colourful (the hero's ring, a painting):
 * how many coloured pixels there are in a part of the screen and where their
 * middle is. Paper, grey text and hairlines do not count.
 *
 * Read an area without text: on Windows the edges of letters are drawn with
 * faint colour fringes, and they would be counted.
 */
export type ColourReading = {
  /** Number of coloured pixels. */
  count: number;
  /** Middle of the coloured pixels, 0 (left edge) to 1 (right edge). */
  x: number;
};

export type Area = { x: number; y: number; width: number; height: number };

/** Takes a picture of the area and measures the colour in it. */
export async function readColour(
  browser: Browser,
  page: Page,
  area: Area,
): Promise<ColourReading> {
  const png = await page.screenshot({ clip: area, animations: "allow" });
  const context = await browser.newContext();
  try {
    const reader = await context.newPage();
    return await reader.evaluate(async (base64) => {
      const image = new Image();
      image.src = `data:image/png;base64,${base64}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(image, 0, 0);
      const { data } = ctx.getImageData(0, 0, image.width, image.height);
      let count = 0;
      let sumX = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (Math.max(r, g, b) - Math.min(r, g, b) < 24) continue;
        count++;
        sumX += (i / 4) % image.width;
      }
      return { count, x: count ? sumX / count / image.width : 0.5 };
    }, png.toString("base64"));
  } finally {
    await context.close();
  }
}
