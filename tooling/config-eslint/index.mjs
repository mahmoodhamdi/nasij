// @ts-check
import eslintJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import unicorn from 'eslint-plugin-unicorn';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

/** Base config shared by every package and app. */
const base = [
  eslintJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  unicorn.configs['flat/recommended'],
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.node, ...globals.es2023 },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: process.cwd(),
      },
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.object.name='test'][callee.property.name='only']",
          message: '.only is banned in committed test code',
        },
        {
          selector: "CallExpression[callee.object.name='it'][callee.property.name='only']",
          message: '.only is banned in committed test code',
        },
        {
          selector: "CallExpression[callee.object.name='describe'][callee.property.name='only']",
          message: '.only is banned in committed test code',
        },
        {
          selector: 'Identifier[name=/^(TODO|FIXME|XXX)$/]',
          message: 'TODO/FIXME/XXX markers are banned; open an issue instead.',
        },
      ],
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': ['error', { cases: { kebabCase: true, pascalCase: true } }],
      'unicorn/no-null': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          pathGroups: [
            { pattern: '@nasij/**', group: 'internal', position: 'before' },
          ],
        },
      ],
      'import/no-default-export': 'off',
      'import/no-cycle': 'error',
    },
  },
  prettier,
];

/** Allow comment-only test files and remove TODO ban inside tests. */
const tests = [
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', '**/tests/**', '**/e2e/**'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      'no-restricted-syntax': 'off',
    },
  },
];

export const configs = {
  base,
  tests,
};
