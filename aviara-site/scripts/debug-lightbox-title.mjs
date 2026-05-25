import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "audit", "lightbox");
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto("https://aviaradesignco.com/portfolio/temeku-hills-golf-estate/", { waitUntil: "networkidle" });
await page.evaluate(() => document.querySelector('[data-testid="project-photo-grid"]')?.scrollIntoView());
await page.waitForTimeout(500);
await page.click('[data-testid="project-photo-0"]');
await page.waitForTimeout(800);

await page.screenshot({ path: join(OUT, "live-lightbox.png"), clip: { x: 0, y: 0, width: 600, height: 200 } });

const info = await page.evaluate(() => {
  const titleEl = document.querySelector('.yarl__slide_title');
  if (!titleEl) return { error: "no title element" };
  const cs = getComputedStyle(titleEl);
  // Dump every text-related computed style we can think of
  const props = [
    "fontFamily", "fontSize", "fontWeight", "fontStyle", "lineHeight",
    "color", "textShadow", "textStroke", "webkitTextStroke", "webkitTextFillColor",
    "letterSpacing", "wordSpacing", "textDecoration", "textTransform",
    "filter", "backdropFilter", "mixBlendMode", "isolation",
    "transform", "opacity",
  ];
  const styles = {};
  for (const p of props) styles[p] = cs[p];

  // Check pseudo elements
  const beforeCS = getComputedStyle(titleEl, "::before");
  const afterCS = getComputedStyle(titleEl, "::after");
  const pseudos = {
    beforeContent: beforeCS.content,
    beforeColor: beforeCS.color,
    afterContent: afterCS.content,
    afterColor: afterCS.color,
  };

  const html = titleEl.outerHTML;
  const parent = titleEl.parentElement;
  const parentCS = parent ? getComputedStyle(parent) : null;

  return {
    text: titleEl.textContent,
    html: html.slice(0, 300),
    styles,
    pseudos,
    parentTransform: parentCS?.transform,
    parentFilter: parentCS?.filter,
    childCount: titleEl.children.length,
    childTags: Array.from(titleEl.children).map(c => c.tagName + "." + c.className.slice(0, 30)),
  };
});

console.log(JSON.stringify(info, null, 2));
await browser.close();
