import { test, expect } from '@playwright/test';

// Requires: backend running + PostgreSQL running
// Run: docker compose up -d && pnpm --filter @petlanka/backend dev

test.describe('API health checks', () => {
  test('GET /api/v1/client/health returns 200', async ({ request }) => {
    const response = await request.get('/api/v1/client/health');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('status', 'ok');
  });

  test('GET /api/v1/admin/health returns 200', async ({ request }) => {
    const response = await request.get('/api/v1/admin/health');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('status', 'ok');
  });
});
