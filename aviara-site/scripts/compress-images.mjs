/*
 * One-time compression pass for /public/images/.
 *
 * Mirrors what the admin upload pipeline does for new uploads: resize to
 * max 2400px on the long edge and re-encode JPEG at quality 0.82. PNGs with
 * no transparency get converted to JPEG; PNGs with transparency keep their
 * format but get palette-optimized. Originals are replaced in place — we
 * already have the master copies on Brooklyn's phone / iCloud, and next/image
 * generates further per-device variants at request time anyway.
 *
 * Run from the repo root: node aviara-site/scripts/compress-images.mjs
 */
import { readdir, stat, readFile, writeFile, rename, unlink } from "node:fs/promises";
import { join, extname } from "node:path";
import sharp from "sharp";

const DIR = new URL("../public/images/", import.meta.url);
const MAX_DIMENSION = 2400;
const MAX_SIZE = 1024 * 1024;
const JPEG_QUALITY = 82;
const SKIP = new Set([".svg", ".ico", ".webp", ".gif"]);

function fmt(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}

async function processFile(name) {
  const path = join(DIR.pathname.replace(/^\/([a-zA-Z]):/, "$1:"), name);
  const ext = extname(name).toLowerCase();
  if (SKIP.has(ext)) return null;

  const before = (await stat(path)).size;
  if (before <= MAX_SIZE) return null;

  const buf = await readFile(path);
  // .rotate() with no args auto-applies EXIF orientation and strips the tag,
  // so the saved pixels are already right-side-up. Without this the script
  // strips EXIF but leaves pixels in sensor orientation — exactly how a
  // bunch of iPhone landscape photos ended up rendering sideways on the
  // portfolio pages.
  const img = sharp(buf, { failOn: "none" }).rotate();
  const meta = await sharp(buf).rotate().metadata();
  const longEdge = Math.max(meta.width || 0, meta.height || 0);
  const resize = longEdge > MAX_DIMENSION
    ? img.resize({ width: meta.width >= meta.height ? MAX_DIMENSION : null,
                   height: meta.height > meta.width ? MAX_DIMENSION : null,
                   withoutEnlargement: true })
    : img;

  const hasAlpha = meta.hasAlpha && ext === ".png";
  let outBuf, outName;
  if (hasAlpha) {
    outBuf = await resize.png({ compressionLevel: 9, palette: true }).toBuffer();
    outName = name;
  } else {
    outBuf = await resize.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
    outName = name.replace(/\.(png|tiff?|heic|heif)$/i, ".jpeg");
  }

  if (outBuf.length >= before) {
    return { name, before, after: before, skipped: true, reason: "no gain" };
  }

  if (outName === name) {
    await writeFile(path, outBuf);
  } else {
    const newPath = join(DIR.pathname.replace(/^\/([a-zA-Z]):/, "$1:"), outName);
    await writeFile(newPath, outBuf);
    await unlink(path);
  }
  return { name, outName, before, after: outBuf.length };
}

const entries = await readdir(DIR);
const results = [];
for (const name of entries.sort()) {
  try {
    const r = await processFile(name);
    if (r) results.push(r);
  } catch (err) {
    console.error(`  skip ${name}: ${err.message}`);
  }
}

if (results.length === 0) {
  console.log("Nothing over 1 MB — already optimized.");
  process.exit(0);
}

let totalBefore = 0, totalAfter = 0;
for (const r of results) {
  totalBefore += r.before;
  totalAfter += r.after;
  const arrow = r.outName && r.outName !== r.name ? ` -> ${r.outName}` : "";
  const tag = r.skipped ? "  skip" : "  ok  ";
  console.log(`${tag} ${r.name}${arrow}  ${fmt(r.before)} -> ${fmt(r.after)}`);
}
console.log(`\nTotal: ${fmt(totalBefore)} -> ${fmt(totalAfter)}  (saved ${fmt(totalBefore - totalAfter)})`);
