import { test, expect } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// City pages are data-driven from src/content/cities/*.json. These tests read
// the same folder so they keep passing as the owner adds, publishes, or hides
// cities from the CMS.
type CityFile = { slug: string; city: string; region?: string; published?: boolean };
const dir = join(__dirname, "..", "src", "content", "cities");
const cityFiles: CityFile[] = readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")));
const live = cityFiles.filter((c) => c.published !== false);
const hidden = cityFiles.filter((c) => c.published === false);

test.describe("City landing pages (data-driven)", () => {
  test("every published city serves its hub page with the right H1", async ({ request }) => {
    expect(live.length).toBeGreaterThan(0);
    for (const c of live) {
      const res = await request.get(`/${c.slug}/`);
      expect(res.status(), c.slug).toBe(200);
      const html = await res.text();
      expect(html, c.slug).toContain(`Home Staging in ${c.city}, CA`);
    }
  });

  test("an unpublished city is not served", async ({ request }) => {
    test.skip(hidden.length === 0, "no hidden cities in content");
    const res = await request.get(`/${hidden[0].slug}/`);
    expect(res.status()).toBe(404);
  });

  test("sitemap lists published cities and omits hidden ones", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    for (const c of live) expect(xml, c.slug).toContain(`/${c.slug}/`);
    for (const c of hidden) expect(xml, c.slug).not.toContain(`/${c.slug}/`);
  });

  test("every published city shows at least one published nearby city", async ({ request }) => {
    for (const c of live) {
      const html = await (await request.get(`/${c.slug}/`)).text();
      // Only the nearby section itself, not the footer links that follow it.
      const section = (html.split('data-testid="nearby-cities"')[1] ?? "").split("</section>")[0];
      const links = (section.match(/href="\/home-staging-[a-z0-9-]+\/"/g) ?? []).length;
      expect(links, `${c.slug} nearby links`).toBeGreaterThan(0);
      // and none of them may point at a hidden draft
      for (const h of hidden) expect(section, `${c.slug} links to draft ${h.slug}`).not.toContain(`/${h.slug}/`);
    }
  });

  test("a city hub page renders FAQ schema and the honest local-work heading", async ({ page }) => {
    const c = live[0];
    await page.goto(`/${c.slug}/`);
    await expect(page.locator("h1")).toHaveText(`Home Staging in ${c.city}, CA`);
    await expect(page.getByRole("heading", { name: new RegExp(`Bringing livable luxury to\\s+${c.city}\\.`) })).toBeVisible();
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ld.some((s) => s.includes('"FAQPage"'))).toBe(true);
  });
});

test.describe("Service areas page", () => {
  test("groups every published city under a region heading", async ({ page }) => {
    await page.goto("/service-areas/");
    const regions = page.getByTestId("service-region");
    const regionNames = new Set(live.map((c) => c.region).filter(Boolean));
    expect(await regions.count()).toBeGreaterThanOrEqual(regionNames.size);
    for (const name of regionNames) {
      await expect(page.getByRole("heading", { level: 2, name: name as string, exact: true })).toBeVisible();
    }
    for (const c of live) {
      await expect(page.locator(`a[href="/${c.slug}/"]`).first(), c.slug).toBeAttached();
    }
    for (const c of hidden) {
      await expect(page.locator(`a[href="/${c.slug}/"]`), c.slug).toHaveCount(0);
    }
  });
});

test.describe("Homepage sections driven by site.json", () => {
  test("featured section shows the CMS caption and photo", async ({ page }) => {
    const site = JSON.parse(readFileSync(join(__dirname, "..", "src", "content", "site.json"), "utf8"));
    await page.goto("/");
    const section = page.getByTestId("scroll-reveal");
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByText(site.sections.featured.body)).toBeAttached();
    const img = section.locator("img").first();
    await expect(img).toHaveAttribute("alt", site.sections.featured.imageAlt);
    expect(await img.getAttribute("src")).toContain(encodeURIComponent(site.sections.featured.image));
  });

  test("process overlay darkness comes from site.json", async ({ page }) => {
    const site = JSON.parse(readFileSync(join(__dirname, "..", "src", "content", "site.json"), "utf8"));
    await page.goto("/");
    const overlay = page.getByTestId("process-overlay");
    await expect(overlay).toHaveAttribute("data-overlay", String(site.sections.process.bgOverlay));
  });
});
