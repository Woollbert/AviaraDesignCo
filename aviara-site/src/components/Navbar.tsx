"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#process", label: "Process" },
  { href: "#team", label: "Team" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
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
        "fixed top-0 inset-x-0 z-40 transition-[background-color,border-color] duration-300",
        onLight
          ? "bg-bone/95 backdrop-blur-md border-b border-line/60"
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
              href={l.href}
              className={`nav-link ${onLight ? "" : "nav-link-light"}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="#contact"
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
            href={l.href}
            onClick={() => setOpen(false)}
            className="font-display text-3xl text-ink"
          >
            {l.label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={() => setOpen(false)}
          className="btn btn-ink mt-4 self-start"
        >
          Inquire
        </a>
      </div>
    </div>
    </>
  );
}
