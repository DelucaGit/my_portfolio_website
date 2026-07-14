export type ProjectTheme = {
    bg: string;
    dark: boolean;
  };
  
  export type Project = {
    slug: string;              // NEW — URL key, e.g. "project-1"
    name: string;                // keep (display title)
    tagline: string;             // NEW — short homepage blurb (1–2 sentences)
    description: string;         // keep — can become detail overview intro
    siteUrl: string;             // keep
    githubUrl: string;           // keep
    tags: string[];              // keep — homepage/filter labels
    year: number;                // keep
    stack: string[];             // keep — maps to detail techStack
  
    image: string;               // NEW — homepage card image
    imageAlt: string;            // NEW
    theme: ProjectTheme;         // NEW — per-project background color
  
    detail: {                    // NEW — case-study page content
      overview: string[];
      challenge?: string[];
      solution?: string[];
      results?: string[];
      gallery?: { src: string; alt: string }[];
      seo: {
        title?: string;
        description: string;
      };
    };
  };

export const projects: Project[] = [
  {
    slug: "project-1",
    name: "Project 1",
    tagline: "Short one-liner for the homepage card.",
    description: "Description 1",
    siteUrl: "https://example.com",
    githubUrl: "https://github.com/example/project1",
    tags: ["tag1", "tag2"],
    year: 2021,
    stack: ["stack1", "stack2"],
    image: "/projects/project-1.png",
    imageAlt: "Screenshot of Project 1",
    theme: {
      bg: "var(--project-theme-warm)",
      dark: false,
    },
    detail: {
      overview: ["Description 1"],
      seo: {
        description: "Case study: Project 1.",
      },
    },
  },
];