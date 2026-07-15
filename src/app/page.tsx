import Hero from "@/components/Hero";
import IntroVideo from "@/components/IntroVideo";
import Projects from "@/components/Projects";
import Reviews from "@/components/Reviews";
import Services from "@/components/Services";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <IntroVideo />
      <Projects />
      <Reviews />
      <Services />
      <Contact />
    </main>
  );
}
