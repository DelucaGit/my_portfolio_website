import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Tech from "@/components/Tech";
import About from "@/components/About";
import Timeline from "@/components/Timeline";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <About />
      <Tech />
      <Timeline />
      <Contact />
    </>
  );
}
