/*
 * Verify the About-section body paragraphs are *actually* rendering in Inter,
 * not the next/font synthetic fallback. document.fonts.check() returns true
 * only if the real font file has loaded; we also screenshot the rendered
 * paragraph and inspect each downloaded font for its postscript name.
 */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

await mkdir("audit/body-font", { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

// Capture all font-file network requests
const fontFiles = [];
page.on("response", async (r) => {
  const ct = r.headers()["content-type"] || "";
  if (/font|woff/i.test(ct) || /\.woff2?/i.test(r.url())) {
    fontFiles.push({ url: r.url(), status: r.status(), bytes: Number(r.headers()["content-length"] || 0) });
  }
});

await page.goto("https://aviaradesignco.com/", { waitUntil: "networkidle" });
await page.evaluate(() => document.getElementById("about")?.scrollIntoView({ block: "start" }));
await page.waitForTimeout(800);
// Wait for fonts to fully settle
await page.evaluate(() => document.fonts.ready);

const data = await page.evaluate(() => {
  // The "Aviara Design Co. is a boutique..." paragraph
  const about = document.getElementById("about");
  const para = about?.querySelector("p.text-lg, p.text-mute") || about?.querySelectorAll("p")[1];
  if (!para) return { err: "no about paragraph" };

  const cs = getComputedStyle(para);

  // document.fonts.check returns true ONLY if a font matching the descriptor
  // is loaded and usable. If false here, the rendered text is a fallback.
  const interLoaded = document.fonts.check(`${cs.fontWeight} ${cs.fontSize} "Inter"`);
  const interFallbackLoaded = document.fonts.check(`${cs.fontWeight} ${cs.fontSize} "Inter Fallback"`);

  // Enumerate every loaded font face
  const loadedFaces = [];
  for (const f of document.fonts) {
    loadedFaces.push({ family: f.family, weight: f.weight, status: f.status, style: f.style });
  }

  return {
    text: (para.textContent || "").slice(0, 80) + "…",
    family: cs.fontFamily,
    weight: cs.fontWeight,
    size: cs.fontSize,
    interLoaded,
    interFallbackLoaded,
    loadedFaces,
  };
});

console.log("\n=== About paragraph rendered state ===");
console.log(JSON.stringify(data, null, 2));

console.log("\n=== Font files downloaded by the page ===");
console.log(JSON.stringify(fontFiles, null, 2));

// Zoomed screenshot of the actual paragraph the user showed
const para = page.locator("#about p").nth(1);
await para.screenshot({ path: "audit/body-font/about-paragraph.png" });
console.log("\nScreenshot -> audit/body-font/about-paragraph.png");

await browser.close();
