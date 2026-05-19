import Image from "next/image";
import { site } from "@/data/site";

export default function Hero() {
  const hero = site.hero;
  return (
    <section
      id="top"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink text-ivory"
      aria-label="Welcome to Aviara Design Co."
    >
      <div className="absolute inset-0 z-0" data-testid="hero-poster">
        <Image
          src={hero.bgImageUrl}
          alt={hero.bgImageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover scale-[1.02] animate-kenburns"
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(28,24,21,0.78) 0%, rgba(28,24,21,0.55) 28%, rgba(28,24,21,0.42) 50%, rgba(28,24,21,0.78) 100%)",
          }}
        />
        {/* Left-anchored vignette so the headline always sits on a darker base */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 80% at 18% 55%, rgba(28,24,21,0.55) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 container-wide h-full flex flex-col">
        <div className="flex-1 flex flex-col justify-center pt-24 max-w-3xl">
          <p
            className="eyebrow !text-ivory flex items-center gap-3"
            data-testid="hero-eyebrow"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.45)" }}
          >
            <span className="inline-block w-10 h-px bg-ivory" />
            {site.licensing}
          </p>
          <h1
            className="mt-7 font-display text-[clamp(2.75rem,7vw,5.75rem)] leading-[0.98] tracking-tight text-ivory"
            data-testid="hero-headline"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.45)" }}
          >
            {hero.headlineLine1}
            <br />
            <span className="italic font-light text-brassSoft">{hero.headlineLine2}</span>
          </h1>
          <p
            className="mt-7 text-lg md:text-xl max-w-2xl text-ivory leading-relaxed"
            data-testid="hero-subhead"
            style={{ textShadow: "0 1px 14px rgba(0,0,0,0.55)" }}
          >
            {hero.subhead}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={hero.ctaPrimaryHref}
              className="btn bg-ivory text-ink hover:bg-brassSoft hover:text-ink border border-ivory"
              data-testid="hero-cta-primary"
            >
              {hero.ctaPrimaryLabel}
            </a>
            <a href={hero.ctaSecondaryHref} className="btn btn-ghost-light" data-testid="hero-cta-secondary">
              {hero.ctaSecondaryLabel}
            </a>
          </div>
        </div>

        <div className="pb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 border-t border-ivory/15 pt-8">
          <div className="flex items-center gap-3 text-[0.7rem] uppercase tracking-widest text-ivory/70">
            <span className="inline-block w-8 h-px bg-brassSoft" />
            {hero.footerLabel}
          </div>
          <a
            href="#about"
            className="group inline-flex items-center gap-3 text-[0.7rem] uppercase tracking-widest text-ivory/80 hover:text-brassSoft transition-colors"
            aria-label="Scroll to about section"
            data-testid="hero-scroll"
          >
            Scroll
            <span className="relative inline-block w-12 h-px bg-ivory/40 overflow-hidden">
              <span className="absolute inset-y-0 left-0 w-1/3 bg-brassSoft animate-scrollline" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
