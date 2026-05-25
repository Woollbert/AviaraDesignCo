"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import { services } from "@/data/services";
import { site } from "@/data/site";

export default function Services() {
  const [active, setActive] = useState(0);
  const current = services[active];
  const s = site.sections.services;

  // Hover-intent: only commit a change after the cursor has lingered, so
  // sweeping the cursor across the list doesn't ping-pong the detail panel.
  const hoverTimer = useRef<number | null>(null);
  useEffect(() => () => {
    if (hoverTimer.current !== null) window.clearTimeout(hoverTimer.current);
  }, []);
  function scheduleActive(i: number) {
    if (hoverTimer.current !== null) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => {
      setActive(i);
      hoverTimer.current = null;
    }, 120);
  }
  function cancelSchedule() {
    if (hoverTimer.current !== null) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  }
  function commitActive(i: number) {
    cancelSchedule();
    setActive(i);
  }

  return (
    <section id="services" className="section relative overflow-hidden bg-ivory border-y border-line">
      <div aria-hidden="true" className="watermark bottom-[-1rem] -left-4 md:bottom-[-4rem] md:-left-12">
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
              {services.map((svc, i) => {
                const expanded = active === i;
                return (
                  <li key={svc.slug}>
                    <button
                      type="button"
                      onClick={() => commitActive(i)}
                      onMouseEnter={() => scheduleActive(i)}
                      onMouseLeave={cancelSchedule}
                      onFocus={() => commitActive(i)}
                      aria-pressed={expanded}
                      aria-expanded={expanded}
                      aria-controls={`service-detail-${svc.slug}`}
                      data-active={expanded}
                      data-testid={`service-${svc.slug}`}
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
                            expanded ? "text-brass" : "text-ink group-hover:text-brass",
                          ].join(" ")}
                        >
                          {svc.name}
                        </span>
                      </div>
                      <span
                        aria-hidden="true"
                        className={[
                          "h-px transition-all duration-500 hidden sm:inline-block",
                          expanded ? "w-12 bg-brass" : "w-6 bg-line group-hover:w-10 group-hover:bg-brass",
                        ].join(" ")}
                      />
                      {/* Mobile chevron — visual hint that the row expands. */}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className={[
                          "sm:hidden w-4 h-4 shrink-0 transition-transform duration-300",
                          expanded ? "rotate-180 text-brass" : "text-mute",
                        ].join(" ")}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {/* Mobile-only inline detail. Collapsed: grid-rows-[0fr];
                        expanded: grid-rows-[1fr]. The inner `<div>` is the
                        animated row, with overflow:hidden so its content is
                        clipped while the row resizes. This pattern avoids
                        measuring max-height manually. */}
                    <div
                      id={`service-detail-${svc.slug}`}
                      className={[
                        "lg:hidden grid transition-[grid-template-rows] duration-400 ease-out",
                        expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      ].join(" ")}
                    >
                      <div className="overflow-hidden">
                        <div className="pb-7 pt-1">
                          <div className="photo-frame relative aspect-[4/5] sm:aspect-[3/2] bg-linen overflow-hidden">
                            <Image
                              src={svc.imageUrl}
                              alt={svc.imageAlt}
                              fill
                              sizes="(min-width: 640px) 80vw, 100vw"
                              className="object-cover"
                            />
                          </div>
                          <p className="mt-5 text-sm md:text-base text-mute leading-relaxed">
                            {svc.description}
                          </p>
                          <ul className="mt-5 space-y-3 text-sm text-slate">
                            {svc.features.map((f) => (
                              <li key={f} className="flex items-start gap-3">
                                <span className="mt-2 inline-block w-2 h-px bg-brass shrink-0" aria-hidden="true" />
                                {f}
                              </li>
                            ))}
                          </ul>
                          <a href={s.inquireCtaHref} className="btn btn-outline mt-6 self-start">
                            {s.inquireCtaLabel}
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          {/* Desktop side detail panel — hidden on mobile, where each row
              expands inline above. */}
          <Reveal delay={100} className="hidden lg:block lg:col-span-7">
            {/* Lock the grid row to a fixed height at lg+ so switching between
                services (varying description length, varying image ratios)
                doesn't reflow the page. Both columns inherit the row height
                via items-stretch + h-full. INQUIRE pins to the bottom via
                mt-auto so trailing whitespace lives between the features list
                and the button, never below it. */}
            <div className="grid sm:grid-cols-5 gap-6 items-stretch lg:h-[34rem]" data-testid="service-detail">
              <div className="sm:col-span-3 photo-frame relative aspect-[4/5] sm:aspect-auto bg-linen overflow-hidden h-full">
                {/* Render every service image stacked and crossfade via opacity
                    so clicking a different service doesn't flash blank while
                    next/image loads the new src. One-time first-paint cost,
                    instant tab switches after. */}
                {services.map((svc, i) => (
                  <Image
                    key={svc.slug}
                    src={svc.imageUrl}
                    alt={svc.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 35vw, (min-width: 640px) 60vw, 100vw"
                    className={[
                      "object-cover transition-opacity duration-300",
                      i === active ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                    priority={i === 0}
                  />
                ))}
              </div>
              <div className="sm:col-span-2 bg-bone p-7 md:p-8 flex flex-col h-full">
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
                <a href={s.inquireCtaHref} className="btn btn-outline mt-auto self-start">
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
