import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { cities } from "@/data/cities";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Service Areas — Home Staging Across Southern California | Aviara Design Co.",
  description:
    "Aviara Design Co. stages homes across Southern California, from Temecula and the San Jacinto Valley to coastal North County San Diego, inland North County, and the Big Bear mountain market.",
  alternates: { canonical: "/service-areas/" },
  openGraph: {
    title: "Service Areas — Home Staging Across Southern California | Aviara Design Co.",
    description:
      "Aviara Design Co. stages homes across Southern California, from Temecula and the San Jacinto Valley to coastal North County San Diego, inland North County, and the Big Bear mountain market.",
    url: "/service-areas/",
  },
};

// Group the 14 city pages by region for scannability. Slugs reference
// entries in src/data/cities.ts. `eyebrow` is the short label that appears
// above the section heading (replaces a generic "Region 01" numbering).
const regions: Array<{
  eyebrow: string;
  title: string;
  blurb: string;
  citySlugs: string[];
}> = [
  {
    eyebrow: "Our Home Region",
    title: "Inland Riverside County",
    blurb:
      "Our home base and the markets we know best. Temecula Valley, the San Jacinto Valley, and the I-15 / I-215 corridor.",
    citySlugs: [
      "home-staging-temecula",
      "home-staging-murrieta",
      "home-staging-menifee",
      "home-staging-winchester",
    ],
  },
  {
    eyebrow: "Coastal Luxury",
    title: "Coastal North County San Diego",
    blurb:
      "Coastal-luxury staging from Carlsbad's bluffs and lagoons through the design-aware villages of Encinitas, Solana Beach, and Del Mar, into La Jolla and the inland estates of Rancho Santa Fe.",
    citySlugs: [
      "home-staging-carlsbad",
      "home-staging-encinitas",
      "home-staging-solana-beach",
      "home-staging-del-mar",
      "home-staging-la-jolla",
      "home-staging-rancho-santa-fe",
    ],
  },
  {
    eyebrow: "Inland Estates",
    title: "Inland North County San Diego",
    blurb:
      "Estate, family-home, and luxury inland-coastal staging across Fallbrook's avocado country, San Marcos, and the older established neighborhoods of Escondido.",
    citySlugs: [
      "home-staging-fallbrook",
      "home-staging-san-marcos",
      "home-staging-escondido",
    ],
  },
  {
    eyebrow: "Mountain Resort",
    title: "Big Bear & the San Bernardino Mountains",
    blurb:
      "Mountain-luxury staging for cabins, lake homes, and vacation-rental properties in the Big Bear Valley.",
    citySlugs: ["home-staging-big-bear-lake"],
  },
];

export default function Page() {
  const findCityBySlug = (slug: string) => cities.find((c) => c.slug === slug)!;

  return (
    <main className="bg-bone">
      {/* Hero */}
      <section className="section relative overflow-hidden bg-ink text-ivory">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(28,24,21,0.94) 0%, rgba(28,24,21,1) 100%)",
          }}
        />
        <div className="container-wide relative z-10 max-w-4xl">
          <Reveal>
            <p className="eyebrow !text-brassSoft flex items-center gap-3">
              <span className="inline-block w-10 h-px bg-brassSoft" />
              Service Areas
            </p>
            <h1 className="mt-5 font-display text-4xl md:text-5xl lg:text-[3.75rem] leading-[1.05] text-ivory">
              Staging across{" "}
              <span className="italic text-brassSoft">Southern California.</span>
            </h1>
            <p className="mt-7 text-lg md:text-xl text-ivory/85 max-w-2xl leading-relaxed">
              Aviara Design Co. stages homes from our Temecula home base out into
              the Riverside County valleys, along the full North County San Diego
              coastline, through the inland communities of Fallbrook to Escondido,
              and up the mountain to Big Bear. Choose your area below to see how
              we work there.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="/#contact" className="btn btn-ink">
                Begin a Project
              </a>
              <a href={`tel:${site.phoneTel}`} className="btn btn-ghost-light">
                {site.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Regions */}
      {regions.map((region, regionIndex) => (
        <section
          key={region.title}
          className={`section border-t border-line ${
            regionIndex % 2 === 0 ? "bg-ivory" : ""
          }`}
        >
          <div className="container-wide max-w-6xl">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="gold-rule" />
                {region.eyebrow}
              </p>
              <h2 className="mt-4 font-display text-3xl md:text-4xl text-ink leading-tight">
                {region.title}
              </h2>
              <p className="mt-5 text-lg text-slate leading-relaxed max-w-3xl">
                {region.blurb}
              </p>
            </Reveal>

            <ul className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
              {region.citySlugs.map((slug, i) => {
                const city = findCityBySlug(slug);
                return (
                  <Reveal key={slug} as="li" delay={i * 60}>
                    <Link
                      href={`/${city.slug}/`}
                      className="block border-t border-line pt-5 group h-full"
                    >
                      <p className="text-[0.72rem] uppercase tracking-[0.28em] text-mute">
                        {city.county}
                      </p>
                      <p className="mt-2 font-display text-2xl text-ink group-hover:text-brass transition-colors">
                        Home Staging {city.city}
                      </p>
                      <p className="mt-3 text-sm text-slate leading-relaxed">
                        {city.metaDescription}
                      </p>
                      <p className="mt-4 text-xs text-brass tracking-[0.15em] uppercase">
                        View {city.city} →
                      </p>
                    </Link>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </section>
      ))}

      {/* Closing CTA */}
      <section className="section border-t border-line bg-ink text-ivory">
        <div className="container-wide max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow !text-brassSoft">Begin</p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl text-ivory leading-tight">
              Don't see your city? Reach out anyway.
            </h2>
            <p className="mt-6 text-lg text-ivory/85">
              We travel for the right project across Southern California. If your
              property is somewhere between Temecula and the coast, in North
              County, or up at the mountain, we want to hear about it.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="/#contact" className="btn btn-ink">
                Begin a Project
              </a>
              <a href={`tel:${site.phoneTel}`} className="btn btn-ghost-light">
                {site.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
