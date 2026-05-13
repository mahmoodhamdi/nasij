// @ts-check
import { configs as reactConfigs } from './react.mjs';

export const configs = {
  next: [
    ...reactConfigs.react,
    {
      rules: {
        // Next.js allows default exports for pages and route handlers.
        'import/no-default-export': 'off',
      },
    },
  ],
};
