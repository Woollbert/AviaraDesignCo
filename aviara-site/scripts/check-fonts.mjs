/*
 * Verify what fonts are actually rendered on the live site, page-by-page.
 * Looks at computed font-family for headlines + body, lists every <link
 * rel=preload as=font>, and confirms the next/font CSS vars are present.
 */
import { chromium } from "@playwright/test";

const URL = process.env.URL || "https://aviaradesignco.com/";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto(URL, { waitUntil: "networkidle" });

const info = await page.evaluate(() => {
  // 1. next/font CSS vars on <html>
  const htmlCS = getComputedStyle(document.documentElement);
  const sansVar = htmlCS.getPropertyValue("--font-sans").trim();
  const displayVar = htmlCS.getPropertyValue("--font-display").trim();

  // 2. Sample what's actually rendered
  const samples = {};
  for (const sel of ["h1", "h2", "p", ".eyebrow", ".btn", "footer .footer-brand-center p:first-of-type", "footer h4"]) {
    const el = document.querySelector(sel);
    if (!el) continue;
    const cs = getComputedStyle(el);
    samples[sel] = {
      family: cs.fontFamily,
      weight: cs.fontWeight,
      size: cs.fontSize,
      transform: cs.transform,
      // The big one — if a transform is applied to this or an ancestor,
      // text rendering may swap from subpixel to grayscale AA on macOS/Windows.
      ancestorTransform: (function () {
        let n = el.parentElement, txes = [];
        while (n) {
          const t = getComputedStyle(n).transform;
          if (t && t !== "none") txes.push(`${n.tagName}.${n.className.slice(0, 30)}=${t}`);
          n = n.parentElement;
        }
        return txes;
      })(),
    };
  }

  // 3. Font files preloaded
  const preloads = Array.from(document.querySelectorAll("link[as=font]")).map((l) => l.href);

  return { sansVar, displayVar, samples, preloads };
});

console.log(JSON.stringify(info, null, 2));
await browser.close();
