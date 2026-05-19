import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import ScrollReveal from "@/components/ScrollReveal";
import Portfolio from "@/components/Portfolio";
import Process from "@/components/Process";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <ScrollReveal />
      <Portfolio />
      <Process />
      <Testimonials />
      <Team />
      <Contact />
    </>
  );
}
