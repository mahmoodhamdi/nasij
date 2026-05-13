import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { directionFor } from '@nasij/i18n';

import '../globals.css';

import { requireLocale } from '~/lib/i18n.js';

export const metadata: Metadata = {
  title: { default: 'Nasij — Considered clothing', template: '%s · Nasij' },
  description: 'Slow-made staples for the season ahead.',
  metadataBase: new URL(process.env['NEXT_PUBLIC_SITE_URL'] ?? 'http://localhost:3000'),
};

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

const RootLayout = async ({ children, params }: LayoutProps) => {
  const { locale: localeParam } = await params;
  const locale = requireLocale(localeParam);
  const dir = directionFor(locale);

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;

export const generateStaticParams = () => [{ locale: 'ar' }, { locale: 'en' }];
