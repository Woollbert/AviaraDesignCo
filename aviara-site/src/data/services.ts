import data from "@/content/services.json";

export type ServiceFAQ = { question: string; answer: string };

export type Service = {
  slug: string;
  name: string;
  short: string;
  description: string;
  features: string[];
  imageUrl: string;
  imageAlt: string;
  // --- Dedicated service page (/services/<url-slug>/). All optional: a
  // service the owner adds in the CMS still gets a page built from the
  // fields above, and these fill it out when she writes them.
  /** SEO title for the service page. The brand is appended automatically. */
  metaTitle?: string;
  metaDescription?: string;
  /** Long-form overview paragraphs shown at the top of the service page. */
  pageIntro?: string[];
  /** "This is the right fit when…" bullets. */
  idealFor?: string[];
  faqs?: ServiceFAQ[];
};

export type Stat = { value: string; label: string };

export const services: Service[] = data.items as Service[];
export const stats: Stat[] = data.stats as Stat[];

// SEO-tuned URL slug per service. Independent from the service's internal
// slug so the URL can say "vacant-home-staging" even though the data model
// (and the CMS) calls it "vacant-staging". Shared by the service pages
// (/services/vacant-home-staging/) and the service x city pages
// (/vacant-home-staging-temecula/) so the two always line up.
export const SERVICE_URL_PREFIX: Record<string, string> = {
  "vacant-staging": "vacant-home-staging",
  "occupied-staging": "occupied-home-staging",
  "residential-interior-design": "residential-interior-design",
  "commercial-interior-design": "commercial-interior-design",
  consultations: "staging-consultations",
};

/** URL slug of a service's own page. Falls back to the CMS slug for services added later. */
export function serviceUrlSlug(service: Service): string {
  return SERVICE_URL_PREFIX[service.slug] ?? service.slug;
}

export function servicePath(service: Service): string {
  return `/services/${serviceUrlSlug(service)}/`;
}

export function findServiceByUrlSlug(urlSlug: string): Service | undefined {
  return services.find((s) => serviceUrlSlug(s) === urlSlug);
}
