import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../utils/cn.js';

type Div = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, Div>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border border-border bg-surface-raised text-text shadow-sm',
      className,
    )}
    {...props}
  />
));
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, Div>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col gap-1.5 p-6 pb-3', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-display-latin font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  ),
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-text-muted', className)} {...props} />
  ),
);
CardDescription.displayName = 'CardDescription';

export const CardBody = forwardRef<HTMLDivElement, Div>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-3', className)} {...props} />
));
CardBody.displayName = 'CardBody';

export const CardFooter = forwardRef<HTMLDivElement, Div>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center gap-3 p-6 pt-0', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';
