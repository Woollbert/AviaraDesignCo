import fs from "node:fs";
import path from "node:path";

// City landing pages for local SEO. Each city is a JSON file in
// src/content/cities/<slug>.json — editable through the Decap CMS so the
// business owner can update copy without touching code. The files generate
// static routes at /home-staging-<slug>/ via the per-route files in
// src/app/home-staging-<slug>/page.tsx.
//
// To add a new city: create a new JSON file matching the City shape, then
// create the matching src/app/home-staging-<slug>/page.tsx (copy any existing
// one and change the slug). sitemap.ts picks it up automatically.

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
};

// The order cities appear in arrays (and therefore in the footer's top-5
// slice and global iteration) is governed by this manifest. Edit here to
// reorder; the JSON files themselves are unordered on disk.
const CITY_ORDER: string[] = [
  "temecula",
  "murrieta",
  "menifee",
  "winchester",
  "fallbrook",
  "carlsbad",
  "encinitas",
  "solana-beach",
  "del-mar",
  "rancho-santa-fe",
  "la-jolla",
  "san-marcos",
  "escondido",
  "big-bear-lake",
];

function loadAllCities(): City[] {
  const dir = path.join(process.cwd(), "src/content/cities");
  if (!fs.existsSync(dir)) return [];
  const filesOnDisk = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const byBase: Record<string, City> = {};
  for (const f of filesOnDisk) {
    const base = f.replace(/\.json$/, "");
    const raw = fs.readFileSync(path.join(dir, f), "utf8");
    byBase[base] = JSON.parse(raw) as City;
  }
  // Sort by CITY_ORDER first; append any unknown files at the end so a
  // newly created city in Decap still shows up before its slug is added
  // to CITY_ORDER.
  const ordered: City[] = [];
  for (const base of CITY_ORDER) {
    if (byBase[base]) ordered.push(byBase[base]);
  }
  for (const [base, city] of Object.entries(byBase)) {
    if (!CITY_ORDER.includes(base)) ordered.push(city);
  }
  return ordered;
}

export const cities: City[] = loadAllCities();

export function findCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}
