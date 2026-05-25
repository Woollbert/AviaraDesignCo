import { chromium, devices } from "@playwright/test";

const URL = process.env.URL || "https://aviaradesignco.com/";
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 14 Pro"] });
const page = await ctx.newPage();

await page.goto(URL, { waitUntil: "networkidle" });

const data = await page.$$eval(".animate-kenburns, [class*='hover:scale'], [class*='group-hover:scale']", (els) =>
  els.map((el) => {
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName,
      classes: el.className,
      alt: el.alt || "",
      animationName: cs.animationName,
      animationDuration: cs.animationDuration,
      animationPlayState: cs.animationPlayState,
      transform: cs.transform,
      transition: cs.transition,
    };
  })
);

console.log("matchMedia (hover: hover):", await page.evaluate(() => matchMedia("(hover: hover)").matches));
console.log("matchMedia (max-width: 768px):", await page.evaluate(() => matchMedia("(max-width: 768px)").matches));
console.log("matchMedia (prefers-reduced-motion):", await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches));
console.log("\nElements:");
console.log(JSON.stringify(data, null, 2));

await browser.close();
