import Link from 'next/link';

import { formatCurrency, type Locale } from '@nasij/i18n';
import { Button, ProductCard } from '@nasij/ui';

import { fixtureProducts, imageFor, type FixtureProduct } from '~/data/products.js';
import { getTranslator, requireLocale } from '~/lib/i18n.js';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const titleFor = (product: FixtureProduct, locale: Locale): string =>
  locale === 'ar' ? product.titleAr : product.titleEn;

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=1600&q=80&auto=format&fit=crop';

const CATEGORY_CARDS = [
  {
    key: 'women' as const,
    titleAr: 'النساء',
    titleEn: 'Women',
    image:
      'https://images.unsplash.com/photo-1485518882345-15568b007407?w=900&q=80&auto=format&fit=crop',
  },
  {
    key: 'men' as const,
    titleAr: 'الرجال',
    titleEn: 'Men',
    image:
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=900&q=80&auto=format&fit=crop',
  },
  {
    key: 'accessories' as const,
    titleAr: 'إكسسوارات',
    titleEn: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&q=80&auto=format&fit=crop',
  },
];

const VALUE_PROPS = [
  {
    titleAr: 'شحن مجاني',
    titleEn: 'Free shipping',
    descAr: 'على الطلبات فوق ٣٠٠ ج.م.',
    descEn: 'On orders over EGP 300',
    icon: '🚚',
  },
  {
    titleAr: 'إرجاع خلال ١٤ يوم',
    titleEn: '14-day returns',
    descAr: 'بدون أسئلة، إرجاع مرن.',
    descEn: 'No questions, easy returns',
    icon: '↺',
  },
  {
    titleAr: 'دفع آمن',
    titleEn: 'Secure checkout',
    descAr: 'حماية كاملة لبياناتك.',
    descEn: 'Your data, fully protected',
    icon: '🔒',
  },
  {
    titleAr: 'صنع يدوي',
    titleEn: 'Slow-made',
    descAr: 'كل قطعة بدقة وصبر.',
    descEn: 'Crafted with care',
    icon: '✦',
  },
];

const HomePage = async ({ params }: PageProps) => {
  const { locale: localeParam } = await params;
  const locale = requireLocale(localeParam);
  const t = getTranslator(locale);
  const featured = fixtureProducts.slice(0, 8);

  return (
    <main>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-stone-100">
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_IMAGE}
            alt=""
            aria-hidden="true"
            className="size-full object-cover"
          />
          <div
            className={`absolute inset-0 ${
              locale === 'ar'
                ? 'bg-gradient-to-l from-stone-50/95 via-stone-50/70 to-transparent'
                : 'bg-gradient-to-r from-stone-50/95 via-stone-50/70 to-transparent'
            }`}
          />
        </div>
        <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center gap-6 px-6 py-24">
          <span className="text-xs uppercase tracking-[0.2em] text-text-subtle">
            {t('storefront', 'home.hero.eyebrow')}
          </span>
          <h1 className="max-w-2xl font-display-latin text-display font-medium leading-tight text-text">
            {t('storefront', 'home.hero.title')}
          </h1>
          <p className="max-w-prose text-lg text-text-muted">
            {t('storefront', 'home.hero.subtitle')}
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href={`/${locale}/shop`}>{t('common', 'nav.shop')}</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href={`/${locale}/shop?c=women`}>{t('common', 'nav.collections')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-y border-border bg-surface-raised">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 sm:grid-cols-4">
          {VALUE_PROPS.map((p) => (
            <div key={p.titleEn} className="flex items-start gap-3">
              <span aria-hidden="true" className="text-2xl">
                {p.icon}
              </span>
              <div>
                <div className="text-sm font-medium text-text">
                  {locale === 'ar' ? p.titleAr : p.titleEn}
                </div>
                <div className="text-xs text-text-muted">
                  {locale === 'ar' ? p.descAr : p.descEn}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-8 flex items-end justify-between">
          <h2 className="font-display-latin text-3xl font-medium text-text">
            {t('storefront', 'home.collections.title')}
          </h2>
          <Link
            href={`/${locale}/shop`}
            className="text-sm text-text-muted hover:text-text"
          >
            {locale === 'ar' ? 'عرض الكل ←' : '← View all'}
          </Link>
        </header>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CATEGORY_CARDS.map((cat) => (
            <Link
              key={cat.key}
              href={`/${locale}/shop?c=${cat.key}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-lg bg-surface-sunken"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.image}
                alt={locale === 'ar' ? cat.titleAr : cat.titleEn}
                className="size-full object-cover transition-transform duration-slow ease-emphasized group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <h3 className="font-display-latin text-2xl font-medium text-white">
                  {locale === 'ar' ? cat.titleAr : cat.titleEn}
                </h3>
                <p className="mt-1 text-sm text-white/80">
                  {locale === 'ar' ? 'استكشف المجموعة' : 'Explore the edit'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <header className="mb-8 flex items-end justify-between">
          <h2 className="font-display-latin text-3xl font-medium text-text">
            {locale === 'ar' ? 'مختار من المجموعة' : 'Featured pieces'}
          </h2>
          <Link
            href={`/${locale}/shop`}
            className="text-sm text-text-muted hover:text-text"
          >
            {locale === 'ar' ? 'عرض الكل ←' : '← View all'}
          </Link>
        </header>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard
              key={product.slug}
              title={titleFor(product, locale)}
              href={`/${locale}/p/${product.slug}`}
              priceLabel={formatCurrency(product.basePriceMinor, {
                locale,
                currency: product.currency,
              })}
              compareAtLabel={
                product.compareAtPriceMinor
                  ? formatCurrency(product.compareAtPriceMinor, {
                      locale,
                      currency: product.currency,
                    })
                  : undefined
              }
              ribbon={product.ribbon ? product.ribbon[locale] : undefined}
              imageSrc={product.imageUrl ?? imageFor(product.slug)}
              imageAlt={titleFor(product, locale)}
            />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-border bg-surface-sunken">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-16 text-center">
          <h2 className="font-display-latin text-3xl font-medium text-text">
            {locale === 'ar' ? 'انضم إلى القائمة' : 'Join the list'}
          </h2>
          <p className="text-text-muted">
            {locale === 'ar'
              ? 'احصل على ١٠٪ خصم على طلبك الأول وأخبار المجموعات الجديدة.'
              : '10% off your first order, plus first access to new drops.'}
          </p>
          <form className="mt-2 flex w-full max-w-md gap-2">
            <input
              type="email"
              required
              placeholder={locale === 'ar' ? 'البريد الإلكتروني' : 'you@example.com'}
              className="h-11 flex-1 rounded-md border border-border bg-surface-raised px-3 text-sm"
            />
            <Button type="submit" size="lg">
              {locale === 'ar' ? 'اشتراك' : 'Subscribe'}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
