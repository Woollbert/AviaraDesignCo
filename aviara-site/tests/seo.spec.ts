import { test, expect } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// SEO plumbing: service pages, structured data, titles, and the links that
// tie projects, cities, services, and journal posts together. Everything is
// read from the same content files the site builds from, so these keep
// passing as the owner edits content in the CMS.
const content = join(__dirname, "..", "src", "content");
const readJson = (rel: string) => JSON.parse(readFileSync(join(content, rel), "utf8"));
const readDir = (rel: string) =>
  readdirSync(join(content, rel))
    .filter((f) => f.endsWith(".json"))
    .map((f) => readJson(join(rel, f)));

const site = readJson("site.json");
const services: Array<{ slug: string; name: string; faqs?: unknown[] }> = readJson("services.json").items;
const projects: Array<{ slug: string; title: string; location: string }> = readDir("projects");
const cities: Array<{ slug: string; city: string; published?: boolean }> = readDir("cities").filter(
  (c: { published?: boolean }) => c.published !== false,
);
const posts: Array<{ slug: string; title: string; metaTitle?: string }> = readDir("journal");

// Mirrors SERVICE_URL_PREFIX in src/data/services.ts.
const URL_SLUG: Record<string, string> = {
  "vacant-staging": "vacant-home-staging",
  "occupied-staging": "occupied-home-staging",
  consultations: "staging-consultations",
};
const servicePath = (s: { slug: string }) => `/services/${URL_SLUG[s.slug] ?? s.slug}/`;

function ldBlocks(html: string): string[] {
  return [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => m[1]);
}
function titleOf(html: string): string {
  return (html.match(/<title>(.*?)<\/title>/s)?.[1] ?? "").replace(/&amp;/g, "&");
}

test.describe("Service pages", () => {
  test("every service has its own page with one H1, a canonical, and Service schema", async ({ request }) => {
    expect(services.length).toBeGreaterThan(0);
    for (const s of services) {
      const res = await request.get(servicePath(s));
      expect(res.status(), s.slug).toBe(200);
      const html = await res.text();
      expect((html.match(/<h1[\s>]/g) ?? []).length, `${s.slug} h1 count`).toBe(1);
      expect(html, s.slug).toContain(`rel="canonical" href="${site.url.replace(/\/$/, "")}${servicePath(s)}"`);
      const ld = ldBlocks(html).join("\n");
      expect(ld, s.slug).toContain('"@type":"Service"');
      if (s.faqs?.length) expect(ld, s.slug).toContain('"@type":"FAQPage"');
    }
  });

  test("service pages are in the sitemap and linked from the homepage", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const home = await (await request.get("/")).text();
    for (const s of services) {
      expect(xml, s.slug).toContain(`${servicePath(s)}</loc>`);
      expect(home, s.slug).toContain(`href="${servicePath(s)}"`);
    }
  });

  test("a service page links to its city pages, and they link back", async ({ request }) => {
    const s = services[0];
    const html = await (await request.get(servicePath(s))).text();
    const section = (html.split('data-testid="service-cities"')[1] ?? "").split("</section>")[0];
    const cityLinks = section.match(/href="\/[a-z0-9-]+\/"/g) ?? [];
    expect(cityLinks.length).toBeGreaterThan(0);
    const child = cityLinks[0]!.slice(6, -1);
    const childHtml = await (await request.get(child)).text();
    expect(childHtml).toContain(`href="${servicePath(s)}"`);
  });
});

test.describe("Structured data", () => {
  test("business schema carries real opening hours and no self-published star rating", async ({ request }) => {
    const html = await (await request.get("/")).text();
    const business = ldBlocks(html)
      .map((b) => JSON.parse(b))
      .find((b) => b["@id"]?.endsWith("/#business"));
    expect(business).toBeTruthy();
    expect(business.aggregateRating).toBeUndefined();
    expect(business.review).toBeUndefined();
    // Every published spec must have clock times; "By appointment" style
    // rows are dropped rather than sent to Google half-formed.
    for (const spec of business.openingHoursSpecification ?? []) {
      expect(spec.opens).toMatch(/^\d{2}:\d{2}$/);
      expect(spec.closes).toMatch(/^\d{2}:\d{2}$/);
      expect(spec.dayOfWeek.length).toBeGreaterThan(0);
    }
    const hasClockHours = (site.hours ?? []).some((h: { time: string }) => /\d\s*(am|pm)/i.test(h.time));
    if (hasClockHours) expect(business.openingHoursSpecification?.length ?? 0).toBeGreaterThan(0);
  });

  test("project pages carry breadcrumb + gallery schema and a descriptive title", async ({ request }) => {
    for (const p of projects) {
      const html = await (await request.get(`/portfolio/${p.slug}/`)).text();
      const ld = ldBlocks(html).join("\n");
      expect(ld, p.slug).toContain('"@type":"BreadcrumbList"');
      expect(ld, p.slug).toContain('"@type":"ImageGallery"');
      const title = titleOf(html);
      expect(title, p.slug).toContain(p.title);
      // More than just "<project> | <brand>".
      expect(title.length, p.slug).toBeGreaterThan(`${p.title} | ${site.name}`.length);
    }
  });
});

test.describe("Titles", () => {
  test("no page title repeats the brand name", async ({ request }) => {
    const paths = [
      "/",
      "/portfolio/",
      "/journal/",
      "/service-areas/",
      ...posts.map((p) => `/journal/${p.slug}/`),
      ...projects.map((p) => `/portfolio/${p.slug}/`),
      ...services.map(servicePath),
      ...cities.slice(0, 3).map((c) => `/${c.slug}/`),
    ];
    const brand = site.name.replace(/\.$/, "");
    for (const path of paths) {
      const title = titleOf(await (await request.get(path)).text());
      expect(title.split(brand).length - 1, `${path} -> "${title}"`).toBe(1);
    }
  });
});

test.describe("Internal links", () => {
  test("a project in a city with a city page links to it, and the city links back", async ({ request }) => {
    const pairs = projects
      .map((p) => {
        const name = p.location.split(",")[0].trim().toLowerCase();
        return { p, city: cities.find((c) => c.city.toLowerCase() === name) };
      })
      .filter((x) => x.city);
    test.skip(pairs.length === 0, "no project is located in a city that has a page");
    for (const { p, city } of pairs) {
      const projectHtml = await (await request.get(`/portfolio/${p.slug}/`)).text();
      const related = (projectHtml.split('data-testid="project-related"')[1] ?? "").split("</div>")[0];
      expect(related, p.slug).toContain(`href="/${city!.slug}/"`);
      const cityHtml = await (await request.get(`/${city!.slug}/`)).text();
      const list = (cityHtml.split('data-testid="city-projects"')[1] ?? "").split("</ul>")[0];
      expect(list, city!.slug).toContain(`href="/portfolio/${p.slug}/"`);
    }
  });

  test("a city with no local project shows no project list", async ({ request }) => {
    const withProject = new Set(projects.map((p) => p.location.split(",")[0].trim().toLowerCase()));
    const bare = cities.find(
      (c) => ![...withProject].some((n) => c.city.toLowerCase() === n || c.city.toLowerCase().startsWith(`${n} `)),
    );
    test.skip(!bare, "every city has a project");
    const html = await (await request.get(`/${bare!.slug}/`)).text();
    expect(html).not.toContain('data-testid="city-projects"');
  });

  test("journal posts link to the service pages and render in-body links", async ({ request }) => {
    for (const post of posts) {
      const html = await (await request.get(`/journal/${post.slug}/`)).text();
      for (const s of services) expect(html, post.slug).toContain(`href="${servicePath(s)}"`);
      // Markdown-style links must be rendered, never shown raw.
      expect(html, post.slug).not.toMatch(/\]\(\/[a-z0-9/-]+\)/);
    }
  });

  test("the old /about/ address redirects instead of 404ing", async ({ request }) => {
    const res = await request.get("/about/", { maxRedirects: 0 });
    expect([301, 308]).toContain(res.status());
    expect(res.headers()["location"]).toContain("/#about");
  });

  test("the old /home/ address redirects to the homepage", async ({ request }) => {
    const res = await request.get("/home/", { maxRedirects: 0 });
    expect([301, 308]).toContain(res.status());
    expect(new URL(res.headers()["location"]!, "http://localhost:3000").pathname).toBe("/");
  });
});
