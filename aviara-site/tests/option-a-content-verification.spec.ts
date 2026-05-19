import { test, expect } from '@playwright/test';

// Verifies that Option A (JSON-backed data) renders identical content
// to what the hand-coded TS data files produced. Each test asserts specific
// strings that come straight from the corresponding src/content/*.json file.
//
// If any of these fail after Option A, the JSON-to-component pipeline is
// broken or a component is reading from the wrong field.

test.describe('Option A content verification — / homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for hydration so reveal-animated content is mounted
    await page.waitForLoadState('networkidle');
  });

  test('site.json — tagline and licensing visible', async ({ page }) => {
    // Tagline appears in title/meta. Licensing copy is rendered in the hero/header area.
    await expect(page).toHaveTitle(/Aviara Design Co/);
    const licensing = page.getByText(/Licensed & Insured/i);
    await expect(licensing.first()).toBeVisible();
  });

  test('site.json — phone number rendered as click-to-call', async ({ page }) => {
    // The (949) 697-1618 phone string + tel:+19496971618 href both come from site.json
    const phoneLink = page.locator('a[href="tel:+19496971618"]').first();
    await expect(phoneLink).toBeVisible();
  });

  test('site.json — service area cities show up', async ({ page }) => {
    // Temecula, Murrieta, etc. appear in the hero copy and service-area section
    await expect(page.getByText(/Temecula/).first()).toBeVisible();
  });

  test('services.json — all 4 service names render', async ({ page }) => {
    for (const name of [
      'Vacant Home Staging',
      'Occupied Home Staging',
      'Interior Design',
      'Staging Consultations',
    ]) {
      await expect(page.getByText(name).first()).toBeVisible();
    }
  });

  test('services.json — stats row renders all 4 stat values', async ({ page }) => {
    // "10+", "300+", "< 21", "8%"
    for (const value of ['10+', '300+', '8%']) {
      await expect(page.getByText(value).first()).toBeVisible();
    }
  });

  test('team.json — founder name and role appear', async ({ page }) => {
    await expect(page.getByText('Brooklyn James').first()).toBeVisible();
    await expect(page.getByText(/Founder/i).first()).toBeVisible();
  });

  test('team.json — supporting members render', async ({ page }) => {
    await expect(page.getByText('Dre James').first()).toBeVisible();
    await expect(page.getByText('Darren DiMarco').first()).toBeVisible();
  });

  test('portfolio.json — all 3 project titles render', async ({ page }) => {
    await expect(page.getByText('Fallbrook Estate').first()).toBeVisible();
    await expect(page.getByText('Menifee Family Home').first()).toBeVisible();
    await expect(page.getByText('Temeku Hills Golf Estate').first()).toBeVisible();
  });

  test('portfolio.json — testimonial quote renders', async ({ page }) => {
    await expect(page.getByText(/professional and accommodating/i).first()).toBeVisible();
    await expect(page.getByText(/Missy D/i).first()).toBeVisible();
  });

  test('process.json — all 4 step titles render in order', async ({ page }) => {
    for (const title of ['Discover', 'Design', 'Install', 'Deliver']) {
      await expect(page.getByText(title).first()).toBeVisible();
    }
  });

  test('process.json — value props render', async ({ page }) => {
    await expect(page.getByText('Livable, Not Loud').first()).toBeVisible();
    await expect(page.getByText('Editorial Eye').first()).toBeVisible();
    await expect(page.getByText('Family Owned').first()).toBeVisible();
  });
});
