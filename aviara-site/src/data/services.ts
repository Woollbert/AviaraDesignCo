import data from "@/content/services.json";

export type Service = {
  slug: string;
  name: string;
  short: string;
  description: string;
  features: string[];
  imageUrl: string;
  imageAlt: string;
};

export type Stat = { value: string; label: string };

export const services: Service[] = data.items as Service[];
export const stats: Stat[] = data.stats as Stat[];
