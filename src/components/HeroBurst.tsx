const DOT_COLORS = [
  "#4285f4",
  "#ea4335",
  "#fbbc04",
  "#34a853",
  "#a142f4",
  "#ff6d01",
  "#46bdc6",
  "#e8710a",
];

type Dot = {
  x: number;
  y: number;
  r: number;
  color: string;
  opacity: number;
};

function buildDots(): Dot[] {
  const dots: Dot[] = [];
  const goldenAngle = 137.508 * (Math.PI / 180);

  for (let i = 0; i < 160; i++) {
    const angle = i * goldenAngle;
    const radius = 28 + Math.sqrt(i) * 22;
    const x = 500 + Math.cos(angle) * radius * 1.15;
    const y = 380 + Math.sin(angle) * radius * 0.75;
    dots.push({
      x,
      y,
      r: i % 5 === 0 ? 2.4 : 1.6,
      color: DOT_COLORS[i % DOT_COLORS.length],
      opacity: 0.45 + (i % 4) * 0.12,
    });
  }

  return dots;
}

const DOTS = buildDots();

export default function HeroBurst() {
  return (
    <svg
      viewBox="0 0 1000 760"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {DOTS.map((dot, i) => (
        <circle
          key={i}
          cx={dot.x}
          cy={dot.y}
          r={dot.r}
          fill={dot.color}
          opacity={dot.opacity}
        />
      ))}
    </svg>
  );
}
