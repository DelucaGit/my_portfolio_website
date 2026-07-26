export type ProjectTheme = {
  bg: string;
  dark: boolean;
};

export type ProjectImage = {
  src: string;
  alt: string;
};

export type MediaSectionCopy = {
  eyebrow: string;
  heading: string;
  support: string;
};

export type ProjectMedia = {
  hero: ProjectImage;
  feature?: ProjectImage;
  /** Phone screenshots — shown in the shared mobile mockup strip */
  mobile: ProjectImage[];
  fullPage?: ProjectImage;
  fullPageCopy?: MediaSectionCopy;
  desktop?: ProjectImage;
  desktopCopy?: MediaSectionCopy;
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
    role?: string;
    client?: string;
    industry?: string;
    media: ProjectMedia;
    seo: {
      title?: string;
      description: string;
    };
  };
};

const ph = {
  wide: "/projects/placeholders/wide.svg",
  tall: "/projects/placeholders/tall.svg",
  phone: "/projects/placeholders/phone.svg",
} as const;

export const projects: Project[] = [
  {
    slug: "takkoll",
    name: "TakKoll",
    tagline: "Skyddar svenska hem – ett tak i taget.",
    description:
      "Webbplats för TakKoll: takmålning, omläggning, tvätt, isolering och service — med bokning och ROT synligt från start.",
    siteUrl: "https://takkoll.se",
    githubUrl: "",
    tags: ["WordPress", "Lokalt", "Leadgen"],
    year: 2025,
    stack: ["WordPress", "Elementor"],
    image: "/projects/takkoll/hero.jpg",
    imageAlt: "TakKoll startsida — professionella taklösningar",
    theme: {
      bg: "var(--project-theme-roof)",
      dark: false,
    },
    detail: {
      overview: [
        "Ett tak är husets viktigaste skydd. Ändå är det ofta det man skjuter på att ta hand om. TakKoll ville ändra på det.",
        "De erbjuder allt från taktvätt och målning till omläggning, isolering och serviceavtal. Men deras tidigare sida gjorde det svårt för husägare att förstå vad de faktiskt fick hjälp med — och varför det var smart att agera i tid.",
      ],
      challenge: [
        "Husägare förstod inte erbjudandet. Tjänsterna fanns, men sidan förklarade varken vad som ingick eller varför det lönade sig att boka en besiktning innan skadan blev dyr.",
      ],
      solution: [
        "Vi tog fram en ny lösning: kostnadsfri onlinebokning av takbesiktning där kunden själv väljer datum. Tjänsterna paketerades tydligt — vad de innebär och varför de behövs. ROT-avdraget syns från start, så besökaren ser hur mycket som går att spara. FAQ och guider svarar på vanliga frågor och bygger förtroende.",
      ],
      results: [
        "Nu möts besökaren av en hemsida som förklarar, förenklar och gör det lätt att boka. TakKoll får in fler förfrågningar — och husägare får bättre skydd för sina hem.",
      ],
      role: "Design & WordPress-bygge",
      client: "TakKoll",
      industry: "Tak & fastighetsservice",
      media: {
        hero: {
          src: "/projects/takkoll/hero.jpg",
          alt: "TakKoll-hero med takarbetare och tydlig CTA",
        },
        feature: {
          src: "/projects/takkoll/services.jpg",
          alt: "TakKolls tjänstekort — målning, omläggning, service och isolering",
        },
        mobile: [
          {
            src: "/projects/takkoll/mobile-1.png",
            alt: "TakKoll mobil hero med ROT-avdrag på takrenovering",
          },
          {
            src: "/projects/takkoll/mobile-2.png",
            alt: "TakKoll mobil tjänstekort — takmålning och takomläggning",
          },
          {
            src: "/projects/takkoll/mobile-3.png",
            alt: "TakKoll mobil — därför väljer husägare TakKoll, med kostnadsfri offert",
          },
        ],
        fullPage: {
          src: "/projects/takkoll/page-home.png",
          alt: "Hela TakKoll-startsida från topp till botten",
        },
        fullPageCopy: {
          eyebrow: "Hela sidan",
          heading: "Scrolla igenom hela berättelsen.",
          support:
            "Från hero och ROT till tjänster, FAQ och bokning — dra eller scrolla inne i ramen.",
        },
        desktop: {
          src: "/projects/takkoll/safety-viewport.png",
          alt: "TakKoll taksäkerhet — utrustning enligt Boverkets regler",
        },
        desktopCopy: {
          eyebrow: "Trygghet",
          heading: "Taksäkerhet enligt boken — inte löst prat.",
          support:
            "Snörasskydd, gångbryggor och livlinefästen, installerat och dokumenterat enligt Boverkets regler.",
        },
      },
      seo: {
        title: "TakKoll — WordPress",
        description:
          "Case: TakKoll — hur en tydligare WordPress-sajt gjorde takbesiktning enkelt att boka och ROT synligt från start.",
      },
    },
  },
  {
    slug: "bilservicekoll",
    name: "BilserviceKoll",
    tagline: "Bilverkstaden i Gävle som gör det enkelt att serva bilen.",
    description:
      "Webbplats för BilserviceKoll: service, oljebyten, däck och besiktningskontroll — med onlinebokning och bilupphämtning.",
    siteUrl: "https://bilservicekoll.se",
    githubUrl: "",
    tags: ["WordPress", "Lokalt", "Leadgen"],
    year: 2025,
    stack: ["WordPress", "Elementor"],
    image: "/projects/bilservicekoll/hero-viewport.png",
    imageAlt: "BilserviceKoll startsida — hero med bilservice och biluppämtning",
    theme: {
      bg: "var(--project-theme-sand)",
      dark: false,
    },
    detail: {
      overview: [
        "Bilar måste servas. Men för många känns det krångligt.",
        "BilserviceKoll ville ändra på det. De erbjuder service, oljebyten, däck och besiktningskontroll — till och med upphämtning av bilen hemma eller på jobbet.",
      ],
      challenge: [
        "Hemsidan visade inte fördelarna. Tjänsterna var svåra att överblicka. Och bokningen saknade enkelhet.",
      ],
      solution: [
        "Vi byggde en ny hemsida: ett smidigt bokningssystem online där kunden bokar tid och får offert bekräftad innan arbetet startar. Tjänsterna presenterades tydligt i enkla block. Verkstadens garanti på godkänd besiktning lyftes fram. Formulär och kontaktvägar gjorde det enkelt att boka, fråga och få svar.",
      ],
      results: [
        "Fler bokningar via hemsidan, färre frågetecken hos kunderna — och en digital närvaro som speglar verkstadens löfte: trygghet, transparens och service på riktigt.",
      ],
      role: "Design & WordPress-bygge",
      client: "BilserviceKoll",
      industry: "Bilverkstad",
      media: {
        hero: {
          src: "/projects/bilservicekoll/hero-viewport.png",
          alt: "BilserviceKoll startsida — hero med bilservice och biluppämtning",
        },
        feature: {
          src: "/projects/bilservicekoll/services-viewport.png",
          alt: "BilserviceKoll tjänster — bilservice, oljebyte, besiktning, däckbyte och däckhotell",
        },
        mobile: [],
        fullPage: {
          src: "/projects/bilservicekoll/page-home.webp",
          alt: "Hela BilserviceKoll-startsida från topp till botten",
        },
        fullPageCopy: {
          eyebrow: "Hela sidan",
          heading: "Scrolla igenom hela berättelsen.",
          support:
            "Dra eller scrolla inne i ramen för att se sidan från topp till botten.",
        },
        desktop: {
          src: "/projects/bilservicekoll/booking-calendar.webp",
          alt: "Bokningskalender — välj tjänst, datum och tid direkt på sajten",
        },
        desktopCopy: {
          eyebrow: "Bokning",
          heading: "Ingen telefon behövs — tiden bokas direkt.",
          support:
            "Kunden väljer tjänst, datum och tid i en kalender som visar lediga tider live.",
        },
      },
      seo: {
        title: "BilserviceKoll — WordPress",
        description:
          "Case: BilserviceKoll — hur en tydligare WordPress-sajt gjorde bilservice i Gävle enkelt att boka.",
      },
    },
  },
  {
    slug: "stadkoll",
    name: "Städkoll",
    tagline: "Flyttstädning utan stress – till fast pris.",
    description:
      "Webbplats för Städkoll: professionell flyttstädning till fast pris, med 14 dagars garanti och RUT-avdrag.",
    siteUrl: "https://stadkoll.se",
    githubUrl: "",
    tags: ["Frontend", "UX/UI", "Leadgen"],
    year: 2025,
    stack: ["Frontend", "UX & UI-design"],
    image: "/projects/stadkoll/hero-viewport.webp",
    imageAlt: "Städkoll startsida — hero med flyttstädning till fast pris",
    theme: {
      bg: "var(--project-theme-sage)",
      dark: false,
    },
    detail: {
      overview: [
        "Att flytta är jobbigt nog. Och för många blir flyttstädningen droppen.",
        "Städkoll ville göra det enkelt. De erbjuder professionell flyttstädning till fast pris, med 14 dagars garanti och direkt RUT-avdrag.",
      ],
      challenge: [
        "Hemsidan de hade berättade inte det på ett tydligt sätt. Kunderna fick inte den trygghet och enkelhet som faktiskt fanns i tjänsten.",
      ],
      solution: [
        "Vi byggde en ny hemsida: en tydlig offertfunktion som ger kunden ett fast pris direkt. En enkel struktur som lyfter vad som ingår i flyttstädningen. Garantin och RUT-avdraget synligt från start, så att kunden känner sig trygg. Snabb kontaktväg via formulär och call-to-action på varje sida.",
      ],
      results: [
        "Fler förfrågningar, en smidigare process för kunderna och en hemsida som speglar Städkolls löfte — trygg, enkel och prisvärd flyttstädning.",
      ],
      role: "Frontend, UX & UI-design",
      client: "Städkoll",
      industry: "Flyttstädning",
      media: {
        hero: {
          src: "/projects/stadkoll/hero-viewport.webp",
          alt: "Städkoll startsida — hero med flyttstädning till fast pris",
        },
        feature: {
          src: ph.wide,
          alt: "Platshållare — Städkoll offert och tjänster",
        },
        mobile: [
          {
            src: ph.phone,
            alt: "Platshållare — Städkoll mobil startsida",
          },
          {
            src: ph.phone,
            alt: "Platshållare — Städkoll mobil offert",
          },
          {
            src: ph.phone,
            alt: "Platshållare — Städkoll mobil kontakt",
          },
        ],
        fullPage: {
          src: "/projects/stadkoll/page-home.webp",
          alt: "Hela Städkoll-startsida från topp till botten",
        },
        fullPageCopy: {
          eyebrow: "Hela sidan",
          heading: "Scrolla igenom hela berättelsen.",
          support:
            "Dra eller scrolla inne i ramen för att se sidan från topp till botten.",
        },
        desktop: {
          src: ph.wide,
          alt: "Platshållare — Städkoll desktop",
        },
        desktopCopy: {
          eyebrow: "Offert",
          heading: "Fast pris — synligt från start.",
          support:
            "Offertfunktion, vad som ingår, garanti och RUT i en tydlig struktur.",
        },
      },
      seo: {
        title: "Städkoll — Frontend & UX/UI",
        description:
          "Case: Städkoll — hur en tydligare hemsida gjorde flyttstädning till fast pris enkelt att boka.",
      },
    },
  },
  {
    slug: "brandsakerhetskoll",
    name: "Brand & Säkerhetskoll",
    tagline: "Din lokala expert på brandskydd i Gävle.",
    description:
      "Webbplats för Brand & Säkerhetskoll: brandsläckare, brandvarnare och brandfiltar — med tydliga produkter och offert direkt på sidan.",
    siteUrl: "https://brandsakerhetskoll.se",
    githubUrl: "",
    tags: ["Frontend", "UX/UI", "Leadgen"],
    year: 2025,
    stack: ["Frontend", "UX & UI-design"],
    image: "/projects/brand-sakerhetskoll/hero-viewport.webp",
    imageAlt: "Brand & Säkerhetskoll startsida — hero med brandsläckare och trygghet i hemmet",
    theme: {
      bg: "var(--project-theme-ember)",
      dark: false,
    },
    detail: {
      overview: [
        "Trygghet börjar i hemmet. Men utan rätt brandskydd är den skör.",
        "Brand & Säkerhetskoll erbjuder brandsläckare, brandvarnare och brandfiltar — CE-märkta, certifierade och framtagna för att rädda liv. Men deras hemsida berättade inte det på rätt sätt.",
      ],
      challenge: [
        "Produkter låg gömda. Budskapet var splittrat. Kunderna fick inte förtroendet som krävs när man pratar säkerhet.",
      ],
      solution: [
        "Vi byggde en ny hemsida: tydliga produktbeskrivningar med fokus på användning och trygghet. Offertförfrågan direkt på sidan för enkel konvertering. Säkerhetsinformation som stärker deras expertroll.",
      ],
      results: [
        "En sida som inte bara säljer produkter — utan också förmedlar förtroende, trygghet och kunskap.",
      ],
      role: "Frontend, UX & UI-design",
      client: "Brand & Säkerhetskoll",
      industry: "Brandskydd",
      media: {
        hero: {
          src: "/projects/brand-sakerhetskoll/hero-viewport.webp",
          alt: "Brand & Säkerhetskoll startsida — hero med brandsläckare och trygghet i hemmet",
        },
        feature: {
          src: ph.wide,
          alt: "Platshållare — Brand & Säkerhetskoll produkter",
        },
        mobile: [
          {
            src: ph.phone,
            alt: "Platshållare — Brand & Säkerhetskoll mobil startsida",
          },
          {
            src: ph.phone,
            alt: "Platshållare — Brand & Säkerhetskoll mobil produkter",
          },
          {
            src: ph.phone,
            alt: "Platshållare — Brand & Säkerhetskoll mobil offert",
          },
        ],
        fullPage: {
          src: "/projects/brand-sakerhetskoll/page-home.webp",
          alt: "Hela Brand & Säkerhetskoll-startsida från topp till botten",
        },
        fullPageCopy: {
          eyebrow: "Hela sidan",
          heading: "Scrolla igenom hela berättelsen.",
          support:
            "Dra eller scrolla inne i ramen för att se sidan från topp till botten.",
        },
        desktop: {
          src: ph.wide,
          alt: "Platshållare — Brand & Säkerhetskoll desktop",
        },
        desktopCopy: {
          eyebrow: "Produkter",
          heading: "Trygghet synlig — inte gömd.",
          support:
            "Produktbeskrivningar, säkerhetsinfo och offert på samma tydliga sida.",
        },
      },
      seo: {
        title: "Brand & Säkerhetskoll — Frontend & UX/UI",
        description:
          "Case: Brand & Säkerhetskoll — hur en tydligare hemsida byggde förtroende kring brandskydd i Gävle.",
      },
    },
  },
  {
    slug: "scooterkoll",
    name: "Scooterkoll",
    tagline: "Elscootrar är smidiga. Tills de går sönder.",
    description:
      "Webbplats för Scooterkoll i Gävle: reparation av alla märken — med tydlig bokning, FAQ och offert nära till hands.",
    siteUrl: "https://scooterkoll.se",
    githubUrl: "",
    tags: ["Frontend", "UX/UI", "SEO"],
    year: 2025,
    stack: ["SEO", "Frontend", "UX & UI-design"],
    image: "/projects/scooterkoll/hero-viewport.webp",
    imageAlt: "Scooterkoll startsida — hero med offertformulär och 365+ reparerade scootrar",
    theme: {
      bg: "var(--project-theme-lime)",
      dark: false,
    },
    detail: {
      overview: [
        "Elscootrar är smidiga. Tills de går sönder.",
        "Scooterkoll i Gävle reparerar alla märken — snabbt och lokalt. Men deras gamla hemsida visade inte styrkan i erbjudandet. Kunderna fick inte svar på enkla frågor. Och det var otydligt hur man faktiskt bokar.",
      ],
      challenge: [
        "Erbjudandet syntes inte. Vanliga frågor saknade svar. Och bokningen var svår att hitta — vilket kostade både kunder och tid i support.",
      ],
      solution: [
        "Vi byggde en ny hemsida som löste fyra saker: tydlig struktur med klara steg för hur man bokar, vanliga frågor och svar som sparar tid för både kund och support, en offert-knapp nära till hands som driver fler förfrågningar, och formulär i livechatt-format som gör kontakt snabbt och enkelt direkt på sidan.",
      ],
      results: [
        "Fler förfrågningar från lokala kunder. Mindre supportärenden kring enkla frågor. Och en hemsida som speglar deras service — snabb, trygg och professionell.",
      ],
      role: "SEO, Frontend, UX & UI-design",
      client: "Scooterkoll",
      industry: "Elscooter-reparation",
      media: {
        hero: {
          src: "/projects/scooterkoll/hero-viewport.webp",
          alt: "Scooterkoll startsida — hero med offertformulär och 365+ reparerade scootrar",
        },
        feature: {
          src: ph.wide,
          alt: "Platshållare — Scooterkoll bokning och FAQ",
        },
        mobile: [
          {
            src: ph.phone,
            alt: "Platshållare — Scooterkoll mobil startsida",
          },
          {
            src: ph.phone,
            alt: "Platshållare — Scooterkoll mobil FAQ",
          },
          {
            src: ph.phone,
            alt: "Platshållare — Scooterkoll mobil offert",
          },
        ],
        fullPage: {
          src: "/projects/scooterkoll/page-home.webp",
          alt: "Hela Scooterkoll-startsida från topp till botten",
        },
        fullPageCopy: {
          eyebrow: "Hela sidan",
          heading: "Scrolla igenom hela berättelsen.",
          support:
            "Dra eller scrolla inne i ramen för att se sidan från topp till botten.",
        },
        desktop: {
          src: ph.wide,
          alt: "Platshållare — Scooterkoll desktop",
        },
        desktopCopy: {
          eyebrow: "Bokning",
          heading: "Klara steg — från fråga till offert.",
          support:
            "Struktur, FAQ och chattliknande formulär som gör det lätt att ta nästa steg.",
        },
      },
      seo: {
        title: "Scooterkoll — SEO, Frontend & UX/UI",
        description:
          "Case: Scooterkoll — hur en tydligare hemsida gjorde elscooter-reparation i Gävle enkelt att boka.",
      },
    },
  },
  {
    slug: "halimapearl",
    name: "HalimaPearl",
    tagline: "Från lokalt rykte till en växande varumärkesresa.",
    description:
      "GoHighLevel-sajt för HalimaPearl: en plattform som visar kollektionerna, stärker varumärket och öppnar nya marknader.",
    siteUrl: "https://halimapearl.com",
    githubUrl: "",
    tags: ["GoHighLevel", "UX/UI", "Varumärke"],
    year: 2025,
    stack: ["GoHighLevel", "UX & UI-design"],
    image: "/projects/halimapearl/hero-viewport.webp",
    imageAlt: "HalimaPearl startsida — hero med Modesty Is Fashion mot sidentyg",
    theme: {
      bg: "var(--project-theme-peach)",
      dark: false,
    },
    detail: {
      overview: [
        "När vi först mötte HalimaPearl drevs verksamheten nästan helt av word of mouth. Kvinnor i Gambia hörde talas om hennes kläder genom vänner och familj — och kollektionerna spreds snabbt från hand till hand.",
        "Men med ett växande intresse kom också behovet av något större. Hur skulle hon kunna nå fler kunder, bortom de som redan kände till henne?",
      ],
      challenge: [
        "Ryktet räckte inte längre. Utan en tydlig digital plats riskerade varumärket att stanna lokalt — trots att intresset växte och kollektionerna redan vandrade från hand till hand.",
      ],
      solution: [
        "Vi hjälpte HalimaPearl att ta nästa steg. Genom GoHighLevel byggde vi en professionell digital närvaro där hennes varumärke kunde växa på riktigt — en plattform som visar kollektionerna, stärker varumärkets identitet och öppnar dörrar för nya marknader.",
      ],
      results: [
        "Idag säljer hon inte bara i Gambia, utan även till närliggande länder på den afrikanska kontinenten. Hennes resa är ett exempel på hur ett starkt varumärke och rätt digitalt stöd kan ta ett lokalt initiativ — och förvandla det till något mycket större.",
      ],
      role: "GoHighLevel, UX & UI-design",
      client: "HalimaPearl",
      industry: "Mode & varumärke",
      media: {
        hero: {
          src: "/projects/halimapearl/hero-viewport.webp",
          alt: "HalimaPearl startsida — hero med Modesty Is Fashion mot sidentyg",
        },
        feature: {
          src: ph.wide,
          alt: "Platshållare — HalimaPearl kollektioner",
        },
        mobile: [
          {
            src: ph.phone,
            alt: "Platshållare — HalimaPearl mobil startsida",
          },
          {
            src: ph.phone,
            alt: "Platshållare — HalimaPearl mobil kollektion",
          },
          {
            src: ph.phone,
            alt: "Platshållare — HalimaPearl mobil varumärke",
          },
        ],
        fullPage: {
          src: "/projects/halimapearl/page-collection.webp",
          alt: "HalimaPearl kimono-kollektion — produktlista från topp till botten",
        },
        fullPageCopy: {
          eyebrow: "Kollektion",
          heading: "Bläddra i kollektionen, precis som en kund gör.",
          support:
            "Sök, filtrera och sortera bland kimonos — dra eller scrolla inne i ramen.",
        },
        desktop: {
          src: ph.wide,
          alt: "Platshållare — HalimaPearl desktop",
        },
        desktopCopy: {
          eyebrow: "Varumärke",
          heading: "Kollektionerna synliga — på riktigt.",
          support:
            "En plattform som visar kläderna, stärker identiteten och öppnar för nya marknader.",
        },
      },
      seo: {
        title: "HalimaPearl — GoHighLevel",
        description:
          "Case: HalimaPearl — hur en GoHighLevel-sajt tog ett lokalt modevarumärke från Gambia till fler marknader.",
      },
    },
  },
  {
    slug: "ventilationskoll",
    name: "Ventilationskoll",
    tagline: "En hemsida som gör jobbet.",
    description:
      "Webbplats för Ventilationskoll: tydlig prisinformation och smidig onlinebokning — byggd för att dra in kunder.",
    siteUrl: "https://ventilationskoll.se",
    githubUrl: "",
    tags: ["Frontend", "UX/UI", "SEO"],
    year: 2025,
    stack: ["SEO", "Frontend", "UX & UI-design"],
    image: "/projects/ventilationskoll/hero-viewport.webp",
    imageAlt: "Ventilationskoll startsida — hero med pris från 2095 kr och kundomdömen",
    theme: {
      bg: "var(--project-theme-sky)",
      dark: false,
    },
    detail: {
      overview: [
        "Ventilationskoll kom till oss med ett tydligt mål: de behövde en hemsida som inte bara såg bra ut, utan som faktiskt hjälpte dem att få in kunder. Besökarna skulle enkelt kunna hitta prisinformation och smidigt boka direkt online.",
      ],
      challenge: [
        "Snyggt räcker inte. Utan tydliga priser och enkel bokning blir hemsidan en visitkort — istället för en kanal som faktiskt tar emot kunder.",
      ],
      solution: [
        "Vi tog fram en lösning som förenklar både för företaget och deras kunder. En användarvänlig design, tydlig struktur och funktioner som gör att informationen alltid finns nära till hands.",
      ],
      results: [
        "En hemsida som idag inte bara speglar Ventilationskolls tjänster, utan också driver tillväxt. På kort tid har sidan genererat över 14 000 visningar — och fungerar nu som en självklar kanal för nya kunder.",
      ],
      role: "SEO, Frontend, UX & UI-design",
      client: "Ventilationskoll",
      industry: "Ventilation",
      media: {
        hero: {
          src: "/projects/ventilationskoll/hero-viewport.webp",
          alt: "Ventilationskoll startsida — hero med pris från 2095 kr och kundomdömen",
        },
        feature: {
          src: ph.wide,
          alt: "Platshållare — Ventilationskoll priser och bokning",
        },
        mobile: [
          {
            src: ph.phone,
            alt: "Platshållare — Ventilationskoll mobil startsida",
          },
          {
            src: ph.phone,
            alt: "Platshållare — Ventilationskoll mobil priser",
          },
          {
            src: ph.phone,
            alt: "Platshållare — Ventilationskoll mobil bokning",
          },
        ],
        fullPage: {
          src: "/projects/ventilationskoll/page-home.webp",
          alt: "Hela Ventilationskoll-startsida från topp till botten",
        },
        fullPageCopy: {
          eyebrow: "Hela sidan",
          heading: "Scrolla igenom hela berättelsen.",
          support:
            "Dra eller scrolla inne i ramen för att se sidan från topp till botten.",
        },
        desktop: {
          src: ph.wide,
          alt: "Platshållare — Ventilationskoll desktop",
        },
        desktopCopy: {
          eyebrow: "Bokning",
          heading: "Priser nära — bokning ännu närmare.",
          support:
            "Tydlig struktur så besökaren hittar information och tar nästa steg utan friktion.",
        },
      },
      seo: {
        title: "Ventilationskoll — SEO, Frontend & UX/UI",
        description:
          "Case: Ventilationskoll — hur en hemsida med tydliga priser och onlinebokning drev över 14 000 visningar.",
      },
    },
  },
  {
    slug: "premium-honey-blends",
    name: "Premium Honey Blends",
    tagline: "Från meddelanden och kontakter till en butik som aldrig sover.",
    description:
      "Shopify-butik för Premium Honey Blends: live lagerstatus och beställningar dygnet runt — utan att något försvinner i chatten.",
    siteUrl: "https://premiumhoneyblends.com",
    githubUrl: "",
    tags: ["Shopify", "E-handel", "Varumärke"],
    year: 2026,
    stack: ["Shopify"],
    image: "/projects/premium-honey-blends/hero-viewport.png",
    imageAlt:
      "Premium Honey Blends startsida — mörk hero med honungsburkar och Handla nu-knapp",
    theme: {
      bg: "var(--project-theme-honey)",
      dark: false,
    },
    detail: {
      overview: [
        "Kunden ville lansera sin första hemsida. Fram till dess drevs försäljningen via kontakter och sociala medier — ett upplägg som fungerade, tills det blev för stort att hålla i handen.",
        "Med tiden blev det jobbigt att hålla koll på alla meddelanden och kontakter, samt att hålla koll på antal produkter i lager.",
      ],
      challenge: [
        "Beställningar försvann bland meddelanden. Lagerstatus fanns i huvudet — inte i systemet. När intresset växte behövdes något mer hållbart än chatt och manuella listor.",
      ],
      solution: [
        "Vi byggde en vacker Shopify-butik där alla kan gå in och lägga sin beställning. Lagerstatus uppdateras live, och kunden säljer endast det som finns tillgängligt — utan att behöva jaga svar i inkorgen.",
      ],
      results: [
        "Nu kan kunder lägga beställningar dag och natt utan att en enda order försvinner bland alla meddelanden. Butiken håller koll på lagret — så att verksamheten kan växa utan kaos.",
      ],
      role: "Shopify-butik, UX & UI-design",
      client: "Premium Honey Blends",
      industry: "E-handel / Livsmedel",
      media: {
        hero: {
          src: "/projects/premium-honey-blends/hero-viewport.png",
          alt: "Premium Honey Blends startsida i desktop — hero med honungsburkar mot blomsteräng",
        },
        feature: {
          src: "/projects/premium-honey-blends/feature-product.png",
          alt: "Produktsektion med Power Honey Blend-burk i naturmiljö och text om naturlig honung och örter",
        },
        mobile: [
          {
            src: "/projects/premium-honey-blends/mobile-1.png",
            alt: "Mobil startsida — hero med honungsburkar och bästsäljare under",
          },
          {
            src: "/projects/premium-honey-blends/mobile-2.png",
            alt: "Mobil produktsida — alla honungsblends listade med pris",
          },
          {
            src: "/projects/premium-honey-blends/mobile-3.png",
            alt: "Mobil kontaktsida — Vi svarar på allt, med kontaktformulär",
          },
        ],
        fullPage: {
          src: "/projects/premium-honey-blends/page-full.png",
          alt: "Premium Honey Blends-sidan från topp till botten",
        },
        fullPageCopy: {
          eyebrow: "Hela sidan",
          heading: "Scrolla igenom hela berättelsen.",
          support:
            "Dra eller scrolla inne i ramen för att se sidan från topp till botten.",
        },
        desktop: {
          src: "/projects/premium-honey-blends/products-viewport.png",
          alt: "Produktsidan i desktop — tre honungsblends med produktkort under",
        },
        desktopCopy: {
          eyebrow: "Butik",
          heading: "Live lager — beställningar dygnet runt.",
          support:
            "Shopify som håller koll på lagret och tar emot ordrar utan att något drunknar i chatten.",
        },
      },
      seo: {
        title: "Premium Honey Blends — Shopify",
        description:
          "Case: Premium Honey Blends — hur en Shopify-butik ersatte chattförsäljning med live lager och ordrar dygnet runt.",
      },
    },
  },
  {
    slug: "alkama",
    name: "ALKAMA",
    tagline:
      "WooCommerce-butik på svenska, finska och norska — utan att tappa 20 års förtroende.",
    description:
      "Flerspråkig WooCommerce-butik för Alkama Industry: fakturabetalning, självbetjäning och lokal SEO i Norden.",
    siteUrl: "",
    githubUrl: "",
    tags: ["WooCommerce", "Polylang", "B2B"],
    year: 2026,
    stack: ["WooCommerce", "Polylang", "PHP"],
    image: "/projects/alkama/hero-viewport.png",
    imageAlt: "ALKAMA startsida — hero med bästsäljare i webbutiken",
    theme: {
      bg: "var(--project-theme-steel)",
      dark: false,
    },
    detail: {
      overview: [
        "Alkama Industry har sedan 2004 byggt verksamheten på högt förtroende och personliga relationer. Men den manuella, telefonbaserade modellen skapade flaskhalsar när ägandet bytte generation.",
        "Intäkterna begränsades av hur mycket tid ägaren kunde lägga på telefonbeställningar. Höga administrativa kostnader och språkbarriärer bromsade tillväxten i Norge och Finland. Kunskapen låg i manuella register — svårt för nya ägare att ge samma personliga känsla, och svårt att möta kunder som förväntar sig att handla digitalt.",
      ],
      challenge: [
        "Telefonen räckte inte längre. Utan digital struktur blev tillväxt i Norden dyr, långsam och beroende av en persons tid — samtidigt som relationerna som byggt varumärket riskerade att gå förlorade.",
      ],
      solution: [
        "Målet var att översätta 20 års rykte till en friktionsfri digital upplevelse. Continuity-first UX: en ren, industriell layout som inköpare känner igen — inklusive fakturabetalning digitaliserad så att bokföringen automatiseras utan att tappa den förtroendebaserade känslan. Strategisk lokalisering med Polylang och anpassad PHP: tekniska dokument, fakturor och SEO riktade mot varje marknad, inklusive nynorska för den norska industrisektorn. Admin-automation: självbetjäningsportal för ombeställning på två klick och SEO-optimerade landningssidor som gör sajten till en leadgenerator dygnet runt.",
      ],
      results: [
        "En WooCommerce-butik på svenska, finska och norska som behåller Alkamas förtroende — samtidigt som beställningar, språk och administration skalas utan att allt går via telefonen.",
      ],
      role: "WooCommerce, lokalisering & UX/UI",
      client: "Alkama Industry",
      industry: "B2B / Industri",
      media: {
        hero: {
          src: "/projects/alkama/hero-viewport.png",
          alt: "ALKAMA startsida — hero med bästsäljare i webbutiken",
        },
        mobile: [],
        desktop: {
          src: "/projects/alkama/hero-viewport.png",
          alt: "ALKAMA startsida i desktop — bästsäljare och företagskonto-CTA",
        },
        desktopCopy: {
          eyebrow: "B2B-butik",
          heading: "Tre språk — samma förtroende.",
          support:
            "WooCommerce med Polylang, fakturaflöde och självbetjäning för ombeställning.",
        },
      },
      seo: {
        title: "ALKAMA — WooCommerce & Polylang",
        description:
          "Case: ALKAMA — flerspråkig WooCommerce-butik som digitaliserade 20 års B2B-förtroende för Norden.",
      },
    },
  },
  {
    slug: "uniclean",
    name: "UniClean",
    tagline: "Från samma frågor om och om igen — till en sajt som onboardingar själv.",
    description:
      "WordPress-sajt för UniClean: tjänster, ungefärliga priser och förväntningar synliga från start — så teamet kan fokusera på jobbet.",
    siteUrl: "",
    githubUrl: "",
    tags: ["WordPress", "Elementor", "Lokalt"],
    year: 2026,
    stack: ["WordPress", "Elementor"],
    image: "/projects/uniclean/hero-viewport.png",
    imageAlt: "UniClean startsida — hero med prisoffertformulär",
    theme: {
      bg: "var(--project-theme-mint)",
      dark: false,
    },
    detail: {
      overview: [
        "Lucas hade drivit en framgångsrik lokal verksamhet med starkt rykte i flera år. Men när kundbasen växte blev bristen på en strukturerad onboarding en flaskhals.",
        "Teamet lade för mycket tid på att svara på samma frågor manuellt — i stället för att fokusera på själva arbetet.",
      ],
      challenge: [
        "Ryktet drog in kunder, men varje ny förfrågan krävde samma manuella förklaringar. Utan en tydlig digital startpunkt blev onboarding långsam och dyr i tid.",
      ],
      solution: [
        "Jag byggde en hemsida som fungerar som en informationshub dygnet runt. Genom att tydligt visa tjänster, ungefärliga priser och vad kunden kan förvänta sig filtrerar och utbildar sajten blivande kunder automatiskt.",
        "Riktiga Google-recensioner hämtas in live på sajten, så nya besökare ser betyg och omdömen direkt — utan att teamet behöver uppdatera något för hand.",
      ],
      results: [
        "Onboardingprocessen blev smidigare, företaget sparar administrativ tid — och kundupplevelsen blir klarare redan innan första samtalet.",
      ],
      role: "Design & WordPress-bygge (Elementor)",
      client: "UniClean",
      industry: "Lokal service",
      media: {
        hero: {
          src: "/projects/uniclean/hero-viewport.png",
          alt: "UniClean startsida — hero med prisoffertformulär",
        },
        feature: {
          src: "/projects/uniclean/booking-viewport.png",
          alt: "Så bokar du hos UniClean — fyra steg från klick till städning",
        },
        mobile: [
          {
            src: "/projects/uniclean/mobile-1.png",
            alt: "UniClean mobil startsida — hero med offertformulär och Google-betyg",
          },
          {
            src: "/projects/uniclean/mobile-2.png",
            alt: "UniClean mobil — utmärkelse och bild på städare i skolsal",
          },
          {
            src: "/projects/uniclean/mobile-3.png",
            alt: "UniClean mobil — mission och vision med fönsterputsning i bild",
          },
        ],
        fullPage: {
          src: "/projects/uniclean/page-full.png",
          alt: "Hela UniClean-startsidan från topp till botten",
        },
        fullPageCopy: {
          eyebrow: "Hela sidan",
          heading: "Scrolla igenom hela berättelsen.",
          support:
            "Dra eller scrolla inne i ramen för att se sidan från topp till botten.",
        },
        desktop: {
          src: "/projects/uniclean/reviews-viewport.png",
          alt: "UniClean recensionssektion — 4.9 i betyg från 58 Google-recensioner, hämtat live",
        },
        desktopCopy: {
          eyebrow: "Förtroende",
          heading: "Riktiga omdömen, hämtade live från Google.",
          support:
            "58 recensioner och 4.9 i snittbetyg syns direkt på sajten — utan att någon behöver uppdatera det för hand.",
        },
      },
      seo: {
        title: "UniClean — WordPress & Elementor",
        description:
          "Case: UniClean — hur en WordPress-sajt blev en 24/7-informationshub och sparade tid i onboarding.",
      },
    },
  },
  {
    slug: "shanasheel",
    name: "Shanasheel",
    tagline:
      "Från första skissen till en tvåspråkig sajt som berättar om Akkad — och om framtiden i Irak.",
    description:
      "Webbplats för Shanasheel Al-Asima: fastighet, hållbarhet och investeringar, byggd i WordPress med Elementor.",
    siteUrl: "https://shanasheel.se",
    githubUrl: "",
    tags: ["WordPress", "Elementor", "Fastighet"],
    year: 2025,
    stack: ["WordPress", "Elementor", "TranslatePress"],
    image: "/projects/shanasheel/hero-viewport.png",
    imageAlt: "Shanasheel startsida med Akkad Residential City i hero",
    theme: {
      bg: "var(--project-theme-forest)",
      dark: false,
    },
    detail: {
      overview: [
        "Shanasheel Al-Asima behövde mer än en vanlig företagswebb. De behövde en plats där investerare, familjer och partners kunde känna tyngden i Akkad Residential City — och samtidigt förstå hela bolaget: avfall, solenergi och jordbruk.",
        "Jag formgav och byggde sajten i WordPress med Elementor, med tydliga sektioner, starka bilder och en berättelse som leder besökaren från första intrycket till nästa steg.",
      ],
      challenge: [
        "Budskapet var stort: lyxboende, hållbarhet och engagemang i Irak — på två språk. Utan en klar berättelse riskerade sajten att bli en lista med tjänster i stället för en resa man vill följa.",
      ],
      solution: [
        "Jag byggde en lång, lugn startsida kring Akkad: hero, investeringsresa, nyheter, hustyper och storytelling-block. Tjänstesidan fick samma ton — fyra affärsområden i bild och text. Allt i Elementor, med arabiska och engelska via TranslatePress.",
      ],
      results: [
        "En live-sajt på shanasheel.se som Digital Koll står bakom — där Shanasheel kan visa projekt, ta emot intresse och berätta sin historia på två språk.",
      ],
      role: "Design & WordPress-bygge (Elementor)",
      client: "Shanasheel Al-Asima",
      industry: "Fastighet & hållbarhet",
      media: {
        hero: {
          src: "/projects/shanasheel/hero-viewport.png",
          alt: "Shanasheel-hero med Akkad Residential City",
        },
        feature: {
          src: "/projects/shanasheel/realestate-viewport.png",
          alt: "Shanasheel fastighetssida — Type A, B och C med planlösningar för Akkad",
        },
        mobile: [
          {
            src: "/projects/shanasheel/mobile-1.png",
            alt: "Shanasheel startsida i mobil — Akkad-hero",
          },
          {
            src: "/projects/shanasheel/mobile-2.png",
            alt: "Shanasheel mobil — Type A med planlösning och 300 kvm",
          },
          {
            src: "/projects/shanasheel/mobile-3.png",
            alt: "Shanasheel mobil — Om Shanasheel Al-Asima och företagets historia",
          },
        ],
        fullPage: {
          src: "/projects/shanasheel/page-home.png",
          alt: "Hela Shanasheel-startsida från topp till botten",
        },
        fullPageCopy: {
          eyebrow: "Hela sidan",
          heading: "Scrolla igenom hela berättelsen.",
          support:
            "Startsida från hero till footer — dra eller scrolla inne i ramen.",
        },
        desktop: {
          src: "/projects/shanasheel/journey-viewport.png",
          alt: "Shanasheel — fastighet, solenergi, jordbruk och återvinning i fyra ikoner",
        },
        desktopCopy: {
          eyebrow: "Verksamheten",
          heading: "Fyra spår, en gemensam ton.",
          support:
            "Fastighet, solenergi, jordbruk och återvinning — samma visuella språk genom hela sajten.",
        },
      },
      seo: {
        title: "Shanasheel — WordPress & Elementor",
        description:
          "Case: Shanasheel Al-Asima — hur jag designade och byggde en tvåspråkig WordPress-sajt kring Akkad Residential City.",
      },
    },
  },
  {
    slug: "fcvaxjo",
    name: "FC Växjö",
    tagline: "En digital hemmaplan för föreningen sedan 1989.",
    description:
      "Webbplats för FC Växjö: nyheter, träningstider, galleri och kontakt — med klubbens svart-guld-identitet i centrum.",
    siteUrl: "https://fcvaxjo.se",
    githubUrl: "",
    tags: ["Webbdesign", "UX/UI", "Förening"],
    year: 2023,
    stack: ["One.com", "UX & UI-design"],
    image: "/projects/fcvaxjo/hero-viewport.png",
    imageAlt: "FC Växjö startsida — hero med klubbmärke och plan",
    theme: {
      bg: "var(--project-theme-dark)",
      dark: true,
    },
    detail: {
      overview: [
        "FC Växjö har sedan 1989 samlat ungdomar kring fotboll, gemenskap och integration i Växjö. Föreningen behövde en hemsida som kändes som klubben — inte som en generisk mall.",
        "Sajten skulle bära klubbmärket, visa nyheter och träningstider, samla bilder från verksamheten och göra det enkelt för föräldrar, partners och sponsorer att ta kontakt.",
      ],
      challenge: [
        "Utan en tydlig digital plats riskerade klubbens historia, schema och gemenskap att stanna i Facebook-inlägg och mun-till-mun — svårt för nya familjer och samarbetspartners att hitta rätt.",
      ],
      solution: [
        "Jag formgav och byggde en webbplats med klubbens svarta och guldiga uttryck: stark hero med emblem, nyheter och träningstider på startsidan, om-sida med historia och utmärkelser, galleri, samt kontakt och sponsorformulär.",
      ],
      results: [
        "En live-sajt på fcvaxjo.se där medlemmar, föräldrar och partners hittar nyheter, tider, bilder och kontakt — med en identitet som matchar föreningen på planen.",
      ],
      role: "Design & webbutveckling",
      client: "FC Växjö",
      industry: "Fotbollsförening",
      media: {
        hero: {
          src: "/projects/fcvaxjo/hero-viewport.png",
          alt: "FC Växjö startsida — hero med klubbmärke mot gräsplan",
        },
        feature: {
          src: "/projects/fcvaxjo/gallery-viewport.png",
          alt: "FC Växjö galleri — foton från lag, matcher och aktiviteter",
        },
        mobile: [
          {
            src: "/projects/fcvaxjo/mobile-1.png",
            alt: "FC Växjö mobil startsida — hero med klubbmärke",
          },
          {
            src: "/projects/fcvaxjo/mobile-2.png",
            alt: "FC Växjö mobil — Om FC Växjö med klubbens historia",
          },
          {
            src: "/projects/fcvaxjo/mobile-3.png",
            alt: "FC Växjö mobil — kontaktuppgifter och klubbledare",
          },
        ],
        desktop: {
          src: "/projects/fcvaxjo/about-viewport.png",
          alt: "Om FC Växjö — klubbmärke, historia och utmärkelser",
        },
        desktopCopy: {
          eyebrow: "Identitet",
          heading: "Historia och utmärkelser — synliga på riktigt.",
          support:
            "Från PARS och ARYO till FC Växjö 2008 — plus stipendier och integrationspris i en tydlig berättelse.",
        },
      },
      seo: {
        title: "FC Växjö — Webbdesign",
        description:
          "Case: FC Växjö — hur en klubbsajt med svart-guld-identitet blev digital hemmaplan för nyheter, träning och gemenskap.",
      },
    },
  },
];
