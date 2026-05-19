import fs from "node:fs";
import path from "node:path";
import testimonialsData from "@/content/testimonials.json";

export type ProjectPhoto = {
  url: string;
  alt: string;
  room?: string;
  caption?: string;
};

export type Project = {
  slug: string;
  title: string;
  location: string;
  category: "Vacant Staging" | "Occupied Staging" | "Interior Design";
  order: number;
  shortDescription: string;
  longDescription: string;
  coverImage: string;
  coverImageAlt: string;
  photos: ProjectPhoto[];
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

// Read all per-project JSON files at module load time. Decap commits a new
// file when the owner creates a project, and the next deploy picks it up.
function loadAllProjects(): Project[] {
  const dir = path.join(process.cwd(), "src/content/projects");
  if (!fs.existsSync(dir)) return [];
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"));
  const projects = files.map((f) => {
    const raw = fs.readFileSync(path.join(dir, f), "utf8");
    return JSON.parse(raw) as Project;
  });
  // Sort by `order`, then by title for stability
  return projects.sort((a, b) => {
    const ao = a.order ?? 999;
    const bo = b.order ?? 999;
    if (ao !== bo) return ao - bo;
    return a.title.localeCompare(b.title);
  });
}

export const projects: Project[] = loadAllProjects();
export const testimonials: Testimonial[] = (testimonialsData.items ?? []) as Testimonial[];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectsByCategory(category: Project["category"]): Project[] {
  return projects.filter((p) => p.category === category);
}
