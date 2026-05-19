import { chromium, devices } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "audit");
fs.mkdirSync(OUT, { recursive: true });

const SECTIONS = ["top", "about", "services", "portfolio", "process", "team", "testimonials", "contact"];

(async () => {
  const browser = await chromium.launch();
  // Simulate an iPhone 14 Pro
  const ctx = await browser.newContext({
    ...devices["iPhone 14 Pro"],
  });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

  for (const id of SECTIONS) {
    if (id === "top") {
      await page.evaluate(() => window.scrollTo(0, 0));
    } else {
      await page.evaluate(
        (sid) => document.getElementById(sid)?.scrollIntoView({ block: "start", behavior: "instant" }),
        id
      );
    }
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(OUT, `iphone-${id}.png`) });
  }

  // Hamburger menu open
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: /open menu/i }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, `iphone-menu-open.png`) });

  // Scroll within hero region (just past Hero, navbar should be in scrolled state)
  await page.evaluate(() => window.scrollTo(0, 200));
  await page.waitForTimeout(300);
  // close menu first
  const closeBtn = page.getByRole("button", { name: /close menu/i });
  if (await closeBtn.count()) await closeBtn.click();
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, 200));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, `iphone-nav-scrolled.png`) });

  // Long fullpage screenshot of mobile site
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, `iphone-fullpage.png`), fullPage: true });

  await browser.close();
  console.log("Mobile audit screenshots written to", OUT);
})();
