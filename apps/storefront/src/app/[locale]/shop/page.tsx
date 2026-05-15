import type { Metadata } from 'next';
import Link from 'next/link';

import { formatCurrency, type Locale } from '@nasij/i18n';
import { ProductCard } from '@nasij/ui';

import { imageFor, listProducts, type ListProductsFilter, type FixtureProduct } from '~/data/products.js';
import { getTranslator, requireLocale } from '~/lib/i18n.js';

export const metadata: Metadata = {
  title: 'Shop',
};

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ c?: string; sort?: string; q?: string }>;
}

const CATEGORY_FILTERS: ReadonlyArray<{ key: FixtureProduct['category'] | 'all'; ar: string; en: string }> = [
  { key: 'all', ar: 'الكل', en: 'All' },
  { key: 'women', ar: 'النساء', en: 'Women' },
  { key: 'men', ar: 'الرجال', en: 'Men' },
  { key: 'accessories', ar: 'إكسسوارات', en: 'Accessories' },
];

const isCategory = (value: string | undefined): value is FixtureProduct['category'] =>
  value === 'women' || value === 'men' || value === 'accessories';

const isSort = (value: string | undefined): value is ListProductsFilter['sort'] =>
  value === 'newest' || value === 'price-asc' || value === 'price-desc';

const titleFor = (product: FixtureProduct, locale: Locale): string =>
  locale === 'ar' ? product.titleAr : product.titleEn;

const ShopPage = async ({ params, searchParams }: PageProps) => {
  const { locale: localeParam } = await params;
  const locale = requireLocale(localeParam);
  const t = getTranslator(locale);
  const { c, sort, q } = await searchParams;
  const filter: ListProductsFilter = {
    category: isCategory(c) ? c : undefined,
    sort: isSort(sort) ? sort : 'newest',
    search: q,
  };
  const products = listProducts(filter);

  const buildHref = (overrides: Record<string, string | undefined>): string => {
    const params = new URLSearchParams();
    if (c && overrides['c'] === undefined) params.set('c', c);
    if (sort && overrides['sort'] === undefined) params.set('sort', sort);
    if (q && overrides['q'] === undefined) params.set('q', q);
    for (const [key, value] of Object.entries(overrides)) {
      if (value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    const qs = params.toString();
    return `/${locale}/shop${qs ? `?${qs}` : ''}`;
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-text-subtle">
            {t('common', 'nav.shop')}
          </p>
          <h1 className="mt-2 font-display-latin text-4xl font-medium text-text">
            {t('storefront', 'home.collections.title')}
          </h1>
        </div>
        <nav aria-label={t('storefront', 'plp.filters.size')} className="flex flex-wrap gap-2">
          {CATEGORY_FILTERS.map((cat) => {
            const active = (filter.category ?? 'all') === cat.key;
            const href = buildHref({ c: cat.key === 'all' ? undefined : cat.key });
            return (
              <Link
                key={cat.key}
                href={href}
                aria-current={active ? 'true' : undefined}
                className={`rounded-full border px-3 py-1 text-sm transition-colors duration-fast ease-standard ${
                  active
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-border-strong text-text-muted hover:text-text'
                }`}
              >
                {locale === 'ar' ? cat.ar : cat.en}
              </Link>
            );
          })}
        </nav>
      </header>

      <div className="mb-6 flex items-center gap-3 text-sm text-text-muted">
        <span>{t('storefront', 'plp.sort.newest')}:</span>
        {(['newest', 'price-asc', 'price-desc'] as const).map((option) => {
          const active = filter.sort === option;
          const label = {
            newest: t('storefront', 'plp.sort.newest'),
            'price-asc': t('storefront', 'plp.sort.price-low-high'),
            'price-desc': t('storefront', 'plp.sort.price-high-low'),
          }[option];
          return (
            <Link
              key={option}
              href={buildHref({ sort: option })}
              aria-current={active ? 'true' : undefined}
              className={active ? 'font-medium text-text underline-offset-4' : 'hover:text-text'}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <section className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.slug}
            title={titleFor(product, locale)}
            href={`/${locale}/p/${product.slug}`}
            priceLabel={formatCurrency(product.basePriceMinor, { locale, currency: product.currency })}
            compareAtLabel={
              product.compareAtPriceMinor
                ? formatCurrency(product.compareAtPriceMinor, { locale, currency: product.currency })
                : undefined
            }
            ribbon={product.ribbon ? product.ribbon[locale] : undefined}
            imageSrc={product.imageUrl ?? imageFor(product.slug)}
            imageAlt={titleFor(product, locale)}
          />
        ))}
      </section>

      {products.length === 0 ? (
        <p className="mt-12 text-center text-text-muted">{t('common', 'state.empty')}</p>
      ) : null}
    </main>
  );
};

export default ShopPage;
