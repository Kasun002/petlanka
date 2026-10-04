import { test, expect } from '@playwright/test';

// Requires: admin app running (pnpm --filter @petlanka/admin dev)

test.describe('Admin app', () => {
  test('dashboard page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Petlanka Admin/);
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });
});
