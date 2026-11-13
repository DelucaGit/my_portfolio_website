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
  /** Phone screenshots, shown in the shared mobile mockup strip */
  mobile: ProjectImage[];
  fullPage?: ProjectImage;
  fullPageCopy?: MediaSectionCopy;
  desktop?: ProjectImage;
  desktopCopy?: MediaSectionCopy;
  /** Extra screenshots stacked under a short heading */
  gallery?: ProjectImage[];
  galleryCopy?: MediaSectionCopy;
  /** Optional detail shown after the gallery (e.g. a small feature like branded email) */
  closing?: ProjectImage;
  closingCopy?: MediaSectionCopy;
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

export const projects: Project[] = [
  {
    slug: "sabaah-al-wuruud",
    name: "Sabaah Al-Wuruud",
    tagline:
      "En minimalistisk adhkar-app för Android som jag byggde till min fru. Utan reklam, utan konto och helt offline.",
    description:
      "Min frus favoritapp för adhkar hade fyllts med reklam. Jag byggde en egen till henne i hennes favoritfärger, med bara det hon använder, och levererade den som en signerad APK.",
    siteUrl: "",
    githubUrl: "https://github.com/DelucaGit/sabaah-al-wuruud",
    tags: ["Android", "Capacitor", "Personligt projekt"],
    year: 2026,
    stack: [
      "JavaScript",
      "Vite",
      "Capacitor",
      "Android Studio",
      "Vitest",
      "Claude Code",
    ],
    image: "/projects/sabaah-al-wuruud/hero.png",
    imageAlt:
      "Tre telefoner med adhkar-appen Sabaah Al-Wuruud i lavendel, i ljust och mörkt läge",
    theme: {
      bg: "var(--project-theme-lilac)",
      dark: false,
    },
    detail: {
      overview: [
        "Min fru och jag har varit gifta i fem år. Sabaah Al-Wuruud är en Android-app jag byggde till henne. Namnet är arabiska och betyder ”rosornas morgon” (Morning of Roses). I appen finns morgon- och kvällsadhkar, bönetider och hennes Koran-memorering på ett ställe. Adhkar är korta böner och åminnelser som vi muslimer läser varje morgon och kväll. Med dem ber vi vår Skapare att skydda oss under dagen och natten.",
        "Appen är gjord för en enda användare. Den har hennes favoritfärger, bara de delar hon faktiskt använder och ingenting annat.",
      ],
      challenge: [
        "Hennes favoritapp för adhkar, Daily Supplications, hade med tiden fyllts med reklam och en massa funktioner hon aldrig använder. Det som skulle vara en lugn stund på morgonen började med att klicka bort annonser.",
        "Hon behövde inte fler funktioner. Hon behövde färre: sina adhkar, dagens bönetider och ett enkelt sätt att följa sin memorering.",
        "Appen skulle fungera utan internet och utan konto, och jag ville kunna ge den till henne direkt utan att gå via Google Play.",
      ],
      solution: [
        "Fyra flikar och inget mer: Today, Adhkar, Qur'an och Me. Dagen visas som en tidslinje där morgon-, kvälls- och sovadhkar ligger mellan bönetiderna.",
        "Lavendel som grundfärg, ljust och mörkt läge och justerbar arabisk textstorlek. Hälsningen på startsidan är personlig.",
        "När hon markerar en sida som memorerad visar startsidan en vers från sidorna hon kan, tillsammans med Tafsir al-Muyassar.",
        "Allt ligger i appen: hela Koranen (604 sidor, 6 236 verser), tafsir, typsnitt och bönetider som räknas ut lokalt med biblioteket adhan. Appen gör inga nätverksanrop och samlar ingen data.",
        "Byggd med vanlig JavaScript i ES-moduler och Vite, utan ramverk. Capacitor packar webbappen som en riktig Android-app med lokala notiser och haptik.",
        "Arbetet planerades i GitHub Issues innan något byggdes: mål, epics, user stories och tasks. Varje issue blev en liten pull request, runt 60 stycken, skrivna tillsammans med Claude Code.",
        "Android-projektet byggs med Gradle och Android Studios SDK. Först en debug-APK för att testa på hennes telefon, sedan en release-APK signerad med en egen nyckel som bara finns lokalt och aldrig i repot.",
      ],
      results: [
        "Version 1.0 är byggd, signerad och verifierad med apksigner. APK-filen är 6,4 MB och innehåller allt, inklusive hela Koranen.",
        "Hon fick appen som en fil i WhatsApp tillsammans med en kort installationsguide i PDF. Ingen butik, inget konto och ingen reklam.",
        "Logiken för bönetider, påminnelser, memorering och sparad data täcks av 236 automatiska tester.",
        "Nästa steg är redan inskrivna som issues: en rättning av ett arabiskt tecken i version 1.0.1 och en mushaf-läsare sida för sida i en senare version.",
      ],
      industry: "Personlig Android-app",
      media: {
        hero: {
          src: "/projects/sabaah-al-wuruud/hero.png",
          alt: "Dagens adhkar, nästa bön och dagens reflektion, i ljust och mörkt läge",
        },
        mobile: [
          {
            src: "/projects/sabaah-al-wuruud/today.png",
            alt: "Today: nästa bön, dagens bönetider och dagens reflektion med vers och tafsir",
          },
          {
            src: "/projects/sabaah-al-wuruud/adhkar.png",
            alt: "Adhkar: dagen som tidslinje med morgon-, kvälls- och sovadhkar mellan bönerna",
          },
          {
            src: "/projects/sabaah-al-wuruud/morning.png",
            alt: "Läsaren för morgonadhkar, en dhikr i taget med räknare",
          },
          {
            src: "/projects/sabaah-al-wuruud/quran.png",
            alt: "Qur'an: memorering sida för sida, här med första sidan markerad",
          },
          {
            src: "/projects/sabaah-al-wuruud/istikhara.png",
            alt: "Istikhara-bönen med markerade ord där man nämner sitt ärende",
          },
          {
            src: "/projects/sabaah-al-wuruud/settings.png",
            alt: "Me: namn, färg, utseende, arabisk textstorlek och påminnelser",
          },
          {
            src: "/projects/sabaah-al-wuruud/today-dark.png",
            alt: "Today i mörkt läge",
          },
        ],
        closing: {
          src: "/projects/sabaah-al-wuruud/review.jpg",
          alt: "Chatt där min fru svarar på skärmbilderna av appen: Du skojar, jag älskar den",
        },
        closingCopy: {
          eyebrow: "Recension",
          heading: "Den enda recensionen som räknas.",
          support:
            "Appen har en enda användare. Så här svarade hon när jag skickade de första skärmbilderna. Något bättre betyg kan den inte få.",
        },
      },
      seo: {
        title: "Sabaah Al-Wuruud. Adhkar-app för Android",
        description:
          "Case: en minimalistisk adhkar-app för Android byggd till min fru. JavaScript, Vite och Capacitor, helt offline och levererad som signerad APK.",
      },
    },
  },
  {
    slug: "zenith-kampsport",
    name: "Zenith Kampsport",
    tagline:
      "Underhåll och förbättring av en Next.js-klubbhemsida. Schema och layout för mindre laptopskärmar.",
    description:
      "Jag tog över Zenith Kampsports hemsida när den tidigare utvecklaren inte kunde fortsätta. Jobbar med schema, layout och publicering via GitHub och Vercel.",
    siteUrl: "https://www.zenithkampsport.se",
    githubUrl: "https://github.com/esam95/usc-nextjs",
    tags: ["Next.js", "Underhåll", "Förening"],
    year: 2026,
    stack: ["Next.js", "TypeScript", "Tailwind", "Vercel"],
    image: "/projects/zenith-kampsport/hero-viewport.png",
    imageAlt: "Zenith Kampsport startsida med hero och knappar för medlemskap",
    theme: {
      bg: "var(--project-theme-dark)",
      dark: true,
    },
    detail: {
      overview: [
        "Zenith Kampsport är en kampsportsklubb i Järva. Hemsidan fanns redan i Next.js, med schema, medlemskap och kontakt.",
        "Jag är deras nya utvecklare. Jag underhåller koden, förbättrar det som behövs och publicerar via GitHub till Vercel.",
      ],
      challenge: [
        "Den tidigare utvecklaren kunde inte fortsätta. Klubben behövde någon som kan Next.js och kan ta hand om hemsidan över tid.",
        "Schemat är det medlemmarna använder mest. Det måste vara lätt att läsa, även på mindre laptopskärmar där layouten tidigare blev trång.",
      ],
      solution: [
        "Jag tog över repot och deployen (GitHub till Vercel) så ändringar går live utan manuell uppladdning.",
        "Jag har arbetat med schemasidan så träningstiderna är tydligare.",
        "Jag har anpassat layouten så hemsidan funkar bättre på mindre laptopskärmar, inte bara på stora skärmar och mobil.",
      ],
      results: [
        "Hemsidan ligger live på zenithkampsport.se.",
        "Klubben har en utvecklare som kan fortsätta förbättra sidan när behov uppstår.",
        "Schema och layout på mindre skärmar är mer användbara för medlemmar och nyfikna som vill provträna.",
      ],
      role: "Underhåll och vidareutveckling",
      client: "Zenith Kampsport",
      industry: "Kampsportsklubb",
      media: {
        hero: {
          src: "/projects/zenith-kampsport/hero-viewport.png",
          alt: "Startsida med hero, logotyp och knappar för medlemskap och klasser",
        },
        mobile: [],
        desktop: {
          src: "/projects/zenith-kampsport/schema-viewport.png",
          alt: "Veckoschema med färgade pass för boxning, BJJ och brottning",
        },
        desktopCopy: {
          eyebrow: "Schema",
          heading: "Träningstiderna syns direkt.",
          support:
            "Medlemmar och besökare ska snabbt se när passen går och var lokalen ligger.",
        },
        gallery: [
          {
            src: "/projects/zenith-kampsport/schema-laptop.png",
            alt: "Samma schema på en mindre laptopbredd, 1280 pixlar",
          },
          {
            src: "/projects/zenith-kampsport/om-oss-viewport.png",
            alt: "Om oss-sidan med hero och klubbens berättelse",
          },
        ],
        galleryCopy: {
          eyebrow: "Layout",
          heading: "Bättre på mindre laptopskärmar.",
          support:
            "Många surfar på 13–14 tum. Sidan ska kännas lugn där också, inte bara på stor skärm.",
        },
        closing: {
          src: "/projects/zenith-kampsport/medlemskap-viewport.png",
          alt: "Medlemskapssidan med priser och knappar för att bli medlem",
        },
        closingCopy: {
          eyebrow: "Medlemskap",
          heading: "Priser och nästa steg på samma ställe.",
          support:
            "Besökare som vill börja ska hitta medlemsnivåer utan att leta runt på hemsidan.",
        },
      },
      seo: {
        title: "Zenith Kampsport. Underhåll i Next.js",
        description:
          "Case: Zenith Kampsport. Underhåll av en Next.js-klubbhemsida med fokus på schema och layout, publicerad via GitHub och Vercel.",
      },
    },
  },
  {
    slug: "fcvaxjo-reborn",
    name: "FC Växjö Reborn",
    tagline:
      "Ny klubbhemsida i Next.js. Byggd för träningstider, nyheter och en kommande app.",
    description:
      "Ombyggd hemsida för FC Växjö med Next.js, GitHub och Hostinger CI. Förberedd för schemauppdateringar från mobil.",
    siteUrl: "https://fcvaxjo.se",
    githubUrl: "https://github.com/DelucaGit/FC-Vaxjo-Website",
    tags: ["Next.js", "Förening", "CI/CD"],
    year: 2026,
    stack: ["Next.js", "GitHub", "Hostinger"],
    image: "/projects/fcvaxjo-reborn/news-viewport.png",
    imageAlt:
      "FC Växjö Reborn: nyheter och träningstider i Next.js-layout",
    theme: {
      bg: "var(--project-theme-ember)",
      dark: false,
    },
    detail: {
      overview: [
        "Klubben behövde en hemsida som funkar 2026. Föräldrar ska hitta träningstider och nyheter utan att leta.",
        "Jag byggde den i Next.js, lade upp den via GitHub till Hostinger, och planerar en app som kan skicka schema senare.",
      ],
      challenge: [
        "Den gamla hemsidan räckte inte. Info om träning och medlemskap var svår att hitta.",
        "De ville också kunna uppdatera schema från mobilen längre fram. Då måste hemsidan kunna ta emot data, inte bara visa text.",
      ],
      solution: [
        "Jag byggde om hemsidan i Next.js: startsida, nyheter, träningstider, historia, sponsring och kontakt.",
        "Jag flyttade hemsidan och mejlen från One.com till Hostinger och behöll klubbens gamla mejlkonton.",
        "Sponsorformuläret skickar ett eget HTML-mejl med klubbens färger, inte ett tråkigt systemmejl.",
        "Koden ligger på GitHub och publiceras till Hostinger med CI.",
      ],
      results: [
        "Hemsidan ligger live på fcvaxjo.se.",
        "Flytten sparade klubben ungefär 2 500 kr per år.",
        "De får egna mejl från formuläret, i klubbens svart-guld-stil.",
        "Nästa steg är schema från app.",
      ],
      role: "Design & utveckling",
      client: "FC Växjö",
      industry: "Fotbollsförening",
      media: {
        hero: {
          src: "/projects/fcvaxjo-reborn/hero-viewport.png",
          alt: "Startsida med hero, statistik och knappar för träningstider",
        },
        mobile: [],
        desktop: {
          src: "/projects/fcvaxjo-reborn/news-viewport.png",
          alt: "Nyhetskort och träningstider på samma sida",
        },
        desktopCopy: {
          eyebrow: "Innehåll",
          heading: "Nyheter och tider synliga direkt.",
          support:
            "Föräldrar och spelare ska snabbt hitta senaste nytt och när lagen tränar.",
        },
        gallery: [
          {
            src: "/projects/fcvaxjo-reborn/training-viewport.png",
            alt: "Träningsschema i kortlayout, förberett för uppdateringar från mobil",
          },
        ],
        galleryCopy: {
          eyebrow: "Nästa steg",
          heading: "Redo för schema från mobilen.",
          support:
            "Hemsidan kan senare ta emot träningstider från en app och API, utan att byggas om från grunden.",
        },
        closing: {
          src: "/projects/fcvaxjo-reborn/email-layout.png",
          alt: "Eget HTML-mejl till klubben med FC Växjö-header och sponsorförfrågan",
        },
        closingCopy: {
          eyebrow: "Mejl",
          heading: "Egna mejl till klubben.",
          support:
            "När någon skickar en sponsorförfrågan får klubben ett eget mejl, inte ett vanligt systemmejl.",
        },
      },
      seo: {
        title: "FC Växjö Reborn. Next.js",
        description:
          "Case: FC Växjö Reborn. Ny klubbhemsida i Next.js med GitHub CI till Hostinger, förberedd för schema från mobilapp.",
      },
    },
  },
  {
    slug: "andalus-calendar",
    name: "The Andalus Calendar",
    tagline: "En kalender där bönetiden redan sitter i vyn, så du inte bokar över salah.",
    description:
      "Personlig kalenderapp med gregoriansk och hijri-kalender, bönetider i UI:t och uppgifter i samma vy. Live beta.",
    siteUrl: "https://andaluscalendar.com/",
    githubUrl: "",
    tags: ["React", "Firebase", "Kalender"],
    year: 2026,
    stack: ["React", "Firebase", "Hostinger"],
    image: "/projects/andalus-calendar/hero-viewport.png",
    imageAlt:
      "The Andalus Calendar i månadsvy, bönetider till vänster, hijri-datum i rutnätet och uppgifter till höger",
    theme: {
      bg: "var(--project-theme-andalus)",
      dark: false,
    },
    detail: {
      overview: [
        "Syftet var enkelt: sluta hoppa mellan appar. I stället för att kolla bönetiden någon annanstans skulle den synas där jag redan planerar dagen.",
      ],
      challenge: [
        "Vardagen bodde i en kalender. Salah bodde i en annan app. Utan en gemensam vy var det lätt att planera något som krockade med bönetiden, bara för att de två inte pratade med varandra.",
      ],
      solution: [
        "Jag byggde The Andalus Calendar i React och Firebase: en kalender där bönetider ligger rakt i planeringsvyn, med växling mellan gregoriansk och hijri-kalender och uppgifter i samma yta. Jag använde Google AI Studio under bygget och hostade på Hostinger, med automatisk uppdatering när huvudkoden ändras.",
      ],
      results: [
        "En live beta på andaluscalendar.com (version 2026.1). Jag pausade i början av 2026 när jag fick mitt första barn, och hoppas återvända, men appen går att använda redan nu.",
      ],
      role: "Produkt, design & utveckling",
      client: "Eget projekt",
      industry: "Kalender / produktivitet",
      media: {
        hero: {
          src: "/projects/andalus-calendar/hero-viewport.png",
          alt: "Månadsvy med nedräkning till Maghrib, hijri-datum och uppgifter i sidopanelen",
        },
        feature: {
          src: "/projects/andalus-calendar/day-overlay.png",
          alt: "Dagsvy där Dhuhr, Asr, Maghrib och Isha ritas som linjer i tidsschemat",
        },
        mobile: [],
        desktop: {
          src: "/projects/andalus-calendar/settings.png",
          alt: "Inställningar för ljust/mörkt läge, gregoriansk eller hijri-kalender och böneräkningsmetod",
        },
        desktopCopy: {
          eyebrow: "Inställningar",
          heading: "Hijri, mörkt läge och böneräkning, i samma meny.",
          support:
            "Växla kalendertyp, välj böneräkningsmetod och utseende utan att lämna dagen.",
        },
        gallery: [
          {
            src: "/projects/andalus-calendar/landing-hero.png",
            alt: "Andalus landningssida. Version 2026.1 now live",
          },
          {
            src: "/projects/andalus-calendar/landing-dual-calendar.png",
            alt: "Landningssida, dual-calendar med hijri, helgdagar och sol/måne-spårning",
          },
          {
            src: "/projects/andalus-calendar/landing-prayer.png",
            alt: "Landningssida, bönetider som överlägg i dagsvyn",
          },
          {
            src: "/projects/andalus-calendar/landing-tasks.png",
            alt: "Landningssida, uppgifter för vardag och andliga vanor i samma yta",
          },
          {
            src: "/projects/andalus-calendar/landing-privacy.png",
            alt: "Landningssida, integritet: säker molnlagring och ingen dataförsäljning",
          },
        ],
        galleryCopy: {
          eyebrow: "Landningen",
          heading: "Så möter besökaren appen innan de loggar in.",
          support:
            "Hijri-kalender, bönetider och uppgifter, förklarat redan på startsidan.",
        },
      },
      seo: {
        title: "The Andalus Calendar. React & Firebase",
        description:
          "Case: The Andalus Calendar, en React- och Firebase-kalender där muslimska bönetider sitter i samma UI som dagen.",
      },
    },
  },
  {
    slug: "takkoll",
    name: "TakKoll",
    tagline: "Skyddar svenska hem – ett tak i taget.",
    description:
      "Hemsida för TakKoll: takmålning, omläggning, tvätt, isolering och service, med bokning och ROT synligt från start.",
    siteUrl: "https://takkoll.se",
    githubUrl: "",
    tags: ["WordPress", "Lokalt", "Leadgen"],
    year: 2025,
    stack: ["WordPress", "Elementor"],
    image: "/projects/takkoll/hero-viewport.jpg",
    imageAlt: "TakKoll startsida, professionella taklösningar",
    theme: {
      bg: "var(--project-theme-roof)",
      dark: false,
    },
    detail: {
      overview: [
        "Ett tak är husets viktigaste skydd. Ändå är det ofta det man skjuter på att ta hand om. TakKoll ville ändra på det.",
        "De erbjuder allt från taktvätt och målning till omläggning, isolering och serviceavtal. Men deras tidigare sida gjorde det svårt för husägare att förstå vad de faktiskt fick hjälp med, och varför det var smart att agera i tid.",
      ],
      challenge: [
        "Husägare förstod inte erbjudandet. Tjänsterna fanns, men sidan förklarade varken vad som ingick eller varför det lönade sig att boka en besiktning innan skadan blev dyr.",
      ],
      solution: [
        "Vi tog fram en ny lösning: kostnadsfri onlinebokning av takbesiktning där kunden själv väljer datum. Tjänsterna paketerades tydligt, vad de innebär och varför de behövs. ROT-avdraget syns från start, så besökaren ser hur mycket som går att spara. FAQ och guider svarar på vanliga frågor och bygger förtroende.",
      ],
      results: [
        "Nu möts besökaren av en hemsida som förklarar, förenklar och gör det lätt att boka. TakKoll får in fler förfrågningar, och husägare får bättre skydd för sina hem.",
      ],
      role: "Design & WordPress-bygge",
      client: "TakKoll",
      industry: "Tak & fastighetsservice",
      media: {
        hero: {
          src: "/projects/takkoll/hero-viewport.jpg",
          alt: "TakKoll-hero med takarbetare och tydlig CTA",
        },
        feature: {
          src: "/projects/takkoll/services-viewport.jpg",
          alt: "TakKolls tjänstekort, målning, omläggning, service och isolering",
        },
        mobile: [
          {
            src: "/projects/takkoll/mobile-1.png",
            alt: "TakKoll mobil hero med ROT-avdrag på takrenovering",
          },
          {
            src: "/projects/takkoll/mobile-2.png",
            alt: "TakKoll mobil tjänstekort, takmålning och takomläggning",
          },
          {
            src: "/projects/takkoll/mobile-3.png",
            alt: "TakKoll mobil, därför väljer husägare TakKoll, med kostnadsfri offert",
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
            "Från hero och ROT till tjänster, FAQ och bokning, dra eller scrolla inne i ramen.",
        },
        desktop: {
          src: "/projects/takkoll/safety-viewport.png",
          alt: "TakKoll taksäkerhet, utrustning enligt Boverkets regler",
        },
        desktopCopy: {
          eyebrow: "Trygghet",
          heading: "Taksäkerhet enligt boken, inte löst prat.",
          support:
            "Snörasskydd, gångbryggor och livlinefästen, installerat och dokumenterat enligt Boverkets regler.",
        },
      },
      seo: {
        title: "TakKoll. WordPress",
        description:
          "Case: TakKoll, hur en tydligare WordPress-hemsida gjorde takbesiktning enkelt att boka och ROT synligt från start.",
      },
    },
  },
  {
    slug: "bilservicekoll",
    name: "BilserviceKoll",
    tagline: "Bilverkstaden i Gävle som gör det enkelt att serva bilen.",
    description:
      "Hemsida för BilserviceKoll: service, oljebyten, däck och besiktningskontroll, med onlinebokning och bilupphämtning.",
    siteUrl: "https://bilservicekoll.se",
    githubUrl: "",
    tags: ["WordPress", "Lokalt", "Leadgen"],
    year: 2025,
    stack: ["WordPress", "Elementor"],
    image: "/projects/bilservicekoll/hero-viewport.png",
    imageAlt: "BilserviceKoll startsida, hero med bilservice och biluppämtning",
    theme: {
      bg: "var(--project-theme-sand)",
      dark: false,
    },
    detail: {
      overview: [
        "Bilar måste servas. Men för många känns det krångligt.",
        "BilserviceKoll ville ändra på det. De erbjuder service, oljebyten, däck och besiktningskontroll, till och med upphämtning av bilen hemma eller på jobbet.",
      ],
      challenge: [
        "Hemsidan visade inte fördelarna. Tjänsterna var svåra att överblicka. Och bokningen saknade enkelhet.",
      ],
      solution: [
        "Vi byggde en ny hemsida: ett smidigt bokningssystem online där kunden bokar tid och får offert bekräftad innan arbetet startar. Tjänsterna presenterades tydligt i enkla block. Verkstadens garanti på godkänd besiktning lyftes fram. Formulär och kontaktvägar gjorde det enkelt att boka, fråga och få svar.",
      ],
      results: [
        "Fler bokningar via hemsidan, färre frågetecken hos kunderna, och en digital närvaro som speglar verkstadens löfte: trygghet, transparens och service på riktigt.",
      ],
      role: "Design & WordPress-bygge",
      client: "BilserviceKoll",
      industry: "Bilverkstad",
      media: {
        hero: {
          src: "/projects/bilservicekoll/hero-viewport.png",
          alt: "BilserviceKoll startsida, hero med bilservice och biluppämtning",
        },
        feature: {
          src: "/projects/bilservicekoll/services-viewport.png",
          alt: "BilserviceKoll tjänster, bilservice, oljebyte, besiktning, däckbyte och däckhotell",
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
          alt: "Bokningskalender, välj tjänst, datum och tid direkt på hemsidan",
        },
        desktopCopy: {
          eyebrow: "Bokning",
          heading: "Ingen telefon behövs, tiden bokas direkt.",
          support:
            "Kunden väljer tjänst, datum och tid i en kalender som visar lediga tider live.",
        },
      },
      seo: {
        title: "BilserviceKoll. WordPress",
        description:
          "Case: BilserviceKoll, hur en tydligare WordPress-hemsida gjorde bilservice i Gävle enkelt att boka.",
      },
    },
  },
  {
    slug: "stadkoll",
    name: "Städkoll",
    tagline: "Flyttstädning utan stress – till fast pris.",
    description:
      "Hemsida för Städkoll: professionell flyttstädning till fast pris, med 14 dagars garanti och RUT-avdrag.",
    siteUrl: "https://stadkoll.se",
    githubUrl: "",
    tags: ["Frontend", "UX/UI", "Leadgen"],
    year: 2025,
    stack: ["Frontend", "UX & UI-design"],
    image: "/projects/stadkoll/hero-viewport.webp",
    imageAlt: "Städkoll startsida, hero med flyttstädning till fast pris",
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
        "Fler förfrågningar, en smidigare process för kunderna och en hemsida som speglar Städkolls löfte, trygg, enkel och prisvärd flyttstädning.",
      ],
      role: "Frontend, UX & UI-design",
      client: "Städkoll",
      industry: "Flyttstädning",
      media: {
        hero: {
          src: "/projects/stadkoll/hero-viewport.webp",
          alt: "Städkoll startsida, hero med flyttstädning till fast pris",
        },
        mobile: [],
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
      },
      seo: {
        title: "Städkoll. Frontend & UX/UI",
        description:
          "Case: Städkoll, hur en tydligare hemsida gjorde flyttstädning till fast pris enkelt att boka.",
      },
    },
  },
  {
    slug: "brandsakerhetskoll",
    name: "Brand & Säkerhetskoll",
    tagline: "Din lokala expert på brandskydd i Gävle.",
    description:
      "Hemsida för Brand & Säkerhetskoll: brandsläckare, brandvarnare och brandfiltar, med tydliga produkter och offert direkt på sidan.",
    siteUrl: "https://brandsakerhetskoll.se",
    githubUrl: "",
    tags: ["Frontend", "UX/UI", "Leadgen"],
    year: 2025,
    stack: ["Frontend", "UX & UI-design"],
    image: "/projects/brand-sakerhetskoll/hero-viewport.webp",
    imageAlt: "Brand & Säkerhetskoll startsida, hero med brandsläckare och trygghet i hemmet",
    theme: {
      bg: "var(--project-theme-ember)",
      dark: false,
    },
    detail: {
      overview: [
        "Trygghet börjar i hemmet. Men utan rätt brandskydd är den skör.",
        "Brand & Säkerhetskoll erbjuder brandsläckare, brandvarnare och brandfiltar. CE-märkta, certifierade och framtagna för att rädda liv. Men deras hemsida berättade inte det på rätt sätt.",
      ],
      challenge: [
        "Produkter låg gömda. Budskapet var splittrat. Kunderna fick inte förtroendet som krävs när man pratar säkerhet.",
      ],
      solution: [
        "Vi byggde en ny hemsida: tydliga produktbeskrivningar med fokus på användning och trygghet. Offertförfrågan direkt på sidan för enkel konvertering. Säkerhetsinformation som stärker deras expertroll.",
      ],
      results: [
        "En sida som inte bara säljer produkter, utan också förmedlar förtroende, trygghet och kunskap.",
      ],
      role: "Frontend, UX & UI-design",
      client: "Brand & Säkerhetskoll",
      industry: "Brandskydd",
      media: {
        hero: {
          src: "/projects/brand-sakerhetskoll/hero-viewport.webp",
          alt: "Brand & Säkerhetskoll startsida, hero med brandsläckare och trygghet i hemmet",
        },
        mobile: [],
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
      },
      seo: {
        title: "Brand & Säkerhetskoll. Frontend & UX/UI",
        description:
          "Case: Brand & Säkerhetskoll, hur en tydligare hemsida byggde förtroende kring brandskydd i Gävle.",
      },
    },
  },
  {
    slug: "scooterkoll",
    name: "Scooterkoll",
    tagline: "Elscootrar är smidiga. Tills de går sönder.",
    description:
      "Hemsida för Scooterkoll i Gävle: reparation av alla märken, med tydlig bokning, FAQ och offert nära till hands.",
    siteUrl: "https://scooterkoll.se",
    githubUrl: "",
    tags: ["Frontend", "UX/UI", "SEO"],
    year: 2025,
    stack: ["SEO", "Frontend", "UX & UI-design"],
    image: "/projects/scooterkoll/hero-viewport.webp",
    imageAlt: "Scooterkoll startsida, hero med offertformulär och 365+ reparerade scootrar",
    theme: {
      bg: "var(--project-theme-lime)",
      dark: false,
    },
    detail: {
      overview: [
        "Elscootrar är smidiga. Tills de går sönder.",
        "Scooterkoll i Gävle reparerar alla märken, snabbt och lokalt. Men deras gamla hemsida visade inte styrkan i erbjudandet. Kunderna fick inte svar på enkla frågor. Och det var otydligt hur man faktiskt bokar.",
      ],
      challenge: [
        "Erbjudandet syntes inte. Vanliga frågor saknade svar. Och bokningen var svår att hitta, vilket kostade både kunder och tid i support.",
      ],
      solution: [
        "Vi byggde en ny hemsida som löste fyra saker: tydlig struktur med klara steg för hur man bokar, vanliga frågor och svar som sparar tid för både kund och support, en offert-knapp nära till hands som driver fler förfrågningar, och formulär i livechatt-format som gör kontakt snabbt och enkelt direkt på sidan.",
      ],
      results: [
        "Fler förfrågningar från lokala kunder. Mindre supportärenden kring enkla frågor. Och en hemsida som speglar deras service, snabb, trygg och professionell.",
      ],
      role: "SEO, Frontend, UX & UI-design",
      client: "Scooterkoll",
      industry: "Elscooter-reparation",
      media: {
        hero: {
          src: "/projects/scooterkoll/hero-viewport.webp",
          alt: "Scooterkoll startsida, hero med offertformulär och 365+ reparerade scootrar",
        },
        mobile: [],
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
      },
      seo: {
        title: "Scooterkoll. SEO, Frontend & UX/UI",
        description:
          "Case: Scooterkoll, hur en tydligare hemsida gjorde elscooter-reparation i Gävle enkelt att boka.",
      },
    },
  },
  {
    slug: "halimapearl",
    name: "HalimaPearl",
    tagline: "Från lokalt rykte till en växande varumärkesresa.",
    description:
      "GoHighLevel-hemsida för HalimaPearl: en plattform som visar kollektionerna, stärker varumärket och öppnar nya marknader.",
    siteUrl: "https://halimapearl.com",
    githubUrl: "",
    tags: ["GoHighLevel", "UX/UI", "Varumärke"],
    year: 2025,
    stack: ["GoHighLevel", "UX & UI-design"],
    image: "/projects/halimapearl/hero-viewport.webp",
    imageAlt: "HalimaPearl startsida, hero med Modesty Is Fashion mot sidentyg",
    theme: {
      bg: "var(--project-theme-peach)",
      dark: false,
    },
    detail: {
      overview: [
        "När vi först mötte HalimaPearl drevs verksamheten nästan helt av word of mouth. Kvinnor i Gambia hörde talas om hennes kläder genom vänner och familj, och kollektionerna spreds snabbt från hand till hand.",
        "Men med ett växande intresse kom också behovet av något större. Hur skulle hon kunna nå fler kunder, bortom de som redan kände till henne?",
      ],
      challenge: [
        "Ryktet räckte inte längre. Utan en tydlig digital plats riskerade varumärket att stanna lokalt, trots att intresset växte och kollektionerna redan vandrade från hand till hand.",
      ],
      solution: [
        "Vi hjälpte HalimaPearl att ta nästa steg. Genom GoHighLevel byggde vi en professionell digital närvaro där hennes varumärke kunde växa på riktigt, en plattform som visar kollektionerna, stärker varumärkets identitet och öppnar dörrar för nya marknader.",
      ],
      results: [
        "Idag säljer hon inte bara i Gambia, utan även till närliggande länder på den afrikanska kontinenten. Hennes resa är ett exempel på hur ett starkt varumärke och rätt digitalt stöd kan ta ett lokalt initiativ, och förvandla det till något mycket större.",
      ],
      role: "GoHighLevel, UX & UI-design",
      client: "HalimaPearl",
      industry: "Mode & varumärke",
      media: {
        hero: {
          src: "/projects/halimapearl/hero-viewport.webp",
          alt: "HalimaPearl startsida, hero med Modesty Is Fashion mot sidentyg",
        },
        mobile: [],
        fullPage: {
          src: "/projects/halimapearl/page-collection.webp",
          alt: "HalimaPearl kimono-kollektion, produktlista från topp till botten",
        },
        fullPageCopy: {
          eyebrow: "Kollektion",
          heading: "Bläddra i kollektionen, precis som en kund gör.",
          support:
            "Sök, filtrera och sortera bland kimonos, dra eller scrolla inne i ramen.",
        },
      },
      seo: {
        title: "HalimaPearl. GoHighLevel",
        description:
          "Case: HalimaPearl, hur en GoHighLevel-hemsida tog ett lokalt modevarumärke från Gambia till fler marknader.",
      },
    },
  },
  {
    slug: "ventilationskoll",
    name: "Ventilationskoll",
    tagline: "En hemsida som gör jobbet.",
    description:
      "Hemsida för Ventilationskoll: tydlig prisinformation och smidig onlinebokning, byggd för att dra in kunder.",
    siteUrl: "https://ventilationskoll.se",
    githubUrl: "",
    tags: ["Frontend", "UX/UI", "SEO"],
    year: 2025,
    stack: ["SEO", "Frontend", "UX & UI-design"],
    image: "/projects/ventilationskoll/hero-viewport.webp",
    imageAlt: "Ventilationskoll startsida, hero med pris från 2095 kr och kundomdömen",
    theme: {
      bg: "var(--project-theme-sky)",
      dark: false,
    },
    detail: {
      overview: [
        "Ventilationskoll kom till oss med ett tydligt mål: de behövde en hemsida som inte bara såg bra ut, utan som faktiskt hjälpte dem att få in kunder. Besökarna skulle enkelt kunna hitta prisinformation och smidigt boka direkt online.",
      ],
      challenge: [
        "Snyggt räcker inte. Utan tydliga priser och enkel bokning blir hemsidan en visitkort, istället för en kanal som faktiskt tar emot kunder.",
      ],
      solution: [
        "Vi tog fram en lösning som förenklar både för företaget och deras kunder. En användarvänlig design, tydlig struktur och funktioner som gör att informationen alltid finns nära till hands.",
      ],
      results: [
        "En hemsida som idag inte bara speglar Ventilationskolls tjänster, utan också driver tillväxt. På kort tid har sidan genererat över 14 000 visningar, och fungerar nu som en självklar kanal för nya kunder.",
      ],
      role: "SEO, Frontend, UX & UI-design",
      client: "Ventilationskoll",
      industry: "Ventilation",
      media: {
        hero: {
          src: "/projects/ventilationskoll/hero-viewport.webp",
          alt: "Ventilationskoll startsida, hero med pris från 2095 kr och kundomdömen",
        },
        mobile: [],
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
      },
      seo: {
        title: "Ventilationskoll. SEO, Frontend & UX/UI",
        description:
          "Case: Ventilationskoll, hur en hemsida med tydliga priser och onlinebokning drev över 14 000 visningar.",
      },
    },
  },
  {
    slug: "premium-honey-blends",
    name: "Premium Honey Blends",
    tagline: "Från meddelanden och kontakter till en butik som aldrig sover.",
    description:
      "Shopify-butik för Premium Honey Blends: live lagerstatus och beställningar dygnet runt, utan att något försvinner i chatten.",
    siteUrl: "https://premiumhoneyblends.com",
    githubUrl: "",
    tags: ["Shopify", "E-handel", "Varumärke"],
    year: 2026,
    stack: ["Shopify"],
    image: "/projects/premium-honey-blends/hero-viewport.png",
    imageAlt:
      "Premium Honey Blends startsida, mörk hero med honungsburkar och Handla nu-knapp",
    theme: {
      bg: "var(--project-theme-honey)",
      dark: false,
    },
    detail: {
      overview: [
        "Kunden ville lansera sin första hemsida. Fram till dess drevs försäljningen via kontakter och sociala medier, ett upplägg som fungerade, tills det blev för stort att hålla i handen.",
        "Med tiden blev det jobbigt att hålla koll på alla meddelanden och kontakter, samt att hålla koll på antal produkter i lager.",
      ],
      challenge: [
        "Beställningar försvann bland meddelanden. Lagerstatus fanns i huvudet, inte i systemet. När intresset växte behövdes något mer hållbart än chatt och manuella listor.",
      ],
      solution: [
        "Vi byggde en vacker Shopify-butik där alla kan gå in och lägga sin beställning. Lagerstatus uppdateras live, och kunden säljer endast det som finns tillgängligt, utan att behöva jaga svar i inkorgen.",
      ],
      results: [
        "Nu kan kunder lägga beställningar dag och natt utan att en enda order försvinner bland alla meddelanden. Butiken håller koll på lagret, så att verksamheten kan växa utan kaos.",
      ],
      role: "Shopify-butik, UX & UI-design",
      client: "Premium Honey Blends",
      industry: "E-handel / Livsmedel",
      media: {
        hero: {
          src: "/projects/premium-honey-blends/hero-viewport.png",
          alt: "Premium Honey Blends startsida i desktop, hero med honungsburkar mot blomsteräng",
        },
        feature: {
          src: "/projects/premium-honey-blends/feature-product.png",
          alt: "Produktsektion med Power Honey Blend-burk i naturmiljö och text om naturlig honung och örter",
        },
        mobile: [
          {
            src: "/projects/premium-honey-blends/mobile-1.png",
            alt: "Mobil startsida, hero med honungsburkar och bästsäljare under",
          },
          {
            src: "/projects/premium-honey-blends/mobile-2.png",
            alt: "Mobil produktsida, alla honungsblends listade med pris",
          },
          {
            src: "/projects/premium-honey-blends/mobile-3.png",
            alt: "Mobil kontaktsida. Vi svarar på allt, med kontaktformulär",
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
          alt: "Produktsidan i desktop, tre honungsblends med produktkort under",
        },
        desktopCopy: {
          eyebrow: "Butik",
          heading: "Live lager, beställningar dygnet runt.",
          support:
            "Shopify som håller koll på lagret och tar emot ordrar utan att något drunknar i chatten.",
        },
      },
      seo: {
        title: "Premium Honey Blends. Shopify",
        description:
          "Case: Premium Honey Blends, hur en Shopify-butik ersatte chattförsäljning med live lager och ordrar dygnet runt.",
      },
    },
  },
  {
    slug: "alkama",
    name: "ALKAMA",
    tagline:
      "WooCommerce-butik på svenska, finska och norska, utan att tappa 20 års förtroende.",
    description:
      "Flerspråkig WooCommerce-butik för Alkama Industry: fakturabetalning, självbetjäning och lokal SEO i Norden.",
    siteUrl: "",
    githubUrl: "",
    tags: ["WooCommerce", "Polylang", "B2B"],
    year: 2026,
    stack: ["WooCommerce", "Polylang", "PHP"],
    image: "/projects/alkama/hero-viewport.png",
    imageAlt: "ALKAMA startsida, hero med bästsäljare i webbutiken",
    theme: {
      bg: "var(--project-theme-steel)",
      dark: false,
    },
    detail: {
      overview: [
        "Alkama Industry har sedan 2004 byggt verksamheten på högt förtroende och personliga relationer. Men den manuella, telefonbaserade modellen skapade flaskhalsar när ägandet bytte generation.",
        "Intäkterna begränsades av hur mycket tid ägaren kunde lägga på telefonbeställningar. Höga administrativa kostnader och språkbarriärer bromsade tillväxten i Norge och Finland. Kunskapen låg i manuella register, svårt för nya ägare att ge samma personliga känsla, och svårt att möta kunder som förväntar sig att handla digitalt.",
      ],
      challenge: [
        "Telefonen räckte inte längre. Utan digital struktur blev tillväxt i Norden dyr, långsam och beroende av en persons tid, samtidigt som relationerna som byggt varumärket riskerade att gå förlorade.",
      ],
      solution: [
        "Målet var att översätta 20 års rykte till en friktionsfri digital upplevelse. Continuity-first UX: en ren, industriell layout som inköpare känner igen, inklusive fakturabetalning digitaliserad så att bokföringen automatiseras utan att tappa den förtroendebaserade känslan. Strategisk lokalisering med Polylang och anpassad PHP: tekniska dokument, fakturor och SEO riktade mot varje marknad, inklusive nynorska för den norska industrisektorn. Admin-automation: självbetjäningsportal för ombeställning på två klick och SEO-optimerade landningssidor som gör hemsidan till en leadgenerator dygnet runt.",
      ],
      results: [
        "En WooCommerce-butik på svenska, finska och norska som behåller Alkamas förtroende, samtidigt som beställningar, språk och administration skalas utan att allt går via telefonen.",
      ],
      role: "WooCommerce, lokalisering & UX/UI",
      client: "Alkama Industry",
      industry: "B2B / Industri",
      media: {
        hero: {
          src: "/projects/alkama/hero-viewport.png",
          alt: "ALKAMA startsida, hero med bästsäljare i webbutiken",
        },
        mobile: [],
        desktop: {
          src: "/projects/alkama/hero-viewport.png",
          alt: "ALKAMA startsida i desktop, bästsäljare och företagskonto-CTA",
        },
        desktopCopy: {
          eyebrow: "B2B-butik",
          heading: "Tre språk, samma förtroende.",
          support:
            "WooCommerce med Polylang, fakturaflöde och självbetjäning för ombeställning.",
        },
      },
      seo: {
        title: "ALKAMA. WooCommerce & Polylang",
        description:
          "Case: ALKAMA, flerspråkig WooCommerce-butik som digitaliserade 20 års B2B-förtroende för Norden.",
      },
    },
  },
  {
    slug: "uniclean",
    name: "UniClean",
    tagline: "Från samma frågor om och om igen, till en hemsida som onboardingar själv.",
    description:
      "WordPress-hemsida för UniClean: tjänster, ungefärliga priser och förväntningar synliga från start, så teamet kan fokusera på jobbet.",
    siteUrl: "",
    githubUrl: "",
    tags: ["WordPress", "Elementor", "Lokalt"],
    year: 2026,
    stack: ["WordPress", "Elementor"],
    image: "/projects/uniclean/hero-viewport.png",
    imageAlt: "UniClean startsida, hero med prisoffertformulär",
    theme: {
      bg: "var(--project-theme-mint)",
      dark: false,
    },
    detail: {
      overview: [
        "Lucas hade drivit en framgångsrik lokal verksamhet med starkt rykte i flera år. Men när kundbasen växte blev bristen på en strukturerad onboarding en flaskhals.",
        "Teamet lade för mycket tid på att svara på samma frågor manuellt, i stället för att fokusera på själva arbetet.",
      ],
      challenge: [
        "Ryktet drog in kunder, men varje ny förfrågan krävde samma manuella förklaringar. Utan en tydlig digital startpunkt blev onboarding långsam och dyr i tid.",
      ],
      solution: [
        "Jag byggde en hemsida som fungerar som en informationshub dygnet runt. Genom att tydligt visa tjänster, ungefärliga priser och vad kunden kan förvänta sig filtrerar och utbildar hemsidan blivande kunder automatiskt.",
        "Riktiga Google-recensioner hämtas in live på hemsidan, så nya besökare ser betyg och omdömen direkt, utan att teamet behöver uppdatera något för hand.",
      ],
      results: [
        "Onboardingprocessen blev smidigare, företaget sparar administrativ tid, och kundupplevelsen blir klarare redan innan första samtalet.",
      ],
      role: "Design & WordPress-bygge (Elementor)",
      client: "UniClean",
      industry: "Lokal service",
      media: {
        hero: {
          src: "/projects/uniclean/hero-viewport.png",
          alt: "UniClean startsida, hero med prisoffertformulär",
        },
        feature: {
          src: "/projects/uniclean/booking-viewport.png",
          alt: "Så bokar du hos UniClean, fyra steg från klick till städning",
        },
        mobile: [
          {
            src: "/projects/uniclean/mobile-1.png",
            alt: "UniClean mobil startsida, hero med offertformulär och Google-betyg",
          },
          {
            src: "/projects/uniclean/mobile-2.png",
            alt: "UniClean mobil, utmärkelse och bild på städare i skolsal",
          },
          {
            src: "/projects/uniclean/mobile-3.png",
            alt: "UniClean mobil, mission och vision med fönsterputsning i bild",
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
          alt: "UniClean recensionssektion. 4.9 i betyg från 58 Google-recensioner, hämtat live",
        },
        desktopCopy: {
          eyebrow: "Förtroende",
          heading: "Riktiga omdömen, hämtade live från Google.",
          support:
            "58 recensioner och 4.9 i snittbetyg syns direkt på hemsidan, utan att någon behöver uppdatera det för hand.",
        },
      },
      seo: {
        title: "UniClean. WordPress & Elementor",
        description:
          "Case: UniClean, hur en WordPress-hemsida blev en 24/7-informationshub och sparade tid i onboarding.",
      },
    },
  },
  {
    slug: "shanasheel",
    name: "Shanasheel",
    tagline:
      "Från första skissen till en tvåspråkig hemsida som berättar om Akkad, och om framtiden i Irak.",
    description:
      "Hemsida för Shanasheel Al-Asima: fastighet, hållbarhet och investeringar, byggd i WordPress med Elementor.",
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
        "Shanasheel Al-Asima behövde mer än en vanlig företagswebb. De behövde en plats där investerare, familjer och partners kunde känna tyngden i Akkad Residential City, och samtidigt förstå hela bolaget: avfall, solenergi och jordbruk.",
        "Jag formgav och byggde hemsidan i WordPress med Elementor, med tydliga sektioner, starka bilder och en berättelse som leder besökaren från första intrycket till nästa steg.",
      ],
      challenge: [
        "Budskapet var stort: lyxboende, hållbarhet och engagemang i Irak, på två språk. Utan en klar berättelse riskerade hemsidan att bli en lista med tjänster i stället för en resa man vill följa.",
      ],
      solution: [
        "Jag byggde en lång, lugn startsida kring Akkad: hero, investeringsresa, nyheter, hustyper och storytelling-block. Tjänstesidan fick samma ton, fyra affärsområden i bild och text. Allt i Elementor, med arabiska och engelska via TranslatePress.",
      ],
      results: [
        "En live-hemsida på shanasheel.se som Digital Koll står bakom, där Shanasheel kan visa projekt, ta emot intresse och berätta sin historia på två språk.",
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
          alt: "Shanasheel fastighetssida. Type A, B och C med planlösningar för Akkad",
        },
        mobile: [
          {
            src: "/projects/shanasheel/mobile-1.png",
            alt: "Shanasheel startsida i mobil. Akkad-hero",
          },
          {
            src: "/projects/shanasheel/mobile-2.png",
            alt: "Shanasheel mobil. Type A med planlösning och 300 kvm",
          },
          {
            src: "/projects/shanasheel/mobile-3.png",
            alt: "Shanasheel mobil. Om Shanasheel Al-Asima och företagets historia",
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
            "Startsida från hero till footer, dra eller scrolla inne i ramen.",
        },
        desktop: {
          src: "/projects/shanasheel/journey-viewport.png",
          alt: "Shanasheel, fastighet, solenergi, jordbruk och återvinning i fyra ikoner",
        },
        desktopCopy: {
          eyebrow: "Verksamheten",
          heading: "Fyra spår, en gemensam ton.",
          support:
            "Fastighet, solenergi, jordbruk och återvinning, samma visuella språk genom hela hemsidan.",
        },
      },
      seo: {
        title: "Shanasheel. WordPress & Elementor",
        description:
          "Case: Shanasheel Al-Asima, hur jag designade och byggde en tvåspråkig WordPress-hemsida kring Akkad Residential City.",
      },
    },
  },
  {
    slug: "fcvaxjo",
    name: "FC Växjö",
    tagline: "En digital hemmaplan för föreningen sedan 1989.",
    description:
      "Hemsida för FC Växjö: nyheter, träningstider, galleri och kontakt, med klubbens svart-guld-identitet i centrum.",
    siteUrl: "https://fcvaxjo.se",
    githubUrl: "",
    tags: ["Webbdesign", "UX/UI", "Förening"],
    year: 2023,
    stack: ["One.com", "UX & UI-design"],
    image: "/projects/fcvaxjo/hero-viewport.png",
    imageAlt: "FC Växjö startsida, hero med klubbmärke och plan",
    theme: {
      bg: "var(--project-theme-dark)",
      dark: true,
    },
    detail: {
      overview: [
        "FC Växjö har sedan 1989 samlat ungdomar kring fotboll, gemenskap och integration i Växjö. Föreningen behövde en hemsida som kändes som klubben, inte som en generisk mall.",
        "Hemsidan skulle bära klubbmärket, visa nyheter och träningstider, samla bilder från verksamheten och göra det enkelt för föräldrar, partners och sponsorer att ta kontakt.",
      ],
      challenge: [
        "Utan en tydlig digital plats riskerade klubbens historia, schema och gemenskap att stanna i Facebook-inlägg och mun-till-mun, svårt för nya familjer och samarbetspartners att hitta rätt.",
      ],
      solution: [
        "Jag formgav och byggde en hemsida med klubbens svarta och guldiga uttryck: stark hero med emblem, nyheter och träningstider på startsidan, om-sida med historia och utmärkelser, galleri, samt kontakt och sponsorformulär.",
      ],
      results: [
        "En live-hemsida på fcvaxjo.se där medlemmar, föräldrar och partners hittar nyheter, tider, bilder och kontakt, med en identitet som matchar föreningen på planen.",
      ],
      role: "Design & webbutveckling",
      client: "FC Växjö",
      industry: "Fotbollsförening",
      media: {
        hero: {
          src: "/projects/fcvaxjo/hero-viewport.png",
          alt: "FC Växjö startsida, hero med klubbmärke mot gräsplan",
        },
        feature: {
          src: "/projects/fcvaxjo/gallery-viewport.png",
          alt: "FC Växjö galleri, foton från lag, matcher och aktiviteter",
        },
        mobile: [
          {
            src: "/projects/fcvaxjo/mobile-1.png",
            alt: "FC Växjö mobil startsida, hero med klubbmärke",
          },
          {
            src: "/projects/fcvaxjo/mobile-2.png",
            alt: "FC Växjö mobil. Om FC Växjö med klubbens historia",
          },
          {
            src: "/projects/fcvaxjo/mobile-3.png",
            alt: "FC Växjö mobil, kontaktuppgifter och klubbledare",
          },
        ],
        desktop: {
          src: "/projects/fcvaxjo/about-viewport.png",
          alt: "Om FC Växjö, klubbmärke, historia och utmärkelser",
        },
        desktopCopy: {
          eyebrow: "Identitet",
          heading: "Historia och utmärkelser, synliga på riktigt.",
          support:
            "Från PARS och ARYO till FC Växjö 2008, plus stipendier och integrationspris i en tydlig berättelse.",
        },
      },
      seo: {
        title: "FC Växjö. Webbdesign",
        description:
          "Case: FC Växjö, hur en klubbhemsida med svart-guld-identitet blev digital hemmaplan för nyheter, träning och gemenskap.",
      },
    },
  },
];
