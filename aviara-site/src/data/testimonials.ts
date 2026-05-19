// Standalone testimonials module — safe to import from client components.
// The portfolio.ts module uses node:fs for the per-project folder collection,
// which breaks client component bundling. This file only does a static JSON
// import, so Testimonials.tsx (which is "use client") can safely import here.
import data from "@/content/testimonials.json";

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

export const testimonials: Testimonial[] = (data.items ?? []) as Testimonial[];
