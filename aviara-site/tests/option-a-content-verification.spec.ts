import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Verifies that the JSON-backed content in src/content/ actually reaches the
// rendered homepage. Every expectation is read from the same file the site
// reads, so the owner editing copy in the CMS changes what these tests assert
// rather than breaking them. A failure here means the JSON-to-component
// pipeline is broken or a component is reading the wrong field.

const contentDir = join(__dirname, '..', 'src', 'content');
const readJson = (f: string) => JSON.parse(readFileSync(join(contentDir, f), 'utf8'));

const site = readJson('site.json');
const services = readJson('services.json');
const team = readJson('team.json');
const testimonials = readJson('testimonials.json');
const process = readJson('process.json');

// The homepage grid shows the first three projects by display order
// (Portfolio.tsx renders projects.slice(0, 3); portfolio.ts sorts by `order`
// then title).
const projectsDir = join(contentDir, 'projects');
const featuredProjects = readdirSync(projectsDir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join(projectsDir, f), 'utf8')))
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.title.localeCompare(b.title))
  .slice(0, 3);

test.describe('Content verification — / homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for hydration so reveal-animated content is mounted
    await page.waitForLoadState('networkidle');
  });

  test('site.json — title and licensing line visible', async ({ page }) => {
    await expect(page).toHaveTitle(new RegExp(site.name.replace(/\./g, '\\.')));
    await expect(page.getByText(site.licensing).first()).toBeVisible();
  });

  test('site.json — phone number rendered as click-to-call', async ({ page }) => {
    const phoneLink = page.locator(`a[href="tel:${site.phoneTel}"]`).first();
    await expect(phoneLink).toBeVisible();
  });

  test('site.json — service areas show up', async ({ page }) => {
    await expect(page.getByText(new RegExp(site.serviceAreas[0])).first()).toBeVisible();
  });

  test('services.json — every service name renders', async ({ page }) => {
    for (const item of services.items) {
      await expect(page.getByText(item.name).first()).toBeVisible();
    }
  });

  test('services.json — every stat value renders', async ({ page }) => {
    for (const stat of services.stats) {
      await expect(page.getByText(stat.value).first()).toBeVisible();
    }
  });

  test('team.json — founder name and role appear', async ({ page }) => {
    await expect(page.getByText(team.founder.name).first()).toBeVisible();
    await expect(page.getByText(new RegExp(team.founder.role, 'i')).first()).toBeVisible();
  });

  test('team.json — supporting members render', async ({ page }) => {
    for (const member of team.members) {
      await expect(page.getByText(member.name).first()).toBeVisible();
    }
  });

  test('projects — the three featured project titles render', async ({ page }) => {
    expect(featuredProjects.length).toBe(3);
    for (const project of featuredProjects) {
      await expect(page.getByText(project.title).first()).toBeVisible();
    }
  });

  test('testimonials.json — the featured quote and author render', async ({ page }) => {
    const first = testimonials.items[0];
    await expect(page.getByText(first.quote.slice(0, 60)).first()).toBeVisible();
    await expect(page.getByText(first.author).first()).toBeVisible();
  });

  test('process.json — every step title renders in order', async ({ page }) => {
    const titles = await page.getByTestId('process-list').locator('h3').allTextContents();
    expect(titles).toEqual(process.steps.map((s: { title: string }) => s.title));
  });

  test('process.json — every value prop renders', async ({ page }) => {
    for (const prop of process.valueProps) {
      await expect(page.getByText(prop.title).first()).toBeVisible();
    }
  });
});
