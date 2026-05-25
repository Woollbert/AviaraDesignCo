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
import { services } from "@/data/services";
import { site } from "@/data/site";

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

// One Service JSON-LD entity per offering, plus an OfferCatalog that ties them
// together. Each Service references the LocalBusiness in layout.tsx via @id so
// Google understands these are the offerings of that specific business.
const baseUrl = site.url.replace(/\/$/, "");
const providerRef = { "@id": `${baseUrl}/#business` };
const areaServed = site.serviceAreas.map((area) => ({ "@type": "City", name: area }));

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    ...services.map((s) => ({
      "@type": "Service",
      "@id": `${baseUrl}/#service-${s.slug}`,
      name: s.name,
      description: s.description,
      provider: providerRef,
      areaServed,
      serviceType:
        s.slug === "interior-design" ? "Interior Design" : "Home Staging",
    })),
    {
      "@type": "OfferCatalog",
      "@id": `${baseUrl}/#offer-catalog`,
      name: `${site.name} services`,
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@id": `${baseUrl}/#service-${s.slug}` },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
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
