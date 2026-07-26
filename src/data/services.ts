export type ServiceIconName =
  | "globe"
  | "spark"
  | "layers"
  | "shop"
  | "shield"
  | "megaphone";

export type ServiceImage = {
  src: string;
  alt: string;
};

export type ServiceProcessStep = {
  title: string;
  description: string;
};

export type ServiceHighlight = {
  title: string;
  description: string;
  image: ServiceImage;
  tone: "blue" | "neutral";
};

export type ServicePoint = {
  title: string;
  description: string;
};

export type Service = {
  slug: string;
  title: string;
  description: string;
  features: string[];
  icon: ServiceIconName;
  comingSoon?: boolean;
  image: string;
  imageAlt: string;
  detail: {
    overview: string[];
    highlights: ServiceHighlight[];
    points: ServicePoint[];
    idealFor?: string;
    delivery?: string;
    timeline?: string;
    process: ServiceProcessStep[];
    media: {
      hero: ServiceImage;
      feature?: ServiceImage;
    };
    seo: {
      title?: string;
      description: string;
    };
  };
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
    image: "/services/web-development-hero.svg",
    imageAlt: "Illustration av modern webbplatslayout",
    detail: {
      overview: [
        "En hemsida ska göra mer än att finnas. Den ska förklara erbjudandet, bygga förtroende och göra det enkelt att höra av sig.",
      ],
      highlights: [
        {
          title: "Tydligt budskap",
          description:
            "Besökaren förstår vad ni erbjuder på några sekunder — och vad nästa steg är.",
          image: {
            src: "/services/web-development-hero.svg",
            alt: "Illustration av modern webbplatslayout",
          },
          tone: "blue",
        },
        {
          title: "Byggt för att konvertera",
          description:
            "Formulär, kalkylatorer och CTA:er där de behövs, utan att sidan känns plottrig.",
          image: {
            src: "/services/web-development-feature.svg",
            alt: "Illustration av tydliga sektioner och call-to-action",
          },
          tone: "neutral",
        },
      ],
      points: [
        {
          title: "Företags- och portfoliosajter",
          description:
            "Sidor som presenterar er verksamhet på ett sätt som känns trovärdigt och enkelt att skanna.",
        },
        {
          title: "Priskalkylatorer & formulär",
          description:
            "Verktyg som gör det lättare att lämna en förfrågan — utan onödig friktion.",
        },
        {
          title: "Fart och tydlighet",
          description:
            "Snabba laddningar, ren layout och innehåll som håller fokus på det viktiga.",
        },
      ],
      idealFor: "Företag som vill synas tydligt online",
      delivery: "Färdig webbplats + överlämning",
      timeline: "Oftast 2–6 veckor",
      process: [
        {
          title: "Samtal & mål",
          description:
            "Vi går igenom vad ni säljer, vem ni vill nå och vilket nästa steg som betyder mest.",
        },
        {
          title: "Struktur & design",
          description:
            "Sidkarta, layout och visuellt uttryck — så att budskapet landar innan vi bygger klart.",
        },
        {
          title: "Bygg & finputs",
          description:
            "Sidor, formulär och integrationer sätts ihop. Vi testar på mobil och desktop innan lansering.",
        },
        {
          title: "Lansering",
          description:
            "Publicering, snabb genomgång och stöd så att ni känner er trygga med sidan.",
        },
      ],
      media: {
        hero: {
          src: "/services/web-development-hero.svg",
          alt: "Illustration av modern webbplatslayout",
        },
        feature: {
          src: "/services/web-development-feature.svg",
          alt: "Illustration av tydliga sektioner och call-to-action på en webbplats",
        },
      },
      seo: {
        title: "Webbutveckling",
        description:
          "Hemsidor för företag som vill synas tydligt — snabb, konverterande webbutveckling med fokus på innehåll, fart och nästa steg.",
      },
    },
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
    image: "/services/ai-development-hero.svg",
    imageAlt: "Illustration av AI-assistent och automation",
    detail: {
      overview: [
        "AI är mest värdefull när den tar bort repetitivt arbete — inte när den bara är en demo.",
      ],
      highlights: [
        {
          title: "Anpassad till er kunskap",
          description:
            "Svaren bygger på hur ni jobbar och vad ni erbjuder — inte på generiska mallar.",
          image: {
            src: "/services/ai-development-hero.svg",
            alt: "Illustration av AI-assistent och automation",
          },
          tone: "blue",
        },
        {
          title: "Nyttig i vardagen",
          description:
            "Chattar, assistenter och verktyg som sparar tid för teamet eller kunderna.",
          image: {
            src: "/services/ai-development-feature.svg",
            alt: "Illustration av chattflöde och smarta svar",
          },
          tone: "neutral",
        },
      ],
      points: [
        {
          title: "Skräddarsydda AI-chattar",
          description:
            "Kundnära svar som kan era tjänster och leder vidare till rätt nästa steg.",
        },
        {
          title: "Interna assistenter",
          description:
            "Hjälp för support, sälj eller admin — utan att någon behöver jaga information.",
        },
        {
          title: "Bild- och innehållsverktyg",
          description:
            "Automation runt texter, bilder eller mallar ni redan använder i arbetet.",
        },
      ],
      idealFor: "Team som vill automatisera återkommande frågor",
      delivery: "Färdig AI-lösning + instruktion",
      timeline: "Oftast 3–8 veckor",
      process: [
        {
          title: "Hitta rätt use case",
          description:
            "Vi väljer ett flöde där AI ger tydlig nytta — inte där den bara är en kul grej.",
        },
        {
          title: "Kunskap & regler",
          description:
            "Vi samlar er information, sätter gränser och bestämmer hur svaren ska låta.",
        },
        {
          title: "Bygg & testa",
          description:
            "Lösningen kopplas in, testas mot verkliga frågor och justeras tills kvaliteten håller.",
        },
        {
          title: "Drift & förbättring",
          description:
            "Ni får något ni kan använda direkt, plus en plan för hur det kan förbättras.",
        },
      ],
      media: {
        hero: {
          src: "/services/ai-development-hero.svg",
          alt: "Illustration av AI-assistent och automation",
        },
        feature: {
          src: "/services/ai-development-feature.svg",
          alt: "Illustration av chattflöde och smarta svar",
        },
      },
      seo: {
        title: "AI-utveckling",
        description:
          "Skräddarsydd AI för företag — chattar, interna assistenter och automation som sparar tid i vardagen.",
      },
    },
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
    image: "/services/custom-software-hero.svg",
    imageAlt: "Illustration av dashboard och interna system",
    detail: {
      overview: [
        "När kalkylark och mejltrådar bromsar tillväxten behövs något mer anpassat — byggt runt hur ni faktiskt arbetar.",
      ],
      highlights: [
        {
          title: "Byggt runt ert flöde",
          description:
            "Verktyget speglar hur teamet jobbar idag, utan att ni behöver anpassa er till en färdig produkt.",
          image: {
            src: "/services/custom-software-hero.svg",
            alt: "Illustration av dashboard och interna system",
          },
          tone: "blue",
        },
        {
          title: "Mindre manuellt jobb",
          description:
            "Dashboards, adminpaneler och kopplingar som tar bort upprepade steg och minskar fel.",
          image: {
            src: "/services/custom-software-feature.svg",
            alt: "Illustration av arbetsflöde mellan system",
          },
          tone: "neutral",
        },
      ],
      points: [
        {
          title: "Dashboards & adminverktyg",
          description:
            "Översikt och kontroll på ett ställe — så att rätt person ser rätt information.",
        },
        {
          title: "Interna arbetsflöden",
          description:
            "Från förfrågan till klart utan mejlkaos, dubbletter eller glömda steg.",
        },
        {
          title: "Kopplingar mellan system",
          description:
            "Data flyttas dit den behövs, så ni slipper kopiera samma sak flera gånger.",
        },
      ],
      idealFor: "Bolag med manuella processer som vuxit ur Excel",
      delivery: "System + utbildning för teamet",
      timeline: "Oftast 4–12 veckor",
      process: [
        {
          title: "Kartläggning",
          description:
            "Vi går igenom hur arbetet görs idag, var tid försvinner och vilka system som redan finns.",
        },
        {
          title: "Prototyp",
          description:
            "En tidig version visar flödet i praktiken, så att ni kan säga till innan allt byggs klart.",
        },
        {
          title: "Utveckling",
          description:
            "Verktyget byggs ut med roller, behörigheter och de kopplingar ni behöver.",
        },
        {
          title: "Överlämning",
          description:
            "Teamet får en kort genomgång, dokumentation och stöd under de första veckorna.",
        },
      ],
      media: {
        hero: {
          src: "/services/custom-software-hero.svg",
          alt: "Illustration av dashboard och interna system",
        },
        feature: {
          src: "/services/custom-software-feature.svg",
          alt: "Illustration av arbetsflöde mellan system",
        },
      },
      seo: {
        title: "Skräddarsydd mjukvara",
        description:
          "Interna system, dashboards och arbetsflöden som tar bort manuellt arbete och gör vardagen enklare.",
      },
    },
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
    image: "/services/ecommerce-tools-hero.svg",
    imageAlt: "Illustration av e-handel och checkoutflöde",
    detail: {
      overview: [
        "En bra e-handel gör det enkelt att hitta, välja och betala — och ger er koll på ordrar efteråt.",
      ],
      highlights: [
        {
          title: "Enköp som känns enkelt",
          description:
            "Tydliga produktsidor och en checkout som inte krånglar — så fler kommer i mål.",
          image: {
            src: "/services/ecommerce-tools-hero.svg",
            alt: "Illustration av e-handel och checkoutflöde",
          },
          tone: "blue",
        },
        {
          title: "Koll efter köpet",
          description:
            "Order- och lagervyer som visar vad som sålts, vad som ska skickas och vad som saknas.",
          image: {
            src: "/services/ecommerce-tools-feature.svg",
            alt: "Illustration av orderöversikt och produktkort",
          },
          tone: "neutral",
        },
      ],
      points: [
        {
          title: "Produkt- och checkoutflöden",
          description:
            "Från produkt till betalning med få steg och tydliga val längs vägen.",
        },
        {
          title: "Order- och lagervyer",
          description:
            "Intern översikt som gör det lättare att leverera rätt sak i rätt tid.",
        },
        {
          title: "Betalningsintegrationer",
          description:
            "Säkra och bekanta betalsätt som kunderna redan litar på.",
        },
      ],
      idealFor: "Företag som säljer produkter online",
      delivery: "Butik / verktyg + betalningskoppling",
      timeline: "Oftast 3–10 veckor",
      process: [
        {
          title: "Sortiment & mål",
          description:
            "Vi går igenom produkter, betalningar och hur ni vill att köpet ska kännas.",
        },
        {
          title: "Kundresa",
          description:
            "Produktsidor, varukorg och checkout ritas upp så att stegen blir få och tydliga.",
        },
        {
          title: "Bygg & integrationer",
          description:
            "Butiken kopplas till betalning, orderhantering och det ni behöver för lager.",
        },
        {
          title: "Lansering & uppföljning",
          description:
            "Ni går live — och vi finjusterar utifrån hur kunderna faktiskt handlar.",
        },
      ],
      media: {
        hero: {
          src: "/services/ecommerce-tools-hero.svg",
          alt: "Illustration av e-handel och checkoutflöde",
        },
        feature: {
          src: "/services/ecommerce-tools-feature.svg",
          alt: "Illustration av orderöversikt och produktkort",
        },
      },
      seo: {
        title: "E-handelsverktyg",
        description:
          "E-handel och säljverktyg med tydlig checkout, orderhantering och betalningsintegrationer.",
      },
    },
  },
];
