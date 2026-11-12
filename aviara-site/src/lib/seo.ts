/*
 * Small SEO helpers shared by the route files. Pure functions, no node:fs,
 * so they are safe to import from anywhere.
 */
import type { SiteHours } from "@/data/site";

/**
 * The root layout appends " | Aviara Design Co." to every page title. If an
 * editor also types the brand into an "SEO Title" field in the CMS, the tab
 * and the Google result read "… | Aviara Design Co. | Aviara Design Co.".
 * Strip a trailing brand (any separator, with or without the full stop) so
 * the template can add it exactly once.
 */
export function stripBrand(title: string, brand: string): string {
  const bare = brand.replace(/\.$/, "");
  const escaped = bare.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`\\s*[|\\-–—·:]\\s*${escaped}\\.?\\s*$`, "i");
  let out = title.trim();
  // Loop in case it was typed twice.
  while (re.test(out)) out = out.replace(re, "").trim();
  return out || title.trim();
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function dayIndex(token: string): number {
  const t = token.trim().toLowerCase().replace(/\.$/, "");
  if (t.length < 3) return -1;
  // First three letters are unambiguous and cover "Tues", "Thurs", "Weds".
  return DAYS.findIndex((d) => d.toLowerCase().startsWith(t.slice(0, 3)));
}

/** "Mon to Fri" -> [Monday..Friday]; "Sat" -> [Saturday]; "Mon, Wed" -> both. */
function parseDays(label: string): string[] {
  const out: string[] = [];
  for (const part of label.split(/[,&]|\band\b/i)) {
    const range = part.split(/\s+to\s+|\s*[-–—]\s*|\s+through\s+|\s+thru\s+/i).filter(Boolean);
    if (range.length === 2) {
      const a = dayIndex(range[0]);
      const b = dayIndex(range[1]);
      if (a < 0 || b < 0) return [];
      for (let i = a; ; i = (i + 1) % 7) {
        out.push(DAYS[i]);
        if (i === b) break;
      }
    } else if (range.length === 1) {
      const a = dayIndex(range[0]);
      if (a < 0) return [];
      out.push(DAYS[a]);
    } else {
      return [];
    }
  }
  return out;
}

/** "9am" / "9:30 AM" / "18:00" -> "09:00" / "09:30" / "18:00"; null if unreadable. */
function parseTime(raw: string): string | null {
  const m = raw.trim().toLowerCase().match(/^(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)?$/);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = m[2] ? parseInt(m[2], 10) : 0;
  const ampm = m[3]?.replace(/\./g, "");
  if (ampm === "pm" && h < 12) h += 12;
  if (ampm === "am" && h === 12) h = 0;
  if (h > 23 || min > 59) return null;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

export type OpeningHoursSpec = {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: string[];
  opens: string;
  closes: string;
};

/**
 * Turns the owner-edited hours list (site.json -> "Business Hours") into
 * schema.org OpeningHoursSpecification entries, so the hours Google reads in
 * the structured data are always the hours printed on the page.
 *
 * Rows that are not real clock hours ("Closed", "By appointment", anything
 * unreadable) are left out rather than guessed at: a missing day is how
 * schema.org says "closed", and publishing no hours beats publishing wrong ones.
 */
export function openingHoursFromSite(hours: SiteHours[] | undefined): OpeningHoursSpec[] {
  const out: OpeningHoursSpec[] = [];
  for (const row of hours ?? []) {
    const days = parseDays(row.day ?? "");
    if (days.length === 0) continue;
    const parts = (row.time ?? "").split(/\s*[-–—]\s*|\s+to\s+/i).filter(Boolean);
    if (parts.length !== 2) continue;
    const opens = parseTime(parts[0]);
    const closes = parseTime(parts[1]);
    if (!opens || !closes) continue;
    out.push({ "@type": "OpeningHoursSpecification", dayOfWeek: days, opens, closes });
  }
  return out;
}

export type InlinePart = { text: string; href?: string };

/**
 * Minimal inline-link parser for CMS text fields: "[label](/path/)" becomes a
 * link, everything else stays plain text. Only site-relative paths and
 * http(s) URLs are accepted, so a typo can never produce a javascript: link.
 */
export function parseInlineLinks(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const href = m[2];
    const safe = href.startsWith("/") || href.startsWith("#") || /^https?:\/\//i.test(href);
    if (!safe) continue;
    if (m.index > last) parts.push({ text: text.slice(last, m.index) });
    parts.push({ text: m[1], href });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}

/**
 * Trims a paragraph to a search-result description (~155 characters). Keeps
 * whole sentences where they fit; otherwise cuts at a word boundary and adds
 * an ellipsis, so a description never ends mid-word.
 */
export function toMetaDescription(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const sentences = clean.match(/[^.!?]+[.!?]+/g) ?? [];
  let out = "";
  for (const s of sentences) {
    if ((out + s).trim().length > max) break;
    out += s;
  }
  out = out.trim();
  // Too little kept (a long first sentence): cut at a word boundary instead.
  if (out.length < max * 0.5) {
    const cut = clean.slice(0, max - 1);
    out = cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:\s]+$/, "") + "…";
  }
  return out;
}
