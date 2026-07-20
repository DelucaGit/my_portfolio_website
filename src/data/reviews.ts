export type Review = {
  id: number;
  quote: string[];
  author: string;
  role: string;
  company: string;
  relation: string;
  date: string;
  avatar: string;
};

export const reviews: Review[] = [
  {
    id: 1,
    quote: [
      "Jag har arbetat med Marcel under 2025–2026 när han byggde en helt ny webbplats åt oss. Han gick den extra milen för att se till att målen levererades i tid — och vi har redan börjat sälja via sajten.",
      "Att jobba med Marcel har varit mer än ett samarbete. Det blev en vänskap där vi hör av oss och pratar om livet utanför jobbet också.",
      "Jag rekommenderar honom till större verksamheter som vill ha ärlighet och verkligt engagemang i arbetet.",
    ],
    author: "Fredrik Strand",
    role: "Strategic Procurement Executive",
    company: "Stealth Venture",
    relation: "Fredrik var Marcels kund",
    date: "1 april 2026",
    avatar: "/reviews/fredrik-strand-avatar.png",
  },
  {
    id: 2,
    quote: [
      "Jag har haft nöjet att arbeta med Marcel i två olika projekt, där han utvecklade två webbplatser för mina bolag. Jag kan varmt rekommendera honom som webbutvecklare.",
      "Marcel är extremt professionell och har en imponerande förmåga att lösa problem snabbt och effektivt. Oavsett utmaning hittar han lösningar som fungerar — ofta över förväntan.",
      "Utöver det tekniska är han lätt att samarbeta med. Han är kommunikativ, lyhörd och ser till att projekten rullar smidigt från start till mål.",
      "Jag ser fram emot att arbeta med honom igen.",
    ],
    author: "Sami Fakhro",
    role: "Remote Center Operatör",
    company: "Caverion",
    relation: "Sami var Marcels kund",
    date: "2 april 2026",
    avatar: "/reviews/sami-fakhro-avatar.png",
  },
  {
    id: 3,
    quote: [
      "Marcel fanns i mitt team under ett år på Digital Koll. Antalet projekt han hann med på kort tid var fascinerande. Dessutom är han alltid i tid och missar aldrig chansen att tända en ny idé i varje möte. Rekommenderar starkt att arbeta med honom.",
    ],
    author: "Nabilah Mousa",
    role: "Account Manager",
    company: "Digital Circle Agency",
    relation: "Nabilah arbetade med Marcel i samma team",
    date: "9 januari 2026",
    avatar: "/reviews/nabilah_avatar.jfif",
  },
  {
    id: 4,
    quote: [
      "Jag arbetade tätt med Marcel när vi byggde webbplatser tillsammans, och han stack konstant ut med stark designkänsla och ett kreativt öga. Han har en naturlig känsla för ren, effektiv design och förstår hur man tar en idé till något som både ser bra ut och fungerar.",
      "Utöver designen var Marcel alltid beredd att ta olika roller i bolaget när det behövdes. Oavsett ansvar växte han med uppgiften, anpassade sig snabbt och gav sitt bästa varje gång. Hans flexibilitet, arbetsmoral och engagemang gjorde honom till en värdefull och pålitlig kollega.",
      "Marcel är någon man kan lita på att ta ägarskap och leverera professionellt. Jag rekommenderar honom varmt till den som söker en skicklig webbutvecklare och en trygg samarbetspartner.",
    ],
    author: "Hosein Moustafa",
    role: "Webbutvecklare",
    company: "Moderna WordPress-hemsidor och webb-support för småföretag",
    relation: "Hosein arbetade med Marcel i samma team",
    date: "23 december 2025",
    avatar: "/reviews/hossein_avatar.jfif",
  },
  {
    id: 5,
    quote: [
      "Marcel hjälpte mig med min webbplats och Google Företagsprofil. Jag är mycket nöjd med återkopplingen, snabbheten och den professionella servicen. Rekommenderas varmt.",
    ],
    author: "Lucas Rajanen",
    role: "VD",
    company: "UniClean",
    relation: "Lucas var Marcels kund",
    date: "10 juli 2026",
    avatar: "/reviews/lucas_avatar.png",
  },
  {
    id: 6,
    quote: [
      "Marcel arbetade med webbplatsen för vår förening, FC Växjö. Vi är mycket nöjda med resultatet, och det har varit ett privilegium att samarbeta med honom.",
    ],
    author: "Bakhtiar Mohammed",
    role: "Klubbansvarig",
    company: "FC Växjö",
    relation: "Bakhtiar var Marcels kund",
    date: "10 juli 2026",
    avatar: "/reviews/bakhtiar_avatar.jpg",
  },
  {
    id: 7,
    quote: [
      "Marcel är en riktigt bra webbutvecklare — jag tyckte mycket om att arbeta med honom. Han har stor vilja att lära och bidra till teamet, han är hårt arbetande, och jag säger inte det bara för att vi har jobbat ihop: hans arbetsmoral är ovanlig nuförtiden.",
    ],
    author: "Abdifattah Jibril",
    role: "Sales Management",
    company: "Digital Koll",
    relation: "Abdifattah arbetade med Marcel i samma team",
    date: "13 juli 2026",
    avatar: "/reviews/abdifattah_avatar.jfif",
  },
];
