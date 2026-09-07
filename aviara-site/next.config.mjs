import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/*
 * Services live in the CMS, and removing one silently deletes its
 * service x city landing pages. Any URL Google already indexed then starts
 * returning 404, which throws away the ranking those pages built.
 *
 * For each retired service listed here we redirect its orphaned URLs to the
 * matching city hub, but ONLY while the service is actually missing from
 * services.json. Restore the service in the CMS and these redirects stop
 * being emitted on the next build, so the real pages serve again. The
 * redirect is temporary (302) rather than permanent for the same reason:
 * a 301 is cached hard by browsers and would be painful to undo.
 */
const RETIRED_SERVICE_ROUTES = [
  {
    urlPrefix: "staging-consultations",
    serviceSlug: "consultations",
    // Matches the per-city serviceNotes entry that used to generate the page.
    noteMatch: /consultation/i,
  },
];

function retiredServiceRedirects() {
  const root = process.cwd();
  let liveSlugs;
  try {
    const services = JSON.parse(readFileSync(join(root, "src/content/services.json"), "utf8"));
    liveSlugs = new Set((services.items ?? []).map((s) => s.slug));
  } catch {
    return []; // can't read services: emit nothing rather than guess
  }

  const citiesDir = join(root, "src/content/cities");
  let cities = [];
  try {
    cities = readdirSync(citiesDir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => JSON.parse(readFileSync(join(citiesDir, f), "utf8")));
  } catch {
    return [];
  }

  const out = [];
  for (const retired of RETIRED_SERVICE_ROUTES) {
    if (liveSlugs.has(retired.serviceSlug)) continue; // service is back
    for (const city of cities) {
      if (city.published === false) continue;
      if (!(city.serviceNotes ?? []).some((n) => retired.noteMatch.test(n.name))) continue;
      const citySlug = city.city.toLowerCase().replace(/\s+/g, "-");
      out.push({
        source: `/${retired.urlPrefix}-${citySlug}/`,
        destination: `/${city.slug}/`,
        permanent: false,
      });
    }
  }
  return out;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Preserve WordPress-style trailing-slash URLs (/contact/, /services/) so
  // existing inbound links and any indexed Google results don't 404 after
  // the cutover. Pages added later as Puck-managed will inherit this.
  trailingSlash: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  // The hero clip is the single heaviest asset on the site. Vercel serves
  // files from public/ as `max-age=0, must-revalidate` by default, so every
  // repeat visit re-validates several megabytes. These filenames carry a
  // version suffix (-v2) precisely so they can be cached forever — if you
  // swap the clip, bump the suffix rather than overwriting the file, or
  // returning visitors will keep the old one.
  async headers() {
    return [
      {
        source: "/videos/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  // 301 redirects from the old WordPress URL structure. Preserves backlink
  // equity and prevents 404s on indexed Google results. Keep these forever —
  // even if traffic drops to zero, leaving them in place costs nothing.
  async redirects() {
    return [
      // Orphaned service x city URLs (see RETIRED_SERVICE_ROUTES above).
      ...retiredServiceRedirects(),
      // Old WordPress blog posts → new /journal/ structure
      {
        source: "/how-home-staging-helps-homes-sell-faster-in-temecula-ca/",
        destination: "/journal/how-home-staging-helps-homes-sell-faster-in-temecula-ca/",
        permanent: true,
      },
      {
        source: "/5-ways-to-prepare-your-home-for-sale-without-full-staging/",
        destination: "/journal/5-ways-to-prepare-your-home-for-sale-without-full-staging/",
        permanent: true,
      },
      {
        source: "/how-to-make-your-listing-stand-out-in-a-competitive-market/",
        destination: "/journal/how-to-make-your-listing-stand-out-in-a-competitive-market/",
        permanent: true,
      },
      {
        source: "/vacant-vs-occupied-home-staging-which-is-right-for-your-listing/",
        destination: "/journal/vacant-vs-occupied-home-staging-which-is-right-for-your-listing/",
        permanent: true,
      },
      {
        source: "/what-realtors-should-know-about-home-staging-in-southern-california/",
        destination: "/journal/what-realtors-should-know-about-home-staging-in-southern-california/",
        permanent: true,
      },
      // Old WordPress service-area pages → new city landing pages
      { source: "/temecula/", destination: "/home-staging-temecula/", permanent: true },
      { source: "/murrieta/", destination: "/home-staging-murrieta/", permanent: true },
      { source: "/menifee/", destination: "/home-staging-menifee/", permanent: true },
      { source: "/fallbrook/", destination: "/home-staging-fallbrook/", permanent: true },
      { source: "/service-area/", destination: "/", permanent: true },
      // Old WordPress site sections → homepage anchors
      { source: "/services/", destination: "/#services", permanent: true },
      { source: "/contact/", destination: "/#contact", permanent: true },
      { source: "/testimonial/", destination: "/#testimonials", permanent: true },
      { source: "/the-aviara-experience/", destination: "/#about", permanent: true },
      { source: "/for-realtors/", destination: "/#contact", permanent: true },
      { source: "/For%20Realtors/", destination: "/#contact", permanent: true },
      { source: "/The%20Aviara%20Experience/", destination: "/#about", permanent: true },
      { source: "/consultation/", destination: "/#contact", permanent: true },
      { source: "/before-after/", destination: "/portfolio/", permanent: true },
      { source: "/blog/", destination: "/journal/", permanent: true },
    ];
  },
};

export default nextConfig;
