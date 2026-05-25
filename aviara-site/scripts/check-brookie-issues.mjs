/*
 * Reproduce Brookie's reported issues on the live site:
 * 1. Footer brand "Aviara Design Co." appearing offset
 * 2. Service #4 (Commercial Interior Design) "glitches when clicked"
 */
import { chromium, devices } from "@playwright/test";

const URL = process.env.URL || "https://aviaradesignco.com/";

async function run(viewport, label) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext(viewport);
  const page = await ctx.newPage();

  console.log("\n=========================");
  console.log(`Viewport: ${label}`);
  console.log("=========================");

  await page.goto(URL, { waitUntil: "networkidle" });

  // ---- Footer brand alignment ----
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);

  const brand = await page.evaluate(() => {
    const footer = document.querySelector("footer");
    if (!footer) return null;
    const logoSpan = footer.querySelector("span.relative.inline-block");
    const logoImg = logoSpan?.querySelector("img");
    const wordmark = Array.from(footer.querySelectorAll("p")).find((p) => /Aviara Design Co/i.test(p.textContent || ""));
    const tagline = Array.from(footer.querySelectorAll("p")).find((p) => /Home Staging \+ Interiors/i.test(p.textContent || ""));
    const col = wordmark?.parentElement;
    function rect(el) { if (!el) return null; const r = el.getBoundingClientRect(); return { left: Math.round(r.left), right: Math.round(r.right), center: Math.round((r.left + r.right) / 2), width: Math.round(r.width) }; }
    return {
      column: rect(col),
      logoBox: rect(logoSpan),
      logoImg: rect(logoImg),
      wordmark: rect(wordmark),
      tagline: rect(tagline),
    };
  });
  console.log("Footer brand alignment:");
  console.log(JSON.stringify(brand, null, 2));

  // ---- Services section: click each tab and watch for layout shift ----
  await page.evaluate(() => {
    const s = document.getElementById("services");
    if (s) s.scrollIntoView();
  });
  await page.waitForTimeout(500);

  const services = await page.$$('[data-testid^="service-"]');
  console.log(`\nFound ${services.length} service buttons`);
  for (let i = 0; i < services.length; i++) {
    const tid = await services[i].getAttribute("data-testid");
    await services[i].click();
    await page.waitForTimeout(400);
    const img = await page.evaluate(() => {
      const panel = document.querySelector('[data-testid="service-detail"] img, [data-testid="services-list"] [aria-expanded="true"] + div img');
      if (!panel) return null;
      const r = panel.getBoundingClientRect();
      return {
        src: (panel.currentSrc || panel.src).split("/").slice(-1)[0],
        width: Math.round(r.width),
        height: Math.round(r.height),
        complete: panel.complete,
        natural: panel.naturalWidth + "x" + panel.naturalHeight,
      };
    });
    console.log(`  click ${tid}: img =`, JSON.stringify(img));
  }

  await browser.close();
}

await run({ ...devices["iPhone 14 Pro"] }, "iPhone 14 Pro");
await run({ viewport: { width: 1440, height: 900 } }, "Desktop 1440");
