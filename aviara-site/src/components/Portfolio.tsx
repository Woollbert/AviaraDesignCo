import Image from "next/image";
import Reveal from "./Reveal";
import { projects } from "@/data/portfolio";
import { site } from "@/data/site";

export default function Portfolio() {
  const s = site.sections.portfolio;
  return (
    <section id="portfolio" className="section relative bg-bone overflow-hidden">
      <div aria-hidden="true" className="watermark bottom-[-1rem] -right-4 md:bottom-[-6rem] md:-right-12">
        Portfolio
      </div>

      <div className="container-wide relative z-10">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow flex items-center gap-3">
                <span className="gold-rule" />
                {s.eyebrow}
              </p>
              <h2 className="mt-5 font-display text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.05] text-ink">
                {s.headlineLine1}
                <span className="italic text-brass"> {s.headlineItalic}</span>
              </h2>
            </div>

            <p className="md:max-w-xs md:text-right text-mute text-base">
              {s.intro}
            </p>
          </div>
        </Reveal>

        <ul
          className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          data-testid="portfolio-grid"
        >
          {projects.slice(0, 3).map((p, i) => (
            <Reveal key={p.slug} as="li" delay={i * 100}>
              <a
                href={`/portfolio/${p.slug}/`}
                className="group block"
                aria-label={`${p.title}: view full project`}
                data-testid={`project-${p.slug}`}
              >
                <div className="photo-frame relative aspect-[4/5] overflow-hidden bg-linen">
                  <Image
                    src={p.coverImage}
                    alt={p.coverImageAlt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 z-10 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(28,24,21,0) 0%, rgba(28,24,21,0) 35%, rgba(28,24,21,0.55) 65%, rgba(28,24,21,0.92) 100%)",
                    }}
                  />
                  <div
                    className="absolute bottom-6 left-6 right-6 z-20 text-ivory"
                    style={{ textShadow: "0 1px 12px rgba(0,0,0,0.55)" }}
                  >
                    <p
                      className="text-[0.66rem] uppercase tracking-widest font-medium text-brassSoft"
                      style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
                    >
                      {p.category}
                    </p>
                    <h3 className="mt-1.5 font-display text-xl md:text-2xl text-ivory">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-xs text-ivory/90">{p.location}</p>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </ul>

        <Reveal>
          <div className="mt-14 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-5 text-center">
            <a
              href="/portfolio/"
              className="btn btn-ink"
              data-testid="portfolio-view-all"
            >
              View Full Portfolio
            </a>
            <p className="text-sm text-mute">
              Browse every staged home with full photo galleries.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
