import type { ProjectSlug } from "./projects";

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
  /**
   * "Om mig" on the start page. {featured} becomes the name of the featured
   * project, as a link to its case.
   */
  about: {
    heading: "Om mig",
    portrait: {
      src: "/portrait.webp",
      alt: "Marcel Deluca i profil vid havet",
    },
    paragraphs: [
      "Hej, jag är Marcel. Jag bygger hemsidor, webbappar och egna produkter, bland annat {featured}.",
      "Just nu studerar jag Java med cloud på JENSEN yrkeshögskola. Jag vill jobba i ett team där jag får koda, lära mig mer och ta ansvar.",
    ],
  },
  /**
   * "Vad jag gör" on the start page: three cards. In a link text {project}
   * becomes the project's name.
   */
  whatIDo: {
    heading: "Vad jag gör",
    clients: {
      heading: "Hemsidor åt kunder",
      text: "Jag bygger hemsidor åt företag och föreningar, bland annat FC Växjö Reborn i Next.js. Jag jobbar med allt från design och frontend till publicering via GitHub och Hostinger.",
      /** The project the card shows and links to. */
      project: "fcvaxjo-reborn" satisfies ProjectSlug,
      link: "Se {project}",
    },
    /**
     * This card shows the featured project. {featured} becomes its name and
     * the first two things it is built with: "The Andalus Calendar i React
     * och Firebase".
     */
    products: {
      heading: "Egna produkter",
      text: "Jag driver egna produkter, till exempel {featured}. Till min fru byggde jag adhkar-appen Sabaah Al-Wuruud för Android.",
      /** The words between the name, the first technology and the second. */
      builtWith: "i",
      and: "och",
      link: "Se {project}",
      /** The project in the small window on top. */
      second: "sabaah-al-wuruud" satisfies ProjectSlug,
    },
    backend: {
      heading: "Backend och cloud",
      text: "På JENSEN yrkeshögskola läser jag Java och Spring Boot, bygger REST API:er och jobbar med AWS, Azure och Docker. Jag har byggt en Reddit-klon där man kan lägga inlägg, kommentera och skicka vänförfrågan.",
      link: { name: "Läs hela CV:t", href: "/cv" },
      code: {
        title: "PostController.java · exempel",
        /** Read by screen readers instead of the code. */
        label:
          "Exempel: en Spring Boot-kontroller som tar emot kommentarer på ett inlägg",
        source: `@RestController
@RequestMapping("/api/posts")
public class PostController {

  @PostMapping("/{id}/comments")
  public ResponseEntity<CommentDto> comment(
      @PathVariable Long id,
      @Valid @RequestBody NewComment body,
      @AuthenticationPrincipal Jwt user) {
    return ResponseEntity.status(CREATED)
        .body(posts.addComment(id, body, user.getSubject()));
  }
}`,
      },
      terminal: {
        title: "Terminal",
        source: `$ docker compose up -d
✓ postgres  Started
✓ api       Started
POST /api/posts/7/comments 201`,
      },
    },
  },
  stack: {
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
   * The featured project: the slug of a project in src/data/projects.ts.
   * Change this one line to feature another project. A slug that does not
   * exist stops the build.
   */
  featuredProject: "andalus-calendar" satisfies ProjectSlug,
  /**
   * How many projects the start page shows: the featured one plus the newest
   * of the others. The rest are on /projects.
   */
  homeProjectCount: 10,
  /** The project section on the start page. */
  projects: {
    heading: "Projekt",
    /** The buttons a project has, wherever it is shown. Read out as "Läs caset: TakKoll". */
    buttons: {
      readCase: "Läs caset",
      visitSite: "Besök sidan",
      /** Stands instead of "Besök sidan" when the customer's site is gone. */
      siteEnded: "Kunden har avslutat projektet",
      code: "Kod på GitHub",
    },
    /** The projects under the featured one on the start page. */
    more: {
      heading: "Fler projekt",
      note: "Nyast först",
      all: { name: "Alla projekt", href: "/projects" },
    },
    /** The split view: project names on one side, a preview window on the other. */
    splitView: {
      preview: "Förhandsvisning av valt projekt",
      /** Followed by the project's name. */
      screenshot: "Skärmbild av",
      year: "År",
      type: "Typ",
      builtWith: "Byggt med",
      keyboardHelp: "↑ ↓ bläddrar · Enter öppnar caset · Tab till länkarna",
    },
    featured: {
      label: "Utvalt",
      /** Read by screen readers, followed by the project's name. */
      filmLabel: "Inspelad genomgång av",
    },
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
  /** The project archive (/projects): every project in the split view. */
  projectsPage: {
    back: "Tillbaka",
    eyebrow: "Portfolio",
    heading: "Alla projekt",
    text: "En samling webbprojekt jag har byggt, egna produkter och uppdrag.",
    note: "Nyast först",
  },
  /**
   * Headings, labels and button texts on a project's own page
   * (/projects/<slug>). The projects themselves are in `projects.ts`.
   */
  projectPage: {
    back: { name: "Alla projekt", href: "/projects" },
    stack: { label: "Teknik", heading: "Det här använde jag" },
    duo: {
      label: "Problemet och svaret",
      heading: "Utmaning & lösning",
      challenge: "Utmaningen",
      solution: "Lösningen",
    },
    results: { label: "Resultat", heading: "Vad det ledde till" },
    /** Used when the project has no texts of its own for the part. */
    video: { eyebrow: "Film", heading: "Se hemsidan i rörelse" },
    feature: { eyebrow: "Detalj", heading: "En viktig del av UI:t" },
    mobile: {
      eyebrow: "Mobil",
      heading: "Så ser det ut i telefonen",
      support: "Scrolla i sidled för att se fler vyer.",
    },
    desktop: { eyebrow: "Desktop", heading: "Desktop-vyn" },
    fullPage: {
      eyebrow: "Hela sidan",
      heading: "Scrolla igenom hela flödet",
      support: "Scrolla inne i ramen för att se layouten från topp till botten.",
    },
    gallery: { eyebrow: "Fler bilder", heading: "Fler vyer från projektet" },
    /** The links to the projects before and after this one. */
    adjacent: {
      label: "Fler projekt",
      previous: "Föregående projekt",
      next: "Nästa projekt",
      /** On the last project, instead of a next one. */
      all: { label: "Portfolio", name: "Se alla projekt", href: "/projects" },
    },
    contact: {
      heading: "Vill du prata mer?",
      text: "Mejla mig om du har frågor om projektet eller om ett jobb.",
      cv: { name: "Läs CV", href: "/cv" },
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
