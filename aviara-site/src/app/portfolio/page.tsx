import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/portfolio";
import { site } from "@/data/site";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Recent home staging and interior design projects from Aviara Design Co. across Temecula, San Diego, Orange County, and the Inland Empire.",
};

const CATEGORIES = ["All", "Vacant Staging", "Occupied Staging", "Interior Design"] as const;

export default function PortfolioIndexPage() {
  // Note: filter UI is server-rendered as anchor links targeting hash fragments.
  // For a true interactive filter, this could become a client component — but
  // for SEO + simplicity we render every project unfiltered and let users scroll.
  return (
    <main className="bg-bone">
      {/* Page header — same visual language as homepage sections */}
      <section className="section relative overflow-hidden bg-ink text-ivory">
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.25]">
          <Image
            src={projects[0]?.coverImage ?? "/images/A7405914.jpeg"}
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
              {site.sections.portfolio.eyebrow}
            </p>
            <h1 className="mt-5 font-display text-4xl md:text-5xl lg:text-[3.75rem] leading-[1.05] text-ivory">
              Every home, every install
              <span className="italic text-brassSoft"> intentionally curated.</span>
            </h1>
            <p className="mt-7 text-lg md:text-xl text-ivory/85 max-w-2xl leading-relaxed">
              {projects.length} {projects.length === 1 ? "project" : "projects"} across
              vacant staging, occupied staging, and full-service interior design.
              Browse the work or filter by category below.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Category quick-links — anchor scroll to grouped sections */}
      <nav
        aria-label="Filter portfolio by category"
        className="sticky top-0 z-30 bg-bone border-b border-line"
      >
        <div className="container-wide flex flex-wrap items-center gap-6 py-4 text-[0.7rem] uppercase tracking-widest">
          {CATEGORIES.map((cat) => (
            <a
              key={cat}
              href={cat === "All" ? "#all" : `#${slugify(cat)}`}
              className="text-mute hover:text-brass transition-colors"
            >
              {cat}
            </a>
          ))}
        </div>
      </nav>

      {/* Full grid (all projects) */}
      <section id="all" className="section">
        <div className="container-wide">
          <ProjectGrid projects={projects} />
        </div>
      </section>

      {/* Per-category sections */}
      {(["Vacant Staging", "Occupied Staging", "Interior Design"] as const).map((cat) => {
        const inCat = projects.filter((p) => p.category === cat);
        if (inCat.length === 0) return null;
        return (
          <section
            key={cat}
            id={slugify(cat)}
            className="section border-t border-line"
            style={{ background: cat === "Interior Design" ? "var(--color-ivory)" : "var(--color-bone)" }}
          >
            <div className="container-wide">
              <Reveal>
                <p className="eyebrow flex items-center gap-3">
                  <span className="gold-rule" />
                  {cat}
                </p>
                <h2 className="mt-4 font-display text-3xl md:text-4xl text-ink">
                  {cat} — {inCat.length} {inCat.length === 1 ? "project" : "projects"}
                </h2>
              </Reveal>
              <div className="mt-10">
                <ProjectGrid projects={inCat} />
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-");
}

function ProjectGrid({ projects }: { projects: typeof import("@/data/portfolio").projects }) {
  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" data-testid="portfolio-grid">
      {projects.map((p, i) => (
        <Reveal key={p.slug} as="li" delay={i * 80}>
          <Link
            href={`/portfolio/${p.slug}/`}
            className="group block"
            aria-label={`View ${p.title} project`}
            data-testid={`project-card-${p.slug}`}
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
                className="absolute inset-0 z-10"
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
                  {p.category} · {p.photos.length} photos
                </p>
                <h3 className="mt-1.5 font-display text-xl md:text-2xl text-ivory">
                  {p.title}
                </h3>
                <p className="mt-1 text-xs text-ivory/90">{p.location}</p>
              </div>
            </div>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
