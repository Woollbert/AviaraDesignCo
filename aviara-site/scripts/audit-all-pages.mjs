/*
 * Take per-image thumbnails from every page that renders portfolio /
 * project photography, so a human can eyeball each one for sideways /
 * upside-down errors.
 */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "audit", "all-pages");
await mkdir(OUT, { recursive: true });

const URL = process.env.URL || "https://aviaradesignco.com";
const PROJECTS = ["fallbrook-estate", "menifee-family-home", "temeku-hills-golf-estate", "big-bear-new-build"];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

async function snapPage(path, name) {
  await page.goto(URL + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  // scroll to load lazy images then back to top
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => {
        window.scrollTo(0, y);
        y += 600;
        if (y >= document.body.scrollHeight) { window.scrollTo(0, 0); resolve(); }
        else setTimeout(step, 100);
      };
      step();
    });
  });
  await page.waitForTimeout(800);
  const out = join(OUT, `${name}.png`);
  await page.screenshot({ path: out, fullPage: true });
  console.log(`  ${path} -> ${out}`);
}

await snapPage("/", "homepage");
await snapPage("/portfolio/", "portfolio-index");
for (const slug of PROJECTS) {
  await snapPage(`/portfolio/${slug}/`, `project-${slug}`);
}

await browser.close();
console.log(`\nAll screenshots in ${OUT}`);
