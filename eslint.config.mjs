// @ts-check
import { configs as nasijConfigs } from './tooling/config-eslint/index.mjs';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/playwright-report/**',
      '**/test-results/**',
      '**/storybook-static/**',
      '**/*.min.js',
      'drizzle/**',
    ],
  },
  ...nasijConfigs.base,
];
