import { defineConfig, devices } from '@playwright/test';

const PORT = process.env['PORT'] ?? '3001';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env['CI'] ? 2 : 0,
  reporter: process.env['CI'] ? 'github' : 'list',
  use: { baseURL: `http://localhost:${PORT}`, trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium-desktop', use: devices['Desktop Chrome'] },
    { name: 'iphone', use: devices['iPhone 14'] },
  ],
  webServer: process.env['CI']
    ? { command: 'pnpm start', port: Number(PORT), timeout: 120_000, reuseExistingServer: false }
    : undefined,
});
