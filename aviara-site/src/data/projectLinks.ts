/*
 * Cross-links between portfolio projects, city pages, and service pages.
 *
 * Nothing here is hand-maintained: a project is tied to a city by its own
 * "Location" field and to a service by its "Category" field, both of which
 * the owner already fills in when she adds a project in the CMS. So a new
 * Temecula project shows up on the Temecula page (and links back to it)
 * with no extra step.
 *
 * Server-only: imports the fs-backed project and city loaders.
 */
import { projects, type Project } from "@/data/portfolio";
import { cities, type City } from "@/data/cities";
import { services, type Service } from "@/data/services";

/** "Temecula, CA" -> "temecula" */
function locationCityName(location: string): string {
  return location.split(",")[0].trim().toLowerCase();
}

/**
 * The published city page for a project's location, if there is one. Exact
 * name match first; otherwise a single unambiguous longer name ("Big Bear"
 * -> "Big Bear Lake"). Ambiguous prefixes ("Newport" could be Newport Beach
 * or Newport Coast) match nothing rather than guess.
 */
export function cityForProject(project: Project): City | undefined {
  const name = locationCityName(project.location || "");
  if (!name) return undefined;
  const exact = cities.find((c) => c.city.toLowerCase() === name);
  if (exact) return exact;
  const prefixed = cities.filter((c) => c.city.toLowerCase().startsWith(`${name} `));
  return prefixed.length === 1 ? prefixed[0] : undefined;
}

/** Portfolio projects located in this city, in portfolio order. */
export function projectsForCity(city: City): Project[] {
  return projects.filter((p) => cityForProject(p)?.slug === city.slug);
}

// Project "Category" (a fixed dropdown in the CMS) -> service slug.
const CATEGORY_TO_SERVICE: Record<Project["category"], string> = {
  "Vacant Staging": "vacant-staging",
  "Occupied Staging": "occupied-staging",
  "Interior Design": "residential-interior-design",
};

/** The service a project is an example of, if that service is still offered. */
export function serviceForProject(project: Project): Service | undefined {
  const slug = CATEGORY_TO_SERVICE[project.category];
  return services.find((s) => s.slug === slug);
}

/** Portfolio projects that are examples of this service. */
export function projectsForService(service: Service): Project[] {
  return projects.filter((p) => CATEGORY_TO_SERVICE[p.category] === service.slug);
}
