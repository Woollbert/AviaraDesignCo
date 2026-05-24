// City landing pages for local SEO. Each city is a JSON file in
// src/content/cities/<slug>.json — editable through the Decap CMS so the
// business owner can update copy without touching code. The files generate
// static routes at /home-staging-<slug>/ via the per-route files in
// src/app/home-staging-<slug>/page.tsx.
//
// To add a new city: create a new JSON file matching the City shape, import
// it below + add it to the cities array, then create the matching route
// file src/app/home-staging-<slug>/page.tsx (copy any existing one).
//
// Implementation note: static imports (rather than fs.readdir) so this file
// is safe to import from client components — Footer in particular gets
// rendered inside a client wrapper on the puck-homepage-rebuild branch.

import bigBearLake from "@/content/cities/big-bear-lake.json";
import carlsbad from "@/content/cities/carlsbad.json";
import delMar from "@/content/cities/del-mar.json";
import encinitas from "@/content/cities/encinitas.json";
import escondido from "@/content/cities/escondido.json";
import fallbrook from "@/content/cities/fallbrook.json";
import laJolla from "@/content/cities/la-jolla.json";
import menifee from "@/content/cities/menifee.json";
import murrieta from "@/content/cities/murrieta.json";
import ranchoSantaFe from "@/content/cities/rancho-santa-fe.json";
import sanMarcos from "@/content/cities/san-marcos.json";
import solanaBeach from "@/content/cities/solana-beach.json";
import temecula from "@/content/cities/temecula.json";
import winchester from "@/content/cities/winchester.json";

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

// Order governs how cities appear in the footer's first-5 slice and the
// global iteration. Riverside cluster first, then SD coast, then inland,
// then mountain.
export const cities: City[] = [
  temecula as City,
  murrieta as City,
  menifee as City,
  winchester as City,
  fallbrook as City,
  carlsbad as City,
  encinitas as City,
  solanaBeach as City,
  delMar as City,
  ranchoSantaFe as City,
  laJolla as City,
  sanMarcos as City,
  escondido as City,
  bigBearLake as City,
];

export function findCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}
