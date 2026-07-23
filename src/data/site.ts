export const site = {
  name: "Marcel Deluca",
  title: "Systemdesigner",
  description:
    "Jag bygger hemsidor, e-handel och interna system åt företag som vill att tekniken bara ska fungera.",
  url: "https://marceldeluca.se",
  email: "marcel@marceldeluca.se",
  intro: {
    eyebrow: "Om mig",
    heading: "Så här brukar det börja",
    description:
      "En kort film om hur jag tänker — från första samtalet till system som gör vardagen enklare och affären starkare.",
    video: "/videos/intro.mp4",
    poster: "/videos/intro-poster.jpg",
  },
  nav: [
    {
      name: "Hem",
      href: "/",
    },
    {
      name: "Projekt",
      href: "/projects",
    },
    {
      name: "Kontakt",
      href: "/#contact",
    },
  ],
} as const;
