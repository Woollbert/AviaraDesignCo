import data from "@/content/portfolio.json";

export type Project = {
  slug: string;
  title: string;
  location: string;
  category: "Vacant Staging" | "Occupied Staging" | "Interior Design";
  imageUrl: string;
  imageAlt: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

export const projects: Project[] = data.projects as Project[];
export const testimonials: Testimonial[] = data.testimonials as Testimonial[];
