// @ts-check
import { palette, typography, radius, motion } from './tokens.mjs';

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        stone: palette.stone,
        terracotta: palette.terracotta,
        sage: palette.sage,
        amber: palette.amber,
        danger: palette.danger,
        surface: 'var(--color-surface)',
        'surface-raised': 'var(--color-surface-raised)',
        'surface-sunken': 'var(--color-surface-sunken)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        'text-subtle': 'var(--color-text-subtle)',
        border: 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',
        accent: 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',
        'accent-foreground': 'var(--color-accent-foreground)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
      },
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      borderRadius: radius,
      transitionDuration: motion.duration,
      transitionTimingFunction: motion.ease,
    },
  },
  plugins: [],
};
