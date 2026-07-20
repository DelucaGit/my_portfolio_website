export type Service = {
  slug: string;
  title: string;
  price: string;
  pill: string;
  description: string;
  features: string[];
  icon: "globe" | "spark" | "layers" | "shop" | "shield" | "megaphone";
  comingSoon?: boolean;
};

export const services: Service[] = [
  {
    slug: "web-development",
    title: "Webbutveckling",
    price: "Offert efter behov",
    pill: "Kostnadsfritt första samtal",
    description:
      "Sajter som berättar vad ni gör — och får besökaren att ta nästa steg.",
    features: [
      "Företags- och portfoliosajter",
      "Priskalkylatorer & formulär",
      "Byggt för fart och tydlighet",
    ],
    icon: "globe",
  },
  {
    slug: "ai-development",
    title: "AI-utveckling",
    price: "Offert efter behov",
    pill: "Anpassat till ert flöde",
    description:
      "AI som smyger in i det ni redan gör — chatbots, verktyg och automation.",
    features: [
      "Skräddarsydda AI-chattar",
      "Interna assistenter",
      "Bild- och innehållsverktyg",
    ],
    icon: "spark",
  },
  {
    slug: "custom-software",
    title: "Skräddarsydd mjukvara",
    price: "Offert efter behov",
    pill: "Runt er process",
    description:
      "System som tar bort det tråkiga arbetet — så att tiden och pengarna går dit de behövs.",
    features: [
      "Dashboards & adminverktyg",
      "Interna arbetsflöden",
      "Kopplingar mellan system",
    ],
    icon: "layers",
  },
  {
    slug: "ecommerce-tools",
    title: "E-handelsverktyg",
    price: "Offert efter behov",
    pill: "Byggt för säljflödet",
    description:
      "Butiker och säljverktyg där köpet känns enkelt — och uppföljningen blir tydlig.",
    features: [
      "Produkt- och checkoutflöden",
      "Order- och lagervyer",
      "Betalningsintegrationer",
    ],
    icon: "shop",
  },
];
