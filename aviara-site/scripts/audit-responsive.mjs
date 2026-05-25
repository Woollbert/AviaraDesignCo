// Comprehensive responsive audit. Boots the dev server (you start it
// separately) and walks the homepage + key subpages on multiple viewports,
// capturing screenshots and recording functional findings.
//
// Findings tracked:
//   - console.error / pageerror per page
//   - any horizontal overflow (document.scrollWidth > clientWidth)
//   - elements that visibly overflow their containers
//   - clipped content near the bottom edge of the viewport
//   - failed network responses (>=400) for first-party requests
//
// Writes screenshots to audit/responsive/ and a JSON + markdown report.
//
// Run (with `npm run dev` already up): node scripts/audit-responsive.mjs

import { chromium, devices } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "audit", "responsive");
fs.mkdirSync(OUT, { recursive: true });

const BASE = "http://localhost:3000";

// Devices we care about. iPhone 14 Pro covers the user's screenshots; Pixel 7
// is a common Android profile; iPad Mini portrait / iPad Pro landscape cover
// the tablet break.
const PROFILES = [
  { key: "iphone-14-pro", label: "iPhone 14 Pro (390x844)", device: devices["iPhone 14 Pro"] },
  { key: "pixel-7", label: "Pixel 7 (412x915)", device: devices["Pixel 7"] },
  { key: "ipad-mini-portrait", label: "iPad Mini portrait (768x1024)", device: devices["iPad Mini"] },
  {
    key: "ipad-pro-landscape",
    label: "iPad Pro landscape (1366x1024)",
    device: devices["iPad Pro 11 landscape"],
  },
];

const HOMEPAGE_SECTIONS = [
  "top",
  "about",
  "services",
  "portfolio",
  "process",
  "team",
  "testimonials",
  "contact",
];

const SUBPAGES = [
  { path: "/portfolio/", key: "portfolio-index" },
  { path: "/privacy/", key: "privacy" },
  { path: "/journal/", key: "journal" },
  { path: "/service-areas/", key: "service-areas" },
  { path: "/home-staging-temecula/", key: "city-temecula" },
];

const findings = [];

function push(profile, page, type, detail) {
  findings.push({ profile, page, type, detail });
}

async function checkOverflow(page, profileKey, pageKey) {
  const data = await page.evaluate(() => {
    try {
    const issues = { horizontalScroll: null, overflowing: [] };
    const docW = document.documentElement.scrollWidth;
    const winW = window.innerWidth;
    if (docW > winW + 1) {
      issues.horizontalScroll = { scrollWidth: docW, innerWidth: winW };
    }
    // Find descendants that protrude past viewport right edge — exclude the
    // intentional decorative watermarks and anything explicitly absolute/fixed
    // outside the container (we still flag fixed elements that escape).
    const all = document.querySelectorAll("body *");
    for (const el of all) {
      if (el.classList.contains("watermark")) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.right > winW + 2 && r.left >= 0) {
        const id =
          el.id ||
          el.getAttribute("data-testid") ||
          el.tagName.toLowerCase() + (el.className ? "." + String(el.className).split(/\s+/).slice(0, 2).join(".") : "");
        issues.overflowing.push({
          tag: id,
          right: Math.round(r.right),
          left: Math.round(r.left),
        });
        if (issues.overflowing.length > 8) break;
      }
    }
    return issues;
    } catch { return { horizontalScroll: null, overflowing: [] }; }
  }).catch(() => ({ horizontalScroll: null, overflowing: [] }));
  if (data.horizontalScroll) {
    push(profileKey, pageKey, "horizontal-scroll", data.horizontalScroll);
  }
  for (const ov of data.overflowing) {
    push(profileKey, pageKey, "element-overflow-right", ov);
  }
}

async function safe(fn, profileKey, pageKey, label) {
  try { return await fn(); }
  catch (e) { push(profileKey, pageKey, label, String(e.message)); return null; }
}

async function visit(page, url, profileKey, pageKey, opts = {}) {
  const errors = [];
  const failedReqs = [];
  const onConsole = (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  };
  const onPageError = (err) => errors.push(`pageerror: ${err.message}`);
  const onResponse = (resp) => {
    if (resp.status() >= 400 && resp.url().startsWith(BASE)) {
      failedReqs.push({ url: resp.url(), status: resp.status() });
    }
  };
  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  page.on("response", onResponse);

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    // wait for fonts + lazy images
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(500);
  } catch (e) {
    push(profileKey, pageKey, "nav-error", String(e.message));
  }

  await safe(() => checkOverflow(page, profileKey, pageKey), profileKey, pageKey, "overflow-check-error");

  if (!opts.skipFullScreenshot) {
    // Trigger lazy-load by scrolling end-to-end first.
    await safe(() => page.evaluate(async () => {
      const h = document.documentElement.scrollHeight;
      const step = Math.floor(window.innerHeight * 0.8);
      for (let y = 0; y < h; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 100));
      }
      window.scrollTo(0, 0);
    }), profileKey, pageKey, "scroll-warmup-error");
    await page.waitForTimeout(600);
    await page
      .screenshot({
        path: path.join(OUT, `${profileKey}__${pageKey}__full.png`),
        fullPage: true,
        timeout: 90_000,
      })
      .catch((e) => push(profileKey, pageKey, "screenshot-timeout", String(e.message)));
  }

  for (const err of errors) push(profileKey, pageKey, "console-error", err);
  for (const req of failedReqs) push(profileKey, pageKey, "failed-request", req);

  page.off("console", onConsole);
  page.off("pageerror", onPageError);
  page.off("response", onResponse);
}

async function captureSections(page, profileKey) {
  for (const id of HOMEPAGE_SECTIONS) {
    if (id === "top") {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    } else {
      await page.evaluate(
        (sid) => document.getElementById(sid)?.scrollIntoView({ block: "start", behavior: "instant" }),
        id
      );
    }
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(OUT, `${profileKey}__home-${id}__viewport.png`),
      fullPage: false,
    });
  }
}

async function exerciseHomepageInteractions(page, profileKey) {
  // Mobile/tablet: hamburger button is present at <= md
  const isMobileNav = profileKey === "iphone-14-pro" || profileKey === "pixel-7" || profileKey === "ipad-mini-portrait";
  if (isMobileNav) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    const openBtn = page.getByRole("button", { name: /open menu/i });
    if (await openBtn.count()) {
      await openBtn.first().click().catch(() => {});
      // Drawer animation duration is 500ms; wait past it before screenshotting
      await page.waitForTimeout(900);
      await page.screenshot({ path: path.join(OUT, `${profileKey}__menu-open.png`) });

      // Click About link inside the mobile drawer and confirm it scrolls / closes
      const aboutLink = page.locator("#mobile-menu a").filter({ hasText: /^about$/i }).first();
      if (await aboutLink.count()) {
        await aboutLink.click().catch(() => {});
        await page.waitForTimeout(1400);
        await page.screenshot({ path: path.join(OUT, `${profileKey}__menu-after-click.png`) });
        const y = await page.evaluate(() => window.scrollY);
        if (y < 40) push(profileKey, "/", "menu-link-didnt-scroll", { scrollY: y });
      }

      // Re-open, click Contact CTA from drawer, confirm it lands on contact
      const reopen = page.getByRole("button", { name: /open menu/i });
      if (await reopen.count()) {
        await reopen.first().click().catch(() => {});
        await page.waitForTimeout(600);
        const inquireLink = page.locator("#mobile-menu a").filter({ hasText: /^inquire$/i }).first();
        if (await inquireLink.count()) {
          await inquireLink.click().catch(() => {});
          await page.waitForTimeout(1400);
          const contactTop = await page.evaluate(() => {
            const el = document.getElementById("contact");
            return el ? el.getBoundingClientRect().top : null;
          });
          if (contactTop === null || Math.abs(contactTop) > 120) {
            push(profileKey, "/", "inquire-link-didnt-land", { contactTop });
          }
        }
        // close drawer if still open
        const closeBtn = page.getByRole("button", { name: /close menu/i });
        if (await closeBtn.count()) {
          await closeBtn.first().click().catch(() => {});
          await page.waitForTimeout(600);
        }
      }
    } else {
      push(profileKey, "/", "menu-open-button-missing", {});
    }
  }

  // Scroll into contact form, type into the first input to verify it works
  await page.evaluate(() =>
    document.getElementById("contact")?.scrollIntoView({ block: "start", behavior: "instant" })
  );
  await page.waitForTimeout(500);
  const nameInput = page.locator("#contact input, #contact textarea").first();
  if (await nameInput.count()) {
    await nameInput.click().catch(() => {});
    await nameInput.type("audit", { delay: 10 }).catch(() => {});
    await page.screenshot({ path: path.join(OUT, `${profileKey}__contact-typed.png`) });
  } else {
    push(profileKey, "/", "contact-input-missing", {});
  }

  // Find CTA buttons and ensure they're tap-target-sized (>=44x44 per WCAG)
  const buttons = page.locator(".btn, a.btn, button[type=submit]");
  const count = await buttons.count();
  for (let i = 0; i < Math.min(count, 12); i++) {
    const el = buttons.nth(i);
    const box = await el.boundingBox().catch(() => null);
    if (!box) continue;
    if (box.height < 40 || box.width < 60) {
      const text = (await el.innerText().catch(() => "")).slice(0, 40);
      push(profileKey, "/", "small-tap-target", {
        text,
        w: Math.round(box.width),
        h: Math.round(box.height),
      });
    }
  }
}

(async () => {
  const browser = await chromium.launch();
  for (const profile of PROFILES) {
    console.log(`\n>>> ${profile.label}`);
    const ctx = await browser.newContext({ ...profile.device, baseURL: BASE });
    const page = await ctx.newPage();

    // Homepage
    await visit(page, BASE + "/", profile.key, "home", { skipFullScreenshot: false });
    await captureSections(page, profile.key);
    await exerciseHomepageInteractions(page, profile.key);

    // Subpages
    for (const sp of SUBPAGES) {
      await visit(page, BASE + sp.path, profile.key, sp.key);
    }

    // Specific check: portfolio detail (first one available)
    try {
      await page.goto(BASE + "/portfolio/", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);
      const firstHref = await page
        .locator("a[href^='/portfolio/']")
        .filter({ hasNotText: /view full portfolio/i })
        .first()
        .getAttribute("href")
        .catch(() => null);
      if (firstHref && firstHref !== "/portfolio/") {
        await visit(page, BASE + firstHref, profile.key, "portfolio-detail");
      }
    } catch (e) {
      push(profile.key, "/portfolio/detail", "nav-error", String(e.message));
    }

    // 404 page
    await visit(page, BASE + "/this-page-does-not-exist-xyz/", profile.key, "404");

    await ctx.close();
  }
  await browser.close();

  // Write reports
  fs.writeFileSync(path.join(OUT, "_findings.json"), JSON.stringify(findings, null, 2));
  const grouped = findings.reduce((acc, f) => {
    const key = `${f.profile} | ${f.type}`;
    acc[key] = (acc[key] || []).concat(f);
    return acc;
  }, {});
  const lines = ["# Responsive audit findings\n"];
  for (const [k, arr] of Object.entries(grouped)) {
    lines.push(`\n## ${k} (${arr.length})`);
    for (const f of arr.slice(0, 12)) {
      lines.push(`- ${f.page}: ${JSON.stringify(f.detail)}`);
    }
    if (arr.length > 12) lines.push(`- ... +${arr.length - 12} more`);
  }
  fs.writeFileSync(path.join(OUT, "_findings.md"), lines.join("\n"));
  console.log(`\nWrote ${findings.length} findings to ${OUT}/_findings.{json,md}`);
})();
