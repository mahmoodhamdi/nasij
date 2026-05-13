import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../utils/cn.js';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide',
  {
    variants: {
      tone: {
        neutral: 'bg-surface-sunken text-text-muted',
        accent: 'bg-accent text-accent-foreground',
        success: 'bg-sage-100 text-sage-800',
        warning: 'bg-amber-100 text-amber-700',
        danger: 'bg-danger-100 text-danger-700',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, tone, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ tone }), className)} {...props} />
  ),
);
Badge.displayName = 'Badge';
