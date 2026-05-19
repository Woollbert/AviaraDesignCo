"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import { testimonials } from "@/data/portfolio";
import { site } from "@/data/site";

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const t = testimonials[active];
  const s = site.sections.testimonials;

  return (
    <section
      id="testimonials"
      className="section relative bg-bone overflow-hidden"
    >
      <div aria-hidden="true" className="watermark top-1/2 -translate-y-1/2 -right-12">
        Testimonials
      </div>

      <div className="container-wide relative z-10 grid lg:grid-cols-12 gap-12 items-center">
        <Reveal className="lg:col-span-5">
          <div className="photo-frame photo-frame--dark relative aspect-[4/5] overflow-hidden bg-linen">
            <Image
              src={s.image}
              alt={s.imageAlt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover animate-kenburns"
            />
          </div>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-7">
          <p className="eyebrow flex items-center gap-3">
            <span className="gold-rule" /> {s.eyebrow}
          </p>
          <h2 className="mt-5 font-display text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.05] text-ink">
            {s.headlineLine1}
            <span className="italic text-brass"> {s.headlineItalic}</span>
          </h2>

          <blockquote
            className="mt-10 font-display text-2xl md:text-3xl lg:text-[2.25rem] leading-snug text-slate"
            data-testid="testimonial-quote"
          >
            <span className="text-brass mr-2">"</span>
            {t.quote}
            <span className="text-brass ml-1">"</span>
          </blockquote>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-display text-lg text-ink" data-testid="testimonial-author">
                {t.author}
              </p>
              <p className="text-xs uppercase tracking-widest text-mute mt-1">{t.role}</p>
            </div>

            {testimonials.length > 1 && (
              <div
                className="flex items-center gap-3"
                role="tablist"
                aria-label="Choose testimonial"
                data-testid="testimonial-controls"
              >
                {testimonials.map((tt, i) => (
                  <button
                    key={tt.author}
                    type="button"
                    role="tab"
                    aria-selected={active === i}
                    aria-label={`Show testimonial from ${tt.author}`}
                    onClick={() => setActive(i)}
                    data-active={active === i}
                    data-testid={`testimonial-dot-${i}`}
                    className={[
                      "h-px transition-all duration-500",
                      active === i ? "w-12 bg-brass" : "w-6 bg-line hover:w-10 hover:bg-brass",
                    ].join(" ")}
                  />
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
