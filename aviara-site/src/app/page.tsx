import type { Metadata } from "next";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import ScrollReveal from "@/components/ScrollReveal";
import Portfolio from "@/components/Portfolio";
import Process from "@/components/Process";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

// Title.absolute so this overrides the layout's "%s | Aviara Design Co."
// template — we want the locality keywords up front and a single readable
// branded title for the homepage.
export const metadata: Metadata = {
  title: {
    absolute: "Home Staging & Interior Design in Temecula, CA | Aviara Design Co.",
  },
  description:
    "Aviara Design Co. — a licensed, family-owned home staging and interior design studio in Temecula, CA. Vacant and occupied staging across Temecula, Murrieta, Menifee, Fallbrook, San Diego, and Orange County.",
  alternates: { canonical: "/" },
};

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
