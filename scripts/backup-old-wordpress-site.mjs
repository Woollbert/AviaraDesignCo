// Scrapes the publicly-visible parts of the old WordPress site at
// aviaradesignco.com and saves a static archive to backups/old-wordpress-site/.
// This is NOT a WordPress backup — it captures only what visitors can see:
// rendered HTML, images, videos, CSS, JS. The MySQL database, admin settings,
// form submissions, and plugin configs are NOT included.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'backups', 'old-wordpress-site');
const ORIGIN = 'https://aviaradesignco.com';
const USER_AGENT = 'Mozilla/5.0 (Backup Bot) Aviara-Site-Archive/1.0';

// All known pages (from page-sitemap.xml + post-sitemap.xml)
const PAGES = [
  '/',
  '/consultation/',
  '/contact/',
  '/for-realtors/',
  '/the-aviara-experience/',
  '/faq/',
  '/services/',
  '/portfolio/',
  '/before-after/',
  '/testimonial/',
  '/blog/',
  '/fallbrook/',
  '/menifee/',
  '/murrieta/',
  '/temecula/',
  '/service-area/',
  '/what-realtors-should-know-about-home-staging-in-southern-california/',
  '/how-to-make-your-listing-stand-out-in-a-competitive-market/',
  '/vacant-vs-occupied-home-staging-which-is-right-for-your-listing/',
  '/5-ways-to-prepare-your-home-for-sale-without-full-staging/',
  '/how-home-staging-helps-homes-sell-faster-in-temecula-ca/',
];

const seenAssets = new Set();
const stats = { pages: 0, assets: 0, bytes: 0, errors: [] };

function urlToLocalPath(url) {
  const u = new URL(url);
  let p = u.pathname;
  if (p === '/' || p === '') p = '/index.html';
  if (p.endsWith('/')) p = p + 'index.html';
  return path.join(OUT_DIR, p);
}

async function fetchToFile(url, localPath) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.mkdir(path.dirname(localPath), { recursive: true });
  await fs.writeFile(localPath, buf);
  return buf;
}

function extractAssetUrls(html) {
  const urls = new Set();
  // src/href in any HTML attribute
  const re = /(?:src|href|content|data-src|data-bg|data-image-src|poster)\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim();
    if (!raw) continue;
    // Normalize protocol-relative + relative URLs against the origin
    let abs;
    try { abs = new URL(raw, ORIGIN).toString(); } catch { continue; }
    // Only keep same-origin assets
    if (!abs.startsWith(ORIGIN)) continue;
    // Skip URLs that look like pages we already plan to crawl
    if (abs.match(/\/$|\.html?$/i)) continue;
    urls.add(abs);
  }
  // Background videos via Elementor (data-settings JSON)
  const videoRe = /"background_video_link"\s*:\s*"([^"]+)"/g;
  while ((m = videoRe.exec(html)) !== null) {
    const raw = m[1].replace(/\\\//g, '/');
    try {
      const abs = new URL(raw, ORIGIN).toString();
      if (abs.startsWith(ORIGIN)) urls.add(abs);
    } catch {}
  }
  // CSS-embedded url(...)
  const cssRe = /url\(\s*["']?([^"')]+?)["']?\s*\)/gi;
  while ((m = cssRe.exec(html)) !== null) {
    const raw = m[1].trim();
    if (raw.startsWith('data:')) continue;
    try {
      const abs = new URL(raw, ORIGIN).toString();
      if (abs.startsWith(ORIGIN) && !abs.match(/\/$|\.html?$/i)) urls.add(abs);
    } catch {}
  }
  return urls;
}

async function backupPage(pagePath) {
  const url = ORIGIN + pagePath;
  const local = urlToLocalPath(url);
  process.stdout.write(`page: ${pagePath} ... `);
  try {
    const buf = await fetchToFile(url, local);
    const html = buf.toString('utf-8');
    stats.pages++;
    stats.bytes += buf.length;
    console.log(`${(buf.length / 1024).toFixed(1)} KB`);
    return extractAssetUrls(html);
  } catch (e) {
    console.log(`FAIL: ${e.message}`);
    stats.errors.push({ url, error: e.message });
    return new Set();
  }
}

async function backupAsset(url) {
  if (seenAssets.has(url)) return;
  seenAssets.add(url);
  const local = urlToLocalPath(url);
  try {
    const buf = await fetchToFile(url, local);
    stats.assets++;
    stats.bytes += buf.length;
    if (stats.assets % 25 === 0) process.stdout.write(`  …${stats.assets} assets done\n`);
  } catch (e) {
    stats.errors.push({ url, error: e.message });
  }
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  console.log(`\nBacking up ${PAGES.length} pages from ${ORIGIN} → ${OUT_DIR}\n`);

  const allAssets = new Set();
  for (const p of PAGES) {
    const assets = await backupPage(p);
    for (const a of assets) allAssets.add(a);
  }

  console.log(`\n${allAssets.size} unique assets to download...`);
  // Download assets in parallel batches of 8 to be polite
  const list = [...allAssets];
  const BATCH = 8;
  for (let i = 0; i < list.length; i += BATCH) {
    await Promise.all(list.slice(i, i + BATCH).map(backupAsset));
  }

  console.log(`\n=== Summary ===`);
  console.log(`Pages:  ${stats.pages}/${PAGES.length}`);
  console.log(`Assets: ${stats.assets}/${allAssets.size}`);
  console.log(`Size:   ${(stats.bytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Errors: ${stats.errors.length}`);
  if (stats.errors.length > 0) {
    console.log('\nFirst 10 errors:');
    stats.errors.slice(0, 10).forEach((e) => console.log(`  ${e.url} → ${e.error}`));
  }

  // Write a manifest
  const manifest = {
    archivedAt: new Date().toISOString(),
    source: ORIGIN,
    pages: PAGES,
    stats,
  };
  await fs.writeFile(path.join(OUT_DIR, '_manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\nManifest: ${path.join(OUT_DIR, '_manifest.json')}`);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
