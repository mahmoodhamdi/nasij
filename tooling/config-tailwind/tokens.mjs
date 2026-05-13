// @ts-check
/**
 * Nasij design tokens. Tokens are the single source of truth for colors,
 * type, spacing, radii, motion. UI components reference them through Tailwind
 * theme keys — apps never hardcode hex.
 *
 * Light mode is the default; dark mode swaps the semantic mapping at the
 * bottom of this file. Contrast verified at every shade.
 */

const stone = {
  50: '#fafaf7',
  100: '#f4f3ee',
  200: '#e6e3d8',
  300: '#cfcab8',
  400: '#a39d87',
  500: '#7c7660',
  600: '#5e5849',
  700: '#454035',
  800: '#2e2a23',
  900: '#1c1a15',
  950: '#0e0d0a',
};

const terracotta = {
  50: '#fdf4f0',
  100: '#fae5dc',
  200: '#f5c9b6',
  300: '#eda386',
  400: '#dc7d5b',
  500: '#c46a4f',
  600: '#a8553f',
  700: '#874236',
  800: '#623128',
  900: '#3f1f1a',
  950: '#23110e',
};

const sage = {
  50: '#f4f6f2',
  100: '#e3e8db',
  200: '#c5d0b3',
  300: '#9bad83',
  400: '#7a8c66',
  500: '#5e7150',
  600: '#475a3d',
  700: '#374631',
  800: '#243023',
  900: '#16201a',
};

const amber = {
  50: '#fdf8ec',
  100: '#fbecc8',
  200: '#f6d896',
  300: '#efbc5e',
  400: '#e69f3e',
  500: '#c98429',
  600: '#a5651e',
  700: '#7d4a18',
  800: '#553216',
  900: '#321e10',
};

const danger = {
  50: '#fdf2f1',
  100: '#fbe1de',
  200: '#f6bdb6',
  300: '#ef8c80',
  400: '#e15a4d',
  500: '#c93b2f',
  600: '#a02a22',
  700: '#7a1f1a',
  800: '#561512',
  900: '#330c0a',
};

const success = sage;
const warning = amber;

export const palette = {
  stone,
  terracotta,
  sage,
  amber,
  danger,
  success,
  warning,
};

export const semanticLight = {
  surface: 'var(--color-stone-50)',
  'surface-raised': '#ffffff',
  'surface-sunken': 'var(--color-stone-100)',
  text: 'var(--color-stone-900)',
  'text-muted': 'var(--color-stone-700)',
  'text-subtle': 'var(--color-stone-500)',
  border: 'var(--color-stone-200)',
  'border-strong': 'var(--color-stone-300)',
  accent: 'var(--color-terracotta-600)',
  'accent-hover': 'var(--color-terracotta-700)',
  'accent-foreground': '#ffffff',
  success: 'var(--color-sage-600)',
  warning: 'var(--color-amber-500)',
  danger: 'var(--color-danger-600)',
};

export const semanticDark = {
  surface: 'var(--color-stone-950)',
  'surface-raised': 'var(--color-stone-900)',
  'surface-sunken': '#000000',
  text: 'var(--color-stone-50)',
  'text-muted': 'var(--color-stone-300)',
  'text-subtle': 'var(--color-stone-400)',
  border: 'var(--color-stone-800)',
  'border-strong': 'var(--color-stone-700)',
  accent: 'var(--color-terracotta-400)',
  'accent-hover': 'var(--color-terracotta-300)',
  'accent-foreground': 'var(--color-stone-950)',
  success: 'var(--color-sage-400)',
  warning: 'var(--color-amber-400)',
  danger: 'var(--color-danger-400)',
};

export const typography = {
  fontFamily: {
    'display-latin': ['"Fraunces"', 'Georgia', 'serif'],
    'sans-latin': ['"General Sans"', '"Inter"', 'system-ui', 'sans-serif'],
    'display-arabic': ['"29LT Bukra"', '"Cairo"', 'sans-serif'],
    'sans-arabic': ['"IBM Plex Sans Arabic"', '"Cairo"', 'sans-serif'],
    mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.875rem' }],
    '2xl': ['1.5rem', { lineHeight: '2.125rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.375rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.625rem' }],
    '5xl': ['3rem', { lineHeight: '3.25rem' }],
    '6xl': ['3.75rem', { lineHeight: '4rem' }],
    '7xl': ['4.5rem', { lineHeight: '4.75rem' }],
    display: ['clamp(2.5rem, 6vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
  },
};

export const radius = {
  none: '0',
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '28px',
  full: '9999px',
};

export const motion = {
  duration: {
    fast: '120ms',
    base: '240ms',
    slow: '400ms',
    slower: '640ms',
  },
  ease: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    emphasized: 'cubic-bezier(0.3, 0, 0, 1)',
    decelerate: 'cubic-bezier(0, 0, 0, 1)',
    accelerate: 'cubic-bezier(0.3, 0, 1, 1)',
  },
};

export const tokens = {
  palette,
  semanticLight,
  semanticDark,
  typography,
  radius,
  motion,
};
