import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Tech from "@/components/Tech";
import About from "@/components/About";
import WhatIDo from "@/components/WhatIDo";
import Timeline from "@/components/Timeline";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <About />
      <WhatIDo />
      <Tech />
      <Timeline />
      <Contact />
    </>
  );
}
