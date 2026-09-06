// Copy + region groupings for the /service-areas/ page. Editable in the CMS
// under "Service Areas Page". Cities attach themselves to a region via their
// own `region` field, so adding a city never requires touching this file.
import data from "@/content/service-areas.json";
import { cities, type City } from "@/data/cities";

export type ServiceAreaRegion = {
  name: string;
  eyebrow: string;
  blurb: string;
};

export type ServiceAreasPage = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  headlineLine1: string;
  headlineItalic: string;
  intro: string;
  regions: ServiceAreaRegion[];
  closing: { eyebrow: string; headline: string; body: string };
};

export const serviceAreasPage: ServiceAreasPage = data as ServiceAreasPage;

export type RegionGroup = ServiceAreaRegion & { cities: City[] };

/**
 * Live cities grouped under the regions defined in service-areas.json, in that
 * order. A city whose `region` matches nothing (typo, or a region the owner
 * hasn't described yet) still renders, in a trailing group named after
 * whatever it typed, or its county, so nothing silently disappears.
 */
export function groupCitiesByRegion(): RegionGroup[] {
  const groups: RegionGroup[] = serviceAreasPage.regions.map((r) => ({ ...r, cities: [] }));
  const extras = new Map<string, RegionGroup>();
  for (const city of cities) {
    const key = city.region?.trim() || city.county;
    const g = groups.find((r) => r.name.toLowerCase() === key.toLowerCase());
    if (g) {
      g.cities.push(city);
      continue;
    }
    if (!extras.has(key)) extras.set(key, { name: key, eyebrow: "More Areas", blurb: "", cities: [] });
    extras.get(key)!.cities.push(city);
  }
  return [...groups, ...extras.values()].filter((g) => g.cities.length > 0);
}
