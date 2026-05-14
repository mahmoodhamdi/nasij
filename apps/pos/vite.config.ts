import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type { PluginOption } from 'vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react() as PluginOption,
    tailwindcss() as PluginOption,
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Nasij POS',
        short_name: 'Nasij POS',
        description: 'Nasij point of sale',
        theme_color: '#a8553f',
        background_color: '#fafaf7',
        display: 'standalone',
        start_url: '/',
        icons: [],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api',
              networkTimeoutSeconds: 5,
              expiration: { maxAgeSeconds: 60 * 60 * 24 },
            },
          },
        ],
      },
    }) as PluginOption,
  ],
  resolve: { alias: { '~': '/src' } },
  // @ts-expect-error vitest extends vite UserConfig with `test`
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: { statements: 80, branches: 70, functions: 80, lines: 80 },
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/main.tsx', 'src/App.tsx', 'src/components/**', 'src/lib/offline-queue.ts'],
    },
  },
});
