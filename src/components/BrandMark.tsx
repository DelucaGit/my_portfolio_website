/** The three coloured dashes next to the name in the menu. Decorative. */
export default function BrandMark() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <rect
        x="2"
        y="9"
        width="6"
        height="2.6"
        rx="1.3"
        fill="#e2401a"
        transform="rotate(-62 5 10.3)"
      />
      <rect
        x="7"
        y="3.4"
        width="6"
        height="2.6"
        rx="1.3"
        fill="#8a4fe0"
        transform="rotate(-8 10 4.7)"
      />
      <rect
        x="12"
        y="9"
        width="6"
        height="2.6"
        rx="1.3"
        fill="#2f6bf6"
        transform="rotate(62 15 10.3)"
      />
    </svg>
  );
}
