export type ProjectTheme = {
  bg: string;
  dark: boolean; // true = dark bg → use light text
};

export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  theme: ProjectTheme;
};

export const projects: Project[] = [
  {
    id: "atlas-studio",
    title: "Atlas Studio",
    description:
      "A creative agency site built around motion and restraint. Large typographic hero, fluid page transitions, and a CMS-driven case study grid that loads in under a second.",
    image: "/projects/project-1.png",
    imageAlt: "Atlas Studio creative agency website mockup",
    theme: { bg: "#f0ebe3", dark: false }, // warm sand
  },
  {
    id: "maison-noir",
    title: "Maison Noir",
    description:
      "An editorial e-commerce experience for an independent fashion label. Product storytelling, size-aware imagery, and a checkout flow tuned for mobile-first shoppers.",
    image: "/projects/project-2.png",
    imageAlt: "Maison Noir fashion e-commerce website mockup",
    theme: { bg: "#0f0f0f", dark: true }, // near-black editorial
  },
  {
    id: "pulse-metrics",
    title: "Pulse Metrics",
    description:
      "A SaaS marketing site and onboarding shell for a data analytics platform. Interactive dashboard previews, pricing tiers, and docs integrated into one cohesive product story.",
    image: "/projects/project-3.png",
    imageAlt: "Pulse Metrics SaaS analytics website mockup",
    theme: { bg: "#e8f0ff", dark: false }, // cool blue-white
  },
];
