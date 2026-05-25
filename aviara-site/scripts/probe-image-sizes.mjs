/*
 * Reads pixel dimensions for every photo referenced by content JSON and
 * writes a sidecar map at src/content/_image-sizes.json. The portfolio
 * loader joins this map at module load time so react-photo-album can lay
 * out photos at their native aspect ratios (mix of portrait + landscape).
 *
 * Run: node scripts/probe-image-sizes.mjs
 * Also wired as `prebuild` in package.json so deploys always have fresh
 * sizes.
 */
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PROJECTS_DIR = join(ROOT, "src", "content", "projects");
const PUBLIC_DIR = join(ROOT, "public");
const OUT = join(ROOT, "src", "content", "_image-sizes.json");

// Collect every photo path referenced by any project file.
const refs = new Set();
const projectFiles = (await readdir(PROJECTS_DIR)).filter((f) => f.endsWith(".json"));
for (const f of projectFiles) {
  const p = JSON.parse(await readFile(join(PROJECTS_DIR, f), "utf8"));
  if (p.coverImage) refs.add(p.coverImage);
  for (const ph of p.photos || []) if (ph.url) refs.add(ph.url);
}

const map = {};
for (const url of refs) {
  const path = join(PUBLIC_DIR, url.replace(/^\//, ""));
  try {
    await stat(path);
    const m = await sharp(path).metadata();
    map[url] = { w: m.width, h: m.height };
  } catch (e) {
    console.warn(`  skip (missing/unreadable): ${url}`);
  }
}

await writeFile(OUT, JSON.stringify(map, null, 2) + "\n");
console.log(`Wrote ${Object.keys(map).length} entries to ${OUT}`);
