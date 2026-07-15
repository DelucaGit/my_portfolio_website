export type ServiceTheme = {
    bg: string,
    dark: boolean,
};

export type Service = {
title: string,
description: string,
detailDescription: string,
images: string[],
imagesAlt: string[],
slug: string,
theme: ServiceTheme,
};

export const services: Service[] = [
    {
        title: "Web Development",
        description: "I build fast e-commerce sites, price calculators, and AI chatbots.",
        detailDescription: "I build fast e-commerce sites, price calculators, and AI chatbots.",
        images: [
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1200&auto=format&fit=crop",
        ],
        imagesAlt: ["Laptop screen showing code for a web project", "Close-up of a website layout on screen"],
        slug: "web-development",
        theme: {
            bg: "var(--service-theme-cool)",
            dark: false,
        },
    },
    {
        title: "AI Development",
        description: "I build AI chatbots, image generators, and more.",
        detailDescription: "I build AI chatbots, image generators, and more.",
        images: [
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop",
        ],
        imagesAlt: ["Abstract visualization of an AI network", "Chat interface on a laptop screen"],
        slug: "ai-development",
        theme: {
            bg: "var(--service-theme-dark)",
            dark: true,
        },
    },
    {
        title: "Custom Software",
        description: "I build custom software solutions for businesses.",
        detailDescription: "I build custom software solutions for businesses.",
        images: [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
        ],
        imagesAlt: ["Dashboard showing custom software analytics", "Laptop displaying a custom software interface"],
        slug: "custom-software",
        theme: {
            bg: "var(--service-theme-warm)",
            dark: false,
        },
    },
];
