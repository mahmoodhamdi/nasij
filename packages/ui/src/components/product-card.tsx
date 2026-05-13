import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../utils/cn.js';

export interface ProductCardProps extends HTMLAttributes<HTMLElement> {
  title: string;
  href: string;
  /** Formatted price string — formatting belongs to the caller via @nasij/i18n. */
  priceLabel: string;
  /** Optional strike-through compare-at price string. */
  compareAtLabel?: string;
  /** Image source. Pass undefined for an intentional placeholder. */
  imageSrc?: string;
  /** Image alt text — required for a11y when imageSrc is supplied. */
  imageAlt?: string;
  /** Optional accent ribbon ("New", "Sale", "Sold out"). */
  ribbon?: string;
  /** Disable the link — renders as a non-interactive card. */
  disabled?: boolean;
}

export const ProductCard = forwardRef<HTMLElement, ProductCardProps>(
  (
    {
      title,
      href,
      priceLabel,
      compareAtLabel,
      imageSrc,
      imageAlt = '',
      ribbon,
      disabled,
      className,
      ...props
    },
    ref,
  ) => (
    <article
      ref={ref}
      className={cn('group flex flex-col gap-3', disabled && 'opacity-60', className)}
      {...props}
    >
      <a
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        className={cn(
          'relative block overflow-hidden rounded-lg bg-surface-sunken',
          'aspect-[3/4]',
          !disabled &&
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
        )}
      >
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={imageAlt}
            className="size-full object-cover transition-transform duration-slow ease-emphasized group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <span
            aria-hidden="true"
            className="absolute inset-0 grid place-items-center text-text-subtle"
          >
            ◯
          </span>
        )}
        {ribbon ? (
          <span className="absolute start-3 top-3 rounded-full bg-surface-raised px-3 py-1 text-xs font-medium uppercase tracking-wide text-text">
            {ribbon}
          </span>
        ) : null}
      </a>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display-latin text-base font-medium text-text">
          <a
            href={disabled ? undefined : href}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : undefined}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {title}
          </a>
        </h3>
        <div className="flex items-baseline gap-2 whitespace-nowrap">
          {compareAtLabel ? (
            <span className="text-sm text-text-subtle line-through">{compareAtLabel}</span>
          ) : null}
          <span className="text-sm font-medium text-text">{priceLabel}</span>
        </div>
      </div>
    </article>
  ),
);
ProductCard.displayName = 'ProductCard';
