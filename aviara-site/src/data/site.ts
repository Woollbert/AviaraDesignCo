import siteJson from "@/content/site.json";

export type SiteHours = { day: string; time: string };

export type Hero = {
  /** Poster still shown immediately; also the fallback when video can't play. */
  bgImageUrl: string;
  bgImageAlt: string;
  /** Optional background video. Omit to fall back to the poster still alone. */
  bgVideoUrl?: string;
  /** Smaller encode served to phones; falls back to bgVideoUrl if unset. */
  bgVideoUrlMobile?: string;
  headlineLine1: string;
  headlineLine2: string;
  subhead: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  footerLabel: string;
};

export type AboutSection = {
  eyebrow: string;
  headlineLine1: string;
  headlineItalic: string;
  bodyParagraphs: string[];
  image: string;
  imageAlt: string;
  founderLabel: string;
};

export type ServicesSection = {
  eyebrow: string;
  headlineLine1: string;
  headlineItalic: string;
  intro: string;
  inquireCtaLabel: string;
  inquireCtaHref: string;
};

export type ProcessSection = {
  eyebrow: string;
  headlineLine1: string;
  headlineItalic: string;
  intro: string;
  bgImage: string;
  /** 0–100: how dark the ink overlay on top of bgImage is. Lower = more photo. */
  bgOverlay?: number;
};

/** Vertical crop anchor for a full-bleed photo. */
export type ImagePosition = "top" | "upper" | "center" | "lower" | "bottom";

export type FeaturedSection = {
  eyebrow: string;
  headlineLine1: string;
  headlineItalic: string;
  body: string;
  image: string;
  imageAlt: string;
  imagePosition?: ImagePosition;
};

export type TeamSection = {
  eyebrow: string;
  headlineLine1: string;
  headlineItalic: string;
  intro: string;
};

export type PortfolioSection = {
  eyebrow: string;
  headlineLine1: string;
  headlineItalic: string;
  intro: string;
};

export type TestimonialsSection = {
  eyebrow: string;
  headlineLine1: string;
  headlineItalic: string;
  image: string;
  imageAlt: string;
};

export type ContactSection = {
  eyebrow: string;
  headlineLine1: string;
  headlineItalic: string;
  intro: string;
};

export type Sections = {
  about: AboutSection;
  services: ServicesSection;
  featured: FeaturedSection;
  process: ProcessSection;
  team: TeamSection;
  portfolio: PortfolioSection;
  testimonials: TestimonialsSection;
  contact: ContactSection;
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
  social: { instagram: string; facebook: string; yelp: string; linkedin?: string };
  address: { city: string; region: string };
  serviceAreas: string[];
  hours: SiteHours[];
  licensing: string;
  hero: Hero;
  sections: Sections;
};

export const site: Site = siteJson as Site;

export const fullLocation = `${site.address.city}, ${site.address.region}`;
