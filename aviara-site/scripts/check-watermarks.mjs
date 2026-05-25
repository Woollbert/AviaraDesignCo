/*
 * Mobile watermark visibility check against the live site.
 * Loads the homepage at iPhone 14 Pro viewport, scrolls each section
 * containing a .watermark, reports computed display, font-size, bounding
 * box, and whether any pixels are actually visible inside the viewport.
 */
import { chromium, devices } from "@playwright/test";

const URL = process.env.URL || "https://aviaradesignco.com/";
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 14 Pro"] });
const page = await ctx.newPage();

await page.goto(URL, { waitUntil: "networkidle" });

const results = await page.$$eval(".watermark", (els) => {
  return els.map((el) => {
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const parent = el.closest("section");
    const parentRect = parent ? parent.getBoundingClientRect() : null;
    return {
      text: (el.textContent || "").trim(),
      classes: el.className,
      display: cs.display,
      visibility: cs.visibility,
      opacity: cs.opacity,
      fontSize: cs.fontSize,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      left: Math.round(rect.left),
      top: Math.round(rect.top),
      parentSection: parent ? parent.id || parent.className.slice(0, 40) : null,
      parentOverflow: parent ? getComputedStyle(parent).overflow : null,
    };
  });
});

console.log(JSON.stringify({ url: URL, viewport: ctx.pages()[0].viewportSize(), watermarks: results }, null, 2));

await browser.close();
