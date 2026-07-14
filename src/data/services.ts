export type Service = {
title: string,
description: string,
image: string[]
};

export const services: Service[] = [
    {
        title: "Web Development",
        description: "I build fast e-commerce sites, price calculators, and AI chatbots.",
        image: ["/services/web-development.png", "/services/web-development-2.png"],
    },
    {
        title: "AI Development",
        description: "I build AI chatbots, image generators, and more.",
        image: ["/services/ai-development.png", "/services/ai-development-2.png"],
    },
    {
        title: "Custom Software",
        description: "I build custom software solutions for businesses.",
        image: ["/services/custom-software.png", "/services/custom-software-2.png"],
    },
];
