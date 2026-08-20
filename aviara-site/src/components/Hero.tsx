"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { track } from "@/lib/track";

// The clip is a vertical walkthrough, so it fills a phone almost exactly. On
// wider screens `cover` keeps only a horizontal band of it — anchoring that
// band at 40% down lands it on the fireplace, chairs, and sofa rather than
// the ceiling or the floor, which reads as a deliberate panoramic crop.
//
// No CSS scale here on purpose. `kenburns` opens at scale(1.05), and while
// the poster is animating it needs that headroom — but scaling the video up
// 5% means the compositor upscales every decoded frame by 5%, throwing away
// resolution we paid bitrate for. So the Ken Burns scale is applied only on
// the still-only path below, and whenever the video takes over both layers
// sit at 1.0. Poster and video must always agree, or swapping one for the
// other pops the image visibly.
const FRAME_CLASS =
  "object-cover [object-position:50%_50%] md:[object-position:50%_40%]";

// How the intro plays out: reveal the paused first frame (a crossfade between
// two identical stills, so nothing appears to happen), let the page settle,
// then ease the pan up to speed. Numbers in ms.
const FADE_MS = 400;
const HOLD_MS = 500;
const RAMP_MS = 900;
const RAMP_FROM = 0.35;
// Cap on how long we'll wait for the clip to buffer before panning anyway.
const BUFFER_WAIT_MS = 4000;

export default function Hero() {
  const hero = site.hero;
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Mount the video only after we've checked the client can sensibly play it,
  // so the initial HTML carries just the poster still and nothing competes
  // with the LCP image for bandwidth.
  const [showVideo, setShowVideo] = useState(false);
  // Fade the video in only once frames are actually on screen. The poster is
  // frame one of the clip, so the handoff is invisible; if autoplay is refused
  // (iOS Low Power Mode, data saver) the still simply stays.
  const [videoReady, setVideoReady] = useState(false);

  // Lock the Hero height to the viewport height measured on first paint, then
  // never update it. iOS Safari nominally honors `100svh` (the static "small
  // viewport" unit), but the URL bar retraction on first scroll still causes
  // an ~80–100px viewport reflow that visibly resizes the section and the
  // object-cover image inside it ("stretching"). Pinning the height to a real
  // pixel value sidesteps the issue entirely. We intentionally do NOT update
  // on resize / orientation — accept that rotating the device won't refit;
  // worth the trade for no scroll-jerk on the most common interaction.
  useEffect(() => {
    if (!sectionRef.current) return;
    sectionRef.current.style.height = `${window.innerHeight}px`;
    // Re-lock once on orientation change — that's the one resize that should
    // actually refit. Skip plain window resize so iOS URL bar shows/hides
    // never touch the Hero height.
    const onOrient = () => {
      if (sectionRef.current) {
        sectionRef.current.style.height = `${window.innerHeight}px`;
      }
    };
    window.addEventListener("orientationchange", onOrient);
    return () => window.removeEventListener("orientationchange", onOrient);
  }, []);

  // Opt in to the background video only when it's welcome: honor
  // prefers-reduced-motion, and skip it on data-saver or 2G connections where
  // a few MB of decorative video is a real cost.
  useEffect(() => {
    if (!hero.bgVideoUrl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (conn?.saveData) return;
    if (/(^|-)2g$/.test(conn?.effectiveType ?? "")) return;
    setShowVideo(true);
  }, [hero.bgVideoUrl]);

  // Hand the poster off to the video without a visible seam.
  //
  // The naive version — autoplay, then crossfade — looks wrong, because the
  // poster is frozen on frame one while the video is already half a second
  // into its pan. Dissolving between them ghosts two misaligned copies of the
  // same room. So instead: hold the video paused on frame one (pixel-identical
  // to the poster), fade that in, then start moving. The fade has nothing to
  // give away, and motion begins from a still image rather than cutting in
  // mid-pan.
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video) return;
    video.muted = true;

    let cancelled = false;
    let revealed = false;
    let panning = false;
    let inView = true;
    let holdTimer: ReturnType<typeof setTimeout> | undefined;
    let bufferTimer: ReturnType<typeof setTimeout> | undefined;
    let frame = 0;

    // Ease the pan up from a near standstill. Cutting straight to 1× reads as
    // a jolt when the viewer has been looking at a still image.
    const startPan = () => {
      if (cancelled || panning) return;
      // Scrolled past already — the observer starts us if the Hero returns.
      if (!inView) return;
      panning = true;
      clearTimeout(bufferTimer);
      video.removeEventListener("canplaythrough", startPan);
      const t0 = performance.now();
      video.playbackRate = RAMP_FROM;
      video.play().catch(() => {});
      const step = (now: number) => {
        if (cancelled) return;
        const k = Math.min(1, (now - t0) / RAMP_MS);
        // ease-out: quick off the mark, gentle as it settles into full speed
        video.playbackRate = RAMP_FROM + (1 - RAMP_FROM) * k * (2 - k);
        if (k < 1) frame = requestAnimationFrame(step);
        else video.playbackRate = 1;
      };
      frame = requestAnimationFrame(step);
    };

    // Hold the still until the clip can play through without stalling. One
    // decoded frame is enough to *reveal* the video, but starting the pan on
    // that alone means a visitor on slow mobile data watches it stutter and
    // freeze — worse than a still that simply starts moving a moment later.
    const armPan = () => {
      if (cancelled) return;
      if (video.readyState >= 4) {
        startPan();
        return;
      }
      video.addEventListener("canplaythrough", startPan, { once: true });
      bufferTimer = setTimeout(startPan, BUFFER_WAIT_MS);
    };

    // Park on frame one and show it. Priming playback (below) may have let a
    // few frames through while we were still invisible, so rewind first and
    // wait for the seek — otherwise we'd reveal a frame the poster doesn't
    // match.
    const reveal = () => {
      if (cancelled || revealed) return;
      revealed = true;
      video.pause();
      const show = () => {
        if (cancelled) return;
        setVideoReady(true);
        holdTimer = setTimeout(armPan, HOLD_MS);
      };
      if (video.currentTime > 0.02) {
        video.addEventListener("seeked", show, { once: true });
        video.currentTime = 0;
      } else {
        show();
      }
    };

    if (video.readyState >= 2) {
      reveal();
    } else {
      video.addEventListener("loadeddata", reveal, { once: true });
      // Some browsers (notably iOS Safari) won't fetch the media until
      // playback is actually requested, so ask — `reveal` pauses and rewinds
      // the moment there's a frame to show, all of it behind opacity 0.
      video.play().catch(() => {
        /* autoplay refused — the poster still carries the Hero */
      });
    }

    // Pause once the Hero scrolls away so the decoder isn't competing with
    // scrolling for the rest of the page.
    let observer: IntersectionObserver | undefined;
    if (section && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
          if (!revealed) return;
          if (!inView) {
            video.pause();
          } else if (panning) {
            video.play().catch(() => {});
          } else {
            startPan();
          }
        },
        { threshold: 0 },
      );
      observer.observe(section);
    }

    return () => {
      cancelled = true;
      clearTimeout(holdTimer);
      clearTimeout(bufferTimer);
      cancelAnimationFrame(frame);
      video.removeEventListener("loadeddata", reveal);
      video.removeEventListener("canplaythrough", startPan);
      observer?.disconnect();
    };
  }, [showVideo]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative h-[100svh] min-h-[560px] sm:min-h-[640px] w-full overflow-hidden bg-ink text-ivory"
      aria-label="Welcome to Aviara Design Co."
    >
      <div className="absolute inset-0 z-0" data-testid="hero-poster">
        <Image
          src={hero.bgImageUrl}
          alt={hero.bgImageAlt}
          fill
          priority
          sizes="100vw"
          className={FRAME_CLASS + (showVideo ? "" : " scale-[1.05] animate-kenburns")}
        />

        {showVideo && hero.bgVideoUrl && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            disablePictureInPicture
            data-testid="hero-video"
            onPlaying={() => setVideoReady(true)}
            className={
              "absolute inset-0 h-full w-full transition-opacity ease-out " +
              FRAME_CLASS +
              (videoReady ? " opacity-100" : " opacity-0")
            }
            // Inline rather than a `duration-[…]` class: Tailwind only sees
            // arbitrary values it can read literally in the source, and this
            // one has to stay tied to the FADE_MS the effect above times off.
            style={{ transitionDuration: `${FADE_MS}ms` }}
          >
            <source
              media="(max-width: 767px)"
              src={hero.bgVideoUrlMobile ?? hero.bgVideoUrl}
              type="video/mp4"
            />
            <source src={hero.bgVideoUrl} type="video/mp4" />
          </video>
        )}

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
        <div className="flex-1 flex flex-col justify-center pt-20 sm:pt-24 max-w-3xl">
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
              onClick={() => track("cta_click", { surface: "hero_primary", label: hero.ctaPrimaryLabel })}
              className="btn bg-ivory text-ink hover:bg-brassSoft hover:text-ink border border-ivory"
              data-testid="hero-cta-primary"
            >
              {hero.ctaPrimaryLabel}
            </a>
            <a
              href={hero.ctaSecondaryHref}
              onClick={() => track("cta_click", { surface: "hero_secondary", label: hero.ctaSecondaryLabel })}
              className="btn btn-ghost-light"
              data-testid="hero-cta-secondary"
            >
              {hero.ctaSecondaryLabel}
            </a>
          </div>
        </div>

        <div
          className="pb-6 sm:pb-12 flex flex-row items-center justify-between sm:justify-between gap-4 sm:gap-8 border-t border-ivory/15 pt-5 sm:pt-8 sm:items-end"
          style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        >
          <div className="hidden sm:flex items-center gap-3 text-[0.7rem] uppercase tracking-widest text-ivory/70">
            <span className="inline-block w-8 h-px bg-brassSoft" />
            {hero.footerLabel}
          </div>
          <a
            href="#about"
            className="group inline-flex items-center gap-3 text-[0.7rem] uppercase tracking-widest text-ivory/80 hover:text-brassSoft transition-colors sm:ml-auto"
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
