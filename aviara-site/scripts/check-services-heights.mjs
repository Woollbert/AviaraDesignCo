import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newContext({ viewport: { width: 1440, height: 900 } }).then(c => c.newPage());
await page.goto("https://aviaradesignco.com/", { waitUntil: "networkidle" });
await page.evaluate(() => document.getElementById("services").scrollIntoView());
await page.waitForTimeout(400);

const buttons = await page.$$('button[data-testid^="service-"]');
const heights = [];
for (const b of buttons) {
  const slug = await b.getAttribute("data-testid");
  await b.click();
  await page.waitForTimeout(250);
  const m = await page.evaluate(() => {
    const grid = document.querySelector('[data-testid="service-detail"]');
    const img = grid.children[0];
    const txt = grid.children[1];
    const inquire = txt.querySelector('a.btn');
    return {
      grid: Math.round(grid.getBoundingClientRect().height),
      imgCol: Math.round(img.getBoundingClientRect().height),
      txtCol: Math.round(txt.getBoundingClientRect().height),
      gridStyle: getComputedStyle(grid).height,
      inquireBottom: inquire ? Math.round(inquire.getBoundingClientRect().bottom - grid.getBoundingClientRect().top) : null,
    };
  });
  heights.push({ slug, ...m });
}
console.table(heights);

await browser.close();
