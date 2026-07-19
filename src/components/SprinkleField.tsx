/** Dot-sprinkle background used behind the Hero and Contact sections. */
export default function SprinkleField({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g>
        {sprinkles.map((dot, i) => (
          <rect
            key={i}
            x={dot.x}
            y={dot.y}
            width={dot.w}
            height={dot.h}
            rx={Math.min(dot.w, dot.h) / 2.5}
            fill={dot.color}
            opacity={dot.opacity}
            transform={`rotate(${dot.rotate} ${dot.x + dot.w / 2} ${dot.y + dot.h / 2})`}
          />
        ))}
      </g>
    </svg>
  );
}

const COLORS = [
  "#4285F4",
  "#1A73E8",
  "#EA4335",
  "#F5380A",
  "#FBBC05",
  "#F9AB00",
  "#34A853",
  "#FF6D01",
  "#A142F4",
  "#E91E63",
];

type Sprinkle = {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  opacity: number;
  rotate: number;
};

type Ring = {
  rx: number;
  ry: number;
  count: number;
  start: number;
  end: number;
  weight: number;
};

/** Deterministic pseudo-random in [0, 1) from an integer seed. */
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function buildSprinkles(): Sprinkle[] {
  const dots: Sprinkle[] = [];
  const cx = 600;
  const cy = 450;

  // Soft elliptical rings that curve around the text (clearer center gap).
  const rings: Ring[] = [
    { rx: 290, ry: 200, count: 56, start: -25, end: 205, weight: 0.55 },
    { rx: 360, ry: 250, count: 72, start: -45, end: 225, weight: 0.85 },
    { rx: 430, ry: 300, count: 88, start: -55, end: 235, weight: 1 },
    { rx: 500, ry: 350, count: 96, start: -65, end: 245, weight: 1 },
    { rx: 570, ry: 400, count: 80, start: -50, end: 230, weight: 0.75 },
    { rx: 640, ry: 450, count: 64, start: -35, end: 215, weight: 0.5 },
  ];

  let i = 0;
  for (const ring of rings) {
    for (let n = 0; n < ring.count; n++) {
      const t = n / (ring.count - 1);
      const angleDeg = ring.start + (ring.end - ring.start) * t;
      const angle = (angleDeg * Math.PI) / 180;

      // Radial + tangential jitter so rings feel organic, not perfect ellipses.
      const rJitter = 0.88 + rand(i * 3) * 0.28;
      const aJitter = ((rand(i * 5) - 0.5) * 8 * Math.PI) / 180;
      const a = angle + aJitter;

      const x = cx + Math.cos(a) * ring.rx * rJitter + (rand(i * 7) - 0.5) * 18;
      const y = cy + Math.sin(a) * ring.ry * rJitter + (rand(i * 11) - 0.5) * 14;

      // Keep the middle readable — skip dots that land too close to center.
      const dx = (x - cx) / 280;
      const dy = (y - cy) / 190;
      if (dx * dx + dy * dy < 1) {
        i += 1;
        continue;
      }

      const long = 2.5 + rand(i * 13) * 5.5;
      const short = 1.8 + rand(i * 17) * 2.8;
      const tall = rand(i * 19) > 0.55;

      dots.push({
        x,
        y,
        w: tall ? short : long,
        h: tall ? long : short,
        color: COLORS[Math.floor(rand(i * 23) * COLORS.length)],
        opacity: (0.28 + rand(i * 29) * 0.55) * ring.weight,
        rotate: rand(i * 31) * 180,
      });
      i += 1;
    }
  }

  // Sparse outer scatter for depth at the edges.
  for (let n = 0; n < 40; n++) {
    const seed = 1000 + n;
    const x = rand(seed) * 1200;
    const y = rand(seed + 1) * 900;
    const dx = (x - cx) / 520;
    const dy = (y - cy) / 380;
    const dist = dx * dx + dy * dy;
    if (dist < 0.85 || dist > 1.6) continue;

    const size = 2 + rand(seed + 2) * 4;
    dots.push({
      x,
      y,
      w: size,
      h: size * (0.6 + rand(seed + 3) * 0.8),
      color: COLORS[Math.floor(rand(seed + 4) * COLORS.length)],
      opacity: 0.2 + rand(seed + 5) * 0.35,
      rotate: rand(seed + 6) * 180,
    });
  }

  return dots;
}

const sprinkles = buildSprinkles();
