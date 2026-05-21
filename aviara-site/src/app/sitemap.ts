import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { projects } from "@/data/portfolio";
import { cities } from "@/data/cities";
import { journalPosts } from "@/data/journal";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: { path: string; priority: number; freq: "monthly" | "yearly" | "weekly" }[] = [
    { path: "/", priority: 1.0, freq: "weekly" },
    { path: "/portfolio/", priority: 0.8, freq: "monthly" },
    { path: "/journal/", priority: 0.7, freq: "monthly" },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: `${base}${r.path}`,
      lastModified: now,
      changeFrequency: r.freq,
      priority: r.priority,
    })),
    ...cities.map((c) => ({
      url: `${base}/${c.slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...projects.map((p) => ({
      url: `${base}/portfolio/${p.slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...journalPosts.map((post) => ({
      url: `${base}/journal/${post.slug}/`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
