const email = "malakdeluca@gmail.com";
const linkedin = "https://www.linkedin.com/in/marcel-deluca";
const github = "https://github.com/DelucaGit";

export const site = {
  name: "Marcel Deluca",
  title: "Webbutvecklare",
  description:
    "Jag bygger webbappar och hemsidor med React och Java. Jag söker en fast anställning där jag får växa i ett team.",
  url: "https://marceldeluca.se",
  email,
  linkedin,
  github,
  phone: "073 879 66 01",
  phoneNote: "Ring efter 12.00",
  location: "Växjö, Sverige",
  status: "Öppen för jobb",
  cvPdf: "/cv.pdf",
  heroImage: "/hero-portrait.jpg",
  heroImageAlt: "Marcel Deluca i profil vid havet",
  intro: {
    eyebrow: "Om mig",
    heading: "Så här brukar det börja",
    description:
      "En kort film om hur jag tänker, från första idén till något som faktiskt fungerar.",
    video: "/videos/intro.mp4",
    poster: "/videos/intro-poster.jpg",
  },
  about: {
    eyebrow: "Om mig",
    heading: "Hej, jag är Marcel",
    paragraphs: [
      "Jag är webbutvecklare. Jag bygger hemsidor, webbappar och egna produkter, bland annat The Andalus Calendar.",
      "Just nu studerar jag Java med cloud på JENSEN yrkeshögskola. Jag vill jobba i ett team där jag får koda, lära mig mer och ta ansvar.",
    ],
  },
  stack: {
    eyebrow: "Teknik",
    heading: "Vilka språk jag kan",
    note: "(förutom svenska, engelska, spanska, arabiska och franska…)",
    items: [
      {
        icon: "react",
        name: "React / Next.js",
        label: "Frontend",
      },
      {
        icon: "tailwind",
        name: "Tailwind CSS",
        label: "Frontend",
      },
      {
        icon: "htmlcss",
        name: "HTML & CSS",
        label: "Grunder",
      },
      {
        icon: "java",
        name: "Java",
        label: "Backend",
      },
      {
        icon: "restapi",
        name: "REST API",
        label: "Backend",
      },
      {
        icon: "php",
        name: "PHP",
        label: "Backend",
      },
      {
        icon: "wordpress",
        name: "WordPress / Elementor",
        label: "CMS",
      },
      {
        icon: "postgresql",
        name: "PostgreSQL",
        label: "Databas",
      },
      {
        icon: "firebase",
        name: "Firebase",
        label: "Data & hosting",
      },
      {
        icon: "docker",
        name: "Docker",
        label: "DevOps",
      },
      {
        icon: "aws",
        name: "AWS",
        label: "Cloud",
      },
      {
        icon: "azure",
        name: "Azure",
        label: "Cloud",
      },
      {
        icon: "git",
        name: "Git",
        label: "Samarbete",
      },
      {
        icon: "jira",
        name: "Jira",
        label: "Samarbete",
      },
      {
        icon: "cursor",
        name: "Cursor",
        label: "Verktyg",
      },
      {
        icon: "claude",
        name: "Claude Code",
        label: "Verktyg",
      },
    ],
  },
  /** Full legal name only on the CV page */
  cv: {
    fullName: "Marcel Deluca Nygren",
    portrait: "/cv-portrait.jpg",
    portraitAlt: "Marcel Deluca Nygren i kavaj och polotröja",
    location: "Växjö",
    roleLine: "Fullstack Webbutvecklare",
    summary:
      "Jag bygger hemsidor och webbappar med React, Next.js och Java. Jag söker en fast anställning där jag får koda, lära mig mer och ta ansvar i ett team. Jag är också intresserad av datasäkerhet eftersom jag har jobbat några år på Avarn och Loomis.",
    experience: [
      {
        title: "Webbutvecklare",
        place: "Egna projekt och kunduppdrag",
        period: "2022 – nu",
        bullets: [
          "Bygger hemsidor och webbappar åt kunder, bland annat FC Växjö Reborn i Next.js.",
          "Driver egna produkter, till exempel The Andalus Calendar i React och Firebase.",
          "Jobbar med allt från design och frontend till publicering via GitHub och Hostinger.",
          "Har byggt hemsidor åt vänner sedan 2022 för att få erfarenhet. Många av företagen finns inte kvar, så jag kan inte visa alla projekt.",
        ],
      },
    ],
    education: [
      {
        title: "Systemutveckling i Java med cloud-inriktning",
        place: "JENSEN yrkeshögskola",
        period: "2025 – 2027",
        learnings: [
          "Java och Spring Boot",
          "Byggt REST API",
          "AWS och Azure",
          "Docker",
          "Maven",
          "Agilt arbetssätt och Scrum",
          "Jira",
          "Byggt en Reddit-klon där man kan lägga inlägg, kommentera och skicka vänförfrågan",
          "JSON-tokens och third party identity providers",
          "JPA",
        ],
      },
      {
        title: "Webmaster",
        place: "Högskolan Väst (distans)",
        period: "2022 – 2024",
        learnings: [
          "Byggt WordPress-plugins",
          "Designat och skissat databaser",
          "Installerat virtuella Linux-datorer",
          "Studerat webbjuridik",
          "HTML, CSS, vanilla JavaScript, React, Vue och Angular",
          "Studerat nätverksprotokoll",
          "Byggt ett storage-room som går att nå när man är kopplad till samma WiFi",
        ],
      },
      {
        title: "Samhällsvetenskap / IB",
        place: "Katedralskolan Växjö",
        period: "2017 – 2020",
      },
    ],
    skills: [
      "React",
      "Next.js",
      "JavaScript",
      "TypeScript",
      "Java",
      "HTML & CSS",
      "PHP",
      "WordPress",
      "Firebase",
      "REST API",
      "SEO",
      "UX / UI",
      "Git",
      "Docker",
    ],
    languages: [
      { name: "Svenska", level: "Flytande" },
      { name: "Spanska", level: "Flytande" },
      { name: "Engelska", level: "Flytande" },
      { name: "Arabiska", level: "Flytande" },
      { name: "Franska", level: "Förstår" },
    ],
  },
  /** The sticky menu at the top of every page. */
  nav: {
    label: "Huvudmeny",
    brandLabel: "Marcel Deluca, till startsidan",
    links: [
      { name: "Projekt", href: "/#projekt" },
      { name: "Om mig", href: "/#om" },
      { name: "Teknik", href: "/#teknik" },
      { name: "Kontakt", href: "/#kontakt" },
    ],
    cv: { name: "Läs CV", href: "/cv" },
    contact: { name: "Hör av dig", href: "/#kontakt" },
    menuButton: { open: "Öppna menyn", close: "Stäng menyn" },
  },
  footer: {
    lead: "Webbutvecklare i Växjö. Öppen för jobb.",
    columns: [
      {
        heading: "Sidan",
        links: [
          { name: "Projekt", href: "/#projekt", external: false },
          { name: "Om mig", href: "/#om", external: false },
          { name: "Teknik", href: "/#teknik", external: false },
          { name: "Kontakt", href: "/#kontakt", external: false },
        ],
      },
      {
        heading: "Mer",
        links: [
          { name: "CV", href: "/cv", external: false },
          { name: "Alla case", href: "/projects", external: false },
        ],
      },
      {
        heading: "Kontakt",
        links: [
          { name: "LinkedIn", href: linkedin, external: true },
          { name: "GitHub", href: github, external: true },
          { name: "E-post", href: `mailto:${email}`, external: false },
        ],
      },
    ],
  },
  /** Small texts that belong to the frame around every page. */
  ui: {
    skipLink: "Hoppa till innehållet",
    theme: {
      label: "Tema",
      options: [
        { value: "system", label: "Följ systemet" },
        { value: "light", label: "Ljust" },
        { value: "dark", label: "Mörkt" },
      ],
    },
  },
} as const;
