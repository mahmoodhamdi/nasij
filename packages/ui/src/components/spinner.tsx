import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../utils/cn.js';

export const Spinner = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, role = 'status', ...props }, ref) => (
    <span
      ref={ref}
      role={role}
      className={cn(
        'inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent',
        className,
      )}
      {...props}
    />
  ),
);
Spinner.displayName = 'Spinner';
