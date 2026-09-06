// City landing pages for local SEO. Each city is a JSON file in
// src/content/cities/<name>.json, editable through the CMS at /admin/.
//
// The folder is read at build time (same pattern as projects + journal), so
// a city the owner creates in the CMS goes live on the next deploy with no
// code change. Pages are served by src/app/[slug]/page.tsx, which enumerates
// `cities` in generateStaticParams.
//
// Server-only: this file touches node:fs. Client components (Footer) receive
// the city list as props from a server parent instead of importing this.

import fs from "node:fs";
import path from "node:path";

export type CityFAQ = {
  question: string;
  answer: string;
};

export type CityServiceNote = {
  name: string;
  note: string;
};

export type CityMistake = {
  title: string;
  body: string;
};

export type City = {
  slug: string;
  city: string;
  county: string;
  /** Group heading on /service-areas/. Must match a region name in service-areas.json. */
  region?: string;
  /** Sort key: lower first. Drives footer "top 5", /service-areas/ order, 404 links. */
  order?: number;
  /** false = written but hidden: no route, no sitemap entry, no links. Default true. */
  published?: boolean;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  marketContext?: string[];
  whyStaging: string[];
  localProof: string;
  serviceNotes?: CityServiceNote[];
  neighborhoods: string[];
  commonMistakes?: CityMistake[];
  faqs: CityFAQ[];
  nearbyCitySlugs: string[];
  /** Path of the JSON file this city came from, relative to the project root. */
  sourceFile: string;
};

const CITIES_DIR = "src/content/cities";

function loadAllCities(): City[] {
  const dir = path.join(process.cwd(), CITIES_DIR);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const seen = new Set<string>();
  const out: City[] = [];
  for (const f of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as Partial<City>;
    if (!raw.slug || !raw.city) {
      console.warn(`[cities] ${f}: missing slug or city name, skipped`);
      continue;
    }
    if (seen.has(raw.slug)) {
      console.warn(`[cities] ${f}: duplicate slug "${raw.slug}", skipped`);
      continue;
    }
    seen.add(raw.slug);
    // Default every list so a half-filled CMS entry can't crash the page.
    out.push({
      ...(raw as City),
      whyStaging: raw.whyStaging ?? [],
      neighborhoods: raw.neighborhoods ?? [],
      faqs: raw.faqs ?? [],
      nearbyCitySlugs: raw.nearbyCitySlugs ?? [],
      sourceFile: `${CITIES_DIR}/${f}`,
    });
  }
  return out.sort((a, b) => {
    const ao = a.order ?? 999;
    const bo = b.order ?? 999;
    if (ao !== bo) return ao - bo;
    return a.city.localeCompare(b.city);
  });
}

/** Every city file on disk, including unpublished drafts. */
export const allCities: City[] = loadAllCities();

/** Live cities only — the list every route, link, and sitemap should use. */
export const cities: City[] = allCities.filter((c) => c.published !== false);

export function findCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}
