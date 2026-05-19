import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
  // Adaptive favicons: cream-bg variant for light browser themes, ink-bg for
  // dark themes. Both versions are pre-rendered in public/ so the icon always
  // pops regardless of what background color the browser tab shows. /favicon.ico
  // (multi-size, dark variant) is also served at the root for search engines.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      // Unconditional 192px fallback for browsers that don't honor media queries.
      { url: "/favicon-192-dark.png", type: "image/png", sizes: "192x192" },
      // Light-theme variants
      { url: "/favicon-16-light.png", type: "image/png", sizes: "16x16", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-32-light.png", type: "image/png", sizes: "32x32", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-48-light.png", type: "image/png", sizes: "48x48", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-192-light.png", type: "image/png", sizes: "192x192", media: "(prefers-color-scheme: light)" },
      // Dark-theme variants
      { url: "/favicon-16-dark.png", type: "image/png", sizes: "16x16", media: "(prefers-color-scheme: dark)" },
      { url: "/favicon-32-dark.png", type: "image/png", sizes: "32x32", media: "(prefers-color-scheme: dark)" },
      { url: "/favicon-48-dark.png", type: "image/png", sizes: "48x48", media: "(prefers-color-scheme: dark)" },
      { url: "/favicon-192-dark.png", type: "image/png", sizes: "192x192", media: "(prefers-color-scheme: dark)" },
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
      </body>
    </html>
  );
}
