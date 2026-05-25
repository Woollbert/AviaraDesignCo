import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { site } from "@/data/site";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Google Analytics 4 measurement ID. Public by design (renders inside a
// <script> tag every visitor sees). Hardcoded so analytics fire without any
// Vercel env config; can be overridden via NEXT_PUBLIC_GA_MEASUREMENT_ID if a
// different property is wanted (e.g. for a staging environment).
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-51L35JRHSL";

// Google Search Console ownership verification. Public by design (renders as
// a <meta> tag every visitor sees). Hardcoded so verification works without
// any Vercel env config; can be overridden via NEXT_PUBLIC_GSC_VERIFICATION
// if a different property is ever added.
const GSC_VERIFICATION =
  process.env.NEXT_PUBLIC_GSC_VERIFICATION ||
  "rpUlunC6E9WoAPy0f9Gf774aZ8qKCFr5SBj5QLgqAA4";

// LocalBusiness structured data — tells Google what kind of business this is
// and where we operate. Without this, we can't appear in rich results / local
// pack metadata. Uses HomeAndConstructionBusiness as the closest @type for
// home staging + interior design.
const baseUrl = site.url.replace(/\/$/, "");
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": `${baseUrl}/#business`,
  name: site.name,
  alternateName: site.shortName,
  description: site.description,
  url: baseUrl,
  telephone: site.phoneTel,
  email: site.email,
  image: `${baseUrl}/logo-512.png`,
  logo: `${baseUrl}/logo-512.png`,
  priceRange: "$$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    addressCountry: "US",
  },
  areaServed: site.serviceAreas.map((area) => ({
    "@type": "City",
    name: area,
  })),
  sameAs: [site.social.instagram, site.social.facebook, site.social.linkedin].filter(Boolean),
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      description: "By appointment",
    },
  ],
  knowsAbout: [
    "Home Staging",
    "Vacant Home Staging",
    "Occupied Home Staging",
    "Luxury Home Staging",
    "Interior Design",
    "Real Estate Staging",
  ],
};

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    images: [
      {
        url: "/images/A7405944.jpeg",
        width: 1200,
        height: 630,
        alt: "Fully staged living room by Aviara Design Co.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/images/A7405944.jpeg"],
  },
  // Google Search Console ownership verification. Set
  // NEXT_PUBLIC_GSC_VERIFICATION to the token from Search Console (the value
  // inside content="..." in their HTML-tag verification method) to render
  // the meta tag.
  ...(GSC_VERIFICATION
    ? { verification: { google: GSC_VERIFICATION } }
    : {}),
  // Favicons: circular cream disc with the dark AD monogram, served at every
  // size. The same cream variant ships for both light and dark browser themes
  // so the brand mark reads consistently everywhere (no inverted ink-disc
  // alternate). /favicon.ico (multi-size, cream variant) is served at the
  // root for search engines.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16-light.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32-light.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48-light.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-192-light.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen flex flex-col bg-bone text-slate">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 btn btn-ink"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        {/* Google Analytics 4 — only rendered if a measurement ID is set in
            env (NEXT_PUBLIC_GA_MEASUREMENT_ID). 'afterInteractive' so the
            tracking script doesn't block first paint. */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { anonymize_ip: true });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
