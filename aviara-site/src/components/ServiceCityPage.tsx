import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import type { ServiceCityCombo } from "@/data/serviceCities";
import Reveal from "@/components/Reveal";

/*
 * A service × city landing page. The unique localized hook is the
 * `serviceNote.note` paragraph (locally written for each city + service);
 * the rest is shared but tightly scoped to that single combination so the
 * page reads as "Aviara does <service> in <city>" rather than a generic
 * marketing brochure.
 *
 * Pages link back to the parent city hub (/home-staging-<city>/) and the
 * homepage services anchor so Google sees this as a child of the city
 * cluster, not a stray top-level page.
 */
type Props = { combo: ServiceCityCombo };

export default function ServiceCityPage({ combo }: Props) {
  const { service, city, serviceNote } = combo;
  const heroAlt = `${service.name} in ${city.city}, ${city.county}`;
  const cityHubHref = `/${city.slug}/`;

  return (
    <main className="bg-bone">
      <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 bg-ink text-ivory overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src={service.imageUrl}
            alt={heroAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(28,24,21,0.65) 0%, rgba(28,24,21,0.42) 45%, rgba(28,24,21,0.88) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 container-wide">
          <Reveal>
            <Link
              href={cityHubHref}
              className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-widest text-ivory/70 hover:text-brassSoft transition-colors mb-6"
            >
              <span aria-hidden="true">←</span> All staging in {city.city}
            </Link>
            <p className="eyebrow !text-brassSoft flex items-center gap-3">
              <span className="inline-block w-10 h-px bg-brassSoft" />
              {service.name}
            </p>
            <h1 className="mt-5 font-display text-4xl md:text-5xl lg:text-[3.75rem] leading-[1.05] text-ivory max-w-3xl">
              {service.name} in <span className="italic text-brassSoft">{city.city}, CA</span>
            </h1>
            <p className="mt-7 text-lg md:text-xl text-ivory/85 max-w-2xl leading-relaxed">
              {service.short}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="/#contact"
                className="btn btn-ink"
                data-track="cta_click"
                data-track-surface="service_city_hero"
                data-track-service={service.slug}
                data-track-city={city.slug}
              >
                Begin a Project
              </a>
              <a
                href={`tel:${site.phoneTel}`}
                className="btn btn-ghost-light"
                data-track="phone_click"
                data-track-surface="service_city_hero"
                data-track-service={service.slug}
                data-track-city={city.slug}
              >
                {site.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* The locally-written serviceNote — the unique reason this URL exists */}
      <section className="section bg-bone">
        <div className="container-wide max-w-3xl">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="gold-rule" />
              How we work in {city.city}
            </p>
            <p className="mt-6 font-display text-2xl md:text-3xl text-ink leading-[1.3]">
              {serviceNote.note}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Full service description + features list */}
      <section className="section bg-ivory border-y border-line">
        <div className="container-wide grid lg:grid-cols-12 gap-12 items-start">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-3">
              <span className="gold-rule" />
              What's included
            </p>
            <h2 className="mt-5 font-display text-3xl md:text-4xl leading-[1.1] text-ink">
              {service.name} for {city.city} listings &{" "}
              <span className="italic text-brass">homeowners</span>
            </h2>
            <p className="mt-6 text-lg text-mute leading-relaxed">
              {service.description}
            </p>
            <ul className="mt-8 space-y-4 text-base text-slate">
              {service.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-3 inline-block w-3 h-px bg-brass shrink-0" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-5">
            <div className="photo-frame relative aspect-[4/5] w-full overflow-hidden bg-linen">
              <Image
                src={service.imageUrl}
                alt={heroAlt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* City context — neighborhoods + intro, ties the page to the city cluster */}
      <section className="section bg-bone">
        <div className="container-wide max-w-4xl">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="gold-rule" />
              About staging in {city.city}
            </p>
            <p className="mt-6 text-lg text-mute leading-relaxed">{city.intro}</p>
            {city.neighborhoods?.length > 0 && (
              <>
                <p className="mt-10 text-[0.7rem] uppercase tracking-widest text-mute font-medium">
                  Neighborhoods served
                </p>
                <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate">
                  {city.neighborhoods.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </>
            )}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={cityHubHref}
                className="text-sm text-brass hover:text-ink transition-colors underline underline-offset-4 decoration-brass/40 hover:decoration-ink"
              >
                Full {city.city} staging guide →
              </Link>
              <Link
                href="/portfolio/"
                className="text-sm text-brass hover:text-ink transition-colors underline underline-offset-4 decoration-brass/40 hover:decoration-ink"
              >
                Recent staging work →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section relative bg-ink text-ivory overflow-hidden">
        <div className="container-wide max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow !text-brassSoft flex items-center justify-center gap-3">
              <span className="inline-block w-10 h-px bg-brassSoft" />
              Begin
            </p>
            <h2 className="mt-5 font-display text-4xl md:text-5xl text-ivory leading-[1.05]">
              Bring {service.name.toLowerCase()} to your{" "}
              <span className="italic text-brassSoft">{city.city}</span> listing
            </h2>
            <p className="mt-6 text-lg text-ivory/85">
              Tell us about the property, the timeline, and how you want buyers to feel when they walk in. We respond within one business day.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="/#contact"
                className="btn btn-ink"
                data-track="cta_click"
                data-track-surface="service_city_footer"
                data-track-service={service.slug}
                data-track-city={city.slug}
              >
                Begin a Project
              </a>
              <a
                href={`tel:${site.phoneTel}`}
                className="btn btn-ghost-light"
                data-track="phone_click"
                data-track-surface="service_city_footer"
                data-track-service={service.slug}
                data-track-city={city.slug}
              >
                {site.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
