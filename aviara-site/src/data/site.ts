import siteJson from "@/content/site.json";

export type SiteHours = { day: string; time: string };

export type Hero = {
  bgImageUrl: string;
  bgImageAlt: string;
  headlineLine1: string;
  headlineLine2: string;
  subhead: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  footerLabel: string;
};

export type Site = {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  phone: string;
  phoneTel: string;
  email: string;
  smsHref: string;
  social: { instagram: string; facebook: string; yelp: string };
  address: { city: string; region: string };
  serviceAreas: string[];
  hours: SiteHours[];
  licensing: string;
  hero: Hero;
};

export const site: Site = siteJson as Site;

export const fullLocation = `${site.address.city}, ${site.address.region}`;
