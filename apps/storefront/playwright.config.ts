import { defineConfig, devices } from '@playwright/test';

const PORT = process.env['PORT'] ?? '3000';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  reporter: process.env['CI'] ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium-desktop', use: devices['Desktop Chrome'] },
    { name: 'firefox-desktop', use: devices['Desktop Firefox'] },
    { name: 'webkit-desktop', use: devices['Desktop Safari'] },
    { name: 'iphone', use: devices['iPhone 14'] },
    { name: 'pixel', use: devices['Pixel 7'] },
  ],
  webServer: process.env['CI']
    ? {
        command: 'pnpm start',
        port: Number(PORT),
        timeout: 120_000,
        reuseExistingServer: false,
      }
    : undefined,
});
