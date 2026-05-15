import Link from 'next/link';

import type { Locale } from '@nasij/i18n';
import { oppositeLocale } from '@nasij/i18n';

import { getTranslator } from '~/lib/i18n.js';

import { CartDrawer } from './cart-drawer.js';

export const SiteHeader = ({ locale }: { locale: Locale }) => {
  const t = getTranslator(locale);
  const other = oppositeLocale(locale);

  const navLinks = [
    { href: `/${locale}/shop`, label: t('common', 'nav.shop') },
    { href: `/${locale}/shop?c=women`, label: locale === 'ar' ? 'النساء' : 'Women' },
    { href: `/${locale}/shop?c=men`, label: locale === 'ar' ? 'الرجال' : 'Men' },
    { href: `/${locale}/shop?c=accessories`, label: locale === 'ar' ? 'إكسسوارات' : 'Accessories' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="bg-text text-surface">
        <div className="mx-auto max-w-6xl px-6 py-1.5 text-center text-xs tracking-wide">
          {locale === 'ar'
            ? '✦ شحن مجاني داخل مصر للطلبات فوق ٣٠٠ ج.م.'
            : '✦ Free shipping in Egypt on orders over EGP 300'}
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link
          href={`/${locale}`}
          className="font-display-latin text-2xl font-medium text-text"
        >
          {t('common', 'app.name')}
        </Link>
        <nav
          aria-label="Primary"
          className="hidden flex-1 items-center justify-center gap-6 text-sm text-text-muted sm:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors duration-fast hover:text-text"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <form
            action={`/${locale}/shop`}
            className="hidden items-center gap-2 rounded-full border border-border bg-surface-raised px-3 py-1.5 md:flex"
          >
            <span aria-hidden="true" className="text-text-subtle">⌕</span>
            <input
              type="search"
              name="q"
              placeholder={locale === 'ar' ? 'ابحث…' : 'Search…'}
              className="w-32 bg-transparent text-sm outline-none placeholder:text-text-subtle"
            />
          </form>
          <CartDrawer
            locale={locale}
            labels={{
              open: t('common', 'nav.cart'),
              title: t('storefront', 'cart.title'),
              empty: t('storefront', 'cart.empty'),
              subtotal: t('storefront', 'cart.subtotal'),
              checkout: t('storefront', 'checkout.title'),
              close: t('common', 'cta.cancel'),
              remove: locale === 'ar' ? 'إزالة' : 'Remove',
            }}
          />
          <Link
            href={`/${other}`}
            aria-label={other === 'ar' ? 'العربية' : 'English'}
            className="rounded-full border border-border-strong px-3 py-1 text-xs uppercase tracking-wide text-text-muted transition-colors duration-fast hover:text-text"
          >
            {other === 'ar' ? 'ع' : 'EN'}
          </Link>
        </div>
      </div>
    </header>
  );
};
