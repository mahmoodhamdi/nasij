import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { formatCurrency, type Locale } from '@nasij/i18n';
import { Badge } from '@nasij/ui';

import { AddToCartButton } from '~/components/add-to-cart-button.js';
import { findProductBySlug, fixtureProducts, type FixtureProduct } from '~/data/products.js';
import { getTranslator, requireLocale } from '~/lib/i18n.js';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const titleFor = (product: FixtureProduct, locale: Locale): string =>
  locale === 'ar' ? product.titleAr : product.titleEn;

const descriptionFor = (product: FixtureProduct, locale: Locale): string =>
  locale === 'ar' ? product.descriptionAr : product.descriptionEn;

export const generateStaticParams = () =>
  fixtureProducts.flatMap((product) =>
    (['ar', 'en'] as const).map((locale) => ({ locale, slug: product.slug })),
  );

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { locale: localeParam, slug } = await params;
  if (localeParam !== 'ar' && localeParam !== 'en') return {};
  const product = findProductBySlug(slug);
  if (!product) return {};
  const locale: Locale = localeParam;
  return {
    title: titleFor(product, locale),
    description: descriptionFor(product, locale),
  };
};

const ProductDetailPage = async ({ params }: PageProps) => {
  const { locale: localeParam, slug } = await params;
  const locale = requireLocale(localeParam);
  const product = findProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const t = getTranslator(locale);
  const sizes = [...new Set(product.variants.filter((v) => v.size).map((v) => v.size!))];
  const colors = [...new Set(product.variants.map((v) => v.color))];
  const inStock = product.variants.length > 0;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href={`/${locale}/shop`}
        className="text-sm text-text-muted hover:text-text"
      >
        ← {t('common', 'cta.back')}
      </Link>

      <article className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-surface-sunken">
          <span aria-hidden="true" className="absolute inset-0 grid place-items-center text-5xl text-text-subtle">
            ◯
          </span>
        </div>

        <div className="flex flex-col gap-6">
          {product.ribbon ? (
            <Badge tone="accent">{product.ribbon[locale]}</Badge>
          ) : null}

          <header className="flex flex-col gap-3">
            <h1 className="font-display-latin text-4xl font-medium text-text">
              {titleFor(product, locale)}
            </h1>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl text-text">
                {formatCurrency(product.basePriceMinor, { locale, currency: product.currency })}
              </span>
              {product.compareAtPriceMinor ? (
                <span className="text-base text-text-subtle line-through">
                  {formatCurrency(product.compareAtPriceMinor, { locale, currency: product.currency })}
                </span>
              ) : null}
            </div>
          </header>

          <p className="text-base text-text-muted">{descriptionFor(product, locale)}</p>

          {sizes.length > 0 ? (
            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium text-text">
                {t('storefront', 'plp.filters.size')}
              </legend>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <span
                    key={size}
                    className="rounded-full border border-border-strong px-3 py-1 text-sm text-text"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </fieldset>
          ) : null}

          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium text-text">
              {t('storefront', 'plp.filters.color')}
            </legend>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <span
                  key={color}
                  className="rounded-full border border-border-strong px-3 py-1 text-sm capitalize text-text"
                >
                  {color}
                </span>
              ))}
            </div>
          </fieldset>

          <div className="flex items-center gap-3 pt-2">
            <AddToCartButton
              label={t('common', 'cta.add-to-cart')}
              successLabel={locale === 'ar' ? 'تمت الإضافة' : 'Added'}
              disabled={!inStock}
              input={{
                productSlug: product.slug,
                variantSku: product.variants[0]?.size
                  ? `${product.sku}-${product.variants[0].size.toUpperCase()}-${product.variants[0].color.toUpperCase()}`
                  : `${product.sku}-${product.variants[0]?.color.toUpperCase() ?? 'DEFAULT'}`,
                titleAr: product.titleAr,
                titleEn: product.titleEn,
                unitPriceMinor: product.basePriceMinor,
              }}
            />
            <span className="text-sm text-text-muted">
              {inStock ? t('storefront', 'pdp.in-stock') : t('storefront', 'pdp.out-of-stock')}
            </span>
          </div>
        </div>
      </article>
    </main>
  );
};

export default ProductDetailPage;
