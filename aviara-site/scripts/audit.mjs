import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "audit");
fs.mkdirSync(OUT, { recursive: true });

const SECTIONS = ["top", "about", "services", "portfolio", "process", "team", "contact"];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

  // 1. Per-section viewport screenshots
  for (const id of SECTIONS) {
    if (id === "top") {
      await page.evaluate(() => window.scrollTo(0, 0));
    } else {
      await page.evaluate((s) => document.getElementById(s)?.scrollIntoView({ block: "start", behavior: "instant" }), id);
    }
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(OUT, `section-${id}.png`) });
  }

  // 2. ScrollReveal: capture 5 stages from before-entry to after-exit
  await page.evaluate(() => document.querySelector('[data-testid="scroll-reveal"]')?.scrollIntoView({ block: "start", behavior: "instant" }));
  await page.waitForTimeout(400);

  const baseY = await page.evaluate(() => window.scrollY);
  const sectionH = await page.evaluate(() => document.querySelector('[data-testid="scroll-reveal"]').getBoundingClientRect().height);

  for (let i = 0; i <= 5; i++) {
    const y = baseY - 400 + (sectionH + 800) * (i / 5);
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(450);
    const progress = await page.locator('[data-testid="scroll-reveal-mask"]').getAttribute('data-reveal-progress');
    await page.screenshot({ path: path.join(OUT, `reveal-stage-${i}-p${progress}.png`) });
  }

  // 3. Mobile per-section
  await ctx.close();
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const mp = await mctx.newPage();
  await mp.goto("http://localhost:3000", { waitUntil: "networkidle" });
  for (const id of SECTIONS) {
    if (id === "top") {
      await mp.evaluate(() => window.scrollTo(0, 0));
    } else {
      await mp.evaluate((sid) => document.getElementById(sid)?.scrollIntoView({ block: "start", behavior: "instant" }), id);
    }
    await mp.waitForTimeout(700);
    await mp.screenshot({ path: path.join(OUT, `mobile-${id}.png`) });
  }

  await browser.close();
  console.log("Audit screenshots written to", OUT);
})();
