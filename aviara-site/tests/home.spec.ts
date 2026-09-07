import { test, expect, Page } from "@playwright/test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

// Assertions read from the same content files the site renders from, so the
// owner editing copy in the CMS does not break the suite. Only structure and
// behaviour are hard-coded here.
const contentDir = join(__dirname, "..", "src", "content");
const readJson = (f: string) => JSON.parse(readFileSync(join(contentDir, f), "utf8"));
const site = readJson("site.json");
const servicesData = readJson("services.json");
const testimonialsData = readJson("testimonials.json");
const firstTestimonial = testimonialsData.items[0];

const sections = ["about", "services", "portfolio", "process", "team", "contact"] as const;

async function gotoHome(page: Page) {
  await page.goto("/", { waitUntil: "networkidle" });
}

test.describe("Aviara Design Co. Home Page", () => {
  test("renders hero with headline, eyebrow, subhead and CTAs", async ({ page }) => {
    await gotoHome(page);
    await expect(page).toHaveTitle(/Aviara Design Co\./);

    const headline = page.getByTestId("hero-headline");
    await expect(headline).toBeVisible();
    await expect(headline).toContainText(site.hero.headlineLine1);
    await expect(headline).toContainText(site.hero.headlineLine2);

    await expect(page.getByTestId("hero-eyebrow")).toContainText(site.licensing);
    await expect(page.getByTestId("hero-subhead")).toContainText(/Temecula/i);

    await expect(page.getByTestId("hero-cta-primary")).toBeVisible();
    await expect(page.getByTestId("hero-cta-secondary")).toBeVisible();
  });

  test("hero shows the ken-burns poster image", async ({ page }) => {
    await gotoHome(page);
    const poster = page.getByTestId("hero-poster");
    await expect(poster).toHaveCount(1);
    await expect(poster.locator("img")).toHaveCount(1);
  });

  test("all main sections exist and have headings", async ({ page }) => {
    await gotoHome(page);
    for (const id of sections) {
      const section = page.locator(`section#${id}`);
      await expect(section, `section #${id} should exist`).toHaveCount(1);
      await expect(section.locator("h2").first()).toBeVisible();
    }
  });

  test("stats render three metrics in About", async ({ page }) => {
    await gotoHome(page);
    const stats = page.getByTestId("stats").locator("li");
    await expect(stats).toHaveCount(3);
  });
});

test.describe("Navbar", () => {
  test("nav links scroll to the matching section", async ({ page }, info) => {
    await gotoHome(page);
    const isMobile = info.project.name === "mobile";
    for (const id of sections) {
      if (isMobile) {
        // Mobile nav lives inside a drawer, so open it before each navigation.
        await page.getByRole("button", { name: /open menu/i }).click();
        await expect(page.locator("#mobile-menu")).toHaveAttribute("data-open", "true");
      }
      await page
        .getByRole("link", { name: new RegExp(`^${id}$`, "i") })
        .first()
        .click();
      const target = page.locator(`section#${id}`);
      await expect(target).toBeInViewport({ timeout: 5000 });
    }
  });

  test("navbar gains a scrolled state and stays visible", async ({ page }) => {
    await gotoHome(page);
    const header = page.locator("header");
    await expect(header).toHaveAttribute("data-scrolled", "false");
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(400);
    await expect(header).toHaveAttribute("data-scrolled", "true");
    await expect(header).toBeVisible();
  });
});

test.describe("Services interactive list", () => {
  test("activating a service updates the detail panel", async ({ page }, info) => {
    await gotoHome(page);
    const section = page.locator("#services");
    await section.scrollIntoViewIfNeeded();
    const isMobile = info.project.name === "mobile";

    // Exercise the first and last service in the CMS list, whatever they are.
    const items = servicesData.items;
    expect(items.length).toBeGreaterThan(1);
    const first = items[0];
    const last = items[items.length - 1];

    const button = page.getByTestId(`service-${first.slug}`);
    // The list is wrapped in a Reveal, so wait until its IntersectionObserver
    // has fired so the button is fully visible/interactive before clicking.
    await button.scrollIntoViewIfNeeded();
    await expect(button).toBeVisible();
    if (isMobile) await button.click();
    else await button.hover();
    await expect(button).toHaveAttribute("data-active", "true");
    await expect(page.getByTestId("service-detail")).toContainText(first.name);

    const button2 = page.getByTestId(`service-${last.slug}`);
    await button2.scrollIntoViewIfNeeded();
    await button2.click();
    await expect(button2).toHaveAttribute("data-active", "true");
    await expect(page.getByTestId("service-detail")).toContainText(last.name);
  });
});

test.describe("Portfolio", () => {
  test("renders three highlighted projects, each a different home", async ({ page }) => {
    await gotoHome(page);
    await page.locator("#portfolio").scrollIntoViewIfNeeded();

    const cards = page.getByTestId("portfolio-grid").locator("li");
    await expect(cards).toHaveCount(3);

    // Each project link should have a unique slug-based testid
    const slugs = await cards.evaluateAll((nodes) =>
      nodes.map((n) => n.querySelector("[data-testid^='project-']")?.getAttribute("data-testid"))
    );
    expect(new Set(slugs).size).toBe(3);
  });
});

test.describe("Testimonials", () => {
  test("renders the featured Voices testimonial", async ({ page }) => {
    await gotoHome(page);
    await page.locator("#testimonials").scrollIntoViewIfNeeded();

    await expect(page.getByTestId("testimonial-quote")).toContainText(
      firstTestimonial.quote.slice(0, 60)
    );
    await expect(page.getByTestId("testimonial-author")).toContainText(firstTestimonial.author);
  });
});

test.describe("Contact form", () => {
  test("rejects empty submit and accepts valid input with success message", async ({ page }) => {
    // Stub the endpoint. This test drives the real form, so without this it
    // files a genuine inquiry and emails the studio on every run.
    // Regex, not a glob: the form posts to "/api/contact/" *with* a trailing
    // slash (next.config sets trailingSlash), and "**/api/contact" does not
    // match that. Getting this wrong means the request sails through to the
    // real route and mails the studio, which is exactly what happened.
    await page.route(/\/api\/contact\/?$/, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      }),
    );
    await gotoHome(page);
    await page.locator("#contact").scrollIntoViewIfNeeded();

    const submit = page.getByTestId("contact-submit");
    await submit.click();
    await expect(page.getByTestId("contact-success")).toHaveCount(0);

    await page.fill("#name", "Test User");
    await page.fill("#email", "test@example.com");
    await page.fill("#phone", "5551234567");
    await page.selectOption("#projectType", "Vacant Staging");
    await page.fill("#city", "Temecula");
    await page.fill("#squareFootage", "2400");
    await page.fill("#stagingDate", "2026-06-01");
    // Room checkboxes use a visually hidden input + visible span; bypass
    // Playwright's actionability check by clicking the label (which contains both).
    await page.getByTestId("group-rooms").getByText("Living Room", { exact: true }).click();
    await page.getByTestId("group-rooms").getByText("Primary Bedroom", { exact: true }).click();
    await page.fill("#message", "Need staging for a 3 bed listing.");
    await submit.click();

    await expect(page.getByTestId("contact-success")).toBeVisible();
  });

  test("contact details are valid and clickable", async ({ page }) => {
    await gotoHome(page);
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("contact-phone")).toHaveAttribute("href", /^tel:\+1/);
    await expect(page.getByTestId("contact-email")).toHaveAttribute("href", /^mailto:/);
  });
});

test.describe("Footer", () => {
  test("renders contact and copyright", async ({ page }) => {
    await gotoHome(page);
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toContainText(/\(949\) 697-1618/);
    await expect(footer).toContainText(/aviaradesignco@gmail\.com/);
    await expect(footer).toContainText(new RegExp(`© ${new Date().getFullYear()}`));
  });
});

test.describe("Mobile menu", () => {
  test("hamburger opens and closes a mobile menu", async ({ page }, info) => {
    if (info.project.name !== "mobile") test.skip();
    await gotoHome(page);
    const trigger = page.getByRole("button", { name: /open menu/i });
    await expect(trigger).toBeVisible();
    await trigger.click();
    const menu = page.locator("#mobile-menu");
    await expect(menu).toHaveAttribute("data-open", "true");
    await page.getByRole("button", { name: /close menu/i }).click();
    await expect(menu).toHaveAttribute("data-open", "false");
  });
});

test.describe("Scroll-reveal section", () => {
  // Desktop only: the scroll-driven effect is deliberately disabled on touch
  // devices (see ScrollReveal.tsx) because the per-frame compositor work made
  // iOS Safari scrolling jitter. On mobile the headline fades in via an
  // IntersectionObserver instead and the progress attribute stays at 0.
  test("reveal mask progresses as the user scrolls", async ({ page }, info) => {
    test.skip(info.project.name === "mobile", "scroll-driven reveal is desktop-only by design");
    await gotoHome(page);
    const reveal = page.getByTestId("scroll-reveal");
    await reveal.scrollIntoViewIfNeeded();

    const mask = page.getByTestId("scroll-reveal-mask");
    const initial = await mask.getAttribute("data-reveal-progress");
    expect(initial).not.toBeNull();

    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(400);
    const later = await mask.getAttribute("data-reveal-progress");
    expect(Number(later)).toBeGreaterThan(Number(initial ?? 0));
  });
});

test.describe("Accessibility & SEO basics", () => {
  test("has exactly one h1, descriptive heading hierarchy, and meta description", async ({ page }) => {
    await gotoHome(page);
    await expect(page.locator("h1")).toHaveCount(1);

    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description).toBeTruthy();
    expect((description ?? "").length).toBeGreaterThan(60);
  });

  test("skip-to-content link exists and main has id=main", async ({ page }) => {
    await gotoHome(page);
    await expect(page.getByRole("link", { name: /skip to content/i })).toHaveCount(1);
    await expect(page.locator("main#main")).toHaveCount(1);
  });
});

test.describe("Visual smoke (full-page screenshots)", () => {
  test("desktop full-page screenshot captures", async ({ page }, info) => {
    if (info.project.name !== "desktop") test.skip();
    await gotoHome(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    const buf = await page.screenshot({ fullPage: true });
    expect(buf.byteLength).toBeGreaterThan(50_000);
    await info.attach("home-desktop", { body: buf, contentType: "image/png" });
  });

  test("mobile full-page screenshot captures", async ({ page }, info) => {
    if (info.project.name !== "mobile") test.skip();
    await gotoHome(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    const buf = await page.screenshot({ fullPage: true });
    expect(buf.byteLength).toBeGreaterThan(30_000);
    await info.attach("home-mobile", { body: buf, contentType: "image/png" });
  });
});
