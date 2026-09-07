/*
 * Verify recent changes render correctly on iPhone 14 Pro viewport:
 *   - Footer LinkedIn icon present + clickable
 *   - Footer brand column centered (logo + wordmark + tagline)
 *   - Logo monogram visual center aligned with wordmark center
 *   - Portfolio uniform-card grid
 *   - Lightbox opens with custom room label, no doubled title
 */
import { chromium, devices } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "audit", "mobile");
await mkdir(OUT, { recursive: true });

const URL = process.env.URL || "https://aviaradesignco.com";
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 14 Pro"] });
const page = await ctx.newPage();

console.log("=== Homepage footer ===");
await page.goto(URL + "/", { waitUntil: "networkidle" });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(800);

const footer = await page.evaluate(() => {
  const f = document.querySelector("footer");
  const brandCol = f.querySelector("img[alt='Aviara Design Co.']")?.closest("div");
  const logo = brandCol?.querySelector("span.relative");
  const wordmark = Array.from(brandCol?.querySelectorAll("p") || []).find((p) => /Aviara Design Co/.test(p.textContent || ""));
  const socials = f.querySelectorAll("a[aria-label*='Aviara'], a[aria-label*='LinkedIn'], a[aria-label*='Brooklyn']");
  const r = (el) => { if (!el) return null; const x = el.getBoundingClientRect(); return { left: Math.round(x.left), right: Math.round(x.right), center: Math.round((x.left + x.right) / 2), w: Math.round(x.width) }; };
  return {
    brandCol: r(brandCol),
    logo: r(logo),
    wordmark: r(wordmark),
    socialCount: socials.length,
    socialLabels: Array.from(socials).map((a) => a.getAttribute("aria-label")),
  };
});
console.log(JSON.stringify(footer, null, 2));

await page.screenshot({ path: join(OUT, "homepage-footer.png"), clip: { x: 0, y: 0, width: 393, height: 660 }, fullPage: false });
// scroll to footer and snap
await page.evaluate(() => document.querySelector("footer")?.scrollIntoView());
await page.waitForTimeout(400);
await page.screenshot({ path: join(OUT, "footer-mobile.png"), fullPage: false });
console.log("Footer screenshot ->", join(OUT, "footer-mobile.png"));

console.log("\n=== Portfolio project page (Temeku) ===");
await page.goto(URL + "/portfolio/temeku-hills-golf-estate/", { waitUntil: "networkidle" });
await page.evaluate(() => document.querySelector('[data-testid="project-photo-grid"]')?.scrollIntoView());
await page.waitForTimeout(500);
await page.screenshot({ path: join(OUT, "project-gallery-mobile.png"), fullPage: false });

const grid = await page.evaluate(() => {
  const g = document.querySelector('[data-testid="project-photo-grid"]');
  return {
    cols: getComputedStyle(g).gridTemplateColumns,
    childCount: g.children.length,
  };
});
console.log("Grid:", JSON.stringify(grid));

// Tap first photo
await page.click('[data-testid="project-photo-0"]');
await page.waitForTimeout(800);
await page.screenshot({ path: join(OUT, "lightbox-mobile.png"), fullPage: false });

const title = await page.evaluate(() => {
  // Custom label
  const label = document.querySelector('div.fixed.top-4.left-4');
  return label ? { text: label.textContent, classes: label.className } : { error: "no custom label" };
});
console.log("Lightbox label:", JSON.stringify(title));

await browser.close();
console.log("\nScreenshots in", OUT);
