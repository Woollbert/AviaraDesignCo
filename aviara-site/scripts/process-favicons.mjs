// One-off: take Aviara's source logo and emit adaptive favicon variants.
//
// Produces:
//   - favicon-{16,32,48,192}-light.png  (dark logo on circular cream bg — for light browser themes)
//   - favicon-{16,32,48,192}-dark.png   (light logo on circular ink bg  — for dark browser themes)
//   - apple-touch-icon.png              (180x180, ink bg)
//   - favicon.ico                       (multi-size, used by Google/Bing search results)
//   - logo-256.png / logo-512.png       (transparent for in-site use)
//
// All favicon variants are circular (cream/ink disc with the AD monogram
// centered) so the icon reads as a polished brand mark regardless of the
// browser-tab background.
//
// Run: node scripts/process-favicons.mjs

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = path.resolve('../Logo/Photoroom_20260318_140223.PNG');
const OUT = path.resolve('public');

// Aviara brand colors (must match globals.css)
const INK = { r: 28, g: 24, b: 21, alpha: 1 };       // --color-ink   #1c1815
const BONE = { r: 244, g: 239, b: 232, alpha: 1 };   // --color-bone  #f4efe8

// Build a circular mask of the given size. Sharp composites with `dest-in`
// keep only pixels under the white area, producing a clean disc.
function circleMask(size) {
  const r = size / 2;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><circle cx="${r}" cy="${r}" r="${r}" fill="white"/></svg>`
  );
}

const buf = await fs.readFile(SRC);
const meta = await sharp(buf).metadata();
console.log(`source: ${meta.width}x${meta.height} (${(buf.length / 1024).toFixed(1)} KB)`);

// Trim outer whitespace so the logo mark fills its square cleanly.
const trimmed = await sharp(buf).trim().toBuffer();

// === Transparent logo at common sizes (for in-page use, e.g. Navbar/Footer) ===
for (const size of [256, 512]) {
  const out = await sharp(trimmed)
    .resize({ width: size, height: size, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 90, compressionLevel: 9 })
    .toBuffer();
  await fs.writeFile(path.join(OUT, `logo-${size}.png`), out);
  console.log(`✓ public/logo-${size}.png (${(out.length / 1024).toFixed(1)} KB)`);
}

// Pre-build an inverted (cream-on-transparent) version for use on ink backgrounds.
const trimmedInverted = await sharp(trimmed)
  .ensureAlpha()
  .negate({ alpha: false })
  .toBuffer();

// === Adaptive favicons at 16/32/48/192 — dark logo on circular cream + cream logo on circular ink ===
for (const size of [16, 32, 48, 192]) {
  const innerSize = Math.round(size * 0.7); // inset so the logo sits comfortably inside the disc
  const mask = circleMask(size);

  // LIGHT variant: dark logo composited onto a circular cream disc
  const darkLogo = await sharp(trimmed)
    .resize({ width: innerSize, height: innerSize, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const light = await sharp({
    create: { width: size, height: size, channels: 4, background: BONE },
  })
    .composite([
      { input: darkLogo, gravity: 'center' },
      { input: mask, blend: 'dest-in' },
    ])
    .png()
    .toBuffer();
  await fs.writeFile(path.join(OUT, `favicon-${size}-light.png`), light);
  console.log(`✓ public/favicon-${size}-light.png (${(light.length / 1024).toFixed(1)} KB)`);

  // DARK variant: cream/inverted logo composited onto a circular ink disc
  const lightLogo = await sharp(trimmedInverted)
    .resize({ width: innerSize, height: innerSize, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const dark = await sharp({
    create: { width: size, height: size, channels: 4, background: INK },
  })
    .composite([
      { input: lightLogo, gravity: 'center' },
      { input: mask, blend: 'dest-in' },
    ])
    .png()
    .toBuffer();
  await fs.writeFile(path.join(OUT, `favicon-${size}-dark.png`), dark);
  console.log(`✓ public/favicon-${size}-dark.png (${(dark.length / 1024).toFixed(1)} KB)`);
}

// === Apple touch icon (180x180) — full-bleed cream square with the dark
// monogram centered. iOS auto-rounds the corners on the home screen, so we
// keep the canvas square (not masked) for clean cream edges all the way out. ===
const appleSize = 180;
const appleInner = Math.round(appleSize * 0.7);
const appleLogo = await sharp(trimmed)
  .resize({ width: appleInner, height: appleInner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();
const apple = await sharp({
  create: { width: appleSize, height: appleSize, channels: 4, background: BONE },
})
  .composite([{ input: appleLogo, gravity: 'center' }])
  .png()
  .toBuffer();
await fs.writeFile(path.join(OUT, 'apple-touch-icon.png'), apple);
console.log(`✓ public/apple-touch-icon.png (${(apple.length / 1024).toFixed(1)} KB)`);

// === favicon.ico — Google/Bing fetch this URL directly when picking the icon
// for search results. Pack the circular cream variant so the icon reads as the
// brand mark on white search-result pages. Built inline (no extra deps) by
// writing the ICO header.
async function pngBufForFavicon(size) {
  return await fs.readFile(path.join(OUT, `favicon-${size}-light.png`));
}
const icoSizes = [16, 32, 48];
const pngs = await Promise.all(icoSizes.map(pngBufForFavicon));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: 1 = icon
header.writeUInt16LE(pngs.length, 4);
const dirEntries = [];
let offset = 6 + 16 * pngs.length;
for (let i = 0; i < pngs.length; i++) {
  const size = icoSizes[i];
  const png = pngs[i];
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size === 256 ? 0 : size, 0);
  entry.writeUInt8(size === 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(offset, 12);
  dirEntries.push(entry);
  offset += png.length;
}
const ico = Buffer.concat([header, ...dirEntries, ...pngs]);
await fs.writeFile(path.join(OUT, 'favicon.ico'), ico);
console.log(`✓ public/favicon.ico (${(ico.length / 1024).toFixed(1)} KB, ${icoSizes.join('/')}px)`);

console.log('\nDone.');
