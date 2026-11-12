import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { site } from "@/data/site";
import { process as processSteps } from "@/data/process";
import {
  services,
  findServiceByUrlSlug,
  serviceUrlSlug,
  servicePath,
  type Service,
} from "@/data/services";
import { serviceCityCombos } from "@/data/serviceCities";
import { groupCitiesByRegion } from "@/data/serviceAreas";
import { projectsForService } from "@/data/projectLinks";
import { stripBrand } from "@/lib/seo";

/*
 * One page per service: /services/vacant-home-staging/ and so on.
 *
 * These are the pages for people searching for the service itself ("vacant
 * home staging", "occupied staging near me") rather than a city. They also
 * act as the hub for the service x city pages: each one lists every city
 * where that service has its own local page, which gives those pages a
 * second way to be found besides their city hub.
 *
 * Everything on the page is CMS content. The words come from the service's
 * entry in services.json ("Services" in /admin), the steps from "Process &
 * Values", the example projects from the portfolio (matched by Category),
 * and the city list from the city pages.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  return services.map((s) => ({ slug: serviceUrlSlug(s) }));
}

function pageTitle(service: Service): string {
  const raw = service.metaTitle?.trim() || `${service.name} in ${site.address.city} & Southern California`;
  return stripBrand(raw, site.name);
}

function pageDescription(service: Service): string {
  return service.metaDescription?.trim() || service.description;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = findServiceByUrlSlug(slug);
  if (!service) return { title: "Service not found" };
  const title = pageTitle(service);
  const description = pageDescription(service);
  return {
    title,
    description,
    alternates: { canonical: servicePath(service) },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: servicePath(service),
      images: [{ url: service.imageUrl, alt: service.imageAlt }],
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = findServiceByUrlSlug(slug);
  if (!service) notFound();

  const baseUrl = site.url.replace(/\/$/, "");
  const url = `${baseUrl}${servicePath(service)}`;
  const intro = service.pageIntro?.length ? service.pageIntro : [service.description];
  const idealFor = service.idealFor ?? [];
  const faqs = service.faqs ?? [];
  const examples = projectsForService(service);
  // The steps in "Process & Values" are written about staging a listing
  // ("target buyer", "market-ready"), so they only appear on staging services.
  const showProcess = /staging/i.test(service.name) && processSteps.length > 0;

  // Cities where this service has its own local page, grouped the same way
  // as /service-areas/ so the two pages read consistently.
  const combosByCity = new Map(
    serviceCityCombos
      .filter((c) => c.service.slug === service.slug)
      .map((c) => [c.city.slug, c] as const),
  );
  const regions = groupCitiesByRegion()
    .map((r) => ({ ...r, cities: r.cities.filter((c) => combosByCity.has(c.slug)) }))
    .filter((r) => r.cities.length > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.name,
        description: pageDescription(service),
        url,
        image: `${baseUrl}${service.imageUrl}`,
        serviceType: /interior design/i.test(service.name) ? "Interior Design" : "Home Staging",
        provider: { "@id": `${baseUrl}/#business` },
        areaServed: site.serviceAreas.map((area) => ({ "@type": "Place", name: area })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
          { "@type": "ListItem", position: 2, name: service.name, item: url },
        ],
      },
      ...(faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <div className="bg-bone">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 bg-ink text-ivory overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src={service.imageUrl}
            alt=""
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
              href="/#services"
              className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-widest text-ivory/70 hover:text-brassSoft transition-colors mb-6"
            >
              <span aria-hidden="true">←</span> All services
            </Link>
            <p className="eyebrow !text-brassSoft flex items-center gap-3">
              <span className="inline-block w-10 h-px bg-brassSoft" />
              Based in {site.address.city} · Serving Southern California
            </p>
            <h1 className="mt-5 font-display text-4xl md:text-5xl lg:text-[3.75rem] leading-[1.05] text-ivory max-w-3xl">
              {service.name}
            </h1>
            <p className="mt-7 text-lg md:text-xl text-ivory/85 max-w-2xl leading-relaxed">
              {service.short}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="/#contact"
                className="btn btn-ink"
                data-track="cta_click"
                data-track-surface="service_hero"
                data-track-service={service.slug}
              >
                Begin a Project
              </a>
              <a
                href={`tel:${site.phoneTel}`}
                className="btn btn-ghost-light"
                data-track="phone_click"
                data-track-surface="service_hero"
                data-track-service={service.slug}
              >
                {site.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Overview + what's included */}
      <section className="section">
        <div className="container-wide grid lg:grid-cols-12 gap-12 items-start">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-3">
              <span className="gold-rule" />
              The service
            </p>
            <h2 className="mt-5 font-display text-3xl md:text-4xl leading-[1.1] text-ink">
              What {service.name.toLowerCase()}{" "}
              <span className="italic text-brass">includes.</span>
            </h2>
            <div className="mt-6 space-y-5">
              {intro.map((p, i) => (
                <p key={i} className="text-lg text-slate leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
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
                alt={service.imageAlt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Who it's for */}
      {idealFor.length > 0 && (
        <section className="section border-t border-line bg-ivory">
          <div className="container-wide max-w-5xl">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="gold-rule" />
                A good fit when
              </p>
              <h2 className="mt-4 font-display text-3xl md:text-4xl text-ink leading-tight">
                Who {service.name.toLowerCase()} is{" "}
                <span className="italic text-brass">right for.</span>
              </h2>
            </Reveal>
            <ul className="mt-10 grid sm:grid-cols-2 gap-x-10 gap-y-6">
              {idealFor.map((item, i) => (
                <Reveal key={item} as="li" delay={i * 60}>
                  <div className="border-t border-line pt-5 text-lg text-slate leading-relaxed">
                    {item}
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Process */}
      {showProcess && (
        <section className="section border-t border-line">
          <div className="container-wide">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="gold-rule" />
                How it works
              </p>
              <h2 className="mt-4 font-display text-3xl md:text-4xl text-ink leading-tight max-w-3xl">
                From first walkthrough to the final{" "}
                <span className="italic text-brass">styled room.</span>
              </h2>
            </Reveal>
            <ol className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, i) => (
                <Reveal key={step.number} as="li" delay={i * 80}>
                  <div className="border-t border-line pt-6 h-full">
                    <p className="font-display text-3xl text-brass">{step.number}</p>
                    <h3 className="mt-3 font-display text-2xl text-ink">{step.title}</h3>
                    <p className="mt-3 text-slate leading-relaxed">{step.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Example projects from the portfolio */}
      {examples.length > 0 && (
        <section className="section border-t border-line bg-ivory" data-testid="service-projects">
          <div className="container-wide">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="gold-rule" />
                Recent work
              </p>
              <h2 className="mt-4 font-display text-3xl md:text-4xl text-ink leading-tight">
                {service.name} projects from our{" "}
                <span className="italic text-brass">portfolio.</span>
              </h2>
            </Reveal>
            <ul className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {examples.slice(0, 6).map((p, i) => (
                <Reveal key={p.slug} as="li" delay={i * 80}>
                  <Link href={`/portfolio/${p.slug}/`} className="group block">
                    <div className="photo-frame relative aspect-[4/3] overflow-hidden bg-linen">
                      <Image
                        src={p.coverImage}
                        alt={p.coverImageAlt}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                      />
                    </div>
                    <h3 className="mt-4 font-display text-2xl text-ink group-hover:text-brass transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm text-mute">{p.location}</p>
                  </Link>
                </Reveal>
              ))}
            </ul>
            <Reveal>
              <Link href="/portfolio/" className="btn btn-outline mt-10 inline-block">
                View the full portfolio
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="section border-t border-line">
          <div className="container-wide max-w-4xl">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="gold-rule" />
                {service.name} FAQs
              </p>
              <h2 className="mt-4 font-display text-3xl md:text-4xl text-ink leading-tight">
                Questions we hear{" "}
                <span className="italic text-brass">most often.</span>
              </h2>
            </Reveal>
            <div className="mt-10 space-y-8">
              {faqs.map((faq, i) => (
                <Reveal key={faq.question} delay={i * 60}>
                  <div className="border-t border-line pt-6">
                    <h3 className="font-display text-xl md:text-2xl text-ink">{faq.question}</h3>
                    <p className="mt-3 text-slate leading-relaxed">{faq.answer}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Where we offer it: links to every service x city page */}
      {regions.length > 0 && (
        <section className="section border-t border-line bg-ivory" data-testid="service-cities">
          <div className="container-wide max-w-6xl">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="gold-rule" />
                Where we work
              </p>
              <h2 className="mt-4 font-display text-3xl md:text-4xl text-ink leading-tight">
                {service.name} across{" "}
                <span className="italic text-brass">Southern California.</span>
              </h2>
            </Reveal>
            <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
              {regions.map((region) => (
                <Reveal key={region.name}>
                  <div className="border-t border-line pt-5">
                    <h3 className="text-[0.72rem] uppercase tracking-[0.28em] text-mute">
                      {region.name}
                    </h3>
                    <ul className="mt-4 space-y-2">
                      {region.cities.map((city) => (
                        <li key={city.slug}>
                          <Link
                            href={`/${combosByCity.get(city.slug)!.slug}/`}
                            className="text-base text-ink hover:text-brass transition-colors"
                          >
                            {service.name} in {city.city}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <Link
                href="/service-areas/"
                className="mt-10 inline-block text-sm text-brass hover:text-ink transition-colors underline underline-offset-4 decoration-brass/40 hover:decoration-ink"
              >
                View all service areas →
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* Other services */}
      {services.length > 1 && (
        <section className="section border-t border-line">
          <div className="container-wide max-w-5xl">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="gold-rule" />
                Also from Aviara
              </p>
            </Reveal>
            <ul className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services
                .filter((s) => s.slug !== service.slug)
                .map((s) => (
                  <li key={s.slug}>
                    <Link href={servicePath(s)} className="block border-t border-line pt-5 group">
                      <p className="font-display text-2xl text-ink group-hover:text-brass transition-colors">
                        {s.name}
                      </p>
                      <p className="mt-2 text-sm text-slate leading-relaxed">{s.short}</p>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </section>
      )}

      {/* Closing CTA */}
      <section className="section border-t border-line bg-ink text-ivory">
        <div className="container-wide max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow !text-brassSoft">Begin</p>
            <h2 className="mt-4 font-display text-3xl md:text-4xl text-ivory leading-tight">
              Tell us about your{" "}
              <span className="italic text-brassSoft">project.</span>
            </h2>
            <p className="mt-6 text-lg text-ivory/85">
              Share the property, your timeline, and what you want the space to do. We respond within one business day.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="/#contact"
                className="btn btn-ink"
                data-track="cta_click"
                data-track-surface="service_footer"
                data-track-service={service.slug}
              >
                Begin a Project
              </a>
              <a
                href={`tel:${site.phoneTel}`}
                className="btn btn-ghost-light"
                data-track="phone_click"
                data-track-surface="service_footer"
                data-track-service={service.slug}
              >
                {site.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
