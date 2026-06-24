/*
 * Enumerates every service × city combination that has enough unique local
 * copy to deserve its own SEO landing page. A page is only generated when
 * the matching City has a serviceNote for that service — that note IS the
 * unique localized hook ("vacant staging in Temecula's Sommers Bend…"),
 * which is what keeps each page from reading as templated doorway content.
 *
 * Resulting URL shape: /<seo-friendly-service>-<city-slug>/
 *   e.g. /vacant-home-staging-temecula/
 *        /staging-consultations-murrieta/
 *        /residential-interior-design-big-bear-lake/
 */
import { services, type Service } from "@/data/services";
import { cities, type City, type CityServiceNote } from "@/data/cities";

// SEO-tuned URL prefix per service slug. Independent from the service's
// internal slug so we can write "vacant-home-staging" in the URL even
// though the data model uses "vacant-staging."
const SERVICE_URL_PREFIX: Record<string, string> = {
  "vacant-staging": "vacant-home-staging",
  "occupied-staging": "occupied-home-staging",
  "residential-interior-design": "residential-interior-design",
  "commercial-interior-design": "commercial-interior-design",
  consultations: "staging-consultations",
};

// City serviceNotes don't always use the exact service.name string —
// historically the cities call it "Interior Design," services calls the
// same offering "Residential Interior Design." Lowercase-substring aliases
// keep both sides matching without forcing a content migration in either.
const SERVICE_NOTE_ALIASES: Record<string, string[]> = {
  "vacant-staging": ["vacant home staging", "vacant staging"],
  "occupied-staging": ["occupied home staging", "occupied staging"],
  "residential-interior-design": ["residential interior design", "interior design"],
  "commercial-interior-design": ["commercial interior design"],
  consultations: ["staging consultations", "consultations"],
};

export type ServiceCityCombo = {
  /** the URL slug for this page, e.g. "vacant-home-staging-temecula" */
  slug: string;
  service: Service;
  city: City;
  /** city-name slug derived from city.city ("Temecula" -> "temecula") */
  citySlug: string;
  /** the city's locally-written paragraph about this service */
  serviceNote: CityServiceNote;
};

function citySlugFor(city: City): string {
  return city.city.toLowerCase().replace(/\s+/g, "-");
}

function findServiceNote(city: City, service: Service): CityServiceNote | undefined {
  const aliases = SERVICE_NOTE_ALIASES[service.slug] || [service.name.toLowerCase()];
  return (city.serviceNotes || []).find((n) =>
    aliases.some((a) => n.name.toLowerCase().includes(a)),
  );
}

function buildCombos(): ServiceCityCombo[] {
  const out: ServiceCityCombo[] = [];
  for (const service of services) {
    const prefix = SERVICE_URL_PREFIX[service.slug];
    if (!prefix) continue; // unrecognized service — skip until added to map
    for (const city of cities) {
      const note = findServiceNote(city, service);
      if (!note) continue; // no localized copy -> no page
      out.push({
        slug: `${prefix}-${citySlugFor(city)}`,
        service,
        city,
        citySlug: citySlugFor(city),
        serviceNote: note,
      });
    }
  }
  return out;
}

export const serviceCityCombos: ServiceCityCombo[] = buildCombos();

export function findServiceCity(slug: string): ServiceCityCombo | undefined {
  return serviceCityCombos.find((c) => c.slug === slug);
}
