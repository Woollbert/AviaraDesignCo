import type { Metadata } from "next";
import Link from "next/link";
import { cities } from "@/data/cities";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const featuredCities = cities.slice(0, 5);

  return (
    <section className="section bg-bone">
      <div className="container-wide max-w-3xl text-center">
        <p className="eyebrow flex items-center justify-center gap-3">
          <span className="gold-rule" />
          404
          <span className="gold-rule" />
        </p>
        <h1 className="mt-5 font-display text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.05] text-ink">
          This page is{" "}
          <span className="italic text-brass">missing.</span>
        </h1>
        <p className="mt-7 text-lg text-mute leading-relaxed">
          The page you tried to reach doesn&apos;t exist anymore. It may have
          moved, or the link that brought you here may be out of date. Try one
          of the spots below, or get in touch.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-ink">
            Home
          </Link>
          <Link href="/portfolio/" className="btn btn-outline">
            Portfolio
          </Link>
          <Link href="/service-areas/" className="btn btn-outline">
            Service Areas
          </Link>
          <Link href="/#contact" className="btn btn-outline">
            Contact
          </Link>
        </div>

        <div className="mt-16 pt-10 border-t border-line">
          <p className="eyebrow">Or jump to a city</p>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {featuredCities.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/${c.slug}/`}
                  className="text-base text-ink hover:text-brass transition-colors"
                >
                  {c.city}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/service-areas/"
                className="text-base text-brass hover:text-ink transition-colors underline underline-offset-4 decoration-brass/40 hover:decoration-ink"
              >
                See all →
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-12 text-sm text-mute">
          <p>
            Need a person?{" "}
            <a
              href={`tel:${site.phoneTel}`}
              className="text-ink hover:text-brass transition-colors underline underline-offset-4 decoration-line hover:decoration-brass"
            >
              {site.phone}
            </a>{" "}
            ·{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-ink hover:text-brass transition-colors underline underline-offset-4 decoration-line hover:decoration-brass"
            >
              {site.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
