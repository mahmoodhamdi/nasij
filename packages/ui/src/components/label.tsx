import { forwardRef, type LabelHTMLAttributes } from 'react';

import { cn } from '../utils/cn.js';

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('text-sm font-medium text-text peer-disabled:opacity-60', className)}
      {...props}
    />
  ),
);
Label.displayName = 'Label';
