import Image from "next/image";
import Reveal from "./Reveal";
import { process, valueProps } from "@/data/process";

export default function Process() {
  return (
    <section id="process" className="section relative bg-ink text-ivory overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.22]">
        <Image
          src="/images/A7405959.jpeg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ mixBlendMode: "luminosity" }}
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(28,24,21,0.85) 0%, rgba(28,24,21,0.94) 100%)",
        }}
      />
      <div aria-hidden="true" className="watermark watermark--light top-1/2 -translate-y-1/2 -left-12">
        Process
      </div>

      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow !text-brassSoft flex items-center gap-3">
              <span className="inline-block w-10 h-px bg-brassSoft" />
              The Process
            </p>
            <h2 className="mt-5 font-display text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.05] text-ivory">
              Calm, considered,
              <span className="italic text-brassSoft"> on schedule.</span>
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-5">
            <p className="text-base md:text-lg text-ivory/75 leading-relaxed">
              From the first walkthrough to the final styled vignette, every
              project moves through the same four-step rhythm, designed to
              protect your time and elevate your home.
            </p>
          </Reveal>
        </div>

        <ol className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8" data-testid="process-list">
          {process.map((step, i) => (
            <Reveal key={step.number} as="li" delay={i * 100}>
              <div className="flex flex-col h-full pt-7 border-t border-ivory/20">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-5xl text-brassSoft">{step.number}</span>
                  <span className="text-[0.65rem] uppercase tracking-widest text-ivory/65">
                    Step
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl text-ivory">{step.title}</h3>
                <p className="mt-3 text-sm text-ivory/85 leading-relaxed">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <div className="mt-24 grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 pt-16 border-t border-ivory/15">
          {valueProps.map((v, i) => (
            <Reveal key={v.title} delay={i * 80}>
              <div className="flex items-baseline gap-3">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-brassSoft" aria-hidden="true" />
                <h4 className="font-display text-xl text-ivory">{v.title}</h4>
              </div>
              <p className="mt-3 text-sm text-ivory/85 leading-relaxed pl-5">{v.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
