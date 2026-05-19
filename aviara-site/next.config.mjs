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
};

export default nextConfig;
