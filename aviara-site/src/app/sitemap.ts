import type { MetadataRoute } from "next";
import { statSync } from "node:fs";
import { join } from "node:path";
import { site } from "@/data/site";
import { projects } from "@/data/portfolio";
import { cities } from "@/data/cities";
import { journalPosts } from "@/data/journal";
import { serviceCityCombos } from "@/data/serviceCities";

// Return the real modification time of a content file so the sitemap's
// <lastmod> reflects when content actually changed (not the deploy time).
// Google deprioritizes the freshness signal on sitemaps that claim every
// URL changed on the same day, so accurate per-file timestamps matter.
function mtime(relPath: string, fallback: Date): Date {
  try {
    const abs = join(process.cwd(), relPath);
    return statSync(abs).mtime;
  } catch {
    return fallback;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const siteMtime = mtime("src/content/site.json", now);
  const servicesMtime = mtime("src/content/services.json", now);

  const staticRoutes: Array<{
    path: string;
    priority: number;
    freq: "monthly" | "yearly" | "weekly";
    lastmod: Date;
  }> = [
    { path: "/",               priority: 1.0, freq: "weekly",  lastmod: siteMtime },
    { path: "/portfolio/",     priority: 0.8, freq: "monthly", lastmod: now },
    { path: "/service-areas/", priority: 0.8, freq: "monthly", lastmod: now },
    { path: "/journal/",       priority: 0.7, freq: "monthly", lastmod: now },
    { path: "/privacy/",       priority: 0.1, freq: "yearly",  lastmod: now },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: `${base}${r.path}`,
      lastModified: r.lastmod,
      changeFrequency: r.freq,
      priority: r.priority,
    })),
    ...cities.map((c) => ({
      url: `${base}/${c.slug}/`,
      lastModified: mtime(`src/content/cities/${c.slug.replace(/^home-staging-/, "")}.json`, now),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...serviceCityCombos.map((sc) => {
      const cityFile = mtime(
        `src/content/cities/${sc.city.slug.replace(/^home-staging-/, "")}.json`,
        servicesMtime,
      );
      // Use whichever is newer — the city's local note or the service catalog
      const lastmod = cityFile > servicesMtime ? cityFile : servicesMtime;
      return {
        url: `${base}/${sc.slug}/`,
        lastModified: lastmod,
        changeFrequency: "monthly" as const,
        priority: 0.85,
      };
    }),
    // Projects — declare every gallery image in the image sitemap so Google
    // Image Search can index the staging photos. Image Search drives serious
    // traffic for visual-first businesses; without this most photos never get
    // surfaced.
    ...projects.map((p) => ({
      url: `${base}/portfolio/${p.slug}/`,
      lastModified: mtime(`src/content/projects/${p.slug}.json`, now),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      images: [
        p.coverImage,
        ...(p.photos || []).map((ph) => ph.url),
      ]
        .filter(Boolean)
        .map((u) => `${base}${u.startsWith("/") ? u : "/" + u}`),
    })),
    ...journalPosts.map((post) => ({
      url: `${base}/journal/${post.slug}/`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : mtime(`src/content/journal/${post.slug}.json`, now),
      changeFrequency: "yearly" as const,
      priority: 0.5,
      images: post.coverImage ? [`${base}${post.coverImage}`] : undefined,
    })),
  ];
}
