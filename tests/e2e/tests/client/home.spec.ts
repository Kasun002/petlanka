import { test, expect } from '@playwright/test';

// Requires: client app running (pnpm --filter @petlanka/client dev)

test.describe('Client app', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Petlanka/);
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
  });
});
