"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { site } from "@/data/site";
import type { ImagePosition } from "@/data/site";

// Where the photo is anchored when object-cover has to crop it. Portrait
// phone shots on a 16:9 viewport lose ~60% of their height, so the owner
// picks which band survives from the CMS.
const OBJECT_POSITION: Record<ImagePosition, string> = {
  top: "50% 0%",
  upper: "50% 25%",
  center: "50% 50%",
  lower: "50% 75%",
  bottom: "50% 100%",
};

export default function ScrollReveal() {
  const s = site.sections.featured;
  const objectPosition = OBJECT_POSITION[s.imagePosition ?? "center"];
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  // On touch devices we skip the scroll-driven translate+scale on the photo —
  // the compositor work on every frame reads as the image visibly expanding
  // mid-scroll on iOS Safari and is the single biggest scroll-jank source in
  // the homepage. Desktop keeps the full effect.
  const [scrollDriven, setScrollDriven] = useState(true);
  const [textInView, setTextInView] = useState(false);

  useEffect(() => {
    const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setScrollDriven(isDesktop);
    if (!isDesktop) {
      // Use an IntersectionObserver for the headline fade instead of a
      // scroll listener — single fire, no per-frame compositor cost.
      const node = sectionRef.current;
      if (!node) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setTextInView(true);
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.25 }
      );
      io.observe(node);
      return () => io.disconnect();
    }

    let raf = 0;
    const compute = () => {
      const node = sectionRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = rect.height + vh;
      const scrolled = vh - rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const revealPct = Math.round(progress * 100);
  // Headline fades in across the early portion of scroll, stays visible
  const textOpacity = scrollDriven
    ? Math.max(0, Math.min(1, (progress - 0.1) / 0.4))
    : (textInView ? 1 : 0);
  const textShift = (1 - textOpacity) * 24;
  // Desktop: a slow pan through whatever object-cover is cropping away. A
  // portrait phone photo on a 16:9 screen has ~60% of its height hidden;
  // instead of freezing on one band, the crop window drifts from near the
  // top of the photo (as the section arrives) toward the bottom (as it
  // leaves), so the whole frame gets seen. Panning object-position rather
  // than translating the element means an edge can never be exposed, and a
  // landscape photo with nothing hidden simply doesn't move. Zoom stays
  // small so the photo keeps its sharpness.
  const focalY = parseFloat(objectPosition.split(" ")[1]) / 100; // 0 top … 1 bottom
  const PAN = 0.6; // fraction of the hidden area on each side actually travelled
  const panY = scrollDriven
    ? progress < 0.5
      ? focalY - (0.5 - progress) * 2 * focalY * PAN
      : focalY + (progress - 0.5) * 2 * (1 - focalY) * PAN
    : focalY;
  const livePosition = `50% ${(panY * 100).toFixed(2)}%`;
  const photoScale = scrollDriven ? 1.02 + progress * 0.03 : 1.06;

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[640px] w-full overflow-hidden bg-ink"
      aria-label="Featured work"
      data-testid="scroll-reveal"
    >
      <div className="absolute inset-0 will-change-transform">
        <Image
          src={s.image}
          alt={s.imageAlt}
          fill
          sizes="100vw"
          quality={90}
          className="object-cover"
          style={{
            objectPosition: livePosition,
            transform: `scale(${photoScale})`,
            transformOrigin: "center",
          }}
          priority={false}
        />
      </div>

      {/* Layered overlays so the headline always has a dark base, but the photo
          fills the entire viewport and is never cropped/sliced. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(28,24,21,0.62) 0%, rgba(28,24,21,0.18) 30%, rgba(28,24,21,0.22) 60%, rgba(28,24,21,0.68) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 90% at 22% 78%, rgba(28,24,21,0.50) 0%, transparent 70%)",
        }}
      />

      <span
        aria-hidden="true"
        data-testid="scroll-reveal-mask"
        data-reveal-progress={revealPct}
        className="sr-only"
      />

      {/* pb-28 on phones clears the fixed Call/Text bar that overlays the
          bottom ~90px of the viewport there. */}
      <div className="absolute inset-0 container-wide flex flex-col justify-end pb-28 md:pb-24">
        <div
          className="max-w-3xl"
          style={{
            opacity: textOpacity,
            transform: `translate3d(0, ${textShift}px, 0)`,
            transition: "opacity 200ms linear, transform 200ms linear",
          }}
        >
          <p className="eyebrow !text-brassSoft flex items-center gap-3">
            <span className="inline-block w-10 h-px bg-brassSoft" />
            {s.eyebrow}
          </p>
          <h2
            className="mt-5 font-display text-4xl md:text-6xl lg:text-[4.5rem] leading-[1.02] text-ivory"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.55)" }}
          >
            {s.headlineLine1}
            <br />
            <span className="italic font-light text-brassSoft">{s.headlineItalic}</span>
          </h2>
          <p
            className="mt-6 text-base md:text-lg text-ivory max-w-xl leading-relaxed"
            style={{ textShadow: "0 1px 14px rgba(0,0,0,0.6)" }}
          >
            {s.body}
          </p>
        </div>
      </div>
    </section>
  );
}
