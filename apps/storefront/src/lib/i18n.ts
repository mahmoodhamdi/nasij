import { notFound } from 'next/navigation';

import {
  type Locale,
  type Namespace,
  type TranslateOptions,
  isLocale,
  translate as translateRaw,
} from '@nasij/i18n';
import arCatalog from '@nasij/i18n/catalogs/ar';
import enCatalog from '@nasij/i18n/catalogs/en';

const catalogs = {
  ar: arCatalog,
  en: enCatalog,
} as const;

export const requireLocale = (value: string | undefined): Locale => {
  if (!isLocale(value)) {
    notFound();
  }
  return value;
};

export const getTranslator = (locale: Locale) => {
  const catalog = catalogs[locale];
  return (namespace: Namespace, key: string, options?: TranslateOptions): string =>
    translateRaw(catalog, namespace, key, options);
};

export type Translator = ReturnType<typeof getTranslator>;
