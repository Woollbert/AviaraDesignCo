/*
 * After every production deploy, ping the IndexNow API with our sitemap
 * URLs so Bing, Yandex, DuckDuckGo, Yep, and Naver re-crawl them within
 * hours instead of days. Google does not implement IndexNow directly but
 * uses freshness signals indirectly.
 *
 * Runs as `postbuild` in package.json, but only on Vercel production
 * (VERCEL_ENV=production). Local builds and preview deploys are skipped.
 *
 * Key handshake: api.indexnow.org verifies we own the domain by fetching
 * /<KEY>.txt from our site and confirming it equals KEY. The key file
 * lives at public/<KEY>.txt and is committed to the repo so it ships
 * with every deploy.
 *
 * Failures never fail the build — IndexNow being down should not block
 * a deploy.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const HOST = "aviaradesignco.com";

async function findKey() {
  const publicDir = join(__dirname, "..", "public");
  const entries = await readdir(publicDir);
  const match = entries.find((f) => /^[a-f0-9-]{32,}\.txt$/i.test(f));
  if (!match) return null;
  const key = match.replace(/\.txt$/, "");
  const contents = (await readFile(join(publicDir, match), "utf8")).trim();
  if (contents !== key) {
    console.warn(`[indexnow] ${match} content (${contents}) doesn't match the filename (${key}); skip`);
    return null;
  }
  return key;
}

async function getSitemapUrls() {
  const res = await fetch(`https://${HOST}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function main() {
  if (process.env.VERCEL_ENV !== "production") {
    console.log("[indexnow] not production (VERCEL_ENV=" + (process.env.VERCEL_ENV || "unset") + "), skipping");
    return;
  }
  const key = await findKey();
  if (!key) {
    console.log("[indexnow] no key file in /public/, skipping");
    return;
  }
  let urls;
  try {
    urls = await getSitemapUrls();
  } catch (e) {
    console.warn("[indexnow] could not fetch sitemap, skipping:", e.message);
    return;
  }
  if (!urls.length) {
    console.log("[indexnow] sitemap had no URLs, skipping");
    return;
  }

  const body = {
    host: HOST,
    key,
    keyLocation: `https://${HOST}/${key}.txt`,
    urlList: urls,
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      console.log(`[indexnow] OK — submitted ${urls.length} URLs (${res.status})`);
    } else {
      console.warn(`[indexnow] non-2xx response: ${res.status} ${await res.text().catch(() => "")}`);
    }
  } catch (e) {
    console.warn("[indexnow] request failed:", e.message);
  }
}

await main();
