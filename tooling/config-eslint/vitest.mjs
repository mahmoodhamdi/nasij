// @ts-check
import vitest from 'eslint-plugin-vitest';

export const configs = {
  vitest: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      plugins: { vitest },
      rules: {
        ...vitest.configs.recommended.rules,
        'vitest/no-focused-tests': 'error',
        'vitest/no-disabled-tests': 'error',
        'vitest/expect-expect': 'error',
        'vitest/no-identical-title': 'error',
      },
    },
  ],
};
