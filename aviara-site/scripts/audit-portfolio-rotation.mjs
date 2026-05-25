/*
 * Scan every portfolio project. For each photo URL, read the local file's
 * actual pixel dimensions and flag every landscape-oriented one as a
 * candidate for either rotation or landscape display. Then visit each
 * project page on the live site and screenshot how those photos currently
 * render in the gallery so we can review them.
 */
import { readdir, readFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { chromium, devices } from "@playwright/test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PROJECTS = join(ROOT, "src", "content", "projects");
const PUBLIC = join(ROOT, "public");
const OUT = join(__dirname, "..", "audit", "rotation");
await mkdir(OUT, { recursive: true });

const URL = process.env.URL || "https://aviaradesignco.com";

// --- step 1: load projects + collect all photo refs
const projectFiles = await readdir(PROJECTS);
const candidates = []; // { project, slug, url, w, h, kind }

for (const f of projectFiles) {
  const raw = JSON.parse(await readFile(join(PROJECTS, f), "utf8"));
  const slug = raw.slug || f.replace(/\.json$/, "");
  const title = raw.title || slug;

  // cover image
  if (raw.coverImage) {
    candidates.push({ project: title, slug, role: "cover", url: raw.coverImage, alt: raw.coverImageAlt });
  }
  // gallery photos
  for (const p of raw.photos || []) {
    candidates.push({ project: title, slug, role: "photo", room: p.room, url: p.url, alt: p.alt });
  }
}

// --- step 2: pixel-probe each one
for (const c of candidates) {
  const path = join(PUBLIC, c.url.replace(/^\//, ""));
  try {
    const m = await sharp(path).metadata();
    c.w = m.width; c.h = m.height;
    c.orientation = m.width > m.height ? "landscape" : m.width < m.height ? "portrait" : "square";
  } catch (e) {
    c.orientation = "MISSING_FILE";
  }
}

// --- step 3: report all + flag landscape
console.log("\n=== ALL PORTFOLIO PHOTOS ===");
console.table(candidates.map(c => ({
  project: c.project.slice(0, 28),
  role: c.role,
  room: c.room || "-",
  file: c.url.split("/").pop(),
  size: c.w && c.h ? `${c.w}x${c.h}` : c.orientation,
  orient: c.orientation,
})));

const landscape = candidates.filter(c => c.orientation === "landscape");
console.log(`\n=== ${landscape.length} LANDSCAPE PHOTOS (rotation candidates OR want landscape display) ===`);
for (const c of landscape) {
  console.log(`  ${c.project} (${c.slug}) - ${c.role} ${c.room || ""}: ${c.url.split("/").pop()} ${c.w}x${c.h}`);
}

// --- step 4: take screenshots of how landscape photos currently render
if (landscape.length === 0) {
  console.log("\nNo landscape photos found in portfolio data. Nothing to screenshot.");
  process.exit(0);
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

console.log("\n=== TAKING SCREENSHOTS ===");
const seenSlugs = new Set();
for (const c of landscape) {
  if (seenSlugs.has(c.slug)) continue;
  seenSlugs.add(c.slug);
  const pageUrl = `${URL}/portfolio/${c.slug}/`;
  await page.goto(pageUrl, { waitUntil: "networkidle" });
  // scroll to gallery
  await page.evaluate(() => {
    const grid = document.querySelector('[data-testid="project-photo-grid"]');
    if (grid) grid.scrollIntoView({ behavior: "instant", block: "start" });
  });
  await page.waitForTimeout(800);
  const out = join(OUT, `${c.slug}.png`);
  await page.screenshot({ path: out, fullPage: true });
  console.log(`  ${pageUrl} -> ${out}`);
}

await browser.close();
console.log(`\nScreenshots in ${OUT}`);
