import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { cities } from "@/data/cities";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-bone border-t border-line text-slate">
      <div className="container-wide py-16 md:py-20">
        <div className="grid md:grid-cols-4 gap-12 md:gap-10 items-start">
          {/* COL 1: brand mark — always centered under the logo at every breakpoint */}
          <div className="flex flex-col items-center text-center">
            <span className="relative inline-block w-[140px] h-[140px] md:w-[160px] md:h-[160px]">
              <Image
                src="/images/aviara-monogram.png"
                alt="Aviara Design Co."
                fill
                sizes="(min-width: 768px) 160px, 140px"
                className="object-contain"
              />
            </span>
            <p className="mt-3 font-display text-3xl text-ink tracking-wide whitespace-nowrap">
              Aviara Design Co.
            </p>
            <p className="mt-1 text-[0.72rem] uppercase tracking-[0.32em] text-mute">
              Home Staging + Interiors
            </p>
          </div>

          {/* COL 2: Service Areas — top cities visible, full list on /service-areas/ */}
          <div className="md:border-l md:border-line md:pl-8 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-sans text-base font-semibold tracking-[0.18em] uppercase text-ink">
              Service Areas
            </h4>
            <ul className="mt-6 space-y-3">
              {cities.slice(0, 5).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/${c.slug}/`}
                    className="text-base text-ink hover:text-brass transition-colors"
                  >
                    {c.city}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/service-areas/"
                  className="text-sm text-brass hover:text-ink transition-colors underline underline-offset-4 decoration-brass/40 hover:decoration-ink"
                >
                  View all service areas →
                </Link>
              </li>
            </ul>
          </div>

          {/* COL 3: Explore */}
          <div className="md:border-l md:border-line md:pl-8 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-sans text-base font-semibold tracking-[0.18em] uppercase text-ink">
              Explore
            </h4>
            <ul className="mt-6 space-y-3">
              <li>
                <Link
                  href="/portfolio/"
                  className="text-base text-ink hover:text-brass transition-colors"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/journal/"
                  className="text-base text-ink hover:text-brass transition-colors"
                >
                  Journal
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="text-base text-ink hover:text-brass transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/#services"
                  className="text-base text-ink hover:text-brass transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="text-base text-ink hover:text-brass transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* COL 4: Contact + social */}
          <div className="md:border-l md:border-line md:pl-8 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-sans text-base font-semibold tracking-[0.18em] uppercase text-ink">
              Get in Touch
            </h4>

            <ul className="mt-6 space-y-3">
              <li>
                <a
                  href={`tel:${site.phoneTel}`}
                  className="text-base text-ink hover:text-brass transition-colors underline underline-offset-4 decoration-line hover:decoration-brass"
                >
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-base text-ink hover:text-brass transition-colors underline underline-offset-4 decoration-line hover:decoration-brass break-all"
                >
                  {site.email}
                </a>
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-5">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Aviara on Instagram"
                className="text-ink hover:text-brass transition-colors"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="4" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" />
                </svg>
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Aviara on Facebook"
                className="text-ink hover:text-brass transition-colors"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
              </a>
              {site.social.linkedin && (
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Aviara Design Co. on LinkedIn"
                  className="text-ink hover:text-brass transition-colors"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom strip: tagline left, copyright + privacy right */}
      <div className="border-t border-line">
        <div className="container-wide py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-mute">
          <p>
            {site.name} · Serving {site.address.city} & all of Southern California
          </p>
          <p className="flex items-center gap-3">
            <Link
              href="/privacy/"
              className="hover:text-brass transition-colors"
            >
              Privacy
            </Link>
            <span className="opacity-40">·</span>
            <span>© {year} {site.name} All rights reserved.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
