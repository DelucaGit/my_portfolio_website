export type ProjectTheme = {
  bg: string;
  dark: boolean;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  siteUrl: string;
  githubUrl: string;
  tags: string[];
  year: number;
  stack: string[];

  image: string;
  imageAlt: string;
  theme: ProjectTheme;

  detail: {
    overview: string[];
    challenge?: string[];
    solution?: string[];
    results?: string[];
    gallery?: { src: string; alt: string }[];
    seo: {
      title?: string;
      description: string;
    };
  };
};

export const projects: Project[] = [
  {
    slug: "ledgerly",
    name: "Ledgerly",
    tagline: "Invoicing and cash-flow dashboard for small agencies.",
    description:
      "A lightweight finance tool that helps small agencies track invoices, payments, and cash flow in one place.",
    siteUrl: "https://ledgerly.example.com",
    githubUrl: "https://github.com/marceldeluca/ledgerly",
    tags: ["SaaS", "Finance"],
    year: 2024,
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Analytics dashboard showing invoice and revenue charts",
    theme: {
      bg: "var(--project-theme-cool)",
      dark: false,
    },
    detail: {
      overview: [
        "Ledgerly gives small agencies a single dashboard to send invoices, track payments, and see their cash flow at a glance.",
        "The client came in with numbers spread across three separate tools — this consolidated everything into one system.",
      ],
      challenge: [
        "Payments, invoices, and expenses lived in different tools, making it hard to know the real cash position on any given day.",
      ],
      solution: [
        "Built a unified dashboard on Next.js with Stripe for payments and a Postgres ledger that reconciles transactions automatically.",
      ],
      results: [
        "Agencies using Ledgerly cut their monthly bookkeeping time in half and catch overdue invoices days earlier.",
      ],
      gallery: [
        {
          src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
          alt: "Ledgerly dashboard on a laptop screen",
        },
      ],
      seo: {
        description:
          "Case study: Ledgerly, an invoicing and cash-flow dashboard for small agencies.",
      },
    },
  },
  {
    slug: "shelfwise",
    name: "Shelfwise",
    tagline: "Inventory and reorder alerts for small e-commerce shops.",
    description:
      "An inventory tracker that watches stock levels across sales channels and warns shop owners before they run out.",
    siteUrl: "https://shelfwise.example.com",
    githubUrl: "https://github.com/marceldeluca/shelfwise",
    tags: ["E-commerce", "Automation"],
    year: 2023,
    stack: ["React", "Node.js", "Shopify API", "Redis"],
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Warehouse shelving stacked with boxes",
    theme: {
      bg: "var(--project-theme-warm)",
      dark: false,
    },
    detail: {
      overview: [
        "Shelfwise watches stock levels across a shop's sales channels and flags items before they sell out.",
      ],
      challenge: [
        "The client was manually checking spreadsheets every morning and still ran out of bestsellers during busy weeks.",
      ],
      solution: [
        "Connected the Shopify API to a Redis-backed alert system that checks stock levels hourly and emails the owner before items run out.",
      ],
      results: [
        "Stockouts on top sellers dropped to near zero in the first restock cycle after launch.",
      ],
      seo: {
        description:
          "Case study: Shelfwise, an inventory and reorder alert system for small e-commerce shops.",
      },
    },
  },
  {
    slug: "focusframe",
    name: "Focusframe",
    tagline: "A distraction-free scheduling tool for solo consultants.",
    description:
      "A booking and scheduling app that keeps a consultant's calendar simple, with automatic time-zone handling and reminders.",
    siteUrl: "https://focusframe.example.com",
    githubUrl: "https://github.com/marceldeluca/focusframe",
    tags: ["Productivity", "Web App"],
    year: 2022,
    stack: ["Next.js", "tRPC", "Prisma", "PostgreSQL"],
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Laptop screen showing a calendar and scheduling interface",
    theme: {
      bg: "var(--project-theme-dark)",
      dark: true,
    },
    detail: {
      overview: [
        "Focusframe replaces a cluttered booking page with a single clean calendar that handles time zones automatically.",
      ],
      challenge: [
        "The consultant was losing bookings to time-zone mix-ups and no-shows with no reminder system in place.",
      ],
      solution: [
        "Built a scheduling flow on Next.js and Prisma that detects the visitor's time zone and sends automatic email reminders.",
      ],
      results: [
        "No-shows dropped noticeably in the first month, and double-bookings across time zones stopped entirely.",
      ],
      seo: {
        description:
          "Case study: Focusframe, a distraction-free scheduling tool for solo consultants.",
      },
    },
  },
];
