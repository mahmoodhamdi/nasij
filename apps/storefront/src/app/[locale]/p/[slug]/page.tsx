import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { formatCurrency, type Locale } from '@nasij/i18n';
import { Badge, ProductCard } from '@nasij/ui';

import { AddToCartButton } from '~/components/add-to-cart-button.js';
import { findProductBySlug, fixtureProducts, imageFor, type FixtureProduct } from '~/data/products.js';
import { averageRatingFor, reviewsForProduct } from '~/data/reviews.js';
import { getTranslator, requireLocale } from '~/lib/i18n.js';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const titleFor = (product: FixtureProduct, locale: Locale): string =>
  locale === 'ar' ? product.titleAr : product.titleEn;

const descriptionFor = (product: FixtureProduct, locale: Locale): string =>
  locale === 'ar' ? product.descriptionAr : product.descriptionEn;

const Stars = ({ rating }: { rating: number }) => (
  <span aria-label={`${rating} out of 5`} className="text-amber-500">
    {'★'.repeat(Math.round(rating))}
    <span className="text-text-subtle">{'★'.repeat(5 - Math.round(rating))}</span>
  </span>
);

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
    openGraph: {
      title: titleFor(product, locale),
      description: descriptionFor(product, locale),
      images: [product.imageUrl ?? imageFor(product.slug)],
    },
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
  const reviews = reviewsForProduct(product.slug);
  const { average, count } = averageRatingFor(product.slug);
  const related = fixtureProducts
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-text-muted">
        <Link href={`/${locale}`} className="hover:text-text">
          {t('common', 'app.name')}
        </Link>
        <span aria-hidden="true">/</span>
        <Link href={`/${locale}/shop`} className="hover:text-text">
          {t('common', 'nav.shop')}
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href={`/${locale}/shop?c=${product.category}`}
          className="capitalize hover:text-text"
        >
          {product.category}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-text">{titleFor(product, locale)}</span>
      </nav>

      <article className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-surface-sunken">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl ?? imageFor(product.slug)}
            alt={titleFor(product, locale)}
            className="absolute inset-0 size-full object-cover"
            loading="eager"
          />
        </div>

        <div className="flex flex-col gap-6">
          {product.ribbon ? (
            <Badge tone="accent">{product.ribbon[locale]}</Badge>
          ) : null}

          <header className="flex flex-col gap-3">
            <h1 className="font-display-latin text-4xl font-medium text-text">
              {titleFor(product, locale)}
            </h1>
            {count > 0 ? (
              <div className="flex items-center gap-2 text-sm">
                <Stars rating={average} />
                <span className="text-text-muted">
                  {average.toFixed(1)} · {count}{' '}
                  {locale === 'ar' ? 'تقييمات' : count === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            ) : null}
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
              <div className="flex items-center justify-between">
                <legend className="text-sm font-medium text-text">
                  {t('storefront', 'plp.filters.size')}
                </legend>
                <button
                  type="button"
                  className="text-xs text-text-muted underline-offset-2 hover:underline"
                >
                  {locale === 'ar' ? 'دليل المقاسات' : 'Size guide'}
                </button>
              </div>
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

          <div className="mt-4 grid grid-cols-1 gap-3 border-t border-border pt-4 text-sm text-text-muted sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <span aria-hidden="true">🚚</span>
              <span>{locale === 'ar' ? 'شحن مجاني فوق ٣٠٠ ج.م.' : 'Free shipping over EGP 300'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span aria-hidden="true">↺</span>
              <span>{locale === 'ar' ? 'إرجاع خلال ١٤ يوم' : '14-day returns'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span aria-hidden="true">✦</span>
              <span>{locale === 'ar' ? 'صنع يدوي في مصر' : 'Hand-made in Egypt'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span aria-hidden="true">🔒</span>
              <span>{locale === 'ar' ? 'دفع آمن' : 'Secure checkout'}</span>
            </div>
          </div>
        </div>
      </article>

      {reviews.length > 0 ? (
        <section className="mt-16 border-t border-border pt-10">
          <header className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-display-latin text-2xl font-medium text-text">
                {locale === 'ar' ? 'آراء العملاء' : 'Customer reviews'}
              </h2>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <Stars rating={average} />
                <span className="text-text-muted">
                  {average.toFixed(1)} {locale === 'ar' ? 'من ٥ — مبني على' : 'out of 5 — based on'}{' '}
                  {count} {locale === 'ar' ? 'تقييمات' : count === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            </div>
          </header>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {reviews.map((review) => (
              <article key={`${review.productSlug}-${review.authorName}-${review.createdAt}`} className="rounded-lg border border-border bg-surface-raised p-6">
                <header className="flex items-center justify-between">
                  <div className="font-medium text-text">{review.authorName}</div>
                  <Stars rating={review.rating} />
                </header>
                <h3 className="mt-3 text-base font-medium text-text">
                  {locale === 'ar' ? review.titleAr : review.titleEn}
                </h3>
                <p className="mt-1 text-sm text-text-muted">
                  {locale === 'ar' ? review.bodyAr : review.bodyEn}
                </p>
                <time className="mt-3 block text-xs text-text-subtle" dateTime={review.createdAt}>
                  {new Date(review.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="mb-6 font-display-latin text-2xl font-medium text-text">
            {locale === 'ar' ? 'قد يعجبك أيضًا' : 'You may also like'}
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard
                key={p.slug}
                title={titleFor(p, locale)}
                href={`/${locale}/p/${p.slug}`}
                priceLabel={formatCurrency(p.basePriceMinor, { locale, currency: p.currency })}
                compareAtLabel={
                  p.compareAtPriceMinor
                    ? formatCurrency(p.compareAtPriceMinor, { locale, currency: p.currency })
                    : undefined
                }
                ribbon={p.ribbon ? p.ribbon[locale] : undefined}
                imageSrc={p.imageUrl ?? imageFor(p.slug)}
                imageAlt={titleFor(p, locale)}
              />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
};

export default ProductDetailPage;
