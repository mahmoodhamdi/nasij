import type { Locale } from './locales.js';

const localeTag = (locale: Locale): string => (locale === 'ar' ? 'ar-EG' : 'en-US');

export const formatCurrency = (
  amountMinorUnits: number,
  options: { locale: Locale; currency?: string; minorUnitExponent?: number } = { locale: 'ar' },
): string => {
  const currency = options.currency ?? 'EGP';
  const minorUnitExponent = options.minorUnitExponent ?? 2;
  const value = amountMinorUnits / 10 ** minorUnitExponent;
  return new Intl.NumberFormat(localeTag(options.locale), {
    style: 'currency',
    currency,
    minimumFractionDigits: minorUnitExponent,
    maximumFractionDigits: minorUnitExponent,
  }).format(value);
};

export const formatNumber = (value: number, locale: Locale, fractionDigits = 0): string =>
  new Intl.NumberFormat(localeTag(locale), {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);

export const formatDate = (
  value: Date | number | string,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
): string => new Intl.DateTimeFormat(localeTag(locale), options).format(new Date(value));

export const formatRelativeTime = (
  fromMs: number,
  toMs: number,
  locale: Locale,
): string => {
  const diffSeconds = Math.round((toMs - fromMs) / 1000);
  const formatter = new Intl.RelativeTimeFormat(localeTag(locale), { numeric: 'auto' });
  const abs = Math.abs(diffSeconds);
  if (abs < 60) return formatter.format(diffSeconds, 'second');
  if (abs < 3600) return formatter.format(Math.round(diffSeconds / 60), 'minute');
  if (abs < 86_400) return formatter.format(Math.round(diffSeconds / 3600), 'hour');
  if (abs < 2_592_000) return formatter.format(Math.round(diffSeconds / 86_400), 'day');
  if (abs < 31_536_000) return formatter.format(Math.round(diffSeconds / 2_592_000), 'month');
  return formatter.format(Math.round(diffSeconds / 31_536_000), 'year');
};
