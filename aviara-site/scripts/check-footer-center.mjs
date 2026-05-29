import { chromium } from "@playwright/test";
const widths = [768, 1024, 1440, 1920, 2560];
const browser = await chromium.launch();
for (const w of widths) {
  const page = await (await browser.newContext({ viewport: { width: w, height: 900 } })).newPage();
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.querySelector("footer")?.scrollIntoView());
  await page.waitForTimeout(400);
  const m = await page.evaluate(() => {
    const f = document.querySelector("footer");
    const brand = f && f.querySelector(".footer-brand-center");
    const grid = f && f.querySelector(".grid");
    const cols = grid ? grid.children : [];
    const svc = cols[1];
    if (!brand || !svc) return { err: `brand=${!!brand} svc=${!!svc} cols=${cols.length}` };
    const br = brand.getBoundingClientRect();
    const sr = svc.getBoundingClientRect();
    return { brandCenter: Math.round((br.left + br.right) / 2), dividerX: Math.round(sr.left), ideal: Math.round(sr.left / 2), brandLeft: Math.round(br.left) };
  });
  if (m.err) { console.log(`w=${w}: ${m.err}`); continue; }
  const off = m.brandCenter - m.ideal;
  console.log(`w=${String(w).padEnd(5)} brandCenter=${m.brandCenter}  divider=${m.dividerX}  ideal=${m.ideal}  off=${off>0?'+':''}${off}px`);
  await page.close();
}
await browser.close();
