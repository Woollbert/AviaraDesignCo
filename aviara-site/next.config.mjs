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
  // 301 redirects from the old WordPress URL structure. Preserves backlink
  // equity and prevents 404s on indexed Google results. Keep these forever —
  // even if traffic drops to zero, leaving them in place costs nothing.
  async redirects() {
    return [
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
