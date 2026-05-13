// @ts-check
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

import { configs as base } from './index.mjs';

export const configs = {
  react: [
    ...base.base,
    react.configs.flat.recommended,
    react.configs.flat['jsx-runtime'],
    jsxA11y.flatConfigs.recommended,
    {
      languageOptions: {
        globals: { ...globals.browser },
      },
      plugins: {
        'react-hooks': reactHooks,
      },
      rules: {
        ...reactHooks.configs.recommended.rules,
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/self-closing-comp': 'error',
        'jsx-a11y/no-autofocus': ['error', { ignoreNonDOM: true }],
      },
      settings: {
        react: { version: 'detect' },
      },
    },
    ...base.tests,
  ],
};
