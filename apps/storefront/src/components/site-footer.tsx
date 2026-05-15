import Link from 'next/link';

import type { Locale } from '@nasij/i18n';

interface SiteFooterProps {
  locale: Locale;
}

export const SiteFooter = ({ locale }: SiteFooterProps) => {
  const year = new Date().getFullYear();
  const sections = [
    {
      titleAr: 'تسوق',
      titleEn: 'Shop',
      links: [
        { ar: 'الكل', en: 'All', href: `/${locale}/shop` },
        { ar: 'النساء', en: 'Women', href: `/${locale}/shop?c=women` },
        { ar: 'الرجال', en: 'Men', href: `/${locale}/shop?c=men` },
        { ar: 'إكسسوارات', en: 'Accessories', href: `/${locale}/shop?c=accessories` },
      ],
    },
    {
      titleAr: 'خدمة العملاء',
      titleEn: 'Help',
      links: [
        { ar: 'الشحن', en: 'Shipping', href: '#' },
        { ar: 'الإرجاع', en: 'Returns', href: '#' },
        { ar: 'دليل المقاسات', en: 'Size guide', href: '#' },
        { ar: 'تواصل', en: 'Contact', href: '#' },
      ],
    },
    {
      titleAr: 'نسيج',
      titleEn: 'Nasij',
      links: [
        { ar: 'عن العلامة', en: 'About', href: '#' },
        { ar: 'المتاجر', en: 'Stores', href: '#' },
        { ar: 'الحرف', en: 'Craft', href: '#' },
        { ar: 'الصحافة', en: 'Press', href: '#' },
      ],
    },
  ];

  return (
    <footer className="mt-20 border-t border-border bg-surface-sunken">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link
              href={`/${locale}`}
              className="font-display-latin text-xl font-medium text-text"
            >
              {locale === 'ar' ? 'نَسيج' : 'Nasij'}
            </Link>
            <p className="mt-3 text-sm text-text-muted">
              {locale === 'ar'
                ? 'قماشٌ يعرف قوامك. قطع أساسية مصنوعة على مهل.'
                : 'Cloth that knows your shape. Slow-made staples.'}
            </p>
          </div>
          {sections.map((s) => (
            <div key={s.titleEn}>
              <h3 className="text-sm font-medium text-text">
                {locale === 'ar' ? s.titleAr : s.titleEn}
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-text-muted">
                {s.links.map((l) => (
                  <li key={l.en}>
                    <Link href={l.href} className="hover:text-text">
                      {locale === 'ar' ? l.ar : l.en}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-text-muted sm:flex-row">
          <span>© {year} Nasij. {locale === 'ar' ? 'كل الحقوق محفوظة.' : 'All rights reserved.'}</span>
          <span>{locale === 'ar' ? 'صنع في مصر' : 'Made in Egypt'}</span>
        </div>
      </div>
    </footer>
  );
};
