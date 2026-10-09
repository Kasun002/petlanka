import { defineConfig, devices } from '@playwright/test';

const backendUrl = process.env['E2E_BASE_URL'] ?? 'http://localhost:3000';
const clientUrl = process.env['E2E_CLIENT_URL'] ?? 'http://localhost:5173';
const adminUrl = process.env['E2E_ADMIN_URL'] ?? 'http://localhost:5174';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],
  use: {
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'pnpm --filter @petlanka/client dev',
      url: clientUrl,
      reuseExistingServer: true,
      timeout: 30_000,
    },
    {
      command: 'pnpm --filter @petlanka/admin dev',
      url: adminUrl,
      reuseExistingServer: true,
      timeout: 30_000,
    },
  ],
  projects: [
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      use: { baseURL: backendUrl },
    },
    {
      name: 'client',
      testMatch: '**/client/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'], baseURL: clientUrl },
    },
    {
      name: 'admin',
      testMatch: '**/admin/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'], baseURL: adminUrl },
    },
  ],
});
