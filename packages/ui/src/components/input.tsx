import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '../utils/cn.js';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(
        'block w-full rounded-md border border-border bg-surface-raised',
        'px-3 py-2 text-sm text-text placeholder:text-text-subtle',
        'transition-colors duration-fast ease-standard',
        'focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30',
        'aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/30',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
