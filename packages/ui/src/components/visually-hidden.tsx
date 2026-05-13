import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../utils/cn.js';

/**
 * Hide content visually but keep it available to assistive technology.
 * Avoid `display: none` (would also hide from screen readers).
 */
export const VisuallyHidden = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'absolute -m-px size-px overflow-hidden whitespace-nowrap border-0 p-0',
        '[clip:rect(0,0,0,0)] [clip-path:inset(50%)]',
        className,
      )}
      {...props}
    />
  ),
);
VisuallyHidden.displayName = 'VisuallyHidden';
