/*
 * Open a project page, click a photo to open the lightbox, and capture how
 * the title renders. Used to track down Brooklyn's "title looks weird"
 * report.
 */
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "audit", "lightbox");
await mkdir(OUT, { recursive: true });

// Spin up next start locally so we test the new code (Vercel may not be
// deployed yet).
const server = spawn("npm", ["run", "start"], { cwd: join(__dirname, ".."), shell: true, stdio: ["ignore", "pipe", "pipe"] });
let ready = false;
server.stdout.on("data", (d) => { if (/Ready in|Local:/.test(d.toString())) ready = true; });
const t0 = Date.now();
while (!ready && Date.now() - t0 < 30000) { await new Promise((r) => setTimeout(r, 500)); }
if (!ready) { console.error("server did not start"); process.exit(1); }
await new Promise((r) => setTimeout(r, 1500));

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const URL = "http://localhost:3000/portfolio/temeku-hills-golf-estate/";
await page.goto(URL, { waitUntil: "networkidle" });
await page.evaluate(() => document.querySelector('[data-testid="project-photo-grid"]')?.scrollIntoView());
await page.waitForTimeout(500);

// Click first photo (Dining)
await page.click('[data-testid="project-photo-0"]');
await page.waitForTimeout(600);

await page.screenshot({ path: join(OUT, "lightbox-open.png"), fullPage: false });
console.log("Lightbox screenshot ->", join(OUT, "lightbox-open.png"));

const titleInfo = await page.evaluate(() => {
  const els = document.querySelectorAll('.yarl__slide_title, [class*="yarl__slide_title"], [class*="caption"], [class*="title"]');
  return Array.from(els).map((el) => ({
    cls: el.className,
    txt: (el.textContent || "").slice(0, 80),
    tag: el.tagName,
  }));
});
console.log("\nTitle-ish elements in lightbox:");
console.log(JSON.stringify(titleInfo, null, 2));

await browser.close();
server.kill();
process.exit(0);
