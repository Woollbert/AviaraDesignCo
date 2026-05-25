"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#process", label: "Process" },
  { href: "#team", label: "Team" },
  { href: "#contact", label: "Contact" },
];

// On the homepage, "#about" scrolls to the About section. On any other route
// (e.g. /portfolio/fallbrook-estate/), the same href would just append a hash
// to the current URL without navigating — looks broken. Prefix the home path
// when not on home so clicks always land on the matching homepage section.
function resolveNavHref(href: string, pathname: string): string {
  if (!href.startsWith("#")) return href;
  return pathname === "/" ? href : `/${href}`;
}

export default function Navbar() {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // rAF-throttle the scroll handler. Without this, every wheel tick fires a
    // React state update + re-render, which adds frame-time during scrolling
    // and makes the page feel jittery on lower-refresh-rate displays.
    let ticking = false;
    let lastScrolled = window.scrollY > 24;
    setScrolled(lastScrolled);
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const next = window.scrollY > 24;
        if (next !== lastScrolled) {
          lastScrolled = next;
          setScrolled(next);
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Closing the drawer flips `body.overflow:hidden` off (via the effect above)
  // so the browser's default in-page anchor jump can scroll. Without this
  // bridge, the tap closes the drawer but the page stays put on iOS.
  function handleMenuLinkClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (!href.startsWith("#") || pathname !== "/") {
      setOpen(false);
      return;
    }
    e.preventDefault();
    setOpen(false);
    const id = href.slice(1);
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", href);
    });
  }

  // When at top, the navbar floats over the dark hero, so use light treatment.
  // After the user scrolls (or the mobile drawer is open) swap to the cream
  // backdrop with dark text so the navbar visually connects to its surroundings.
  const onLight = scrolled || open;
  const barText = onLight ? "text-ink" : "text-ivory";
  const burgerLine = onLight ? "bg-ink" : "bg-ivory";

  return (
    <>
    <header
      data-scrolled={scrolled}
      data-menu-open={open}
      className={[
        "fixed top-0 inset-x-0 z-40 transition-[background-color,border-color] duration-200",
        // No backdrop-filter: it forces compositor work on every scroll frame
        // and makes wheel scrolling feel jittery. Bone is opaque enough.
        onLight
          ? "bg-bone border-b border-line/60"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="container-wide flex items-center justify-between py-4">
        <Link href="/" aria-label="Aviara Design Co. home">
          <Logo variant={onLight ? "ink" : "ivory"} />
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-9">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={resolveNavHref(l.href, pathname)}
              className={`nav-link ${onLight ? "" : "nav-link-light"}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href={resolveNavHref("#contact", pathname)}
            className={onLight ? "btn btn-ink" : "btn btn-ghost-light"}
          >
            Inquire
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
          className={`lg:hidden inline-flex flex-col items-end justify-center gap-1.5 w-10 h-10 group ${barText}`}
        >
          <span
            className={[
              "block h-px transition-all duration-300",
              burgerLine,
              open ? "w-7 translate-y-2 rotate-45" : "w-7",
            ].join(" ")}
          />
          <span
            className={[
              "block h-px transition-all duration-300",
              burgerLine,
              open ? "opacity-0" : "w-5",
            ].join(" ")}
          />
          <span
            className={[
              "block h-px transition-all duration-300",
              burgerLine,
              open ? "w-7 -translate-y-2 -rotate-45" : "w-6",
            ].join(" ")}
          />
        </button>
      </div>
    </header>

    {/*
      Drawer must be a SIBLING of <header> (not a child). The header has
      backdrop-filter, which creates a containing block for fixed-position
      descendants. Nesting the drawer inside made its `bottom: 0` resolve to
      the bottom of the navbar instead of the viewport.
    */}
    <div
      id="mobile-menu"
      data-open={open}
      className={[
        "lg:hidden fixed inset-x-0 top-[80px] bottom-0 bg-bone z-30 transition-all duration-500",
        open
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-4 pointer-events-none",
      ].join(" ")}
    >
      <div className="container-wide pt-12 pb-16 flex flex-col gap-7 h-full">
        {navLinks.map((l) => (
          <a
            key={l.href}
            href={resolveNavHref(l.href, pathname)}
            onClick={(e) => handleMenuLinkClick(e, l.href)}
            className="font-display text-3xl text-ink"
          >
            {l.label}
          </a>
        ))}
        <a
          href={resolveNavHref("#contact", pathname)}
          onClick={(e) => handleMenuLinkClick(e, "#contact")}
          className="btn btn-ink mt-4 self-start"
        >
          Inquire
        </a>
      </div>
    </div>
    </>
  );
}
