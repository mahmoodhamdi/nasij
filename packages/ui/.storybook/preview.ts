import type { Preview } from '@storybook/react';

import '../src/styles/index.css';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: true }] } },
    backgrounds: {
      default: 'surface',
      values: [
        { name: 'surface', value: '#fafaf7' },
        { name: 'sunken', value: '#f4f3ee' },
        { name: 'dark', value: '#0e0d0a' },
      ],
    },
  },
  globalTypes: {
    locale: {
      name: 'Locale',
      defaultValue: 'en',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', title: 'English (LTR)' },
          { value: 'ar', title: 'Arabic (RTL)' },
        ],
      },
    },
    theme: {
      name: 'Theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      if (typeof document !== 'undefined') {
        document.documentElement.dir = context.globals['locale'] === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = String(context.globals['locale']);
        document.documentElement.dataset['theme'] = String(context.globals['theme']);
      }
      return Story();
    },
  ],
};

export default preview;
