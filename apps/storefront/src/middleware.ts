import { type NextRequest, NextResponse } from 'next/server';

import { defaultLocale, isLocale, locales } from '@nasij/i18n';

const LOCALE_RE = /^\/(ar|en)(\/|$)/;

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  if (LOCALE_RE.test(pathname)) {
    return NextResponse.next();
  }
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const acceptLanguage = request.headers.get('accept-language') ?? '';
  const preferred = acceptLanguage
    .split(',')
    .map((part) => part.split(';')[0]?.trim().slice(0, 2) ?? '')
    .find((tag) => isLocale(tag));

  const locale = preferred && locales.includes(preferred) ? preferred : defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
};

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\.).*)'],
};
