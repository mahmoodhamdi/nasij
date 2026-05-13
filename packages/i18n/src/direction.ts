import type { Locale } from './locales.js';

export type Direction = 'rtl' | 'ltr';

const RTL_LOCALES: ReadonlySet<Locale> = new Set<Locale>(['ar']);

export const directionFor = (locale: Locale): Direction => (RTL_LOCALES.has(locale) ? 'rtl' : 'ltr');

export const isRtl = (locale: Locale): boolean => directionFor(locale) === 'rtl';
