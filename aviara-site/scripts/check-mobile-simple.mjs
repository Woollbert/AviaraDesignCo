import { chromium, devices } from "@playwright/test";
import { mkdir } from "node:fs/promises";

await mkdir("audit/mobile", { recursive: true });

const browser = await chromium.launch();
// Use a normal Chrome UA to skip Vercel bot challenge, plus iPhone viewport+touch
const dev = devices["iPhone 14 Pro"];
const ctx = await browser.newContext({
  viewport: dev.viewport,
  isMobile: dev.isMobile,
  hasTouch: dev.hasTouch,
  deviceScaleFactor: dev.deviceScaleFactor,
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});
const page = await ctx.newPage();
await page.goto("https://aviaradesignco.com/", { waitUntil: "networkidle" });

// Footer
await page.evaluate(() => document.querySelector("footer")?.scrollIntoView({ block: "start" }));
await page.waitForTimeout(800);
await page.screenshot({ path: "audit/mobile/footer-mobile.png" });

// LinkedIn check
const socials = await page.$$eval("footer a[aria-label]", as => as.filter(a => /Instagram|Facebook|LinkedIn|Brooklyn/i.test(a.getAttribute("aria-label"))).map(a => a.getAttribute("aria-label")));
console.log("Footer social links:", socials);

// Logo centering check
const align = await page.evaluate(() => {
  const f = document.querySelector("footer");
  const logo = f.querySelector("span.relative.inline-block");
  const wm = Array.from(f.querySelectorAll("p")).find(p => /Aviara Design Co/.test(p.textContent || ""));
  const r = el => { const x = el.getBoundingClientRect(); return { center: Math.round((x.left + x.right) / 2), w: Math.round(x.width) }; };
  return { logo: r(logo), wordmark: r(wm) };
});
console.log("Footer alignment:", JSON.stringify(align));

// Portfolio gallery
await page.goto("https://aviaradesignco.com/portfolio/temeku-hills-golf-estate/", { waitUntil: "networkidle" });
await page.evaluate(() => document.querySelector('[data-testid="project-photo-grid"]')?.scrollIntoView());
await page.waitForTimeout(500);
await page.screenshot({ path: "audit/mobile/gallery-mobile.png" });

const cols = await page.evaluate(() => {
  const g = document.querySelector('[data-testid="project-photo-grid"]');
  return g ? getComputedStyle(g).gridTemplateColumns : "no-grid";
});
console.log("Mobile gallery columns:", cols);

// Tap first photo, check lightbox label
await page.tap('[data-testid="project-photo-0"]');
await page.waitForTimeout(800);
await page.screenshot({ path: "audit/mobile/lightbox-mobile.png" });

const labelText = await page.evaluate(() => {
  const l = document.querySelector('div.fixed.top-4.left-4');
  return l ? l.textContent : null;
});
console.log("Lightbox label text:", labelText);

await browser.close();
