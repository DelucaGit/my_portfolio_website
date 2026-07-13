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
      "I've worked with Marcel during 2025–2026 when he built a brand new website for us. He went the extra mile to make sure the goals were delivered on time and we've already started making sales through the website.",
      "Working with Marcel has been more than just a partnership — it has been a friendship where we check up on each other and talk about life outside business.",
      "I recommend him to larger businesses that look for honesty put in work.",
    ],
    author: "Fredrik Strand",
    role: "Strategic Procurement Executive",
    company: "Stealth Venture",
    relation: "Fredrik was Marcel's client",
    date: "April 1, 2026",
    avatar: "/reviews/fredrik-strand-avatar.png",
  },
  {
    id: 2,
    quote: [
      "I've had the pleasure of working with Marcel on two different projects, where he developed two websites for my companies, and I can highly recommend him as a web developer.",
      "Marcel is extremely professional in his work and has an impressive ability to solve problems quickly and efficiently. No matter the challenge, he always finds solutions that work, often exceeding expectations.",
      "Beyond his technical skills, Marcel is also very easy to work with. He is communicative, attentive, and ensures that projects run smoothly from start to finish.",
      "I look forward to working with him again in the future.",
    ],
    author: "Sami Fakhro",
    role: "Remote Center Operatör",
    company: "Caverion",
    relation: "Sami was Marcel's client",
    date: "April 2, 2026",
    avatar: "/reviews/sami-fakhro-avatar.png",
  },
  {
    id: 3,
    quote: [
      "I had Marcel on my team for a year at Digital Koll. The number of projects he handled at a very short period was fascinating. Not to mention, he's always on time and never misses a moment to spark a new idea and add to every meeting. Highly recommend working with him.",
    ],
    author: "Nabilah Mousa",
    role: "Account Manager",
    company: "Digital Circle Agency",
    relation: "Nabilah worked with Marcel on the same team",
    date: "January 9, 2026",
    avatar: "/reviews/nabilah_avatar.jfif",
  },
  {
    id: 4,
    quote: [
      "I worked closely with Marcel building websites together, and he consistently stood out for his strong design skills and creative eye. He has a natural sense for clean, effective design and understands how to translate ideas into visually appealing and functional websites.",
      "Beyond design, Marcel was always willing to take on different roles within the company when needed. Regardless of the responsibility, he rose to the challenge, adapted quickly, and gave his full effort every time. His flexibility, strong work ethic, and commitment to doing his best made him a valuable and reliable team member.",
      "Marcel is someone you can trust to take ownership of his work and deliver with professionalism. I can confidently recommend him to anyone looking for a skilled web developer and a dependable collaborator.",
    ],
    author: "Hosein Moustafa",
    role: "Webbutvecklare",
    company: "Moderna WordPress-hemsidor och webb-support för småföretag",
    relation: "Hosein worked with Marcel on the same team",
    date: "December 23, 2025",
    avatar: "/reviews/hossein_avatar.jfif",
  },
  {
    id: 5,
    quote: [
      "Marcel helped me with my website and Google Business Profile. I am extremely pleased with the feedback, responsiveness, and professional service. Highly recommended.",
    ],
    author: "Lucas Rajanen",
    role: "CEO",
    company: "UniClean",
    relation: "Lucas was Marcel's client",
    date: "July 10, 2026",
    avatar: "/reviews/lucas_avatar.png",
  },
  {
    id: 6,
    quote: [
      "Marcel worked on the website for our association, FC Växjö. We are very satisfied with the result, and it has been a privilege to work with him.",
    ],
    author: "Bakhtiar Mohammed",
    role: "Football Club Manager",
    company: "FC Växjö",
    relation: "Bakhtiar was Marcel's client",
    date: "July 10, 2026",
    avatar: "/reviews/bakhtiar_avatar.jpg",
  },
  {
    id: 7,
    quote: [
      "Marcel is a great web developer, I really enjoyed working with him. He has a lot of eager to learn and contribute to the team, he is hardworking and I'm not saying this because I've worked with him; but his work ethic is hard to come by these days.",
    ],
    author: "Abdifattah Jibril",
    role: "Sales Management",
    company: "Digital Koll",
    relation: "Abdifattah worked with Marcel on the same team",
    date: "July 13, 2026",
    avatar: "/reviews/abdifattah_avatar.jfif",
  },
];
