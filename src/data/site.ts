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
  /** The start page's hero: status row, the big sentence and two buttons. */
  hero: {
    status: "Öppen för jobb",
    place: "Växjö",
    heading: "Jag bygger webbappar och hemsidor med React och Java.",
    lede: "Jag söker en fast anställning där jag får växa i ett team.",
    cv: { name: "Läs CV", href: "/cv" },
    projects: { name: "Se projekten", href: "/#projekt" },
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
    /** What the languages and tools are used for, in the order shown. */
    groups: [
      { id: "frontend", name: "Frontend" },
      { id: "backend", name: "Backend och data" },
      { id: "cloud", name: "Cloud och drift" },
      { id: "tools", name: "Samarbete och verktyg" },
    ],
    items: [
      {
        name: "React / Next.js",
        label: "Frontend",
        group: "frontend",
      },
      {
        name: "Tailwind CSS",
        label: "Frontend",
        group: "frontend",
      },
      {
        name: "HTML & CSS",
        label: "Grunder",
        group: "frontend",
      },
      {
        name: "Java",
        label: "Backend",
        group: "backend",
      },
      {
        name: "REST API",
        label: "Backend",
        group: "backend",
      },
      {
        name: "PHP",
        label: "Backend",
        group: "backend",
      },
      {
        name: "WordPress / Elementor",
        label: "CMS",
        group: "frontend",
      },
      {
        name: "PostgreSQL",
        label: "Databas",
        group: "backend",
      },
      {
        name: "Firebase",
        label: "Data & hosting",
        group: "backend",
      },
      {
        name: "Docker",
        label: "DevOps",
        group: "cloud",
      },
      {
        name: "AWS",
        label: "Cloud",
        group: "cloud",
      },
      {
        name: "Azure",
        label: "Cloud",
        group: "cloud",
      },
      {
        name: "Git",
        label: "Samarbete",
        group: "tools",
      },
      {
        name: "Jira",
        label: "Samarbete",
        group: "tools",
      },
      {
        name: "Cursor",
        label: "Verktyg",
        group: "tools",
      },
      {
        name: "Claude Code",
        label: "Verktyg",
        group: "tools",
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
  /**
   * "Vägen hit" on the start page. The steps themselves are read from
   * cv.education and cv.experience (see src/lib/cv.ts).
   */
  timeline: {
    heading: "Vägen hit",
    kinds: { education: "Utbildning", work: "Arbete" },
    cvLink: { name: "Läs hela CV:t", href: "/cv" },
  },
  /**
   * "Kontakt" on the start page. The address, the number and phoneNote are the
   * ones at the top of this file.
   */
  contact: {
    heading: "Ska vi höras?",
    text: "Jag är öppen för jobb och söker en fast anställning. Mejla eller ring, så berättar jag mer.",
    mailButton: "Mejla mig",
    /** The phone number is added after this word. */
    callButton: "Ring",
    emailLabel: "E-post",
    phoneLabel: "Telefon",
    /** The button that copies the e-mail address. */
    copy: {
      button: "Kopiera",
      /** Only read out by screen readers, after the button text. */
      buttonHint: "e-postadressen",
      done: "Kopierad",
      doneAnnouncement: "E-postadressen är kopierad",
      /** When the browser does not allow copying, the address is selected. */
      selected: "Markerad",
      selectedAnnouncement:
        "E-postadressen är markerad. Kopiera den med Ctrl+C eller Cmd+C.",
    },
    profiles: [
      { label: "LinkedIn", handle: "marcel-deluca", href: linkedin },
      { label: "GitHub", handle: "DelucaGit", href: github },
    ],
  },
  /** Headings, labels and button texts on the CV page. The CV itself is `cv`. */
  cvPage: {
    back: "Tillbaka",
    eyebrow: "CV",
    facts: { email: "Mejl", phone: "Telefon", location: "Plats" },
    download: { label: "Ladda ner CV (PDF)", fileName: "Marcel_Deluca_CV.pdf" },
    github: "GitHub",
    linkedin: "LinkedIn",
    experience: "Erfarenhet",
    education: "Utbildning",
    learnings: "Vad har jag lärt mig?",
    skills: "Kompetens",
    languages: "Språk",
    contact: {
      heading: "Vill du komma i kontakt?",
      text: "Skicka ett mejl eller ring om du vill prata om jobb, projekt eller bara säga hej.",
    },
  },
  /** Texts shared by every service page. The services are in `services.ts`. */
  servicePage: {
    back: "← Till startsidan",
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
