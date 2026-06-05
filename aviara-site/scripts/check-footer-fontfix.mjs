import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
await mkdir("audit/footer-font", { recursive: true });

const browser = await chromium.launch();

for (const [label, url] of [["before-live", "https://aviaradesignco.com/"], ["after-local", "http://localhost:3000/"]]) {
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })).newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.querySelector("footer")?.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(600);
  const brand = page.locator(".footer-brand-center").first();
  if (await brand.count() === 0) { console.log(`${label}: no brand element`); continue; }

  const m = await brand.evaluate((el) => {
    const cs = getComputedStyle(el);
    const wm = el.querySelector("p");
    return {
      brand_transform: cs.transform,
      brand_position: cs.position,
      brand_left: cs.left,
      wordmark_family: getComputedStyle(wm).fontFamily,
    };
  });
  console.log(`\n=== ${label} (${url}) ===`);
  console.log(JSON.stringify(m, null, 2));
  await brand.screenshot({ path: `audit/footer-font/${label}.png` });
  await page.close();
}
await browser.close();
