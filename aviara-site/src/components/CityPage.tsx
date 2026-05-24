import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { cities, type City } from "@/data/cities";
import Reveal from "@/components/Reveal";

// Renders a city-specific home staging landing page. Data comes from
// src/data/cities.ts; per-route files in src/app/<slug>/page.tsx pass the
// matching City and supply metadata + canonical URL.

type Props = { city: City };

export default function CityPage({ city }: Props) {
  const nearby = cities.filter((c) => city.nearbyCitySlugs.includes(c.slug));

  return (
    <main className="bg-bone">
      {/* Hero */}
      <section className="section relative overflow-hidden bg-ink text-ivory">
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.25]">
          <Image
            src="/images/A7405914.jpeg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            style={{ mixBlendMode: "luminosity" }}
            priority
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(28,24,21,0.78) 0%, rgba(28,24,21,0.92) 100%)",
          }}
        />
        <div className="container-wide relative z-10 max-w-4xl">
          <Reveal>
            <p className="eyebrow !text-brassSoft flex items-center gap-3">
              <span className="inline-block w-10 h-px bg-brassSoft" />
              Serving {city.city}, {city.county}
            </p>
            <h1 className="mt-5 font-display text-4xl md:text-5xl lg:text-[3.75rem] leading-[1.05] text-ivory">
              {city.h1}
            </h1>
            <p className="mt-7 text-lg md:text-xl text-ivory/85 max-w-2xl leading-relaxed">
              {city.intro}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="/#contact" className="btn btn-ink">
                Begin a Project
              </a>
              <a href="/portfolio/" className="btn btn-ghost-light">
                View the Work
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why staging works in this city */}
      <section className="section">
        <div className="container-wide max-w-5xl">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="gold-rule" />
              Why staging works in {city.city}
            </p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl text-ink leading-tight">
              Presentation is the difference between a listing buyers{" "}
              <span className="italic text-brass">remember</span> and one they scroll past.
            </h2>
          </Reveal>
          <ul className="mt-10 grid md:grid-cols-3 gap-8">
            {city.whyStaging.map((point, i) => (
              <Reveal key={i} as="li" delay={i * 80}>
                <div className="border-t border-line pt-6">
                  <p className="font-display text-3xl text-brass">{String(i + 1).padStart(2, "0")}</p>
                  <p className="mt-3 text-slate leading-relaxed">{point}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Market context — long-form local market commentary */}
      {city.marketContext && city.marketContext.length > 0 && (
        <section className="section border-t border-line bg-ivory">
          <div className="container-wide max-w-4xl">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="gold-rule" />
                The {city.city} Market
              </p>
              <h2 className="mt-4 font-display text-3xl md:text-4xl text-ink leading-tight">
                Understanding what makes the {city.city}{" "}
                <span className="italic text-brass">market distinct.</span>
              </h2>
            </Reveal>
            <div className="mt-10 space-y-6">
              {city.marketContext.map((p, i) => (
                <Reveal key={i} delay={i * 60}>
                  <p className="text-lg text-slate leading-relaxed">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Local proof */}
      <section className="section border-t border-line">
        <div className="container-wide max-w-5xl">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="gold-rule" />
              Local Work
            </p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl text-ink leading-tight">
              We've worked across the {city.city} market.
            </h2>
            <p className="mt-6 text-lg text-slate leading-relaxed max-w-3xl">{city.localProof}</p>
            <Link href="/portfolio/" className="btn btn-ink mt-8 inline-block">
              See Recent Projects
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Per-service local notes */}
      {city.serviceNotes && city.serviceNotes.length > 0 && (
        <section className="section border-t border-line bg-ivory">
          <div className="container-wide max-w-5xl">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="gold-rule" />
                Our Services in {city.city}
              </p>
              <h2 className="mt-4 font-display text-3xl md:text-4xl text-ink leading-tight">
                How each service fits the{" "}
                <span className="italic text-brass">{city.city} market.</span>
              </h2>
            </Reveal>
            <div className="mt-10 grid md:grid-cols-2 gap-x-10 gap-y-10">
              {city.serviceNotes.map((sn, i) => (
                <Reveal key={sn.name} delay={i * 60}>
                  <div className="border-t border-line pt-6">
                    <h3 className="font-display text-2xl text-ink">{sn.name}</h3>
                    <p className="mt-3 text-slate leading-relaxed">{sn.note}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Neighborhoods served */}
      <section className="section border-t border-line">
        <div className="container-wide max-w-5xl">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="gold-rule" />
              Neighborhoods we serve in {city.city}
            </p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl text-ink leading-tight">
              From the established core to the newest{" "}
              <span className="italic text-brass">builds.</span>
            </h2>
          </Reveal>
          <ul className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
            {city.neighborhoods.map((n) => (
              <li key={n} className="flex items-start gap-3 text-slate">
                <span className="mt-2 inline-block w-5 h-px bg-brassSoft shrink-0" />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Common mistakes sellers in this city make */}
      {city.commonMistakes && city.commonMistakes.length > 0 && (
        <section className="section border-t border-line bg-ivory">
          <div className="container-wide max-w-4xl">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="gold-rule" />
                What we see go wrong
              </p>
              <h2 className="mt-4 font-display text-3xl md:text-4xl text-ink leading-tight">
                Common staging mistakes on {city.city}{" "}
                <span className="italic text-brass">listings.</span>
              </h2>
            </Reveal>
            <div className="mt-10 space-y-10">
              {city.commonMistakes.map((m, i) => (
                <Reveal key={m.title} delay={i * 60}>
                  <div className="border-t border-line pt-6">
                    <h3 className="font-display text-xl md:text-2xl text-ink">{m.title}</h3>
                    <p className="mt-3 text-slate leading-relaxed">{m.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      <section className="section border-t border-line">
        <div className="container-wide max-w-4xl">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="gold-rule" />
              {city.city} Staging FAQs
            </p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl text-ink leading-tight">
              Questions homeowners and agents{" "}
              <span className="italic text-brass">most often ask.</span>
            </h2>
          </Reveal>
          <div className="mt-10 space-y-8">
            {city.faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="border-t border-line pt-6">
                  <h3 className="font-display text-xl md:text-2xl text-ink">{faq.question}</h3>
                  <p className="mt-3 text-slate leading-relaxed">{faq.answer}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-link nearby cities */}
      <section className="section border-t border-line bg-ivory">
        <div className="container-wide max-w-5xl">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="gold-rule" />
              Nearby Service Areas
            </p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl text-ink leading-tight">
              Also serving{" "}
              <span className="italic text-brass">across the region.</span>
            </h2>
          </Reveal>
          <ul className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {nearby.map((n) => (
              <li key={n.slug}>
                <Link
                  href={`/${n.slug}/`}
                  className="block border-t border-line pt-5 group"
                >
                  <p className="text-[0.72rem] uppercase tracking-[0.28em] text-mute">
                    Home Staging
                  </p>
                  <p className="mt-2 font-display text-2xl text-ink group-hover:text-brass transition-colors">
                    {n.city}, CA
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section border-t border-line bg-ink text-ivory">
        <div className="container-wide max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow !text-brassSoft">Begin</p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl text-ivory leading-tight">
              Ready to stage a {city.city} listing?
            </h2>
            <p className="mt-6 text-lg text-ivory/85">
              Tell us about the property, your timeline, and how you'd like buyers to feel when they walk through the front door. We'll be in touch within one business day.
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

// FAQ JSON-LD helper — emitted by each city route alongside CityPage so the
// FAQs can appear in Google's FAQ rich result.
export function buildCityFaqJsonLd(city: City) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: city.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
