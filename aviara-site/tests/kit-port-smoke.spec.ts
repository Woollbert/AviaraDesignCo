import { test, expect } from '@playwright/test';

// Smoke tests for the WebsiteEditorKit dry-run port (branch: kit-port-dry-run).
// Verifies:
//   1. Aviara's existing hand-coded homepage at / still works (port didn't break it)
//   2. The Puck-managed /home-editable page renders the kit's blocks
//   3. Kit blocks pick up Aviara's brand colors (--color-brass, --color-bone)
//   4. The Sveltia and Puck admin routes are reachable
//   5. The API auth gate is enforced
//
// Skipped in CI by default — run manually: `npm test -- kit-port-smoke.spec.ts`

test.describe('Kit port smoke tests', () => {
  test('Aviara existing homepage still loads', async ({ page }) => {
    const res = await page.goto('/');
    expect(res?.status()).toBe(200);
    // Aviara's site config sets the title to <name> | <tagline>
    await expect(page).toHaveTitle(/Aviara Design Co/);
  });

  test('Puck-managed /home-editable page renders kit blocks', async ({ page }) => {
    await page.goto('/home-editable');
    await expect(page.getByRole('heading', { name: 'Welcome to Aviara Design Co.' })).toBeVisible();
    await expect(page.getByText('WebsiteEditorKit dry-run port')).toBeVisible();
  });

  test('CTABand block picks up Aviara brand gold (brass) color', async ({ page }) => {
    await page.goto('/home-editable');
    // The CTABand with background: 'gold' uses --color-gold which is aliased
    // to --color-brass (#9a7b3d) in Aviara's globals.css. Compute the bg color.
    const section = page.locator('section', { hasText: 'WebsiteEditorKit dry-run port' });
    const bg = await section.evaluate((el) => getComputedStyle(el).backgroundColor);
    // Aviara brass: #9a7b3d → rgb(154, 123, 61)
    expect(bg).toBe('rgb(154, 123, 61)');
  });

  test('Decap admin loads', async ({ page }) => {
    const res = await page.goto('/admin/index.html');
    expect(res?.status()).toBe(200);
    // Switched from Sveltia to Decap CMS during Aviara port — Sveltia rejected
    // DecapBridge's git-gateway PKCE config.
    expect(await page.content()).toContain('decap-cms.js');
  });

  test('Puck editor route loads (with EDITOR_SHARED_TOKEN set)', async ({ page }) => {
    await page.goto('/admin/pages/home-editable');
    await expect(page.locator('text=Editor not configured')).toHaveCount(0);
  });

  test('/api/save-page rejects unauthenticated requests', async ({ request }) => {
    const res = await request.post('/api/save-page', {
      data: { slug: 'home-editable', data: { content: [], root: { props: {} } } },
    });
    expect(res.status()).toBe(401);
  });
});
