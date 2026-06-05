import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "audit", "font-options");
await mkdir(OUT, { recursive: true });

const PARA = `Aviara Design Co. is a boutique home staging and interior design studio based in Temecula, California, serving clients throughout San Diego, Orange County, the Inland Empire, and surrounding Southern California communities. As a family-owned, licensed, and insured company, we specialize in luxury home staging and thoughtfully curated interiors designed to create emotional connection and lasting impact.`;
const H_PREFIX = "Spaces designed to feel elevated, inviting, and deeply ";
const H_ACCENT = "livable.";

const FONTS = [
  { key: "1-inter",   label: "1 · Inter (current)",   gfont: "Inter:wght@400",                    cssFamily: "Inter" },
  { key: "2-manrope", label: "2 · Manrope",           gfont: "Manrope:wght@400",                  cssFamily: "Manrope" },
  { key: "3-lato",    label: "3 · Lato",              gfont: "Lato:wght@400",                     cssFamily: "Lato" },
  { key: "4-jakarta", label: "4 · Plus Jakarta Sans", gfont: "Plus+Jakarta+Sans:wght@400",        cssFamily: "'Plus Jakarta Sans'" },
];
const fontsHref = `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&${FONTS.map(f=>`family=${f.gfont}`).join("&")}&display=swap`;

function pageHtml(font) {
  return `<!doctype html><html><head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fontsHref}">
<style>
  body { margin:0; background:#F4EFE8; padding:48px 56px; }
  .tag {
    display:inline-block; font-family:Inter,system-ui,sans-serif;
    font-size:13px; font-weight:600; letter-spacing:0.22em;
    text-transform:uppercase; color:#9A7B3D;
    background:rgba(154,123,61,0.08);
    border:1px solid rgba(154,123,61,0.25);
    padding:8px 16px; margin-bottom:28px;
  }
  h2 { font-family:'Cormorant Garamond',Georgia,serif; font-weight:500;
       font-size:64px; line-height:1.04; letter-spacing:-0.005em;
       color:#1C1815; margin:0 0 36px; max-width:820px; }
  h2 em { font-style:italic; font-weight:400; color:#9A7B3D; }
  p { font-family:${font.cssFamily},system-ui,sans-serif;
      font-size:22px; line-height:1.72; color:#544C42;
      margin:0; max-width:820px; }
</style></head><body>
<span class="tag">${font.label}</span>
<h2>${H_PREFIX}<em>${H_ACCENT}</em></h2>
<p>${PARA}</p>
</body></html>`;
}

const browser = await chromium.launch();
for (const f of FONTS) {
  const page = await (await browser.newContext({ viewport: { width: 1000, height: 720 }, deviceScaleFactor: 2 })).newPage();
  await page.setContent(pageHtml(f), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(OUT, `${f.key}.png`), fullPage: true });
  console.log("Saved", f.key);
  await page.close();
}
await browser.close();
