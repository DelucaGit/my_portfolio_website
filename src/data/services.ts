export type Service = {
title: string,
description: string,
detailDescription: string,
images: string[],
imagesAlt: string[],
slug: string
};

export const services: Service[] = [
    {
        title: "Web Development",
        description: "I build fast e-commerce sites, price calculators, and AI chatbots.",
        detailDescription: "I build fast e-commerce sites, price calculators, and AI chatbots.",
        images: ["/services/web-development.png", "/services/web-development-2.png"],
        imagesAlt: ["Screenshot of the web development service", "Screenshot of the web development service"],
        slug: "web-development",
    },
    {
        title: "AI Development",
        description: "I build AI chatbots, image generators, and more.",
        detailDescription: "I build AI chatbots, image generators, and more.",
        images: ["/services/ai-development.png", "/services/ai-development-2.png"],
        imagesAlt: ["Screenshot of the AI development service", "Screenshot of the AI development service"],
        slug: "ai-development",
    },
    {
        title: "Custom Software",
        description: "I build custom software solutions for businesses.",
        detailDescription: "I build custom software solutions for businesses.",
        images: ["/services/custom-software.png", "/services/custom-software-2.png"],
        imagesAlt: ["Screenshot of the custom software service", "Screenshot of the custom software service"],
        slug: "custom-software",
    },
];
