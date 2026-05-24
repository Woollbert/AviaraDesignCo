"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import { services } from "@/data/services";
import { site } from "@/data/site";

export default function Services() {
  const [active, setActive] = useState(0);
  const current = services[active];
  const s = site.sections.services;

  return (
    <section id="services" className="section relative overflow-hidden bg-ivory border-y border-line">
      <div aria-hidden="true" className="watermark bottom-[-4rem] -left-12">
        Services
      </div>

      <div className="container-wide relative z-10">
        <Reveal>
          <div className="grid md:grid-cols-12 gap-6 md:items-end">
            <div className="md:col-span-7">
              <p className="eyebrow flex items-center gap-3">
                <span className="gold-rule" />
                {s.eyebrow}
              </p>
              <h2 className="mt-5 font-display text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.05] text-ink max-w-3xl">
                {s.headlineLine1}
                <span className="italic text-brass"> {s.headlineItalic}</span>
              </h2>
            </div>
            <p className="md:col-span-5 text-base md:text-lg text-mute md:text-right max-w-md md:ml-auto">
              {s.intro}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid lg:grid-cols-12 gap-10 items-start">
          <Reveal className="lg:col-span-5">
            <ul className="border-y border-line" data-testid="services-list">
              {services.map((s, i) => (
                <li key={s.slug}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    aria-pressed={active === i}
                    data-active={active === i}
                    data-testid={`service-${s.slug}`}
                    className={[
                      "group w-full flex items-center justify-between gap-6 py-7 text-left transition-colors",
                      i > 0 ? "border-t border-line" : "",
                    ].join(" ")}
                  >
                    <div className="flex items-baseline gap-5">
                      <span className="font-sans text-xs tracking-widest text-mute w-8 shrink-0">
                        0{i + 1}
                      </span>
                      <span
                        className={[
                          "font-display text-2xl md:text-3xl transition-colors",
                          active === i ? "text-brass" : "text-ink group-hover:text-brass",
                        ].join(" ")}
                      >
                        {s.name}
                      </span>
                    </div>
                    <span
                      aria-hidden="true"
                      className={[
                        "h-px transition-all duration-500",
                        active === i ? "w-12 bg-brass" : "w-6 bg-line group-hover:w-10 group-hover:bg-brass",
                      ].join(" ")}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-7">
            <div className="grid sm:grid-cols-5 gap-6 items-stretch" data-testid="service-detail">
              <div className="sm:col-span-3 photo-frame relative aspect-[4/5] sm:aspect-auto bg-linen overflow-hidden min-h-[26rem]">
                <Image
                  src={current.imageUrl}
                  alt={current.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 35vw, (min-width: 640px) 60vw, 100vw"
                  className="object-cover transition-opacity duration-300"
                />
              </div>
              <div className="sm:col-span-2 bg-bone p-7 md:p-8 flex flex-col">
                <p className="eyebrow">{`Service 0${active + 1}`}</p>
                <h3 className="mt-3 font-display text-2xl md:text-3xl text-ink">
                  {current.name}
                </h3>
                <p className="mt-4 text-sm md:text-base text-mute leading-relaxed">
                  {current.description}
                </p>
                <ul className="mt-6 space-y-3 text-sm text-slate">
                  {current.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-2 inline-block w-2 h-px bg-brass shrink-0" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a href={s.inquireCtaHref} className="btn btn-outline mt-8 self-start">
                  {s.inquireCtaLabel}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
