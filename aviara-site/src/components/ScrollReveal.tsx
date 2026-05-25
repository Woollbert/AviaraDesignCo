"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function ScrollReveal() {
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
  // Subtle parallax: photo drifts slightly to add depth, never leaves frame
  const parallaxY = scrollDriven ? (progress - 0.5) * 70 : 0;
  const photoScale = scrollDriven ? 1.08 + progress * 0.05 : 1.1;

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[640px] w-full overflow-hidden bg-ink"
      aria-label="Featured work"
      data-testid="scroll-reveal"
    >
      <div className="absolute inset-0 will-change-transform">
        <Image
          src="/images/A7405944.jpeg"
          alt="A signature Aviara staged interior: open living and dining with mountain views"
          fill
          sizes="100vw"
          className="object-cover"
          style={{
            transform: `translate3d(0, ${parallaxY}px, 0) scale(${photoScale})`,
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

      <div className="absolute inset-0 container-wide flex flex-col justify-end pb-16 md:pb-24">
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
            Featured Work
          </p>
          <h2
            className="mt-5 font-display text-4xl md:text-6xl lg:text-[4.5rem] leading-[1.02] text-ivory"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.55)" }}
          >
            Where the open house
            <br />
            <span className="italic font-light text-brassSoft">becomes a feeling.</span>
          </h2>
          <p
            className="mt-6 text-base md:text-lg text-ivory max-w-xl leading-relaxed"
            style={{ textShadow: "0 1px 14px rgba(0,0,0,0.6)" }}
          >
            Every install is composed for the camera and for the person who walks
            in next. Light. Texture. Air. Restraint.
          </p>
        </div>
      </div>
    </section>
  );
}
