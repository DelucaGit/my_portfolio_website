export type Service = {
  slug: string;
  title: string;
  description: string;
  features: string[];
  icon: "globe" | "spark" | "layers" | "shop" | "shield" | "megaphone";
  comingSoon?: boolean;
};

export const services: Service[] = [
  {
    slug: "web-development",
    title: "Webbutveckling",
    description:
      "Hemsidor som berättar vad ni gör — och får besökaren att ta nästa steg.",
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
    description:
      "AI där det faktiskt sparar tid — chattar, assistenter och automation.",
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
    description:
      "System som tar bort det manuella arbetet, så att tiden går dit den behövs.",
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
