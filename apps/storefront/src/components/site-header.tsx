import Link from 'next/link';

import type { Locale } from '@nasij/i18n';
import { oppositeLocale } from '@nasij/i18n';

import { getTranslator } from '~/lib/i18n.js';

import { CartDrawer } from './cart-drawer.js';

export const SiteHeader = ({ locale }: { locale: Locale }) => {
  const t = getTranslator(locale);
  const other = oppositeLocale(locale);

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href={`/${locale}`} className="font-display-latin text-xl font-medium text-text">
          {t('common', 'app.name')}
        </Link>
        <nav aria-label="Primary" className="hidden gap-6 text-sm text-text-muted sm:flex">
          <Link href={`/${locale}/shop`} className="hover:text-text">
            {t('common', 'nav.shop')}
          </Link>
          <Link href={`/${locale}/shop?c=women`} className="hover:text-text">
            {t('common', 'nav.collections')}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
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
            className="rounded-full border border-border-strong px-3 py-1 text-xs uppercase tracking-wide text-text-muted hover:text-text"
          >
            {other === 'ar' ? 'ع' : 'EN'}
          </Link>
        </div>
      </div>
    </header>
  );
};
