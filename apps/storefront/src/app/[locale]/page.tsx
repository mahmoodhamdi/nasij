import Link from 'next/link';

import { Button } from '@nasij/ui';

import { getTranslator, requireLocale } from '~/lib/i18n.js';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const HomePage = async ({ params }: PageProps) => {
  const { locale: localeParam } = await params;
  const locale = requireLocale(localeParam);
  const t = getTranslator(locale);

  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <section className="flex flex-col gap-6">
        <span className="text-xs uppercase tracking-[0.2em] text-text-subtle">
          {t('storefront', 'home.hero.eyebrow')}
        </span>
        <h1 className="font-display-latin text-display font-medium text-text">
          {t('storefront', 'home.hero.title')}
        </h1>
        <p className="max-w-prose text-lg text-text-muted">
          {t('storefront', 'home.hero.subtitle')}
        </p>
        <div className="flex gap-3">
          <Button size="lg" asChild>
            <Link href={`/${locale}/shop`}>{t('common', 'nav.shop')}</Link>
          </Button>
          <Button size="lg" variant="ghost" asChild>
            <Link href={`/${locale}/shop?c=women`}>{t('common', 'nav.collections')}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
