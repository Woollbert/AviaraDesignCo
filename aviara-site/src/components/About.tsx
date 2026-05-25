import Image from "next/image";
import Reveal from "./Reveal";
import { founder } from "@/data/team";
import { stats } from "@/data/services";
import { site } from "@/data/site";

export default function About() {
  const s = site.sections.about;
  return (
    <section id="about" className="section relative overflow-hidden bg-bone">
      <div aria-hidden="true" className="watermark top-[-1rem] -left-4 md:top-[-3rem] md:-left-12">
        Aviara
      </div>

      <div className="container-wide relative z-10 grid lg:grid-cols-12 gap-14 items-center">
        <Reveal className="lg:col-span-6">
          <p className="eyebrow flex items-center gap-3">
            <span className="gold-rule" />
            {s.eyebrow}
          </p>
          <h2 className="mt-5 font-display text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.05] text-ink">
            {s.headlineLine1}
            <span className="italic text-brass"> {s.headlineItalic}</span>
          </h2>
          {s.bodyParagraphs.map((para, i) => (
            <p
              key={i}
              className={`${i === 0 ? "mt-7" : "mt-5"} text-lg text-mute leading-relaxed`}
            >
              {para}
            </p>
          ))}

          <ul className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-6" data-testid="stats">
            {stats.map((stat) => (
              <li key={stat.label} className="text-left">
                <div className="font-display text-4xl md:text-5xl text-ink leading-none">
                  {stat.value}
                </div>
                <div className="mt-3 text-[0.68rem] uppercase tracking-widest text-mute">
                  {stat.label}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-6">
          <div className="relative">
            <div className="photo-frame photo-frame--dark relative aspect-[4/5] w-full overflow-hidden bg-linen">
              <Image
                src={s.image}
                alt={s.imageAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover animate-kenburns"
              />
            </div>
            <div className="absolute -bottom-8 -left-6 md:-left-12 z-20 bg-ivory p-7 md:p-8 max-w-xs shadow-lift">
              <p className="eyebrow">{s.founderLabel}</p>
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
