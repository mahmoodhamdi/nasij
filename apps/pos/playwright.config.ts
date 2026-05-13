import { defineConfig, devices } from '@playwright/test';

const PORT = process.env['PORT'] ?? '5173';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env['CI'] ? 2 : 0,
  reporter: process.env['CI'] ? 'github' : 'list',
  use: { baseURL: `http://localhost:${PORT}`, trace: 'retain-on-failure' },
  projects: [
    { name: 'ipad', use: devices['iPad Pro 11'] },
    { name: 'chromium-desktop', use: devices['Desktop Chrome'] },
  ],
  webServer: process.env['CI']
    ? { command: 'pnpm preview', port: Number(PORT), timeout: 120_000, reuseExistingServer: false }
    : undefined,
});
