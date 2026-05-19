import Image from "next/image";
import { site } from "@/data/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-bone border-t border-line text-slate">
      <div className="container-wide py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 md:gap-0 items-center">
          {/* LEFT: large brand mark */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="relative inline-block w-[160px] h-[160px] md:w-[200px] md:h-[200px]">
              <Image
                src="/images/aviara-monogram.png"
                alt="Aviara Design Co."
                fill
                sizes="(min-width: 768px) 200px, 160px"
                className="object-contain"
              />
            </span>
            <p className="mt-3 font-display text-3xl md:text-4xl text-ink tracking-wide">
              Aviara
            </p>
            <p className="mt-1 text-[0.72rem] uppercase tracking-[0.32em] text-mute">
              Home Staging + Interiors
            </p>
          </div>

          {/* RIGHT: quick links column */}
          <div className="md:border-l md:border-line md:pl-12 lg:pl-20 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-sans text-base font-semibold tracking-[0.18em] uppercase text-ink">
              Quick Links
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
            </div>
          </div>
        </div>
      </div>

      {/* Bottom strip: tagline left, copyright right */}
      <div className="border-t border-line">
        <div className="container-wide py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-mute">
          <p>
            {site.name} · Serving {site.address.city} & all of Southern California
          </p>
          <p>
            © {year} {site.name} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
