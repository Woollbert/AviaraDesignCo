/*
 * Mobile scroll-jerk reproduction: scroll the homepage on iPhone viewport
 * and watch every image's computed transform for unexpected changes.
 */
import { chromium, devices } from "@playwright/test";

const URL = process.env.URL || "https://aviaradesignco.com/";
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 14 Pro"] });
const page = await ctx.newPage();

await page.goto(URL, { waitUntil: "networkidle" });

// Sample transforms before and during slow scroll
const sample = () => page.$$eval("img", (imgs) =>
  imgs.map((img) => {
    const cs = getComputedStyle(img);
    const rect = img.getBoundingClientRect();
    return {
      alt: (img.alt || "").slice(0, 50),
      src: (img.currentSrc || img.src).split("/").slice(-1)[0].slice(0, 40),
      transform: cs.transform,
      transition: cs.transition.slice(0, 80),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      top: Math.round(rect.top),
    };
  })
);

console.log("=== before any scroll ===");
console.log(JSON.stringify(await sample(), null, 2));

// Scroll smoothly past portfolio
await page.evaluate(() => {
  return new Promise((resolve) => {
    const target = document.getElementById("portfolio") || document.body;
    target.scrollIntoView({ behavior: "smooth" });
    setTimeout(resolve, 1500);
  });
});

console.log("\n=== after scroll to portfolio ===");
const portfolioSample = await sample();
console.log(JSON.stringify(portfolioSample.filter(s => s.top > -200 && s.top < 900), null, 2));

// Simulate a quick swipe scroll (touchstart + move + end with no tap dwell)
const box = await page.evaluate(() => {
  const el = document.querySelector('[data-testid^="project-"]');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + 20, h: r.height };
});

if (box) {
  console.log("\n=== simulating swipe across portfolio card ===");
  await page.touchscreen.tap(box.x, box.y); // brief tap as if grazed during scroll
  await page.waitForTimeout(50);
  const tappedSample = await sample();
  console.log(JSON.stringify(tappedSample.filter(s => s.top > -200 && s.top < 900), null, 2));

  // 400ms later, see if any transform animations are in flight
  await page.waitForTimeout(400);
  console.log("\n=== 400ms after tap ===");
  const laterSample = await sample();
  console.log(JSON.stringify(laterSample.filter(s => s.top > -200 && s.top < 900), null, 2));
}

await browser.close();
