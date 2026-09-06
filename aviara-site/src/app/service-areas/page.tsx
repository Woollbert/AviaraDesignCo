import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { site } from "@/data/site";
import { serviceAreasPage, groupCitiesByRegion } from "@/data/serviceAreas";

// Page copy and the region list live in src/content/service-areas.json
// (CMS: "Service Areas Page"). Each city's JSON names its own region, so the
// groups below fill themselves in as cities are added or published.

const sa = serviceAreasPage;

export const metadata: Metadata = {
  title: { absolute: sa.metaTitle },
  description: sa.metaDescription,
  alternates: { canonical: "/service-areas/" },
  openGraph: {
    title: sa.metaTitle,
    description: sa.metaDescription,
    url: "/service-areas/",
    images: [{ url: "/images/stagedlivingroom_stonefireplace_aviaradesignco_homestaging-og.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  const regions = groupCitiesByRegion();

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
              {sa.eyebrow}
            </p>
            <h1 className="mt-5 font-display text-4xl md:text-5xl lg:text-[3.75rem] leading-[1.05] text-ivory">
              {sa.headlineLine1}{" "}
              <span className="italic text-brassSoft">{sa.headlineItalic}</span>
            </h1>
            <p className="mt-7 text-lg md:text-xl text-ivory/85 max-w-2xl leading-relaxed">
              {sa.intro}
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
          key={region.name}
          data-testid="service-region"
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
                {region.name}
              </h2>
              {region.blurb && (
                <p className="mt-5 text-lg text-slate leading-relaxed max-w-3xl">
                  {region.blurb}
                </p>
              )}
            </Reveal>

            <ul className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
              {region.cities.map((city, i) => (
                <Reveal key={city.slug} as="li" delay={i * 60}>
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
              ))}
            </ul>
          </div>
        </section>
      ))}

      {/* Closing CTA */}
      <section className="section border-t border-line bg-ink text-ivory">
        <div className="container-wide max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow !text-brassSoft">{sa.closing.eyebrow}</p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl text-ivory leading-tight">
              {sa.closing.headline}
            </h2>
            <p className="mt-6 text-lg text-ivory/85">{sa.closing.body}</p>
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
