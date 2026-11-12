import fs from "node:fs";
import path from "node:path";

// Journal posts live as JSON files in src/content/journal/. They were
// originally WordPress blog posts under aviaradesignco.com/<slug>/; old
// URLs are 301'd to /journal/<slug>/ via next.config.mjs.

export type JournalBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string };

export type JournalPost = {
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription: string;
  /** YYYY-MM-DD. Optional so a post saved without a date still builds. */
  publishedAt?: string;
  excerpt: string;
  coverImage?: string;
  blocks: JournalBlock[];
};

function loadAllJournalPosts(): JournalPost[] {
  const dir = path.join(process.cwd(), "src/content/journal");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const posts = files.map((f) => {
    const raw = fs.readFileSync(path.join(dir, f), "utf8");
    return JSON.parse(raw) as JournalPost;
  });
  // Newest first. Undated posts sort to the top so a post the owner just
  // wrote is never buried under older ones.
  return posts.sort((a, b) => {
    if (!a.publishedAt || !b.publishedAt) {
      if (a.publishedAt === b.publishedAt) return a.title.localeCompare(b.title);
      return a.publishedAt ? 1 : -1;
    }
    return a.publishedAt < b.publishedAt ? 1 : -1;
  });
}

export const journalPosts: JournalPost[] = loadAllJournalPosts();

export function findJournalPost(slug: string): JournalPost | undefined {
  return journalPosts.find((p) => p.slug === slug);
}
