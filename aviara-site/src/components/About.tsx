import Image from "next/image";
import Reveal from "./Reveal";
import { founder } from "@/data/team";
import { stats } from "@/data/services";

export default function About() {
  return (
    <section id="about" className="section relative overflow-hidden bg-bone">
      <div aria-hidden="true" className="watermark top-[-3rem] -left-12">
        Aviara
      </div>

      <div className="container-wide relative z-10 grid lg:grid-cols-12 gap-14 items-center">
        <Reveal className="lg:col-span-6">
          <p className="eyebrow flex items-center gap-3">
            <span className="gold-rule" />
            About the Studio
          </p>
          <h2 className="mt-5 font-display text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.05] text-ink">
            Spaces designed for the way you actually
            <span className="italic text-brass"> live.</span>
          </h2>
          <p className="mt-7 text-lg text-mute leading-relaxed">
            Aviara Design Co. is a boutique home staging and interior design studio,
            family-owned and based in Temecula, California. We believe that staging
            and design are more than aesthetics. They are powerful tools for
            connection, storytelling, and transformation.
          </p>
          <p className="mt-5 text-lg text-mute leading-relaxed">
            Whether we are preparing a luxury listing for market or composing a
            forever home, our work is unified by a single intent: livable luxury that
            feels collected, considered, and quietly elevated.
          </p>

          <ul className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-6" data-testid="stats">
            {stats.map((s) => (
              <li key={s.label} className="text-left">
                <div className="font-display text-4xl md:text-5xl text-ink leading-none">
                  {s.value}
                </div>
                <div className="mt-3 text-[0.68rem] uppercase tracking-widest text-mute">
                  {s.label}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-6">
          <div className="relative">
            <div className="photo-frame photo-frame--dark relative aspect-[4/5] w-full overflow-hidden bg-linen">
              <Image
                src="/images/IMG_9842.jpeg"
                alt="A signature Aviara styled vignette: white pottery vase with deep red blooms"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover animate-kenburns"
              />
            </div>
            <div className="absolute -bottom-8 -left-6 md:-left-12 z-20 bg-ivory p-7 md:p-8 max-w-xs shadow-lift">
              <p className="eyebrow">Founder</p>
              <p className="mt-2 font-display text-2xl text-ink">{founder.name}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-mute">
                {founder.role}
              </p>
              <p className="mt-4 text-sm text-mute leading-relaxed">
                {founder.bio.split(".")[0]}.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
