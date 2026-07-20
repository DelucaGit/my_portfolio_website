export const site = {
  name: "Marcel Deluca",
  title: "Systemdesigner",
  description:
    "Jag hjälper företag att få pengarna att arbeta mer — genom mjukvara som är byggd kring hur ni faktiskt jobbar.",
  url: "https://marceldeluca.se",
  email: "marcel@marceldeluca.se",
  intro: {
    eyebrow: "Berättelsen",
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
      name: "Om mig",
      href: "/about",
    },
    {
      name: "Kontakt",
      href: "/#contact",
    },
  ],
} as const;
