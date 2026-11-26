/**
 * The painted landscapes of the Tyngdlös design: a few thousand short brush
 * strokes drawn from a seed, so a painting looks the same on every visit.
 */

type Hsl = [hue: number, saturation: number, lightness: number];

type Palette = {
  /** The seed used when the caller does not give one */
  seed: number;
  sky0: Hsl;
  sky1: Hsl;
  far: Hsl;
  near: Hsl;
  field: Hsl;
};

export const PAINTING_PALETTES = {
  morgon: {
    seed: 11,
    sky0: [216, 26, 74],
    sky1: [34, 46, 86],
    far: [224, 17, 62],
    near: [96, 17, 43],
    field: [44, 40, 58],
  },
  hav: {
    seed: 5,
    sky0: [204, 30, 78],
    sky1: [188, 26, 88],
    far: [208, 28, 58],
    near: [172, 22, 40],
    field: [50, 32, 64],
  },
  kvall: {
    seed: 23,
    sky0: [252, 22, 66],
    sky1: [22, 62, 80],
    far: [266, 16, 48],
    near: [206, 20, 34],
    field: [28, 46, 50],
  },
  skog: {
    seed: 41,
    sky0: [190, 18, 80],
    sky1: [60, 30, 86],
    far: [150, 16, 52],
    near: [128, 22, 32],
    field: [78, 30, 46],
  },
} satisfies Record<string, Palette>;

export type PaintingPalette = keyof typeof PAINTING_PALETTES;

/** The canvas is painted at this size and stretched with CSS. */
const WIDTH = 760;
const HEIGHT = 500;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function mix(from: Hsl, to: Hsl, amount: number): Hsl {
  const turn = ((to[0] - from[0] + 540) % 360) - 180;
  return [
    (from[0] + turn * amount + 360) % 360,
    from[1] + (to[1] - from[1]) * amount,
    from[2] + (to[2] - from[2]) * amount,
  ];
}

const hsl = (colour: Hsl) =>
  `hsl(${colour[0].toFixed(0)} ${colour[1].toFixed(0)}% ${colour[2].toFixed(0)}%)`;

/**
 * Paints the landscape on the canvas. `seed` defaults to the palette's own,
 * which gives the painting from the design; another seed gives another
 * landscape in the same colours.
 */
export function paintLandscape(
  canvas: HTMLCanvasElement,
  paletteName: PaintingPalette,
  seed?: number,
) {
  const palette: Palette = PAINTING_PALETTES[paletteName];
  const c = canvas.getContext("2d");
  if (!c) return;

  const W = (canvas.width = WIDTH);
  const H = (canvas.height = HEIGHT);

  let state = (seed ?? palette.seed) * 9301 + 49297;
  const rnd = () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const a = rnd() * 6;
  const b = rnd() * 6;
  const d = rnd() * 6;
  /* Three ridges: far hills, near hills and the meadow in front. */
  const ridge1 = (x: number) =>
    H * (0.5 + 0.05 * Math.sin(x * 0.007 + a) + 0.025 * Math.sin(x * 0.019 + b));
  const ridge2 = (x: number) =>
    H * (0.66 + 0.07 * Math.sin(x * 0.005 + d) + 0.02 * Math.sin(x * 0.023 + a));
  const ridge3 = (x: number) => H * (0.85 + 0.035 * Math.sin(x * 0.009 + b));

  const sky = c.createLinearGradient(0, 0, 0, H * 0.6);
  for (let n = 0; n <= 6; n++) {
    sky.addColorStop(
      n / 6,
      hsl(mix(palette.sky0, palette.sky1, ((n / 6) * n) / 6)),
    );
  }
  c.fillStyle = sky;
  c.fillRect(0, 0, W, H);

  const layers: [(x: number) => number, Hsl][] = [
    [ridge1, palette.far],
    [ridge2, palette.near],
    [ridge3, palette.field],
  ];
  for (const [ridge, colour] of layers) {
    c.fillStyle = hsl(colour);
    c.beginPath();
    c.moveTo(0, H);
    for (let x = 0; x <= W; x += 8) c.lineTo(x, ridge(x));
    c.lineTo(W, H);
    c.fill();
  }

  const dab = (
    x: number,
    y: number,
    length: number,
    width: number,
    angle: number,
    colour: Hsl,
    alpha: number,
  ) => {
    c.save();
    c.translate(x, y);
    c.rotate(angle);
    c.globalAlpha = alpha;
    c.fillStyle = hsl([
      colour[0] + (rnd() - 0.5) * 10,
      colour[1] + (rnd() - 0.5) * 8,
      colour[2] + (rnd() - 0.5) * 9,
    ]);
    c.beginPath();
    if (c.roundRect) {
      c.roundRect(-length / 2, -width / 2, length, width, width / 2);
    } else {
      c.rect(-length / 2, -width / 2, length, width);
    }
    c.fill();
    c.restore();
  };

  /* Back to front: sky, far hills, near hills, meadow. Each layer overlaps the one behind it. */
  for (let i = 0; i < 1700; i++) {
    const x = rnd() * W;
    const y = rnd() * H * 0.62;
    const k = clamp(y / (H * 0.52), 0, 1);
    let colour = mix(palette.sky0, palette.sky1, k * k);
    const t =
      Math.sin(x * 0.009 + a + y * 0.03) * Math.sin(y * 0.035 + b) +
      0.5 * Math.sin(x * 0.004 + d);
    if (t > 0.5) {
      colour = [colour[0], colour[1] * 0.55, Math.min(96, colour[2] + 6 + t * 5)];
    }
    dab(x, y, 30 + rnd() * 50, 4 + rnd() * 6, (rnd() - 0.5) * 0.22, colour, 0.55);
  }
  for (let i = 0; i < 1300; i++) {
    const x = rnd() * W;
    const top = ridge1(x);
    const bottom = ridge2(x) + 12;
    const t = Math.pow(rnd(), 1.25);
    const y = top + t * (bottom - top);
    const colour = mix(
      mix(palette.far, palette.sky1, 0.3 * (1 - t)),
      palette.near,
      t * 0.3,
    );
    dab(
      x,
      y,
      16 + rnd() * 26,
      3 + rnd() * 4,
      Math.atan((ridge1(x + 8) - top) / 8) + (rnd() - 0.5) * 0.35,
      colour,
      0.8,
    );
  }
  for (let i = 0; i < 1500; i++) {
    const x = rnd() * W;
    const top = ridge2(x);
    const bottom = ridge3(x) + 12;
    const t = Math.pow(rnd(), 1.2);
    const y = top + t * (bottom - top);
    const k = 0.5 + 0.5 * Math.sin(x * 0.013 + b + y * 0.02);
    let colour = mix(palette.near, palette.field, t * 0.3 + k * 0.25);
    colour = [colour[0], colour[1], colour[2] + (k - 0.5) * 10];
    dab(
      x,
      y,
      12 + rnd() * 22,
      3 + rnd() * 4,
      Math.atan((ridge2(x + 8) - top) / 8) + (rnd() - 0.5) * 0.5,
      colour,
      0.85,
    );
  }
  for (let i = 0; i < 1900; i++) {
    const x = rnd() * W;
    const top = ridge3(x);
    const t = Math.pow(rnd(), 0.9);
    const y = top + t * (H - top);
    const k = 0.5 + 0.5 * Math.sin(x * 0.01 + d - y * 0.03);
    let colour = mix(palette.field, palette.near, k * 0.3);
    colour = [colour[0], colour[1], colour[2] + (k - 0.5) * 12 - t * 6];
    if (rnd() < 0.05) colour = [palette.sky1[0], 60, 84];
    dab(
      x,
      y,
      9 + rnd() * 16 + t * 8,
      2.5 + rnd() * 3,
      -1.15 + (rnd() - 0.5) * 0.7,
      colour,
      0.85,
    );
  }
}
