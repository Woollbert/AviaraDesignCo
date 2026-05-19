import siteJson from "@/content/site.json";

export type SiteHours = { day: string; time: string };

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
};

export const site: Site = siteJson as Site;

export const fullLocation = `${site.address.city}, ${site.address.region}`;
